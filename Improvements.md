# YoHoH — Code & Architecture Improvements

**Document status:** Living checklist of code-quality, performance, and correctness improvements identified during review.
**Last updated:** 2026-05-16
**Scope:** Main game (`src/`) — POC issues tracked in their own docs.

> **Progress (2026-05-16):**
> - First pass: §1.1, §1.2, §1.3, §1.4, §2.2, §2.3, §2.4, §2.5, §3.2, §4.1, §4.2 ✅
> - Second pass: §2.1, §3.3 (N/A — already shared), §4.3, §4.4, §5.3, §6.1, §6.3, §3.1 (overworld), §5.1 ✅
> - **Latent bugs found & fixed during refactor:**
>   - `getRouteModifiers` / `getPrimaryModifier` were used in `Renderer.js` without being imported (would have thrown for every non-hovered route). Now properly imported in `OverworldRenderer.js`.
>   - **Main menu was completely unclickable.** `#main-menu-overlay` had no CSS at all, so it rendered in normal document flow underneath `#game-container` (which is `position: fixed; inset: 0`). `#game-canvas-layer` with `pointer-events: auto` intercepted every click. Added a full CSS block in `index.html` (positioning, gradient background, z-index 1000, `.hidden` rule, button styling). New Game and Continue now work.

> Each item lists: a short summary, **why** it matters, the **file / line(s)**, a suggested **fix**, and an **effort × impact** estimate.
> Tick items as they're addressed. Add new entries as they're discovered.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | High impact — fixes a bug or significant perf cliff |
| 🟡 | Medium impact — meaningful win for maintenance or perf |
| 🟢 | Low impact — polish, nits, forward-compat |
| Effort | S (≤30 min), M (≤2 hr), L (≥half day) |

---

## 1. Critical bugs & performance cliffs

### 1.1 🔴 Three.js GPU memory leak — overworld view  *(S–M)* ✅
- [x] Pool overworld route/island meshes instead of recreating them every frame.

**Status:** Done. `_owEdgeMeshes` / `_owNodeMeshes` pools use shared unit `PlaneGeometry`/`CircleGeometry` and are scaled+tinted per frame. Outline + current-island ring are single pooled meshes. Pools grow on map change and dispose materials when shrinking.

**Where:** [src/Renderer.js:611-613](src/Renderer.js), [src/Renderer.js:654-680](src/Renderer.js)

**Symptom:** Every frame in `GAME_STATES.OVERWORLD`, `_setupOverworldView` calls `overworldGroup.remove(...)` but never `geometry.dispose()` / `material.dispose()`. Then `_updateOverworldEntities` instantiates fresh `PlaneGeometry`, `CircleGeometry`, `RingGeometry`, and `MeshBasicMaterial` for every edge, every node, and (when selected) outline rings. With ~12 nodes and ~30 edges at 60 fps that is ~70 GPU objects per frame, ~4,200/sec leaked, never freed by `Group.remove` alone.

**Fix:**
1. At `init()`, pre-allocate a pool sized to `OVERWORLD.numIslands` for islands, `numIslands * 4` for edges, plus one outline + one ring mesh.
2. In `_updateOverworldEntities`, walk the pool and update `mesh.position`, `mesh.rotation`, `mesh.scale`, `material.color.setHex(...)`, and `mesh.visible`. Hide unused.
3. If the map regenerates and node/edge count changes, dispose the surplus and grow the pool.

### 1.2 🔴 Same leak pattern — combat rocks  *(S)* ✅
- [x] Pool combat rocks once when combat starts; do not recreate every frame.

**Status:** Done. New `Renderer._syncRocks(rocks)` builds rocks once per combat (keyed off array identity), disposes prior geometry+material, and is invoked from `_updateCombatEntities` once per frame as a no-op when unchanged.

**Where:** [src/Renderer.js](src/Renderer.js) — `_syncRocks`, `_createCombatArena`, `_updateCombatEntities`

### 1.3 🔴 PortUI re-rendered twice per frame from scratch  *(M)* ✅
- [x] Only call `portUI.update(portScene)` when state actually changes.
- [ ] (Follow-up) Inside `PortUI.update()`, diff roster state and skip `innerHTML` writes when unchanged.

