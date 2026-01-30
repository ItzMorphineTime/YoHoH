/**
 * YoHoH — Economy system: goods, prices, cargo
 * GDD §8.3: 6–8 goods, base + bias + variance per island
 * Loads goods.json; price model and market UI pending (B.6–B.8)
 */

let goodsCache = null;

/**
 * Load goods config from JSON. Returns cached result after first load.
 * @returns {Promise<Array>} Array of good definitions
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
 * Compute price for a good at an island (stub for B.6).
 * @param {string} goodId - Good id from goods.json
 * @param {object} island - Island node (has distanceFromHome, hazard, etc.)
 * @param {number} bias - Island bias for this good (-0.2 to 0.2)
 * @returns {number} Price
 */
export function getPrice(goodId, island, bias = 0) {
  const goods = getGoods();
  const good = goods.find(g => g.id === goodId);
  if (!good) return 0;
  const base = good.basePrice ?? 10;
  const mult = 1 + (bias ?? 0);
  return Math.round(base * mult);
}
