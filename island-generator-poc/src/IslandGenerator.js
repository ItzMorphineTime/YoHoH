/**
 * Island terrain mesh generator using Simplex noise
 * Produces configurable, seeded height maps with island mask,
 * chunk-based flattening for building zones, and shape controls
 */

import { createNoise2D } from 'simplex-noise';
import { SeededRNG } from './SeededRNG.js';

/** Default elevation bands for color mapping (0–1 normalized) */
export const ELEVATION_BANDS = {
  water: 0,
  beach: 0.18,
  grass: 0.35,
  rock: 0.55,
  snow: 0.75,
};

/**
 * Generate island height map
 * @param {Object} config
 * @param {number} config.gridSize - Resolution (e.g. 64 → 64×64 vertices)
 * @param {number} config.elevationScale - Max height multiplier
 * @param {number} config.islandRadius - 0–1, radius of island (1 = full grid)
 * @param {number} config.noiseOctaves - Number of noise layers for detail
 * @param {number} config.frequency - Base noise frequency
 * @param {number} config.persistence - Octave amplitude falloff (0–1)
 * @param {number} config.lacunarity - Octave frequency multiplier
 * @param {number|null} config.seed - Optional seed for reproducibility
 * @param {number} config.seaLevel - Height below which is water (0–1)
 * @param {number} config.coastFalloff - How sharply island drops at coast (higher = steeper)
 * @param {number} config.coastIrregularity - 0–1, coastline wobble from noise
 * @param {number} config.elongation - 0–1, 0.5=round, &lt;0.5=wider, &gt;0.5=taller
 * @param {number} config.chunkSize - Grid cells per chunk (0=no flattening, 8=8×8 chunks)
 * @param {number} config.flatnessStrength - 0–1, how much to flatten chunks for building
 * @param {number} config.terrainRoughness - 0–1, overall terrain bumpiness
 * @returns {{ heightMap: number[][], config: Object, seed: number }}
 */
export function generateIsland(config = {}) {
  const {
    gridSize = 64,
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
    chunkSize = 8,
    flatnessStrength = 0.4,
    terrainRoughness = 0.7,
  } = config;

  const rng = new SeededRNG(seed);
  const actualSeed = rng.getSeed();

  const noise2D = createNoise2D(() => rng.next());

  const heightMap = [];

  // Elongation: scale coords for aspect ratio (0.5=round, <0.5=wider, >0.5=taller)
  const scaleX = elongation <= 0.5 ? 1 + (0.5 - elongation) * 1.5 : 1;
  const scaleY = elongation >= 0.5 ? 1 + (elongation - 0.5) * 1.5 : 1;

  for (let y = 0; y <= gridSize; y++) {
    const row = [];
    for (let x = 0; x <= gridSize; x++) {
      const nx = (x / gridSize) - 0.5;
      const ny = (y / gridSize) - 0.5;

      // Elongated coords for mask (divide = compress axis = island extends further)
      const ex = nx / scaleX;
      const ey = ny / scaleY;

      // Base radial distance
      const baseDist = Math.sqrt(ex * ex + ey * ey);

      // Coast irregularity: add noise-based wobble to radius
      const coastNoise = coastIrregularity > 0
        ? noise2D(nx * 8 + actualSeed * 0.01, ny * 8 + actualSeed * 0.02) * coastIrregularity
        : 0;
      const effectiveRadius = (islandRadius * 0.5) * (1 + coastNoise);

      const normalizedDist = baseDist / effectiveRadius;
      const mask = Math.max(0, 1 - Math.pow(normalizedDist, coastFalloff));

      // Multi-octave noise
      let noiseValue = 0;
      let amplitude = 1;
      let freq = frequency;
      let maxAmp = 0;

      for (let o = 0; o < noiseOctaves; o++) {
        const sx = nx * freq * gridSize * 0.012 + actualSeed * 0.001 + o * 50;
        const sy = ny * freq * gridSize * 0.012 + actualSeed * 0.002 + o * 70;
        noiseValue += noise2D(sx, sy) * amplitude;
        maxAmp += amplitude;
        amplitude *= persistence;
        freq *= lacunarity;
      }

      noiseValue = (noiseValue / maxAmp + 1) * 0.5;
      let height = Math.max(0, noiseValue * mask * elevationScale * terrainRoughness + seaLevel);
      row.push(height);
    }
    heightMap.push(row);
  }

  // Chunk-based flattening for building zones (creates flatter, navigable areas)
  if (chunkSize > 0 && flatnessStrength > 0) {
    const cs = Math.max(2, Math.min(Math.floor(gridSize / 2), chunkSize));
    const chunksX = Math.ceil(gridSize / cs);
    const chunksY = Math.ceil(gridSize / cs);

    for (let cy = 0; cy < chunksY; cy++) {
      for (let cx = 0; cx < chunksX; cx++) {
        let sum = 0;
        let count = 0;
        const x0 = cx * cs;
        const y0 = cy * cs;
        const x1 = Math.min(x0 + cs + 1, gridSize + 1);
        const y1 = Math.min(y0 + cs + 1, gridSize + 1);

        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            sum += heightMap[y][x];
            count++;
          }
        }
        const avg = count > 0 ? sum / count : 0;

        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const orig = heightMap[y][x];
            heightMap[y][x] = orig * (1 - flatnessStrength) + avg * flatnessStrength;
          }
        }
      }
    }
  }

  return {
    heightMap,
    config: {
      gridSize,
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
      chunkSize,
      flatnessStrength,
      terrainRoughness,
    },
    seed: actualSeed,
  };
}
