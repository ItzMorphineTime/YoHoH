/**
 * YoHoH — Logger
 *
 * Canonical structured-logging surface for the project. Honours
 * Logging_Improvements.md §0 (non-negotiable constraints):
 *
 * §0.1 — ZERO impact on the state machine when disabled
 *   - Levels are integers, not strings. Comparison is one CPU instruction.
 *   - The fast path on a disabled log call does NOTHING — no string build,
 *     no allocation, no sink dispatch. One object-property lookup + one
 *     integer compare + return.
 *   - When the level IS enabled, the message can be passed as a closure
 *     (`log.trace('cat', () => `expensive ${stringify(x)}`)`) — the closure
 *     is only invoked when the level passes the check.
 *   - Memory sink uses a pre-allocated ring buffer with in-place object
 *     reuse. No `Array.push`, no resize, no per-frame GC pressure.
 *   - DOM sinks (DebugOverlay) batch writes via requestAnimationFrame —
 *     one DOM update per frame regardless of how many log calls fired.
 *   - LocalStorage writes are debounced (1.5 s + pagehide flush).
 *   - All sinks are wrapped in try/catch on dispatch so a misbehaving
 *     sink cannot break the caller (especially the state machine).
 *
 * §0.2 — Levels are RUNTIME-TOGGLEABLE, no reload required
 *   - `log.setLevel(category, level)` — per-category override, takes effect
 *     on the next call.
 *   - `log.setSinkLevel(sinkName, level)` — per-sink override.
 *   - `log.setPreset(name)` — one of 'silent' | 'production' | 'developer' | 'verbose'.
 *   - URL params: `?log=trace` (global) or `?log=sailing:debug,combat:trace`
 *     (per-category) parsed at boot before any other log call.
 *   - Levels persist to localStorage so user-set verbosity survives reloads.
 *
 * Usage:
 *
 *   import { log } from './utils/Logger.js';
 *
 *   // Cheap fixed-string form — string is always built, but it's just a literal.
 *   log.info('voyage', 'Setting sail');
 *
 *   // Expensive payload form — closure only invoked if the level fires.
 *   log.trace('combat', () => `enemy ${e.id} dist=${dist} angle=${angle}`);
 *
 *   // Structured data — third arg is preserved on the event for sinks / dumps.
 *   log.warn('save', 'Schema mismatch', { found: 2, expected: 3 });
 *
 *   // Error with auto-captured stack — pass the Error as the data arg.
 *   log.error('input', 'Failed to bind key handler', err);
 */

// ─── Levels ────────────────────────────────────────────────────────────────
// Integer constants so the hot path compares ints, not strings.
// HIGHER int = MORE verbose (trace is the chattiest).

export const LEVEL = Object.freeze({
  silent: 0,  // emit nothing (used as a sink threshold)
  error:  1,
  warn:   2,
  info:   3,
  debug:  4,
  trace:  5,
});

const LEVEL_NAMES = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];

export function levelName(n) {
  return LEVEL_NAMES[n] ?? `lvl${n}`;
}

export function parseLevel(s, fallback = LEVEL.info) {
  if (typeof s === 'number') return s;
  const v = LEVEL[String(s).toLowerCase()];
  return v == null ? fallback : v;
}

// ─── Presets ───────────────────────────────────────────────────────────────
// `GAME.logging.preset` maps to a default level per sink.

export const PRESETS = Object.freeze({
  silent:     { console: LEVEL.silent, overlay: LEVEL.silent, memory: LEVEL.silent, localStorage: LEVEL.silent },
  production: { console: LEVEL.warn,   overlay: LEVEL.debug,  memory: LEVEL.info,   localStorage: LEVEL.warn },
  developer:  { console: LEVEL.warn,   overlay: LEVEL.debug,  memory: LEVEL.debug,  localStorage: LEVEL.info },
  verbose:    { console: LEVEL.info,   overlay: LEVEL.trace,  memory: LEVEL.trace,  localStorage: LEVEL.info },
});

// ─── Sinks ─────────────────────────────────────────────────────────────────
// All sinks implement `{ name, level, write(event), flush?(), shutdown?() }`.
// The Logger guarantees `write(event)` only fires when `event.level <= sink.level`.

/** Default fallback — `console.warn` / `.error` (DevTools). */
export class ConsoleSink {
  constructor(level = LEVEL.warn) {
    this.name = 'console';
    this.level = level;
  }
  write(event) {
    // Map level → console method. info/debug/trace all go to console.log
    // (most browsers don't visually distinguish them).
    const method = event.level === LEVEL.error ? 'error'
                 : event.level === LEVEL.warn  ? 'warn'
                 : 'log';
    // Build a prefix once; payload data is passed as an extra arg so DevTools
    // renders it as an inspectable object.
    const prefix = `[${LEVEL_NAMES[event.level]}/${event.category}]`;
    if (event.data !== undefined) {
      console[method](prefix, event.msg, event.data);
    } else {
      console[method](prefix, event.msg);
    }
  }
}

