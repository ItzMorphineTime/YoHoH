# YoHoH — Implementation Plan (HTML/JS + Three.js)

**Document status:** Draft v0.4  
**Last updated:** 2026-01-29  
**Target:** Small indie prototype — PC web browser  
**Tech stack:** HTML5, JavaScript (ES6+), Three.js  

---

## Table of Contents
1. [Overview](#1-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Project Structure](#3-project-structure)
4. [Phase 0: Foundation](#4-phase-0-foundation)
5. [Phase 1: Procedural Map Generation (POC)](#5-phase-1-procedural-map-generation-poc) ★ Core Feature
6. [Phase A: Fun First Combat (Milestone A)](#6-phase-a-fun-first-combat-milestone-a)
7. [Phase B: Trading Loop (Milestone B)](#7-phase-b-trading-loop-milestone-b)
8. [Phase B.5: Core Gameplay & Rendering](#8-phase-b5-core-gameplay--rendering) ★ Next Step (incl. §8.6 Map UI UX/UI)
9. [Phase C: Crew + Upgrades (Milestone C)](#9-phase-c-crew--upgrades-milestone-c)
10. [Phase D: Vertical Slice (Milestone D)](#10-phase-d-vertical-slice-milestone-d)
11. [Polish & Stretch Goals](#11-polish--stretch-goals)
12. [Risk Mitigations](#12-risk-mitigations)

---

## 1. Overview

### 1.1 Goal
Build the YoHoH prototype as a browser-based game using Three.js for rendering. The game uses a **top-down orthographic view** (2.5D) with stylized 3D/2D assets.

### 1.2 Milestone Mapping (from GDD §18)
| Phase | Milestone | Focus |
|-------|------------|-------|
| 0 | Foundation | Project setup, renderer, basic scene |
| **1** | **Procedural Map POC** | **Center-out planar graph generation; islands + routes** ★ |
| A | Fun First Combat | Ship handling, shooting, 2 enemy types, basic loot |
| B | Trading Loop | 6–8 goods, market UI, buy/sell, repairs, variance |
| C | Crew + Upgrades | Hire crew, stations, 6–8 upgrades, ship tier 2 |
| D | Vertical Slice | 8–12 islands, contracts, 1 lieutenant boss, tuned economy |

### 1.3 Procedural Map (Core Feature)
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
├── map-generator-poc/           # Phase 1: Standalone proof of concept ✓
│   ├── index.html
│   ├── src/
│   │   ├── main.js             # UI, event handlers, render loop
│   │   ├── MapGenerator.js     # Delaunay-based planar graph + pirate enrichment
│   │   ├── MapVisualizer.js    # Three.js renderer, gizmo, pan/zoom
│   │   ├── MapEditor.js        # addNode, removeNode, addEdge, removeEdge
│   │   ├── MapSerializer.js   # serialize/deserialize for Save/Load
│   │   └── SeededRNG.js        # Pseudo-random with seed
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
│       ├── ships.json
│       └── enemies.json
├── src/
│   ├── main.js
│   ├── config.js
│   ├── Game.js
│   ├── Renderer.js
│   ├── Input.js
│   ├── map/
│   │   └── MapGenerator.js     # Shared: import from POC or copy
│   ├── scenes/
│   │   ├── OverworldScene.js
│   │   ├── CombatScene.js
│   │   └── PortScene.js
│   ├── entities/
│   │   ├── Ship.js
│   │   ├── Enemy.js
│   │   └── Projectile.js
│   ├── systems/
│   │   ├── SailingSystem.js
│   │   ├── CombatSystem.js
│   │   ├── EconomySystem.js
│   │   └── CrewSystem.js
│   ├── ui/
│   │   ├── HUD.js
│   │   ├── PortUI.js
│   │   ├── MapUI.js
│   │   └── MenuUI.js
│   └── utils/
│       ├── math.js
│       └── rng.js
└── IMPLEMENTATION_PLAN.md
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

### 5.1 Sailing & Handling (§8.1)
| # | Task | Status |
|---|------|--------|
| A.1 | Ship entity | ✓ `Ship.js`: position, rotation, velocity, momentum model |
| A.2 | Movement model | ✓ Forward thrust, braking, drift; turning slows at high speed |
| A.3 | Cannon arcs | ✓ Port/starboard arcs; visual preview (cone mesh) |
| A.4 | HUD | ✓ Hull, sails, speed, cannon keys |

### 5.2 Naval Combat (§8.2)
| # | Task | Status |
|---|------|--------|
| A.5 | Broadside firing | ✓ Aim-then-fire (Q/E: first press = aim arrow, second = fire); cooldown |
| A.6 | Projectiles | ✓ `Projectile.js`: sphere mesh; hit detection |
| A.7 | Damage model | ✓ Hull HP, Sails (speed mult), Crew effectiveness |
| A.8 | Combat arena | ✓ Bounded sea with rocks; `CombatScene.js` |

### 5.3 Enemies (§10.1)
| # | Task | Status |
|---|------|--------|
| A.9 | Enemy base | ✓ `Enemy.js`: extends Ship-like behavior |
| A.10 | Trader AI | ✓ Flees, light defenses |
| A.11 | Raider AI | ✓ Rush, aggressive |
| A.12 | Basic loot | ✓ On victory: gold + salvage; R to restart |

### 5.4 Deliverables
- [x] Player ship moves with momentum + turning
- [x] Cannons fire port/starboard with arc preview
- [x] 2 enemy types (Trader, Raider) with distinct AI
- [x] Victory/defeat screen with basic loot display

---

## 7. Phase B: Trading Loop (Milestone B)

**Goal:** 6–8 goods, market UI, buy/sell, repairs, simple variance. *(GDD §8.3, §8.6)*

**Status:** In progress. Overworld map + travel implemented. Economy + Port pending.

### 6.1 Overworld Map (§7.1)
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
| B.4 | Route modifiers | — Stormy, patrolled, shoals (derived from `distanceFromHome` and `hazard`) |

### 6.2 Economy (§8.3)
| # | Task | Details |
|---|------|---------|
| B.5 | Goods config | ✓ `goods.json`: 8 goods (Rum, Timber, Cloth, Iron, Powder, Cannon Parts, Spices, Pearls) |
| B.6 | Price model | Base + Bias + Variance per island |
| B.7 | Market UI | `PortUI.js`: buy/sell list, cargo hold, profit hints |
| B.8 | Cargo system | Ship cargo capacity; load/unload at port |

### 6.3 Port & Repairs (§8.6)
| # | Task | Details |
|---|------|---------|
| B.9 | Port hub | Market, Shipwright (repairs), Tavern (placeholder) |
| B.10 | Repairs | Pay gold to restore hull/sails |
| B.11 | Economy sinks | Repairs, supplies, dock fees |

### 6.4 Deliverables
- [x] Overworld map with procedurally generated islands, click-to-travel
- [ ] Market UI: buy/sell goods, see profit hints
- [ ] Repairs at shipwright
- [ ] Price variance between islands

---

## 8. Phase B.5: Core Gameplay & Rendering ★ Next Step

**Goal:** Improve core gameplay feel, sailing experience, and rendering quality before expanding content. Focus on making the sailing loop satisfying and the visuals readable at all display sizes.

**Status:** In progress. Dynamic GUI, sailing speed, combat zoom fixed. Map UI UX/UI (§8.6) largely complete. Next: Economy (B.6–B.8), Port (B.9–B.11), graphical bugs (§8.3a), sailing polish.

### 8.1 Sailing Experience
| # | Task | Details |
|---|------|---------|
| S.1 | Sailing feel | ✓ Reduced speed (SAILING.maxSpeed 0.22); gentler thrust; distinct from combat |
| S.2 | Wind / heading | — Optional wind direction; slight speed bonus when sailing with wind |
| S.3 | Wake / trail | — Ship wake or foam trail when moving (visual feedback) |
| S.4 | Sailing audio | — Ambient waves, creaking; optional wind SFX |
| S.5 | Corridor feedback | — Subtle edge markers or water color change at corridor bounds |
| S.6 | Arrival feel | — Brief "docked" state; transition to overworld with feedback |

### 8.2 Dynamic GUI & Layout
| # | Task | Details |
|---|------|---------|
| G.1 | Responsive scaling | ✓ CSS custom properties; clamp() for fonts, spacing, radii |
| G.1a | Compact UI | ✓ Reduced font/panel/minimap sizes; fixed overlap; max-width on map panel |
| G.2 | Viewport-aware UI | ✓ Minimap, big map resize with window; HUD scales |
| G.3 | High-DPI / large displays | — Test 4K, ultrawide; ensure readability |
| G.4 | UI scaling option | — Optional user setting: 80%, 100%, 120%, 150% |
| G.5 | Safe zones | — Ensure critical UI not cut off on odd aspect ratios |

### 8.3 Rendering Improvements
| # | Task | Details |
|---|------|---------|
| R.1 | Water surface | — Ripples, subtle wave animation, or gradient depth |
| R.2 | Lighting / atmosphere | — Ambient tint; time-of-day placeholder |
| R.3 | Ship silhouette | — Improve ship mesh; clearer bow/stern; sail shape |
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
| M.2 | Camera smoothing | — Optional lerp on camera follow during sailing |
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
| N.2 | Island labels (optional) | — Tooltip on hover for island name |
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
- [ ] Sailing experience polish (wake, arrival, corridor feedback)
- [ ] Rendering improvements (water, ship, islands)
- [ ] Optional UI scaling setting
- [ ] Graphical bugs investigation (§8.3a R.8)

---

## 9. Phase C: Crew + Upgrades (Milestone C)

**Goal:** Hire crew, stations, 6–8 upgrades, ship tier 2. *(GDD §8.4, §8.5)*

**Status:** Not started. Begin with §9.0 Rendering Refactor (prerequisite).

### 9.0 Rendering Refactor (Prerequisite) ★ First Step

**Goal:** Improve and refactor the rendering logic for a more maintainable and scalable codebase with better configuration. Prepare the renderer for Phase C content (crew, upgrades, ship tiers) and future expansion.

**Status:** Not started.

| # | Task | Details |
|---|------|---------|
| R.1 | Extract scene-specific logic | Split Renderer into smaller modules or methods; combat, overworld, sailing as distinct update paths |
| R.2 | Centralize config usage | Reduce duplication across Renderer, BigMapUI, Minimap; single source of truth for colors, sizes, scales |
| R.3 | Improve separation of concerns | Clear boundaries between scene setup, update, and teardown; shared mesh pools where appropriate |
| R.4 | Config schema & validation | Document config structure; optional runtime validation at startup for missing/typo keys |
| R.5 | Scalable config layout | Group config by view (COMBAT_RENDER, OVERWORLD_RENDER, SAILING_RENDER, UI); easy to add new scenes |
| R.6 | View layer abstraction | Consider lightweight abstraction for scene swapping; simplify adding new view modes (e.g. Port) |

**Deliverables:**
- [ ] Renderer refactored; scene-specific code isolated
- [ ] Config usage consolidated; no scattered literals
- [ ] Config layout documented; ready for new scenes (Port, etc.)
- [ ] No regression in visual output or performance

### 9.1 Crew System (§8.4)
| # | Task | Details |
|---|------|---------|
| C.1 | Crew data | Traits, station aptitude, morale baseline |
| C.2 | Tavern UI | Hire crew from tavern; roster display |
| C.3 | Stations | Helmsman, Gunner P/S, Carpenter, Navigator, Boarding Lead |
| C.4 | Station effects | Apply bonuses to ship/combat stats |
| C.5 | Morale (light) | Shifts from pay, victories, voyage length |

### 9.2 Ship Upgrades (§8.5)
| # | Task | Details |
|---|------|---------|
| C.6 | Upgrade slots | Hull, Sails, Cannons, Cargo, Utility, Boarding |
| C.7 | Upgrade UI | Shipwright: slot selection, stat deltas, cost |
| C.8 | Ship tier 2 | Brig unlock at Infamy 3 |
| C.9 | 6–8 upgrades | Plating, Fast rigging, Heavy shot, etc. |

### 9.3 Progression (§9.1)
| # | Task | Details |
|---|------|---------|
| C.10 | Infamy | Earn from profit, victories; unlock tiers |

### 9.4 Deliverables
- [ ] **9.0 Rendering refactor:** Scene-specific logic extracted; config consolidated; scalable layout
- [ ] Tavern: hire crew, assign stations
- [ ] Crew affects ship stats (turn rate, reload, etc.)
- [ ] Shipwright: 6–8 upgrades across slots
- [ ] Brig unlock at Infamy 3

---

## 10. Phase D: Vertical Slice (Milestone D)

**Goal:** 8–12 islands, contracts, 1 lieutenant boss, tuned economy. *(GDD §9–11)*

### 10.1 Content
| # | Task | Details |
|---|------|---------|
| D.1 | Island count | Expand to 8–12 islands |
| D.2 | Rumors | "Powder high at Port X" — simple text |
| D.3 | Contracts | Delivery, Smuggling, Salvage (1–2 each) |
| D.4 | Contract UI | Accept at tavern; track in HUD |

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
| D.9 | Save system | Ship, crew, islands, reputation (localStorage) |
| D.10 | Main menu | New game, Continue, Settings |

### 10.4 Deliverables
- [ ] 8–12 islands with full routes
- [ ] Contracts: delivery, smuggling, salvage
- [ ] 1 Pirate King Lieutenant boss
- [ ] Save/load via localStorage
- [ ] Main menu + Continue

---

## 11. Polish & Stretch Goals

### 11.1 Effects & Particles (Rendering Polish)
| # | Task | Details |
|---|------|---------|
| P.1 | Cannon muzzle flash | Brief flash/smoke at ship when firing |
| P.2 | Impact splash | Water splash + debris when projectile hits ship |
| P.3 | Hull damage VFX | Sparks, smoke, or debris on hit |
| P.4 | Wake / wake trail | Ship wake or foam trail when moving |
| P.5 | Water surface | Ripples, wave animation, or foam |
| P.6 | Projectile trail | Subtle trail or smoke behind cannonballs |
| P.7 | Particle pool | Reusable particle system for performance |

### 11.2 Polish (Post–Phase D)
- **Effects & particles:** muzzle flash, impact splash, damage VFX, wake trails, water ripples (see §10.1)
- Boarding resolution (§8.2.4): grapple → "Plunder Deep" / "Secure & Sail"
- Fast travel (ferries)
- Accessibility: rebindable controls, UI scaling
- Audio: cannons, ambience, music stings

### 11.3 Stretch
- Procedural encounter modifiers
- Ship tier 3 (Frigate)
- Stronghold boss (multi-phase)
- Optional co-op (2nd player)

---

## 12. Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Three.js learning curve | Start with orthographic + simple meshes; defer shaders |
| Scope creep | Stick to Phase A→D; expansion = separate doc |
| Economy exploits | Sinks, caps, event-driven variance (§19) |
| Combat readability | Strong cannon arc previews; limited VFX |
| Performance | Limit entities; use instancing for projectiles if needed |
| Map generation failures | Retry on disconnected graph; cap retries; fallback to simpler algorithm |

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

### Phase 0 ✓
- [x] `index.html`
- [x] `package.json`, `vite.config.js`
- [x] `src/main.js`, `src/config.js`
- [x] `src/Game.js`, `src/Renderer.js`, `src/Input.js`

### Phase A ✓
- [x] `src/entities/Ship.js`, `Enemy.js`, `Projectile.js`
- [x] `src/systems/SailingSystem.js`, `CombatSystem.js`
- [x] `src/scenes/CombatScene.js`
- [x] `src/ui/HUD.js`

### Phase B (in progress)
- [x] `src/map/MapGenerator.js`, `SeededRNG.js`
- [x] `src/scenes/OverworldScene.js`
- [x] `src/ui/MapUI.js` (route selection panel: connected routes, destination details; UI.routeSelection config)
- [x] `src/ui/BigMapUI.js` (Chart Screen: pan, zoom, M/Esc close; UI.chartScreen config)
- [x] `public/data/goods.json` (8 goods: staples, military, luxury)
- [ ] `src/scenes/PortScene.js`
- [x] `src/systems/EconomySystem.js` (loads goods.json; price model stub for B.6)
- [ ] `src/ui/PortUI.js`

### Phase C
- [ ] `public/data/ships.json`, `crew.json`
- [ ] `src/systems/CrewSystem.js`
- [ ] Tavern UI, Upgrade UI

### Phase D
- [ ] `public/data/contracts.json`, `enemies.json`
- [ ] Boss logic, Save system
- [ ] `src/ui/MenuUI.js`
