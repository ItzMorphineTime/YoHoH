/**
 * Island terrain mesh generator — tile-based
 * Produces configurable, seeded height maps where each tile is a flat unit
 * for building placement. Noise is sampled per-tile, not per-vertex.
 */

import { createNoise2D } from 'simplex-noise';
import { SeededRNG } from './SeededRNG.js';

/** Pirate-themed island name parts for procedural generation */
const ISLAND_NAME_PARTS = {
  prefix: ['Dead Man\'s', 'Skull', 'Devil\'s', 'Black', 'Blood', 'Rum', 'Treasure', 'Ghost', 'Cursed', 'Hidden'],
  body: ['Cay', 'Island', 'Key', 'Reef', 'Harbor', 'Cove', 'Port', 'Bay', 'Sands', 'Rock'],
  safe: ['Port', 'Safe', 'Calm', 'Golden', 'Merchant', 'Trading', 'Friendly', 'Paradise'],
};

/** Default elevation bands for color mapping (0–1 normalized) */
export const ELEVATION_BANDS = {
  water: 0,
  beach: 0.18,
  grass: 0.35,
  rock: 0.55,
  snow: 0.75,
};

/**
 * Generate island height map — tile-based (each tile is flat)
 * @param {Object} config
 * @param {number} config.gridSize - Resolution (vertices per side; must be divisible by tileSize)
 * @param {number} config.tileSize - Vertices per tile side (e.g. 8 → 8×8 vertex tiles)
 * @param {number} config.elevationScale - Max height multiplier
 * @param {number} config.islandRadius - 0–1, radius of island
 * @param {number} config.noiseOctaves - Number of noise layers
 * @param {number} config.frequency - Base noise frequency
 * @param {number} config.persistence - Octave amplitude falloff
 * @param {number} config.lacunarity - Octave frequency multiplier
 * @param {number|null} config.seed - Optional seed
 * @param {number} config.seaLevel - Water level
 * @param {number} config.coastFalloff - Coast steepness
 * @param {number} config.coastIrregularity - Coastline wobble
 * @param {number} config.elongation - 0.5=round, <0.5=wider, >0.5=taller
 * @param {number} config.terrainRoughness - Overall bumpiness
 * @param {number} config.tileVariation - 0–1, per-vertex noise within tile (0=perfectly flat)
 * @returns {{ heightMap: number[][], config: Object, seed: number }}
 */