/**
 * Writes to the existing DebugOverlay via its `log(msg)` method.
 * RAF-batches to keep DOM writes off the hot path — even at trace+everything
 * the overlay updates at most once per animation frame, not per log call.
 */
export class OverlaySink {
  constructor(debugOverlay, level = LEVEL.debug) {
    this.name = 'overlay';
    this.level = level;
    this._overlay = debugOverlay;
    this._pending = [];
    this._rafId = null;
  }
  write(event) {
    // Cheap: push a short string into a pending list, schedule a RAF if
    // none is already scheduled. The actual DOM call happens once per frame.
    const ts = event.ts;
    const t = ((ts / 1000) % 100).toFixed(2);
    const line = `${t}s [${LEVEL_NAMES[event.level][0].toUpperCase()}/${event.category}] ${event.msg}`;
    this._pending.push(line);
    if (this._rafId == null && typeof requestAnimationFrame === 'function') {
      this._rafId = requestAnimationFrame(() => this._flush());
    }
  }
  _flush() {
    this._rafId = null;
    if (this._pending.length === 0 || !this._overlay?.log) return;
    // Drain — one DOM write per frame regardless of count.
    for (const line of this._pending) this._overlay.log(line);
    this._pending.length = 0;
  }
  flush() { if (this._rafId == null) this._flush(); }
}

/**
 * Pre-allocated ring buffer. Writes mutate in place — no GC pressure on
 * the hot path. `snapshot()` returns oldest-first events for dumps.
 */
export class MemorySink {
  constructor(size = 2048, level = LEVEL.info) {
    this.name = 'memory';
    this.level = level;
    this.size = size;
    this.buf = new Array(size);
    for (let i = 0; i < size; i++) {
      this.buf[i] = { level: 0, category: '', msg: '', data: null, ts: 0 };
    }
    this._idx = 0;
    this.count = 0;
  }
  write(event) {
    // In-place mutation — zero allocation.
    const slot = this.buf[this._idx];
    slot.level = event.level;
    slot.category = event.category;
    slot.msg = event.msg;
    slot.data = event.data;
    slot.ts = event.ts;
    this._idx = (this._idx + 1) % this.size;
    if (this.count < this.size) this.count++;
  }
  /** Snapshot of events in chronological order (oldest first). */
  snapshot() {
    if (this.count === 0) return [];
    const out = new Array(this.count);
    const start = this.count < this.size ? 0 : this._idx;
    for (let i = 0; i < this.count; i++) {
      const slot = this.buf[(start + i) % this.size];
      // Defensive shallow copy — caller must not retain a reference into the
      // ring (or their data will be overwritten by future writes).
      out[i] = { level: slot.level, category: slot.category, msg: slot.msg, data: slot.data, ts: slot.ts };
    }
    return out;
  }
  /** Drop everything. */
  clear() {
    this._idx = 0;
    this.count = 0;
  }
}

/**
 * Persists recent events across reloads. Writes are debounced so calling
 * `log.warn(...)` rapidly doesn't hit localStorage on every call.
 */
export class LocalStorageSink {
  constructor(opts = {}) {
    this.name = 'localStorage';
    this.level = opts.level ?? LEVEL.warn;
    this.key = opts.key ?? 'yohoh-log';
    this.maxEntries = opts.maxEntries ?? 500;
    this.debounceMs = opts.debounceMs ?? 1500;
    this._pending = [];
    this._timer = null;
    // Load any existing entries from previous sessions for context — but
    // don't fail catastrophically if storage is full / unavailable.
    try {
      const raw = localStorage.getItem(this.key);
      this._stored = raw ? JSON.parse(raw) : [];
    } catch (_) { this._stored = []; }
    // Flush on page hide so we don't lose the tail of a session.
    if (typeof window !== 'undefined') {
      this._beforeUnload = () => this.flush();
      window.addEventListener('pagehide', this._beforeUnload);
      window.addEventListener('beforeunload', this._beforeUnload);
    }
  }
  write(event) {
    // Strip non-serialisable data fields before persisting.
    this._pending.push({
      level: event.level,
      category: event.category,
      msg: String(event.msg ?? ''),
      data: this._safeData(event.data),
      ts: event.ts,
    });
    if (this._timer == null) {
      this._timer = setTimeout(() => this.flush(), this.debounceMs);
    }
  }
  _safeData(d) {
    if (d == null) return null;
    if (d instanceof Error) return { name: d.name, message: d.message, stack: d.stack };
    try { JSON.stringify(d); return d; } catch (_) { return String(d); }
  }
  flush() {
    if (this._timer != null) { clearTimeout(this._timer); this._timer = null; }
    if (this._pending.length === 0) return;
    const merged = this._stored.concat(this._pending);
    this._pending.length = 0;
    // Trim to maxEntries — keep the newest.
    this._stored = merged.length > this.maxEntries ? merged.slice(-this.maxEntries) : merged;
    try {
      localStorage.setItem(this.key, JSON.stringify(this._stored));
    } catch (e) {
      // Quota exceeded — halve the buffer and retry once.
      this._stored = this._stored.slice(-Math.floor(this.maxEntries / 2));
      try { localStorage.setItem(this.key, JSON.stringify(this._stored)); } catch (_) {}
    }
  }
  snapshot() { return this._stored.slice(); }
  clear() {
    this._stored = [];
    this._pending.length = 0;
    try { localStorage.removeItem(this.key); } catch (_) {}
  }
  shutdown() {
    this.flush();
    if (typeof window !== 'undefined' && this._beforeUnload) {
      window.removeEventListener('pagehide', this._beforeUnload);
      window.removeEventListener('beforeunload', this._beforeUnload);
    }
  }
}

