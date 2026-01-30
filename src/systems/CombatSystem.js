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
    // Projectile moves (sin(r), cos(r)); arc center angle θ = atan2(dy,dx) → direction (cos θ, sin θ)
    // So we need sin(r)=cos(θ), cos(r)=sin(θ) → r = π/2 - θ
    const rotation = Math.PI / 2 - arcCenter;
    this.projectiles.push(new Projectile({
      x: ship.x,
      y: ship.y,
      rotation,
      ownerId: ship.isPlayer ? 'player' : ship.id,
      side,
    }));
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
