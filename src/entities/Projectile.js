/**
 * YoHoH — Projectile (cannonball)
 *
 * Supports an `init(opts)` reset so instances can be reused from a pool
 * (CombatSystem). (Improvements.md §6.1)
 */

import { COMBAT } from '../config.js';

export class Projectile {
  constructor(opts = {}) {
    this.init(opts);
  }

  /** Reset all state from opts; called by both the constructor and the pool acquire path. */
  init(opts = {}) {
    this.x = opts.x ?? 0;
    this.y = opts.y ?? 0;
    this.rotation = opts.rotation ?? 0;
    this.speed = opts.speed ?? COMBAT.projectileSpeed;
    this.damage = opts.damage ?? COMBAT.projectileDamage;
    this.ownerId = opts.ownerId;
    this.side = opts.side; // 'port' | 'starboard'
    this.lifetime = opts.lifetime ?? 2;
    this.dead = false;
    return this;
  }

  update(dt) {
    this.x += Math.sin(this.rotation) * this.speed * dt;
    this.y += Math.cos(this.rotation) * this.speed * dt;
    this.lifetime -= dt;
    if (this.lifetime <= 0) this.dead = true;
  }
}
