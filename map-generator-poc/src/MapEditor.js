/**
 * Map editing operations - remove/add edges, toggle node traits
 * Keeps graph planar and connected
 */

/** Check if removing edge (a,b) disconnects the graph */
function wouldDisconnect(nodes, edges, a, b) {
  const adj = new Map();
  nodes.forEach(n => adj.set(n.id, new Set()));
  for (const { a: ea, b: eb } of edges) {
    if ((ea.id === a.id && eb.id === b.id) || (ea.id === b.id && eb.id === a.id)) continue;
    adj.get(ea.id).add(eb.id);
    adj.get(eb.id).add(ea.id);
  }
  adj.get(a.id).delete(b.id);
  adj.get(b.id).delete(a.id);

  const visited = new Set();
  const q = [a.id];
  visited.add(a.id);
  while (q.length > 0) {
    const n = q.shift();
    for (const nb of adj.get(n)) {
      if (!visited.has(nb)) {
        visited.add(nb);
        q.push(nb);
      }
    }
  }
  return !visited.has(b.id);
}

/** Orientation: 0=collinear, 1=cw, 2=ccw */
function orientation(px, py, qx, qy, rx, ry) {
  const val = (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
  if (val > 0) return 1;
  if (val < 0) return 2;
  return 0;
}

function onSegment(px, py, qx, qy, rx, ry) {
  return qx <= Math.max(px, rx) && qx >= Math.min(px, rx) &&
         qy <= Math.max(py, ry) && qy >= Math.min(py, ry);
}

/** Check if segment (p1,q1) intersects (p2,q2) - proper intersection, not at endpoints */
function segmentsIntersect(p1, q1, p2, q2) {
  const o1 = orientation(p1.x, p1.y, q1.x, q1.y, p2.x, p2.y);
  const o2 = orientation(p1.x, p1.y, q1.x, q1.y, q2.x, q2.y);
  const o3 = orientation(p2.x, p2.y, q2.x, q2.y, p1.x, p1.y);
  const o4 = orientation(p2.x, p2.y, q2.x, q2.y, q1.x, q1.y);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p1.x, p1.y, p2.x, p2.y, q1.x, q1.y)) return true;
  if (o2 === 0 && onSegment(p1.x, p1.y, q2.x, q2.y, q1.x, q1.y)) return true;
  if (o3 === 0 && onSegment(p2.x, p2.y, p1.x, p1.y, q2.x, q2.y)) return true;
  if (o4 === 0 && onSegment(p2.x, p2.y, q1.x, q1.y, q2.x, q2.y)) return true;
  return false;
}

/** Check if adding edge (a,b) would create a crossing */
function wouldCross(nodes, edges, a, b) {
  const aPos = a.position;
  const bPos = b.position;
  if (a.connections.some(c => c.id === b.id)) return true; // already connected

  for (const { a: ea, b: eb } of edges) {
    if (ea.id === a.id && eb.id === b.id) continue;
    if (ea.id === b.id && eb.id === a.id) continue;
    if (ea.id === a.id || ea.id === b.id || eb.id === a.id || eb.id === b.id) continue; // share endpoint
    const eaPos = ea.position;
    const ebPos = eb.position;
    if (segmentsIntersect(aPos, bPos, eaPos, ebPos)) return true;
  }
  return false;
}

