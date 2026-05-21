/**
 * YoHoH — Transaction Ledger
 *
 * Player-economic audit trail. Distinct from the diagnostic `Logger`:
 *   - Logger captures developer events (state transitions, fetch errors, etc).
 *   - Ledger captures *economic* events the player cares about — gold flow,
 *     cargo flow, crew hires/losses, ship-state bookmarks, upgrade purchases.
 *
 * Every entry is immutable. Corrections happen as new offsetting entries,
 * not edits. Same in-place ring-buffer + debounced LocalStorage pattern as
 * the Logger so writes stay cheap on the hot path.
 *
 * See Ledger_Improvements.md for full design + source vocabulary.
 */

import { TYPE, CATEGORY, SOURCE, SOURCE_TO_CATEGORY, ALL_SOURCES } from './LedgerSources.js';
import { log } from './Logger.js';

export { TYPE, CATEGORY, SOURCE };

const STORAGE_KEY = 'yohoh-ledger';
const SESSIONS_KEY = 'yohoh-ledger-sessions';

class Ledger {
  constructor(opts = {}) {
    this.bufferSize = opts.bufferSize ?? 4096;
    this.persistSize = opts.persistSize ?? 1000;       // most recent N per session in localStorage
    this.maxSessions = opts.maxSessions ?? 5;          // most recent N sessions retained
    this.debounceMs  = opts.debounceMs ?? 2000;        // localStorage write debounce

    // Pre-allocated ring buffer of entry objects — written in place.
    this.buf = new Array(this.bufferSize);
    for (let i = 0; i < this.bufferSize; i++) {
      this.buf[i] = this._blankEntry();
    }
    this._idx = 0;       // next write slot
    this.count = 0;      // total writes (capped by bufferSize for indexing)
    this._nextId = 1;

    // Session id — stable for the life of the Ledger instance.
    this.sessionId = opts.sessionId ?? `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    // Listeners — UI panels subscribe to be notified of new entries.
    this._listeners = new Set();

    // Persist state.
    this._dirtyTimer = null;

    // Tally rolled forward across writes for fast snapshot() reads.
    this._tally = { goldDelta: 0, infamyDelta: 0, gainCount: 0, spendCount: 0 };

    // Restore prior sessions index (for cross-session queries / cleanup).
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      this._sessionsIndex = raw ? JSON.parse(raw) : [];
    } catch (_) { this._sessionsIndex = []; }

    // Flush on page hide so the tail of the session isn't lost.
    if (typeof window !== 'undefined') {
      this._onPageHide = () => this.flush();
      window.addEventListener('pagehide', this._onPageHide);
      window.addEventListener('beforeunload', this._onPageHide);
    }
  }

  _blankEntry() {
    return {
      id: 0, ts: 0, sessionId: '',
      type: '', category: '', source: '',
      delta: 0, balance: 0,
      context: null, state: '',
    };
  }

  // ─── Record API ────────────────────────────────────────────────────────

  /**
   * Record one economic transaction. In-place ring write; no allocation
   * beyond the (defensive) context shallow copy.
   *
   * @param {Object} entry
   * @param {string} entry.type      — one of TYPE.*
   * @param {string} entry.source    — one of SOURCE.*
   * @param {string} [entry.category] — auto-derived from source if omitted
   * @param {number} [entry.delta]   — signed change (default 0)
   * @param {number} [entry.balance] — post-mutation balance / count
   * @param {Object} [entry.context] — free-form per-source metadata
   * @param {string} [entry.state]   — game state when fired
   */
  record(entry) {
    if (!entry || !entry.type || !entry.source) {
      log.warn('ledger', 'record() called without type/source', entry);
      return null;
    }
    const slot = this.buf[this._idx];
    slot.id = this._nextId++;
    slot.ts = Date.now();
    slot.sessionId = this.sessionId;
    slot.type = entry.type;
    slot.category = entry.category ?? SOURCE_TO_CATEGORY[entry.source] ?? 'system';
    slot.source = entry.source;
    slot.delta = entry.delta ?? 0;
    slot.balance = entry.balance ?? 0;
    // Defensive shallow copy of context — caller's reference must not be retained
    // because the ring slot will be overwritten when the buffer wraps.
    slot.context = entry.context ? { ...entry.context } : null;
    slot.state = entry.state ?? '';

    this._idx = (this._idx + 1) % this.bufferSize;
    if (this.count < this.bufferSize) this.count++;

    // Roll the running tally for fast snapshot()s.
    if (slot.type === TYPE.GOLD) {
      this._tally.goldDelta += slot.delta;
      if (slot.delta > 0) this._tally.gainCount++;
      else if (slot.delta < 0) this._tally.spendCount++;
    } else if (slot.type === TYPE.INFAMY) {
      this._tally.infamyDelta += slot.delta;
    }

    this._notify(slot);
    this._scheduleFlush();

    log.debug('ledger', () => `${slot.type}/${slot.source} Δ${slot.delta >= 0 ? '+' : ''}${slot.delta} bal=${slot.balance}`, slot.context);
    return slot.id;
  }

  // ─── Query ─────────────────────────────────────────────────────────────

  /**
   * Filter entries. All filters are AND'd. Returns oldest-first defensive
   * copies — callers may freely mutate / sort the result.
   *
   * @param {Object} q
   * @param {string[]} [q.types]      — restrict to these entry types
   * @param {string[]} [q.categories] — restrict to these categories
   * @param {string[]} [q.sources]    — restrict to these sources
   * @param {number}   [q.since]      — only entries with ts >= since
   * @param {number}   [q.until]      — only entries with ts <= until
   * @param {string}   [q.search]     — substring match on source / type / stringified context
   * @param {string}   [q.sessionId]  — restrict to one session (omit = current session only; '*' = all)
   * @param {number}   [q.limit]      — max number of results (most recent N)
   */
  query(q = {}) {
    const types = q.types ? new Set(q.types) : null;
    const cats  = q.categories ? new Set(q.categories) : null;
    const srcs  = q.sources ? new Set(q.sources) : null;
    const search = q.search ? String(q.search).toLowerCase() : null;
    const since = q.since ?? -Infinity;
    const until = q.until ?? Infinity;
    const wantSession = q.sessionId === '*' ? null : (q.sessionId ?? this.sessionId);
    const out = [];

    // Iterate chronologically (oldest-first).
    if (this.count === 0) return out;
    const start = this.count < this.bufferSize ? 0 : this._idx;
    for (let i = 0; i < this.count; i++) {
      const slot = this.buf[(start + i) % this.bufferSize];
      if (wantSession && slot.sessionId !== wantSession) continue;
      if (types && !types.has(slot.type)) continue;
      if (cats  && !cats.has(slot.category)) continue;
      if (srcs  && !srcs.has(slot.source)) continue;
      if (slot.ts < since || slot.ts > until) continue;
      if (search) {
        const haystack = `${slot.type} ${slot.source} ${slot.category} ${slot.context ? JSON.stringify(slot.context) : ''}`.toLowerCase();
        if (!haystack.includes(search)) continue;
      }
      out.push({ ...slot, context: slot.context ? { ...slot.context } : null });
    }
    if (q.limit && out.length > q.limit) {
      return out.slice(out.length - q.limit);
    }
    return out;
  }

  /** Aggregate summary over a range. */
  summary(q = {}) {
    const entries = this.query(q);
    let goldGained = 0, goldSpent = 0, infamyGained = 0, infamySpent = 0;
    const byCategory = {};
    const bySource = {};
    for (const e of entries) {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + 1;
      bySource[e.source] = (bySource[e.source] ?? 0) + 1;
      if (e.type === TYPE.GOLD) {
        if (e.delta > 0) goldGained += e.delta;
        else goldSpent += -e.delta;
      } else if (e.type === TYPE.INFAMY) {
        if (e.delta > 0) infamyGained += e.delta;
        else infamySpent += -e.delta;
      }
    }
    return {
      total: entries.length,
      goldGained, goldSpent, goldNet: goldGained - goldSpent,
      infamyGained, infamySpent, infamyNet: infamyGained - infamySpent,
      byCategory, bySource,
    };
  }

  /** Current totals + counts without query overhead. */
  snapshot() {
    return {
      sessionId: this.sessionId,
      total: this.count,
      goldDelta: this._tally.goldDelta,
      infamyDelta: this._tally.infamyDelta,
      gainCount: this._tally.gainCount,
      spendCount: this._tally.spendCount,
    };
  }

  // ─── Export ────────────────────────────────────────────────────────────

  /** CSV export of filtered entries. Returns a plain string. */
  exportCsv(q = {}) {
    const entries = this.query(q);
    const cols = ['id', 'ts', 'sessionId', 'type', 'category', 'source', 'delta', 'balance', 'state', 'context'];
    const lines = [cols.join(',')];
    for (const e of entries) {
      const row = cols.map(col => {
        let v = col === 'context' ? (e.context ? JSON.stringify(e.context) : '') : e[col];
        if (v == null) v = '';
        v = String(v);
        if (v.includes(',') || v.includes('"') || v.includes('\n')) {
          v = `"${v.replace(/"/g, '""')}"`;
        }
        return v;
      });
      lines.push(row.join(','));
    }
    return lines.join('\n');
  }

  /** Pretty-printed JSON of filtered entries. */
  exportJson(q = {}) {
    return JSON.stringify(this.query(q), null, 2);
  }

  // ─── Persistence ───────────────────────────────────────────────────────

  _scheduleFlush() {
    if (this._dirtyTimer != null) return;
    this._dirtyTimer = setTimeout(() => this.flush(), this.debounceMs);
  }

  /** Write the most-recent `persistSize` entries to localStorage. */
  flush() {
    if (this._dirtyTimer != null) { clearTimeout(this._dirtyTimer); this._dirtyTimer = null; }
    try {
      // Persist last N entries for this session.
      const recent = this.query({ sessionId: this.sessionId, limit: this.persistSize });
      const key = `${STORAGE_KEY}:${this.sessionId}`;
      localStorage.setItem(key, JSON.stringify(recent));
      // Update session index — most-recent first; drop oldest beyond maxSessions.
      if (!this._sessionsIndex.includes(this.sessionId)) {
        this._sessionsIndex.unshift(this.sessionId);
        if (this._sessionsIndex.length > this.maxSessions) {
          const drop = this._sessionsIndex.splice(this.maxSessions);
          for (const old of drop) {
            try { localStorage.removeItem(`${STORAGE_KEY}:${old}`); } catch (_) {}
          }
        }
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(this._sessionsIndex));
      }
    } catch (e) {
      // Quota exceeded — halve persistSize and retry once.
      this.persistSize = Math.max(50, Math.floor(this.persistSize / 2));
      log.warn('ledger', 'flush failed, halving persistSize', { newSize: this.persistSize, err: String(e) });
      try {
        const recent = this.query({ sessionId: this.sessionId, limit: this.persistSize });
        localStorage.setItem(`${STORAGE_KEY}:${this.sessionId}`, JSON.stringify(recent));
      } catch (_) { /* give up */ }
    }
  }

  /** Returned entries are from PERSISTED sessions on disk (not the live ring). */
  loadSession(sessionId) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}:${sessionId}`);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }

  listSessions() {
    return this._sessionsIndex.slice();
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────

  /** Drop the current session's runtime ring (keeps persisted history). */
  clear() {
    for (let i = 0; i < this.bufferSize; i++) this.buf[i] = this._blankEntry();
    this._idx = 0;
    this.count = 0;
    this._tally = { goldDelta: 0, infamyDelta: 0, gainCount: 0, spendCount: 0 };
    this.flush();
    this._notify(null);
  }

  /** Drop everything — runtime ring + persisted sessions. */
  clearAll() {
    this.clear();
    try {
      for (const sid of this._sessionsIndex) {
        localStorage.removeItem(`${STORAGE_KEY}:${sid}`);
      }
      localStorage.removeItem(SESSIONS_KEY);
    } catch (_) {}
    this._sessionsIndex = [];
  }

  // ─── Listeners ─────────────────────────────────────────────────────────
  onChange(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); }
  _notify(entry) { for (const fn of this._listeners) { try { fn(entry, this); } catch (_) {} } }

  // ─── Diagnostic ────────────────────────────────────────────────────────
  describe() {
    return {
      sessionId: this.sessionId,
      bufferSize: this.bufferSize,
      count: this.count,
      persistSize: this.persistSize,
      sessions: this._sessionsIndex.slice(),
      tally: { ...this._tally },
    };
  }
}

// Singleton instance — same pattern as the Logger.
export const ledger = new Ledger();

if (typeof window !== 'undefined') {
  window.ledger = ledger;
}
