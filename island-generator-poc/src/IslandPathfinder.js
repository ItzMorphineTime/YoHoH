/**
 * Island pathfinder — A* pathfinding between buildings
 * Computes path tiles between placed buildings, smooths terrain along paths,
 * and returns path tiles for vertex coloring.
 */

import { getEffectiveBuildingSize } from './BuildingTypes.js';

/** Default path color (dirt brown) */
export const PATH_COLOR = 0x8b7355;

/**
 * Get tile center for a building (for pathfinding endpoints)
 * @param {{ chunkX: number, chunkY: number, type: string }} building
 * @returns {{ tx: number, ty: number }}
 */
function getBuildingCenter(building) {
  const size = getEffectiveBuildingSize(building.type);
  const w = size.width;
  const h = size.height;
  return {
    tx: Math.floor(building.chunkX + w / 2),
    ty: Math.floor(building.chunkY + h / 2),
  };
}

/**
 * A* pathfinding on tile grid
 * @param {number} startTx
 * @param {number} startTy
 * @param {number} endTx
 * @param {number} endTy
 * @param {number[][]} heightMap
 * @param {number} seaLevel
 * @param {number} tilesX
 * @param {number} tilesY
 * @returns {{ tx: number, ty: number }[]|null}
 */
function findPath(startTx, startTy, endTx, endTy, heightMap, seaLevel, tilesX, tilesY) {
  const gridSize = heightMap.length - 1;

  function isWalkable(tx, ty) {
    if (tx < 0 || tx >= tilesX || ty < 0 || ty >= tilesY) return false;
    const ts = Math.floor(gridSize / tilesX);
    const gx = Math.min(gridSize, Math.floor((tx + 0.5) * ts));
    const gy = Math.min(gridSize, Math.floor((ty + 0.5) * ts));
    const h = heightMap[gy]?.[gx] ?? 0;
    return h > seaLevel;
  }

  const key = (tx, ty) => `${tx},${ty}`;
  const open = new Map();
  const closed = new Set();
  const gScore = new Map();
  const fScore = new Map();
  const cameFrom = new Map();

  const startKey = key(startTx, startTy);
  gScore.set(startKey, 0);
  fScore.set(startKey, Math.abs(endTx - startTx) + Math.abs(endTy - startTy));
  open.set(startKey, { tx: startTx, ty: startTy, f: fScore.get(startKey) });

  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];

  while (open.size > 0) {
    let bestKey = null;
    let bestF = Infinity;
    for (const [k, v] of open) {
      if (v.f < bestF) {
        bestF = v.f;
        bestKey = k;
      }
    }
    if (bestKey === null) break;

    const current = open.get(bestKey);
    open.delete(bestKey);
    closed.add(bestKey);

    if (current.tx === endTx && current.ty === endTy) {
      const path = [];
      let cur = bestKey;
      while (cur) {
        const [tx, ty] = cur.split(',').map(Number);
        path.unshift({ tx, ty });
        cur = cameFrom.get(cur);
      }
      return path;
    }

    for (const [dx, dy] of dirs) {
      const ntx = current.tx + dx;
      const nty = current.ty + dy;
      const nkey = key(ntx, nty);
      if (closed.has(nkey) || !isWalkable(ntx, nty)) continue;

      const dist = dx !== 0 && dy !== 0 ? 1.414 : 1;
      const tentativeG = (gScore.get(bestKey) ?? Infinity) + dist;
      if (tentativeG >= (gScore.get(nkey) ?? Infinity)) continue;

      cameFrom.set(nkey, bestKey);
      gScore.set(nkey, tentativeG);
      const h = Math.abs(endTx - ntx) + Math.abs(endTy - nty);
      fScore.set(nkey, tentativeG + h);
      open.set(nkey, { tx: ntx, ty: nty, f: tentativeG + h });
    }
  }
  return null;
}

/**
 * Compute path tiles between all buildings (minimum spanning tree style)
 * @param {Array} buildings
 * @param {number[][]} heightMap
 * @param {Object} config
 * @returns {Set<string>} Set of "tx,ty" keys
 */
export function computePathTiles(buildings, heightMap, config) {
  const pathTiles = new Set();
  if (!heightMap || !buildings || buildings.length < 2) return pathTiles;

  const gridSize = heightMap.length - 1;
  const ts = config?.tileSize ?? config?.chunkSize ?? 8;
  const tilesX = config?.tilesX ?? Math.floor(gridSize / ts);
  const tilesY = config?.tilesY ?? Math.floor(gridSize / ts);
  const seaLevel = config?.seaLevel ?? 0.12;

  const centers = buildings.map((b) => getBuildingCenter(b));

  for (const c of centers) {
    pathTiles.add(`${c.tx},${c.ty}`);
  }

  if (centers.length < 2) return pathTiles;

  for (let i = 1; i < centers.length; i++) {
    const path = findPath(
      centers[0].tx, centers[0].ty,
      centers[i].tx, centers[i].ty,
      heightMap, seaLevel, tilesX, tilesY
    );
    if (path) {
      for (const { tx, ty } of path) {
        pathTiles.add(`${tx},${ty}`);
      }
    }
  }

  return pathTiles;
}

/**
 * Smooth terrain along path tiles (flatten to average height)
 * Modifies heightMap in place.
 * @param {number[][]} heightMap
 * @param {Set<string>} pathTiles
 * @param {Object} config
 */
export function smoothPathTerrain(heightMap, pathTiles, config) {
  if (!heightMap || !pathTiles || pathTiles.size === 0) return;

  const gridSize = heightMap.length - 1;
  const ts = config?.tileSize ?? config?.chunkSize ?? 8;
  const tilesX = config?.tilesX ?? Math.floor(gridSize / ts);
  const tilesY = config?.tilesY ?? Math.floor(gridSize / ts);

  const toSmooth = [];
  for (const key of pathTiles) {
    const [tx, ty] = key.split(',').map(Number);
    const x0 = Math.max(0, tx * ts);
    const y0 = Math.max(0, ty * ts);
    const x1 = Math.min(gridSize, (tx + 1) * ts);
    const y1 = Math.min(gridSize, (ty + 1) * ts);
    let sum = 0;
    let count = 0;
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        sum += heightMap[gy]?.[gx] ?? 0;
        count++;
      }
    }
    if (count > 0) {
      const avg = sum / count;
      toSmooth.push({ x0, y0, x1, y1, avg });
    }
  }

  for (const { x0, y0, x1, y1, avg } of toSmooth) {
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        if (heightMap[gy]) heightMap[gy][gx] = avg;
      }
    }
  }
}

/**
 * Compute paths, smooth terrain, and return path tiles
 * @param {Array} buildings
 * @param {number[][]} heightMap
 * @param {Object} config
 * @returns {{ pathTiles: Set<string>, heightMap: number[][] }}
 */
export function computePathsBetweenBuildings(buildings, heightMap, config) {
  const hm = heightMap ? heightMap.map((row) => [...row]) : null;
  if (!hm) return { pathTiles: new Set(), heightMap: hm };

  const pathTiles = computePathTiles(buildings, hm, config);
  smoothPathTerrain(hm, pathTiles, config);

  return { pathTiles, heightMap: hm };
}
