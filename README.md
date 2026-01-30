# YoHoH — You Only Have One Hull

Pirate adventure prototype. Top-down sailing, trading, and naval combat.

## Quick Start

### Main Game (Phase 0+)

```bash
cd Demo
npm install
npm run dev
```

Open http://localhost:5173

**Overworld:** Hover routes for info, click to sail. **M** opens Chart Screen (strategic map with pan/zoom).  
**Sailing:** WASD to sail, **M** for Chart Screen.  
**Combat:** WASD sail, Q/E aim-then-fire, R restart, Esc return to map.

### Map Generator POC (Phase 1)

```bash
cd Demo/map-generator-poc
npm install
npm run dev
```

Open http://localhost:5173 — procedural archipelago map editor.

## Project Structure

```
Demo/
├── index.html           # Main game entry
├── package.json
├── src/
│   ├── main.js          # Bootstrap
│   ├── config.js        # WORLD, CAMERA, GAME_STATES, COMBAT, UI
│   ├── Game.js          # Game loop, state machine, overworld/combat
│   ├── Renderer.js      # Three.js orthographic renderer
│   ├── Input.js         # Keyboard + mouse
│   ├── map/             # MapGenerator (Delaunay planar graph)
│   ├── entities/        # Ship, Enemy, Projectile
│   ├── systems/         # SailingSystem, CombatSystem
│   ├── scenes/          # OverworldScene, CombatScene
│   └── ui/              # HUD, MapUI, BigMapUI (Chart Screen), Minimap
├── map-generator-poc/   # Phase 1: Procedural map (standalone)
├── PlanarGraphPython/   # Reference implementation
└── IMPLEMENTATION_PLAN.md
```

## Phases

| Phase | Status | Focus |
|-------|--------|-------|
| 0 | ✓ | Foundation — project, renderer, game loop, ship placeholder |
| 1 | ✓ | Map Generator POC — procedural archipelago, editor |
| A | ✓ | Fun First Combat — ship handling, cannons, 2 enemy types, loot |
| B | ◐ | Trading Loop — overworld ✓, travel ✓, Chart Screen (M) ✓, market/repairs pending |
| C | — | Crew + Upgrades |
| D | — | Vertical Slice |

## Controls

| Key | Action |
|-----|--------|
| **M** | Open/close Chart Screen (strategic map) |
| **Esc** | Close Chart Screen; return to map from combat |
| **WASD** | Sail / move ship |
| **Q / E** | Aim port / starboard cannons (combat) |
| **R** | Restart combat |
