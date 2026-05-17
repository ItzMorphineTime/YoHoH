/**
 * Charting_Improvements.md §5.4: fog of war — shared visibility rules.
 *
 * Visibility model:
 *   - A node is VISIBLE if it is discovered OR adjacent (via an edge) to a
 *     discovered node. This lets the player see "where they could sail next"
 *     without revealing the rest of the archipelago.
 *   - An edge is VISIBLE if at least one of its endpoints is discovered.
 *   - Undiscovered-but-visible nodes render with a fog tint and the
 *     `FOG_UNKNOWN_LABEL` placeholder instead of their real name.
 *
 * `node.discovered` is the source of truth. Home port is discovered at gen
 * time (MapGenerator) and persisted across saves (MapSerializer). First arrival
 * at an island flips its `discovered` flag (OverworldScene.update + earlyDock).
 */

export const FOG_UNKNOWN_LABEL = '???';
export const FOG_UNKNOWN_DESC = 'Unknown waters — sail here to reveal.';

/** True when this node should appear on the map (visible to the player). */
export function isNodeVisible(node) {
  if (!node) return false;
  if (node.discovered) return true;
  for (const c of node.connections ?? []) {
    if (c?.discovered) return true;
  }
  return false;
}

/** True when this edge should be drawn (at least one endpoint discovered). */
export function isEdgeVisible(edge) {
  if (!edge) return false;
  return !!(edge.a?.discovered || edge.b?.discovered);
}

/** Helper: visible nodes only (filter for renderer bbox / loops). */
export function filterVisibleNodes(nodes) {
  return (nodes ?? []).filter(isNodeVisible);
}

/** Helper: visible edges only. */
export function filterVisibleEdges(edges) {
  return (edges ?? []).filter(isEdgeVisible);
}
