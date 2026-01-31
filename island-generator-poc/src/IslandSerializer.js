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
  };
}
