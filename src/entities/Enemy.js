/**
 * YoHoH — Enemy ship (Trader, Raider)
 * GDD §10.1: Trader flees/light defenses; Raider rush grapple/aggressive
 */

import { Ship } from './Ship.js';
import { SailingSystem } from '../systems/SailingSystem.js';
import { COMBAT } from '../config.js';

const ENEMY_TYPES = {
  TRADER: 'trader',
  RAIDER: 'raider',
};

export class Enemy extends Ship {
  constructor(opts = {}) {
    super({
      ...opts,
      isPlayer: false,
      hull: opts.hull ?? COMBAT.hullMax * 0.8,
      hullMax: opts.hullMax ?? COMBAT.hullMax * 0.8,
      sails: opts.sails ?? COMBAT.sailMax * 0.8,
      sailMax: opts.sailMax ?? COMBAT.sailMax * 0.8,
      maxSpeed: opts.maxSpeed ?? 3,
      thrust: opts.thrust ?? 0.15,
    });
    this.id = opts.id ?? `enemy-${Math.random().toString(36).slice(2, 9)}`;
    this.type = opts.type ?? ENEMY_TYPES.RAIDER;
    this.aiTimer = 0;
    this.aiInterval = 0.5;
    this.lootGold = opts.lootGold ?? 50;
    this.lootSalvage = opts.lootSalvage ?? 25;
  }

  /** Dummy input for AI - SailingSystem expects input object */
  getAiInput() {
    return {
      isKeyDown: () => false,
    };
  }

  update(dt, player, combatSystem, bounds) {
    if (this.dead) return;
    this.aiTimer += dt;
    if (this.aiTimer < this.aiInterval) return;
    this.aiTimer = 0;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angleToPlayer = Math.atan2(dy, dx);

    if (this.type === ENEMY_TYPES.TRADER) {
      this._aiTrader(dt, player, dist, angleToPlayer, combatSystem);
    } else {
      this._aiRaider(dt, player, dist, angleToPlayer, combatSystem);
    }

    // Apply movement (no input - AI sets speed/rotation directly)
    this.speed *= this.friction;
    if (Math.abs(this.speed) < 0.02) this.speed = 0;
    this.x += Math.sin(this.rotation) * this.speed;
    this.y += Math.cos(this.rotation) * this.speed;

    if (bounds) {
      const hw = bounds.width / 2;
      const hh = bounds.height / 2;
      this.x = Math.max(-hw, Math.min(hw, this.x));
      this.y = Math.max(-hh, Math.min(hh, this.y));
    }

    this.updateCooldowns(dt);
  }

  _aiTrader(dt, player, dist, angleToPlayer, combatSystem) {
    // Flee: turn away from player, thrust forward. Ship forward angle = π/2 - rotation
    const targetRotation = Math.PI / 2 - (angleToPlayer + Math.PI);
    let angleDiff = targetRotation - this.rotation;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    const turnAmount = Math.max(-0.08, Math.min(0.08, angleDiff * 0.5));
    this.rotation += turnAmount;
    this.speed = Math.min(this.effectiveMaxSpeed, this.speed + this.thrust);

    // Light defense: fire if player is in arc and close
    if (dist < 60 && (this.isInPortArc(player.x, player.y) || this.isInStarboardArc(player.x, player.y))) {
      if (this.isInPortArc(player.x, player.y)) combatSystem.fire(this, 'port');
      else combatSystem.fire(this, 'starboard');
    }
  }

  _aiRaider(dt, player, dist, angleToPlayer, combatSystem) {
    // Rush: turn toward player, thrust forward. Ship forward = π/2 - rotation
    const targetRotation = Math.PI / 2 - angleToPlayer;
    let angleDiff = targetRotation - this.rotation;
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    const turnAmount = Math.max(-0.1, Math.min(0.1, angleDiff * 0.8));
    this.rotation += turnAmount;
    this.speed = Math.min(this.effectiveMaxSpeed, this.speed + this.thrust * 1.2);

    // Aggressive: fire whenever in arc
    if (dist < 80) {
      if (this.isInPortArc(player.x, player.y)) combatSystem.fire(this, 'port');
      else if (this.isInStarboardArc(player.x, player.y)) combatSystem.fire(this, 'starboard');
    }
  }
}

export { ENEMY_TYPES };
