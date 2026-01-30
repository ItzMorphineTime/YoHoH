/**
 * Seeded pseudo-random number generator (Mulberry32)
 * Same seed → same sequence of numbers (reproducible maps)
 */
export class SeededRNG {
  constructor(seed = null) {
    this.seed = seed != null ? seed : Math.floor(Math.random() * 0xffffffff);
    this.state = this.seed;
  }

  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min, max) {
    return min + this.next() * (max - min);
  }

  reset() {
    this.state = this.seed;
  }

  getSeed() {
    return this.seed;
  }
}