export function generateIsland(config = {}) {
  const {
    gridSize = 128,
    tileSize = 8,
    elevationScale = 1.2,
    islandRadius = 0.42,
    noiseOctaves = 5,
    frequency = 2.2,
    persistence = 0.45,
    lacunarity = 2.1,
    seed = null,
    seaLevel = 0.12,
    coastFalloff = 2.2,
    coastIrregularity = 0.35,
    elongation = 0.5,
    terrainRoughness = 0.7,
    tileVariation = 0,
    chunkSize,
  } = config;

  const ts = Math.max(2, Math.min(Math.floor(gridSize / 2), tileSize ?? chunkSize ?? 8));
  const tilesX = Math.floor(gridSize / ts);
  const tilesY = Math.floor(gridSize / ts);
  const effectiveGridSize = tilesX * ts;

  const rng = new SeededRNG(seed);
  const actualSeed = rng.getSeed();
  const noise2D = createNoise2D(() => rng.next());

  const scaleX = elongation <= 0.5 ? 1 + (0.5 - elongation) * 1.5 : 1;
  const scaleY = elongation >= 0.5 ? 1 + (elongation - 0.5) * 1.5 : 1;

  // Per-tile heights (tile center noise)
  const tileHeights = [];
  for (let ty = 0; ty < tilesY; ty++) {
    const row = [];
    for (let tx = 0; tx < tilesX; tx++) {
      const cx = (tx + 0.5) / tilesX - 0.5;
      const cy = (ty + 0.5) / tilesY - 0.5;
      const ex = cx / scaleX;
      const ey = cy / scaleY;
      const baseDist = Math.sqrt(ex * ex + ey * ey);
      const coastNoise = coastIrregularity > 0
        ? noise2D(cx * 8 + actualSeed * 0.01, cy * 8 + actualSeed * 0.02) * coastIrregularity
        : 0;
      const effectiveRadius = (islandRadius * 0.5) * (1 + coastNoise);
      const normalizedDist = baseDist / effectiveRadius;
      const mask = Math.max(0, 1 - Math.pow(normalizedDist, coastFalloff));

      let noiseValue = 0;
      let amplitude = 1;
      let freq = frequency;
      let maxAmp = 0;
      for (let o = 0; o < noiseOctaves; o++) {
        const sx = cx * freq * tilesX * 0.02 + actualSeed * 0.001 + o * 50;
        const sy = cy * freq * tilesY * 0.02 + actualSeed * 0.002 + o * 70;
        noiseValue += noise2D(sx, sy) * amplitude;
        maxAmp += amplitude;
        amplitude *= persistence;
        freq *= lacunarity;
      }
      noiseValue = (noiseValue / maxAmp + 1) * 0.5;
      const h = Math.max(0, noiseValue * mask * elevationScale * terrainRoughness + seaLevel);
      row.push(h);
    }
    tileHeights.push(row);
  }

  // Build vertex height map from tile heights (flat per tile, optional micro-variation)
  const heightMap = [];
  for (let y = 0; y <= effectiveGridSize; y++) {
    const row = [];
    for (let x = 0; x <= effectiveGridSize; x++) {
      const tx = Math.min(tilesX - 1, Math.floor(x / ts));
      const ty = Math.min(tilesY - 1, Math.floor(y / ts));
      let h = tileHeights[ty][tx];

      if (tileVariation > 0) {
        const nx = (x / effectiveGridSize) - 0.5;
        const ny = (y / effectiveGridSize) - 0.5;
        const v = noise2D(nx * 20 + actualSeed * 0.01, ny * 20 + actualSeed * 0.02) * tileVariation;
        h = Math.max(0, h + v);
      }
      row.push(h);
    }
    heightMap.push(row);
  }

  const dangerous = rng.next() < 0.15;
  const appealing = !dangerous && rng.next() < 0.25;
  const name = `${ISLAND_NAME_PARTS.prefix[Math.floor(rng.next() * ISLAND_NAME_PARTS.prefix.length)]} ${ISLAND_NAME_PARTS.body[Math.floor(rng.next() * ISLAND_NAME_PARTS.body.length)]}`;
  const description = dangerous ? 'A treacherous place. Sailors speak of it in hushed tones.' : appealing ? 'A welcoming port with fair winds and friendly faces.' : 'An unremarkable stop along the trade routes.';
  const treasureLevel = dangerous ? Math.min(3, 1 + Math.floor(rng.next() * 2)) : appealing ? Math.floor(rng.next() * 2) : Math.floor(rng.next() * 2);
  const portRoll = rng.next();
  const portType = appealing && portRoll < 0.6 ? (portRoll < 0.3 ? 'harbor' : 'outpost') : portRoll < 0.2 ? 'outpost' : 'none';
  const hazards = ['none', 'reefs', 'storms', 'treacherous'];
  const hazard = dangerous && rng.next() < 0.6 ? hazards[1 + Math.floor(rng.next() * 3)] : 'none';
  const factions = ['neutral', 'british', 'spanish', 'french', 'pirate'];
  const faction = factions[Math.floor(rng.next() * factions.length)];

  return {
    heightMap,
    config: {
      gridSize: effectiveGridSize,
      tileSize: ts,
      tilesX,
      tilesY,
      elevationScale,
      islandRadius,
      noiseOctaves,
      frequency,
      persistence,
      lacunarity,
      seaLevel,
      coastFalloff,
      coastIrregularity,
      elongation,
      terrainRoughness,
      tileVariation,
      chunkSize: ts,
    },
    seed: actualSeed,
    name,
    description,
    dangerous,
    appealing,
    treasureLevel,
    portType,
    hazard,
    faction,
    rumors: '',
  };
}
