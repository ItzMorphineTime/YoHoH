# Island Generator — Improvement Plan

**Document status:** Planning & Implementation Reference  
**Last updated:** 2026-01-31  
*Phase H complete: Props & decorations; Rendering optimizations applied*  
**Target:** YoHoH island-generator-poc — procedural island terrain with building placement  

> **See [ISLAND_RESEARCH.md](ISLAND_RESEARCH.md)** for detailed research, Edit mode vision, and Prop placement GUI/UX plan.

---

## Design Principle: Navigable Islands

**We make a conscious decision:** islands are generated to support **paths between buildings**, **locations suitable for building placement**, and **player navigation**.

| Goal | Implication |
|------|-------------|
| **Paths between buildings** | Terrain must allow walkable routes between placed structures. Flat tiles, ramps, and connectivity matter. |
| **Locations for building placement** | Generation should produce viable building zones — flat or flattenable land above sea level, with enough contiguous tiles for 1×1, 2×1, 2×2 structures. |
| **Player navigation** | The tile grid is the navigation graph. Players move between tiles; steep cliffs or water block movement. Terrain should be traversable where gameplay expects it. |

**Consequences for generation and tools:**
- Tile-based design aligns with a navigation grid; each tile is a potential step.
- Flat tiles and terrain flattening on placement ensure buildings sit on walkable ground.
- **Automatic paths between buildings** — Paths connect placed buildings; terrain along paths is smoothed and recolored for easier navigation and visual clarity.
- Pathfinding: A* on tile graph ✓; Future: walkability flags, ramp/slope tools for connectivity.
- Generation parameters (roughness, elevation, island shape) should favor navigable land over impassable terrain.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Tile-Based Design](#2-tile-based-design)
3. [Default Generation Config](#3-default-generation-config)
4. [Edit Controls — Blocky Theme & Elevation](#4-edit-controls--blocky-theme--elevation) (incl. Input Controls)
5. [Building Placement](#5-building-placement) (incl. Props & Decorations)
6. [Save/Load — Config & Example JSON](#6-saveload--config--example-json)
7. [Implementation Roadmap](#7-implementation-roadmap) (incl. Phase H: Props, Phase G: Paths)
8. [Edit Mode & Prop Placement Plan](#8-edit-mode--prop-placement-plan) (→ ISLAND_RESEARCH.md)
9. [Improvement Suggestions](#9-improvement-suggestions)

---

## 1. Current State

### 1.1 Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| **Tile-based generation** | ✓ | Per-tile noise; flat tiles for building |
| Simplex noise terrain | ✓ | Multi-octave, seeded |
| Island mask | ✓ | Radial falloff, elongation, coast irregularity |
| Elevation colors | ✓ | Beach, grass, rock, snow by height |
| **Island themes** | ✓ | Normal, Volcanic, Icey, Swampy — terrain color schemes |
| **Tile-aligned brush** | ✓ | 1×1–5×5 tiles; snaps to grid |
| Brush editor | ✓ | Raise, lower, flatten, absolute, set, plateau, smooth |
| **Building placement** | ✓ | Place, remove, rotate; validation (land, no overlap); terrain flattening on placement |
| **Terrain flattening** | ✓ | Buildings placed on flat ground (average height of footprint) |
| **Controls modal** | ✓ | Settings (⚙) button opens mouse/keyboard input help |
| **Placement preview** | ✓ | Ghost building at cursor; red overlay for invalid tile |
| **Island properties** | ✓ | Name, description, trait, treasure, port type, hazard, faction, rumors (like map-generator-poc) |
| **Building selection** | ✓ | Click building to select; properties panel with Rotate/Remove |
| **Cargo size** | ✓ | Buildings get cargoSize = width × height × 10 when placed |
| Save/Load | ✓ | JSON height map + config + buildings + island properties |
| Orbit controls | ✓ | Pan, zoom, rotate |
| **Automatic paths** | ✓ | A* pathfinding (MST); terrain smoothing; path color (dirt); path width (1–5 tiles) |
| **Props & decorations** | ✓ | FBX from 3D_Models; editable transform (Tile X/Y, Rotation, Offset X/Y/Z, Scale 0.25–100); 3D gizmo controls |

### 1.2 Recent fixes
- Edit mode hover overlay: fixed missing `ts` (tileSize) in onHoverTile callback — highlight now displays correctly
- Edit tools selection accuracy: raycaster excludes overlay (layer 1); terrain on layer 0; explicit `recursive: false`; guard for `tilesX/tilesY <= 0`
- Camera/Edit conflict: Edit/Build mode uses Right-drag for orbit; Left-drag for painting/placing; Space+Left temporarily orbits
- **Building/terrain render update:** `_clearBuildings` and `_clearGridOverlay` now remove meshes from their actual parent (`islandMesh`) instead of `scene` — buildings and grid overlay are children of `islandMesh`, so `scene.remove()` had no effect; old meshes were never removed, causing stale or broken rendering
- **Automatic paths:** `IslandPathfinder.js` — A* pathfinding between building centers; `smoothPathTerrain` flattens path tiles; `IslandVisualizer` applies `pathColor` (dirt) to path vertices; paths recompute when buildings change (add/remove/move), on load, and on regeneration
- **Rendering optimizations (FPS):** WebGL `powerPreference: 'high-performance'`; BasicShadowMap (was PCFSoft); shadow map 512×512 (was 1024); tightened directional light shadow frustum to island bounds; gizmo removed from scene when detached; gizmo size update throttled to every 10 frames (only when attached); reused Vector3 in animate loop; optional Shadows toggle in Display panel for FPS boost
- **Prop selection:** `pickPropAt` raycasts against prop meshes directly (not island mesh), so terrain never occludes trees; trees and tall props are selectable
- **Prop transform:** Offset Z (height above terrain), Scale (0.25–100); immediate render on gizmo drag for accurate mouse alignment
- **Phase G Connectivity check:** Warn when placing building would isolate it (no path to others); optional toggle; amber preview when isolated; toast on placement
- **Phase G Building zone hints:** Zone hints checkbox; green overlay on viable placement tiles; updates when buildings/type change

### 1.3 Gaps

- ~~No building placement or building types~~ ✓ Phase E
- ~~Edit UI is generic; no blocky/nautical theme~~ ✓ Phase B
- ~~Elevation controls are coarse (brush only; no level presets)~~ ✓ Phase B
- ~~Save/Load does not restore UI state~~ ✓ Phase C
- ~~No example JSON templates for common presets~~ ✓ Phase C
- **Paths & navigation** — Automatic paths (MST) ✓; path width (1–5 tiles) ✓; ramp tool ✓; remaining: connectivity check, generation tuning (Phase G)
- ~~Props & decorations~~ ✓ Phase H

---

## 2. Tile-Based Design

### 2.1 Overview

The island is divided into a **tile grid**. Each tile is a flat (or near-flat) unit, making it easy to place buildings of different sizes on level terrain. **The tile grid is also the navigation graph** — paths between buildings and player movement are tile-to-tile.

| Concept | Description |
|---------|-------------|
| **Tile** | A square region of vertices (e.g. 8×8). All vertices in a tile share the same base height. One tile = one navigation cell. |
| **Tile size** | Vertices per tile side (4, 8, 16, 32). Grid size must be divisible by tile size. |
| **Tile variation** | Optional per-vertex noise within a tile (0 = perfectly flat). Low variation keeps tiles walkable. |

### 2.2 Navigation & Paths

- **Walkable tiles** — Land above sea level is traversable; water tiles block movement.
- **Paths** — Routes between buildings follow the tile grid. Adjacent walkable tiles form edges in the navigation graph.
- **Automatic paths** — Paths are automatically generated between placed buildings. Terrain along paths is smoothed for easier navigation, and path tiles use a distinct color (e.g. dirt, sand) for visual clarity.
- **Building zones** — Contiguous flat land provides viable placement and path endpoints.
- **Connectivity** — Steep slopes or cliffs (future: slope threshold) may block movement; ramps and gentle terrain connect areas.

### 2.3 Generation

- Noise is sampled **per tile** (at tile center), not per vertex.
- Each tile gets a single height from the island mask + noise.
- Vertices in a tile inherit that height; optional `tileVariation` adds micro-variation.
- Result: flat tiles ideal for building placement **and** navigation.
- Generation should favor **contiguous land** and **moderate elevation** so building zones and paths are viable.

### 2.4 Edit Tools

- **Brush size** is in tiles: 1×1 through 5×5 (matches building sizes).
- Click **snaps to tile** — modifies whole tile(s), not arbitrary radius.
- All vertices in the affected tiles are updated together.
- Ensures edited areas stay flat and aligned to the building grid.

### 2.5 Building Sizes (Pirate Game)

| Building | Tiles | Brush size | Notes |
|----------|-------|------------|-------|
| Tavern, Shipwright, Market | 2×1 | 2×2 | Port buildings |
| Lighthouse | 1×1 | 1×1 | Tall, narrow |
| Warehouse | 2×2 | 2×2 | Cargo storage |
| Fort | 3×2 | 3×3 | Defense structure |
| Docks | 3×1 | 3×3 | **Can extend over water/edge** |
| Dragon Sanctuary | 3×3 | 3×3 | Large refuge |
| Castle | 3×3 | 3×3 | Store cargo, gold, receive tax |
| Blacksmith | 2×1 | 2×1 | Cannons, cannonballs, swords |
| Custom | 1×1–5×5 | — | User-defined |

### 2.6 Prop Sizes (Decorations)

All props are **1×1 tile**. Props from `3D_Models/Props` (FBX):

| Prop | Tiles | Asset | Notes |
|------|-------|-------|-------|
| BerryBush_01 | 1×1 | BerryBush_01.fbx | Berry bush, foliage |
| BerryBush_02 | 1×1 | BerryBush_02.fbx | Berry bush variant 2 |
| OakTree_01 | 1×1 | OakTree_01.fbx | Oak tree, inland |
| PalmTree_01 | 1×1 | PalmTree_01.fbx | Palm tree variant 1 |
| PalmTree_02 | 1×1 | PalmTree_02.fbx | Palm tree variant 2 |
| Rock_01 | 1×1 | Rock_01.fbx | Standard rock, boulder |
| Rock_06 | 1×1 | Rock_06.fbx | Brimstone rock (volcanic) |
| Sign | 1×1 | — | Placeholder; no 3D model yet |

---

## 3. Default Generation Config

Default settings (matching reference UI). Parameters are tuned to produce **navigable terrain** with viable building zones and contiguous land.

| Parameter | Value | Description |
|-----------|-------|-------------|
| Grid size | 1080 | Vertices per side (clamped to divisible by tile size) |
| Elevation | 80% | Max height multiplier |
| Roughness | 70% | Terrain bumpiness |
| Island radius | 70% | Island size (0–1 scale) |
| Coast falloff | 3.5 | Coast steepness |
| Coast irregularity | 25% | Coastline wobble |
| Elongation | 80% | Taller island shape |
| Sea level | 0.12 | Water level |
| Tile size | 16 | Vertices per tile (building grid) |
| Tile variation | 0% | Per-vertex noise within tile (0 = flat) |
| Path width | 1 | Path width in tiles (1–5); slider in Buildings section |
| Octaves | 3 | Noise detail layers |
| Frequency | 1.0 | Base noise frequency |
| Persistence | 0.75 | Octave amplitude falloff |
| Lacunarity | 2.6 | Octave frequency multiplier |
| Height scale | 50% | Visual height multiplier |
| Seed | 1 | Reproducible generation |

---

## 4. Edit Controls — Blocky Theme & Elevation

### 4.1 Blocky / Nautical Theme

**Goal:** Edit panel feels like a ship’s chart or blocky UI.

| Element | Change |
|---------|--------|
| Panels | Sharp corners, thick borders, chart-paper background |
| Buttons | Blocky rectangles, nautical icons (anchor, compass) |
| Sliders | Chunky thumbs, stepped ticks |
| Typography | Monospace or condensed sans for labels |
| Colors | Teal/blue accents, parchment/cream backgrounds |
| Icons | Simple SVG: raise (↑), lower (↓), flatten (≡), brush (◉) |

**CSS variables:**
```css
--block-border: 2px solid #2a3548;
--block-radius: 0;
--block-bg: #1a2332;
--block-accent: #0ea5e9;
--block-paper: #fef3c7;
```

### 4.2 Better Elevation Controls

| Control | Purpose |
|---------|---------|
| **Level presets** | Buttons: Sea level, Beach, Grass, Rock, Snow — set brush target height |
| **Absolute mode** | Gradual brush toward target height |
| **Set mode** | Instant set to target height (one click = done) |
| **Plateau brush** | Flatten to height at cursor (click point) within brush |
| **Smooth mode** | Laplacian-style blend with neighbors |
| **Apply mode** | Click-only (one per click) or Drag (continuous) |
| **Ramp tool** | ✓ Click A, click B — create smooth slope between |
| **Undo/Redo** | Stack of height-map states (limit N) |
| **Elevation readout** | Show height under cursor (HUD) |
| **Contour overlay** | ✓ Toggle contour lines at fixed intervals (0.1) |
| **Min/Max clamp** | Sliders to clamp elevation range (e.g. 0.1–0.8) |

**Elevation band reference:**
- Water: &lt; sea level
- Beach: sea level → 0.2
- Grass: 0.2 → 0.45
- Rock: 0.45 → 0.7
- Snow: &gt; 0.7

### 4.3 Input Controls (Settings Modal)

The **Settings (⚙)** button (bottom-left) opens a modal documenting all mouse/keyboard controls:

| Mode | Input | Action |
|------|-------|--------|
| **View** | Left drag | Orbit camera |
| | Right drag | Pan camera |
| | Scroll | Zoom |
| **Edit** | E | Toggle Edit mode |
| | 1–8 | Select brush tool (Raise, Lower, Flatten, Absolute, Set, Plateau, Smooth, Ramp) |
| | B | Cycle brush size |
| | Ctrl+Z / Ctrl+Y | Undo / Redo |
| | Left drag | Paint terrain |
| | Left click (Ramp) | Click A, then B — create slope; Right-click or Esc to cancel |
| | Right drag | Orbit camera |
| | Space + Left drag | Temporarily orbit |
| | Scroll | Zoom |
| **Build** | Left click | Place building |
| | Left click on building | Select building (opens properties panel) |
| | Shift + Left click on building | Remove building |
| | Right drag | Orbit camera |
| | Scroll | Zoom |

---

## 5. Building Placement — Pirate Game (Shattered Seas)

### 5.1 Pirate Building Types

Buildings for the **YoHoH** pirate game — islands in the Shattered Seas where players build ports, defend against Kings, and rescue dragons.

| Type | Size (tiles) | Purpose | Pirate Theme |
|------|--------------|---------|--------------|
| **Tavern** | 2×1 | Port hub, crew morale | Rum shack, gathering spot |
| **Shipwright** | 2×1 | Repairs, ship upgrades | Dry dock, hull repairs |
| **Market** | 2×1 | Trade, supplies | Black market, trading post |
| **Lighthouse** | 1×1 | Navigation, visibility | Beacon, fog warning |
| **Warehouse** | 2×2 | Cargo, supplies | Cargo hold, loot storage |
| **Fort** | 3×2 | Defense, garrison | Watchtower, cannon battery |
| **Docks** | 3×1 | Ship mooring | Pier, landing stage — **can extend over water** |
| **Dragon Sanctuary** | 3×3 | Dragon refuge | Hatchery, protected cove |
| **Castle** | 3×3 | Island owner HQ | Store cargo for building; gold/pieces-of-eight for crew wages; receive tax from buildings and player trading |
| **Blacksmith** | 2×1 | Crafting, arms | Cannons, cannonballs, swords |
| **Custom** | 1×1 to 5×5 | User-defined | — |

### 5.2 Placeable Props & Decorations

Natural and decorative objects for island atmosphere. All are **1×1 tile**; no terrain flattening (they sit on existing terrain). Props use FBX models from `3D_Models/Props`.

| Type | Size | Asset Path | Purpose | Theme |
|------|------|------------|---------|-------|
| **BerryBush_01** | 1×1 | `Props/BerryBush_01/BerryBush_01.fbx` | Low vegetation, berries | Path edges, building surrounds |
| **BerryBush_02** | 1×1 | `Props/BerryBush_02/BerryBush_02.fbx` | Berry bush variant 2 | Foliage variety |
| **OakTree_01** | 1×1 | `Props/OakTree_01/OakTree_01.fbx` | Forest, shade | Inland, grassy areas |
| **PalmTree_01** | 1×1 | `Props/PalmTree_01/PalmTree_01.fbx` | Tropical vegetation | Beach, shoreline |
| **PalmTree_02** | 1×1 | `Props/PalmTree_02/PalmTree_02.fbx` | Palm variant 2 | Beach, shoreline |
| **Rock_01** | 1×1 | `Props/Rock_01/Rock_01.fbx` | Terrain detail, boulders | Coastal rocks, inland outcrops |
| **Rock_06** | 1×1 | `Props/Rock_06/Rock_06.fbx` | Volcanic/brimstone rock | Hazard zones, lava areas |
| **Sign** | 1×1 | — | Wayfinding, lore, labels | Placeholder; no 3D model yet |

**3D_Models/Props inventory (source assets):**

| Folder | FBX | Textures |
|--------|-----|----------|
| BerryBush_01 | BerryBush_01.fbx | _texture.png, _metallic, _normal, _roughness |
| BerryBush_02 | BerryBush_02.fbx | _texture.png, _metallic, _normal, _roughness |
| OakTree_01 | OakTree_01.fbx | _texture.png, _metallic, _normal, _roughness |
| PalmTree_01 | PalmTree_01.fbx | _texture.png, _metallic, _normal, _roughness |
| PalmTree_02 | PalmTree_02.fbx | _texture.png, _metallic, _normal, _roughness |
| Rock_01 | Rock_01.fbx | _texture.png, _metallic, _normal, _roughness |
| Rock_06 | Rock_06.fbx | _texture.png, _metallic, _normal, _roughness |

**Placement rules for props:**
- Snap to tile grid
- Placement only on land (height &gt; sea level)
- No terrain flattening — props sit on existing terrain
- Props may overlap with each other (e.g. bush + rock on same tile) or be exclusive — TBD
- Buildings and props: props may be placed adjacent to buildings; buildings block prop placement on their footprint

### 5.3 Placement Rules

- Buildings snap to chunk grid
- Placement only on land (height &gt; sea level) — **except Docks**
- **Docks over water:** Docks (`allowOverWater: true`) may extend over water tiles and beyond the grid edge; at least one tile must be on land; water tiles in footprint are raised to dock deck height
- **Terrain flattening:** On placement, terrain under the building footprint is flattened to the average height of land tiles; water tiles (docks only) set to sea level + 0.02
- Collision: no overlap with existing buildings
- Visual: simple placeholder meshes (box) per type
- **Navigation context:** Placed buildings become path endpoints; automatic paths connect them. Future: connectivity validation.

### 5.4 Data Model

```js
{
  "name": "Skull Harbor",
  "description": "A treacherous place. Sailors speak of it in hushed tones.",
  "dangerous": true,
  "appealing": false,
  "treasureLevel": 2,
  "portType": "outpost",
  "hazard": "reefs",
  "faction": "pirate",
  "rumors": "",
  "buildings": [
    {
      "id": "b1",
      "type": "tavern",
      "chunkX": 4,
      "chunkY": 3,
      "rotation": 0,
      "cargoSize": 20  // width × height × 10 (based on placed size)
    },
    {
      "id": "b2",
      "type": "dragon_sanctuary",
      "chunkX": 8,
      "chunkY": 6,
      "rotation": 90,
      "cargoSize": 90
    }
  ],
  // pathTiles: ["tx,ty", ...] — derived at runtime from buildings; not saved
}
```

### 5.5 Pirate Building Reference (Shattered Seas)

| Building | Lore / Game Role |
|----------|------------------|
| **Tavern** | Where crews rest, rumors spread, and deals are struck. |
| **Shipwright** | Essential for repairs after battles with Kings or storms. |
| **Market** | Trade goods, dragon eggs (carefully), and supplies. |
| **Lighthouse** | Guides ships through fog; warns of ghost fleets (Veilwake Sea). |
| **Warehouse** | Store loot, supplies, and rescued dragon eggs. |
| **Fort** | Defend against King raids; cannon batteries for naval defense. |
| **Docks** | Moor ships; embark for rescue missions. |
| **Dragon Sanctuary** | Safe haven for rescued eggs and young dragons; core of player mission. |
| **Castle** | Island owner's seat. Store cargo for building, gold/pieces-of-eight for crew wages, receive tax from buildings and player trading. |
| **Blacksmith** | Craft and sell cannons, cannonballs, and swords. |

### 5.6 UI

- **Buildings** section in right panel (top-level, above Map Editor)
- **Build Mode** toggle — enables placement mode; mutually exclusive with Edit Mode
- **Building palette** — visual colored buttons per type (Tavern, Shipwright, Market, etc.)
- **Size** — width × height (tiles, 1–5) — configurable per building type; overrides default dimensions
- **Grid** checkbox — optional tile grid overlay
- **Path width** — Slider 1–5 tiles (wider paths = more vertices smoothed and colored)
- **Placement preview** — Ghost building at cursor; red overlay on invalid tile (water, overlap)
- **Building properties** — Click building to select; panel shows type, position, size, cargo; Rotate/Remove buttons
- Click tile to place; click building to select (properties panel); Shift+click building to remove; Rotate/Remove in panel
- Validation: placement blocked on water or overlap

### 5.7 Implementation Architecture

| Module | File | Responsibility |
|--------|------|----------------|
| **BuildingTypes** | `BuildingTypes.js` | Defines building types: `id`, `width`, `height`, `name`, `color` (hex). Exports `BUILDING_TYPES`, `getBuildingType()`, `getBuildingSize()`. |
| **IslandBuildingPlacer** | `IslandBuildingPlacer.js` | Handles mouse input, tile hit-testing (raycaster), placement/remove/select logic, terrain flattening, validation. `onBuildingSelect` fires on click; cargoSize = width×height×10 on place. Calls `visualizer.renderBuildings()` and callbacks. |
| **IslandPathfinder** | `IslandPathfinder.js` | A* pathfinding between building centers; MST (Prim's) for building connectivity; `expandPathTiles` (path width 1–5); `computePathTiles`, `smoothPathTerrain`, `computePathsBetweenBuildings`. Exports `PATH_COLOR`, `computePathsBetweenBuildings`. |
| **IslandVisualizer** | `IslandVisualizer.js` | Renders building meshes (`renderBuildings()`), tile grid overlay (`setTileGridOverlay()`), path vertex coloring (`pathTiles` + `pathColor`), placement preview (`setPlacementPreview`). Props: `renderProps()` uses FBX from PropMeshLoader (fallback placeholder); `setPropPlacementPreview()`, `setPropHighlight()`; `pickPropAt()` raycasts prop meshes for selection; TransformControls for gizmo (move/rotate/scale). |
| **PropMeshLoader** | `PropMeshLoader.js` | Loads FBX from `/props/` (3D_Models/Props); caches by type; `loadPropMesh()`, `getPropMeshClone()`; fallback to placeholder on load failure. |
| **main.js** | `main.js` | Wires Build Mode UI, `onBuildingsChange`, `onHeightMapChange`; calls `computePathsBetweenBuildings` when buildings change; updates `currentIsland`, editor, visualizer when buildings or terrain change. Phase H: wire Place Mode (Buildings/Props tabs), IslandPropPlacer, props save/load. |
| **PropTypes** | `PropTypes.js` | Defines prop types (berry_bush_01, oak_tree_01, palm_tree_01/02, rock_01/06, sign); `fbxPath`, `placeholderShape`. Exports `PROP_TYPES`, `getPropType()`. |
| **IslandPropPlacer** | `IslandPropPlacer.js` | Handles prop placement (1×1); land-only; no overlap with buildings; no terrain flattening. `onPropsChange`, `onPropHover`, `onPropSelect`. Calls `visualizer.renderProps()` (when wired). |

**Data flow:**
1. User enables Build Mode → `buildingPlacer.enable(container)`; `setHeightMap`, `setTileConfig`, `setSeaLevel`, `setBuildings` from `currentIsland`
2. User clicks → `_handleMouse` → `_getTileAtCursor()` (raycaster + UV → tile coords)
3. If placing: `_canPlace()` validates → `_flattenUnderBuilding()` → `onHeightMapChange(newHeightMap)` → push building → `visualizer.renderBuildings(buildings, …)` → `onBuildingsChange(buildings)`
4. `main.js` callbacks: `onHeightMapChange` → `visualizer.updateFromHeightMap` (terrain); placer calls `visualizer.renderBuildings` (buildings)
5. **Paths:** `onBuildingsChange` → if ≥2 buildings, `computePathsBetweenBuildings` → updates `heightMap` (smoothed), `pathTiles` → `visualizer.updateFromHeightMap(heightMap, pathTiles, tileSize)`; undo/redo/height-scale preserve `pathTiles`

### 5.8 Terrain Flattening Algorithm

When a building is placed, `_flattenUnderBuilding()` in `IslandBuildingPlacer`:

1. **Footprint bounds** — For building at `(chunkX, chunkY)` with size `(w, h)` tiles:
   - Vertex range: `x0..x1` = `chunkX * tileSize` to `(chunkX + w) * tileSize`
   - Vertex range: `y0..y1` = `chunkY * tileSize` to `(chunkY + h) * tileSize`
2. **Average height** — Sum all vertex heights in footprint, divide by count
3. **Flatten** — Set every vertex in footprint to the average
4. **Propagate** — Call `onHeightMapChange(newHeightMap)` so `main.js` updates `currentIsland`, editor, and visualizer

Result: building sits on a flat platform; terrain is modified in place before the building is added.

### 5.9 Tile Hit-Testing (Raycaster)

- Three.js `Raycaster` from camera through mouse position
- Intersect island mesh (layer 0); hit `uv` maps to normalized (0–1) island coords
- Tile indices: `tx = floor(u * tilesX)`, `ty = floor(v * tilesY)`
- Fallback: if no UV, use `worldToLocal` on hit point to derive u,v

### 5.10 Building Type Schema (BuildingTypes.js)

```js
// Each building type (default dimensions)
{
  id: string,         // e.g. "tavern"
  width: number,      // tiles (1–5)
  height: number,     // tiles (1–5)
  name: string,       // display name
  color: number,      // Three.js hex (0xd97706 = amber for Tavern)
  allowOverWater?: boolean  // if true, can extend over water/edge (e.g. Docks)
}

// canPlaceOverWater(type) — returns true for Docks
// Runtime dimension overrides: setBuildingDimensionOverride(type, width?, height?)
// getEffectiveBuildingSize(type) returns override or default
```

### 5.11 Props Data Model

Props use types from `3D_Models/Props`. Each type maps to an FBX asset. Props are rendered with FBX meshes (fallback: placeholder). Selected props have editable transform (Tile X/Y, Rotation, Offset X/Y/Z, Scale) via UI and 3D gizmo.

```js
{
  "props": [
    { "id": "p1", "type": "rock_01", "chunkX": 5, "chunkY": 4, "rotation": 0, "offsetX": 0, "offsetY": 0, "offsetZ": 0, "scale": 1 },
    { "id": "p2", "type": "rock_06", "chunkX": 6, "chunkY": 4, "rotation": 0 },
    { "id": "p3", "type": "palm_tree_01", "chunkX": 3, "chunkY": 7, "rotation": 45, "scale": 8 },
    { "id": "p4", "type": "palm_tree_02", "chunkX": 4, "chunkY": 7, "rotation": 90 },
    { "id": "p5", "type": "oak_tree_01", "chunkX": 8, "chunkY": 6, "rotation": 0 },
    { "id": "p6", "type": "berry_bush_01", "chunkX": 6, "chunkY": 5, "rotation": 90 },
    { "id": "p7", "type": "sign", "chunkX": 7, "chunkY": 4, "rotation": 0 }
  ]
}
```

**Prop type IDs (from 3D_Models/Props):** `berry_bush_01`, `berry_bush_02`, `oak_tree_01`, `palm_tree_01`, `palm_tree_02`, `rock_01`, `rock_06`, `sign`

**Transform fields:** `chunkX`, `chunkY` (tile position); `rotation` (0–360°); `offsetX`, `offsetY` (fine sub-tile offset); `offsetZ` (height above terrain, -0.5 to 0.5); `scale` (0.25–100). Editable in Selected Prop panel and via 3D gizmo (W/E/R modes, Q space, X snap). See [ISLAND_GEN_GIZMOS.md](ISLAND_GEN_GIZMOS.md).

**Migration:** Old saves with generic types (`rock`, `palm_tree`, `tree`, `bush`) map to: `rock`→`rock_01`, `palm_tree`→`palm_tree_01`, `tree`→`oak_tree_01`, `bush`→`berry_bush_01`.

### 5.12 Automatic Paths Between Buildings

**Goal:** Automatically generate paths between placed buildings to improve navigation and visual clarity.

| Feature | Description |
|---------|-------------|
| **Path generation** | When buildings are placed, compute paths between them (e.g. A* on tile graph). Paths connect building entrances or tile centers. |
| **Terrain smoothing** | Smooth the terrain along each path — flatten or gently slope vertices under the path so navigation is easier (no steep steps, consistent walkable surface). |
| **Path color** | Apply a distinct color to path tiles (e.g. dirt, sand, stone) so paths are visually distinguishable from grass/rock. Override elevation-based vertex colors for path vertices. |
| **Path width** | ✓ Configurable path width (1–5 tiles); iteratively expands path tiles by cardinal neighbors; wider paths = more vertices smoothed and colored. |
| **Update on change** | Recompute paths when buildings are added, removed, or moved. |

**Implementation notes (implemented):**
- Pathfinding: A* on tile grid (`IslandPathfinder.findPath`) between building pairs; Prim's MST selects which pairs to connect (minimal total path length); walkable = land above sea level; 8-directional movement.
- Terrain smoothing: `smoothPathTerrain` sets vertex heights to average of each path tile footprint (in-place heightmap modification).
- Path color: `pathTiles` (Set of `"tx,ty"` keys); `IslandVisualizer` uses `config.pathColor` (default `0x8B7355` dirt) for path vertices instead of elevation band color.
- Path width: `config.pathWidth` (1–5); `expandPathTiles` iteratively adds cardinal neighbors; UI slider in Buildings section; persisted in config on save.
- Data model: Paths derived at runtime from buildings; `pathTiles` stored in `currentIsland` for undo/redo/height-scale; not persisted in save (recomputed on load from buildings).

### 5.14 Island Properties (like map-generator-poc)

Islands have editable properties similar to map-generator-poc nodes:

| Property | Description |
|----------|-------------|
| **name** | Procedurally generated (e.g. "Skull Harbor"); editable |
| **description** | Flavor text; generated from trait |
| **theme** | Terrain color scheme: normal, volcanic, icey, swampy |
| **trait** | normal, dangerous, appealing |
| **treasureLevel** | 0–3 |
| **portType** | none, port, harbor, outpost |
| **hazard** | none, reefs, storms, treacherous |
| **faction** | neutral, british, spanish, french, pirate |
| **rumors** | Quest hooks, custom text |

**Implementation:** `IslandGenerator` generates name and properties on creation; Island Properties panel in right sidebar; persisted in save/load.

### 5.14a Island Themes

The **theme** property adjusts the default terrain color scheme for elevation bands (water, beach, grass, rock, snow):

| Theme | Water | Beach | Grass | Rock | Snow |
|-------|-------|-------|-------|------|------|
| **Normal** | Blue | Sand | Green | Gray | White |
| **Volcanic** | Dark blue | Ash | Brown | Lava | Red |
| **Icey** | Ice blue | Pale | Light blue-gray | Slate | White |
| **Swampy** | Dark green | Mud | Dark green | Moss | Ochre |

Theme is selectable in the Island Properties panel; changing it updates terrain colors immediately. Persisted in save/load.

### 5.15 Building Cargo Size

When a building is placed, `cargoSize = width × height × 10` (e.g. 2×2 = 40 units). Stored on building; migrated for old saves without cargoSize.

### 5.16 Future Building & Props Enhancements

| Enhancement | Description |
|-------------|-------------|
| **Building icons** | Visual palette with icons per type instead of dropdown |
| **Placement preview** | ✓ Ghost building at cursor before click; invalid overlay (red) when water/overlap |
| **Invalid feedback** | ✓ Red overlay when hovering over invalid tile (water, overlap) |
| **Building properties panel** | ✓ Click building to select; panel shows type, position, size, cargo; Rotate/Remove buttons |
| **Distinct meshes** | Per-type geometry (cylinder for lighthouse, etc.) instead of boxes |
| **Undo/Redo for buildings** | Stack of building placement/removal actions |
| **Path-aware placement** | Validate that new buildings remain reachable from existing ones |
| **Props & decorations** | BerryBush_01, OakTree_01, PalmTree_01/02, Rock_01/06, Sign — 1×1 placeable (Phase H; foundation partial) |

---

## 6. Save/Load — Config & Example JSON

### 6.1 Save Modes

| Mode | Contents | Use case |
|------|----------|----------|
| **Full** | heightMap + config + display + buildings + island properties + theme + seed | Complete island ✓ |
| **Config only** | config + display + seed + island properties + theme (no heightMap, no buildings) | Preset for regeneration ✓ |

### 6.2 Load Behavior

- **Full load:** Restore height map, config, display, buildings, island properties, theme; sync UI sliders from config; populate Island Properties panel
- **Config load (no heightMap):** Regenerate terrain from config; merge island properties, theme, and buildings from file; paths recomputed if ≥2 buildings
- **Preset load:** Load example JSON; apply config, display, island properties, theme; regenerate if no heightMap

### 6.3 Example JSON Files

**`examples/compact-island.json`** — Small, round, few chunks:
```json
{
  "version": 1,
  "config": {
    "gridSize": 64,
    "elevationScale": 1.2,
    "islandRadius": 0.45,
    "coastFalloff": 2.5,
    "coastIrregularity": 0.2,
    "elongation": 0.5,
    "seaLevel": 0.12,
    "terrainRoughness": 0.6,
    "tileSize": 8,
    "tileVariation": 0,
    "noiseOctaves": 4,
    "frequency": 2.5,
    "persistence": 0.5,
    "lacunarity": 2.0,
    "pathWidth": 1
  },
  "display": { "heightScale": 1.0, "wireframe": false },
  "seed": 42,
  "name": "", "description": "", "dangerous": false, "appealing": false,
  "treasureLevel": 0, "portType": "none", "hazard": "none", "faction": "neutral", "rumors": ""
}
```

**`examples/flat-building-zone.json`** — Large flat area for building:
```json
{
  "version": 1,
  "config": {
    "gridSize": 128,
    "elevationScale": 1.0,
    "islandRadius": 0.7,
    "coastFalloff": 3.0,
    "coastIrregularity": 0.15,
    "elongation": 0.5,
    "seaLevel": 0.12,
    "terrainRoughness": 0.4,
    "tileSize": 8,
    "tileVariation": 0,
    "noiseOctaves": 3,
    "frequency": 1.5,
    "persistence": 0.6,
    "lacunarity": 2.2,
    "pathWidth": 1
  },
  "display": { "heightScale": 0.6, "wireframe": false },
  "seed": 123,
  "name": "", "description": "", "dangerous": false, "appealing": false,
  "treasureLevel": 0, "portType": "none", "hazard": "none", "faction": "neutral", "rumors": ""
}
```

**`examples/full-island-with-buildings.json`** — Complete preset with buildings + island properties:
```json
{
  "version": 1,
  "config": {
    "gridSize": 128,
    "elevationScale": 1.44,
    "islandRadius": 0.62,
    "coastFalloff": 3.5,
    "coastIrregularity": 0.25,
    "elongation": 0.8,
    "seaLevel": 0.12,
    "terrainRoughness": 0.7,
    "tileSize": 8,
    "tileVariation": 0,
    "noiseOctaves": 5,
    "frequency": 1.0,
    "persistence": 0.75,
    "lacunarity": 2.6,
    "pathWidth": 2
  },
  "display": { "heightScale": 0.5, "wireframe": false },
  "buildings": [
    { "id": "b1", "type": "tavern", "chunkX": 6, "chunkY": 6, "rotation": 0, "cargoSize": 20 },
    { "id": "b2", "type": "shipwright", "chunkX": 8, "chunkY": 6, "rotation": 0, "cargoSize": 20 },
    { "id": "b3", "type": "market", "chunkX": 7, "chunkY": 7, "rotation": 90, "cargoSize": 20 },
    { "id": "b4", "type": "dragon_sanctuary", "chunkX": 4, "chunkY": 4, "rotation": 0, "cargoSize": 90 }
  ],
  "seed": 1,
  "name": "Skull Harbor",
  "description": "A treacherous place. Sailors speak of it in hushed tones.",
  "dangerous": true,
  "appealing": false,
  "treasureLevel": 2,
  "portType": "outpost",
  "hazard": "reefs",
  "faction": "pirate",
  "rumors": "Rumors of a hidden cove to the east."
}
```

*Note: Presets omit `heightMap` (regenerate on load). Full saves include `heightMap` for exact terrain restore.*

### 6.4 Save/Load Schema

**Serialized fields (IslandSerializer):**

| Field | Full save | Config save | Description |
|-------|-----------|-------------|-------------|
| `version` | ✓ | ✓ | Schema version (1) |
| `heightMap` | ✓ | — | Terrain vertices (omitted = regenerate) |
| `config` | ✓ | ✓ | Generation config (gridSize, tileSize, pathWidth, etc.) |
| `display` | ✓ | ✓ | heightScale, wireframe |
| `buildings` | ✓ | — | Building list with id, type, chunkX, chunkY, rotation, cargoSize |
| `seed` | ✓ | ✓ | RNG seed |
| `name` | ✓ | ✓ | Island name |
| `description` | ✓ | ✓ | Flavor text |
| `dangerous` | ✓ | ✓ | Trait |
| `appealing` | ✓ | ✓ | Trait |
| `treasureLevel` | ✓ | ✓ | 0–3 |
| `portType` | ✓ | ✓ | none, port, harbor, outpost |
| `hazard` | ✓ | ✓ | none, reefs, storms, treacherous |
| `faction` | ✓ | ✓ | neutral, british, spanish, french, pirate |
| `rumors` | ✓ | ✓ | Quest hooks |

**Load behavior:** Before serialize, `applyIslandPropertiesFromUI()` captures latest form values. On load without heightMap, island properties from file override procedural defaults.

---

## 7. Implementation Roadmap

### Phase A: Defaults & Config (Current)
- [x] Update defaults to match reference image
- [x] Add `default-config.json`
- [x] Create `ISLAND_GENERATOR.md`

### Phase B: Blocky Theme & Elevation ✓
- [x] Blocky/nautical CSS theme for edit panel
- [x] Level preset buttons (Sea, Beach, Grass, Rock, Snow)
- [x] Absolute brush mode
- [x] Plateau brush
- [x] Elevation readout under cursor
- [x] Undo/Redo (height map stack)

### Phase C: Save/Load Improvements ✓
- [x] Save Config Only option
- [x] Load restores UI sliders from config
- [x] `examples/` folder with preset JSONs
- [x] Load Preset dropdown or file picker

### Phase D: Tile-Based Generation & Edit ✓
- [x] Tile-based generation (per-tile noise, flat tiles)
- [x] Tile-aligned brush (1×1, 2×2, 3×3)
- [x] Tile size + tile variation config

### Phase E: Building Placement (Pirate Game) ✓
- [x] Building type definitions (tavern, shipwright, market, lighthouse, warehouse, fort, docks, dragon_sanctuary)
- [x] Tile grid overlay (optional)
- [x] Place/remove/rotate buildings
- [x] Building validation (land, no overlap)
- [x] Terrain flattening on placement (average height of footprint)
- [x] Include buildings in save/load

### Phase F: Polish

*See [ISLAND_RESEARCH.md](ISLAND_RESEARCH.md) §7 for phased implementation plan.*

- [x] Settings (⚙) button — opens Controls modal with mouse/keyboard input help
- [x] Controls modal documents View, Edit, and Build mode inputs
- [x] Buildings section moved to top-level in right panel (no Edit Mode required)
- [x] Placement preview — ghost building at cursor; red overlay for invalid tile (water, overlap)
- [x] Ramp tool (click A, click B — smooth slope)
- [x] Contour overlay toggle
- [x] Min/Max elevation clamp
- [x] Brush tool bar as compact icon row; keyboard shortcuts (1–7, E, Z, Y, B)
- [ ] Performance: LOD or reduced grid for large sizes

### Phase H: Props & Decorations ✓

*Placeable natural and decorative objects for island atmosphere. Full UX plan: [ISLAND_RESEARCH.md](ISLAND_RESEARCH.md) §4. Assets from `3D_Models/Props` (FBX).*

- [x] **PropTypes.js** — berry_bush_01, oak_tree_01, palm_tree_01, palm_tree_02, rock_01, rock_06, sign (all 1×1; FBX paths)
- [x] **IslandPropPlacer.js** — placement logic; land-only; no overlap with buildings; selection callbacks
- [x] **IslandSerializer** — Include `props` array in serialize/deserialize
- [x] **IslandVisualizer** — `renderProps()`, `setPropPlacementPreview()`, `setPropHighlight()`; placeholder meshes per type
- [x] **main.js** — IslandPropPlacer; placeMode (Buildings/Props); callbacks; load/save props
- [x] **Place Mode UI** — [Buildings] [Props] tabs; prop palette; Selected Prop panel (Tile X/Y, Rotation, Offset X/Y/Z, Scale, Gizmo toolbar, Rotate, Remove)

### Phase G: Paths & Navigation (Partial ✓)

*Islands are generated and edited to support paths between buildings and player navigation.*

- [x] **Walkability model** — Land above sea level is walkable; used by A* pathfinding
- [x] **Pathfinding** — A* on tile graph (`IslandPathfinder.findPath`); 8-directional
- [x] **Path visualization** — Automatic paths rendered via path color on terrain
- [x] **Automatic paths between buildings** — `computePathsBetweenBuildings`; minimum spanning tree (Prim's) ensures all buildings connected; update on add/remove/move, load, regeneration
- [x] **Path terrain smoothing** — `smoothPathTerrain` flattens path tiles to average height
- [x] **Path color** — `pathColor` (dirt `0x8B7355`) applied to path vertices in `IslandVisualizer`
- [x] **Ramp tool** — Create traversable slopes between elevation levels (click A, click B)
- [x] **Building zone hints** — Highlight contiguous flat land suitable for placement (Zone hints checkbox; green overlay on viable tiles)
- [x] **Connectivity check** — Warn when placing building would isolate it (no path to others); optional toggle; amber preview when isolated
- [ ] **Generation tuning** — Parameters that favor navigable, path-friendly terrain

---

## 8. Edit Mode & Prop Placement Plan

**Full research and UX plan:** [ISLAND_RESEARCH.md](ISLAND_RESEARCH.md)

### 8.1 Edit Mode Vision (Summary)

| Enhancement | Description |
|-------------|-------------|
| **Brush tool bar** | Compact icon row (↑↓≡▣▭∿↗); shortcuts 1–8 |
| **Ramp tool** | ✓ Click A, click B — smooth slope between tiles |
| **Contour overlay** | ✓ Toggle contour lines at fixed elevation intervals (0.1) |
| **Min/Max clamp** | Sliders to clamp elevation range |
| **Elevation HUD** | Tile coords + band name (e.g. "Elev: 0.35 \| Tile: (12,8) \| Grass") |
| **Keyboard shortcuts** | E=Edit, 1–8=tools, Z/Y=undo/redo, B=brush size cycle |

### 8.2 Prop Placement Vision (Summary)

| Aspect | Plan |
|--------|------|
| **Mode** | Place Mode with [Buildings] [Props] tabs; mutually exclusive |
| **Prop types** | BerryBush_01, OakTree_01, PalmTree_01, PalmTree_02, Rock_01, Rock_06, Sign (all 1×1; from 3D_Models/Props) |
| **Palette** | Visual icon row; click to select; click tile to place |
| **Placement** | Land only; no terrain flattening; ghost preview |
| **Selection** | Click prop → properties panel (Rotate, Remove) |
| **Remove** | Shift+click prop or Eraser mode |
| **Save/Load** | `props` array in island JSON |

### 8.3 Implementation Phases (from ISLAND_RESEARCH.md)

1. **Edit Mode Polish** — ✓ Icon row, shortcuts, HUD, min/max clamp
2. **Edit Mode New Tools** — ✓ Ramp tool, contour overlay
3. **Prop Mode Foundation** — ✓ PropTypes, IslandPropPlacer, Serializer, Visualizer
4. **Prop Mode UI** — Place Mode tabs, palette, preview, properties
5. **Prop Mode Polish** — Selection, eraser, optional Sign text
6. **Unified UX Pass** — Layout consolidation, mode indicator, tooltips

---

## 9. Improvement Suggestions

Prioritized ideas to evolve the Island Generator. Use as a backlog for future phases.

### 9.1 Navigation & Pathfinding

| Suggestion | Description | Priority |
|------------|-------------|----------|
| **Building zone hints** | Highlight contiguous flat land suitable for placement (e.g. green overlay on viable tiles) | High |
| **Connectivity check** | Warn when placing a building would isolate it (no path to other buildings); optional validation toggle | High |
| **Path debug overlay** | Toggle to visualize path graph, MST edges, A* routes — useful for tuning and debugging | Medium |
| **Generation tuning** | Add parameters that favor navigable terrain (e.g. flatter inland, gentler slopes near coast) | Medium |
| **Walkability flags** | Per-tile flags for impassable terrain (cliffs, hazards); integrate with pathfinding | Low |

### 9.2 Props & Visuals

| Suggestion | Description | Priority |
|------------|-------------|----------|
| **Load FBX props** | Replace placeholder meshes with actual FBX models from `3D_Models/Props`; PBR textures (like docs 3D viewer) | High |
| **BerryBush_02** | Add BerryBush_02 to PropTypes; supports variety in foliage placement | Medium |
| **Prop scatter mode** | Paint/scatter multiple props in a brush area; density slider per type | Medium |
| **Procedural props** | Auto-scatter trees/rocks on unoccupied land; density by elevation band (e.g. palms near beach, oaks inland) | Low |
| **Building icons** | Visual palette with icons per building type instead of colored squares | Low |

### 9.3 Integration & Workflow

| Suggestion | Description | Priority |
|------------|-------------|----------|
| **Export to map-generator-poc** | Export island JSON for use as archipelago node; share building/prop schemas with main game | High |
| **Multi-island presets** | Quick generation of archipelago templates (e.g. 3-island cluster, linear chain) | Medium |
| **Share islands** | Copy JSON to clipboard; import from URL (e.g. GitHub Gist); community presets | Low |

### 9.4 Performance & Scale

**Implemented (2026-01-31):**
- WebGL `powerPreference: 'high-performance'` — prefers dedicated GPU
- BasicShadowMap — faster than PCFSoftShadowMap (softer shadows traded for FPS)
- Shadow map 512×512 — 4× fewer pixels than 1024×1024
- Tightened directional light shadow frustum to island bounds — better quality and FPS
- Gizmo removed from scene when detached — no per-frame work when idle
- Gizmo size update throttled to every 10 frames (only when attached) — avoids per-frame overhead
- Reused `Vector3` in animate loop — no per-frame GC pressure when prop selected
- Optional Shadows toggle in Display panel — disable for FPS boost
- Immediate render on gizmo `objectChange` — visual follows mouse accurately during drag

**Remaining suggestions:**

| Suggestion | Description | Priority |
|------------|-------------|----------|
| **LOD / reduced grid** | Level-of-detail for large grids; optional simplified mesh at distance. Grid 1080 → ~1.2M vertices; consider display resolution downscale for large islands | High |
| **Chunked generation** | Generate terrain in chunks for very large islands; lazy load heightmap regions | Medium |
| **Prop batching** | Instanced rendering for repeated props (trees, rocks) to reduce draw calls | Medium |

### 9.5 UX & Accessibility

| Suggestion | Description | Priority |
|------------|-------------|----------|
| **Building rotation preview** | Ghost building rotates with scroll or R key before placement | Medium |
| **Undo/Redo for buildings** | Stack of building placement/removal actions (separate from terrain undo) | Medium |
| **Keyboard-only placement** | Arrow keys to move ghost; Enter to place; Tab to cycle building type | Low |
| **Tooltips** | Hover hints on palette buttons, brush tools, sliders | Low |

### 9.6 Terrain & Water

| Suggestion | Description | Priority |
|------------|-------------|----------|
| **Water visualization** | Improve sea rendering; wave animation, depth shading, shoreline foam | Medium |
| **Terrain biomes** | Different surface types by region (volcanic vs tropical vs temperate); affects prop placement hints | Low |
| **Docks water mesh** | Water mesh around dock piers; better integration of docks with sea | Low |
