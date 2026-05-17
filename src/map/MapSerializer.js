/**
 * Map serialization for Save/Load
 * Format: { version, seed, nodes, edges }
 */

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

export function serialize(map) {
  const { nodes, edges, homeNode, seed, wind } = map;
  return JSON.stringify({
    version: 1,
    seed: seed ?? null,
    homeNodeId: homeNode?.id ?? 0,
    wind: wind ?? null, // Sailing_Improvements.md §4.1
    nodes: nodes.map(n => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
      dangerous: n.dangerous,
      appealing: n.appealing,
      name: n.name ?? '',
      description: n.description ?? '',
      treasureLevel: n.treasureLevel ?? 0,
      portType: n.portType ?? 'none',
      hazard: n.hazard ?? 'none',
      faction: n.faction ?? 'neutral',
      rumors: n.rumors ?? '',
      // Charting_Improvements.md §5.4: persist fog-of-war state per island
      discovered: !!n.discovered,
    })),
    edges: edges.map(({ a, b }) => [a.id, b.id]),
  }, null, 2);
}

export function deserialize(json) {
  const data = JSON.parse(json);
  if (data.version !== 1) throw new Error('Unsupported map format version');

  const nodes = data.nodes.map(n => ({
    id: n.id,
    position: { x: n.x, y: n.y },
    connections: [],
    distances: [],
    dangerous: n.dangerous ?? false,
    appealing: n.appealing ?? false,
    distanceFromHome: 0,
    name: n.name ?? '',
    description: n.description ?? '',
    treasureLevel: n.treasureLevel ?? 0,
    portType: n.portType ?? 'none',
    hazard: n.hazard ?? 'none',
    faction: n.faction ?? 'neutral',
    rumors: n.rumors ?? '',
    // Charting_Improvements.md §5.4: restore fog-of-war state.
    // Older saves (pre-fog) default to true so existing games are not erased.
    discovered: n.discovered ?? true,
  }));

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const homeNode = nodeById.get(data.homeNodeId ?? 0) ?? nodes[0];
  // Charting_Improvements.md §5.4: home is always discovered (safety net for legacy saves)
  if (homeNode) homeNode.discovered = true;

  for (const [aId, bId] of data.edges) {
    const a = nodeById.get(aId);
    const b = nodeById.get(bId);
    if (a && b && !a.connections.includes(b)) {
      a.connections.push(b);
      b.connections.push(a);
    }
  }

  computeDistancesFromHome(homeNode);
  nodes.forEach(n => {
    n.distances = n.connections.map(c => {
      const dx = n.position.x - c.position.x;
      const dy = n.position.y - c.position.y;
      return dx * dx + dy * dy;
    });
  });

  const edges = data.edges
    .map(([aId, bId]) => {
      const a = nodeById.get(aId);
      const b = nodeById.get(bId);
      return a && b ? { a, b } : null;
    })
    .filter(Boolean);

  // Sailing_Improvements.md §4.1: wind direction. Fallback for older saves: random.
  const wind = (data.wind && typeof data.wind.angleRad === 'number')
    ? { angleRad: data.wind.angleRad }
    : { angleRad: Math.random() * Math.PI * 2 };

  return { nodes, edges, homeNode, seed: data.seed, wind };
}
