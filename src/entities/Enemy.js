/**
 * YoHoH — Enemy ship (Trader, Raider)
 * GDD §10.1: Trader flees/light defenses; Raider rush + aggressive
 *
 * Battle_Improvements.md §1.1 + §3.1 + §1.9 (2026-05-18):
 *   - Physics now runs through `SailingSystem` every tick (dt-scaled, with the
 *     same friction-as-exponent treatment the player gets). The old code
 *     advanced position via `this.x += sin(r) * speed` with NO dt, gated
 *     behind a 0.5 s AI-decision timer — enemies teleported in 0.5 s hops.
 *   - AI _decisions_ (turn / thrust intent + fire) still re-roll every
 *     `aiInterval` seconds. Intent is cached on `_aiIntent` and exposed via a
 *     small synthetic input wrapper so the existing `SailingSystem._applyControls`
 *     reads it without any special-case branching.
 *   - Cooldowns tick every frame independent of the AI decision timer
 *     (previously cooldowns lagged by up to `aiInterval`).
 */

import { Ship } from './Ship.js';
import { SailingSystem } from '../systems/SailingSystem.js';
import { COMBAT } from '../config.js';

const ENEMY_TYPES = {
  TRADER: 'trader',
  RAIDER: 'raider',
};

/** Wrap an angle to [-π, π]. */
function wrapAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

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

    // Battle_Improvements.md §1.1: AI intent shared between the decision pass
    // (which re-rolls every aiInterval) and the physics pass (which reads it
    // every frame via the input wrapper below).
    this._aiIntent = { thrust: false, brake: false, turnLeft: false, turnRight: false };
    const intent = this._aiIntent;
    this._aiInput = {
      isKeyDown(code) {
        switch (code) {
          case 'KeyW': return !!intent.thrust;
          case 'KeyS': return !!intent.brake;
          case 'KeyA': return !!intent.turnLeft;
          case 'KeyD': return !!intent.turnRight;
          default:     return false;
        }
      },
    };
  }

  update(dt, player, combatSystem, bounds) {
    if (this.dead) return;

    // Battle_Improvements.md §1.9: cooldowns tick every frame regardless of
    // the AI-decision timer. Previously cooldowns could lag by up to 0.5 s,
    // producing effective cooldowns of `cannonCooldown + aiInterval`.
    this.updateCooldowns(dt);

    // Battle_Improvements.md §1.1: roll AI decisions on the slower cadence.
    this.aiTimer += dt;
    if (this.aiTimer >= this.aiInterval) {
      this.aiTimer = 0;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angleToPlayer = Math.atan2(dy, dx); // +X convention (matches arc math)
      if (this.type === ENEMY_TYPES.TRADER) {
        this._decideTrader(dist, angleToPlayer);
      } else {
        this._decideRaider(dist, angleToPlayer);
      }
      this._maybeFire(player, dist, combatSystem);
    }

    // Battle_Improvements.md §1.1 / §3.1: physics through `SailingSystem`,
    // dt-scaled and bounds-clamped, identical to the player path.
    SailingSystem.update(this, this._aiInput, dt, bounds);
  }

  /**
   * Trader AI: face directly away from the player and run.
   * Ship forward direction in atan2 convention: forwardAngle = π/2 - rotation.
   * To face away: forwardAngle == angleToPlayer + π
   *   → rotation = π/2 - (angleToPlayer + π) = -π/2 - angleToPlayer.
   */
  _decideTrader(dist, angleToPlayer) {
    const targetRotation = -Math.PI / 2 - angleToPlayer;
    this._setTurnIntent(targetRotation);
    this._aiIntent.thrust = true;
    this._aiIntent.brake = false;
  }

  /**
   * Raider AI: two-stage.
   *   - Far (> 50): face the player, full thrust to close the gap.
   *   - Close (≤ 50): turn so the player sits on the port broadside (90° left
   *     of forward) — this is where the cannons can actually hit. The previous
   *     "face the player and hope for a side hit" logic almost never fired.
   * If extremely close (< 25), brake to avoid ramming through and out the
   * other side.
   */
  _decideRaider(dist, angleToPlayer) {
    let targetRotation;
    if (dist > 50) {
      // Close the distance: forward = toward player → rotation = π/2 - angleToPlayer
      targetRotation = Math.PI / 2 - angleToPlayer;
    } else {
      // Broadside: forwardAngle = angleToPlayer + π/2 → rotation = -angleToPlayer
      targetRotation = -angleToPlayer;
    }
    this._setTurnIntent(targetRotation);
    this._aiIntent.thrust = dist > 30;
    this._aiIntent.brake = dist < 25;
  }

  /**
   * Translate a desired rotation into A/D intent. Sailing physics handles the
   * actual turn-rate / high-speed penalty, so the AI just picks the side.
   */
  _setTurnIntent(targetRotation) {
    const delta = wrapAngle(targetRotation - this.rotation);
    const deadzone = 0.04; // ~2.3° tolerance
    this._aiIntent.turnLeft = delta < -deadzone;
    this._aiIntent.turnRight = delta > deadzone;
  }

  /** Fire whichever broadside the player is in, if any (and off cooldown). */
  _maybeFire(player, dist, combatSystem) {
    if (!combatSystem || dist > (COMBAT?.cannonRange ?? 80)) return;
    if (this.isInPortArc(player.x, player.y)) {
      combatSystem.fire(this, 'port');
    } else if (this.isInStarboardArc(player.x, player.y)) {
      combatSystem.fire(this, 'starboard');
    }
  }
}

export { ENEMY_TYPES };
