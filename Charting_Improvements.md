# YoHoH — Charting UX & Implementation Improvements

**Document status:** Analysis & roadmap for the charting layer — the Chart Screen (`M` key), the corner minimap, the bottom Map UI route panel, and the shared map-rendering utilities behind all three.
**Last updated:** 2026-05-17
**Companion docs:** [Improvements.md](Improvements.md) (general code quality), [Sailing_Improvements.md](Sailing_Improvements.md) (sailing physics + UX), [Port_Improvements.md](Port_Improvements.md) (port + crew UX), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Scope: anything that draws the island graph or surfaces map information to the player — `BigMapUI` (full-screen chart), `Minimap` (corner radar in sailing/combat), `MapUI` (bottom route-selection panel + toast), and the shared `UI.mapColors` / `UI.minimapColors` palette.

> **Progress (2026-05-17 — first pass):** 12 of 30 active items landed end-to-end. §2.1 (DPR-aware minimap, the only 🔴), §1.2 (island tooltip), §1.3 (route-modifier legend), §1.4 (corridor events on chart), §1.5 (live voyage strip), §1.6 (Fit Map button), §1.7 (keyboard pan/zoom), §2.5 (ship heading line on chart), §5.1 (active route flow dashes — chart + minimap), §5.3 (pulsing "you are here"), §5.4 (**fog of war — Chart Screen only**, design-locked), §6.1 (ARIA on canvases + route list). New shared module: `src/utils/fogOfWar.js` (visibility rules consumed exclusively by `BigMapUI` — see §5.4 for the scoping rationale).
>
> **Scoping update (2026-05-17):** Fog originally applied to all four map views; revised down to **Chart Screen only** after a design call. The 3D overworld, minimap, and bottom MapUI route panel always show full info because they're the action surfaces — players need them to decide where to sail. Data model (`Node.discovered`, `MapSerializer`, `OverworldScene` discovery on arrival) is unchanged and still drives the chart fog.
>
> Remaining active backlog: §3.3 (MapUI rebuild content-signature), plus the refactor + 🟢 polish items (§1.8, §2.4 / §4.2 / §4.3 `MapRenderer`/`MapTransform` extraction, §3.4, §5.2, §5.5–§5.8, §2.2, §2.7, §4.1, §4.4, §7.x, §6.2). See order-of-attack table below.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Bug / blocker — user-facing functionality broken or actively confusing |
| 🟠 | High-priority UX issue |
| 🟡 | Medium — refactor or polish |
| 🟢 | Nice-to-have / forward-compat |

---

## 1. Functional gaps in the Chart Screen (`M` key)

> **Design call (2026-05-17):** The Chart Screen will remain **strategic-only** for now. Voyage actions stay on the bottom MapUI panel. Interactive route-selection / set-heading from the chart is moved to **§10 (Future stretch goals)** below — explicitly not a priority. The chart's near-term mission is to be a great *information* surface (legends, tooltips, voyage strip, sub-events) rather than a control surface.

