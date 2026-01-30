/**
 * Map serialization for Save/Load
 * Format: { version, seed, nodes: [{id,x,y,dangerous,appealing,custom...}], edges: [[a,b],...] }
 */

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
 * Serialize map to JSON (for save/download)
 * @param {Object} map - { nodes, edges, homeNode, seed }
 * @returns {string} JSON string
 */
export function serialize(map) {
  const { nodes, edges, homeNode, seed } = map;
  const data = {
    version: 1,
    seed: seed ?? null,
    homeNodeId: homeNode?.id ?? 0,
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
    })),
    edges: edges.map(({ a, b }) => [a.id, b.id]),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Deserialize JSON to map object
 * @param {string} json - JSON string from serialize()
 * @returns {Object} map - { nodes, edges, homeNode, seed }
 */
export function deserialize(json) {
  const data = JSON.parse(json);
  if (data.version !== 1) {
    throw new Error('Unsupported map format version');
  }

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
  }));

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const homeNodeId = data.homeNodeId ?? 0;

  for (const [aId, bId] of data.edges) {
    const a = nodeById.get(aId);
    const b = nodeById.get(bId);
    if (a && b && !a.connections.includes(b)) {
      a.connections.push(b);
      b.connections.push(a);
    }
  }

  const homeNode = nodeById.get(homeNodeId) ?? nodes[0];
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

  return {
    nodes,
    edges,
    homeNode,
    seed: data.seed,
  };
}
