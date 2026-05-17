# YoHoH — You Only Have One Hull

<p align="center">
  <strong>A browser-based pirate adventure prototype</strong><br>
  Top-down sailing • Trading • Naval combat
</p>

<p align="center">
  <img src="Images/Islands/Island_01.png" alt="The Shattered Seas" width="480">
  <img src="Images/Ships/WarBrig_01.png" alt="The Shattered Seas" width="480">
  <img src="Images/Maps/TopDownMap_04.jpg" alt="The Shattered Seas" width="480">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Three.js-r160+-blue" alt="Three.js">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow" alt="JavaScript">
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF" alt="Vite">
</p>

<p align="center">
  <strong><a href="https://itzmorphinetime.github.io/YoHoH/">View Presentation GDD →</a></strong>
</p>

<p align="center">
  <strong><a href="https://itzmorphinetime.github.io/YoHoH/LOREBOOK.html">Read Lore Book →</a></strong>
</p>

---

## Overview

**YoHoH** is a small indie prototype for a pirate adventure game set in **The Shattered Seas**—a fractured archipelago where old empires drowned and five Pirate Kings rose from the wreckage. Sail a procedurally generated archipelago, trade goods between islands, fight naval battles, and manage your crew. Built with **Three.js** for top-down 2.5D rendering in the browser.

