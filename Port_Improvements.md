# YoHoH — Port / Docked Interface Improvements

**Document status:** Analysis & roadmap for the Port screen UX, the Crew Management extraction, and surrounding code smells.
**Last updated:** 2026-05-16
**Companion docs:** [Improvements.md](Improvements.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Tracks Port-specific issues: bugs, UX gaps, structural improvements, and the planned crew-panel extraction so crew can be micro-managed during sailing and combat.

> **Progress (2026-05-16):** First pass complete — §1.1 / §1.2 / §1.3 (bugs), §4.4 (audit), §5 (Crew extraction — main user ask), §3.2 / §3.3 / §3.4 / §3.5 / §3.6 / §3.8 (UX gaps), §4.2 (active tab persistence). See ticks below. §4.1 (PortUI split) and §4.3 (diff DOM) are deferred — both large refactors that risk regression after the substantial UX changes just landed.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Bug / blocker — user-facing functionality broken |
| 🟠 | High-priority UX issue |
| 🟡 | Medium — refactor or polish |
| 🟢 | Nice-to-have / forward-compat |

---

## 1. Bugs found during review

### 1.1 🔴 `INFAMY` referenced but never imported in `PortUI.js`  ✅
**Where:** [src/ui/PortUI.js:232-235](src/ui/PortUI.js)

**Symptom:** Inside `update()`, the ship-class dropdown block reads `INFAMY?.brigantineUnlock`, `INFAMY?.galleonUnlock`, `INFAMY?.brigantineCost`, `INFAMY?.galleonCost`. The optional-chaining `?.` doesn't help — `INFAMY` itself is `undefined` at module scope, so this throws `ReferenceError: INFAMY is not defined` the moment the Shipwright dropdown updates (i.e. on every port entry, since `update()` runs once on `show()`).

**Effect:** `update()` aborts mid-way through. Anything below line 232 (ship comparison, repairs, market) is never populated. Combined with §1.2 below, this is the primary reason the user sees "nothing happens" on entering port.

**Fix:** Add `INFAMY` to the existing `config.js` import on line 6.

### 1.2 🔴 `.port-panel` has no CSS — tab clicks don't visually switch panels  ✅
**Where:** [index.html:780-788](index.html) (only `.port-tabs button.active` is styled — no rule for `.port-panel` or `.port-panel.active`).

**Symptom:** `_setTab(tab)` toggles `.active` on both the tab button **and** the matching `.port-panel`. The button styles update correctly (line 788). But there's no `.port-panel { display: none }` or `.port-panel.active { display: block }`. All three panels render simultaneously, stacked. Clicking the tabs changes which one has the `.active` class — but nothing visibly changes because all are equally visible.

**Effect:** This is the user-facing complaint — "Tavern/Shipwright/Market buttons don't do anything." They actually do; it's the panels that don't respond.

**Fix:** Add CSS:
```css
.port-panel { display: none; }
.port-panel.active { display: block; }
```

### 1.3 🟠 Duplicated `island` const in `update()`  ✅
**Where:** [src/ui/PortUI.js:127, 376](src/ui/PortUI.js)

`const island = portScene.getCurrentIsland()` is declared at line 127 and then `const island = portScene.getCurrentIsland?.() ?? null` is declared again inside the market block at line 376 — shadows the outer. Harmless but smells. Remove the inner one and reuse the outer.

### 1.4 🟠 Settings dropdown click handler wired before HTML element exists in init order
**Where:** [src/ui/PortUI.js:40-44](src/ui/PortUI.js)

Inside `init()`, the ship-class `<select>` has a `change` listener attached immediately. That's fine because the element exists in the static HTML. But `update()` later `innerHTML = …` replaces the entire `<select>`'s **contents** (lines 268-273) — not the element itself — so the listener survives. Currently OK, but if `update()` ever replaces the whole `<select>` node (e.g. during a refactor), the handler would die silently. Add a comment guarding the invariant.

### 1.5 🟢 Tab button click handlers wired before HTML is in the DOM tree?
**Where:** [src/ui/PortUI.js:28-58](src/ui/PortUI.js)

`init()` runs once at Game.init time. The port-overlay HTML is static (already in `index.html`), so `getElementById('port-overlay')` succeeds. Click handlers attach correctly. No issue today — but a future refactor that lazily injects port HTML would break this. Worth a code comment.

---

## 2. Current architecture (as it stands)

| Layer | File | Lines | Responsibility |
|-------|------|-------|----------------|
| Data | `src/scenes/PortScene.js` | 238 | Mutable port state: crew, gold, cargo, ship state, upgrades, infamy. Owns buy/sell/repair/hire/serveRum mutations. |
| Controller | `src/controllers/PortController.js` | 146 | Glues UI events → PortScene mutations → UI refresh. Owns infamy gating for ship-class purchases. |
| View | `src/ui/PortUI.js` | 419 | Monolithic — owns Tavern, Shipwright, Market tabs + the tab switcher. Builds large `innerHTML` blocks per `update()`. |
| HTML | `index.html#port-overlay` | (~60) | Static markup for header, tabs, three panels. |
| CSS | `index.html` `<style>` | (~80 port-specific) | Layout + chip/button styling. **Missing** `.port-panel` display rules. |

**Strengths:**
- PortScene is a clean data layer with pure-ish mutations (no DOM access).
- PortController already mediates between UI callbacks and player state — good separation.
- Static HTML for the overlay means no dynamic injection — easy to inspect.

**Weaknesses:**
- PortUI.update() rebuilds ~5 large `innerHTML` blocks (roster, station overview, upgrades, ship comparison, market list) every time it runs. With the §1.3 fix from Improvements.md, that's now only on event-triggered refreshes (good) — but it's still wasteful for low-volume changes (e.g. hiring one crew member redraws the entire market).
- Tavern, Shipwright, Market live in one class. Splitting along the natural data boundaries would be straightforward.
- The Crew Management panel is locked to "docked at port" — no way to reassign stations during sailing or combat (the user's main request).

---

## 3. UX gaps (in priority order)

### 3.1 🟠 Crew Management is locked to "Docked" state  ✅
**Status:** Done — see §5 below.

### 3.2 🟠 Port screen has no "exit confirmation" or quick-leave keyboard shortcut feedback  ✅
**Status:** Done. First Esc primes the Leave Port button (label changes to "Press Esc again to leave" + amber styling); second Esc within 1.5s actually leaves. Esc-to-cancel after 1.5s reverts.

### 3.3 🟠 No visual progression indicators  ✅
**Status:** Done. Persistent status strip above the tabs shows hull, sails, morale, and cargo as labelled gradient bars + numeric readouts. Strip updates on every `PortUI.update()` and persists across all three tabs.

*Follow-up:* Infamy progress bar towards next ship-class unlock (e.g. "3.2 / 5 → Galleon") is still pending — tracked as a separate enhancement.

### 3.4 🟡 Tab content scrolls but headers/totals don't stick  ✅
**Status:** Done. `.port-panel-container` is now a flex column; header, status strip, and tabs are `flex-shrink: 0`; only `.port-content` scrolls (`overflow-y: auto; flex: 1 1 auto`). Bottom action log is also fixed below the content area.

### 3.5 🟡 Upgrade slots show all available upgrades inline — no comparison view  ✅
**Status:** Done. Each slot is now a `<details>` collapsed by default showing `slot-name · equipped (or empty) · Browse hint`. Expansion state persists across re-renders via `_expandedSlots: Set<string>`.

### 3.6 🟡 Repair UI doesn't show cost breakdown  ✅
**Status:** Done. Hull/Sails/Leaks Repair buttons now have `title` tooltips like "40 hull pts × 0.5 gold = 20 gold". When fully repaired, the tooltip says "Hull is fully repaired."

### 3.7 🟡 Market: no price-trend signal
**Today:** Each good shows `Buy X / Sell Y` for the current island only. The player has no way to know "is this a good price?" without manually visiting every island.

**Fix:** Track per-island prices the player has seen (in PortScene or a new `MarketMemory`); colour-code current price (green = below historical median, red = above). This is a Phase D-class polish item but should be on the roadmap.

### 3.8 🟢 No history / log of port actions  ✅
**Status:** Done. PortScene tracks a rolling 30-entry `actionLog` (newest first), reset on each port visit. PortController writes entries on hire/dismiss/repair/buy/sell/upgrade/serve-rum with `gain`/`loss`/`info` colour coding. The Activity panel sits below the tabs with a Clear button.

---

## 4. Code-structure improvements

### 4.1 🟡 Split `PortUI.js` (419 lines) into per-tab panels  *(M)* ⏳ DEFERRED
**Status:** Deferred until UX surface settles. A lot of structural change already landed in PortUI/HTML/CSS (Crew extraction, status strip, sticky layout, upgrade expander, action log); splitting now would risk regressions. Re-evaluate after a playtest pass.

Still tracked as the original plan:
- `TavernPanel.js` — crew summary, station overview
- `ShipwrightPanel.js` — ship-class selector, comparison table, upgrades, repairs
- `MarketPanel.js` — cargo summary, goods list
- `PortShell.js` — thin orchestrator: owns `#port-overlay`, header, status strip, tab switching, action log, delegates to panels

### 4.2 🟡 Move tab-switching state to `PortScene`  *(S)*  ✅
**Status:** Done. `_setTab` now also calls `portScene.setActiveTab(tab)` via the cached `_lastPortScene` reference. PortScene's existing `getActiveTab()` is used as a fallback when PortUI has no in-memory `_activeTab` yet.

*Note:* PortScene.init() still resets to 'tavern' on each port entry — that's a separate decision (probably the right one for first-time visit framing). PortUI's in-memory `_activeTab` persists across show/hide of the same PortUI instance, so tab choice survives sailing trips.

### 4.3 🟡 Replace bulk `innerHTML` with diff-based DOM updates  *(M)*  ⏳ DEFERRED
**Status:** Deferred. After the §1.3 fix from Improvements.md (no more per-frame port updates), this is now only a problem during high-frequency mid-sail crew shuffling — and the CrewUI is a separate, simpler DOM tree. Re-evaluate if crew-panel updates feel sluggish in playtest.

### 4.4 🟡 Inline `getRouteModifiers`-style latent imports audit  *(S)*  ✅
**Status:** Done. Audit script run across `src/ui/`, `src/scenes/`, `src/controllers/`, `src/render/`, `src/utils/`. Findings:
- `INFAMY` was the only real bug — already fixed (§1.1).
- `ECONOMY` was imported in `PortController.js` but never used — removed.
- All other flags were script false-positives (config constants whose names collide with local variable names, e.g. `SHIP` as a local).
**Recommended follow-up:** add an ESLint config with `no-undef` + `no-unused-vars` to catch these statically going forward.

### 4.5 🟢 Lazy-load goods list  *(S)*
`getGoods()` returns a possibly-empty array until `loadGoods()` resolves. Currently the market shows "Loading goods…" — fine, but no retry if the fetch fails. Add a `Reload` button + better error state.

---

## 5. ★ Crew Management extraction  ✅

**Goal:** Move crew roster / station assignment / morale view out of the Tavern tab and into a **standalone overlay** that can be opened from any game state.

### 5.0 Status: shipped

| Sub-task | Status |
|---|---|
| `src/ui/CrewUI.js` overlay (~200 lines) | ✅ |
| `src/controllers/CrewController.js` (~80 lines) | ✅ |
| `#crew-overlay` HTML + CSS in `index.html` | ✅ |
| Floating "👥 Crew" toggle button (top-right, hidden on menu / when overlay open) | ✅ |
| K keybind (with input-focus + other-modal guards) | ✅ |
| Esc to close | ✅ |
| State-aware sourcing: reads PortScene when docked, Game `_crewRoster` at sea | ✅ |
| Tavern tab pivoted to summary + "Manage Crew →" button | ✅ |
| Station-effects refresh on every assignment (live during sailing/combat) | ✅ |
| Hire/Dismiss only enabled when at port | ✅ |
| Serve Rum works anywhere with rum in cargo | ✅ |
| Cross-refresh: port actions update CrewUI; crew actions update PortUI | ✅ |
| Save/load semantics unchanged (only roster + assignments persist; overlay open/closed is session-only) | ✅ |

The actual design followed §5.1–§5.8 below verbatim. Original plan retained for reference / future maintainers.

---

### Original plan (for reference)

### 5.1 Scope

| Feature | Currently in PortUI | Moves to CrewUI |
|---------|----|----|
| Crew count + max | ✓ | ✓ |
| Average morale display | ✓ | ✓ |
| Station fill chips ("Helmsman 1/1", "Gunner Port 0/2") | ✓ | ✓ |
| Roster with per-crew station dropdown | ✓ | ✓ |
| **Hire Crew** button | ✓ | Only when docked (gated) |
| **Dismiss** button per crew | ✓ | Only when docked |
| **Serve Rum** button | ✓ | ✓ (works anywhere if rum is in cargo) |

### 5.2 New layer

```
src/ui/CrewUI.js          — overlay rendering + bindings (~200 lines)
src/controllers/
  CrewController.js       — handles assign/dismiss/serveRum/hire requests (~80 lines)
```

The existing `src/systems/CrewSystem.js` continues to own pure crew logic — no changes needed there.

### 5.3 State source

`CrewUI` reads from the live `_crewRoster` (Game) and the player's `_playerCargo` (for rum count). Both already exist on Game. Constructor: `new CrewUI({ host })` where `host` exposes:
- `getCrewRoster() → Crew[]`
- `getShipClassId() → string`
- `getPlayerCargo() → { goodId: qty }`
- `getMaxCrew() → number`
- `getGold() → number` (only relevant in port)
- `isAtPort() → boolean`
- Mutation callbacks: `onAssignStation(crewId, station)`, `onDismissCrew(crewId)`, `onServeRum()`, `onHireCrew()`

This indirection keeps CrewUI decoupled from Game internals and from PortScene.

### 5.4 UI placement

```
HUD strip (existing)
└── [+ Crew button + “K” hint]   ←─ always visible during SAILING / COMBAT
                                   ┐
Main menu / OVERWORLD: keybind only │
                                   ┘
─────────────────────────────────
#crew-overlay (new)                  ←─ floats above HUD; mid-screen panel
  - Header: Crew count, morale bar, Serve Rum
  - Station chips
  - Roster list (scrollable)
  - Hire / Dismiss buttons (disabled when not at port)
  - Close (K or Esc)
```

When opened during COMBAT, the game does **not** pause (intentional pressure). Optional config flag `CREW.pauseWhileOpen` (default false) for accessibility.

### 5.5 Tavern panel — what's left

After extraction, the Tavern tab becomes:
- A summary line ("Crew: 7/10 — Morale 84%") with a **"Manage Crew"** button that opens `#crew-overlay`
- Hire Crew button (port-only action, kept here)
- Serve Rum button (works in port; the overlay also exposes it)
- (Future) Tavern-specific content: rumors, contracts, dragon-hunt hooks (per §15 of IMPLEMENTATION_PLAN.md)

This keeps Tavern's identity as a **port location** (rumors + recruiting), while moving routine management into the always-available overlay.

### 5.6 Implementation order

1. Add `#crew-overlay` HTML to `index.html` (initially hidden)
2. Add `src/ui/CrewUI.js` mirroring the existing crew section of PortUI
3. Add `src/controllers/CrewController.js` (small — most logic delegated to CrewSystem)
4. Wire the K keybind in Game's main update path (state-aware: don't open while big map / settings modal already open)
5. Update PortUI Tavern panel to delegate to CrewUI (or strip the duplicate roster UI entirely)
6. Add a HUD button that opens the same overlay
7. Ensure assign actions during voyage trigger an immediate `Ship.setStationEffects(...)` refresh

### 5.7 Cross-cutting risks

- **Stale references:** if the player dismisses a crew member mid-combat, any references in `_stationEffects` need recomputation. CrewSystem already recomputes per call, so this should "just work" — but we need to **call it** every time an assignment changes. PortController already does this; CrewController must too.
- **Save/load:** the crew overlay state (open/closed) shouldn't persist to save. Only roster + assignments persist (already covered by saveSystem).
- **Pause-during-port:** today the port screen is essentially modal (game time doesn't advance while in PORT state, since nothing updates). The new overlay during sailing is **non-modal** — sailing continues. Make this clear visually (e.g. faint dim, not a full blackout).

### 5.8 Backwards compatibility

- Save format unchanged — crew data already separate from UI state.
- PortController API unchanged — it still exposes `onAssignStation`, `onDismissCrew`, etc. CrewController can either call PortController's methods (when at port) or call the CrewSystem helpers directly (when at sea).

---

## 6. Recommended order of attack

| # | Item | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1 | §1.1 / §1.2 — Fix INFAMY import + add `.port-panel` CSS | S | 🔴 | ✅ |
| 2 | §1.3 — De-duplicate `island` const in `update()` | S | 🟢 | ✅ |
| 3 | §4.4 — Audit other UI files for unimported references | S | 🟠 | ✅ |
| 4 | §5 — **Crew Management extraction** (the user's main ask) | M-L | 🟠 | ✅ |
| 5 | §3.3 — Persistent status strip (hull/sails/morale/cargo) | M | 🟠 | ✅ |
| 6 | §3.4 — Sticky tab headers (flex column + only content scrolls) | S | 🟡 | ✅ |
| 7 | §3.5 — Collapse upgrade slots; `<details>` expand | M | 🟡 | ✅ |
| 8 | §4.2 — Persist active tab via PortScene | S | 🟢 | ✅ |
| 9 | §3.6 — Repair cost-breakdown tooltips | S | 🟢 | ✅ |
| 10 | §3.2 — Esc-twice exit confirmation | S | 🟢 | ✅ |
| 11 | §3.8 — Port action log | S | 🟢 | ✅ |
| 12 | §4.1 — Split `PortUI.js` into per-tab panels | M | 🟡 | ⏳ deferred (re-evaluate after playtest) |
| 13 | §4.3 — Diff-based DOM updates inside panels | M | 🟡 | ⏳ deferred (no longer urgent post-§1.3) |
| 14 | §3.7 — Market price-trend memory | M | 🟢 | ⏳ Phase D |
| 15 | Infamy progress bar towards next ship-class unlock | S | 🟢 | ⏳ (split off from §3.3) |

Each landed item should be ticked here and (if relevant) noted in `Improvements.md` / `IMPLEMENTATION_PLAN.md`.
