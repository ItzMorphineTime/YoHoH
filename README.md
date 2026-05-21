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
>
> **For the implementation plan:** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
> **Per-subsystem improvement docs** — analysis, design notes, and per-pass landing summaries:
> [Improvements.md](Improvements.md) (code quality / perf) ·
> [Sailing_Improvements.md](Sailing_Improvements.md) ·
> [Battle_Improvements.md](Battle_Improvements.md) ·
> [Charting_Improvements.md](Charting_Improvements.md) ·
> [Port_Improvements.md](Port_Improvements.md) ·
> [Logging_Improvements.md](Logging_Improvements.md) (Logger + DebugOverlay) ·
> [Ledger_Improvements.md](Ledger_Improvements.md) (transaction audit trail)

- **Procedural map** — Centre-out planar graph; islands and routes generated from a seed
- **Distance = danger/reward** — Islands farther from Home offer higher risk and reward
- **Trading loop** — Buy low, sell high; prices vary by island; cargo overload penalises speed
- **Naval combat** — Broadside cannons, hull/sails/crew damage, bilge and leaks, projectile FX, damage feedback, rocks-as-cover
- **Crew & ships** — Hire sailors, assign stations (live K overlay), choose ship class (Sloop, Brigantine, Galleon)
- **Strategic chart (M)** — Fog of war on undiscovered islands, route-modifier legend, live voyage strip, animated active route
- **Wind + autopilot** — ±25% top speed depending on heading; `Shift+H` to engage autopilot at 70%
- **Diagnostics** — Tabbed Debug overlay (`` ` ``) with live state, structured event log, transaction ledger, and runtime log-level controls

---

## Features

### World & Navigation
- **Procedurally generated archipelago** — Delaunay-based planar graph; 8–12 islands (configurable seed)
- **Overworld map** — Click routes to sail; hover for destination info (distance, danger, port type, route modifiers)
- **Chart Screen (M)** — Strategic captain's chart with pan, zoom, island labels, compass + wind rose, route-modifier legend, live voyage strip (To / Dist / ETA / Bearing / Wind), corridor sub-events, animated active-route dashes, pulsing "you are here" marker
- **Fog of war (chart-only)** — Islands you've never visited render as `???` until you arrive. Only the chart obscures them — the 3D overworld and minimap show everything so you can plan voyages freely.
- **Minimap** — DPR-aware (sharp on hi-DPI), wind arrow, animated active-route flow dashes, sub-event dots, enemy telegraph during pre-encounter warning, hover tooltip
- **Fit Map / Center on Ship / keyboard pan + zoom** — `+`/`-` zoom, arrow keys pan, `0` reset, `F` fit-all
- **Save/Load maps** — Ctrl+S / Ctrl+O; export/import JSON
- **Onboarding hints** — First-time tips; dismissible, persisted
- **UI scaling** — Settings modal: 75%–150% slider; persisted via localStorage

### Sailing
- **3D sailing corridor** — Ship constrained to route; origin/destination markers + 3D approach ring when close
- **WASD control** — Thrust, brake (no reverse), turn; dt-scaled momentum + drift physics (frame-rate independent)
- **Wind** — Per-map wind direction; ±25% top speed depending on heading-vs-wind alignment
- **Cargo overload** — Heavily-laden ships lose up to 25% speed / 20% turn rate
- **Route modifiers** — Stormy (slower + hull wear) / Patrolled (2× encounter rate) / Shoals (narrower corridor + leak intake)
- **Corridor sub-events** — Flotsam (+gold), debris (-hull +leaks), whirlpool (speed drag), friendly sail (rumor) scattered along each voyage
- **Pre-combat encounter warning** — 3-second telegraph window with flee chance if you hold full throttle
- **Cancel voyage** — `↺ Cancel Voyage` button (gold + crew morale penalty applied)
- **Autopilot** — `H` snap heading to dock; `Shift+H` toggle sustained autopilot at 70% effective max
- **HUD voyage panel** — To / Dist / ETA / 8-point Bearing + heading-delta arrow + wind chip
- **Stations panel** — Live fill chips for each station (Helm / Gunners / Carpenter / Navigator / Sailing / Bilge / Man-at-Arms)
- **Hull / bilge trend arrows** — `↑` while repairing, `↓` while pumping, `↑` red + pulse while flooding
- **Damage persistence** — Hull, sails, bilge, leaks carry over across sailing ↔ combat ↔ port
- **Voyage event toasts** — `Setting sail to X!`, `Land ho — X!`, `📜 Chart updated — X added` on first discovery, `Arrived at X!` (auto vs early-dock variants), `Cancelled`

### Naval Combat
- **Broadside cannons** — Q (port) / E (starboard); aim-then-fire with arc preview that dims while reloading, flashes orange in the last 0.3s before ready
- **Per-class collision radius** — Sloop / Brigantine / Galleon collide at their visual footprints (7 / 9 / 11 units)
- **Damage model** — Hull HP, sails (speed), crew; hull damage → leaks → bilge water
- **Damage feedback** — Camera shake (sub-linear in damage), red vignette flash, HUD hull-bar pulse on every hit
- **Projectile FX** — Muzzle flash at broadside flank, blue splash on miss or rock hit, red spark on ship hit (pooled `CircleGeometry` meshes)
- **Enemy nameplates** — Per-enemy HP bar above each hostile, colour-graded green → yellow → red
- **Win-condition objective** — HUD sub-line `⚔ Sink all enemies (1/2)` so you always know the goal
- **Rocks are real obstacles** — Projectiles + ships collide with them; ships pushed out + 60% speed jolt
- **Enemy AI** — Trader (flees + light defense), Raider (closes then broadsides). Frame-rate independent physics via `SailingSystem` with a synthetic AI input wrapper. Decision cadence (0.5 s) decoupled from physics tick (per-frame).
- **Combat event toasts** — `⚔ Combat — N enemies!`, `Raider sunk!`, `Victory! +50 gold`, etc.
- **Loot** — Gold and salvage on victory; carried into Game-level treasury via the Ledger

### Port & Economy
- **Market** — Buy/sell 8 goods (Rum, Timber, Cloth, Iron, Powder, Cannon Parts, Spices, Pearls)
- **Island-specific prices** — Base + deterministic per-island bias + variance; distance from Home affects prices
- **Cargo system** — Capacity per ship class; unit sizes per good; overload penalty (see Sailing)
- **Dock fees** — Gold deducted on port entry (configurable economy sink)
- **Shipwright** — Repair hull, sails, leaks for gold (cost-breakdown tooltips); change ship class; ship comparison table; upgrade slots collapse into expander
- **Tavern** — Hire crew; "Manage Crew" launches the standalone Crew overlay
- **Status strip** — Persistent Hull / Sails / Morale / Cargo gradient bars above port tabs
- **Activity log** — 30-entry colour-coded list (gain / loss / info) with Clear button
- **Esc-twice exit** — First Esc primes the Leave Port button (amber state); second Esc confirms within 1.5 s
- **Tab persistence** — Active tab restores when re-entering port

### Ships & Crew
- **3 ship classes** — Sloop (agile, 20 cargo), Brigantine (balanced, 40 cargo), Galleon (tough, 60 cargo)
- **Ship comparison** — Side-by-side stats table in Shipwright (Hull, Sails, Crew, Cargo, Turn rate, Speed, Slots)
- **Station slots** — Variable per class; e.g. Galleon has 3 gunner slots, 2 carpenter slots
- **Station effects** — Turn rate, reload speed, sail speed, bilge pump, hull repair, crew effectiveness
- **Standalone Crew overlay (K)** — Reachable from any state (overworld / sailing / combat / port) for live station micro-management. Auto-sources roster from port (when docked) or Game (at sea).
- **Crew morale** — Decays over voyage (faster when undercrewed); restored by serving rum at the tavern + combat victories
- **Carpenter repair** — Assigned carpenters repair hull and stop leaks over time (sailing/combat); HUD trend arrow shows live progress
- **Infamy progression** — Brigantine unlocks at infamy 3, Galleon at 5

### Diagnostics & Logging
- **DebugOverlay (`` ` `` to toggle)** — Tabbed panel: **State** (live values) · **Events** (filterable log) · **Ledger** (transaction history) · **Config** (level controls)
- **Structured Logger** — Categorised, levelled (`trace`/`debug`/`info`/`warn`/`error`), zero-allocation on disabled paths, RAF-batched DOM updates, debounced localStorage persistence
- **Transaction Ledger** — Records every gold / cargo / crew / infamy mutation with source, balance, and context. Persists last 1000 entries × last 5 sessions. CSV / JSON export.
- **Help overlay (`?`)** — Full keybinds reference
- **Runtime log toggles** — `Shift+1..5` for error/warn/info/debug/trace · `?log=trace` URL param · per-category overrides in the Config tab
- **Crash bridges** — `console.warn`/`error`/`window.error`/`unhandledrejection` all route through the Logger for download/copy as a single dump

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

