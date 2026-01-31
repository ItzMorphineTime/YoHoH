# Island Generator — Improvement Plan

**Document status:** Planning  
**Last updated:** 2026-01-31  
**Target:** YoHoH island-generator-poc — procedural island terrain with building placement  

---

## Table of Contents

1. [Current State](#1-current-state)
2. [Default Generation Config](#2-default-generation-config)
3. [Edit Controls — Blocky Theme & Elevation](#3-edit-controls--blocky-theme--elevation)
4. [Building Placement](#4-building-placement)
5. [Save/Load — Config & Example JSON](#5-saveload--config--example-json)
6. [Implementation Roadmap](#6-implementation-roadmap)

---

## 1. Current State

### 1.1 Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Simplex noise terrain | ✓ | Multi-octave, seeded |
| Island mask | ✓ | Radial falloff, elongation, coast irregularity |
| Chunk flattening | ✓ | Building zones via chunk size + flatness |
| Elevation colors | ✓ | Beach, grass, rock, snow by height |
| Brush editor | ✓ | Raise, lower, flatten |
| Save/Load | ✓ | JSON height map + config |
| Orbit controls | ✓ | Pan, zoom, rotate |

### 1.2 Gaps

- Edit UI is generic; no blocky/nautical theme
- Elevation controls are coarse (brush only; no level presets)
- No building placement or building types
- Save/Load does not restore UI state; no config-only save
- No example JSON templates for common presets

---

## 2. Default Generation Config

Default settings (matching reference UI):

| Parameter | Value | Description |
|-----------|-------|-------------|
| Grid size | 128 | Vertices per side (129×129) |
| Elevation | 120% | Max height multiplier |
| Roughness | 70% | Terrain bumpiness |
| Island radius | 70% | Island size (0–1 scale) |
| Coast falloff | 3.5 | Coast steepness |
| Coast irregularity | 25% | Coastline wobble |
| Elongation | 80% | Taller island shape |
| Sea level | 0.12 | Water level |
| Chunk size | 8 | Cells per building chunk |
| Flatness | 80% | Chunk flattening strength |
| Octaves | 5 | Noise detail layers |
| Frequency | 1.0 | Base noise frequency |
| Persistence | 0.75 | Octave amplitude falloff |
| Lacunarity | 2.6 | Octave frequency multiplier |
| Height scale | 50% | Visual height multiplier |
| Seed | 1 | Reproducible generation |

---

## 3. Edit Controls — Blocky Theme & Elevation

### 3.1 Blocky / Nautical Theme

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

### 3.2 Better Elevation Controls

| Control | Purpose |
|---------|---------|
| **Level presets** | Buttons: Sea level, Beach, Grass, Rock, Snow — set brush target height |
| **Absolute mode** | Brush sets height to exact value (e.g. 0.2) instead of relative |
| **Plateau brush** | Flatten to current click height within radius |
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

## 4. Building Placement

### 4.1 Building Types

| Type | Size (chunks) | Purpose |
|------|---------------|---------|
| Tavern | 1×1 | Port hub |
| Shipwright | 1×1 | Repairs, upgrades |
| Market | 1×1 | Trade |
| Fort | 2×2 | Defense |
| Lighthouse | 1×1 | Navigation |
| Warehouse | 2×1 | Cargo |
| Custom | 1×1 to 3×3 | User-defined |

### 4.2 Placement Rules

- Buildings snap to chunk grid
- Placement only on land (height &gt; sea level)
- Optional: require flatness above threshold
- Collision: no overlap with existing buildings
- Visual: simple placeholder meshes (box, cylinder) per type

### 4.3 Data Model

```js
{
  "buildings": [
    {
      "id": "b1",
      "type": "tavern",
      "chunkX": 4,
      "chunkY": 3,
      "rotation": 0  // 0, 90, 180, 270
    }
  ]
}
```

### 4.4 UI

- Building palette: icons for each type
- Click chunk to place; click again to remove or rotate
- Building properties panel: type, position, rotation
- Validation feedback: green = valid, red = invalid (water, overlap)

---

## 5. Save/Load — Config & Example JSON

### 5.1 Save Modes

| Mode | Contents | Use case |
|------|----------|----------|
| **Full** | heightMap + config + buildings | Complete island |
| **Config only** | config + display + seed | Preset for regeneration |
| **Buildings only** | buildings | Reuse layout on new terrain |

### 5.2 Load Behavior

- **Full load:** Restore height map, config, buildings; sync UI sliders from config
- **Config load:** Apply config, regenerate terrain, keep/clear buildings (user choice)
- **Preset load:** Load example JSON; apply and regenerate

### 5.3 Example JSON Files

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
    "chunkSize": 8,
    "flatnessStrength": 0.5,
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
    "chunkSize": 8,
    "flatnessStrength": 0.9,
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
    "chunkSize": 8,
    "flatnessStrength": 0.8,
    "noiseOctaves": 5,
    "frequency": 1.0,
    "persistence": 0.75,
    "lacunarity": 2.6
  },
  "display": { "heightScale": 0.5, "wireframe": false },
  "buildings": [
    { "id": "b1", "type": "tavern", "chunkX": 6, "chunkY": 6, "rotation": 0 },
    { "id": "b2", "type": "shipwright", "chunkX": 8, "chunkY": 6, "rotation": 0 },
    { "id": "b3", "type": "market", "chunkX": 7, "chunkY": 7, "rotation": 90 }
  ],
  "seed": 1
}
```

*Note: `heightMap` omitted in examples for brevity; full saves include it.*

### 5.4 Config Schema (Future)

```ts
interface IslandConfig {
  gridSize: number;
  elevationScale: number;
  islandRadius: number;
  coastFalloff: number;
  coastIrregularity: number;
  elongation: number;
  seaLevel: number;
  terrainRoughness: number;
  chunkSize: number;
  flatnessStrength: number;
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

## 6. Implementation Roadmap

### Phase A: Defaults & Config (Current)
- [x] Update defaults to match reference image
- [x] Add `default-config.json`
- [x] Create `ISLAND_GENERATOR.md`

### Phase B: Blocky Theme & Elevation
- [ ] Blocky/nautical CSS theme for edit panel
- [ ] Level preset buttons (Sea, Beach, Grass, Rock, Snow)
- [ ] Absolute brush mode
- [ ] Plateau brush
- [ ] Elevation readout under cursor
- [ ] Undo/Redo (height map stack)

### Phase C: Save/Load Improvements
- [ ] Save Config Only option
- [ ] Load restores UI sliders from config
- [ ] `examples/` folder with preset JSONs
- [ ] Load Preset dropdown or file picker

### Phase D: Building Placement
- [ ] Building type definitions
- [ ] Chunk grid overlay (optional)
- [ ] Place/remove/rotate buildings
- [ ] Building validation (land, no overlap)
- [ ] Include buildings in save/load

### Phase E: Polish
- [ ] Ramp tool
- [ ] Contour overlay toggle
- [ ] Min/Max elevation clamp
- [ ] Performance: LOD or reduced grid for large sizes
