# YoHoH — You Only Have One Hull

Pirate adventure prototype. Top-down sailing, trading, and naval combat.

## Quick Start

### Main Game (Phase 0+)

```bash
cd Demo
npm install
npm run dev
```

Open http://localhost:5173 — **WASD** sail, **Q** port broadside, **E** starboard broadside, **R** restart (after victory/defeat).

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
│   ├── config.js        # WORLD, CAMERA, GAME_STATES, COMBAT
│   ├── Game.js          # Game loop, state machine, combat scene
│   ├── Renderer.js      # Three.js orthographic renderer
│   ├── Input.js         # Keyboard + mouse
│   ├── entities/        # Ship, Enemy, Projectile
│   ├── systems/         # SailingSystem, CombatSystem
│   ├── scenes/          # CombatScene
│   └── ui/              # HUD
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
| B | — | Trading Loop — overworld map, market, repairs |
| C | — | Crew + Upgrades |
| D | — | Vertical Slice |