// ─── Logger ────────────────────────────────────────────────────────────────

/**
 * Singleton Logger. Use the exported `log` instance.
 *
 * The hot path on a disabled log call is:
 *   1. `const t = this._enabled[cat] ?? this._defaultEnabled;`  // one lookup
 *   2. `if (levelInt > t) return;`                              // one compare
 * Total: ~2 instructions, zero allocations.
 *
 * Re-resolved when sinks are added/removed or levels change.
 */
class Logger {
  constructor() {
    this.sinks = [];
    // Per-category overrides. Maps category → max level the user wants from THIS category.
    // `undefined` means "no override — defer to per-sink levels".
    this._categoryOverrides = {};
    // Resolved effective max-enabled-level per category (cached for fast lookup).
    this._enabled = {};
    // Default when no category-specific entry exists — max of sink levels.
    this._defaultEnabled = 0;
    // Per-category counts (for the overlay UI).
    this.counts = {};
    // Listeners — UI panels can subscribe to be notified of config changes.
    this._listeners = new Set();
  }

  // ─── Sink management ────────────────────────────────────────────────────
  addSink(sink) {
    if (!sink) return;
    this.sinks.push(sink);
    this._recompute();
  }
  removeSink(nameOrSink) {
    const idx = this.sinks.findIndex(s => s === nameOrSink || s.name === nameOrSink);
    if (idx >= 0) this.sinks.splice(idx, 1);
    this._recompute();
  }
  getSink(name) { return this.sinks.find(s => s.name === name) ?? null; }

  // ─── Level management (runtime-toggleable) ──────────────────────────────
  setLevel(category, level) {
    const n = parseLevel(level, LEVEL.info);
    if (category === '*' || category == null) {
      // Apply to every sink (not category override — clears category overrides too).
      for (const s of this.sinks) s.level = n;
      this._categoryOverrides = {};
    } else {
      this._categoryOverrides[category] = n;
    }
    this._recompute();
    this._notify();
  }
  setSinkLevel(sinkName, level) {
    const n = parseLevel(level, LEVEL.info);
    const sink = this.getSink(sinkName);
    if (!sink) return;
    sink.level = n;
    this._recompute();
    this._notify();
  }
  setPreset(name) {
    const p = PRESETS[name];
    if (!p) return false;
    for (const [sinkName, lvl] of Object.entries(p)) {
      const sink = this.getSink(sinkName);
      if (sink) sink.level = lvl;
    }
    this._currentPreset = name;
    this._recompute();
    this._notify();
    return true;
  }
  getPreset() { return this._currentPreset ?? null; }
  getCategoryOverride(category) { return this._categoryOverrides[category] ?? null; }
  clearCategoryOverrides() {
    this._categoryOverrides = {};
    this._recompute();
    this._notify();
  }

