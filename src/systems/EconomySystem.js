/**
 * YoHoH — Economy system: goods, prices, cargo
 * GDD §8.3: 6–8 goods, base + bias + variance per island
 */

import { ECONOMY } from '../config.js';

let goodsCache = null;

/**
 * Load goods config from JSON. Returns cached result after first load.
 */
export async function loadGoods() {
  if (goodsCache) return goodsCache;
  try {
    const res = await fetch('/data/goods.json');
    const data = await res.json();
    goodsCache = data.goods ?? [];
    return goodsCache;
  } catch (e) {
    console.warn('EconomySystem: could not load goods.json', e);
    goodsCache = [];
    return goodsCache;
  }
}

/**
 * Get goods (sync). Returns empty array if not yet loaded.
 */
export function getGoods() {
  return goodsCache ?? [];
}

/**
 * Deterministic bias for good at island (from island id + good id).
 */
function _islandGoodBias(goodId, island) {
  if (!island) return 0;
  const variance = ECONOMY?.priceVariance ?? 0.15;
  const seed = ((island.id ?? 0) * 31 + (goodId?.length ?? 0) * 7) % 1000;
  const hash = (seed * 9301 + 49297) % 233280;
  const t = hash / 233280;
  return (t - 0.5) * 2 * variance;
}

/**
 * Compute buy price for a good at an island (B.6).
 * Base + variance from distanceFromHome, portType, hazard.
 */
export function getBuyPrice(goodId, island) {
  const goods = getGoods();
  const good = goods.find(g => g.id === goodId);
  if (!good) return 0;
  const base = good.basePrice ?? 10;
  const bias = _islandGoodBias(goodId, island);
  const distMult = 1 + ((island?.distanceFromHome ?? 0) / 10) * 0.02;
  const mult = (1 + bias) * distMult;
  return Math.max(1, Math.round(base * mult));
}

/**
 * Compute sell price (buy price * sellSpread).
 */
export function getSellPrice(goodId, island) {
  const buy = getBuyPrice(goodId, island);
  const spread = ECONOMY?.sellSpread ?? 0.9;
  return Math.max(1, Math.round(buy * spread));
}

/** @deprecated Use getBuyPrice */
export function getPrice(goodId, island, bias = 0) {
  return getBuyPrice(goodId, island);
}
