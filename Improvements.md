# YoHoH — Code & Architecture Improvements

**Document status:** Living checklist of code-quality, performance, and correctness improvements identified during review.
**Last updated:** 2026-05-16
**Scope:** Main game (`src/`) — POC issues tracked in their own docs.

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

### 1.1 🔴 Three.js GPU memory leak — overworld view  *(S–M)*
- [ ] Pool overworld route/island meshes instead of recreating them every frame.

**Where:** [src/Renderer.js:611-613](src/Renderer.js), [src/Renderer.js:654-680](src/Renderer.js)

**Symptom:** Every frame in `GAME_STATES.OVERWORLD`, `_setupOverworldView` calls `overworldGroup.remove(...)` but never `geometry.dispose()` / `material.dispose()`. Then `_updateOverworldEntities` instantiates fresh `PlaneGeometry`, `CircleGeometry`, `RingGeometry`, and `MeshBasicMaterial` for every edge, every node, and (when selected) outline rings. With ~12 nodes and ~30 edges at 60 fps that is ~70 GPU objects per frame, ~4,200/sec leaked, never freed by `Group.remove` alone.

**Fix:**
1. At `init()`, pre-allocate a pool sized to `OVERWORLD.numIslands` for islands, `numIslands * 4` for edges, plus one outline + one ring mesh.
2. In `_updateOverworldEntities`, walk the pool and update `mesh.position`, `mesh.rotation`, `mesh.scale`, `material.color.setHex(...)`, and `mesh.visible`. Hide unused.
3. If the map regenerates and node/edge count changes, dispose the surplus and grow the pool.

### 1.2 🔴 Same leak pattern — combat rocks  *(S)*
- [ ] Pool combat rocks once when combat starts; do not recreate every frame.

**Where:** [src/Renderer.js:440-447](src/Renderer.js)

**Symptom:** Rocks are configured statically in `COMBAT_ROCKS` but `_updateCombatEntities` rebuilds the `rocksGroup` from scratch every frame.

**Fix:** Move rock mesh creation into `_createCombatArena()` (or a `setRocks(rocks)` method called when combat starts). In the per-frame update, only toggle visibility.

### 1.3 🔴 PortUI re-rendered twice per frame from scratch  *(M)*
- [ ] Only call `portUI.update(portScene)` when state actually changes.

**Where:** [src/Game.js:479-481](src/Game.js) and [src/Game.js:576](src/Game.js); the `update()` body in [src/ui/PortUI.js:123-225](src/ui/PortUI.js)

**Symptom:** While docked, `PortUI.update` runs at 60 fps from both `_updatePort` and `render()`. Each call regenerates the entire crew roster and station-overview via `innerHTML = …`, re-parses HTML, and re-attaches `change` listeners. Side effects you can observe in the UI: dropdowns can close while opening because the `<select>` is replaced underneath the user; perf gets worse with more crew.

**Fix:**
1. Remove the per-frame `portUI.update()` calls — `Game._onPort*` handlers already call `portUI.update()` after every meaningful change.
2. (Optional follow-up) inside `PortUI.update()`, diff state: cache the last-rendered `roster.map(c => c.id + ':' + c.station).join('|')` and skip the `innerHTML` write when unchanged.

### 1.4 🟡 SailingSystem `update` and `updateInCorridor` are duplicated  *(M)*
- [ ] Extract shared `_applyControls`/`_applyMotion` helper; each public method only applies its bounds.

**Where:** [src/systems/SailingSystem.js:10-93](src/systems/SailingSystem.js)

**Symptom:** Lines 13–44 and 63–90 are essentially identical sailing physics — thrust, reverse, turn penalty, friction, deadzone, integration. Any future tuning has to be made twice.

**Fix:** Pull thrust/turn/friction/integrate into a private helper; have both methods call it, then differ only in the clamp at the end.

---

## 2. UI & input ergonomics

### 2.1 🟡 `_isClickOnUI()` forces sync layout per-frame  *(S)*
- [ ] Cache the result during hover; only re-test on click.

**Where:** [src/Game.js:504-512](src/Game.js)

**Symptom:** `document.elementFromPoint(...)` is invoked from `_updateOverworld` to gate hover detection. It triggers a synchronous reflow each frame.

