/**
 * Pirate game building types — Shattered Seas
 * Defines size, name, and metadata for island buildings
 */

/** @typedef {{ id: string, width: number, height: number, name: string, color: number }} BuildingType */

/** Pirate building definitions — varied sizes per type */
export const BUILDING_TYPES = {
  tavern: { id: 'tavern', width: 2, height: 1, name: 'Tavern', color: 0xd97706 },
  shipwright: { id: 'shipwright', width: 2, height: 1, name: 'Shipwright', color: 0x64748b },
  market: { id: 'market', width: 2, height: 1, name: 'Market', color: 0x16a34a },
  lighthouse: { id: 'lighthouse', width: 1, height: 1, name: 'Lighthouse', color: 0xfbbf24 },
  warehouse: { id: 'warehouse', width: 2, height: 2, name: 'Warehouse', color: 0x78716c },
  fort: { id: 'fort', width: 3, height: 2, name: 'Fort', color: 0x6b7280 },
  docks: { id: 'docks', width: 3, height: 1, name: 'Docks', color: 0x0ea5e9, allowOverWater: true },
  dragon_sanctuary: { id: 'dragon_sanctuary', width: 3, height: 3, name: 'Dragon Sanctuary', color: 0x7c3aed },
  castle: { id: 'castle', width: 3, height: 3, name: 'Castle', color: 0x374151, description: 'Store cargo, gold/pieces-of-eight for crew wages, receive tax from buildings and player trading' },
  blacksmith: { id: 'blacksmith', width: 2, height: 1, name: 'Blacksmith', color: 0xb45309, description: 'Craft and sell cannons, cannonballs, and swords' },
};

/** @param {string} type */
export function getBuildingType(type) {
  return BUILDING_TYPES[type] ?? null;
}

/** @param {string} type */
export function getBuildingSize(type) {
  const def = getBuildingType(type);
  return def ? { width: def.width, height: def.height } : { width: 1, height: 1 };
}

/** @param {string} type @returns {boolean} */
export function canPlaceOverWater(type) {
  const def = getBuildingType(type);
  return !!(def && def.allowOverWater);
}

/** Runtime dimension overrides: { [typeId]: { width, height } } */
let dimensionOverrides = {};

/** @param {string} type @param {number} [width] @param {number} [height] */
export function setBuildingDimensionOverride(type, width, height) {
  if (width != null || height != null) {
    dimensionOverrides[type] = dimensionOverrides[type] || {};
    if (width != null) dimensionOverrides[type].width = Math.max(1, Math.min(5, width));
    if (height != null) dimensionOverrides[type].height = Math.max(1, Math.min(5, height));
  } else {
    delete dimensionOverrides[type];
  }
}

/** @param {string} type @returns {{ width: number, height: number }} */
export function getEffectiveBuildingSize(type) {
  const def = getBuildingType(type);
  const base = def ? { width: def.width, height: def.height } : { width: 1, height: 1 };
  const over = dimensionOverrides[type];
  return over
    ? { width: over.width ?? base.width, height: over.height ?? base.height }
    : base;
}

/**
 * Get size for a building object — uses saved width/height if present, else type default.
 * Use when rendering/loading; ensures loaded buildings render at correct sizes.
 * @param {{ type: string, width?: number, height?: number }} building
 * @returns {{ width: number, height: number }}
 */
export function getBuildingSizeFromObject(building) {
  if (building && building.width != null && building.height != null) {
    return { width: building.width, height: building.height };
  }
  return getEffectiveBuildingSize(building?.type ?? '');
}
