# YoHoH — Logging & Diagnostics Roadmap

**Document status:** Analysis + roadmap for the project's logging, telemetry, and crash-diagnostic surface. Promoted to a top-level priority because **silent failures** have repeatedly burned playtest time — most recently the "Start Sailing silent-fail" bug (gold-below-supplies disabled the button, swallowed the click, and produced *zero* feedback through any channel). Pattern: bugs survive longer than they should because nothing tells the player *or the developer* what just went wrong.
**Last updated:** 2026-05-18
**Companion docs:** [Improvements.md](Improvements.md) (general code quality), [Sailing_Improvements.md](Sailing_Improvements.md) (voyage UX — §7 documents the silent-fail investigation that motivated this doc), [Battle_Improvements.md](Battle_Improvements.md), [Charting_Improvements.md](Charting_Improvements.md), [Port_Improvements.md](Port_Improvements.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Scope: any code path that emits a message, toast, console warning, error, telemetry event, or save-trace. Covers the existing `DebugOverlay` and the proposed `Logger` / event-stream / crash-dump / replay layer above it.

> **Phase L1 + L2 landed (2026-05-18):** Foundation + Log UI overhaul ships in one push.
>
> **L1 (foundation):** New `src/utils/Logger.js` with full §0 compliance — integer-level early-return fast path (zero allocation when disabled), closure-form message support, pre-allocated ring-buffer MemorySink with in-place object reuse, RAF-batched OverlaySink, debounced LocalStorageSink with quota-recovery + page-hide flush. Four runtime-toggle paths wired: `?log=…` URL param, DebugOverlay dropdowns + `Shift+1..5` shortcuts, `log.setLevel` / `log.setPreset` JS-console API, and `localStorage` persistence across reloads. `GAME.logging.preset` config block. Legacy hooks bridged. Migration done across Game / MapUI / OverworldScene / EconomySystem / saveSystem. See §8.
>
> **L2 (Log UI overhaul):** DebugOverlay refactored from a single-column scroll into a **tabbed panel** — State / Events / Ledger / Config. Events tab gets a filter bar (level threshold + category chips with counts + text search), pause/auto-scroll toggles, expandable `data` payloads via `<details>`, level-coloured chips. Ledger tab gets summary strip + table view + CSV/JSON export. Config tab consolidates the Logger preset / sink / category controls from L1. Tab key cycles tabs when overlay is focused. See §9 for the design + §8 for landed items. **What's deferred to L3:** true virtualisation (current cap is 500 rendered rows), resize handle, drag-to-reposition, click-row-to-pause.

---

## 0. Non-negotiable constraints

These two constraints anchor every other decision in this doc. If a proposed feature can't honour them, it doesn't ship.

### 0.1 🔴 Zero measurable impact on the game's state machine

The logger must be safe to call from every hot path in the codebase — `Game._loop`, `SailingSystem._applyControls`, `CombatSystem.update`, `Renderer.updateCombat`, the per-frame state-machine dispatch — without any of them slowing down. Concretely:

- **Disabled levels are free.** A `log.trace('sailing', ...)` call when the `sailing` category's level is `info` or above does **zero work**: no string concatenation, no array push, no object allocation, no sink dispatch. The fast path is one integer comparison + early return.

  ```js
  // ENABLED path (must allocate at most one event object):
  log.info('voyage', 'departed', { from, to });

  // DISABLED path (must allocate NOTHING):
  log.trace('sailing', 'frame', { speed: ship.speed });  // skipped entirely
  ```

- **No string template work on the cold path.** The Logger accepts either `(category, messageString, data?)` *or* `(category, messageFn, data?)` where `messageFn` is a 0-arg closure. When the closure form is used, the function is **only invoked if the level is enabled**, so expensive `JSON.stringify` / template-literal evaluation never runs while disabled.

  ```js
  // Bad — string concatenation always runs:
  log.trace('combat', `enemy ${e.id} dist=${dist} angle=${angle}`);

  // Good — closure only fires when level is enabled:
  log.trace('combat', () => `enemy ${e.id} dist=${dist} angle=${angle}`);
  ```

  We provide both forms because cheap fixed strings should stay one-liners; expensive payloads use the closure form.

- **No per-frame allocations in the memory sink.** The in-memory ring buffer is a **fixed-size pre-allocated array** (default 2048 entries). Writes overwrite the oldest slot (`buf[i++ % N] = event`) — no `Array.push`, no resize, no shift. Each event object is reused too: when the sink overwrites slot N, it mutates the existing object's fields in place rather than allocating a new one.

- **No synchronous DOM work on log.** The DebugOverlay sink batches writes via `requestAnimationFrame` — `log.info(...)` only appends to an internal pending list; the actual textContent update happens once per RAF, regardless of how many events fired that frame.

- **LocalStorage writes are debounced.** Persistent sink writes batch on a 1-2 second timer (or on `pagehide` / `beforeunload`). Never synchronous on a `log` call.

- **State-machine transitions never block on logging.** `Game._transitionState(next, reason?)` calls `log.info('state', ...)` but the log call is fire-and-forget — it does not await sinks, never throws, and is wrapped in a try/catch so a misbehaving sink can't break the state machine itself.

**Performance test gate**: before any Logger change merges, run a 5-minute autopilot voyage with `trace` level enabled across **all** categories and verify the per-frame `frameMs` distribution doesn't shift by more than 0.5 ms relative to the same run with logging disabled. If it shifts, the path that's allocating gets fixed before merge.

### 0.2 🔴 Easily toggleable between debug levels — at runtime, without reload

A developer (or curious player) must be able to flip log levels **while the game is running**, per-category, without reloading the page or editing config files. Multiple paths to do it:

- **DebugOverlay panel** (`` ` `` to toggle the overlay): a per-category dropdown with the five levels (`trace` / `debug` / `info` / `warn` / `error`) + a master "everything" / "errors only" preset row at the top. Picking a level applies immediately on the next call. Settings persist to `localStorage` so the next page load keeps your config.

- **Keyboard shortcuts** (while overlay is visible): `Shift+1` → all `error`, `Shift+2` → all `warn`, `Shift+3` → all `info`, `Shift+4` → all `debug`, `Shift+5` → all `trace`. Fast tuning during a repro session.

- **URL parameters**: `?log=trace` boosts everything to trace; `?log=sailing:debug,combat:trace` is per-category. Parsed at boot before any other log call. Useful for sharing a "reproduce my issue at this verbosity" link.

- **JS console** (always available in DevTools): `log.setLevel('sailing', 'trace')`, `log.setLevel('*', 'warn')`. The global `log` reference is exported on `window` in dev builds.

- **Settings modal** (player-facing): one switch — "Verbose diagnostics" — that flips the whole stack between the production default (`warn`) and `info` (state transitions visible). Players who hit a bug can enable it, reproduce, and download the dump.

**Defaults** (the production baseline):
- Console sink: `warn` — only failures + errors hit the browser console
- Overlay sink: `debug` — when the overlay is opened, you see state transitions + warnings + errors
- Memory ring buffer: `info` — enough context for a meaningful crash dump without burning RAM
- LocalStorage sink: `warn` — only persist what's worth recovering across reloads

A single `GAME.logging.preset = 'production' | 'developer' | 'silent' | 'verbose'` knob in config.js sets all four at once for common cases; per-sink / per-category overrides are layered on top.

---

---

## 1. Current state (2026-05-18)

| Surface | What it does | What it can't do |
|---|---|---|
| **`DebugOverlay`** (`` ` `` to toggle) | Live state in 4 sections (Game / Overworld / Ship / Sailing) + rolling 20-line event log; Copy / Download as `.txt`; pipes `console.warn` / `console.error` / `window.error` / `unhandledrejection` | Closed by default (player has to know the hotkey); single log stream with no level / category; 20-line ring buffer drops history fast; no persistent store across reloads |
| **`window.__yohohDebugLog(msg)`** | Globalish hook used by `MapUI`, `OverworldScene` etc. to push entries without importing `DebugOverlay` | String-only; no structure; no level; nothing routes it anywhere else |
| **`mapUI.showToast(msg, type)`** | Player-facing transient notifications | Doesn't persist to the log; some failure paths skip the toast (was the root cause of the Start Sailing silent-fail) |
| **`console.warn` / `console.error`** | Browser DevTools view + piped into DebugOverlay | Most players never open DevTools; piping is one-way (overlay doesn't expose console-level structure) |
| **`GAME.devCheats.logSaves`** flag | Toggle to print save/load events to the console | Unused — defaults `false`, never read |
| **Voyage / combat event queues** (Sailing §3.5, Battle §2.11) | Structured event objects drained by Game | Each subsystem invented its own queue + dispatcher; no shared schema |

In short: the **raw data is mostly there**, but it scatters across half a dozen channels with no shared shape, no levels, no categories, no persistence, and (most importantly) **no guarantee that a player-visible failure also leaves a developer-readable trace**.

---

## 2. Why this is a priority

Every silent-fail bug we've shipped has cost the same kind of debugging session:

| Bug | Time to identify | Root cause was visible in… |
|---|---|---|
| Ship-not-moving on hold-W (sailing friction = 0.55) | ~1h diagnostic build + user screenshot | Eventually surfaced in the debug overlay's Ship section — but only after we built that section to expose `friction` |
| Main menu unclickable | ~30 min trial-and-error | Pointer-events; nothing in any log |
| Port tab buttons did nothing | ~20 min | `INFAMY` ReferenceError mid-render swallowed silently (panel never re-rendered, no toast, no console) |
| Start Sailing button does nothing | (would have been long) | Disabled button drops click events *before* any logger sees them — the player got zero feedback by design |

Each one would have been a 5-minute investigation if the failure had produced a structured log entry visible to either the player (toast) or the developer (overlay / dump). Investing in logging now pays back the next time we, or a player, hits a weird edge case.

---

## 3. Goals

1. **Every failure produces a trace.** No silent `return false`, no swallowed exception, no `disabled`-button-drops-the-click. If the game refuses to do what the player asked, the player sees *why* and the developer can replay the diagnostic.
2. **One canonical Logger** with levels (`trace` / `debug` / `info` / `warn` / `error`), categories (`game`, `sailing`, `combat`, `port`, `map`, `save`, `crew`, `render`, `input`, `audio`), and structured (object) payloads — not just `console.log`-style strings.
3. **Multiple sinks behind one front-end**: DebugOverlay, in-memory ring buffer (longer than current 20), localStorage (last N sessions), downloadable JSON dump, optional remote endpoint stub for future analytics.
4. **Always-on minimum**, opt-in verbose. Production play with the overlay closed still records `info+` events to the ring buffer so a crash dump is meaningful.
5. **State-machine + system events emitted automatically.** Every `state` flip, every save attempt, every voyage / combat / port event, every uncaught exception, every fetch — all logged with no per-site boilerplate.
6. **Crash-recovery flow.** Uncaught error / unhandled rejection / debug-only assertion → modal with the recent log, a copy button, and a download button. Player can paste it into a bug report; developer gets context.
7. **Replay capability (stretch).** Recorded inputs + seed → deterministic playback. Mostly useful for reproducing rare bugs from a player's downloaded log.

---

## 4. Concrete proposed items

Each item targets one of the goals above. Effort: S (≤1h), M (≤3h), L (significant). Impact: 🔴 unblocks debugging right now / 🟠 noticeably improves dev velocity / 🟡 polish / 🟢 future-facing.

### 4.1 Foundation

| # | Item | Effort | Impact | Status |
|---|---|---|---|---|
| 1 | **`src/utils/Logger.js`** — new module exporting `log.trace/debug/info/warn/error(category, msgOrFn, data?)`. Routes to all registered sinks. Honours §0.1: integer-level early-return fast path, closure-form message support, zero allocation when disabled. Sinks: ConsoleSink (DevTools), OverlaySink (DebugOverlay, RAF-batched), MemorySink (pre-allocated ring buffer with in-place mutation, default 2048), LocalStorageSink (debounced batch writes, last N events across sessions). | M | 🔴 | ✅ |
| 2 | **Migrate existing call sites** — every `console.warn` / `console.error` / `window.__yohohDebugLog` / `debug?.log` call swapped to `log.<level>('<category>', msg, data)`. Hot-path call sites (`Game._loop`, `SailingSystem._applyControls`, `CombatSystem.update`, etc.) use the closure form for any expensive payload. Backward-compat shim for `window.__yohohDebugLog` (delegates to `log.debug('legacy', msg)`). | M | 🔴 | ✅ (high-traffic; full sweep deferred to L2 audit) |
| 3 | **Runtime-toggleable level config** (§0.2) — `GAME.logging.preset` ∈ `{ production / developer / silent / verbose }` + per-sink / per-category overrides. `log.setLevel(category, level)` + `log.setPreset(name)` mutate live state, no reload needed. `?log=trace` or `?log=sailing:debug,combat:trace` URL params parsed at boot. `localStorage` persists user-set levels across reloads. | M | 🔴 | ✅ |
| 4 | **DebugOverlay category + level controls** — per-category dropdown of the 5 levels, master preset row at the top, `Shift+1..5` keyboard shortcuts. Live update — changing a level applies on the next log call without restart. Counts per category shown so spammy ones are obvious. | M | 🟠 | ✅ |
| 4b | **Perf gate** — add a small `npm run logging-perf-check` script (or document the manual procedure) that runs a fixed-length autopilot voyage with all categories at `trace` and reports the frame-time delta vs the same run at `silent`. Acceptance: ≤ 0.5 ms shift. CI-style gate before any future Logger change merges. | S | 🟠 | ⏳ |

### 4.2 Automatic event sources

| # | Item | Effort | Impact |
|---|---|---|---|
| 5 | **State-machine transitions** — central `Game._transitionState(next, reason?)` helper that logs every `OVERWORLD → SAILING → COMBAT → PORT` flip with the trigger. All existing `this.state = GAME_STATES.X` calls route through it. | S | 🟠 |
| 6 | **Voyage + combat event mirror** — the existing `voyageEvents` / `combatEvents` queues already have structured payloads. Game's dispatchers also `log.info('voyage', ...)` so the events persist in the log even if the player misses the toast. | S | 🟠 |
| 7 | **Save / load tracing** — `saveSystem` already has a status enum; promote `GAME.devCheats.logSaves` from "console-only" to "use Logger." Capture schema version, save size in KB, time taken. | S | 🟡 |
| 8 | **Fetch instrumentation** — `loadGoods` / `lore.json` / future map JSON loads go through a `loggedFetch(url, label)` helper that logs request start / response status / parse errors. | S | 🟡 |
| 9 | **Input event recorder** — log keypress / click events at `trace` level when enabled. Foundation for §4.5 replay. | M | 🟢 |
| 10 | **Performance metrics** — every N frames push `{ fps, frameMs, drawCalls?, projectileCount, enemyCount }` at `debug`. Spikes (frameMs > 33) emit `warn`. | S | 🟡 |

### 4.3 Failure-channel completeness

| # | Item | Effort | Impact |
|---|---|---|---|
| 11 | **Audit every `return false`** — script-assisted scan of the codebase for early `return false` / `return null` paths in user-facing methods; require each to emit at least `log.info('<category>', 'reason')`. | M | 🔴 |
| 12 | **Standardise on `{ ok, reason, detail }` for can-fail operations** — generalise the `startTravel` pattern from the silent-fail fix. Add a small `Result.fail(reason, detail)` / `Result.ok(value)` helper. | M | 🟠 |
| 13 | **Banned-patterns lint check** — pre-commit or a script that flags raw `console.warn(`, `console.error(`, `console.log(` calls in `src/` (allowing only the Logger sinks). Forces all output through the canonical pipe. | S | 🟡 |
| 14 | **HTML `disabled`-button audit** — same pattern: a disabled button drops the click. Add a small "always-clickable, toast-on-can't-afford" pattern + lint rule. (The Start Sailing fix is the prototype.) | S | 🟠 |

### 4.4 Crash + diagnostics surface

| # | Item | Effort | Impact |
|---|---|---|---|
| 15 | **Crash modal** — on uncaught error / unhandled rejection in a production build, show a modal: short summary, "Copy log to clipboard" / "Download .json" buttons, "Try to continue" / "Reload" buttons. Existing `window.error` / `unhandledrejection` listeners already feed the log; this just adds the surface. | M | 🔴 |
| 16 | **State snapshot dump** — `dumpGameState()` returns a JSON-serialisable object with player gold / ship / crew / current island / map ID / recent log entries. Wired to a button in DebugOverlay AND included in every crash modal payload. | S | 🟠 |
| 17 | **Diagnostic share link / ticket helper** — Copy button produces a single text block formatted for pasting into a bug-report form: env (browser / OS / window size / dpr), build hash, recent state, recent log, last 100 input events. | M | 🟡 |
| 18 | **In-game console (dev cheat)** — small REPL panel below the DebugOverlay, gated behind `GAME.devCheats.consoleEnabled`. Evaluates JS in the game's scope so devs can hot-poke `game._playerGold = 1000`, etc. Risk: foot-guns; keep behind a feature flag. | M | 🟢 |

### 4.5 Replay + telemetry (stretch)

| # | Item | Effort | Impact |
|---|---|---|---|
| 19 | **Deterministic input replay** — `Game` records `{ tick, dt, keys, mouseEvents, rngSeed }` per frame. Replay path drives `Input` from the recording instead of the DOM. Needs the existing RNG to be seedable across map / encounter generation — half-done already (`SeededRNG`). | L | 🟢 |
| 20 | **Player-anonymous telemetry stub** — `Logger` exposes a `RemoteSink` interface that defaults to no-op. Future analytics endpoint can subscribe to `info+` `gameplay` events (sail counts, combat W/L, port spend). Opt-in via Settings. | M | 🟢 |
| 21 | **Time-travel snapshots** — periodic full-state checkpoints (e.g. one per state transition + one per minute) kept in a ring of 10. DebugOverlay button to "load checkpoint N" — bisect when a bug appeared. | L | 🟢 |

---

## 5. Recommended order of attack

Phases are ordered so each phase delivers visible developer value before the next one starts.

### Phase L1 — Foundation (one focused session, items 1-4)
- New `Logger.js` with levels + categories + sinks.
- Migrate all existing logging sites.
- Default config + URL-param boost.
- Category filter in DebugOverlay.

Outcome: every existing log message keeps working, but now categorised and filterable.

### Phase L2 — Auto-event surface (items 5, 6, 11, 14)
- State-machine logger.
- Voyage + combat event mirror.
- Audit + fix the remaining silent `return false` paths.
- Audit + fix any other `disabled`-button traps.

Outcome: the **next** "Start Sailing silent-fail"-class bug is impossible to ship — every failure leaves a trace.

### Phase L3 — Crash surface (items 15, 16, 17)
- Crash modal with state snapshot.
- Standalone state snapshot button.
- Bug-report-friendly diagnostic dump format.

Outcome: when a player hits a bug, we get a usable bug report by default.

### Phase L4 — Polish + stretch (items 7-10, 12, 13, 18-21)
- Save tracing, fetch instrumentation, perf metrics.
- Result helper + lint check.
- In-game console.
- Replay + telemetry + time-travel.

Outcome: full diagnostic toolkit.

---

## 6. Compatibility + cleanup

When the new Logger lands, these existing channels become aliases:
- `window.__yohohDebugLog(msg)` → `log.debug('legacy', msg)` (keeps existing call sites working during migration)
- `debug?.log(msg)` (the `DebugOverlay.log` method) → internal `MemorySink` write
- `console.warn` / `console.error` interception stays (catches third-party + browser noise), but those go through `log.warn('console', ...)` so they're categorised
- The voyage / combat event queues stay (they're game-logic queues that *also* get mirrored to the log — they're not a replacement for it)

`GAME.devCheats.logSaves` becomes a shortcut for `log.level('save') = 'debug'`.

---

## 7. Open design questions

1. ~~**Production default**~~ **Answered:** see §0.2 defaults — console `warn`, overlay `debug`, memory `info`, localStorage `warn`. Single-knob `GAME.logging.preset` chooses between production / developer / silent / verbose presets.
2. **LocalStorage cap**: last 500 entries? 1000? 2000? Needs to balance quota safety against meaningfulness of a cross-reload crash dump. Probably 500 for production, configurable for developer preset.
3. **PII**: ship class, island names, gold totals are all gameplay state — fine to log. If we ever add named save files / cloud sync, log redaction becomes important.
4. **Remote endpoint**: if/when we add analytics, opt-in or opt-out by default? Opt-in is more respectful; opt-out gives more data. (Probably opt-in given indie scope.)
5. **Replay determinism**: requires RNG to be threaded through every random call. Half done (`SeededRNG` for map generation); combat / encounter timing currently uses `Math.random()` ad-hoc. Significant refactor for replay to actually work end-to-end.
6. **Log format**: pure JSON for machine-parsing? Plaintext for human-friendliness? Both, with the dump button switching? (Probably "both": memory is structured, dump can render either.)
7. **Closure-form ergonomics**: do we make `log.trace('cat', fn)` the *recommended* style for everything (always lazy) or only when the message is expensive to build? Probably "only when expensive" — single fixed strings are cheap to allocate and the closure overhead would be net-negative for them. Document the rule of thumb in the Logger module header.

These are tagged for a future design sweep.

---

## 9. Log UI overhaul (new priority — 2026-05-18)

The L1 Logger has the right *plumbing* but the current `DebugOverlay` UI was built before the Logger existed — it's a single-column scroll of text with no filter, no search, no virtualised list, no tabs, no resize. As soon as the player turns on `info`-level logging, the event log overwhelms the live state sections. The level-control panel I added in L1 fixes the worst gap (you couldn't toggle levels before) but it doesn't fix the **viewing experience** of the events themselves.

### 9.1 What's wrong today

| Pain | Symptom |
|---|---|
| Fixed top-left position | If your UI of interest is in the top-left (it almost always is — minimap, mode line, etc.), the overlay covers it. |
| Fixed max-width (420 px) | A medium-length log line wraps to 3 lines. With 20-line cap that's 7 events visible. |
| 20-line ring buffer | The MemorySink ring is now 2048 entries but the DOM overlay still only renders the most recent 20. Most history is invisible. |
| Single column | Live state + event log + level controls all stack. To see the log you have to scroll past all the live data. |
| No filter | Set `info` everywhere and a single voyage produces 30+ entries. No way to isolate by category, level, or text. |
| No search | Looking for "supplies" requires eyeballing the whole list. |
| No pause | Log auto-scrolls. Trying to inspect an entry that just fired is a race against the next entry pushing it out. |
| No expand | `log.warn('save', 'failed', { schemaVersion: 2, expected: 3 })` shows just the message; the `{ schemaVersion: 2, ... }` payload is hidden until you Copy + paste into a JSON viewer. |
| Not closeable while inspecting | `` ` `` toggles visibility — there's no way to *minimise* without losing your filter/scroll state. |
| Can't move it | If it's covering your problem area, you have to close it. |
| Mobile / small viewport | Untouched; usable but not great. |

### 9.2 Target redesign

A tabbed overlay panel — same `` ` `` toggle to show/hide, but the layout reorganises around what you're inspecting:

```
┌─ ╳ ─ DEBUG (drag handle) ──────────────────────────────────┐
│ [State] [Events 142] [Ledger 38] [Config]                  │  ← tab bar with counts
├────────────────────────────────────────────────────────────┤
│ [filter: level=debug ▾] [cat: all ▾] [search: ___] [⏸ ⬇]  │  ← contextual filter bar
├────────────────────────────────────────────────────────────┤
│                                                            │
│   <virtualised event list / live state grid /              │
│    ledger table / level controls — depending on tab>       │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ Copy ▸ Download ▸ Clear ▸ Snapshot                         │  ← shared actions
└────────────────────────────────────────────────────────────┘
                                                ◢  ← resize
```

**Tabs:**
- **State** — the current live-state grid (Game / Overworld / Ship / Sailing sections). Same as today but isolated from the log scroll.
- **Events** — virtualised scrollable list of Logger events. Color-coded by level. Click a row to expand the `data` payload. Filter bar on top (level / category / text). Pause + auto-scroll toggles.
- **Ledger** — the new transaction ledger (Ledger_Improvements.md). Table view with column filters (Time / Type / Category / Source / Δ / Balance / State). Summary strip at top. CSV / JSON export.
- **Config** — the level controls + sink dropdowns + preset buttons that today live above everything.

**Window behaviour:**
- Drag the title bar to reposition (top-left / top-right / bottom-left / bottom-right snap zones for one-click docking).
- Drag the bottom-right corner to resize. Width and height saved to `localStorage`.
- Tabs preserve their scroll position across tab switches.
- `` ` `` toggles the entire overlay; tab + filter state survives close/reopen.

**Events tab specifics:**
- Virtualised list — renders only visible rows so 2000-entry buffer doesn't tank scroll fps.
- Each row: timestamp + level chip (colour-coded) + category chip + message + (▶ if data exists).
- Click ▶ to expand inline pretty-printed JSON of `data`.
- Filter bar: level dropdown (≥ N), category multi-select (with counts), text search (matches message + data fields).
- Pause button: stops new entries from auto-appearing (the buffer still grows; pause is purely visual). Useful for inspecting without the list jumping.
- Auto-scroll toggle: when off, the list stays where you scrolled; when on, new entries bring you to bottom.

### 9.3 Implementation items

| # | Item | Effort | Impact | Status |
|---|---|---|---|---|
| 30 | **Tabbed DebugOverlay shell** — State / Events / Ledger / Config tabs. Per-tab scroll state preservation. Shared actions footer. | M | 🔴 | ✅ |
| 31 | **Events tab list** — color-coded level chips, expandable `data` payload via `<details>`. Cap at 500 rendered rows for now; full virtualisation in L3. | M | 🔴 | ✅ (partial — no true virtualisation yet) |
| 32 | **Filter bar** — level threshold dropdown, category chips with counts (multi-select), text search across msg + data. | M | 🔴 | ✅ |
| 33 | **Pause + auto-scroll controls** — pause halts visual updates without dropping data; auto-scroll toggle. | S | 🟠 | ✅ |
| 34 | **Resize handle** — drag bottom-right; width/height persist. | S | 🟠 | ⏳ |
| 35 | **Drag-to-reposition + snap zones** — title bar drag; snap to 4 corners. Position persists. | M | 🟡 | ⏳ |
| 36 | **Ledger tab** — table view + summary strip + CSV/JSON export. | M | 🟠 | ✅ |
| 37 | **Click-category-to-filter** — click any category chip in the Events tab to add it as a filter. | S | 🟡 | ✅ (chips toggle in Events; cross-tab click-to-filter deferred) |
| 38 | **Click-row-to-pause** — clicking a row pauses auto-scroll AND highlights the row. | S | 🟡 | ⏳ |
| 39 | **Tab key cycles tabs while overlay focused** — bonus UX nicety. | S | 🟢 | ✅ |

### 9.4 Phasing into the existing Phase L roadmap

- **Phase L1 ✅ (landed)** — Foundation Logger + bridges + level controls.
- **Phase L2 ✅ (landed 2026-05-18)** — Items #30, #31 (partial — no true virtualisation), #32, #33, #36, #37 (chips only), #39. Tabbed shell + filter bar + pause/auto-scroll + Ledger tab. The L1 panel was indeed becoming unusable at info+; L2 fixed the worst of it.
- **Phase L3 (next)** — True virtualisation for #31, items #34, #35 (resize / drag-reposition + persistence), #38 (click-row-to-pause).
- **Phase L4 (stretch)** — Crash modal + state snapshot dump + everything else from §4.4 / §4.5.

---

## 8. Phase L1 landing notes (2026-05-18)

### New module: `src/utils/Logger.js`

- 5 integer levels (`silent=0` / `error=1` / `warn=2` / `info=3` / `debug=4` / `trace=5`) — `LEVEL` enum exported.
- Hot path on a disabled `log.<level>(cat, …)` call: **one object-property lookup + one integer compare + return**. Zero allocation. The closure form (`log.trace(cat, () => …)`) means expensive payloads only build when the level fires.
- Sinks (`ConsoleSink` / `OverlaySink` / `MemorySink` / `LocalStorageSink`) implement `{ name, level, write(event), flush?, shutdown? }`. Each sink dispatch is wrapped in try/catch so a misbehaving sink can't throw into the caller (state machine stays safe).
- `MemorySink` uses a fixed pre-allocated array (default 2048). Writes mutate the slot in place — no `Array.push`, no resize, no per-frame GC pressure. `snapshot()` returns oldest-first defensive shallow copies.
- `OverlaySink` queues writes into a `_pending` list and schedules one `requestAnimationFrame` per "wave" — DOM updates batch to one per frame regardless of how many log calls fired.
- `LocalStorageSink` debounces writes (1500 ms default) + flushes on `pagehide` / `beforeunload`. Quota-exceeded errors halve the buffer and retry once.
- Recompute cache (`_enabled[category] ?? _defaultEnabled`) re-derived only on level / sink changes.

### Bootstrapping

`Game._initLogger()` runs once during `Game.init`:
1. Registers four sinks.
2. Applies `GAME.logging.preset` (default `developer`).
3. Restores any persisted levels from `localStorage` (`yohoh-log-levels`).
4. Applies `?log=…` URL overrides if present.
5. Bridges legacy `window.__yohohDebugLog` and intercepts `console.warn` / `.error` / `window.error` / `unhandledrejection` so external noise also lands in the pipe.
6. Attaches the Logger to the `DebugOverlay` so the level-control panel renders.
7. Wires `pagehide` + Logger `onChange` to `persistLogLevels` so user-set levels survive reloads.

### Runtime-toggle entry points (all live, no reload)

- **DebugOverlay panel** (`` ` `` to open): preset buttons + per-sink dropdowns + per-category counts with click-to-override.
- **Shift+1..5** while the overlay is visible: master switch (`error` / `warn` / `info` / `debug` / `trace`) across all sinks; clears category overrides.
- **URL param** `?log=trace` or `?log=sailing:debug,combat:trace` — parsed at boot.
- **JS console** (`window.log` is exposed): `log.setLevel('sailing', 'trace')`, `log.setPreset('verbose')`, `log.describe()`.

