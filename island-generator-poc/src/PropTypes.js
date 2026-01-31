/**
 * Pirate game prop types — Shattered Seas
 * Defines props for island decoration from 3D_Models/Props (FBX)
 * Supports FBX mesh loading; fallback to placeholder geometry
 */

/** @typedef {{ id: string, name: string, color: number, fbxPath?: string, objPath?: string, placeholderShape?: 'sphere'|'cylinder'|'cone'|'box', defaultScale?: number }} PropType */

/** Prop definitions — all 1×1 tile; assets from 3D_Models/Props */
export const PROP_TYPES = {
  berry_bush_01: {
    id: 'berry_bush_01',
    name: 'Berry Bush',
    color: 0x22c55e,
    fbxPath: '/props/BerryBush_01/BerryBush_01.fbx',
    placeholderShape: 'sphere',
  },
  oak_tree_01: {
    id: 'oak_tree_01',
    name: 'Oak Tree',
    color: 0x15803d,
    fbxPath: '/props/OakTree_01/OakTree_01.fbx',
    placeholderShape: 'cone',
    defaultScale: 8,
  },
  palm_tree_01: {
    id: 'palm_tree_01',
    name: 'Palm Tree 1',
    color: 0x16a34a,
    fbxPath: '/props/PalmTree_01/PalmTree_01.fbx',
    placeholderShape: 'cylinder',
    defaultScale: 8,
  },
  palm_tree_02: {
    id: 'palm_tree_02',
    name: 'Palm Tree 2',
    color: 0x15803d,
    fbxPath: '/props/PalmTree_02/PalmTree_02.fbx',
    placeholderShape: 'cylinder',
    defaultScale: 8,
  },
  rock_01: {
    id: 'rock_01',
    name: 'Rock',
    color: 0x6b7280,
    fbxPath: '/props/Rock_01/Rock_01.fbx',
    placeholderShape: 'sphere',
  },
  rock_06: {
    id: 'rock_06',
    name: 'Brimstone Rock',
    color: 0x7f1d1d,
    fbxPath: '/props/Rock_06/Rock_06.fbx',
    placeholderShape: 'sphere',
  },
  sign: {
    id: 'sign',
    name: 'Sign',
    color: 0x78716c,
    placeholderShape: 'signpost',
  },
};

/** @param {string} type */
export function getPropType(type) {
  return PROP_TYPES[type] ?? null;
}
