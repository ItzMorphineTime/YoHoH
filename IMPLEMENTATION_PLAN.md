# YoHoH — Implementation Plan (HTML/JS + Three.js)

**Document status:** Draft v1.1 (reviewed)
**Last updated:** 2026-05-16
**Target:** Small indie prototype — PC web browser
**Tech stack:** HTML5, JavaScript (ES6+), Three.js
**Companion docs:** [Improvements.md](Improvements.md) (code-quality / perf backlog), [Port_Improvements.md](Port_Improvements.md) (port + crew UX backlog), [Sailing_Improvements.md](Sailing_Improvements.md) (sailing physics + UX backlog), [LORE.md](LORE.md), [island-generator-poc/ISLAND_GENERATOR.md](island-generator-poc/ISLAND_GENERATOR.md)

---

## Table of Contents
1. [Overview](#1-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Project Structure](#3-project-structure)
4. [Phase 0: Foundation](#4-phase-0-foundation)
5. [Phase 1: Procedural Map Generation (POC)](#5-phase-1-procedural-map-generation-poc) ★ Core Feature
6. [Phase A: Fun First Combat (Milestone A)](#6-phase-a-fun-first-combat-milestone-a)
7. [Phase B: Trading Loop (Milestone B)](#7-phase-b-trading-loop-milestone-b)
8. [Phase B.5: Core Gameplay & Rendering](#8-phase-b5-core-gameplay--rendering) (incl. §8.6 Map UI UX/UI)
9. [Phase C: Crew + Upgrades (Milestone C)](#9-phase-c-crew--upgrades-milestone-c)
10. [Phase D: Vertical Slice (Milestone D)](#10-phase-d-vertical-slice-milestone-d)
11. [Phase E: POC → Main Game Integration](#11-phase-e-poc--main-game-integration) ★ Next Step
12. [Polish & Stretch Goals](#12-polish--stretch-goals)
13. [Code-Quality Backlog](#13-code-quality-backlog)
14. [Risk Mitigations](#14-risk-mitigations)
15. [Story Expansion (Over-Arching Narrative)](#15-story-expansion-over-arching-narrative)

---

## 1. Overview

### 1.1 Goal
Build the YoHoH prototype as a browser-based game using Three.js for rendering. The game uses a **top-down orthographic view** (2.5D) with stylized 3D/2D assets.

### 1.2 Milestone Mapping (from GDD §18)
| Phase | Milestone | Focus | Status |
|-------|------------|-------|--------|
| 0 | Foundation | Project setup, renderer, basic scene | ✓ |
| **1** | **Procedural Map POC** | **Delaunay planar graph; islands + routes** ★ | ✓ |
| **1b** | **Island Terrain POC** | **Simplex-noise terrain, buildings, props, paths** ★ | ✓ |
| A | Fun First Combat | Ship handling, shooting, 2 enemy types, basic loot | ✓ |
| B | Trading Loop | 6–8 goods, market UI, buy/sell, repairs, variance | ✓ |
| B.5 | Core Polish | Sailing feel, arrival toast, Chart Screen, UI scaling | 🔄 |
| C | Crew + Upgrades | Hire crew, stations, upgrades, ship tiers, Infamy | ✓ |
| D | Vertical Slice | 8–12 islands, contracts, 1 lieutenant boss, save/load | 🔄 |
| **E** | **POC Integration** | **Use POC exports as authoring tools for live game data** ★ | ⏳ |
| Polish | Effects & Polish | Particles, audio, accessibility, ship naming | ⏳ |

### 1.3 World & Lore
The game is set in **The Shattered Seas**—a fractured archipelago where five Pirate Kings dominate the outer waters. See [LORE.md](LORE.md) for full world-building and King backstories. Lore data (`public/data/lore.json`) and `config.LORE` support in-game flavor (rumors, island descriptions).

### 1.4 Procedural Map (Core Feature)
The overworld map is **procedurally generated** as a pseudo-random planar graph:
- **Center-out expansion:** Graph grows from the **Home Island** (central node).
- **Distance = danger/reward:** Islands farther from Home have higher risk and reward (per GDD §7.1).
- **Planar graph:** Nodes = islands; edges = travel routes. No edge crossings for readable topology.
- **Seeded RNG:** Reproducible maps for testing and sharing seeds.

---

## 2. Tech Stack & Architecture

### 2.1 Core Technologies
| Layer | Technology | Purpose |
|-------|------------|---------|
| Rendering | Three.js (r160+) | 3D scene, orthographic camera, sprites/meshes |
| UI | HTML/CSS + DOM | Overlay HUD, menus, port screens |
| State | Vanilla JS (modules) | Game state, no framework initially |
| Build | Vite (recommended) or plain ES modules | Dev server, bundling |
| Audio | Web Audio API / Howler.js | SFX, music, ambience |

### 2.2 Architecture Principles
- **Separation of concerns:** `Game`, `Renderer`, `Input`, `UI`, `Economy`, `Combat` as distinct modules
- **Event-driven:** Custom events or pub/sub for UI ↔ game logic
- **Data-driven:** JSON configs for islands, goods, ships, enemies
- **Deterministic where possible:** Seeded RNG for testing (optional)

### 2.3 Camera & View
- **Camera:** `THREE.OrthographicCamera` looking down (Y-up or Z-up)
- **View:** Top-down 2.5D — ships as flat sprites or low-poly meshes with strong silhouettes
- **World scale:** TBD (e.g., 1 unit = 10m for readability)

---

## 3. Project Structure

```
Demo/
├── index.html
├── package.json
├── vite.config.js
├── map-generator-poc/           # Phase 1: Standalone proof of concept ✓ — authoring tool
│   ├── index.html
│   ├── Saves/                  # Exported map JSON files (yohoh-map-*.json)
│   ├── src/
│   │   ├── main.js             # UI, event handlers, render loop
│   │   ├── MapGenerator.js     # Delaunay-based planar graph + pirate enrichment
│   │   ├── MapVisualizer.js    # Three.js renderer, gizmo, pan/zoom
│   │   ├── MapEditor.js        # addNode, removeNode, addEdge, removeEdge
│   │   ├── MapSerializer.js    # serialize/deserialize — schema-compatible with main game
│   │   └── SeededRNG.js        # Pseudo-random with seed
│   └── package.json
├── island-generator-poc/       # Phase 1b: Island terrain authoring tool ✓
│   ├── index.html              # Settings: Graphics modal (Display, Graphics, Post-processing)
│   ├── saves/                  # Exported island JSON files (yohoh-island-*.json) — ~13 MB each (heightMap + buildings + props)
│   ├── src/
│   │   ├── main.js             # UI, event handlers, render loop
│   │   ├── IslandGenerator.js  # Tile-based simplex noise terrain, island properties
│   │   ├── IslandVisualizer.js # Three.js renderer, PostProcessing integration
│   │   ├── IslandEditor.js     # Brush edit (raise/lower/flatten/plateau/smooth)
│   │   ├── IslandBuildingPlacer.js # Place/remove/rotate buildings; terrain flattening
│   │   ├── IslandPropPlacer.js # Prop placement, selection, gizmo integration
│   │   ├── IslandPathfinder.js # A* pathfinding + MST; path terrain smoothing
│   │   ├── IslandSerializer.js # serialize/deserialize — heightMap + config + buildings + props + island props
│   │   ├── BuildingTypes.js    # Tavern, Shipwright, Market, Lighthouse, Warehouse, Fort, Docks, Sanctuary, Castle, Blacksmith
│   │   ├── PropTypes.js        # BerryBush, OakTree, PalmTree, Rock — FBX-backed
│   │   ├── PropMeshLoader.js   # FBX loader + caching for prop meshes
│   │   ├── PostProcessing.js   # EffectComposer, SSAO, Bloom, FXAA, Film
│   │   ├── WaterShader.js      # Animated water for island view
│   │   └── SeededRNG.js
│   └── package.json
├── PlanarGraphPython/           # Reference: Python implementation
│   └── main.py
├── public/
│   ├── assets/
│   │   ├── textures/
│   │   ├── sprites/
│   │   └── audio/
│   └── data/
│       ├── goods.json
│       ├── lore.json
│       ├── pirate-kings-lore.json
│       ├── ships.json          # (future)
│       └── enemies.json        # (future)
├── src/
│   ├── main.js
│   ├── config.js
│   ├── Game.js
│   ├── Renderer.js
│   ├── Input.js
│   ├── map/
│   │   ├── MapGenerator.js     # Shared: import from POC or copy
│   │   ├── MapSerializer.js   # Save/Load map JSON
│   │   └── SeededRNG.js        # Pseudo-random with seed
│   ├── render/
│   │   └── RenderConfig.js     # Per-view config (combat, overworld, sailing)
│   ├── scenes/
│   │   ├── OverworldScene.js
│   │   ├── CombatScene.js
│   │   └── PortScene.js
│   ├── entities/
│   │   ├── Ship.js            # Base class; subclasses define stats + station slots
│   │   ├── Sloop.js           # Small ship (1 slot/station)
│   │   ├── Brigantine.js     # Medium ship (2 slots: gunners, sailing, bilge, man_at_arms)
│   │   ├── Galleon.js        # Large ship (3 slots: gunners/sailing/bilge; 2: carpenter/nav/man_at_arms)
│   │   ├── ships.js          # createShip(id, opts) factory; SHIP_CLASS_REGISTRY
│   │   ├── Enemy.js
│   │   └── Projectile.js
│   ├── systems/
│   │   ├── SailingSystem.js
│   │   ├── CombatSystem.js
│   │   ├── EconomySystem.js
│   │   └── CrewSystem.js
│   ├── ui/
│   │   ├── HUD.js
│   │   ├── MapUI.js            # Overworld route selection panel
│   │   ├── BigMapUI.js          # Chart Screen (M key)
│   │   ├── Minimap.js           # Combat/overworld minimap
│   │   ├── PortUI.js            # Tavern, Shipwright, Market
│   │   └── MenuUI.js            # (future) Main menu
│   └── utils/
│       ├── routeModifiers.js   # B.4: stormy, patrolled, shoals
│       ├── upgrades.js         # C.7, C.10: upgrade stat overrides
│       └── saveSystem.js       # D.9: localStorage save/load
├── IMPLEMENTATION_PLAN.md
└── Improvements.md             # Code-quality / perf backlog (companion to this plan)
```

---

## 4. Phase 0: Foundation ✓

**Goal:** Runnable project with Three.js, basic scene, and game loop.

**Status:** Implemented. Main game shell at `Demo/` root.

### 4.1 Tasks
| # | Task | Status |
|---|------|--------|
| 0.1 | Project init | ✓ `package.json`, Three.js, Vite |
| 0.2 | HTML shell | ✓ `index.html` with canvas + HUD |
| 0.3 | Renderer setup | ✓ `Renderer.js`: orthographic camera, water plane, ship box |
| 0.4 | Game loop | ✓ `Game.js`: requestAnimationFrame, state machine (OVERWORLD) |
| 0.5 | Input handler | ✓ `Input.js`: keyboard (WASD), mouse |
| 0.6 | Basic placeholder | ✓ Water plane + ship box; WASD moves ship |

### 4.2 Deliverables
- [x] `npm run dev` starts local server (from `Demo/` root)
- [x] Orthographic top-down view of water + ship placeholder
- [x] WASD moves ship (momentum + turning)

### 4.3 Config Defaults
```js
// config.js
export const WORLD = { width: 200, height: 200 };
export const CAMERA = { zoom: 20, near: 0.1, far: 1000 };
```

---

## 5. Phase 1: Procedural Map Generation (POC) ✓

**Goal:** Standalone proof of concept for procedural archipelago map generation. Center-out planar graph; nodes = islands, edges = routes. *(GDD §7.1 Option B; reference: `PlanarGraphPython/main.py`)*

**Status:** Implemented. Delaunay-based planar graph with full map editor and pirate custom data.

### 5.1 Algorithm (Implemented)

| Approach | Status | Behavior |
|----------|--------|----------|
| **Delaunay triangulation** | ✓ | Place points center-out; Delaunay on points → planar graph by construction. Prune long edges; prune chance for sparser graphs. |
| **Center-out growth** | ✓ | Start at Home Island (center). Expand outward; new nodes at `expansionDistance` from random existing node. Graph distance from center = danger tier. |

### 5.2 Tasks
| # | Task | Status |
|---|------|--------|
| 1.1 | Seeded RNG | ✓ `SeededRNG.js` |
| 1.2 | Delaunay + geometry | ✓ d3-delaunay; edge-crossing checks for add/remove |
| 1.3 | Node & graph | ✓ `Node` (position, connections, dangerous, appealing, pirate custom data) |
| 1.4 | Center-out + Delaunay | ✓ `MapGenerator.js` |
| 1.5 | Graph distance | ✓ BFS from Home → `distanceFromHome` |
| 1.6 | Output format | ✓ `{ nodes, edges, homeNode, seed }` + pirate fields |
| 1.7 | Visualization | ✓ `MapVisualizer.js` — Three.js orthographic, pan/zoom |
| 1.8 | POC UI | ✓ Seed, Regenerate, config sliders, stats |
| 1.9 | Map editor | ✓ Select, gizmo move, add/remove nodes, add/remove routes |
| 1.10 | Save/Load | ✓ `MapSerializer.js` — JSON export/import |
| 1.11 | Pirate custom data | ✓ name, description, treasureLevel, portType, hazard, faction, rumors |

### 5.3 POC Deliverables
- [x] `map-generator-poc/` runs standalone (`npm run dev`)
- [x] Delaunay-based planar graph generation with seeded RNG
- [x] Three.js visualization: islands (nodes) + routes (edges)
- [x] Home Island highlighted; `distanceFromHome` encoded (color gradient ring)
- [x] Regenerate with new seed; same seed → same map
- [x] Edit mode: select, move (gizmo), add/remove islands, add/remove routes
- [x] Save/Load maps as JSON
- [x] Pirate custom data: procedural names, treasure, port, hazard, faction, rumors

### 5.4 Node Custom Data (Pirate Adventure)

Each island has pirate-themed fields for map generation and gameplay:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Island name (e.g. "Dead Man's Cay") |
| `description` | string | Flavor text |
| `treasureLevel` | 0–3 | None, Modest, Rich, Legendary |
| `portType` | string | none, outpost, harbor, port |
| `hazard` | string | none, reefs, storms, treacherous |
| `faction` | string | neutral, british, spanish, french, pirate |
| `rumors` | string | Quest hooks / rumors |

### 5.5 Config (Map Generator)
```js
// MapGenerator config
{
  numIslands: 20,           // Target node count
  expansionDistance: 30,    // Distance between connected islands
  minPointDistance: 0.4 × expansion,  // Min separation
  maxEdgeLength: 1.5 × expansion,     // Prune long routes
  pruneChance: 0,           // Chance to remove each eligible route
  dangerChance: 0.05,
  appealingChance: 0.2,
  seed: 12345               // Optional; omit for random
}
```

### 5.6 Integration (Phase B+)
- `OverworldScene.js` consumes `MapGenerator.generate(config)` output
- Islands already have names, treasure levels, port types, hazards, factions
- Route modifiers (stormy, patrolled) derived from `distanceFromHome` and `hazard`

---

## 6. Phase A: Fun First Combat (Milestone A) ✓

**Goal:** Ship handling, shooting, 2 enemy types, basic loot. *(GDD §8.1, §8.2, §10.1)*

**Status:** Implemented. Combat arena with player ship, enemies, projectiles, cannon arcs.

### 6.1 Sailing & Handling (§8.1)
| # | Task | Status |
|---|------|--------|
| A.1 | Ship entity | ✓ `Ship.js`: position, rotation, velocity, momentum model |
| A.2 | Movement model | ✓ Forward thrust, braking, drift; turning slows at high speed |
| A.3 | Cannon arcs | ✓ Port/starboard arcs; visual preview (cone mesh) |
| A.4 | HUD | ✓ Hull, sails, speed, cannon keys |

### 6.2 Naval Combat (§8.2)
| # | Task | Status |
|---|------|--------|
| A.5 | Broadside firing | ✓ Aim-then-fire (Q/E: first press = aim arrow, second = fire); cooldown |
| A.6 | Projectiles | ✓ `Projectile.js`: sphere mesh; hit detection |
| A.7 | Damage model | ✓ Hull HP, Sails (speed mult), Crew effectiveness; bilge/leaks (hull damage → leaks → bilge water → reduced speed) |
| A.8 | Combat arena | ✓ Bounded sea with rocks; `CombatScene.js` |

### 6.3 Enemies (§10.1)
| # | Task | Status |
|---|------|--------|
| A.9 | Enemy base | ✓ `Enemy.js`: extends Ship-like behavior |
| A.10 | Trader AI | ✓ Flees, light defenses |
| A.11 | Raider AI | ✓ Rush, aggressive |
| A.12 | Basic loot | ✓ On victory: gold + salvage; R to restart |

### 6.4 Deliverables
- [x] Player ship moves with momentum + turning
- [x] Cannons fire port/starboard with arc preview
- [x] 2 enemy types (Trader, Raider) with distinct AI
- [x] Victory/defeat screen with basic loot display

---

## 7. Phase B: Trading Loop (Milestone B)

**Goal:** 6–8 goods, market UI, buy/sell, repairs, simple variance. *(GDD §8.3, §8.6)*

**Status:** Trading loop complete. Overworld map, travel, economy (B.6–B.8), port (B.9–B.10a), economy sinks (B.11), route modifiers (B.4) implemented.

### 7.1 Overworld Map (§7.1)
| # | Task | Status |
|---|------|--------|
| B.1 | Island graph | ✓ `MapGenerator.generate(config)` — Delaunay planar graph (shared from POC) |
| B.2 | Overworld scene | ✓ `OverworldScene.js`: island nodes, route lines; consume MapGenerator output |
| B.3 | Travel | ✓ Click route from current island only → sail along path; random combat encounter |
| B.3a | 3D sailing view | ✓ Dedicated sailing corridor; ship on fixed path; destination marker |
| B.3b | SailingSystem | ✓ WASD player control; SailingSystem.updateInCorridor; ship constrained to route |
| B.3c | Combat integration | ✓ Same Ship entity; damage persists; HUD during sailing |
| B.3d | Route selection UI | ✓ Hover highlight; route info panel (destination, distance, danger); alignment/scale |
| B.3e | Map UI | ✓ Settings button (Save/Load maps); minimap during sailing; M for Chart Screen |
| B.3f | Dynamic GUI | ✓ CSS clamp() + viewport units; responsive HUD, minimap, map UI |
| B.3g | Sailing feel | ✓ SAILING config; reduced speed (0.22 max), gentler thrust; distinct from combat |
| B.3h | Route length | ✓ expansionDistance 85 (longer routes); island/route click thresholds adjusted |
| B.3i | Chart Screen | ✓ M key opens/closes; pan (drag), zoom (scroll +/−), Center on Ship; alignment/scale fixes |
| B.3j | Sailing rendering | ✓ SAILING_RENDER.islandRadius for origin/dest island circles; corridor width aligned with movement boundary |
| B.4 | Route modifiers | ✓ Stormy, patrolled, shoals (derived from `distanceFromHome` and `hazard`); colors + UI labels in `utils/routeModifiers.js` |

### 7.2 Economy (§8.3)
| # | Task | Details |
|---|------|---------|
| B.5 | Goods config | ✓ `goods.json`: 8 goods (Rum, Timber, Cloth, Iron, Powder, Cannon Parts, Spices, Pearls) |
| B.6 | Price model | ✓ Base + Bias + Variance per island; `getBuyPrice`/`getSellPrice` in EconomySystem |
| B.7 | Market UI | ✓ `PortUI.js`: buy/sell list, cargo hold, goods with prices |
| B.8 | Cargo system | ✓ Ship cargo capacity per class; load/unload at port via buy/sell |

### 7.3 Port & Repairs (§8.6)
| # | Task | Details |
|---|------|---------|
| B.9 | Port hub | ✓ PortScene, PortUI: Market, Shipwright, Tavern (Crew Management: hire, assign, dismiss) |
| B.10 | Repairs | ✓ Pay gold to restore hull/sails at Shipwright (§9.0.6 I.2) |
| B.10a | Leak repair at port | ✓ Pay gold to repair leaks at Shipwright (§9.0.6 I.10) |
| B.11 | Economy sinks | ✓ Repairs (gold); ✓ dock fees (ECONOMY.dockFee); ✓ supplies (ECONOMY.suppliesCost on voyage start) |

### 7.4 Deliverables
- [x] Overworld map with procedurally generated islands, click-to-travel
- [x] Market UI: buy/sell goods, cargo hold, island-specific prices
- [x] Repairs at shipwright (§9.0.6 I.2)
- [x] Leak repair at port (§9.0.6 I.10)
- [x] Price variance between islands (B.6: base + bias + distanceFromHome)
- [x] Dock fees (B.11): gold deducted on port entry; config ECONOMY.dockFee
- [x] Supplies (B.11): gold deducted when setting sail; config ECONOMY.suppliesCost; Start Sailing disabled if can't afford
- [x] Route modifiers (B.4): stormy, patrolled, shoals derived from distanceFromHome and hazard; route colors + UI labels

---

## 8. Phase B.5: Core Gameplay & Rendering ★ Next Step

**Goal:** Improve core gameplay feel, sailing experience, and rendering quality before expanding content. Focus on making the sailing loop satisfying and the visuals readable at all display sizes.

**Status:** In progress. Dynamic GUI, sailing speed, combat zoom fixed. Map UI UX/UI (§8.6) complete (incl. N.2 minimap tooltip). Economy (B.6–B.8) and B.11 economy sinks complete. S.3 wake, S.5 corridor feedback, S.6 arrival toast, M.2 camera smoothing implemented. Next: graphical bugs (§8.3a R.8), rendering improvements, Phase C upgrades.

### 8.1 Sailing Experience
| # | Task | Details |
|---|------|---------|
| S.1 | Sailing feel | ✓ Reduced speed (SAILING.maxSpeed 0.22); gentler thrust; distinct from combat |
| S.2 | Wind / heading | — Optional wind direction; slight speed bonus when sailing with wind |
| S.3 | Wake / trail | ✓ Ship wake behind ship when moving (length scales with speed; config: wakeLengthMax, wakeWidth, wakeColor, wakeOpacity) |
| S.4 | Sailing audio | — Ambient waves, creaking; optional wind SFX |
| S.5 | Corridor feedback | ✓ Subtle edge markers at corridor bounds (config: corridorEdgeColor, corridorEdgeOpacity, corridorEdgeWidth) |
| S.6 | Arrival feel | ✓ Toast "Arrived at [Island]!" when ship reaches destination; MapUI.showToast |

### 8.2 Dynamic GUI & Layout
| # | Task | Details |
|---|------|---------|
| G.1 | Responsive scaling | ✓ CSS custom properties; clamp() for fonts, spacing, radii |
| G.1a | Compact UI | ✓ Reduced font/panel/minimap sizes; fixed overlap; max-width on map panel |
| G.2 | Viewport-aware UI | ✓ Minimap, big map resize with window; HUD scales |
| G.3 | High-DPI / large displays | — Test 4K, ultrawide; ensure readability |
| G.4 | UI scaling option | ✓ Settings modal: 75%–150% slider; persisted via localStorage |
| G.5 | Safe zones | — Ensure critical UI not cut off on odd aspect ratios |

### 8.3 Rendering Improvements
| # | Task | Details |
|---|------|---------|
| R.1 | Water surface | — Ripples, subtle wave animation, or gradient depth |
| R.2 | Lighting / atmosphere | — Ambient tint; time-of-day placeholder |
| R.3 | Ship silhouette | — Improve ship mesh; clearer bow/stern; sail shape |
| R.3a | Per-class ship rendering | ✓ Different mesh size per ship class (overworld, sailing, combat); SHIP_GEOMETRY.classes per class (§9.0.6 I.5) |
| R.4 | Island visuals | — Distinct island shapes; port vs dangerous styling |
| R.5 | Route visuals | — Route width, color coding; stormy/shoal variants |
| R.6 | Particle pool | — Reusable particles for wake, impacts, muzzle flash |

### 8.3a Graphical Bugs & Camera Fixes
| # | Task | Details |
|---|------|---------|
| R.7 | Combat zoom | ✓ Fixed: CAMERA.combatZoom 4.5 — arena (300×300) visible for sailing/maneuvering |
| R.8 | Graphical bugs | — Investigate: z-fighting, visibility flicker, clipping, aspect-ratio edge cases |

### 8.4 Core Mechanics Polish
| # | Task | Details |
|---|------|---------|
| M.1 | Input feel | — Responsive; optional deadzone for analog |
| M.2 | Camera smoothing | ✓ Optional lerp on camera follow during sailing (config: cameraSmoothingLerp) |
| M.3 | Combat–sailing flow | — Smooth transition; no jarring state switches |
| M.4 | Performance | — Frame budget; entity limits; instancing if needed |

### 8.5 Config & Tuning
| # | Task | Details |
|---|------|---------|
| C.1 | Centralized config | ✓ All gameplay, rendering, UI options in `config.js` |
| C.2 | Reduce magic numbers | ✓ RENDER, UI, COMBAT, SAILING_SYSTEM, GAME configs |
| C.3 | Easy tuning | ✓ Single file for balancing; no scattered literals |

### 8.6 Map UI UX/UI Improvements ★

**Goal:** Improve map-ui scalability, readability, and dynamic feel. Align with GDD §15 (world map: routes, danger rating, travel cost) and §13.2 (nautical charts, compass motifs). Apply contrast, hierarchy, density, and legibility principles.

#### 8.6.1 MapUI Panel (Main Overworld HUD)
| # | Task | Details |
|---|------|---------|
| P.1 | Visual hierarchy | ✓ Structured layout: current island prominent; status text secondary; route info in dedicated card |
| P.2 | Route info layout | ✓ Structured rows: destination (bold), distance, danger/port icons |
| P.3 | Icons & affordances | ✓ Icons for danger (⚠), safe port (✓), port type (⚓) |
| P.4 | Status differentiation | ✓ data-state: docked (calm), selecting (interactive border), sailing (active green border) |
| P.5 | Settings panel polish | ✓ Smooth open/close transition; loading state during Load; toast |
| P.6 | Keyboard shortcuts | ✓ Ctrl+S Save, Ctrl+O Load; tooltips on buttons |
| P.7 | Save/Load feedback | ✓ Toast on success/failure; clear file input after load |
| P.8 | Route selection panel | ✓ "Docked at" current island; connected routes list (island names, distances); destination details (description, treasure, hazard, faction); config-driven via UI.routeSelection |

#### 8.6.2 BigMapUI (Chart Screen — Strategic Map Overlay)
| # | Task | Details |
|---|------|---------|
| B.1 | Island labels | ✓ Render island names on BigMap; truncate for dense areas |
| B.2 | Legend | ✓ Home (green), Dangerous (red), Safe port (teal), Default |
| B.3 | Pan/zoom | ✓ Pan (drag, document-level so works when mouse leaves canvas); zoom (scroll +/− buttons); Center on Ship |
| B.4 | Destination marker | ✓ When sailing: highlight destination island with dashed ring |
| B.5 | Nautical styling | ✓ Compass rose (N indicator); chart-style border |
| B.6 | M key close | ✓ Document + overlay keydown; M and Escape reliably close Chart Screen |
| B.7 | Config-driven | ✓ UI.chartScreen: showIslandLabels, showLegend, showCompass, showHelpText, islandScale, routeWidth, labelFontSize, legendEntries, etc. |
| B.8 | Accessibility | — Colorblind-friendly palette option; high-contrast mode; ensure legend explains colors |

#### 8.6.3 Minimap
| # | Task | Details |
|---|------|---------|
| N.1 | North indicator | ✓ Small compass N; consistent with Chart Screen |
| N.2 | Island labels (optional) | ✓ Tooltip on hover for island name during sailing |
| N.3 | Sailing progress | ✓ Progress bar at bottom when sailing; shows distance remaining |
| N.4 | Visual consistency | ✓ Align color scheme with BigMap; same island/route semantics |

#### 8.6.4 General Map UX
| # | Task | Details |
|---|------|---------|
| X.1 | Onboarding hints | ✓ First-time: "Click a route from your island to sail"; dismissible; persisted via localStorage |
| X.2 | Click feedback | ✓ Toast "Setting sail to X!" when route clicked; visual confirmation |
| X.3 | Responsive layout | ✓ MapUI, minimap, BigMap adapt; CSS clamp(), viewport units |
| X.4 | Config-driven | ✓ mapUI, chartScreen, routeSelection config in `config.js`; colors/sizes in UI section |

#### 8.6.5 Config Additions (Map UI)
```js
// config.js UI.mapUI
mapUI: {
  showLegend: true,
  showIslandLabels: true,
  compassRose: true,
  routeClickFeedback: true,
}

// UI.chartScreen — Chart Screen (M key) rendering options
chartScreen: {
  showIslandLabels: true,
  showLegend: true,
  showCompass: true,
  showHelpText: true,
  islandScale: 0.3,
  currentIslandRadiusMult: 1.3,
  routeWidth: 3,
  routeActiveWidth: 5,
  labelFontSize: 10,
  labelMaxLength: 12,
  legendEntries: ['docked', 'home', 'danger', 'safe', 'other'],
}

// UI.routeSelection — Route selection panel (overworld) rendering options
routeSelection: {
  showCurrentIsland: true,
  showConnectedRoutes: true,
  showDestinationDetails: true,
  showDescription: true,
  showTreasureLevel: true,
  showHazard: true,
  showFaction: true,
  showPortType: true,
  connectedRoutesMax: 8,
}

// SAILING_RENDER — Sailing view: island radius, corridor width (rendering + movement boundary)
SAILING_RENDER: {
  islandRadius: 320,
  corridorWidth: 50,
  wakeLengthMax: 40,              // S.3: max wake length at full speed
  wakeWidth: 12,
  wakeColor: 0x5a8aba,
  wakeOpacity: 0.4,
  wakeSpeedThreshold: 0.02,
  cameraSmoothingLerp: 0.12,      // M.2: camera follow smoothing (0=instant, 0.1=smooth)
  corridorEdgeColor: 0x3a5a7a,   // S.5: edge markers at corridor bounds
  corridorEdgeOpacity: 0.5,
  corridorEdgeWidth: 2,
  // ... destMarkerRadius, corridorColor, etc.
}

// Onboarding hint: persisted via localStorage key 'yohoh-onboarding-hint'
```

### 8.7 Deliverables
- [x] Dynamic GUI scaling for large displays
- [x] Sailing speed significantly reduced; distinct sailing feel
- [x] Centralized config; magic numbers moved to `config.js`
- [x] Combat zoom fixed — arena visible for sailing/maneuvering (§8.3a R.7)
- [x] Chart Screen (BigMapUI): pan, zoom, M/Esc close, Center on Ship, alignment/scale (§8.6.2)
- [x] Map UI UX/UI (§8.6): Ctrl+S/O shortcuts, Save/Load toast, status differentiation, sailing progress bar, click feedback
- [x] Chart Screen config (UI.chartScreen): showIslandLabels, showLegend, showCompass, islandScale, routeWidth, etc.
- [x] Route selection panel: "Docked at" current island, connected routes list, destination details; UI.routeSelection config
- [x] Sailing rendering: SAILING_RENDER.islandRadius for island circles; corridor width aligned with movement boundary
- [x] Minimap island tooltip (N.2): hover over island during sailing to see name
- [x] Wake / trail (S.3): ship wake behind ship when moving; length scales with speed
- [x] Corridor feedback (S.5): subtle edge markers at sailing corridor bounds
- [x] Arrival feel (S.6): toast on arrival at destination
- [x] Camera smoothing (M.2): lerp on camera follow during sailing
- [ ] Rendering improvements (water, ship, islands)
- [x] Per-class ship rendering (§9.0.6 I.5)
- [x] Optional UI scaling setting (Settings modal; G.4)
- [ ] Graphical bugs investigation (§8.3a R.8)

---

## 9. Phase C: Crew + Upgrades (Milestone C)

**Goal:** Hire crew, stations, 6–8 upgrades, ship tier 2. *(GDD §8.4, §8.5)*

**Status:** §9.0 Rendering Refactor complete. §9.0.5 Ship Classes implemented. Crew System (§9.1) with station slots integrated. Morale (C.6): Rum in cargo raises morale; voyage decay; victory boost; morale scales station effects. C.6c: Undercrewed ships suffer faster morale decay. Ship comparison UI (C.10b) implemented. Ship upgrades (C.7, C.8, C.10) with UI and combat integration. Cannon count per class (C.10c): Sloop 1, Brigantine 2, Galleon 3 broadsides. Infamy (C.11), ship class unlock gates (C.11a), ship class purchase (C.10a) implemented. §9.0.6 Ship System Improvements (ideas) documented.

### 9.0 Rendering Refactor (Prerequisite) ★ First Step

**Goal:** Improve and refactor the rendering logic for a more maintainable and scalable codebase with better configuration. Prepare the renderer for Phase C content (crew, upgrades, ship tiers) and future expansion.

**Status:** Implemented.

| # | Task | Details |
|---|------|---------|
| R.1 | Extract scene-specific logic | ✓ Split Renderer into `_setupCombatView`, `_updateCombatEntities`, `_setupSailingView`, `_updateSailingEntities`, `_updateSailingCamera`, `_setupOverworldView`, `_updateOverworldEntities`, `_updateOverworldCamera` |
| R.2 | Centralize config usage | ✓ `RenderConfig.js`: `getCombatRenderConfig()`, `getOverworldRenderConfig()`, `getSailingRenderConfig()`; `UI.mapColors` shared by BigMapUI, Minimap |
| R.3 | Improve separation of concerns | ✓ `_hideNonCombatViews`, `_hideNonSailingViews`, `_hideNonOverworldViews`; clear setup → update → camera flow per view |
| R.4 | Config schema & validation | ✓ Config schema documented in `config.js` header; runtime validation optional |
| R.5 | Scalable config layout | ✓ Config grouped by view; `RenderConfig.js` provides merged config per view with fallbacks |
| R.6 | View layer abstraction | — Consider lightweight abstraction for scene swapping; simplify adding new view modes (e.g. Port) |

**Deliverables:**
- [x] Renderer refactored; scene-specific code isolated
- [x] Config usage consolidated; no scattered literals
- [x] Config layout documented; ready for new scenes (Port, etc.)
- [x] No regression in visual output or performance

### 9.0.5 Ship Classes (OO Hierarchy) ✓

**Goal:** Object-oriented ship types with distinct stats and variable station slots. *(Extends §8.4, §8.5)*

**Status:** Implemented. Ship base class + Sloop, Brigantine, Galleon subclasses; factory for instantiation.

| # | Task | Details |
|---|------|---------|
| S.1 | Ship base class | ✓ `Ship.js`: common logic; `getClassConfig()`, `shipClassId` static; stats from subclass config |
| S.2 | Sloop | ✓ Small: 80 hull/sail/crew; 1 slot per station; agile turn rate |
| S.3 | Brigantine | ✓ Medium: 120 hull/sail/crew; 2 slots for gunners, sailing, bilge, man_at_arms |
| S.4 | Galleon | ✓ Large: 150 hull/sail/crew; 3 slots for gunners/sailing/bilge; 2 for carpenter/navigator/man_at_arms |
| S.5 | Ship factory | ✓ `createShip(shipClassId, opts)` in `ships.js`; `SHIP_CLASS_REGISTRY` maps id → constructor |
| S.6 | Config-driven stats | ✓ `SHIP_CLASSES` in config.js: hullMax, sailMax, crewMax, bilgeWaterMax; combat + sailing stats per class |
| S.7 | Shipwright selector | ✓ PortUI Shipwright tab: ship class dropdown (Sloop/Brigantine/Galleon) |
| S.8 | Bilge & leaks | ✓ Hull damage → leaks → bilge water; bilge water reduces max speed; Sailing/Bilge/Carpenter stations |

**Ship class stats (per SHIP_CLASSES):**
- **Combat:** maxSpeed, thrust, friction, turnRate, brakeMult, highSpeedTurnPenalty, cannonCooldown
- **Sailing:** sailingMaxSpeed, sailingThrust, sailingTurnRate, sailingBrakeMult, sailingHighSpeedTurnPenalty
- **Station slots:** helmsman, gunner_port, gunner_starboard, carpenter, navigator, sailing, bilge, man_at_arms

**Config (SHIP_CLASSES in config.js):**
```js
SHIP_CLASSES: {
  sloop: { name, hullMax, sailMax, crewMax, bilgeWaterMax, maxSpeed, thrust, turnRate, ...,
    sailingMaxSpeed, sailingThrust, sailingTurnRate, ...,
    stationSlots: { helmsman: 1, gunner_port: 1, ... } },
  brigantine: { ... stationSlots: { gunner_port: 2, sailing: 2, bilge: 2, man_at_arms: 2, ... } },
  galleon: { ... stationSlots: { gunner_port: 3, sailing: 3, bilge: 3, carpenter: 2, ... } },
}
GAME.defaultShipClass: 'sloop'
```

**Deliverables:**
- [x] Ship base class with subclass config injection
- [x] Sloop, Brigantine, Galleon as distinct OO classes
- [x] createShip() factory; OverworldScene, CombatScene use factory
- [x] Station slots vary by ship class; CrewSystem.getStationEffects(roster, shipClassId)
- [x] Shipwright: change ship class at port

### 9.0.6 Ship System Improvements (Ideas)

**Goal:** Capture ideas to enhance ship systems — repair, progression, visuals, and depth. *These ideas are distributed into phase checklists (Phase B, B.5, C, D, Polish & Stretch).*

| # | Idea | Details | Phase |
|---|------|---------|-------|
| I.1 | Carpenter repair | Carpenter station repairs hull and stops leaks over time (sailing/combat); repairMult, leakRepairMult already in config | C.6a |
| I.2 | Shipwright repairs | Pay gold at port to restore hull/sails; repair cost scales with damage; ties to Economy (§B.10) | B.10 |
| I.3 | Ship class purchase | Upgrade ship class at Shipwright (Sloop → Brigantine → Galleon); cost + Infamy gate; transfer crew/state | C.10a |
| I.4 | Ship class unlock gates | Brigantine/Galleon unlock at Infamy 3/5; progression reward; show "Locked" in Shipwright until unlocked | C.11a |
| I.5 | Per-class rendering | Different mesh size/shape per ship class (overworld, sailing, combat); SHIP_GEOMETRY per class | R.3a |
| I.6 | Cannon count per class | Sloop 1 broadside, Brigantine 2, Galleon 3; or damage/cooldown scaling by class | C.10c |
| I.7 | Enemy ship classes | Raider Sloop vs Raider Brigantine; Trader Sloop vs Trader Galleon; Enemy extends Sloop/Brigantine | D.4b |
| I.8 | Ship naming | Player names their ship; display in HUD, port, save | D.4a |
| I.9 | Ship persistence | ✓ Save/load ship class, hull/sails/crew/bilge/leaks state; crew roster; upgrades | D.9a |
| I.10 | Leak repair at port | Carpenter + gold repairs leaks at port; or leaks decay slowly when hull > 80% | B.10a |
| I.11 | Frigate (tier 3) | Stretch: larger ship class; 4+ gunner slots; unlock at Infamy 7 | §11.3 |
| I.12 | Ship comparison UI | Shipwright: side-by-side stats (Sloop vs Brigantine vs Galleon); "Upgrade to Brigantine" CTA | C.10b |
| I.13 | Crew capacity scaling | ✓ Morale decays faster when crew < 50% of max; config undercrewedMoraleDecayMult | C.6c |
| I.14 | Station effectiveness decay | Unassigned stations reduce effectiveness; encourage full roster on larger ships | C.6b |

**Priority candidates:**
- **I.1, I.2** — Carpenter repair + Shipwright repairs: core loop completion
- **I.4** — Unlock gates: progression feel
- **I.5** — Per-class rendering: visual differentiation
- **I.9** — Ship persistence: save/load requirement

### 9.1 Crew System (§8.4)
| # | Task | Details |
|---|------|---------|
| C.1 | Crew data | ✓ CREW config; traits, morale baseline; CrewSystem.createCrewMember |
| C.2 | Tavern UI | ✓ PortUI Tavern tab: hire crew, roster with station dropdown; slot info (e.g. "1/2") |
| C.2a | Crew Management UI | ✓ Station overview (fill chips per station); crew count (X/Y); dismiss crew button per member |
| C.3 | Stations | ✓ Helmsman, Gunner P/S, Carpenter, Navigator, Sailing, Bilge, Man at Arms |
| C.4 | Station effects | ✓ CrewSystem.getStationEffects; turnRate, reload, repair, sailSpeed, bilgePump, crewMult; Ship integration |
| C.5 | Variable slots | ✓ getStationSlots(shipClassId); getAssignableStationsForCrew; assignStation enforces slot limits |
| C.6 | Morale (light) | ✓ Rum, victories, voyage decay; morale scales station effects |
| C.6a | Carpenter repair | ✓ Carpenter station repairs hull and stops leaks over time (sailing/combat); repairMult, leakRepairMult (§9.0.6 I.1) |
| C.6b | Station effectiveness decay | ✓ Unassigned stations apply penalty (config unassignedStationPenalty); encourage full roster (§9.0.6 I.14) |
| C.6c | Crew capacity scaling | ✓ Morale decays faster when crew < 50% of max; config undercrewedMoraleDecayMult (§9.0.6 I.13) |

### 9.2 Ship Upgrades (§8.5)
| # | Task | Details |
|---|------|---------|
| C.7 | Upgrade slots | ✓ Hull, Sails, Cannons, Cargo, Utility, Boarding |
| C.8 | Upgrade UI | ✓ Shipwright: slot selection, stat deltas, cost |
| C.9 | Ship tiers | ✓ Sloop (default), Brigantine, Galleon — distinct classes; Brig/Galleon unlock at Infamy (future) |
| C.10 | 6–8 upgrades | ✓ Plating, Fast rigging, Heavy shot, etc.; cannonDamageMult/cannonCooldown apply in combat |
| C.10a | Ship class purchase | ✓ Upgrade ship class at Shipwright (Sloop → Brigantine → Galleon); cost (500/1200 gold) + Infamy gate; transfer crew/state (§9.0.6 I.3) |
| C.10b | Ship comparison UI | ✓ Shipwright: side-by-side stats table (Sloop vs Brigantine vs Galleon); Hull, Sails, Crew, Cargo, Turn rate, Speed, Slots (§9.0.6 I.12) |
| C.10c | Cannon count per class | ✓ Sloop 1, Brigantine 2, Galleon 3 broadsides; config cannonCount; slight spread per shot (§9.0.6 I.6) |

### 9.3 Progression (§9.1)
| # | Task | Details |
|---|------|---------|
| C.11 | Infamy | ✓ Earn from profit (selling goods), victories (combat loot); config INFAMY |
| C.11a | Ship class unlock gates | ✓ Brigantine/Galleon unlock at Infamy 3/5; show "Locked" in Shipwright until unlocked (§9.0.6 I.4) |

### 9.4 Deliverables
- [x] **9.0 Rendering refactor:** Scene-specific logic extracted; config consolidated; scalable layout
- [x] **9.0.5 Ship classes:** Sloop, Brigantine, Galleon OO hierarchy; createShip factory; station slots per class
- [x] Tavern: hire crew, assign stations (PortUI Tavern tab); slot info (e.g. "1/2"); max crew per ship class
- [x] Crew Management UI: station overview chips, crew count (X/Y), dismiss crew (C.2a)
- [x] Crew affects ship stats (turn rate, reload, sail speed, bilge pump) — CrewSystem.getStationEffects; Ship integration
- [x] Morale (C.6): Rum in cargo raises morale (Serve Rum at Tavern); voyage decay; victory boost; morale scales station effects
- [x] Shipwright: ship class selector (Sloop/Brigantine/Galleon)
- [x] Carpenter repair (hull + leaks over time) (§9.0.6 I.1)
- [x] Shipwright: 6–8 upgrades across slots (C.7, C.8, C.10); upgrade stats apply in sailing + combat
- [x] Ship comparison UI (C.10b): stats table in Shipwright (§9.0.6 I.12)
- [x] Ship class purchase (§9.0.6 I.3)
- [x] Ship class unlock gates (Infamy 3/5) (§9.0.6 I.4)
- [x] Cannon count per class (C.10c): Sloop 1, Brigantine 2, Galleon 3 broadsides (§9.0.6 I.6)
- [x] Station effectiveness decay (§9.0.6 I.14)
- [x] Crew capacity scaling (§9.0.6 I.13)

---

## 10. Phase D: Vertical Slice (Milestone D)

**Goal:** 8–12 islands, contracts, 1 lieutenant boss, tuned economy. *(GDD §9–11)*

**Status:** D.1 island count complete (12 islands). Contracts, boss, save/load pending.

### 10.1 Content
| # | Task | Details |
|---|------|---------|
| D.1 | Island count | ✓ OVERWORLD.numIslands 12; configurable 8–12 islands |
| D.2 | Rumors | "Powder high at Port X" — simple text |
| D.3 | Contracts | Delivery, Smuggling, Salvage (1–2 each) |
| D.4 | Contract UI | Accept at tavern; track in HUD |
| D.4a | Ship naming | — Player names their ship; display in HUD, port, save (§9.0.6 I.8) |
| D.4b | Enemy ship classes | — Raider Sloop vs Raider Brigantine; Trader Sloop vs Trader Galleon; Enemy extends Sloop/Brigantine (§9.0.6 I.7) |

### 10.2 Boss (§11.1)
| # | Task | Details |
|---|------|---------|
| D.5 | Lieutenant | Chain shot every N sec, grapple at 50% hull |
| D.6 | Boss arena | Distinct stronghold island |
| D.7 | Rewards | Unique cannon component, cosmetic flag |

### 10.3 Polish
| # | Task | Details |
|---|------|---------|
| D.8 | Economy tuning | Sinks, caps, event spikes |
| D.9 | Save system | ✓ Ship, crew, islands, gold, infamy (localStorage); auto-save on port entry |
| D.9a | Ship persistence | ✓ Save/load ship class, hull/sails/crew/bilge/leaks state; crew roster; upgrades (§9.0.6 I.9) |
| D.10 | Main menu | ✓ New game, Continue (if save exists), Settings |

### 10.4 Deliverables
- [x] 8–12 islands with full routes (OVERWORLD.numIslands)
- [ ] Contracts: delivery, smuggling, salvage
- [ ] Ship naming (§9.0.6 I.8)
- [ ] Enemy ship classes (Raider/Trader Sloop vs Brigantine) (§9.0.6 I.7)
- [ ] 1 Pirate King Lieutenant boss
- [x] Save/load via localStorage
- [x] Ship persistence (class, state, crew, upgrades) (§9.0.6 I.9)
- [x] Main menu + Continue

---

## 11. Phase E: POC → Main Game Integration ★ Next Step

**Goal:** Promote the two POCs from research scratchpads into **first-class authoring tools** for the live game. The artists/designers use the POCs offline to craft 2D map layouts and 3D islands, export JSON, and the main game loads those exports as canonical content.

**Status:** ⏳ Planned. Map schema is already shared between POC and main game (compatible serializers). Island schema needs a consumer (3D island rendering in main game) and a content pipeline.

### 11.1 Vision

```
┌────────────────────┐   yohoh-map-*.json     ┌──────────────────────┐
│ map-generator-poc  │ ─────────────────────▶ │ public/data/maps/    │
│  (Delaunay editor) │     (planar graph)     │   default.json       │
└────────────────────┘                        └──────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────┐  yohoh-island-*.json  ┌──────────────────────┐
│ island-generator-poc │ ──────────────────▶   │ public/data/islands/ │
│ (3D island authoring)│  (heightMap, props)   │  dead_mans_cay.json  │
└──────────────────────┘                       └──────────────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────────┐
                                              │  Main Game runtime   │
                                              │   loads JSON →       │
                                              │   OverworldScene +   │
                                              │   IslandScene (new)  │
                                              └──────────────────────┘
```

**Authoring loop:** Designer opens POC → edits → exports JSON → drops in `public/data/` → main game picks up on next load.

### 11.2 Schema Reference (shipped formats)

#### 11.2.1 Map JSON (from `map-generator-poc/Saves/`)
Source of truth: [map-generator-poc/src/MapSerializer.js](map-generator-poc/src/MapSerializer.js). Already byte-compatible with [src/map/MapSerializer.js](src/map/MapSerializer.js).

```json
{
  "version": 1,
  "seed": 1,
  "homeNodeId": 31,
  "nodes": [
    {
      "id": 0,
      "x": 0, "y": 0,
      "dangerous": false,
      "appealing": false,
      "name": "Home Port",
      "description": "...",
      "treasureLevel": 0,
      "portType": "port",       // none | outpost | harbor | port | sanctuary
      "hazard": "none",         // none | reefs | storms | treacherous | fog | serpents | coral | darkness | fire
      "faction": "pirate",      // neutral | british | spanish | french | pirate
      "rumors": ""
    }
    // …
  ],
  "edges": [[20, 2], [1, 20], …]   // [aId, bId]
}
```

Each node carries everything `OverworldScene` already consumes — no schema changes needed.

#### 11.2.2 Island JSON (from `island-generator-poc/saves/`)
Source of truth: [island-generator-poc/src/IslandSerializer.js](island-generator-poc/src/IslandSerializer.js).

```json
{
  "version": 1,
  "seed": 1769831220383,
  "name": "Dead Man's Sands",
  "description": "…",
  "dangerous": false,
  "appealing": false,
  "treasureLevel": 0,
  "portType": "harbor",
  "hazard": "none",
  "faction": "pirate",
  "rumors": "",
  "theme": "normal",                // normal | volcanic | icey | swampy
  "config": {                       // generation knobs
    "gridSize": 128, "tileSize": 8, "elevationScale": 1.2,
    "islandRadius": 0.42, "noiseOctaves": 5, "frequency": 2.2,
    "persistence": 0.45, "lacunarity": 2.1, "seaLevel": 0.12,
    "coastFalloff": 2.2, "coastIrregularity": 0.35,
    "elongation": 0.5, "terrainRoughness": 0.7, "tileVariation": 0
  },
  "display": { /* wireframe, shadows, post-FX settings — optional */ },
  "heightMap": [[0.0, 0.1, …], …],  // gridSize × gridSize floats, 0–1 normalised
  "buildings": [
    { "type": "tavern", "x": 60, "y": 40, "rotation": 0, "width": 2, "height": 1 },
    { "type": "docks",  "x": 80, "y": 20, "rotation": 90, "width": 3, "height": 1 }
    // type ∈ tavern | shipwright | market | lighthouse | warehouse | fort |
    //        docks | dragon_sanctuary | castle | blacksmith
  ],
  "props": [
    { "type": "palm_tree_01", "tx": 30, "ty": 45, "rotation": 0,
      "offsetX": 0, "offsetY": 0, "offsetZ": 0, "scale": 8 }
    // type ∈ berry_bush_01 | oak_tree_01 | palm_tree_01 | palm_tree_02 | rock_01 | rock_06 | …
  ]
}
```

**Size note:** Full exports are ~13 MB each because `heightMap` is a flat 2D array of `gridSize²` floats. For shipped content, ship the **config + seed** only (≈4 KB) and re-generate the heightMap at load time — see §11.4 T.5.

### 11.3 Integration Tasks

| # | Task | Details | Effort |
|---|------|---------|--------|
| E.1 | **Establish content directories** | Create `public/data/maps/` and `public/data/islands/`; copy initial exports from POC Saves dirs | S |
| E.2 | **Map loader in main game** | `main.js`/Game accepts a `--map=<filename>` URL param or `GAME.defaultMap` config to load from `public/data/maps/*.json` instead of `generateMap()` | S |
| E.3 | **Island data registry** | New `public/data/islands/index.json` maps node-id → island filename; falls back to procedural if missing | S |
| E.4 | **IslandScene (new)** | Add a 5th game state `ISLAND`; new scene loads an island JSON, renders 3D terrain + buildings + props (port a slimmed `IslandVisualizer` from POC into `src/scenes/IslandScene.js`) | L |
| E.5 | **Port → Island bridge** | When player docks at an island that has an island JSON, transition to `ISLAND` state for walking around; if not, fall back to current `PORT` UI overlay | M |
| E.6 | **Building → Port UI mapping** | Building types resolve to existing port services: `tavern → Tavern panel`, `shipwright → Shipwright panel`, `market → Market panel`, `dragon_sanctuary → Sanctuary handler (Phase D §S.7)` | M |
| E.7 | **Lightweight island runtime** | Strip POC editor/edit-mode/brush code; ship only the renderer + interaction. Keep `BuildingTypes`, `PropTypes`, `IslandPathfinder`, `IslandVisualizer` (read-only mode) | M |
| E.8 | **Schema-versioning** | Both serializers already emit `version: 1`. Add explicit `schemaVersion` constants and reject newer/older formats with a clear error | S |
| E.9 | **Authoring docs** | Short `docs/AUTHORING.md` explaining the POC → JSON → main-game flow for designers | S |
| E.10 | **POC builds shipped** | `npm run build` in each POC; serve `island-generator-poc/dist/` and `map-generator-poc/dist/` from `/tools/island/` and `/tools/map/` so they're accessible from the main game's menu | M |

### 11.4 Content-Pipeline Decisions

| # | Decision | Recommendation |
|---|----------|----------------|
| T.1 | Where do exports live? | `public/data/maps/`, `public/data/islands/` — Vite serves them as static; runtime fetches with `fetch('/data/...')` |
| T.2 | One canonical map vs many? | Ship one curated default (`default.json`); allow `Continue` to use a player-edited saved map; keep procedural generation as a fallback when no JSON exists |
| T.3 | Island JSON: ship heightMap or regenerate? | **Regenerate from config + seed** — drops file size 99% (4 KB vs 13 MB). Authoring tool exports with heightMap for backup; production build strips it via `scripts/strip-heightmap.js` |
| T.4 | Mapping islands → island files | `public/data/islands/index.json`: `{ "<nodeId>": "<filename>" }`. Unmapped nodes use a default island JSON keyed by `portType` + `hazard` + `theme` |
| T.5 | Build script | `scripts/import-poc-content.js` — copies latest POC exports into `public/data/`, strips heightMaps, validates schema |
| T.6 | Loading flow | On main-game boot: `fetch('/data/maps/default.json')` → if fails, `generateMap()` fallback. On port entry: `fetch('/data/islands/index.json')` → resolve filename → load island JSON |

### 11.5 Deliverables

- [ ] `public/data/maps/default.json` — one curated map shipped with the game
- [ ] `public/data/islands/*.json` — at least 3 hand-authored islands (Home, dangerous, sanctuary)
- [ ] `public/data/islands/index.json` — node-id → filename
- [ ] `src/scenes/IslandScene.js` — runtime renderer for island JSON (read-only; port from POC)
- [ ] `Game.js` gains an `ISLAND` state; transition wired from `_enterPort` when an island file exists
- [ ] Building → service mapping (Tavern/Shipwright/Market) intact when arriving via island scene
- [ ] `scripts/import-poc-content.js` — content pipeline
- [ ] `docs/AUTHORING.md` — designer workflow
- [ ] POC `dist/` builds served from `/tools/map/`, `/tools/island/`

### 11.6 Open Questions

- **Camera mode in ISLAND state.** Stay orthographic (consistent with sailing/combat) or switch to perspective with orbit controls (POC default)? Recommend orthographic + slight tilt for visual continuity with the sailing view.
- **Player avatar on island.** Walk-around character, or click-driven service selection ("Click building to enter")? MVP: click-to-enter, no avatar — buildings act like menu buttons in 3D.
- **Persistence of edits on play-load.** If the player edits the world via the POC and the saved game references a previous version, what wins? Recommend: save embeds map JSON (already does via `mapJson`) so player saves are self-contained.

---

## 12. Polish & Stretch Goals

### 12.1 Effects & Particles (Rendering Polish)
| # | Task | Details |
|---|------|---------|
| P.1 | Cannon muzzle flash | Brief flash/smoke at ship when firing |
| P.2 | Impact splash | Water splash + debris when projectile hits ship |
| P.3 | Hull damage VFX | Sparks, smoke, or debris on hit |
| P.4 | Wake / wake trail | Ship wake or foam trail when moving |
| P.5 | Water surface | Ripples, wave animation, or foam |
| P.6 | Projectile trail | Subtle trail or smoke behind cannonballs |
| P.7 | Particle pool | Reusable particle system for performance |

### 12.2 Polish (Post–Phase D)
- **Effects & particles:** muzzle flash, impact splash, damage VFX, wake trails, water ripples (see §12.1)
- Boarding resolution (§8.2.4): grapple → "Plunder Deep" / "Secure & Sail"
- Fast travel (ferries)
- Accessibility: rebindable controls, UI scaling
- Audio: cannons, ambience, music stings

### 12.3 Stretch
- Procedural encounter modifiers
- Ship tier 3 (Frigate): larger ship class; 4+ gunner slots; unlock at Infamy 7 (§9.0.6 I.11)
- Stronghold boss (multi-phase)
- Optional co-op (2nd player)
- Ship system depth: per-class cannon count (§9.0.6 I.6), enemy ship classes (§9.0.6 I.7), ship naming (§9.0.6 I.8)

---

## 13. Code-Quality Backlog

A living list of code-quality, performance, and correctness fixes lives in [Improvements.md](Improvements.md). Port-specific work is tracked in [Port_Improvements.md](Port_Improvements.md); sailing-specific work in [Sailing_Improvements.md](Sailing_Improvements.md). Four passes complete; remaining items below.

### ✅ Landed (2026-05-16)

**First pass — performance + leaks:**
- §1.1 — Overworld route/island mesh pool (Three.js GPU leak fix; ~4 200 leaked objects/sec eliminated)
- §1.2 — Combat rock pool (built once per combat instead of per frame)
- §1.3 — Per-frame `PortUI.update()` calls removed (was running 2× per frame)
- §1.4 — `SailingSystem.update` / `updateInCorridor` unified behind shared `_applyControls`/`_integrateMotion`
- §2.2 — Dirty-flag canvas redraws (overworld Minimap + BigMapUI)
- §2.3 / §2.4 / §2.5 — `Input.endFrame` no-alloc swap, duplicate `isMouseJustPressed` removed, `Input.destroy()` for listener teardown
- §3.2 — Overworld map-bounds cache keyed by map identity (no more per-frame `Math.min(...xs)`)
- §4.1 / §4.2 — Save schema version constant, `loadWithStatus` with diagnostics, main menu surfaces corrupt-save / version-mismatch errors

**Second pass — refactors + correctness:**
- §2.1 — `_isClickOnUI` / `_isMouseOverCanvas` now hit-test cache keyed by mouse NDC (avoids per-frame `elementFromPoint` reflow)
- §3.1 (partial) — Overworld view extracted into `src/render/OverworldRenderer.js` (309 lines); Renderer.js shrunk 921 → 695. Latent bug fixed: `getRouteModifiers` / `getPrimaryModifier` were used but unimported in `Renderer.js`
- §3.3 — Confirmed N/A: cannon arcs already share a single geometry
- §4.3 — `OverworldScene.update()` now returns the arrived ship state directly; read-clears side channel removed
- §4.4 — `startingGold` clarified; new `GAME.devCheats` namespace for future dev flags
- §5.1 (partial) — `PortController` extracted to `src/controllers/PortController.js` (146 lines); Game.js shrunk 600 → 557
- §5.3 (initial) — `escapeHtml` helper added; applied to highest-risk interpolations (crew names, island names) — full audit pending
- §6.1 — `Projectile` object pool via `_acquire`/`_recycle` on `CombatSystem` (eliminates per-shot allocations)
- §6.3 — Encounter chance is now a proper Poisson process (Exp(λ) sampled countdown, dt-independent)
- **Bug fix:** Main menu (New Game / Continue) was unclickable — `#main-menu-overlay` had no CSS, so it sat behind the canvas layer and clicks were intercepted by `#game-canvas-layer` (`pointer-events: auto`). Added full menu CSS in `index.html` (fixed positioning, z-index 1000, gradient background, button styling, `.hidden` rule).

**Fourth pass — Sailing physics + UX (see Sailing_Improvements.md):**
- **§1.1 / §1.2 dt-scaling + speedMultiplier** — `SailingSystem` now uses `frameScale(dt) = dt * SAILING.referenceFps`; thrust, turn rate, position all scaled; friction uses `Math.pow(friction, frameScale)`. New `SAILING.speedMultiplier` applied after per-class lookup so global tuning actually works. The user's earlier `SAILING.maxSpeed = 10.0` bump is now an inert (but preserved) fallback with documentation.
- **§1.3** Chart Screen (M) now pauses sailing physics, encounters, station-effects refresh, morale decay.
- **§1.4** Encounter-timer resets centralised in `_resetEncounterTimer()` — fires on arrival, defeat, voyage cancel.
- **§1.6** `effectiveMaxSpeed` now cached per tick + new `getEffectiveMaxSpeedBreakdown()` for HUD tooltips. `ship.beginTick()` invalidates.
- **§2.1** Voyage HUD panel: To / Dist / ETA / 8-point Bearing with off-axis ↻↺ indicator. Backed by `OverworldScene.getVoyageInfo()`.
- **§2.3** Arrival zone + "Press F to dock" prompt at >85% of corridor. `OverworldScene.isApproachingDestination()` + `earlyDock()`.
- **§2.4** Pre-encounter warning (`COMBAT.encounterWarning`, default 3s) with flee window — hold W ≥ 70% of the window + pass `fleeSuccessChance` roll = "You outran them!" Otherwise combat starts.
- **§2.5** Stations-active pill row on sailing HUD showing chip per station (filled/partial/empty) with tooltips.
- **§2.6** Speed-relative camera: up to 15% wider FoV at top speed, smoothed.
- **§2.7** Sailing mode line shows `WASD ▸ Sail · K ▸ Crew · M ▸ Chart · Esc ▸ Cancel`.
- **§2.8** Cancel-voyage button (MapUI `↺ Cancel Voyage`) wires `Game._cancelVoyage()` — snapshots ship state, returns to OVERWORLD at origin.
- **§2.9** Wake threshold normalised to fraction of effective max (default 0.1 = wake at >10% capacity); legacy absolute values still accepted.
- **§4.1** Per-map wind direction (randomised at map-gen, persisted via MapSerializer); `SailingSystem.computeWindMultiplier` applies up to +25%/-20% based on heading-vs-wind cosine alignment; HUD voyage panel shows wind row.
- **§4.3** `ROUTE_MODIFIER_EFFECTS` config: stormy (thrust × 0.75, hull damage), patrolled (encounter rate × 2), shoals (corridor narrowed × 0.65, bilge intake). Stacked multiplicatively. Applied per-tick by `OverworldScene._applyRouteModifiers()` with a base-physics cache to prevent ratcheting.
- **§4.4** Cargo overload: `CARGO_LOAD` config (softCap 80%, max 25% speed / 20% turn penalty at full hold). Applied once at `startTravel`.

**Third pass — Port / Crew UX (see Port_Improvements.md):**
- **Bug fix:** Tavern/Shipwright/Market tab buttons did nothing — `INFAMY` was used in `PortUI.update()` but never imported (threw ReferenceError mid-render) **and** `.port-panel` had no `display: none/block` CSS, so all three panels rendered stacked. Both fixed.
- **§5 Crew Management extraction (the user's main ask):** new `src/ui/CrewUI.js` (~220 lines) + `src/controllers/CrewController.js` (~80 lines). Standalone overlay reachable from any state via the **K** keybind or a floating "👥 Crew" button. State-aware sourcing (PortScene when docked, Game roster at sea). Station-effects refresh live during sailing/combat. Tavern tab now pivots to a "Manage Crew →" entry point. Cross-refresh in both directions so port actions sync the overlay and vice versa.
- §3.3 — Persistent status strip (Hull / Sails / Morale / Cargo gradient bars) above the port tabs.
- §3.4 — Port container converted to flex column with sticky header + status strip + tabs + action log; only the content panel scrolls.
- §3.5 — Upgrade slots collapsed into `<details>` summary / browse expander, preserving open state across re-renders.
- §3.6 — Repair buttons gained cost-breakdown `title` tooltips ("40 hull pts × 0.5 gold = 20 gold").
- §3.8 — PortScene tracks a 30-entry activity log with gain/loss/info colour coding. Activity panel below the tabs with Clear button.
- §3.2 — Esc-twice exit confirmation (1.5s priming window with amber Leave Port button state).
- §4.2 — Active tab persists via PortScene.setActiveTab.
- §4.4 — Audit script flagged the INFAMY bug; one dead `ECONOMY` import in PortController removed; remaining flags were false positives.

### ⏳ Remaining

**Improvements.md backlog:**
- 🟡 §3.1 finish — extract `SailingRenderer` and `CombatRenderer`; introduce a `CameraController`
- 🟡 §5.1 finish — extract `SaveController`, `SettingsBindings`, `OverworldPanZoomController`
- 🟡 §5.2 / Port_Improvements §4.1 — split `PortUI` into per-tab panel classes (Tavern, Shipwright, Market) — deferred until UX surface settles
- 🟢 §5.3 — audit remaining `innerHTML` writes for completeness (ship name, contracts, etc. when added)
- 🟢 §6.2 — Hit-detection spatial grid (only if combat scales beyond ~5 ships)
- 🟢 §6.4 — Combat friction tuning (needs playtest)

**Port_Improvements.md backlog:**
- 🟡 Port_Improvements §4.3 — diff-based DOM updates inside panels (deferred; no longer urgent post-§1.3)
- 🟢 Port_Improvements §3.7 — market price-trend memory (Phase D)
- 🟢 Infamy progress bar towards next ship-class unlock (split off from §3.3)

**Sailing_Improvements.md backlog:**
- 🟡 Sailing §3.3 / §3.4 — extract `VoyageController` once mechanics keep growing
- 🟡 Sailing §3.1 — consolidate `SAILING.*` / `WIND` / `ARRIVAL` / `CARGO_LOAD` / `ROUTE_MODIFIER_EFFECTS` into a single nested namespace
- 🟢 Sailing §4.2 — corridor sub-events (flotsam, debris, mini-events)
- 🟢 Sailing §4.5 — heading-hint / autopilot helper
- 🟢 Sailing §1.5 — wake mesh rotation visual verification
- 🟢 Sailing §2.10 — drop / repurpose lateral corridor movement (design decision)
- 🟢 Various polish split-offs: wind arrow on minimap, repair/pump bar indicators, 3D arrival ring, minimap enemy telegraph, cancel-voyage penalty, `?` overlay sheet

See [Improvements.md](Improvements.md), [Port_Improvements.md](Port_Improvements.md), and [Sailing_Improvements.md](Sailing_Improvements.md) for full triage, line references, and effort × impact estimates.

---

## 14. Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Three.js learning curve | Start with orthographic + simple meshes; defer shaders |
| Scope creep | Stick to Phase A→D; expansion = separate doc |
| Economy exploits | Sinks, caps, event-driven variance (§19) |
| Combat readability | Strong cannon arc previews; limited VFX |
| Performance | Limit entities; use instancing for projectiles if needed |
| Map generation failures | Retry on disconnected graph; cap retries; fallback to simpler algorithm |

---

## 15. Story Expansion (Over-Arching Narrative)

**Goal:** Integrate the Shattered Seas lore—dragons, Pirate Kings, rescue mission—into the gameplay loop as an over-arching narrative that drives progression and gives meaning to contracts, encounters, and boss fights. See [LORE.md](LORE.md) for full world-building.

### 15.1 Core Narrative Arc

| Beat | Description | Phase |
|------|-------------|-------|
| **Setup** | Player is a new captain in the Home Waters. Tavern rumors hint at dragons hunted to near-extinction and five Pirate Kings who rule the outer seas. | B, C |
| **Call to action** | Player learns of the dragon rescue mission—find eggs, free captives, ferry to sanctuaries. Optional: introductory contract or NPC prompt. | D |
| **Rising stakes** | As player ventures outward, they encounter King lieutenants, dragon egg intel, and stronghold coordinates. Four Kings hunt dragons; Jasper (Ghost Captain) may aid. | D |
| **Climax** | Defeat a Lieutenant → reveal stronghold. Raid stronghold → rescue captured dragons, unique loot. | D |
| **Resolution** | Deliver rescued eggs/young dragons to sanctuary. Build reputation as a dragon-saver; Kings may hunt the player. | D, Stretch |

### 15.2 Story Beats by Phase (Granular)

| Phase | Beat | Trigger | Outcome |
|-------|------|---------|---------|
| **B** | World flavor | Island visit, tavern | Island descriptions, generic rumors (Shattered Seas, Kings, dragons) |
| **B.5** | Lore rumors | Tavern visit | Rumors reference specific Kings, domains, dragon plight |
| **C** | First dragon hint | Infamy ≥ 2 | Tavern: "Eggs on a volcanic isle—hunters pay well." |
| **C** | Lieutenant foreshadow | Infamy ≥ 4 | Tavern: "A King's lieutenant patrols the outer routes." |
| **D** | Dragon rescue contract | Tavern / contract board | Accept contract: find egg, deliver to sanctuary |
| **D** | Lieutenant encounter | Route travel (outer seas) | Combat: Lieutenant boss; defeat → stronghold coordinates |
| **D** | Stronghold raid | Player chooses to sail to revealed stronghold | Distinct arena; rescue captured dragon; unique loot |
| **D** | Sanctuary delivery | Arrive at sanctuary with egg/dragon | Contract complete; narrative progression; optional reward |
| **Stretch** | Jasper aid | Dragon rescue count ≥ N, honorable play | Jasper appears mid-fight or guides to sanctuary |
| **Stretch** | King confrontation | Multiple Lieutenants defeated | Ebon Flameheart as ultimate boss |

### 15.3 King-Specific Narrative Hooks

Each Pirate King ties to distinct story content. Vertical slice (Phase D) can focus on **one** King; stretch expands to all.

| King | Domain | Lieutenant Hook | Stronghold Hook | Dragon Connection |
|------|--------|-----------------|-----------------|-------------------|
| **Jasper Barrow** | Veilwake Sea (fog) | Ally, not enemy; may aid player | N/A (protects dragons) | Guides eggs to sanctuary; ally for rescue missions |
| **Mordekai Drakon** | Coiled Expanse (serpents) | Lieutenant raids volcanic isles for eggs | Serpent-bound stronghold; Blaze eggs | Hunts dragons for scales/bone; rival to rescue |
| **Adara Thalassa** | Drowned Crown (coral, ruins) | Lieutenant captures eggs for rituals | Atlantean stronghold; Elder eggs | Hunts for sovereignty; eggs for rituals |
| **Nimue Tideborn** | Black Spiral (darkness) | Lieutenant lures dragons to Kraken | Abyssal stronghold; Speedy/Icey | Hunts to feed the deep; eggs as delicacy |
| **Ebon Flameheart** | Ashen Reach (fire, volcanoes) | Lieutenant burns nests, hunts migrants | Fire stronghold; Blackfang (bound) | Ultimate rival; eliminates all dragon rivals |

**Phase D focus:** Pick one hunting King (e.g. Mordekai or Ebon) for Lieutenant + stronghold. Jasper can appear as optional ally flavor.

### 15.4 Dragon Breed Integration

| Dragon | Breed | Domain / Location | Hunted By | Rescue Contract Fit |
|--------|-------|-------------------|-----------|---------------------|
| **Blaze** | Fire • Volcanic | Ashen Reach, volcanic islands | Ebon, Mordekai | Egg at lava vent; race hunters |
| **Icey** | Frost • Northern | Frozen straits, iceberg caves | Nimue, Adara | Egg in wreck; deliver to sanctuary |
| **Speedy** | Wind • Swift | Storm-wracked cliffs | Nimue | Captured in stronghold; free and ferry |
| **Elder** | Ancient • Wisdom | Ruins, sunken temples | Adara | Egg in Drowned Crown; ritual target |
| **Blackfang** | Fire • Conquest | Bound to Ebon | N/A (Ebon's) | Stretch: free from Ebon; ultimate prize |

**Data:** `lore.json` dragons block; `contracts.json` can reference `dragonBreed` for flavor and rewards.

### 15.5 Narrative Systems

| # | System | Details | Phase |
|---|--------|---------|-------|
| N.1 | **Rumors** | Tavern rumors: dragon egg locations, King movements, sanctuary intel. Tie to `node.rumors`; lore-driven text from `lore.json`. | B, D |
| N.2 | **Contracts** | Delivery, smuggling, salvage—plus **dragon rescue** contracts: "Find egg at volcanic isle before Mordekai's hunters." | D |
| N.3 | **Dragon egg intel** | Rumors or contracts reveal egg locations (volcanic islands, wrecks). Player races Kings' hunters. | D |
| N.4 | **Sanctuary delivery** | Cargo type: dragon egg. Deliver to sanctuary island (hidden, safe). Counts toward narrative progression. | D |
| N.5 | **Lieutenant intel** | Defeating a Lieutenant reveals stronghold coordinates. Unlock next story beat. | D |
| N.6 | **Stronghold raid** | Distinct encounter: King's stronghold. Rescued dragons held in captivity; unique loot. | D |
| N.7 | **Jasper ally hook** | Optional: honorable play or dragon rescue triggers Jasper aid (e.g. mid-fight assist, sanctuary guidance). | Stretch |
| N.8 | **Infamy gates** | Story content unlocks at Infamy 2, 4, 6… (rumors, contracts, Lieutenant availability). | C, D |

### 15.6 Story-Driven Content by Phase

#### Phase B / B.5 (Foundation)
- Island descriptions reference Shattered Seas, Pirate Kings, dragons (MapGenerator `enrichPirateData`).
- Rumors in tavern: generic lore hints (already in MapGenerator).
- No explicit story beats; world-building flavor only.
- **S.1:** Expand rumor pool to include dragon/King-specific lines from `lore.json`.

#### Phase C (Crew + Upgrades)
- Infamy progression gates story: Infamy 2 → first dragon rumor; Infamy 4 → Lieutenant foreshadow.
- Tavern: "A sailor speaks of eggs on a volcanic isle—and hunters who pay well for them."
- Tavern: "A King's lieutenant patrols the outer routes. They say he serves the Serpent."

#### Phase D (Vertical Slice)
- **Contracts:** At least one dragon rescue contract (find egg, deliver to sanctuary).
- **Lieutenant boss:** Serves one King (e.g. Mordekai or Ebon); defeat reveals stronghold.
- **Stronghold:** Optional raid; rescued dragon + unique loot.
- **Sanctuary:** At least one sanctuary island; delivery completes contract.
- **Save/load:** Persist story state (eggs delivered, strongholds revealed, Lieutenant defeated).
- **Focus King:** Choose one hunting King for full Lieutenant → stronghold arc.

#### Post–Phase D (Stretch)
- Multiple Lieutenants (one per hunting King).
- Jasper ally mechanics (honorable play, dragon rescue count).
- King confrontation (Ebon Flameheart as ultimate boss).
- Dragon sanctuary building/supplying.
- Blackfang rescue (free from Ebon).

### 15.7 Data & Config Hooks

| Asset | Purpose |
|-------|---------|
| `lore.json` | Rumors, King descriptions, domain hints, dragon breeds. |
| `public/data/pirate-kings-lore.json` | Full King lore (from LORE.md via `extract-lore`). |
| `config.LORE` | World name, King IDs, domain hazards, dragon breed IDs. |
| `contracts.json` (future) | Contract definitions; include `type: "dragon_rescue"`, `dragonBreed`, `targetKing`. |
| Island `portType` | `sanctuary` for dragon sanctuary islands. |
| Island `hazard` | `fire`, `fog`, `serpent`, `coral`, `darkness` map to King domains. |
| `STORY_STATE` (save) | `eggsDelivered`, `lieutenantsDefeated`, `strongholdsRevealed`, `dragonRescueCount`. |

### 15.8 Implementation Checklist

| # | Task | Phase | Depends On |
|---|------|-------|------------|
| S.1 | Rumors reference dragons/Kings; lore-driven text from `lore.json` | B.5 | MapGenerator rumors, lore.json |
| S.2 | Add `sanctuary` port type; at least one sanctuary island per map | D | MapGenerator, island config |
| S.3 | Dragon rescue contract type | D | Contracts system, D.3 |
| S.4 | Dragon egg as cargo/quest item | D | Cargo system, S.3 |
| S.5 | Lieutenant defeat → stronghold coordinates | D | D.5 boss, story state |
| S.6 | Stronghold encounter (distinct island/arena) | D | D.6, S.5 |
| S.7 | Rescued dragon reward; deliver to sanctuary | D | S.2, S.4, S.6 |
| S.8 | Save/load story state (eggs, strongholds, Lieutenant) | D | D.9 save system |
| S.9 | Infamy gates for story unlocks (rumors, contracts) | C, D | C.11 Infamy |
| S.10 | Jasper ally hook (optional) | Stretch | S.8, dragon rescue count |
| S.11 | Multiple Lieutenants, King bosses | Stretch | S.5–S.7 |

### 15.9 Tone & Integration

- **Tone:** Adventurous, slightly comedic, readable fantasy piracy—darker when Kings are involved.
- **Light touch:** Story supports gameplay; avoid heavy cutscenes. Rumors, contracts, and encounter flavor carry the narrative.
- **Player agency:** Player can ignore dragon rescue and focus on trade/combat; story rewards those who engage.
- **Jasper:** Ally flavor—honorable players and dragon-savers may earn his aid; never forced.

---

## Appendix: File Checklist

### Phase 1 (Map Generator POC) ✓
- [x] `map-generator-poc/index.html`
- [x] `map-generator-poc/package.json`, `vite.config.js`
- [x] `map-generator-poc/src/main.js`
- [x] `map-generator-poc/src/SeededRNG.js`
- [x] `map-generator-poc/src/MapGenerator.js` (Delaunay, pirate enrichment)
- [x] `map-generator-poc/src/MapVisualizer.js` (Three.js, gizmo, pan/zoom)
- [x] `map-generator-poc/src/MapEditor.js` (addNode, removeNode, addEdge, removeEdge)
- [x] `map-generator-poc/src/MapSerializer.js` (Save/Load JSON)

### Island Generator POC ✓
- [x] `island-generator-poc/index.html` (Settings: Graphics modal)
- [x] `island-generator-poc/package.json`, `vite.config.js`
- [x] `island-generator-poc/src/main.js`
- [x] `island-generator-poc/src/IslandGenerator.js`, `IslandVisualizer.js`
- [x] `island-generator-poc/src/PostProcessing.js` (EffectComposer, SSAO, Bloom, FXAA, Film)
- [x] `island-generator-poc/src/IslandPropPlacer.js`, `PropTypes.js`
- [x] Post-processing pipeline + Settings: Graphics modal (Display, Graphics, Post-processing)
- See [island-generator-poc/ISLAND_GEN_RENDERING_IMPLEMENTATION.md](island-generator-poc/ISLAND_GEN_RENDERING_IMPLEMENTATION.md)

### Phase 0 ✓
- [x] `index.html`
- [x] `package.json`, `vite.config.js`
- [x] `src/main.js`, `src/config.js`
- [x] `src/Game.js`, `src/Renderer.js`, `src/Input.js`

### Phase A ✓
- [x] `src/entities/Ship.js`, `Sloop.js`, `Brigantine.js`, `Galleon.js`, `ships.js`, `Enemy.js`, `Projectile.js`
- [x] `src/systems/SailingSystem.js`, `CombatSystem.js`
- [x] `src/scenes/CombatScene.js`
- [x] `src/ui/HUD.js`

### Phase B ✓ (Trading loop complete)
- [x] `src/render/RenderConfig.js` (centralized per-view config; §9.0)
- [x] `src/map/MapGenerator.js`, `SeededRNG.js`
- [x] `src/scenes/OverworldScene.js`
- [x] `src/ui/MapUI.js` (route selection panel: connected routes, destination details; UI.routeSelection config)
- [x] `src/ui/BigMapUI.js` (Chart Screen: pan, zoom, M/Esc close; UI.chartScreen config)
- [x] `src/ui/Minimap.js` (N.2 island tooltip on hover during sailing)
- [x] `public/data/goods.json` (8 goods: staples, military, luxury)
- [x] `public/data/lore.json`, `pirate-kings-lore.json` (world-building, Pirate Kings)
- [x] `src/scenes/PortScene.js`
- [x] `src/systems/EconomySystem.js` (loads goods.json; getBuyPrice/getSellPrice; B.6 price model)
- [x] `src/ui/PortUI.js` (Tavern/Crew Management, Shipwright + ship comparison C.10b, Market tabs; B.7 buy/sell; C.2a crew UI)
- [x] Shipwright repairs (B.10); leak repair at port (B.10a) (§9.0.6 I.2, I.10)
- [x] `src/utils/routeModifiers.js` (B.4: stormy, patrolled, shoals from distanceFromHome and hazard)

### Phase B.5 (Rendering)
- [x] Per-class ship rendering (R.3a) (§9.0.6 I.5)

### Phase C
- [ ] `public/data/ships.json`, `crew.json`
- [x] `src/systems/CrewSystem.js`
- [x] Tavern UI (PortUI Tavern tab); Crew Management UI (station overview, dismiss crew)
- [x] Carpenter repair (hull + leaks) (§9.0.6 I.1)
- [x] Upgrade UI (Shipwright)
- [x] Ship comparison UI (C.10b) (§9.0.6 I.12)
- [x] Ship class purchase (§9.0.6 I.3)
- [x] Ship class unlock gates (Infamy 3/5) (§9.0.6 I.4)
- [x] Cannon count per class (C.10c): Sloop 1, Brigantine 2, Galleon 3 broadsides (§9.0.6 I.6)
- [x] Station effectiveness decay (§9.0.6 I.14)
- [x] Crew capacity scaling (§9.0.6 I.13)

### Phase D
- [ ] `public/data/contracts.json`, `enemies.json`
- [ ] Ship naming (§9.0.6 I.8)
- [ ] Enemy ship classes (Raider/Trader Sloop vs Brigantine) (§9.0.6 I.7)
- [ ] Boss logic
- [x] Save system (`src/utils/saveSystem.js`)
- [x] Ship persistence (class, state, crew, upgrades) (§9.0.6 I.9)
- [x] Main menu (index.html + main.js)

### Phase E (POC → Main Game Integration) — Planned
- [ ] `public/data/maps/default.json` (curated map from `map-generator-poc`)
- [ ] `public/data/islands/index.json` (node-id → island filename)
- [ ] `public/data/islands/*.json` (≥3 hand-authored islands)
- [ ] `src/scenes/IslandScene.js` (read-only runtime; ports `IslandVisualizer` from POC)
- [ ] `Game.js` — new `ISLAND` state + `_enterIsland` transition
- [ ] Building-type → port-service mapping (tavern/shipwright/market/sanctuary)
- [ ] `scripts/import-poc-content.js` (content pipeline: copy + strip heightMap + validate)
- [ ] `docs/AUTHORING.md` (designer workflow)
- [ ] POC builds served at `/tools/map/` and `/tools/island/`
