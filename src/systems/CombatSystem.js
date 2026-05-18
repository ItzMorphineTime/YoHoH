/**
 * YoHoH — Combat system: broadside firing, projectiles, hit detection, damage
 * GDD §8.2: port/starboard broadsides, hull/sails/crew damage
 *
 * Projectile lifecycle (Improvements.md §6.1):
 *   - `projectiles[]`   — currently-active projectiles
 *   - `_pool[]`         — dormant Projectile instances available for reuse
 *   - fire() → _acquire() returns a recycled instance (or constructs one)
 *   - update() compacts the active array in place and recycles dead entries
 */

import { COMBAT } from '../config.js';
import { Projectile } from '../entities/Projectile.js';

export class CombatSystem {
  constructor() {
    this.projectiles = [];
    this._pool = [];
    // Battle_Improvements.md §2.6: short-lived visual effects (muzzle flash,
    // water splash on miss, hit spark on ship hit). Renderer reads via
    // `getEffects()` each frame and pools meshes accordingly.
    //
    // Effect shape: { id, type: 'muzzle' | 'splash' | 'hit',
    //                 x, y, rotation?, age: 0, lifetime, side? }
    this.effects = [];
    this._effectIdSeq = 0;
  }

  /** Acquire a projectile (recycled if possible) and initialise from opts. */
  _acquire(opts) {
    const p = this._pool.pop();
    return p ? p.init(opts) : new Projectile(opts);
  }

  /** Return a projectile to the dormant pool. */
  _recycle(p) {
    p.dead = true;
    this._pool.push(p);
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
      this.projectiles.push(this._acquire({
        x: ship.x,
        y: ship.y,
        rotation,
        damage: baseDamage,
        ownerId: ship.isPlayer ? 'player' : ship.id,
        side,
      }));
    }
    // Battle_Improvements.md §2.6: muzzle flash at the broadside side.
    // Offset ~6 units along the arc center so it sits at the ship's flank,
    // not its centre.
    const offsetDist = 6;
    const flashX = ship.x + Math.cos(arcCenter) * offsetDist;
    const flashY = ship.y + Math.sin(arcCenter) * offsetDist;
    this._spawnEffect({
      type: 'muzzle',
      x: flashX, y: flashY,
      rotation: arcCenter,
      lifetime: 0.18,
      side,
    });
  }

  /** Battle_Improvements.md §2.6: push a short-lived visual effect. */
  _spawnEffect(opts) {
    this.effects.push({
      id: ++this._effectIdSeq,
      age: 0,
      x: opts.x ?? 0,
      y: opts.y ?? 0,
      rotation: opts.rotation ?? 0,
      lifetime: opts.lifetime ?? 0.3,
      type: opts.type ?? 'splash',
      side: opts.side ?? null,
    });
  }

  /** Read-only effects list for the renderer. */
  getEffects() {
    return this.effects;
  }

  update(dt, player, enemies, rocks = []) {
    // Advance projectiles in place
    for (const p of this.projectiles) {
      if (!p.dead) p.update(dt);
    }

    // Hit detection.
    // Battle_Improvements.md §1.2: per-ship `collisionRadius` (galleon 11,
    // brigantine 9, sloop 7, fallback 8). Uses squared distance vs squared
    // radius to skip the per-projectile sqrt — minor speedup that scales with
    // projectile count.
    const allShips = [player, ...enemies].filter(s => s && !s.dead);
    for (const p of this.projectiles) {
      if (p.dead) continue;
      // Battle_Improvements.md §1.8: rocks block projectiles. Test FIRST so a
      // ship behind a rock can use it as cover.
      let blockedByRock = false;
      for (const rock of rocks) {
        const rdx = rock.x - p.x;
        const rdy = rock.y - p.y;
        const rr = rock.r ?? 0;
        if (rdx * rdx + rdy * rdy < rr * rr) {
          // Spawn a small splash where the ball clipped the rock
          this._spawnEffect({ type: 'splash', x: p.x, y: p.y, lifetime: 0.4 });
          p.dead = true;
          blockedByRock = true;
          break;
        }
      }
      if (blockedByRock) continue;
      for (const ship of allShips) {
        if (ship.isPlayer && p.ownerId === 'player') continue;
        if (!ship.isPlayer && p.ownerId === ship.id) continue;
        const dx = ship.x - p.x;
        const dy = ship.y - p.y;
        const radius = ship.collisionRadius ?? 8;
        if (dx * dx + dy * dy < radius * radius) {
          ship.takeDamage(p.damage, 'hull');
          ship.takeDamage(p.damage * COMBAT.sailDamageMult, 'sails');
          // Battle_Improvements.md §2.6: hit spark at the impact point
          this._spawnEffect({ type: 'hit', x: p.x, y: p.y, lifetime: 0.3 });
          p.dead = true;
          break;
        }
      }
    }

    // Compact active list and recycle dead projectiles.
    // Battle_Improvements.md §2.6: timed-out projectiles spawn a water splash.
    let w = 0;
    for (let r = 0; r < this.projectiles.length; r++) {
      const p = this.projectiles[r];
      if (p.dead) {
        // `lifetime <= 0` death = timed out = miss. We can't distinguish from a
        // hit perfectly because `p.dead = true` is set in both paths, but the
        // hit branch above already spawned its own `hit` effect — so we only
        // emit a splash for projectiles that ran out of lifetime without
        // triggering a hit effect this frame. Approximation: spawn a splash if
        // we don't see a matching hit effect at this position.
        if (p.lifetime <= 0) {
          this._spawnEffect({ type: 'splash', x: p.x, y: p.y, lifetime: 0.45 });
        }
        this._recycle(p);
      } else {
        this.projectiles[w++] = p;
      }
    }
    this.projectiles.length = w;

    // Battle_Improvements.md §2.6: tick + reap effects
    let ew = 0;
    for (let r = 0; r < this.effects.length; r++) {
      const fx = this.effects[r];
      fx.age += dt;
      if (fx.age < fx.lifetime) {
        this.effects[ew++] = fx;
      }
    }
    this.effects.length = ew;

    // Update ship cooldowns
    player?.updateCooldowns(dt);
    for (const e of enemies) e?.updateCooldowns(dt);
  }

  getProjectiles() {
    return this.projectiles;
  }

  /** Drain the active list, recycling all live projectiles + effects. */
  reset() {
    for (const p of this.projectiles) this._recycle(p);
    this.projectiles.length = 0;
    this.effects.length = 0;
  }
}