### Anywhere
| Input | Action |
|-------|--------|
| **K** | Open / close standalone Crew overlay |
| **?** (Shift+/) | Help overlay (full keybinds) |
| **` (backtick)** | Toggle Debug overlay (State / Events / Ledger / Config tabs) |
| **Esc** | Close current overlay |

### Overworld
| Input | Action |
|-------|--------|
| **Click route** | Select route; click "Start Sailing" to travel |
| **Click "Enter Port"** | Enter port (when docked) |
| **M** | Open/close Chart Screen |
| **Mouse drag** | Pan overworld map |
| **Scroll** | Zoom overworld map |
| **Ctrl+S** | Save map (JSON) |
| **Ctrl+O** | Load map |

### Chart Screen (M)
| Input | Action |
|-------|--------|
| **Drag** | Pan |
| **Scroll / + / -** | Zoom |
| **Arrow keys** | Pan by a fixed step |
| **F** | Fit map (show every visible island) |
| **0 / Home** | Reset (centre on ship + zoom 1) |
| **M / Esc** | Close |

### Sailing
| Input | Action |
|-------|--------|
| **W / S** | Throttle (no reverse) / brake |
| **A / D** | Turn port / starboard |
| **F** | Dock at destination (when in approach zone) |
| **H** | Snap heading toward destination (one-shot) |
| **Shift+H** | Toggle autopilot (auto-steer + auto-throttle at 70%) |
| **M** | Open Chart Screen (pauses voyage) |
| **K** | Manage crew mid-voyage |
| **Esc** | Open chart / use the `↺ Cancel Voyage` button in MapUI |

### Combat
| Input | Action |
|-------|--------|
| **WASD** | Sail / maneuver |
| **Q** | Aim port cannons (1st press) → Fire (2nd press) |
| **E** | Aim starboard cannons (1st press) → Fire (2nd press) |
| **Esc** | Return to map / port (after victory/defeat) |
| **R** | Dev cheat — restart combat (gated by `GAME.devCheats.combatRestart`) |

### Port
| Input | Action |
|-------|--------|
| **Click tabs** | Tavern · Shipwright · Market |
| **Click "Manage Crew"** | Open standalone Crew overlay |
| **Esc · twice (within 1.5s)** | Leave port (first Esc primes the amber Leave Port button) |

### Debug overlay (`` ` ``)
| Input | Action |
|-------|--------|
| **Tab** | Cycle tabs (State / Events / Ledger / Config) |
| **Shift+1..5** | Master log level — error / warn / info / debug / trace |
| **Shift+L** | Clear event log |
| **Shift+D** | Download dump as `.txt` |
| **Shift+C** | Copy dump to clipboard |