**Status:** Done — both per-frame calls removed. `PortUI.update()` now runs only from event handlers (`_onPortHireCrew`, `_onPortAssignStation`, repairs, market, upgrades, ship-class change, dismiss, serve rum) and from `show()` on port entry. Optional state-diff follow-up still open.

**Where:** [src/Game.js](src/Game.js) `_updatePort` + render() PORT branch

### 1.4 🟡 SailingSystem `update` and `updateInCorridor` are duplicated  *(M)* ✅
- [x] Extract shared `_applyControls`/`_integrateMotion` helper; each public method only applies its bounds.

**Status:** Done. Both methods now reduce to: `_applyControls` → `_integrateMotion` → apply bounds (rectangular or corridor). Physics tuning lives in one place.

**Where:** [src/systems/SailingSystem.js](src/systems/SailingSystem.js)

---

## 2. UI & input ergonomics

### 2.1 🟡 `_isClickOnUI()` forces sync layout per-frame  *(S)* ✅
- [x] Mouse-NDC-keyed cache around `document.elementFromPoint` so stationary frames hit the cache instead of the DOM.

**Status:** Done. New `_hitTestAtMouse()` caches per-frame; `_isClickOnUI` and `_isMouseOverCanvas` both go through it. Cache invalidates whenever the mouse NDC changes.

**Where:** [src/Game.js](src/Game.js) `_hitTestAtMouse`, `_isClickOnUI`, `_isMouseOverCanvas`

### 2.2 🟡 Per-frame canvas redraws on Minimap & MapChartingUI  *(M)* ✅ (partial)
- [x] Overworld minimap: dirty-check on map/shipPos/currentIsland/travelRoute/size.
- [x] MapChartingUI: dirty-check including pan/zoom and dpr; force redraw on show/toggle.
- [ ] (Optional) Combat minimap dirty-flag for victory/defeat freeze frame.

**Status:** Done for both canvases that benefit. Combat minimap left as-is — everything moves continuously during fights, so dirty-flagging is mostly noise. Could add a freeze-frame optimisation later for the result screen.

**Where:** [src/ui/Minimap.js](src/ui/Minimap.js) `updateOverworld`, [src/ui/MapChartingUI.js](src/ui/MapChartingUI.js) `update`, `show`, `toggle`

### 2.3 🟢 `Input.endFrame()` allocates a new object every frame  *(S)* ✅
- [x] Maintain a pre-allocated `prevKeys` map; clear + copy in place.

**Status:** Done. `endFrame()` now reuses the same `prevKeys` object every frame.

**Where:** [src/Input.js](src/Input.js) `endFrame`

### 2.4 🟢 Duplicate input methods  *(S)* ✅
- [x] Removed `isMouseJustPressed()` (no remaining call sites).

**Where:** [src/Input.js](src/Input.js)

### 2.5 🟢 Input listeners never unbound  *(S)* ✅
- [x] Added `Input.destroy()` and tracked all listeners via `_bind()` for clean teardown.

**Where:** [src/Input.js](src/Input.js) `init`, `destroy`, `_bind`

---

## 3. Rendering — readability & maintainability

### 3.1 🟡 Split `Renderer.js` (775 lines) into per-view modules  *(L)* ✅ (partial)
- [x] Extract overworld view → `src/render/OverworldRenderer.js`
- [ ] Extract sailing view → `src/render/SailingRenderer.js`
- [ ] Extract combat view → `src/render/CombatRenderer.js`
- [ ] Extract `CameraController`

**Status:** Overworld extracted. Renderer.js shrunk from 921 → 695 lines; OverworldRenderer is 309 focused lines owning the group, mesh pools, ship marker, bounds cache, and camera framing. Sailing + Combat extraction deferred — they share more cross-cutting state (waterPlane, shipMesh, enemy/projectile meshes) so need a careful design pass first.

**Where:** [src/render/OverworldRenderer.js](src/render/OverworldRenderer.js), [src/Renderer.js](src/Renderer.js)

### 3.2 🟡 Cache map bounds — remove per-frame `Math.min(...xs)`  *(S)* ✅
- [x] Cache `{minX, maxX, minY, maxY, rangeX, rangeY, baseCx, baseCy}` keyed by map identity.

