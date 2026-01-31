# Island Generator — Improvement Plan

**Document status:** Planning  
**Last updated:** 2026-01-31  
**Target:** YoHoH island-generator-poc — procedural island terrain with building placement  

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Tile-Based Design](#2-tile-based-design)
3. [Default Generation Config](#3-default-generation-config)
4. [Edit Controls — Blocky Theme & Elevation](#4-edit-controls--blocky-theme--elevation)
5. [Building Placement](#5-building-placement)
6. [Save/Load — Config & Example JSON](#6-saveload--config--example-json)
7. [Implementation Roadmap](#7-implementation-roadmap)

---

## 1. Current State

### 1.1 Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| **Tile-based generation** | ✓ | Per-tile noise; flat tiles for building |
| Simplex noise terrain | ✓ | Multi-octave, seeded |
| Island mask | ✓ | Radial falloff, elongation, coast irregularity |
| Elevation colors | ✓ | Beach, grass, rock, snow by height |
| **Tile-aligned brush** | ✓ | 1×1–5×5 tiles; snaps to grid |
| Brush editor | ✓ | Raise, lower, flatten, absolute, set, plateau, smooth |
| Save/Load | ✓ | JSON height map + config |
| Orbit controls | ✓ | Pan, zoom, rotate |

### 1.2 Recent fixes
- Edit mode hover overlay: fixed missing `ts` (tileSize) in onHoverTile callback — highlight now displays correctly
- Edit tools selection accuracy: raycaster excludes overlay (layer 1); terrain on layer 0; explicit `recursive: false`; guard for `tilesX/tilesY <= 0`

### 1.3 Gaps

- ~~Edit UI is generic; no blocky/nautical theme~~ ✓ Phase B
- ~~Elevation controls are coarse (brush only; no level presets)~~ ✓ Phase B
- No building placement or building types
- ~~Save/Load does not restore UI state~~ ✓ Phase C; Save Config Only pending
- ~~No example JSON templates for common presets~~ ✓ Phase C

---

## 2. Tile-Based Design

### 2.1 Overview

The island is divided into a **tile grid**. Each tile is a flat (or near-flat) unit, making it easy to place buildings of different sizes on level terrain.

| Concept | Description |
|---------|-------------|
| **Tile** | A square region of vertices (e.g. 8×8). All vertices in a tile share the same base height. |
| **Tile size** | Vertices per tile side (4, 8, 16, 32). Grid size must be divisible by tile size. |
| **Tile variation** | Optional per-vertex noise within a tile (0 = perfectly flat). |

### 2.2 Generation

- Noise is sampled **per tile** (at tile center), not per vertex.
- Each tile gets a single height from the island mask + noise.
- Vertices in a tile inherit that height; optional `tileVariation` adds micro-variation.
- Result: flat tiles ideal for building placement.

### 2.3 Edit Tools

- **Brush size** is in tiles: 1×1 through 5×5 (matches building sizes).
- Click **snaps to tile** — modifies whole tile(s), not arbitrary radius.
- All vertices in the affected tiles are updated together.
- Ensures edited areas stay flat and aligned to the building grid.

### 2.4 Building Sizes (Pirate Game)

| Building | Tiles | Brush size |
|----------|-------|------------|
| Tavern, Shipwright, Market, Lighthouse | 1×1 | 1×1 |
| Warehouse, Docks | 2×1 | 2×2 |
| Fort, Dragon Sanctuary | 2×2 | 2×2 |
| Custom large | 3×3 | 3×3 |

---

## 3. Default Generation Config

Default settings (matching reference UI):

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
| **Ramp tool** | Click A, click B — create smooth slope between |
| **Undo/Redo** | Stack of height-map states (limit N) |
| **Elevation readout** | Show height under cursor (HUD) |
| **Contour overlay** | Optional wireframe/contour lines at fixed intervals |
| **Min/Max clamp** | Sliders to clamp elevation range (e.g. 0.1–0.8) |

**Elevation band reference:**
- Water: &lt; sea level
- Beach: sea level → 0.2
- Grass: 0.2 → 0.45
- Rock: 0.45 → 0.7
- Snow: &gt; 0.7

---

## 5. Building Placement — Pirate Game (Shattered Seas)

### 5.1 Pirate Building Types

Buildings for the **YoHoH** pirate game — islands in the Shattered Seas where players build ports, defend against Kings, and rescue dragons.

| Type | Size (tiles) | Purpose | Pirate Theme |
|------|--------------|---------|--------------|
| **Tavern** | 1×1 | Port hub, crew morale | Rum shack, gathering spot |
| **Shipwright** | 1×1 | Repairs, ship upgrades | Dry dock, hull repairs |
| **Market** | 1×1 | Trade, supplies | Black market, trading post |
| **Lighthouse** | 1×1 | Navigation, visibility | Beacon, fog warning |
| **Warehouse** | 2×1 | Cargo, supplies | Cargo hold, loot storage |
| **Fort** | 2×2 | Defense, garrison | Watchtower, cannon battery |
| **Docks** | 2×1 | Ship mooring | Pier, landing stage |
| **Dragon Sanctuary** | 2×2 | Dragon refuge | Hatchery, protected cove |
| **Custom** | 1×1 to 3×3 | User-defined | — |

### 5.2 Placement Rules

- Buildings snap to chunk grid
- Placement only on land (height &gt; sea level)
- Optional: require flatness above threshold
- Collision: no overlap with existing buildings
- Visual: simple placeholder meshes (box, cylinder) per type

### 5.3 Data Model

```js
{
  "buildings": [
    {
      "id": "b1",
      "type": "tavern",
      "chunkX": 4,
      "chunkY": 3,
      "rotation": 0  // 0, 90, 180, 270
    },
    {
      "id": "b2",
      "type": "dragon_sanctuary",
      "chunkX": 8,
      "chunkY": 6,
      "rotation": 90
    }
  ]
}
```

### 5.4 Pirate Building Reference (Shattered Seas)

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

### 5.5 UI

- Building palette: icons for each type
- Click chunk to place; click again to remove or rotate
- Building properties panel: type, position, rotation
- Validation feedback: green = valid, red = invalid (water, overlap)

---

## 6. Save/Load — Config & Example JSON

### 6.1 Save Modes

| Mode | Contents | Use case |
|------|----------|----------|
| **Full** | heightMap + config + buildings | Complete island |
| **Config only** | config + display + seed | Preset for regeneration ✓ |
| **Buildings only** | buildings | Reuse layout on new terrain |

### 6.2 Load Behavior

- **Full load:** Restore height map, config, buildings; sync UI sliders from config
- **Config load:** Apply config, regenerate terrain, keep/clear buildings (user choice)
- **Preset load:** Load example JSON; apply and regenerate

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
    "lacunarity": 2.0
  },
  "display": { "heightScale": 1.0, "wireframe": false },
  "seed": 42
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
    "lacunarity": 2.2
  },
  "display": { "heightScale": 0.6, "wireframe": false },
  "seed": 123
}
```

**`examples/full-island-with-buildings.json`** — Complete island + buildings:
```json
{
  "version": 1,
  "heightMap": [],
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
    "lacunarity": 2.6
  },
  "display": { "heightScale": 0.5, "wireframe": false },
  "buildings": [
    { "id": "b1", "type": "tavern", "chunkX": 6, "chunkY": 6, "rotation": 0 },
    { "id": "b2", "type": "shipwright", "chunkX": 8, "chunkY": 6, "rotation": 0 },
    { "id": "b3", "type": "market", "chunkX": 7, "chunkY": 7, "rotation": 90 },
    { "id": "b4", "type": "dragon_sanctuary", "chunkX": 4, "chunkY": 4, "rotation": 0 }
  ],
  "seed": 1
}
```

*Note: `heightMap` omitted in examples for brevity; full saves include it.*

### 6.4 Config Schema (Future)

```ts
interface IslandConfig {
  gridSize: number;
  tileSize: number;
  elevationScale: number;
  islandRadius: number;
  coastFalloff: number;
  coastIrregularity: number;
  elongation: number;
  seaLevel: number;
  terrainRoughness: number;
  tileVariation: number;
  noiseOctaves: number;
  frequency: number;
  persistence: number;
  lacunarity: number;
}

interface IslandSave {
  version: number;
  heightMap?: number[][];
  config: IslandConfig;
  display?: { heightScale: number; wireframe: boolean };
  buildings?: Building[];
  seed: number | null;
}
```

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

### Phase E: Building Placement (Pirate Game)
- [ ] Building type definitions (tavern, shipwright, market, lighthouse, warehouse, fort, docks, dragon_sanctuary)
- [ ] Tile grid overlay (optional)
- [ ] Place/remove/rotate buildings
- [ ] Building validation (land, no overlap)
- [ ] Include buildings in save/load

### Phase F: Polish
- [ ] Ramp tool
- [ ] Contour overlay toggle
- [ ] Min/Max elevation clamp
- [ ] Performance: LOD or reduced grid for large sizes