### Settings
| Input | Action |
|-------|--------|
| **⚙ button** | Open Settings modal (UI scale 75%–150%) |

---

## Diagnostics & Logging

Press `` ` `` (backtick) any time to open the **Debug overlay** — a tabbed panel with four sections:

| Tab | What's in it |
|---|---|
| **State** | Live game state — fps, current state, ship physics, voyage progress, encounter timer |
| **Events** | Categorised, levelled, filterable log stream. Level threshold dropdown · category chips with counts · text search · pause + auto-scroll toggles · expandable `data` payloads |
| **Ledger** | Every transaction the player has made — gold spent / earned, cargo flow, crew hires, dock fees, combat loot. Filter by type / category / search. Summary strip shows net change. **CSV / JSON export** built in. |
| **Config** | Logger preset buttons (`silent` / `production` / `developer` / `verbose`), per-sink level dropdowns, per-category override prompts |

### Log levels and toggles
Five levels: `silent` · `error` · `warn` · `info` · `debug` · `trace`. Four ways to change them at runtime — no reload required:

- **`Shift+1..5`** (while debug overlay is visible) — master switch across all sinks
- **Config tab** — preset buttons + per-sink dropdowns + per-category overrides
- **URL params** — `?log=trace` (global) or `?log=sailing:debug,combat:trace` (per-category) — useful for reproduce-this-bug links
- **JS console** — `log.setLevel('sailing', 'trace')` / `log.setPreset('verbose')` / `log.describe()` (the global `log` is exposed in dev builds)

Levels persist to `localStorage` so your verbosity preference survives reloads.

### Transaction Ledger
Every economic mutation in the game produces an immutable ledger entry — `{ type, category, source, delta, balance, context, state, ts }`. Sources are drawn from a single catalogue (`SUPPLIES_COST` / `DOCK_FEE` / `COMBAT_LOOT` / `FLOTSAM_RECOVERED` / `CANCEL_VOYAGE_PENALTY` / `SYSTEM_STARTING_GOLD` / etc.) so the audit trail can't fragment from typos. Entries persist across sessions (last 1000 per session × last 5 sessions). When a player asks "where did my gold go?" — open the Ledger tab and filter by `sailing` / `port` / `combat`.

### Crash / bug reports
The Logger intercepts `console.warn` / `console.error` / `window.error` / `unhandledrejection` so external noise routes through the same pipe. The Copy / Download buttons in the overlay header produce a single `.txt` (or `.csv`/`.json` for the ledger) bundling: live state · most-recent ~2000 events · current-session ledger · timestamps · log levels. Paste it into a bug report and the dev has full context.

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

**First-time tips:**
- Press **`?`** any time for the full keybinds reference.
- Press **`` ` ``** (backtick) to open the Debug overlay — switch to the **Ledger** tab to see every gold / cargo transaction as it happens.
- Append **`?log=debug`** (or `?log=sailing:trace,combat:debug`) to the URL to boost log verbosity for a reproduce-this-bug session.

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