**Status:** Done. New `_getOverworldMapBounds(map)` caches bounds keyed by `{ map, worldScale }`; invalidates automatically when the map reference or worldScale changes.

**Where:** [src/Renderer.js](src/Renderer.js) `_getOverworldMapBounds`, `_updateOverworldCamera`

### 3.3 🟢 Cannon arcs created twice  *(S)* ✅ (already optimal)
- [x] Confirmed: both port and starboard arc meshes already share a single `arcGeo` constructed once in `_createCannonArcs`. They cannot collapse into one mesh because both are visible simultaneously to communicate the available firing arcs.

**Where:** `_createCannonArcs` in [src/Renderer.js](src/Renderer.js)

---

## 4. State & persistence correctness

### 4.1 🟡 Save schema versioning  *(S)* ✅
- [x] Emit `schemaVersion` (with legacy `version` alias for compat) and validate on load.

**Status:** Done. Existing `version` field is preserved as an alias for backwards compatibility. `SCHEMA_VERSION` constant centralised; bump it for incompatible state-shape changes.

**Where:** [src/utils/saveSystem.js](src/utils/saveSystem.js)

### 4.2 🟡 `loadFromStorage()` failure path is silent  *(S)* ✅
- [x] All failure paths now log diagnostics with `[saveSystem]` prefix.
- [x] New `loadWithStatus()` returns `{ status, state }` so callers can distinguish corrupt / version-mismatch / no-save / storage-unavailable.
- [x] Main menu Continue button surfaces the failure to the user via alert (Improvements §4.2 follow-up: route through in-game toast once toast system is available pre-menu).

**Where:** [src/utils/saveSystem.js](src/utils/saveSystem.js) `loadWithStatus`, [src/main.js](src/main.js) continueBtn handler

### 4.3 🟢 `consumeLastArrivedShipState()` uses read-clears side channel  *(S)* ✅
- [x] `OverworldScene.update()` now returns the arrived ship state directly (or null); the read-clears method is removed.

**Where:** [src/scenes/OverworldScene.js](src/scenes/OverworldScene.js), [src/Game.js](src/Game.js) `_updateSailing`

### 4.4 🟢 `startingGold: 100` flagged "for testing"  *(S)* ✅
- [x] Comment clarified — 100 gold is the prototyping default so the buy/sell loop is reachable without grinding. Added a `GAME.devCheats` namespace for future dev-only flags.

**Where:** [src/config.js](src/config.js) `GAME`

---

## 5. Architecture & readability

### 5.1 🟡 `Game.js` is doing too much (600 lines)  *(L)* ✅ (partial)
- [x] Extract `PortController` (eleven `_onPort*` handlers + bind block)
- [ ] Extract `SaveController` (save/load/applyLoadedState helpers)
- [ ] Extract `SettingsBindings` (UI scale modal init)
- [ ] Extract `OverworldPanZoomController` (pan/zoom math, wheel handler)

**Status:** PortController landed in `src/controllers/PortController.js` (146 lines). Game.js shrunk to 557 lines net. Other controllers still embedded — extraction follows the same pattern when prioritised.

**Where:** [src/controllers/PortController.js](src/controllers/PortController.js), [src/Game.js](src/Game.js)

### 5.2 🟡 `PortUI.js` mixes Tavern / Shipwright / Market (417 lines)  *(M)* ⏳
- [ ] Split into `TavernPanel`, `ShipwrightPanel`, `MarketPanel` under a thin `PortUI` shell.

**Where:** [src/ui/PortUI.js](src/ui/PortUI.js)

### 5.3 🟢 `innerHTML` interpolation — XSS surface if data ever becomes user-editable  *(S)* ✅ (initial pass)
- [x] Added `src/utils/escapeHtml.js` with `escapeHtml` / `esc` helpers
- [x] Applied to highest-risk interpolations: crew names + station option labels in PortUI; island names in MapUI (current island + connected-route list)
- [ ] Audit remaining `innerHTML` writes for completeness when more user-editable data appears (ship name, contracts, etc.)