> *See [LORE.md](LORE.md) for the full world backstory and the Five Pirate Kings.*
> *See the [Presentation GDD](https://itzmorphinetime.github.io/YoHoH/) for a visual presentation (GitHub Pages).*
> *See [docs/LOREBOOK.html](docs/LOREBOOK.html) for in-depth lore on the world and characters.*
> *Presentation King cards have a 📖 button to view lore. Run `npm run extract-lore` after updating LORE.md to refresh presentation data.*
> *The presentation includes an interactive **3D Models** slide—click any model card to preview in 3D (drag to rotate, scroll to zoom, view presets).*
> *For the full implementation plan see [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). For the running list of code-quality / perf improvements see [Improvements.md](Improvements.md).*

- **Procedural map** — Center-out planar graph; islands and routes generated from a seed
- **Distance = danger/reward** — Islands farther from Home offer higher risk and reward
- **Trading loop** — Buy low, sell high; prices vary by island
- **Naval combat** — Broadside cannons, hull/sails/crew damage, bilge and leaks
- **Crew & ships** — Hire sailors, assign stations, choose ship class (Sloop, Brigantine, Galleon)

---

## Features

### World & Navigation
- **Procedurally generated archipelago** — Delaunay-based planar graph; 8–12 islands (configurable)
- **Overworld map** — Click routes to sail; hover for destination info (distance, danger, port type)
- **Chart Screen (M)** — Strategic map overlay with pan, zoom, island labels, legend, compass rose
- **Minimap** — North indicator, sailing progress bar, route context
- **Save/Load maps** — Ctrl+S / Ctrl+O; export/import JSON
- **Onboarding hints** — First-time tips; dismissible, persisted
- **UI scaling** — Settings modal: 75%–150% slider; persisted via localStorage

### Sailing
- **3D sailing corridor** — Ship constrained to route; origin/destination markers
- **WASD control** — Thrust, brake, turn; momentum and drift
- **Random encounters** — Combat can trigger while sailing
- **Damage persistence** — Hull, sails, bilge, leaks carry over
- **Arrival feedback** — Toast "Arrived at [Island]!" when reaching destination

### Naval Combat
- **Broadside cannons** — Q (port) / E (starboard); aim-then-fire with arc preview
- **Damage model** — Hull HP, sails (speed), crew effectiveness; hull damage → leaks → bilge water
- **2 enemy types** — Trader (flees) and Raider (aggressive)
- **Loot** — Gold and salvage on victory

### Port & Economy
- **Market** — Buy/sell 8 goods (Rum, Timber, Cloth, Iron, Powder, Cannon Parts, Spices, Pearls)
- **Island-specific prices** — Base + bias + variance; distance from Home affects prices
- **Cargo system** — Capacity per ship class; unit sizes per good
- **Dock fees** — Gold deducted on port entry (configurable economy sink)
- **Shipwright** — Repair hull, sails, leaks for gold; change ship class; ship comparison table
- **Tavern (Crew Management)** — Hire crew; station overview (fill status); assign/dismiss; roster with station dropdown

### Ships & Crew
- **3 ship classes** — Sloop (agile, 20 cargo), Brigantine (balanced, 40 cargo), Galleon (tough, 60 cargo)
- **Ship comparison** — Side-by-side stats table in Shipwright (Hull, Sails, Crew, Cargo, Turn rate, Speed, Slots)
- **Station slots** — Variable per class; e.g. Galleon has 3 gunner slots, 2 carpenter slots
- **Station effects** — Turn rate, reload speed, sail speed, bilge pump, hull repair
- **Carpenter repair** — Assigned carpenters repair hull and stop leaks over time (sailing/combat)

<p align="center">
  <img src="Images/Ships/Sloop_01.png" alt="Sloop" width="140">
  <img src="Images/Ships/Merchant_01.png" alt="Merchant" width="140">
  <img src="Images/Ships/WarBrig_01.png" alt="Brigantine" width="140">
  <img src="Images/Ships/Galleon_01.png" alt="Galleon" width="140">
</p>

---

## The Shattered Seas

Sail the fractured archipelago where five Pirate Kings hold dominion. Your mission: **rescue the last of the dragons** from those who hunt them.

<p align="center">
  <img src="Images/PirateKings/JasperBarrow.png" alt="Jasper Barrow" width="100">
  <img src="Images/PirateKings/Captain_Mordekai_Drakon.png" alt="Mordekai Drakon" width="100">
  <img src="Images/PirateKings/Lady_Adara_Thalassa.png" alt="Adara Thalassa" width="100">
  <img src="Images/PirateKings/Nimue_Tideborn.png" alt="Nimue Tideborn" width="100">
  <img src="Images/PirateKings/Flameheart_01.png" alt="Ebon Flameheart" width="100">
</p>

<p align="center">
  <em>The Five Pirate Kings — Ghost Captain, Sea Serpent, Leviathan Queen, Kraken Caller, Dragon Marauder</em>
</p>

<p align="center">
  <img src="Images/Dragons/Blaze.png" alt="Blaze" width="80">
  <img src="Images/Dragons/Speedy.png" alt="Speedy" width="80">
  <img src="Images/Dragons/Icey.png" alt="Icey" width="80">
  <img src="Images/Dragons/Elder.png" alt="Elder" width="80">
  <img src="Images/Dragons/Blackfang.png" alt="Blackfang" width="80">
</p>

<p align="center">
  <em>Rescue the dragons. Defy the Kings.</em>
</p>


<p align="center">
  <img src="Images/Familiars/Gloomfeather.png" alt="Gloomfeather" width="80">
  <img src="Images/Familiars/Ssyrix.png" alt="Ssyrix" width="80">
  <img src="Images/Familiars/Pearl.png" alt="Pearl" width="80">
  <img src="Images/Familiars/Inkshadow.png" alt="Inkshadow" width="80">
  <img src="Images/Familiars/Ember.png" alt="Ember" width="80">
</p>

<p align="center">
  <em>Find Familiars / Pets along the way.</em>
</p>

---

## Controls

### Overworld
| Input | Action |
|-------|--------|
| **Click route** | Select route; click "Set Sail" to travel |
| **Click island** | Enter port (when docked) |
| **M** | Open/close Chart Screen |
| **Mouse drag** | Pan overworld map |
| **Scroll** | Zoom overworld map |
| **Ctrl+S** | Save map (JSON) |
| **Ctrl+O** | Load map |

### Sailing
| Input | Action |
|-------|--------|
| **W / S** | Thrust forward / brake |
| **A / D** | Turn port / starboard |
| **M** | Open/close Chart Screen |
| **Esc** | — |

### Combat
| Input | Action |
|-------|--------|
| **WASD** | Sail / maneuver |
| **Q** | Aim port cannons (first press) → Fire (second press) |
| **E** | Aim starboard cannons (first press) → Fire (second press) |
| **R** | Restart combat (after victory/defeat) |
| **Esc** | Return to map (after victory/defeat) |

### Port
| Input | Action |
|-------|--------|
| **Click tabs** | Tavern, Shipwright, Market |
| **Escape** | Leave port |

### Settings
| Input | Action |
|-------|--------|
| **⚙ button** | Open Settings modal (UI scale 75%–150%) |

---

## Quick Start

**Requirements:** Node.js 18+ and npm.

### Main Game

```bash
git clone https://github.com/ItzMorphineTime/YoHoH.git
cd YoHoH
npm install
npm run dev
```

Open **http://localhost:5173**

> Other npm scripts: `npm run build` (Vite production build → `dist/`), `npm run preview` (serve the build), `npm run extract-lore` (parse `LORE.md` → `public/data/pirate-kings-lore.json` used by the presentation).

### Standalone POCs

Two proof-of-concept tools for procedural content:

| POC | Description | Run |
|-----|-------------|-----|
| **[Map Generator](map-generator-poc/)** | Procedural archipelago — Delaunay planar graph, island nodes, routes, pirate data, editor | `cd map-generator-poc && npm install && npm run dev` |
| **[Island Generator](island-generator-poc/)** | Procedural island terrain — Simplex noise, building placement, island properties, automatic paths | `cd island-generator-poc && npm install && npm run dev` |

**Map Generator** — Center-out planar graph; islands and routes; edit mode (add/remove nodes, routes); Save/Load JSON. See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) §5.

