/**
 * YoHoH — Combat system: broadside firing, projectiles, hit detection, damage
 * GDD §8.2: port/starboard broadsides, hull/sails/crew damage
 */

import { COMBAT } from '../config.js';
import { Projectile } from '../entities/Projectile.js';

export class CombatSystem {
  constructor() {
    this.projectiles = [];
  }

  /** Fire port or starboard broadside from ship */
  fire(ship, side) {
    if (side === 'port' && ship.firePort()) {
      this._spawnProjectile(ship, 'port');
      return true;
    }
    if (side === 'starboard' && ship.fireStarboard()) {
      this._spawnProjectile(ship, 'starboard');
      return true;
    }
    return false;
  }

  _spawnProjectile(ship, side) {
    const arc = side === 'port' ? ship.getPortArc() : ship.getStarboardArc();
    const arcCenter = (arc.start + arc.end) / 2;
    const cannonCount = Math.max(1, ship.cannonCount ?? 1);
    const spreadRad = cannonCount > 1 ? 0.06 : 0; // slight spread per cannon (C.10c)
    const damageMult = ship.cannonDamageMult ?? 1;
    const baseDamage = COMBAT.projectileDamage * damageMult;
    for (let i = 0; i < cannonCount; i++) {
      const offset = cannonCount > 1 ? (i - (cannonCount - 1) / 2) * spreadRad : 0;
      const centerAngle = arcCenter + offset;
      // Projectile moves (sin(r), cos(r)); arc center angle θ → r = π/2 - θ
      const rotation = Math.PI / 2 - centerAngle;
      this.projectiles.push(new Projectile({
        x: ship.x,
        y: ship.y,
        rotation,
        damage: baseDamage,
        ownerId: ship.isPlayer ? 'player' : ship.id,
        side,
      }));
    }
  }

  update(dt, player, enemies) {
    // Update projectiles
    for (const p of this.projectiles) {
      p.update(dt);
    }
    this.projectiles = this.projectiles.filter(p => !p.dead);

    // Hit detection
    const allShips = [player, ...enemies].filter(s => s && !s.dead);
    for (const p of this.projectiles) {
      if (p.dead) continue;
      for (const ship of allShips) {
        if (ship.isPlayer && p.ownerId === 'player') continue;
        if (!ship.isPlayer && p.ownerId === ship.id) continue;
        const dx = ship.x - p.x;
        const dy = ship.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8) {
          ship.takeDamage(p.damage, 'hull');
          ship.takeDamage(p.damage * COMBAT.sailDamageMult, 'sails');
          p.dead = true;
          break;
        }
      }
    }
    this.projectiles = this.projectiles.filter(p => !p.dead);

    // Update ship cooldowns
    player?.updateCooldowns(dt);
    for (const e of enemies) e?.updateCooldowns(dt);
  }

  getProjectiles() {
    return this.projectiles;
  }
}
