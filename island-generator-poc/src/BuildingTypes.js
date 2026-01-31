/**
 * Pirate game building types — Shattered Seas
 * Defines size, name, and metadata for island buildings
 */

/** @typedef {{ id: string, width: number, height: number, name: string, color: number }} BuildingType */

/** Pirate building definitions */
export const BUILDING_TYPES = {
  tavern: { id: 'tavern', width: 1, height: 1, name: 'Tavern', color: 0xd97706 },
  shipwright: { id: 'shipwright', width: 1, height: 1, name: 'Shipwright', color: 0x64748b },
  market: { id: 'market', width: 1, height: 1, name: 'Market', color: 0x16a34a },
  lighthouse: { id: 'lighthouse', width: 1, height: 1, name: 'Lighthouse', color: 0xfbbf24 },
  warehouse: { id: 'warehouse', width: 2, height: 1, name: 'Warehouse', color: 0x78716c },
  fort: { id: 'fort', width: 2, height: 2, name: 'Fort', color: 0x6b7280 },
  docks: { id: 'docks', width: 2, height: 1, name: 'Docks', color: 0x0ea5e9 },
  dragon_sanctuary: { id: 'dragon_sanctuary', width: 2, height: 2, name: 'Dragon Sanctuary', color: 0x7c3aed },
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