### Game phases
| Phase | Status | Focus |
|-------|--------|-------|
| **0** | ✅ Done | Foundation — project, renderer, game loop |
| **1** | ✅ Done | Map Generator POC — procedural archipelago, editor, Save/Load |
| **1b** | ✅ Done | Island Generator POC — 3D terrain, buildings, props, paths, themes, post-processing |
| **A** | ✅ Done | Fun First Combat — ship handling, cannons, 2 enemy types, loot |
| **B** | ✅ Done | Trading Loop — overworld, travel, Chart Screen, market, repairs, dock fees, route modifiers |
| **B.5** | 🔄 In progress | Core gameplay polish — sailing feel ✓, fog of war ✓, autopilot ✓, wind ✓, corridor events ✓, cargo overload ✓; remaining rendering polish (water surface, ship silhouette) |
| **C** | ✅ Done | Crew + Upgrades — hire/assign, ship classes, comparison UI, upgrades, Infamy gates, morale |
| **D** | 🔄 Partial | Vertical Slice — 8–12 islands ✓, save/load ✓, main menu ✓; contracts, Lieutenant boss, ship naming pending |
| **E** | ⏳ Planned | POC → Main Game Integration — load POC JSON exports as canonical game content; new `IslandScene` |
| **Polish** | ⏳ Planned | Effects polish, audio, accessibility |

