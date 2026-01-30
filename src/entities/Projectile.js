/**
 * YoHoH — Projectile (cannonball)
 */

import { COMBAT } from '../config.js';

export class Projectile {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.rotation = opts.rotation;
    this.speed = opts.speed ?? COMBAT.projectileSpeed;
    this.damage = opts.damage ?? COMBAT.projectileDamage;
    this.ownerId = opts.ownerId;
    this.side = opts.side; // 'port' | 'starboard'
    this.lifetime = opts.lifetime ?? 2;
    this.dead = false;
  }

  update(dt) {
    this.x += Math.sin(this.rotation) * this.speed * dt;
    this.y += Math.cos(this.rotation) * this.speed * dt;
    this.lifetime -= dt;
    if (this.lifetime <= 0) this.dead = true;
  }
}
