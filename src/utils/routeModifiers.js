/**
 * B.4 Route modifiers: stormy, patrolled, shoals
 * Derived from distanceFromHome and hazard on connected nodes
 */

/**
 * Get route modifiers for an edge (route between two islands).
 * @param {{ a: { hazard?: string, distanceFromHome?: number }, b: { hazard?: string, distanceFromHome?: number } }} edge
 * @returns {string[]} Modifiers in priority order: stormy, patrolled, shoals
 */
export function getRouteModifiers(edge) {
  if (!edge || !edge.a || !edge.b) return [];
  const mods = [];
  const a = edge.a;
  const b = edge.b;
  const maxDist = Math.max(a.distanceFromHome ?? 0, b.distanceFromHome ?? 0);
  const hasHazard = (n, h) => (n.hazard === h);
  const hasAnyHazard = (n, arr) => arr.some(h => n.hazard === h);

  if (hasHazard(a, 'storms') || hasHazard(b, 'storms')) mods.push('stormy');
  if (maxDist >= 2) mods.push('patrolled');
  if (hasAnyHazard(a, ['reefs', 'treacherous']) || hasAnyHazard(b, ['reefs', 'treacherous'])) mods.push('shoals');
  return mods;
}

/**
 * Get primary modifier for color/styling (first/most severe).
 * @param {string[]} mods
 * @returns {string|null}
 */
export function getPrimaryModifier(mods) {
  return mods && mods.length > 0 ? mods[0] : null;
}
