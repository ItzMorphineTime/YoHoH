# YoHoH Map Generator — Standalone POC

**Phase 1:** Procedural archipelago map generation for the pirate-themed adventure travel game. Center-out planar graph with full map editing and pirate custom data.

## Quick Start

```bash
cd map-generator-poc
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Features

### Map Generation
- **Center-out expansion:** Graph grows from Home Island (center). Islands farther from center = higher danger/reward tier (per GDD §7.1).
- **Planar graph via Delaunay:** No edge crossings; nodes = islands, edges = charted routes.
- **Seeded RNG:** Same seed → same map. Leave seed empty for random.
- **Pirate custom data:** Procedurally generated island names, descriptions, treasure levels, port types, hazards, factions, and rumors.

### Map Editing
- **Save/Load:** Export maps as JSON; load saved maps for editing.
- **Edit mode:** Full map editor with tools:
  - **Select island:** Click to select; click again to cycle trait (normal→dangerous→appealing).
  - **Movement gizmo:** X/Y axis handles with hover feedback; drag to reposition.
  - **Add island:** Click on canvas to place new islands (auto-connects to nearest).
  - **Remove island:** Delete selected island (keeps graph valid).
  - **Add route:** Click two islands to connect (planarity preserved).
  - **Remove route:** Click routes to remove (keeps graph connected).
- **Island Properties panel:** Edit selected island — name, description, position, trait, treasure level, port type, hazard, faction, rumors, Set as Home, Delete.

### Navigation
- **Middle-mouse drag:** Pan the canvas.
- **Scroll wheel:** Zoom in/out.

### Visual Encoding
- **Blue** = Home Island (center)
- **Gray** = Normal island
- **Red** = Dangerous island
- **Green** = Appealing island
- **Distance ring** = Green (near) → Purple (far) = graph distance from home

## Algorithm

**Planar graph via Delaunay triangulation** (no edge crossings):

1. **Point placement:** Center-out growth from Home Island (0, 0). Each new island is placed at `expansionDistance` from a random existing island, with `minPointDistance` constraint to avoid clustering.
2. **Delaunay triangulation:** On the placed points — produces a planar graph by construction (no crossing routes).
3. **Edge pruning:** Remove Delaunay edges longer than `maxEdgeLength`; add back shortest edges if this disconnects the graph.
4. **Prune chance:** With probability `pruneChance`, remove each edge if the graph stays connected (keeps planarity).
5. **Graph distance:** BFS from home → hop count = danger/reward tier.
6. **Pirate enrichment:** Procedural names, descriptions, treasure levels, port types, hazards, factions based on traits and distance.

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `numIslands` | 20 | Target number of islands |
| `expansionDistance` | 30 | Distance between connected islands |
| `minPointDistance` | 40% of expansion | Minimum distance between any two islands |
| `maxEdgeLength` | 150% of expansion | Prune routes longer than this (keeps graph connected) |
| `pruneChance` | 0 | 0–1; chance to remove each eligible route (keeps graph connected) |
| `dangerChance` | 0.05 | 0–1; probability of dangerous island |
| `appealingChance` | 0.2 | 0–1; probability of appealing island |
| `seed` | null | Optional; omit for random |

## Node Custom Data (Pirate Adventure)

Each island has pirate-themed custom fields for map generation and gameplay:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Island name (e.g. "Dead Man's Cay", "Port Royal") |
| `description` | string | Flavor text |
| `treasureLevel` | 0–3 | None, Modest, Rich, Legendary |
| `portType` | string | none, outpost, harbor, port |
| `hazard` | string | none, reefs, storms, treacherous |
| `faction` | string | neutral, british, spanish, french, pirate |
| `rumors` | string | Quest hooks / rumors |

## Output Format

`MapGenerator.generate(config)` returns:

```js
{
  nodes: [{
    id, position: {x,y}, connections, dangerous, appealing, distanceFromHome,
    name, description, treasureLevel, portType, hazard, faction, rumors
  }],
  edges: [{ a: Node, b: Node }],
  homeNode: Node,
  seed: number
}
```

## Project Structure

```
map-generator-poc/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js           # UI, event handlers, render loop
│   ├── MapGenerator.js   # Delaunay-based planar graph + pirate enrichment
│   ├── MapVisualizer.js # Three.js renderer, gizmo, pan/zoom
│   ├── MapEditor.js     # addNode, removeNode, addEdge, removeEdge
│   ├── MapSerializer.js # serialize/deserialize for Save/Load
│   └── SeededRNG.js     # Reproducible pseudo-random
```

## Integration (Phase B)

`OverworldScene.js` will consume this output. Islands already have names, treasure levels, port types, hazards, and factions. Route modifiers (stormy, patrolled) can be derived from `distanceFromHome` and `hazard`.
