/**
 * Procedural archipelago map generator
 * Planar graph via Delaunay triangulation: nodes = islands, edges = charted routes
 * No edge crossings by construction.
 */

import { Delaunay } from 'd3-delaunay';
import { SeededRNG } from './SeededRNG.js';

/** Simple 2D vector */
class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distSq(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  static dist(a, b) {
    return Math.sqrt(Vector2.distSq(a, b));
  }

  add(other, scale = 1) {
    return new Vector2(this.x + other.x * scale, this.y + other.y * scale);
  }
}

/** Pirate-themed island name parts for procedural generation */
const ISLAND_NAME_PARTS = {
  prefix: ['Dead Man\'s', 'Skull', 'Devil\'s', 'Black', 'Blood', 'Rum', 'Treasure', 'Ghost', 'Cursed', 'Hidden'],
  body: ['Cay', 'Island', 'Key', 'Reef', 'Harbor', 'Cove', 'Port', 'Bay', 'Sands', 'Rock'],
  safe: ['Port', 'Safe', 'Calm', 'Golden', 'Merchant', 'Trading', 'Friendly', 'Paradise'],
};

/** Graph node = island */
class Node {
  constructor(id, position, rng, options = {}) {
    const { dangerChance = 0.05, appealingChance = 0.2 } = options;
    this.id = id;
    this.position = position;
    this.connections = [];
    this.distances = [];
    this.dangerous = rng.next() < dangerChance;
    this.appealing = !this.dangerous && rng.next() < appealingChance;
    this.distanceFromHome = 0;
    // Pirate-themed custom data (defaults; enriched after distances computed)
    this.name = '';
    this.description = '';
    this.treasureLevel = 0;
    this.portType = 'none';
    this.hazard = 'none';
    this.faction = 'neutral';
    this.rumors = '';
  }

  generateDistances() {
    this.distances = this.connections.map(c => Vector2.distSq(this.position, c.position));
  }
}

/** Enrich nodes with procedural pirate-themed custom data */
function enrichPirateData(nodes, rng) {
  const maxDist = Math.max(...nodes.map(n => n.distanceFromHome), 1);
  for (const node of nodes) {
    const t = node.distanceFromHome / maxDist;
    if (!node.name) {
      if (node.id === 0) {
        node.name = 'Home Port';
      } else if (node.dangerous) {
        node.name = `${ISLAND_NAME_PARTS.prefix[Math.floor(rng.next() * ISLAND_NAME_PARTS.prefix.length)]} ${ISLAND_NAME_PARTS.body[Math.floor(rng.next() * ISLAND_NAME_PARTS.body.length)]}`;
      } else if (node.appealing) {
        node.name = `${ISLAND_NAME_PARTS.safe[Math.floor(rng.next() * ISLAND_NAME_PARTS.safe.length)]} ${ISLAND_NAME_PARTS.body[Math.floor(rng.next() * ISLAND_NAME_PARTS.body.length)]}`;
      } else {
        node.name = `${ISLAND_NAME_PARTS.prefix[Math.floor(rng.next() * ISLAND_NAME_PARTS.prefix.length)]} ${ISLAND_NAME_PARTS.body[Math.floor(rng.next() * ISLAND_NAME_PARTS.body.length)]}`;
      }
    }
    if (!node.description) {
      if (node.dangerous) node.description = 'A treacherous place. Sailors speak of it in hushed tones.';
      else if (node.appealing) node.description = 'A welcoming port with fair winds and friendly faces.';
      else node.description = 'An unremarkable stop along the trade routes.';
    }
    if (node.treasureLevel === 0) {
      if (node.dangerous) node.treasureLevel = Math.min(3, 1 + Math.floor(rng.next() * 2));
      else if (node.appealing) node.treasureLevel = Math.floor(rng.next() * 2);
      else node.treasureLevel = Math.floor(rng.next() * 2);
    }
    if (node.portType === 'none') {
      const roll = rng.next();
      if (node.id === 0) node.portType = 'port';
      else if (node.appealing && roll < 0.6) node.portType = roll < 0.3 ? 'harbor' : 'outpost';
      else if (roll < 0.2) node.portType = 'outpost';
    }
    if (node.hazard === 'none') {
      if (node.dangerous && rng.next() < 0.6) {
        node.hazard = ['reefs', 'storms', 'treacherous'][Math.floor(rng.next() * 3)];
      }
    }
    if (node.faction === 'neutral') {
      const factions = ['neutral', 'british', 'spanish', 'french', 'pirate'];
      node.faction = factions[Math.floor(rng.next() * factions.length)];
    }
  }
}