### Migration done (high-traffic call sites)

- `Game.js` — voyage event handlers, autopilot keybinds (engage/disengage/override/manual/snap), `_startSailing` (every silent-fail path), state-transition logs at the encounter/victory/defeat boundaries
- `MapUI.js` — `_onStartSailing` (the silent-fail entry point that started this whole investigation)
- `OverworldScene.js` — `startTravel` (all 4 reason codes), `loadMap` error
- `EconomySystem.js` — goods.json fetch failure
- `saveSystem.js` — every persist / parse / quota / schema-mismatch / delete path

The remaining `console.warn` / `console.error` / `console.log` calls anywhere in the codebase still route through the Logger (via the interception bridge in `_initLogger`) — they just show up under the `console` category rather than their natural subsystem. A follow-up sweep can re-tag them in L2.

### What's NOT yet done

| Item | Why deferred |
|---|---|
| §4.1 #4b — Perf-check script | Needs an autopilot voyage harness with a controlled fps measurement; manual procedure documented for now. Real script in L4. |
| §4.2 #5 — `Game._transitionState(next, reason)` central helper | Only a few key transitions are logged inline; a generic helper is L2 work. |
| §4.2 #11 — Audit every `return false` | Scoped to L2. |
| §4.3 #12 — Generic `Result.ok/fail` helper | Only `startTravel` uses the structured `{ ok, reason }` pattern today; generic helper is L4. |
| §4.4 — Crash modal, state snapshot, share format | L3. |
| Everything in §4.5 — replay / telemetry / time-travel | L4 stretch. |