function recomputeDistances(homeNode) {
  const visited = new Set();
  const queue = [{ node: homeNode, dist: 0 }];
  visited.add(homeNode.id);
  homeNode.distanceFromHome = 0;
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

/** Recompute distanceFromHome and distances arrays after node move */
export function recomputeAll(map) {
  const { homeNode, nodes } = map;
  recomputeDistances(homeNode);
  nodes.forEach(n => {
    n.distances = n.connections.map(c => {
      const dx = n.position.x - c.position.x;
      const dy = n.position.y - c.position.y;
      return dx * dx + dy * dy;
    });
  });
}

/**
 * Remove edge between nodes a and b. Returns true if removed.
 */
export function removeEdge(map, a, b) {
  const { nodes, edges, homeNode } = map;
  if (wouldDisconnect(nodes, edges, a, b)) return false;

  const idx = edges.findIndex(e =>
    (e.a.id === a.id && e.b.id === b.id) || (e.a.id === b.id && e.b.id === a.id)
  );
  if (idx < 0) return false;

  edges.splice(idx, 1);
  const ai = a.connections.findIndex(c => c.id === b.id);
  const bi = b.connections.findIndex(c => c.id === a.id);
  if (ai >= 0) a.connections.splice(ai, 1);
  if (bi >= 0) b.connections.splice(bi, 1);

  a.distances = a.connections.map(c => {
    const dx = a.position.x - c.position.x;
    const dy = a.position.y - c.position.y;
    return dx * dx + dy * dy;
  });
  b.distances = b.connections.map(c => {
    const dx = b.position.x - c.position.x;
    const dy = b.position.y - c.position.y;
    return dx * dx + dy * dy;
  });
  return true;
}

/**
 * Add edge between nodes a and b. Returns true if added (no crossing).
 */
export function addEdge(map, a, b) {
  const { nodes, edges, homeNode } = map;
  if (wouldCross(nodes, edges, a, b)) return false;

  edges.push({ a, b });
  a.connections.push(b);
  b.connections.push(a);
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  a.distances.push(dx * dx + dy * dy);
  b.distances.push(dx * dx + dy * dy);
  recomputeDistances(homeNode);
  return true;
}

/**
 * Toggle dangerous on node
 */
export function toggleDangerous(node) {
  node.dangerous = !node.dangerous;
  if (node.dangerous) node.appealing = false;
}

/**
 * Toggle appealing on node
 */
export function toggleAppealing(node) {
  node.appealing = !node.appealing;
  if (node.appealing) node.dangerous = false;
}

/**
 * Add a new node at position. Connects to nearest node if possible (keeps planar).
 * Returns the new node or null.
 */
export function addNode(map, position) {
  const { nodes, edges, homeNode } = map;
  const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
  const newNode = {
    id: newId,
    position: { x: position.x, y: position.y },
    connections: [],
    distances: [],
    dangerous: false,
    appealing: false,
    distanceFromHome: 0,
    name: `Island ${newId}`,
    description: '',
    treasureLevel: 0,
    portType: 'none',
    hazard: 'none',
    faction: 'neutral',
    rumors: '',
  };
  nodes.push(newNode);

  let nearest = null;
  let nearestDist = Infinity;
  for (const n of nodes) {
    if (n.id === newNode.id) continue;
    const dx = n.position.x - newNode.position.x;
    const dy = n.position.y - newNode.position.y;
    const d = dx * dx + dy * dy;
    if (d < nearestDist) {
      nearestDist = d;
      nearest = n;
    }
  }
  if (nearest && !wouldCross(nodes, edges, newNode, nearest)) {
    addEdge(map, newNode, nearest);
  } else {
    recomputeDistances(homeNode);
  }
  return newNode;
}

/**
 * Remove a node and all its edges. Returns true if removed.
 * If node was home, assigns home to first remaining node.
 */
export function removeNode(map, node) {
  const { nodes, edges, homeNode } = map;
  const idx = nodes.indexOf(node);
  if (idx < 0) return false;

  const toRemove = edges.filter(e => e.a.id === node.id || e.b.id === node.id);
  for (const { a, b } of toRemove) {
    const ai = a.connections.findIndex(c => c.id === b.id);
    const bi = b.connections.findIndex(c => c.id === a.id);
    if (ai >= 0) {
      a.connections.splice(ai, 1);
      a.distances.splice(ai, 1);
    }
    if (bi >= 0) {
      b.connections.splice(bi, 1);
      b.distances.splice(bi, 1);
    }
  }
  for (let i = edges.length - 1; i >= 0; i--) {
    const e = edges[i];
    if (e.a.id === node.id || e.b.id === node.id) edges.splice(i, 1);
  }
  nodes.splice(idx, 1);

  if (map.homeNode?.id === node.id) {
    map.homeNode = nodes[0] ?? null;
    if (map.homeNode) recomputeDistances(map.homeNode);
  }
  return true;
}