**Where:** [src/utils/escapeHtml.js](src/utils/escapeHtml.js), [src/ui/PortUI.js](src/ui/PortUI.js), [src/ui/MapUI.js](src/ui/MapUI.js)

---

## 6. Combat & systems

### 6.1 🟡 No projectile pool  *(M)* ✅
- [x] Pool `Projectile` instances. New `_acquire()`/`_recycle()` on CombatSystem; `Projectile.init(opts)` resets state for reuse; per-frame compaction recycles dead projectiles.

**Where:** [src/entities/Projectile.js](src/entities/Projectile.js), [src/systems/CombatSystem.js](src/systems/CombatSystem.js)

### 6.2 🟢 Hit detection is O(projectiles × ships)  *(L)*
- [ ] Add a coarse grid bucket if combat ever scales beyond ~5 ships.

**Where:** [src/systems/CombatSystem.js:57-74](src/systems/CombatSystem.js)

**Why:** Fine for vertical-slice scope; track as future work.

### 6.3 🟢 Encounter chance is dt-dependent  *(S)* ✅
- [x] Switched to a proper Poisson process: countdown sampled from Exp(λ) via inverse-CDF, decremented by `dt`, resampled on trigger or voyage reset.

**Where:** [src/Game.js](src/Game.js) `_sampleEncounterDelay`, `_updateSailing`

### 6.4 🟢 Combat physics feels slidey  *(S)* ⏳ (deferred — needs playtest)
- [ ] Empirical tuning — needs gameplay session to confirm direction. Current `SHIP.friction = 0.55` means ~45% velocity decay per frame at 60 fps, which is actually quite stiff. The "slidey" sensation may be from `highSpeedTurnPenalty` or `brakeMult` instead. Defer until next playtest.

**Where:** [src/config.js](src/config.js) `SHIP`

---

## 7. Recommended order of attack

| # | Item | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1 | §1.3 Stop calling `PortUI.update()` per-frame | S | 🔴 | ✅ |
| 2 | §1.1 Pool overworld route/island meshes | M | 🔴 | ✅ |
| 3 | §1.2 Pool combat rocks | S | 🔴 | ✅ |
| 4 | §3.2 Cache overworld map bounds | S | 🟡 | ✅ |
| 5 | §2.2 Dirty-flag Minimap / MapChartingUI redraws | M | 🟡 | ✅ (partial) |
| 6 | §1.4 Unify `SailingSystem` paths | M | 🟡 | ✅ |
| 7 | §4.1 / §4.2 Save schemaVersion + load-failure fallback | S | 🟡 | ✅ |
| 8 | §2.3 / §2.4 / §2.5 Input cleanup | S | 🟢 | ✅ |
| 9 | §2.1 `_isClickOnUI` per-frame reflow | S | 🟡 | ✅ |
| 10 | §4.3 Remove `consumeLastArrivedShipState` side channel | S | 🟢 | ✅ |
| 11 | §4.4 Decide on `startingGold` | S | 🟢 | ✅ |
| 12 | §3.3 Cannon-arc mesh reuse | S | 🟢 | ✅ (N/A) |
| 13 | §5.3 `innerHTML` hardening (`escapeHtml` helper + apply to display strings) | S | 🟢 | ✅ |
| 14 | §6.1 Projectile pooling | M | 🟡 | ✅ |
| 15 | §6.3 Poisson-process encounter timer | S | 🟢 | ✅ |
| 16 | §3.1 Split `Renderer.js` per view (overworld extracted) | L | 🟡 | ✅ (partial) |
| 17 | §5.1 Extract controllers from Game (PortController) | L | 🟡 | ✅ (partial) |
| 18 | §3.1 finish — extract Sailing/Combat renderers | L | 🟡 | ⏳ |
| 19 | §5.1 finish — Save / Settings / OverworldPanZoom controllers | M-L | 🟡 | ⏳ |
| 20 | §5.2 Split `PortUI` into Tavern / Shipwright / Market panels | M | 🟡 | ⏳ |
| 21 | §6.2 Hit-detection spatial grid | L | 🟢 | ⏳ |
| 22 | §6.4 Combat friction tuning (needs playtest) | S | 🟢 | ⏳ |

Items not yet ticked are open. As each is implemented, check it off and reference the commit/PR in this file.
