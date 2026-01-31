/**
 * Island height map serializer — Save/Load JSON
 */

/**
 * Serialize island data to JSON string
 * @param {{ heightMap: number[][], config: Object, display?: Object, buildings?: Array, seed: number|null }} island
 */
export function serialize(island) {
  const out = {
    version: 1,
    config: island.config,
    display: island.display ?? {},
    buildings: island.buildings ?? [],
    seed: island.seed,
    name: island.name ?? '',
    description: island.description ?? '',
    dangerous: island.dangerous ?? false,
    appealing: island.appealing ?? false,
    treasureLevel: island.treasureLevel ?? 0,
    portType: island.portType ?? 'none',
    hazard: island.hazard ?? 'none',
    faction: island.faction ?? 'neutral',
    rumors: island.rumors ?? '',
  };
  if (island.heightMap != null) out.heightMap = island.heightMap;
  return JSON.stringify(out);
}

/**
 * Deserialize island from JSON string
 * Supports full (heightMap + config) or config-only (regenerate from config)
 * @param {string} json
 * @returns {{ heightMap?: number[][], config: Object, display?: Object, buildings?: Array, seed: number|null }}
 */
export function deserialize(json) {
  const data = JSON.parse(json);
  if (!data.config || typeof data.config !== 'object') {
    throw new Error('Invalid island file: missing config');
  }
  return {
    heightMap: Array.isArray(data.heightMap) ? data.heightMap : null,
    config: data.config,
    display: data.display ?? {},
    buildings: Array.isArray(data.buildings) ? data.buildings : [],
    seed: data.seed ?? null,
    name: data.name ?? '',
    description: data.description ?? '',
    dangerous: data.dangerous ?? false,
    appealing: data.appealing ?? false,
    treasureLevel: data.treasureLevel ?? 0,
    portType: data.portType ?? 'none',
    hazard: data.hazard ?? 'none',
    faction: data.faction ?? 'neutral',
    rumors: data.rumors ?? '',
  };
}