**Island Generator** — 3D terrain with Simplex noise; beach/grass/rock/snow elevation colors; **island themes** (Normal, Volcanic, Icey, Swampy) for terrain color schemes; tile-based building placement (Tavern, Shipwright, Market, Lighthouse, Warehouse, Fort, Docks, Dragon Sanctuary); **island properties** (name, description, theme, trait, treasure, port type, hazard, faction, rumors); **building selection** — click building to select, properties panel with Rotate/Remove; **cargo size** from building dimensions; **automatic paths** (Prim's MST + A*, terrain smoothing, path color, path width 1–5); **docks over water**; **props & decorations** (BerryBush, OakTree, PalmTree, Rock); brush elevation editing; Save/Load with full schema; example JSON presets. **Post-processing** — Bloom, SSAO, FXAA, Film; **Settings: Graphics** (🎨) modal for Display (height scale, wireframe, shadows), Graphics (pixel ratio), and Post-processing controls. See [island-generator-poc/ISLAND_GENERATOR.md](island-generator-poc/ISLAND_GENERATOR.md) and [island-generator-poc/ISLAND_GEN_RENDERING.md](island-generator-poc/ISLAND_GEN_RENDERING.md) for the full plan and rendering details.
<p align="center">
  <img src="Images/Islands/IslandEditor_01.png" alt="Procedural map layout" width="400">
  <img src="Images/Islands/IslandEditor_02.png" alt="Procedural map layout" width="400">
</p>
<p align="center">
  <img src="Images/Maps/MapLayout.png" alt="Procedural map layout" width="400">
  <img src="Images/Maps/MapEditor.png" alt="Archipelago map" width="400">
</p>

---

## Roadmap

| Phase | Status | Focus |
|-------|--------|-------|
| **0** | ✅ Done | Foundation — project, renderer, game loop |
| **1** | ✅ Done | Map Generator POC — procedural archipelago, editor, Save/Load |
| **1b** | ✅ Done | Island Generator POC — 3D terrain, buildings, props, paths, themes, post-processing |
| **A** | ✅ Done | Fun First Combat — ship handling, cannons, 2 enemy types, loot |
| **B** | ✅ Done | Trading Loop — overworld, travel, Chart Screen, market, repairs, dock fees, route modifiers |
| **B.5** | 🔄 In progress | Core gameplay polish — sailing feel, arrival toast, UI scaling, wake, camera smoothing ✓; rendering polish pending |
| **C** | ✅ Done | Crew + Upgrades — hire/assign, ship classes, comparison UI, upgrades, Infamy gates, morale |
| **D** | 🔄 Partial | Vertical Slice — 8–12 islands ✓, save/load ✓, main menu ✓; contracts, Lieutenant boss, ship naming pending |
| **E** | ⏳ Planned | POC → Main Game Integration — load POC JSON exports as canonical game content; new `IslandScene` |
| **Polish** | ⏳ Planned | Effects, particles, audio, accessibility |

### Upcoming
- **Phase B.5:** Rendering polish (water surface, ship silhouette, island visuals), graphical-bug pass
- **Phase D:** Contracts (delivery, smuggling, salvage), ship naming, enemy ship classes, Lieutenant boss
- **Phase E:** Use the POCs as authoring tools — designers craft maps + 3D islands in the editors and export JSON the main game loads at runtime. See [§11 in the implementation plan](IMPLEMENTATION_PLAN.md#11-phase-e-poc--main-game-integration).
- **Polish:** Muzzle flash, impact splash, wake trails, water ripples, boarding resolution
- **Code quality:** See [Improvements.md](Improvements.md) for the prioritized backlog (Three.js mesh pooling, PortUI re-renders, save schema versioning, etc.)

---

## Project Structure

```
YoHoH/
├── index.html              # Main game entry
├── package.json            # Vite + Three.js + d3-delaunay
├── vite.config.js
├── .gitignore              # Ignores node_modules, dist, .vite, .env, .DS_Store, etc.
├── README.md
├── IMPLEMENTATION_PLAN.md  # Phased design doc — Phase 0/1/A/B/B.5/C/D/E
├── Improvements.md         # Code-quality / perf backlog with effort × impact
├── LORE.md                 # World backstory, Pirate Kings, dragons
├── LICENSE, FAN_CONTENT_POLICY.md
├── Images/                 # 2D art (Pirate Kings, dragons, ships, islands, maps, familiars)
├── 3D_Models/              # FBX assets — dragons, items, props, pirate kings
├── docs/                   # Presentation GDD (GitHub Pages), 3D viewer, LOREBOOK
├── src/
│   ├── main.js             # Bootstrap, main menu wiring
│   ├── config.js           # Centralized config (WORLD, CAMERA, COMBAT, ECONOMY, UI, …)
│   ├── Game.js             # Game loop + OVERWORLD/SAILING/COMBAT/PORT state machine
│   ├── Renderer.js         # Three.js orthographic renderer (3 view modes)
│   ├── Input.js            # Keyboard + mouse
│   ├── map/                # MapGenerator (Delaunay), MapSerializer, SeededRNG
│   ├── render/             # RenderConfig — per-view rendering config
│   ├── entities/           # Ship, Sloop, Brigantine, Galleon, Enemy, Projectile, ships factory
│   ├── systems/            # SailingSystem, CombatSystem, EconomySystem, CrewSystem
│   ├── scenes/             # OverworldScene, CombatScene, PortScene
│   ├── ui/                 # HUD, MapUI, MapChartingUI, Minimap, PortUI
│   └── utils/              # routeModifiers, upgrades, saveSystem (localStorage)
├── public/data/
│   ├── goods.json          # 8 trade goods
│   ├── lore.json           # World lore data (Kings, dragons)
│   └── pirate-kings-lore.json  # Generated by `npm run extract-lore`
├── scripts/
│   └── extract-lore.js     # Parse LORE.md → pirate-kings-lore.json for presentation
├── map-generator-poc/      # Standalone archipelago editor (Delaunay, routes, pirate enrichment)
└── island-generator-poc/   # Standalone island terrain authoring tool
                            #   (noise, buildings, props, paths, themes, post-FX, Save/Load)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Rendering | Three.js (r160+), orthographic camera |
| UI | HTML/CSS + DOM |
| State | Vanilla JavaScript (ES6+ modules) |
| Build | Vite 5.x |
| Map graph | d3-delaunay (planar graph) |
| Terrain | simplex-noise (island POC) |

---

## Repository Hygiene

A `.gitignore` is included that excludes:

- `node_modules/` (any depth) — installed via `npm install`
- `dist/` and `.vite/` — Vite build output and dep cache
- `.env*` (except `.env.example`) — local secrets
- `.DS_Store`, `Thumbs.db`, editor folders (`.vscode/`, `.idea/`)
- `.claude/` — local Claude Code worktree / agent state
- `island-generator-poc/saves/`, `map-generator-poc/Saves/` — ad-hoc working exports (large, regenerable)

### Cleaning up files that were tracked before the `.gitignore` existed

If `git status` shows tracked `node_modules/`, `dist/`, or `.vite/` files from earlier commits, untrack them without deleting your local copy:

```bash
git rm -r --cached node_modules dist .vite \
  island-generator-poc/node_modules island-generator-poc/dist \
  map-generator-poc/node_modules map-generator-poc/.vite
git commit -m "Untrack build artifacts; covered by .gitignore"
```

Files stay on disk; only the index entries are removed. After this, `npm install` and `npm run build` regenerate them locally without dirtying the tree.

---

## License

As specified in the repository
