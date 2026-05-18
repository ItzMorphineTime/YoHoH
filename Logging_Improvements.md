# YoHoH — Logging & Diagnostics Roadmap

**Document status:** Analysis + roadmap for the project's logging, telemetry, and crash-diagnostic surface. Promoted to a top-level priority because **silent failures** have repeatedly burned playtest time — most recently the "Start Sailing silent-fail" bug (gold-below-supplies disabled the button, swallowed the click, and produced *zero* feedback through any channel). Pattern: bugs survive longer than they should because nothing tells the player *or the developer* what just went wrong.
**Last updated:** 2026-05-18
**Companion docs:** [Improvements.md](Improvements.md) (general code quality), [Sailing_Improvements.md](Sailing_Improvements.md) (voyage UX — §7 documents the silent-fail investigation that motivated this doc), [Battle_Improvements.md](Battle_Improvements.md), [Charting_Improvements.md](Charting_Improvements.md), [Port_Improvements.md](Port_Improvements.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Scope: any code path that emits a message, toast, console warning, error, telemetry event, or save-trace. Covers the existing `DebugOverlay` and the proposed `Logger` / event-stream / crash-dump / replay layer above it.

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

| # | Item | Effort | Impact |
|---|---|---|---|
| 1 | **`src/utils/Logger.js`** — new module exporting `log.trace/debug/info/warn/error(category, message, data?)`. Routes to all registered sinks. Multiple sinks: ConsoleSink (DevTools), OverlaySink (DebugOverlay), MemorySink (ring buffer, configurable size), LocalStorageSink (last N events across sessions). | M | 🔴 |
| 2 | **Migrate existing call sites** — every `console.warn` / `console.error` / `window.__yohohDebugLog` / `debug?.log` call swapped to `log.<level>('<category>', msg, data)`. Backward-compat shim for `window.__yohohDebugLog` (delegates to `log.debug('legacy', msg)`). | M | 🔴 |
| 3 | **Log level config** in `GAME.logging` — `{ console: 'warn', overlay: 'debug', memory: 'info', localStorage: 'warn' }`. Default ships at `warn` for production builds, but `?debug` URL param boosts everything to `trace`. | S | 🟠 |
| 4 | **Category filter UI in DebugOverlay** — checkboxes per category; show counts; quick "isolate one category" double-click. | S | 🟠 |

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

1. **Production default**: ship at `warn` (only failures + errors) or `info` (also state transitions / voyage events)? `info` is more useful for crash reports but produces more memory churn.
2. **Persist log across reloads**: yes (LocalStorageSink) — but cap size aggressively (last 500 entries? 200?) to avoid quota issues. What's the cap?
3. **PII**: ship class, island names, gold totals are all gameplay state — fine to log. If we ever add named save files / cloud sync, log redaction becomes important.
4. **Remote endpoint**: if/when we add analytics, opt-in or opt-out by default? Opt-in is more respectful; opt-out gives more data. (Probably opt-in given indie scope.)
5. **Replay determinism**: requires RNG to be threaded through every random call. Half done (`SeededRNG` for map generation); combat / encounter timing currently uses `Math.random()` ad-hoc. Significant refactor for replay to actually work end-to-end.
6. **Log format**: pure JSON for machine-parsing? Plaintext for human-friendliness? Both, with the dump button switching? (Probably "both": memory is structured, dump can render either.)

These are tagged for a future design sweep.