**Fix:** Hit-test only on `mousedown`/`mousemove` events (debounce). For hover, listen for `pointerenter/leave` on the UI container instead.

### 2.2 🟡 Per-frame canvas redraws on Minimap & BigMapUI  *(M)*
- [ ] Add `_dirty` flag set on map/ship/route changes; only redraw when dirty.

**Where:** [src/ui/Minimap.js](src/ui/Minimap.js), [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

**Symptom:** Both canvases redraw every frame, even on the static overworld where nothing changes.

**Fix:** Set `_dirty = true` on `update(...)` argument change; in `_render()`, skip if not dirty. Always redraw during sailing (ship position changes).

### 2.3 🟢 `Input.endFrame()` allocates a new object every frame  *(S)*
- [ ] Maintain two pre-allocated key maps and swap references.

**Where:** [src/Input.js:19](src/Input.js)

**Symptom:** `this.prevKeys = { ...this.keys }` allocates every frame.

**Fix:** Use two fixed objects and clear+copy keys into the "prev" one without allocation, or swap pointers and clear the new "live" map.

### 2.4 🟢 Duplicate input methods  *(S)*
- [ ] Remove `isMouseJustPressed()` in favour of `isLeftMouseJustPressed()`.

**Where:** [src/Input.js:24-31](src/Input.js)

### 2.5 🟢 Input listeners never unbound  *(S)*
- [ ] Add `Input.destroy()` for symmetry; call from `Game.destroy()` if ever introduced.

**Where:** [src/Input.js:57-91](src/Input.js)

**Why:** Not a leak today (Game is a singleton), but defensive — if the game is ever re-initialised (e.g. main-menu → New Game without page reload) handlers will stack.

---

## 3. Rendering — readability & maintainability

### 3.1 🟡 Split `Renderer.js` (775 lines) into per-view modules  *(L)*
- [ ] `RendererCombat`, `RendererSailing`, `RendererOverworld`, `CameraController` — each ≤ ~200 lines.

**Where:** [src/Renderer.js](src/Renderer.js)

**Why:** The current file mixes setup, update, and camera logic across three distinct views with toggled visibility. Each view is small enough to live in its own file and gets tested in isolation.

**Notes:** Keep a thin `Renderer` shell that owns the WebGL renderer, scene, and camera, then dispatches to one sub-renderer based on `Game.state`. The existing `RenderConfig` per-view setup is already a good seam.

### 3.2 🟡 Cache map bounds — remove per-frame `Math.min(...xs)`  *(S)*
- [ ] Compute `{minX, maxX, minY, maxY, baseCx, baseCy}` once when the map loads.

**Where:** [src/Renderer.js:691-696](src/Renderer.js) (`_updateOverworldCamera`)

**Symptom:** `xs = map.nodes.map(...)` + `Math.min(...xs)` runs every frame on the overworld even though the map doesn't move.

**Fix:** Cache on map (re)generation; invalidate when `MapGenerator.generate` or `loadMap` is called.

### 3.3 🟢 Cannon arcs created twice  *(S)*
- [ ] Reuse one arc mesh; tint material on `aimingSide` change instead of swapping meshes.

**Where:** `_createCannonArcs` and `_updateCombatEntities` in [src/Renderer.js](src/Renderer.js)

---

## 4. State & persistence correctness

### 4.1 🟡 Save schema has no `schemaVersion`  *(S)*
- [ ] Add `schemaVersion: 1` to `getSaveState()`; reject/skip-load saves with unknown versions.

**Where:** [src/Game.js:55-69](src/Game.js), [src/utils/saveSystem.js](src/utils/saveSystem.js)

**Why:** Any change to `_playerShipState`/cargo/upgrades shape will silently break existing saves.

### 4.2 🟡 `loadFromStorage()` failure path is silent  *(S)*
- [ ] Wrap deserialization with a `try/catch`; on failure, log + start a fresh game with a toast.

**Where:** [src/utils/saveSystem.js](src/utils/saveSystem.js), [src/Game.js:78-93](src/Game.js)

### 4.3 🟢 `consumeLastArrivedShipState()` uses read-clears side channel  *(S)*
- [ ] Replace with a return value from `OverworldScene.update(dt, input) → { arrived?: shipState }`.

**Where:** [src/scenes/OverworldScene.js:137-141](src/scenes/OverworldScene.js), [src/Game.js:253-254](src/Game.js)

### 4.4 🟢 `startingGold: 100` flagged "for testing"  *(S)*
- [ ] Either commit the value as the intended start, or wire it behind a `GAME.devCheats` flag.

**Where:** [src/config.js:355](src/config.js)

---

## 5. Architecture & readability

### 5.1 🟡 `Game.js` is doing too much (600 lines)  *(L)*
- [ ] Extract `PortController`, `SaveController`, `SettingsBindings`, `OverworldPanZoomController` from Game.

**Where:** [src/Game.js](src/Game.js)

**Why:** The port handlers (`_onPortBuyGood`, `_onPortBuyUpgrade`, `_onPortShipClassChange`, …) are pure delegation. The settings modal init and overworld pan/zoom math are unrelated to the game loop. Splitting these halves the file and clarifies the loop.

### 5.2 🟡 `PortUI.js` mixes Tavern / Shipwright / Market (417 lines)  *(M)*
- [ ] Split into `TavernPanel`, `ShipwrightPanel`, `MarketPanel` under a thin `PortUI` shell.

**Where:** [src/ui/PortUI.js](src/ui/PortUI.js)

### 5.3 🟢 `innerHTML` interpolation — XSS surface if data ever becomes user-editable  *(S)*
- [ ] Switch dynamic name/label injection to `textContent` or DOM construction; reserve `innerHTML` for static markup.

**Where:** [src/ui/PortUI.js:175-225](src/ui/PortUI.js) (multiple) and other UI files with `innerHTML = …`.

**Why:** Currently safe — all interpolated values come from `config.js` or generated data — but island names, crew names, and ship name (planned, §10 D.4a) are user-facing strings that may become editable. Easier to fix once now than to audit later.

---

## 6. Combat & systems

### 6.1 🟡 No projectile pool  *(M)*
- [ ] Pool `Projectile` instances and their meshes; reuse on fire.

**Where:** [src/systems/CombatSystem.js:39-46](src/systems/CombatSystem.js), [src/Renderer.js](src/Renderer.js) projectile mesh pool

**Why:** The Renderer already pools projectile meshes via `_getOrCreateProjectileMesh`. Mirror this on the JS side to remove per-shot GC pressure during sustained combat (Galleon = 3 broadsides × multiple cooldowns).

### 6.2 🟢 Hit detection is O(projectiles × ships)  *(L)*
- [ ] Add a coarse grid bucket if combat ever scales beyond ~5 ships.

**Where:** [src/systems/CombatSystem.js:57-74](src/systems/CombatSystem.js)

**Why:** Fine for vertical-slice scope; track as future work.

### 6.3 🟢 Encounter chance is dt-dependent  *(S)*
- [ ] Switch to a Poisson timer (accumulator) for more predictable mean encounter rate independent of frame rate.

**Where:** [src/Game.js:256-257](src/Game.js)

### 6.4 🟢 Combat physics feels slidey  *(S)*
- [ ] Tweak `SHIP.friction` upward (currently 0.55; sailing uses 0.998) — observe if turn/brake feel improves.

**Where:** [src/config.js:138-145](src/config.js)

---

## 7. Recommended order of attack

Pull this into a focused PR or two. Top items are cheap and observable wins:

| # | Item | Effort | Impact |
|---|------|--------|--------|
| 1 | §1.3 Stop calling `PortUI.update()` per-frame | S | 🔴 |
| 2 | §1.1 Pool overworld route/island meshes | M | 🔴 |
| 3 | §1.2 Pool combat rocks | S | 🔴 |
| 4 | §3.2 Cache overworld map bounds | S | 🟡 |
| 5 | §2.2 Dirty-flag Minimap / BigMapUI redraws | M | 🟡 |
| 6 | §1.4 Unify `SailingSystem` paths | M | 🟡 |
| 7 | §4.1 Save `schemaVersion` + load-failure fallback | S | 🟡 |
| 8 | §3.1 Split `Renderer.js` per view | L | 🟡 |
| 9 | §5.1 / §5.2 Extract controllers from Game / split PortUI | L | 🟢-🟡 |

Items not yet ticked are open. As each is implemented, check it off and reference the commit/PR in this file.