  // ─── Subscribe / notify ────────────────────────────────────────────────
  onChange(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); }
  _notify() { for (const fn of this._listeners) { try { fn(this); } catch (_) {} } }

  // ─── Recompute fast-path threshold cache ────────────────────────────────
  _recompute() {
    let max = 0;
    for (const s of this.sinks) if (s.level > max) max = s.level;
    this._defaultEnabled = max;
    this._enabled = {};
    for (const [cat, ovr] of Object.entries(this._categoryOverrides)) {
      // Effective threshold = min(category override, max sink level)
      this._enabled[cat] = Math.min(ovr, max);
    }
  }

  // ─── Hot path emit ─────────────────────────────────────────────────────
  // Inlined branchless-ish for V8. KEEP THIS FUNCTION SMALL.
  _emit(level, category, msgOrFn, data) {
    const t = this._enabled[category] ?? this._defaultEnabled;
    if (level > t) return; // ← cold path — nothing allocated
    // Slow path. The level IS enabled for at least one sink.
    const msg = typeof msgOrFn === 'function' ? msgOrFn() : msgOrFn;
    // Single event allocation per call (re-used by MemorySink's in-place write).
    const event = { level, category, msg, data, ts: Date.now() };
    // Dispatch to each sink that wants this level.
    for (let i = 0; i < this.sinks.length; i++) {
      const sink = this.sinks[i];
      if (level <= sink.level) {
        try { sink.write(event); } catch (e) {
          // Never let a misbehaving sink throw into the caller.
          try { console.error('[Logger] sink failed', sink.name, e); } catch (_) {}
        }
      }
    }
    this.counts[category] = (this.counts[category] ?? 0) + 1;
  }

  // ─── Public log API ────────────────────────────────────────────────────
  trace(cat, msg, data) { this._emit(LEVEL.trace, cat, msg, data); }
  debug(cat, msg, data) { this._emit(LEVEL.debug, cat, msg, data); }
  info (cat, msg, data) { this._emit(LEVEL.info,  cat, msg, data); }
  warn (cat, msg, data) { this._emit(LEVEL.warn,  cat, msg, data); }
  error(cat, msg, data) { this._emit(LEVEL.error, cat, msg, data); }

  // ─── Diagnostic helpers ────────────────────────────────────────────────
  /** Is `level` currently enabled for `category`? Useful for skipping expensive payload prep. */
  isEnabled(category, level) {
    const t = this._enabled[category] ?? this._defaultEnabled;
    return parseLevel(level, LEVEL.info) <= t;
  }
  /** Flush all sinks (e.g. before a download / crash modal). */
  flush() { for (const s of this.sinks) try { s.flush?.(); } catch (_) {} }
  /** Snapshot of the memory sink, oldest-first. */
  snapshot() {
    const mem = this.getSink('memory');
    return mem?.snapshot?.() ?? [];
  }
  /** Currently-resolved category → max enabled level map (debug helper). */
  describe() {
    return {
      preset: this.getPreset(),
      sinks: this.sinks.map(s => ({ name: s.name, level: LEVEL_NAMES[s.level] })),
      categoryOverrides: Object.fromEntries(
        Object.entries(this._categoryOverrides).map(([k, v]) => [k, LEVEL_NAMES[v]]),
      ),
      defaultEnabled: LEVEL_NAMES[this._defaultEnabled],
      counts: { ...this.counts },
    };
  }
}

export const log = new Logger();

// ─── Bootstrap helpers (called by Game.init) ───────────────────────────────

/**
 * Parse `?log=...` URL params. Accepts either a single level (`?log=trace`)
 * or per-category `?log=sailing:debug,combat:trace,save:warn`.
 * Returns an array of edits; the caller applies them after sinks are registered.
 */
export function parseLogUrlParam(search = (typeof location !== 'undefined' ? location.search : '')) {
  if (!search) return null;
  const m = search.match(/[?&]log=([^&]+)/);
  if (!m) return null;
  const raw = decodeURIComponent(m[1]);
  if (raw.includes(':')) {
    return raw.split(',').map(p => {
      const [cat, lvl] = p.split(':');
      return { category: cat.trim(), level: parseLevel(lvl) };
    });
  }
  return [{ category: '*', level: parseLevel(raw) }];
}

const PERSISTED_LEVELS_KEY = 'yohoh-log-levels';

/** Save current level config to localStorage so the next reload restores it. */
export function persistLogLevels(logger = log) {
  try {
    const data = {
      preset: logger.getPreset(),
      sinks: Object.fromEntries(logger.sinks.map(s => [s.name, s.level])),
      categoryOverrides: { ...logger._categoryOverrides },
    };
    localStorage.setItem(PERSISTED_LEVELS_KEY, JSON.stringify(data));
  } catch (_) {}
}

/** Restore level config from localStorage (call after sinks are registered). */
export function restoreLogLevels(logger = log) {
  try {
    const raw = localStorage.getItem(PERSISTED_LEVELS_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.preset) logger.setPreset(data.preset);
    if (data.sinks) {
      for (const [name, lvl] of Object.entries(data.sinks)) {
        const sink = logger.getSink(name);
        if (sink) sink.level = lvl;
      }
    }
    if (data.categoryOverrides) {
      logger._categoryOverrides = { ...data.categoryOverrides };
    }
    logger._recompute();
    return true;
  } catch (_) { return false; }
}

// Expose on window for the dev console — gated by being in a browser env.
if (typeof window !== 'undefined') {
  window.log = log;
}