### Per-subsystem improvement passes (landed)

The project has been driven through several focused improvement passes — each with its own analysis doc + per-pass landing summary. Status of each:

| Pass | Doc | Landed |
|---|---|---|
| Code-quality / perf | [Improvements.md](Improvements.md) | 4 passes — dt-scaling fundamentals, mesh pooling, save versioning, encounter Poisson process |
| Sailing physics + UX | [Sailing_Improvements.md](Sailing_Improvements.md) | dt-scaled physics, wind, autopilot, route modifiers, corridor sub-events, encounter warning + flee, cancel-voyage penalty, voyage event queue, HUD voyage panel, station chips, trend arrows, `?` overlay, help shortcuts, `Start Sailing` silent-fail fix |
| Charting UX | [Charting_Improvements.md](Charting_Improvements.md) | DPR-aware minimap, island tooltips, route-modifier legend, corridor events on chart, voyage strip, Fit Map button, keyboard pan/zoom, ship heading line, active-route flow dashes, pulsing "you are here", fog of war (chart-only), ARIA roles |
| Port + Crew UX | [Port_Improvements.md](Port_Improvements.md) | Tab buttons bugfix, Crew Management overlay (standalone, K keybind), status strip, activity log, Esc-twice exit, repair cost tooltips, upgrade slot expander |
| Combat | [Battle_Improvements.md](Battle_Improvements.md) | Enemy physics via SailingSystem, per-class collision radius, COMBAT_RESULT enum, enemy HP bars, win-condition sub-line, cannon arc opacity, projectile FX (muzzle/splash/hit), damage feedback (shake/vignette/pulse), rocks-as-cover, combat event log |
| Logging | [Logging_Improvements.md](Logging_Improvements.md) | Phase L1 (Logger foundation, levels, sinks, runtime toggles, URL params, persistence) + Phase L2 (tabbed DebugOverlay, filter bar, pause/auto-scroll, Ledger tab, Config tab) |
| Transaction Ledger | [Ledger_Improvements.md](Ledger_Improvements.md) | Phase X1 (`src/utils/Ledger.js` + `LedgerSources.js`, Game `_adjustGold`/`_adjustInfamy`/`_adjustCargo`/`_addCrew`/`_removeCrew` helpers, 6 high-traffic site migrations, DebugOverlay Ledger tab with CSV/JSON export) |