### 1.1 🟢 Chart Screen is read-only — you can't sail from it  *(stretch — see §10)*
**Where:** [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

The chart shows every island and every route, including the player's current island. But you cannot:
- Hover a route to see its info
- Click a route to select it
- Click "Set Sail" or "Set Heading" from the chart

Today the only way to start a voyage is to close the chart, find the right thin line on the overworld view, click it, and use the small bottom panel.

**Status:** Deferred. Locked as a future stretch goal — chart stays strategic-only. If/when this lands the suggested implementation is: route hover/click in `BigMapUI` mirrors `OverworldScene.getRouteNearPosition`; selecting a connected route opens an inline action panel with "Set Sail" / "Set Heading" / "Cancel" that drives `Game._startSailing(route)` / `_handleAutopilotKeys` directly; routes that don't touch the current island are visible but un-clickable (dimmed).

### 1.2 🟠 No island tooltip / hover info on the Chart Screen  ✅
**Where:** [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

The corner minimap has a hover tooltip; the full-screen chart did not.

**Status:** Done. New `_tooltip` DOM element appended to `document.body` (lives above the chart overlay). `_lastTransform` captures the buffer-pixel projection used in the most recent draw; `_onHoverMove` inverts it (CSS-px → buffer-px → world-px) and runs a hit-test against `_lastNodes`. Tooltip body shows: island name, port type, treasure tier, hazard, faction, distance from current, plus `Home Port`/`Dangerous`/`Safe` tags and the island description. Fog-of-war hidden islands render the tooltip as "??? · Uncharted" with no details (§5.4). CSS lives in `index.html` under `.big-map-tooltip`.

### 1.3 🟠 Chart Screen doesn't surface route modifiers in the legend  ✅
**Where:** [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

**Status:** Done. New second legend row above the island row renders short coloured line samples for `Active · Safe · Stormy · Patrolled · Shoals` using the same `UI.bigMapColors.route*` palette that the edges themselves consume. Layout uses 64px column stride so it fits within the existing chart bottom-area.

### 1.4 🟠 Chart Screen doesn't show corridor sub-events  ✅
**Where:** [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

**Status:** Done. `BigMapUI.update()` signature now accepts `corridorEvents` and renders untriggered events as small colour-coded circles (flotsam yellow / debris brown / whirlpool blue / friendly green) — same palette as the minimap so the icon vocab carries across views. Dirty-flag includes an `eventsSig` so trigger transitions force a redraw. Game's render() pipes the existing `corridorEvents` reference through. (Legend entries for events deliberately deferred — palette is small enough to learn from the minimap.)

### 1.5 🟠 Chart Screen doesn't display live voyage info  ✅
**Status:** Done. New `.chart-voyage-strip` element sits above the canvas in the chart overlay (HTML in `index.html`, styles in the same file). `BigMapUI._updateVoyageStrip(voyageInfo, sailingShip)` runs every chart update and rewrites the cells (To / Dist / ETA / Bearing / Wind). Hidden when `voyageInfo` is null (overworld / docked). Bearing uses the same 8-point compass + `↻/↺/✓` delta indicator as the HUD voyage panel.

### 1.6 🟡 No "fit map to screen" button — only Center-on-Ship  ✅
**Where:** [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

**Status:** Done. New `Fit Map` button in the chart toolbar (also bound to `F` via the keyboard handler). `_fitMap()` reads the visible-island bounding box, sets `zoomLevel = 0.9` (leaves a 5% margin), then computes pan offset that places the bbox centroid at canvas centre given the ship-anchored projection. Math is inline in the method — when §1.8 (world-space camera target refactor) lands this can collapse to two lines.

### 1.7 🟡 No keyboard pan / zoom  ✅
**Status:** Done. `_handleKey` now handles `+`/`=` (zoom in), `-`/`_` (zoom out), `Arrow Left/Right/Up/Down` (pan ±40 px), `0`/`Home` (center-on-ship + zoom 1), `F` (fit map), plus the existing `Escape`/`m`/`M` to close. Skips keyboard handling when an `<input>`/`<textarea>` has focus. The help-text footer line under the canvas isn't actively wrong any more — it accurately describes what's bound.

### 1.8 🟡 Chart Screen pan model is confusing
**Where:** [src/ui/BigMapUI.js:208-214](src/ui/BigMapUI.js)

```js
const midX = Number(shipPosition?.x ?? 0);
const midY = Number(shipPosition?.y ?? 0);
const toScreen = (x, y) => ({
  px: cx + (x - midX) * scale,
  py: cy - (y - midY) * scale,
});
```

The camera is **always anchored on the ship**. `panX/panY` are then layered on top as an extra offset in screen-pixel space. So "center on ship" just zeroes the pan — it doesn't change `midX/midY`. The mental model "I'm dragging the map" actually works, but the underlying math is "I'm offsetting the view that's pinned to the ship," which is harder to reason about.

**Suggested fix:** move the anchor to be a world-space `cameraTarget` that defaults to `shipPosition` but is updated by drag. Pan operations move `cameraTarget`. Center-on-Ship resets it. This unifies the model with how the overworld 3D camera works.

---

## 2. Minimap (corner radar)

### 2.1 🔴 Minimap is **not DPR-aware** — blurry on hi-DPI displays  ✅
**Where:** [src/ui/Minimap.js](src/ui/Minimap.js)

**Status:** Done. `_resize()` now multiplies the buffer size by `Math.min(2, window.devicePixelRatio || 1)`, leaves CSS dims untouched, and applies `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` so existing draw code keeps using CSS-pixel coordinates. The dirty-flag includes `dpr` so a monitor change forces a redraw. `invalidateOverworld()` is called whenever the buffer is rebuilt since the transform reset would otherwise paint into a stale state.

### 2.2 🟠 Minimap doesn't pause / freeze when chart is open
While the player is inspecting the chart, the corner minimap continues to redraw on dirty-flag invalidation (which is fine — it's cheap). But more importantly: when an encounter telegraph is active, the minimap PULSE continues even though physics is paused. Visually contradictory: the world has stopped, but the radar still ticks.

**Suggested fix:** Game.render() can pass a `paused` flag to `Minimap.updateOverworld`. If paused, draw a single static frame (no pulse).

### 2.3 🟢 Click-to-select doesn't work from the minimap  *(stretch — see §10.2)*
The minimap shows the connected routes and the ship's current island. Players naturally try to click destinations on the minimap. Today there's no handler — clicks fall through to the canvas (which is behind it).

**Status:** Deferred. Same family as §1.1 — bundled with "chart owns selection" stretch goal. Until §1.1 lands, the minimap stays a viewer (consistent with the chart) and the bottom MapUI panel remains the only action surface.

### 2.4 🟡 Minimap and BigMap share ~250 lines of duplicated rendering code
**Where:** [src/ui/Minimap.js:247-472](src/ui/Minimap.js), [src/ui/BigMapUI.js:155-391](src/ui/BigMapUI.js)

Both implementations independently:
- Clear + border the canvas
- Compute bounds from `nodes.map(n => n.position.x)` / `Math.min`/`Math.max`
- Compute a `toScreen(x, y)` closure
- Draw edges with route-modifier color logic (copy-pasted)
- Draw islands with `current` / `home` / `dangerous` / `appealing` / `default` color logic (copy-pasted)
- Draw the ship dot
- Draw compass + wind arrow (copy-pasted block)

The two views differ only in: anchor point (always-ship vs. bounding-box-centroid), zoom mode (fit vs. interactive), and overlay features (legend / labels / events / telegraph). A shared `MapRenderer` utility could shrink both files by ~60%.

**Suggested fix:** extract `src/utils/MapRenderer.js` with:
```js
drawIslands(ctx, opts);       // nodes, transform, palette, sizing
drawRoutes(ctx, opts);        // edges, modifier colors, active-route highlight
drawShip(ctx, opts);          // ship dot, heading line
drawCompass(ctx, opts);       // compass rose + optional wind arrow
drawLegend(ctx, opts);        // configurable entries
makeTransform(opts);          // toScreen closure
computeBounds(nodes);         // cached
```
Both `BigMapUI` and `Minimap` become thin orchestrators that pick a transform, build options, and call these helpers in order.

### 2.5 🟡 Ship dot on Chart Screen doesn't show heading  ✅
**Where:** [src/ui/BigMapUI.js](src/ui/BigMapUI.js)

**Status:** Done. Heading line is drawn from the ship centre along `(sin r, -cos r) × 18 × dpr` (same convention as minimap, Y-flipped for canvas). Only rendered while traveling — there's no meaningful heading when docked, so the static circle stays clean in port.

### 2.6 🟡 Compass + wind arrow code is duplicated in three places
`Minimap.updateOverworld` lines 423-466 and `BigMapUI.update` lines 313-352 both draw a compass + wind. Same math, slightly different sizes. Bundled with §2.4 refactor.

### 2.7 🟢 Wind arrow has no animation
The arrow points the correct direction but doesn't move. A subtle dash-march along the arrow shaft (CSS-animatable on a 2D canvas via `setLineDash` + `lineDashOffset` time-driven) would communicate "this is a flowing thing, not a static label."

---

## 3. The bottom MapUI route-selection panel

### 3.1 🟢 Route selection panel and Chart Screen are double-renders of the same info  *(blocked by §1.1)*
The bottom MapUI panel shows route info, destination details, and a "Routes from here" list. The Chart Screen also shows all this (as visual layout). When both are visible (overworld state) the player sees the destination data twice — once as a text list, once as a map.

**Status:** Deferred — depends on §1.1 (interactive chart) which is itself a stretch goal. While the chart stays strategic-only, the bottom panel must keep the "Routes from here" list because it's the **only** place the player can act on a route. Re-open this item if/when §1.1 lands.

### 3.2 🟠 No keyboard navigation of the "Routes from here" list
**Where:** [src/ui/MapUI.js:307-322](src/ui/MapUI.js)

The connected-routes list is a flat `<div>` with no `<button>` / `<a>` semantics, no focus highlights, no `Tab` traversal, no arrow-key navigation. Mouse-only.

**Suggested fix:** render each route as a `<button>` with `role="option"`, group as a `<div role="listbox">`. Arrow Up/Down moves a `data-focused` highlight. Enter selects. This pattern also covers screen readers.

### 3.3 🟡 Route details rebuild on every frame
**Where:** [src/ui/MapUI.js:282-322](src/ui/MapUI.js)

`update()` is called every frame. Each call sets `innerHTML` for `routeDetails` / `routeSelectionDetails` / `routeSelectionConnected` — three string-joined HTML blocks rebuilt and re-parsed by the browser. With ~6 connected routes this is ~30 DOM nodes recreated per frame.

**Suggested fix:** compute a content-signature (route ID + supplies-affordability state) and skip the rebuild when the signature is unchanged. Same dirty-flag pattern that `BigMapUI` / `Minimap` already use.

### 3.4 🟡 "Routes from here" doesn't filter or sort
Just shows up to `connectedRoutesMax: 8` in insertion order. Players in a port hub with many connections can't quickly find "the shortest route" or "the safest route" or "routes I haven't sailed before."

**Suggested fix:** small `<select>` above the list — "Sort by: Distance / Danger / Treasure / Last sailed". Doesn't add a lot of UI, opens room for future sort heuristics.

### 3.5 🟢 `_dismissOnboarding` writes to localStorage on every call
Single boolean, called once. Fine. Note that this and `_loadCustomSize` (Minimap) and the chart pan/zoom *don't* persist; only the onboarding flag does. Inconsistent.

---

## 4. Map renderer & shared utilities

### 4.1 🟡 Bounding box recomputed every frame
**Where:** [src/ui/BigMapUI.js:187-193](src/ui/BigMapUI.js), [src/ui/Minimap.js:279-285](src/ui/Minimap.js)

```js
const xs = nodes.map(n => n.position.x);
const ys = nodes.map(n => n.position.y);
const minX = Math.min(...xs);
// ...
```

Allocates two arrays, spreads them through `Math.min`/`Math.max`, every frame. With N=12 it's free; with N=30 (planned for Phase B) it's still tiny, but it's a smell. Bounds are a property of the **map**, not the frame.

**Suggested fix:** compute `{ minX, maxX, minY, maxY, rangeX, rangeY }` once during `MapGenerator.generateMap()` and stash on `map.bounds`. Recompute only on `loadMap`/`generateMap`.

### 4.2 🟡 No "MapTransform" abstraction
**Where:** [src/ui/BigMapUI.js:211-214](src/ui/BigMapUI.js), [src/ui/Minimap.js:296-299](src/ui/Minimap.js)

Both views build a `toScreen(x, y)` closure inline. The minimap also stores `_lastOverworldTransform` to do tooltip hit-tests. There's no canonical "given a viewport rect, scale, and anchor, project world → canvas + invert" object. Hit-testing has to mirror the transform manually each time.

**Suggested fix:** introduce `src/utils/MapTransform.js`:
```js
new MapTransform({ canvas, anchor: {x, y}, scale, panPx: {x, y}, dpr })
  .toScreen(x, y) → { px, py }
  .toWorld(px, py) → { x, y }
  .fit(bounds, padding) // sets scale to fit bounds within canvas minus padding
  .center(point) // sets anchor
```
Both views construct, use, and discard one per frame. Hit-tests use `.toWorld`. Cleanup of `Minimap._lastOverworldTransform` becomes trivial.

### 4.3 🟡 Route color logic is duplicated three times
- `BigMapUI.update` lines 234-240
- `Minimap.updateOverworld` lines 315-321
- `Renderer.updateOverworld` (the 3D scene) — separately in `RENDER.routeStormyColor` / `RENDER.routePatrolledColor` / `RENDER.routeShoalsColor`

Picking modifier → color logic should be a single function in `src/utils/routeModifiers.js`:
```js
getRouteColor(edge, palette, { active = false } = {})
```
All three call sites delegate.

### 4.4 🟡 Palette duplicates exist for the same map
**Where:** [src/config.js:601-614](src/config.js) (`MAP_COLORS`), `UI.minimapColors`, `UI.bigMapColors`, `RENDER.routeStormyColor` (etc.)

The shared `MAP_COLORS` is spread into both `minimapColors` and `bigMapColors`, then the 3D renderer carries its own copies of `routeStormyColor` etc. Three sources of truth for the same five route colors. Long term: collapse to one map-palette config consumed by every view.

### 4.5 🟢 No "minimap context" for COMBAT
The minimap correctly switches between combat and overworld rendering, but the combat render does NOT use the dirty-flag pattern (intentionally — things move every frame). Adding a half-resolution buffer or RAF throttle for combat minimap could shave a measurable amount of canvas work at high fps.

---

## 5. Visual polish & new features

### 5.1 🟢 Active route should show flow direction  ✅
**Status:** Done. Both `BigMapUI` and `Minimap` overlay a moving dashed `ctx.shipStroke` line on the active route, with `lineDashOffset = -performance.now()/60`. The dash order is origin → destination (re-derived from `currentIsland`), so the dashes always march **toward** the goal regardless of which endpoint is `edge.a`. Chart uses 10/8 dashes scaled by `dpr`; minimap uses 6/4 fixed (smaller view).

### 5.2 🟢 Multi-modifier routes show only the primary color
**Where:** [src/utils/routeModifiers.js](src/utils/routeModifiers.js)

`getPrimaryModifier` picks one of stormy/patrolled/shoals when a route has several. Color information is lost. A multi-band paint (e.g. stripe alternating two colors) would communicate "this is BOTH stormy AND patrolled."

### 5.3 🟢 Pulsing "you are here" marker  ✅
**Status:** Done. The current-island dashed ring on the chart now fades opacity 0.55↔1.0 at ~1.4 Hz, plus a second expanding halo ring fades-and-grows in counter-phase. To keep the pulse animating even when the player is docked (no other state changes), the chart's dirty-flag now includes a 50 ms `animTick` so it redraws at ~20 fps minimum. (Minimap kept static — small enough that a pulse would be visually noisy.)

### 5.4 🟢 Fog of war / progressive discovery  ✅ *(scoped to Chart Screen only)*
**Status:** Done. Design call locked **always on, Chart Screen only**.

**Scope (2026-05-17):** Fog applies *exclusively* to the Chart Screen (`M` key, `BigMapUI`). The 3D overworld, corner minimap, and bottom MapUI route panel are the **action surfaces** — they always show full information because the player needs it to decide where to sail. The Chart is the "captain's chart" abstraction: a stylised, knowledge-tracking view that lags behind direct observation. This separation also means players never lose access to features (clickable routes, port info, modifier icons) because of fog.

**Data model** (lives outside any single view so all consumers see one source of truth):
- `Node.discovered: boolean` added in `MapGenerator.js`. Home port is discovered at gen time; every other island starts false.
- `MapSerializer` persists `discovered` per node. Legacy saves (without the field) default to `true` so existing games don't get re-fogged.
- `OverworldScene.update` (auto-arrival) and `OverworldScene.earlyDock` set `dest.discovered = true` and emit a `newlyDiscovered: true` flag on the `arrived` voyage event.
- `Game._handleVoyageEvent` shows a 📜 *"Chart updated — Cursed Cay added."* toast (1.2 s after the arrival toast) when a new island is revealed.

**Visibility rules** (shared in `src/utils/fogOfWar.js`):
- A node is **visible** if discovered OR adjacent (via an edge) to a discovered node.
- An edge is **visible** if at least one endpoint is discovered.
- Visible-but-undiscovered islands render as a fog-tinted gray circle with a dashed outline; label is `???`; tooltip shows distance + "Uncharted" + a one-line description, nothing else.

**Where fog renders / does NOT render:**

| View | Fog? | Behaviour |
|---|---|---|
| `BigMapUI` (Chart Screen, M key) | ✅ Yes | Gray tint, dashed outline, `???` labels, fog tooltip; hit-test skips invisible nodes; bbox spans visible nodes only (initial Fit Map shows only the explored region). |
| `OverworldRenderer` (3D scene) | ❌ No | Full archipelago always shown. Players need to see all routes and islands to plan voyages from the action surface. |
| `Minimap` (corner radar) | ❌ No | Tactical / always-on overlay shows the full graph. |
| `MapUI` route panel + connected-routes list | ❌ No | Full destination details (name, port, treasure, hazard, faction) so players can decide before pressing Set Sail. |

The shared `src/utils/fogOfWar.js` helper module remains in place — `BigMapUI` is its sole consumer for now, but the module exists so future stretch goals (a "Captain's Log" UI, achievement system tracking discovery) can plug in without re-deriving the rules.

### 5.5 🟢 Distance / grid overlay
Optional faint grid every 50 world-units on the chart. Adds a "navigator feel" and makes distance estimation easier. Toggle in chart toolbar.

### 5.6 🟢 Voyage history / path trail
Track the player's actual sailed positions across recent voyages and render them as a fading dashed line on the chart. Makes the chart feel like a captain's logbook.

### 5.7 🟢 Highlight reachable islands
Given the current ship's hull/sails state, some long routes might be impractical. The chart could subtly dim islands beyond a "practical range" estimate (based on hull remaining + supply cost).

### 5.8 🟢 Export chart as PNG
"Save chart" button → renders to a higher-res buffer, downloads as PNG. Low effort, high "captain's log" charm.

### 5.9 🟢 Big-map close button needs `pointer-events: auto` confirmation
**Where:** [index.html#big-map-overlay](index.html)

The chart overlay uses `pointer-events: auto`. Buttons inside inherit. Verified visually; no current bug, but worth a comment because Sailing_Improvements debug session showed that `pointer-events` confusion has bitten this codebase before.

---

## 6. Accessibility

### 6.1 🟠 No ARIA roles on the route list or chart canvas  ✅
**Status:** Done.
- Chart canvas — static `role="img"` in HTML, dynamic `aria-label` rewritten on every draw: *"Chart Screen. 12 islands, 4 charted. Ship at Home Port. Traveling to an uncharted island."* — counts respect fog (undiscovered islands show as count "uncharted", named islands count as charted).
- Minimap canvas — `role="img"` set in `init()`, `aria-label` rewritten per draw: *"Mini chart. Sailing from Home Port."* / *"Mini chart. Docked at Home Port."*.
- Connected-routes list — container `role="list"` + `aria-labelledby="map-route-connected-label"`; each item `role="listitem"` with `aria-label="Route to Cursed Cay, 14 units, selected"` (selection state included).

(Full keyboard-nav of the route list — focus management, Tab traversal, Enter to select — remains tracked under §3.2.)

### 6.2 🟡 Colors aren't checked for color-blind safety
Stormy gray, patrolled brown-red, shoals tan — overlapping in a deuteranopia simulation. Could add a small icon-prefix to route labels in the legend (and optionally on the route line) to disambiguate.

### 6.3 🟡 Focus management for chart toolbar
When chart opens, the focus moves to the overlay. When chart closes, focus is lost — the overworld canvas reclaims input but no keyboard-only user gets a visible focus indicator on the canvas. After closing, focus should restore to whatever element launched the chart (the M-key has no DOM element, so fall back to `body`).

---

## 7. Performance & code hygiene

### 7.1 🟡 Listener leaks on Minimap / BigMapUI
**Where:** [src/ui/Minimap.js:80-81](src/ui/Minimap.js), [src/ui/BigMapUI.js:73-84](src/ui/BigMapUI.js)

Neither class stores listeners for cleanup. If `Game` is ever re-instantiated (e.g. main-menu return), listeners pile up.

**Suggested fix:** mirror `Input._bind` pattern (`{ target, event, handler }` array, `destroy()` removes all).

### 7.2 🟡 BigMapUI.update returns early if dirty-flag matches — but `_resize` always runs
The `_resize()` call before the dirty check forces a DPR check + width/height write every frame even when nothing changed. Cheap but wasteful. Move `_resize()` to react to `window.resize` events only, not every frame.

### 7.3 🟡 Per-frame `String(performance.now())`-derived pulses
Multiple places compute `performance.now() / N` for pulses (minimap telegraph, approach ring elsewhere). Centralise in a small `pulseFactor(periodMs)` helper to make timing tweaks one-line.

### 7.4 🟢 Canvas DPR isn't refreshed on monitor change
When a user drags the browser window from a 1× to a 2× display, the `dpr` stays stale until the next window resize. Listen for `matchMedia('(resolution: 2dppx)').addEventListener('change', …)`.

---

## 8. Recommended order of attack

Top items are the highest-impact / lowest-risk wins. Effort: S (≤1h), M (≤3h), L (significant refactor).

**Active priorities** (chart stays strategic-only; voyage actions remain on the bottom MapUI panel):

| # | Item | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1 | §2.1 — Make Minimap DPR-aware (drop blur on hi-DPI) | S | 🔴 | ✅ |
| 2 | §1.2 — Island tooltip on Chart Screen hover | S | 🟠 | ✅ |
| 3 | §1.3 — Route-modifier legend row on Chart Screen | S | 🟠 | ✅ |
| 4 | §1.4 — Corridor events on Chart Screen (mirror minimap) | S | 🟠 | ✅ |
| 5 | §1.5 — Live voyage strip on Chart Screen while sailing | S | 🟠 | ✅ |
| 6 | §1.6 — Fit-map button (chart toolbar) | S | 🟡 | ✅ |
| 7 | §1.7 — Keyboard pan / zoom in chart | S | 🟡 | ✅ |
| 8 | §2.5 — Ship heading line on Chart Screen | S | 🟡 | ✅ |
| 9 | §3.3 — Skip MapUI panel innerHTML rebuild via content-signature | S | 🟡 | ⏳ |
| 10 | §5.1 — Active route flow-direction dashes | S | 🟢 | ✅ |
| 11 | §5.3 — Pulsing "you are here" on current island | S | 🟢 | ✅ |
| 12 | §6.1 — ARIA roles + aria-label on canvases and route list | S | 🟠 | ✅ |
| 13 | §5.4 — Fog of war (always on) | M | 🟢 | ✅ |
| — | — | — | — | — |
| 14 | §2.4 / §4.2 / §4.3 — Extract `MapRenderer` + `MapTransform` shared utilities | L | 🟡 | ⏳ (large refactor — wait for items above to settle) |
| 15 | §1.8 — Refactor Chart pan model to world-space camera target | M | 🟡 | ⏳ (bundles with #14) |
| 16 | §3.2 — Keyboard / a11y for route list | S | 🟠 | ⏳ |
| 17 | §3.4 — Sort routes by distance / danger / treasure | S | 🟢 | ⏳ |
| 18 | §5.2 — Multi-band paint for routes with multiple modifiers | S | 🟢 | ⏳ |
| 19 | §5.5 — Grid / distance overlay on chart | S | 🟢 | ⏳ |
| 20 | §5.6 — Voyage history / path trail | M | 🟢 | ⏳ |
| 21 | §5.7 — Highlight unreachable destinations | M | 🟢 | ⏳ |
| 22 | §5.8 — Export chart as PNG | S | 🟢 | ⏳ |
| 23 | §2.2 — Minimap freeze when chart is open | S | 🟡 | ⏳ |
| 24 | §2.7 — Animated wind arrow | S | 🟢 | ⏳ |
| 25 | §4.1 — Cache map bounds on the map | S | 🟡 | ⏳ |
| 26 | §4.4 — Single palette source for all map views | S | 🟡 | ⏳ |
| 27 | §7.1 — Listener cleanup paths on Minimap / BigMapUI | S | 🟡 | ⏳ |
| 28 | §7.2 — Move `_resize()` out of `update()` | S | 🟡 | ⏳ |
| 29 | §7.4 — DPR change listener | S | 🟢 | ⏳ |
| 30 | §6.2 — Color-blind-safe route icons | S | 🟡 | ⏳ |

Each landed item should be ticked here. Items that span multiple files should also be noted in `IMPLEMENTATION_PLAN.md` under the next charting pass.

---

## 9. Open design questions

1. ~~Should the Chart Screen own route selection, or stay read-only?~~ **Answered (2026-05-17):** stays strategic-only. Voyage actions remain on the bottom MapUI panel. See §10.
2. ~~Fog of war: opt-in toggle or always on? Which views?~~ **Answered (2026-05-17):** Always on, **Chart Screen only**. Every island except the home port starts undiscovered; first arrival marks them discovered. The Chart Screen (M key) is the only view that hides identity / details of uncharted islands. The main 3D overworld, the corner minimap, and the bottom MapUI route panel always show the full archipelago — they are the action surfaces where the player decides what to sail toward, and need full information. Persisted with the map.
3. **Should the minimap default to "ship-centred" or "full-map"?** Today: full-map when docked, ship-centred when sailing. Some players prefer ship-centred always.
4. **Multi-modifier visualisation**: dashed/banded, icon-overlaid, or use a third color (rare combo)?
5. **Heading-line on chart**: always shown, or only when sailing? Probably only when sailing.

These are tagged for a future design sweep.

---

## 10. Future stretch goals (deliberately deferred)

Items here are **not on the active backlog**. They're captured so the rationale isn't lost and so future passes can pick them up without re-discovering the design.

### 10.1 🟢 Interactive Chart Screen — sail / set heading from the chart  *(was §1.1)*
- Hover route → tooltip with distance, danger, modifiers, port type, treasure level.
- Click connected route → inline action panel with "Set Sail" / "Set Heading" buttons that drive `Game._startSailing` / autopilot heading-snap directly.
- Routes that don't touch the current island stay visible but un-clickable (dimmed).
- **Blocked by design call:** chart is strategic-only for now. Promoting this also unlocks §3.1 (drop the duplicate "Routes from here" list from the bottom panel).

### 10.2 🟢 Click-to-select from the minimap  *(was §2.3 in earlier draft)*
Once chart selection lands, the same wiring trivially extends to the minimap. Until then, leaving it click-through is the right call (avoids fighting with overworld canvas pan / route hover).

### 10.3 🟢 Drop the bottom "Routes from here" list  *(was §3.1)*
Only makes sense once §10.1 ships and the chart owns route-discovery. Today the bottom panel is the **only** action surface, so keeping the list there is correct.

These remain candidates if/when we decide the chart should be a control surface as well as an information surface — but the gameplay loop today is well-served by keeping that boundary clean.
