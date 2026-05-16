/**
 * YoHoH — Sailing system: momentum, thrust, braking, drift, turning
 * GDD §8.1: forward thrust, braking, drift; turning slows at high speed
 * Supports rectangular bounds (combat) and corridor bounds (route sailing).
 *
 * Architecture (Improvements.md §1.4): the two public entry points share
 * one set of physics — _applyControls() reads input and mutates the ship's
 * speed/rotation, _integrateMotion() advances position. update() and
 * updateInCorridor() only differ in the clamp applied at the end.
 */

import { SHIP, SAILING_SYSTEM } from '../config.js';

export class SailingSystem {
  /**
   * Apply player thrust/turn/brake to ship.speed and ship.rotation.
   * Pure mutation of `ship`; no positional integration.
   */
  static _applyControls(ship, input) {
    const { thrust, friction, turnRate, brakeMult, highSpeedTurnPenalty } = ship;
    const effectiveMax = ship.effectiveMaxSpeed;

    // Forward / reverse thrust
    if (input.isKeyDown('KeyW')) {
      ship.speed = Math.min(ship.speed + thrust, effectiveMax);
    }
    const reverseMult = SAILING_SYSTEM?.reverseSpeedMult ?? 0.5;
    if (input.isKeyDown('KeyS')) {
      ship.speed = Math.max(ship.speed - thrust * brakeMult, -effectiveMax * reverseMult);
    }

    // Turning: slower at high speed (GDD §8.1)
    const minPenalty = SAILING_SYSTEM?.minTurnPenalty ?? 0.3;
    const turnPenalty = 1 - Math.abs(ship.speed) / (ship.maxSpeed + 0.01) * highSpeedTurnPenalty;
    const actualTurnRate = turnRate * Math.max(minPenalty, turnPenalty);

    if (input.isKeyDown('KeyA')) ship.rotation -= actualTurnRate;
    if (input.isKeyDown('KeyD')) ship.rotation += actualTurnRate;

    // Friction / drift + deadzone
    ship.speed *= friction;
    const deadzone = SAILING_SYSTEM?.speedDeadzone ?? 0.02;
    if (Math.abs(ship.speed) < deadzone) ship.speed = 0;
  }

  /** Advance ship position by its current velocity vector. */
  static _integrateMotion(ship) {
    ship.x += Math.sin(ship.rotation) * ship.speed;
    ship.y += Math.cos(ship.rotation) * ship.speed;
  }

  /**
   * Update ship within rectangular bounds (combat arena).
   * @param {Ship} ship
   * @param {Input} input
   * @param {number} dt - reserved; physics is currently per-frame, not dt-scaled
   * @param {{width:number,height:number}=} bounds
   */
  static update(ship, input, dt, bounds) {
    if (ship.dead) return;
    this._applyControls(ship, input);
    this._integrateMotion(ship);
    if (bounds) {
      const hw = bounds.width / 2;
      const hh = bounds.height / 2;
      ship.x = Math.max(-hw, Math.min(hw, ship.x));
      ship.y = Math.max(-hh, Math.min(hh, ship.y));
    }
  }

  /**
   * Update ship within a route corridor. Ship moves with WASD, constrained to
   * a line segment with lateral half-width.
   * @param {Ship} ship
   * @param {Input} input
   * @param {number} dt
   * @param {{a:{x:number,y:number}|{position:{x:number,y:number}}, b:any, width:number}} corridor
   * @returns {boolean} true when ship has arrived at destination
   */
  static updateInCorridor(ship, input, dt, corridor) {
    if (ship.dead) return true;
    this._applyControls(ship, input);
    this._integrateMotion(ship);
    return this._clampToCorridor(ship, corridor);
  }

  static _clampToCorridor(ship, corridor) {
    const { a, b, width } = corridor;
    const ax = a.position?.x ?? a.x;
    const ay = a.position?.y ?? a.y;
    const bx = b.position?.x ?? b.x;
    const by = b.position?.y ?? b.y;

    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.sqrt(dx * dx + dy * dy);
    const eps = SAILING_SYSTEM?.corridorLenEpsilon ?? 0.001;
    if (len < eps) return true;

    const t = ((ship.x - ax) * dx + (ship.y - ay) * dy) / (len * len);
    const perpX = -dy / len;
    const perpY = dx / len;
    const projX = ax + t * dx;
    const projY = ay + t * dy;
    const lateral = (ship.x - projX) * perpX + (ship.y - projY) * perpY;
    const halfWidth = width / 2;

    const clampedT = Math.max(0, Math.min(1, t));
    const clampedLateral = Math.max(-halfWidth, Math.min(halfWidth, lateral));

    ship.x = ax + clampedT * dx + perpX * clampedLateral;
    ship.y = ay + clampedT * dy + perpY * clampedLateral;

    return clampedT >= 1;
  }
}