/** BFS from start to compute graph distance (hops) from home */
function computeDistancesFromHome(homeNode) {
  const visited = new Set();
  const queue = [{ node: homeNode, dist: 0 }];
  visited.add(homeNode.id);

  while (queue.length > 0) {
    const { node, dist } = queue.shift();
    node.distanceFromHome = dist;

    for (const c of node.connections) {
      if (!visited.has(c.id)) {
        visited.add(c.id);
        queue.push({ node: c, dist: dist + 1 });
      }
    }
  }
}

/**
 * Place points with center-out growth and minimum distance constraint.
 * Ensures consistent spacing between islands.
 */
function placePoints(rng, numIslands, expansionDistance, minPointDistance) {
  const points = [new Vector2(0, 0)]; // Home at center
  const frontier = [0]; // Indices of points that can spawn

  const MAX_ATTEMPTS = 50;

  while (points.length < numIslands) {
    const parentIdx = frontier[Math.floor(rng.next() * frontier.length)];
    const parent = points[parentIdx];

    let placed = false;
    for (let attempt = 0; attempt < MAX_ATTEMPTS && !placed; attempt++) {
      const angle = rng.next() * Math.PI * 2;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const pos = parent.add(new Vector2(dx, dy), expansionDistance);

      // Check minimum distance from all existing points
      let tooClose = false;
      for (let i = 0; i < points.length; i++) {
        if (Vector2.dist(pos, points[i]) < minPointDistance) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;

      points.push(pos);
      frontier.push(points.length - 1);
      placed = true;
    }

    if (!placed) {
      // Remove parent from frontier if it can't spawn (avoid infinite loop)
      const idx = frontier.indexOf(parentIdx);
      if (idx >= 0) frontier.splice(idx, 1);
      if (frontier.length === 0) break;
    }
  }

  return points;
}

/**
 * Generate archipelago map using Delaunay triangulation (planar by construction)
 * @param {Object} config
 * @param {number} config.numIslands - Target number of islands
 * @param {number} config.initialBranches - Unused (kept for API compatibility)
 * @param {number} config.expansionDistance - Distance between connected islands
 * @param {number} config.expansionVariance - Unused (fixed spacing for planarity)
 * @param {number} config.minPointDistance - Minimum distance between any two points (default: 0.4 * expansionDistance)
 * @param {number} config.maxEdgeLength - Prune Delaunay edges longer than this (default: 1.5 * expansionDistance)
 * @param {number} config.pruneChance - 0-1; chance to remove each eligible edge (keeps graph connected)
 * @param {number} config.dangerChance - 0-1; probability of dangerous island
 * @param {number} config.appealingChance - 0-1; probability of appealing island
 * @param {number|null} config.seed - Optional seed for reproducibility
 */
export function generateMap(config) {
  const {
    numIslands = 20,
    expansionDistance = 30,
    expansionVariance = 0,
    minPointDistance = null,
    maxEdgeLength = null,
    pruneChance = 0,
    dangerChance = 0.05,
    appealingChance = 0.2,
    seed = null,
  } = config;

  const rng = new SeededRNG(seed);
  const nodeOptions = { dangerChance, appealingChance };

  const minDist = minPointDistance ?? expansionDistance * 0.4;
  const maxEdge = maxEdgeLength ?? expansionDistance * 1.5;

  // 1. Place points with consistent spacing (center-out)
  const points = placePoints(rng, numIslands, expansionDistance, minDist);

  // 2. Delaunay triangulation - planar by construction
  // Delaunay.from expects [[x,y], [x,y], ...] or flat array with fx/fy
  const pointCoords = points.map(p => [p.x, p.y]);
  const delaunay = Delaunay.from(pointCoords);

  // 3. Extract edges from Delaunay (each edge appears in 2 triangles, dedupe)
  const edgeSet = new Map(); // "id1-id2" -> { a, b, len }
  const allDelaunayEdges = [];
  const seenEdges = new Set();
  const triangles = delaunay.triangles;

  for (let t = 0; t < triangles.length; t += 3) {
    const [a, b, c] = [triangles[t], triangles[t + 1], triangles[t + 2]];
    const addEdge = (i, j) => {
      const key = [i, j].sort((x, y) => x - y).join('-');
      const len = Vector2.dist(points[i], points[j]);
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        allDelaunayEdges.push({ a: i, b: j, len });
      }
      if (len <= maxEdge) {
        edgeSet.set(key, { a: i, b: j, len });
      }
    };
    addEdge(a, b);
    addEdge(b, c);
    addEdge(c, a);
  }
  allDelaunayEdges.sort((x, y) => x.len - y.len);

  // 4. Ensure connectivity - if pruning by maxEdgeLength disconnected, add shortest bridge edges
  const adj = new Map();
  for (let i = 0; i < points.length; i++) adj.set(i, new Set());
  for (const { a, b } of edgeSet.values()) {
    adj.get(a).add(b);
    adj.get(b).add(a);
  }

  const visited = new Set();
  const getComponents = () => {
    visited.clear();
    const comps = [];
    for (let i = 0; i < points.length; i++) {
      if (visited.has(i)) continue;
      const comp = [];
      const q = [i];
      visited.add(i);
      while (q.length > 0) {
        const n = q.shift();
        comp.push(n);
        for (const nb of adj.get(n)) {
          if (!visited.has(nb)) {
            visited.add(nb);
            q.push(nb);
          }
        }
      }
      comps.push(comp);
    }
    return comps;
  };

  let components = getComponents();
  while (components.length > 1) {
    const compIds = components.map(c => new Set(c));
    let merged = false;
    for (const { a, b, len } of allDelaunayEdges) {
      const ca = compIds.findIndex(c => c.has(a));
      const cb = compIds.findIndex(c => c.has(b));
      if (ca >= 0 && cb >= 0 && ca !== cb) {
        const key = [a, b].sort((x, y) => x - y).join('-');
        edgeSet.set(key, { a, b, len });
        adj.get(a).add(b);
        adj.get(b).add(a);
        const mergedComp = [...components[ca], ...components[cb]];
        components = components.filter((_, i) => i !== ca && i !== cb);
        components.push(mergedComp);
        merged = true;
        break;
      }
    }
    if (!merged) break;
  }

  // 4b. Prune edges with pruneChance (keeps graph connected and planar)
  if (pruneChance > 0) {
    const edgeKeys = Array.from(edgeSet.keys());
    // Shuffle for random order (deterministic with seed)
    for (let i = edgeKeys.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [edgeKeys[i], edgeKeys[j]] = [edgeKeys[j], edgeKeys[i]];
    }
    for (const key of edgeKeys) {
      if (rng.next() >= pruneChance) continue;
      const { a, b } = edgeSet.get(key);
      adj.get(a).delete(b);
      adj.get(b).delete(a);
      const reachable = new Set();
      const q = [a];
      reachable.add(a);
      while (q.length > 0) {
        const n = q.shift();
        for (const nb of adj.get(n)) {
          if (!reachable.has(nb)) {
            reachable.add(nb);
            q.push(nb);
          }
        }
      }
      if (reachable.has(b)) {
        edgeSet.delete(key);
      } else {
        adj.get(a).add(b);
        adj.get(b).add(a);
      }
    }
  }

  // 5. Build Node objects
  const nodes = points.map((p, i) => new Node(i, p, rng, nodeOptions));

  for (const { a, b } of edgeSet.values()) {
    nodes[a].connections.push(nodes[b]);
    nodes[b].connections.push(nodes[a]);
  }

  const homeNode = nodes[0];
  computeDistancesFromHome(homeNode);
  nodes.forEach(n => n.generateDistances());
  enrichPirateData(nodes, rng);

  const edgeList = Array.from(edgeSet.values()).map(({ a, b }) => ({
    a: nodes[a],
    b: nodes[b],
  }));

  return {
    nodes,
    edges: edgeList,
    homeNode,
    seed: rng.getSeed(),
  };
}