### Upcoming
- **Phase B.5:** Rendering polish (water surface, ship silhouette, island visuals), graphical-bug pass
- **Phase D:** Contracts (delivery, smuggling, salvage), ship naming, tiered enemy classes, Lieutenant boss
- **Phase E:** POC → main-game integration — designers craft maps + 3D islands in the editors and export JSON the main game loads at runtime. See [§11 in the implementation plan](IMPLEMENTATION_PLAN.md#11-phase-e-poc--main-game-integration).
- **Logging Phase L3 / L4:** True virtualisation for the Events tab, resize + drag-to-reposition for the debug overlay, crash modal with auto-attached state snapshot
- **Ledger Phase X2:** Hook PortController per-transaction (replaces the current `port_net_session` placeholder), ship-state bookmarks (arrival / port-end / combat-end), save-game integration
- **Combat next-pass:** EncounterSpec factory (tiered enemy classes scaled by route danger + infamy), boarding actions (wire `boarding_nets` / `grappling_hooks` upgrades), ammo types, surrender / capture mechanics
- **Polish:** Wake trails, water ripples, sound stubs, accessibility (keyboard nav of route list, focus management)
- **Code quality:** See [Improvements.md](Improvements.md) for the remaining prioritised backlog (Renderer split, SettingsBindings extraction, PortUI per-tab classes)

---

## Project Structure

```
YoHoH/
├── index.html              # Main game entry — HUD / overlays / CSS
├── package.json            # Vite + Three.js + d3-delaunay + simplex-noise
├── vite.config.js
├── .gitignore              # Ignores node_modules, dist, .vite, .env, .DS_Store, etc.
├── README.md
├── IMPLEMENTATION_PLAN.md  # Phased design doc — Phase 0/1/A/B/B.5/C/D/E + per-pass landing notes
├── Improvements.md         # Code-quality / perf backlog with effort × impact
├── Sailing_Improvements.md # Voyage physics + UX backlog
├── Battle_Improvements.md  # Combat physics + UX backlog
├── Charting_Improvements.md# Chart screen + minimap + map UI backlog
├── Port_Improvements.md    # Port + crew UX backlog
├── Logging_Improvements.md # Logger + DebugOverlay roadmap (Phase L1 + L2 landed)
├── Ledger_Improvements.md  # Transaction ledger design (Phase X1 landed)
├── LORE.md                 # World backstory, Pirate Kings, dragons
├── LICENSE, FAN_CONTENT_POLICY.md
├── Images/                 # 2D art (Pirate Kings, dragons, ships, islands, maps, familiars)
├── 3D_Models/              # FBX assets — dragons, items, props, pirate kings
├── docs/                   # Presentation GDD (GitHub Pages), 3D viewer, LOREBOOK
├── src/
│   ├── main.js             # Bootstrap, main menu wiring
│   ├── config.js           # Centralised config (WORLD, CAMERA, COMBAT, SAILING, WIND, AUTOPILOT,
│   │                       #   CORRIDOR_EVENTS, CARGO_LOAD, ARRIVAL, CANCEL_VOYAGE, ECONOMY,
│   │                       #   CREW, REPAIR, BILGE, ROUTE_MODIFIER_EFFECTS, AUTOPILOT, UI,
│   │                       #   GAME.logging.preset, …)
│   ├── Game.js             # Game loop + OVERWORLD/SAILING/COMBAT/PORT state machine + Logger
│   │                       #   bootstrap + Ledger helpers (_adjustGold / _adjustInfamy / _adjustCargo
│   │                       #   / _addCrew / _removeCrew)
│   ├── Renderer.js         # Three.js orthographic renderer — 3 view modes; combat camera shake;
│   │                       #   pooled FX (muzzle / splash / hit); enemy HP bars; approach ring
│   ├── Input.js            # Keyboard + mouse (debounced, allocation-free)
│   ├── map/                # MapGenerator (Delaunay), MapSerializer, SeededRNG — fog-of-war aware
│   ├── render/             # OverworldRenderer (3D scene), RenderConfig (per-view config)
│   ├── entities/           # Ship (applyClassPhysics), Sloop, Brigantine, Galleon, Enemy
│   │                       #   (SailingSystem-driven AI), Projectile, ships factory
│   ├── systems/            # SailingSystem (frame-rate-independent), CombatSystem (FX + ledger),
│   │                       #   EconomySystem, CrewSystem (morale + station effects)
│   ├── scenes/             # OverworldScene (voyage-event queue, corridor events),
│   │                       #   CombatScene (combat-event queue, rocks-collide), PortScene
│   ├── controllers/        # PortController, CrewController (state-aware sourcing)
│   ├── ui/                 # HUD (trend arrows, voyage panel, stations, combat objective),
│   │                       #   MapUI (route panel, toasts), MapChartingUI (chart screen — fog,
│   │                       #   wind, voyage strip, animated routes, pulsing "you are here"),
│   │                       #   Minimap (DPR-aware, telegraph, sub-events), PortUI, CrewUI,
│   │                       #   DebugOverlay (tabbed: State / Events / Ledger / Config),
│   │                       #   HelpOverlay (`?` keybinds reference)
│   └── utils/              # Logger.js + LedgerSources.js + Ledger.js (singleton ledger),
│                           #   routeModifiers, upgrades, saveSystem (localStorage, schema versioned),
│                           #   fogOfWar (isNodeVisible / isEdgeVisible — Chart Screen only),
│                           #   escapeHtml
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
