/**
 * YoHoH — Sailing system: momentum, thrust, braking, drift, turning
 * GDD §8.1: forward thrust, braking, drift; turning slows at high speed
 * Supports rectangular bounds (combat) and corridor bounds (route sailing).
 *
 * Architecture (Improvements.md §1.4): the two public entry points share
 * one set of physics — _applyControls() reads input and mutates the ship's
 * speed/rotation, _integrateMotion() advances position. update() and
 * updateInCorridor() only differ in the clamp applied at the end.
 *
 * Frame-rate independence (Sailing_Improvements.md §1.1):
 *   - All ship physics coefficients are TUNED AT 60 fps.
 *   - Each tick we compute a `frameScale = dt * SAILING.referenceFps` so the
 *     same numerical values produce the same feel at any frame rate.
 *   - Thrust, turn rate, and position integration multiply by `frameScale`.
 *   - Friction is exponentiated by `frameScale` because it's a per-step ratio,
 *     not a per-step delta: 0.998 ^ frameScale preserves the "% retained per
 *     unit time" semantic across fps.
 */

import { SHIP, SAILING, SAILING_SYSTEM, WIND } from '../config.js';

/**
 * Compute the frame-rate scale factor for this tick. 1.0 at 60 fps, 2.0 at 30 fps, etc.
 * Clamped so a freakishly long frame (alt-tab) doesn't teleport the ship.
 */
function frameScale(dt) {
  const ref = SAILING?.referenceFps ?? 60;
  const k = (dt ?? 0) * ref;
  // Clamp to a sane range (≤ 0.25 s effective integration step at 60 fps reference)
  return Math.max(0, Math.min(15, k));
}

/**
 * Sailing_Improvements.md §4.1: compute a speed multiplier based on the angle
 * between the ship's heading and the wind direction.
 *   alignment = cos(deltaAngle)   ∈ [-1, 1]
 *   downwind (alignment=+1) → 1 + bonusMult
 *   upwind   (alignment=-1) → 1 - penaltyMult
 *   beam     (alignment=0)  → 1.0
 * `shape` controls how peaked the curve is (default 1 = pure cosine).
 */
function computeWindMultiplier(ship, wind) {
  if (!WIND?.enabled || !wind || typeof wind.angleRad !== 'number') return 1;
  const shipDir = ship.rotation ?? 0;
  // Ship velocity vector convention: forward = (sin r, cos r). Wind angle uses the
  // same convention. Alignment = cos(angle between them).
  const delta = shipDir - wind.angleRad;
  const cosA = Math.cos(delta);
  const shape = WIND.shape ?? 1;
  const aligned = Math.sign(cosA) * Math.pow(Math.abs(cosA), shape);
  if (aligned >= 0) return 1 + (WIND.bonusMult ?? 0.25) * aligned;
  return 1 + (WIND.penaltyMult ?? 0.2) * aligned; // aligned is negative
}

export class SailingSystem {
  /**
   * Apply player thrust/turn/brake to ship.speed and ship.rotation.
   * Pure mutation of `ship`; no positional integration.
   * @param {Object} ship
   * @param {Object} input
   * @param {number} dt
   * @param {{ angleRad?: number }=} wind  Optional wind vector for the map
   */
  static _applyControls(ship, input, dt, wind = null) {
    const { thrust, friction, turnRate, brakeMult, highSpeedTurnPenalty } = ship;
    // Sailing_Improvements.md §4.1: wind multiplier on top of effective max speed
    const windMult = computeWindMultiplier(ship, wind);
    const effectiveMax = ship.effectiveMaxSpeed * windMult;
    const s = frameScale(dt);
    const wDown = input.isKeyDown('KeyW');
    const sDown = input.isKeyDown('KeyS');

    // Forward / reverse thrust (scaled by frameScale so accel is per-second)
    if (wDown) {
      ship.speed = Math.min(ship.speed + thrust * s, effectiveMax);
    }
    const reverseMult = SAILING_SYSTEM?.reverseSpeedMult ?? 0.5;
    if (sDown) {
      ship.speed = Math.max(ship.speed - thrust * brakeMult * s, -effectiveMax * reverseMult);
    }
    // Stash for HUD / tooltip
    ship._windMult = windMult;

    // Turning: slower at high speed (GDD §8.1). Scaled by frameScale.
    const minPenalty = SAILING_SYSTEM?.minTurnPenalty ?? 0.3;
    const turnPenalty = 1 - Math.abs(ship.speed) / (ship.maxSpeed + 0.01) * highSpeedTurnPenalty;
    const actualTurnRate = turnRate * Math.max(minPenalty, turnPenalty) * s;

    if (input.isKeyDown('KeyA')) ship.rotation -= actualTurnRate;
    if (input.isKeyDown('KeyD')) ship.rotation += actualTurnRate;

    // Friction / drift — exponentiated so 0.998/frame@60fps preserves its
    // meaning across frame rates. (Math.pow is cheap; no need for Math.exp.)
    if (s > 0) ship.speed *= Math.pow(friction, s);
    // Deadzone snap — but only when the player is NOT actively pressing W/S.
    // Otherwise, at high fps the per-tick thrust delta can be smaller than the
    // deadzone and the ship would snap back to 0 every frame, never escaping.
    if (!wDown && !sDown) {
      const deadzone = SAILING_SYSTEM?.speedDeadzone ?? 0.02;
      if (Math.abs(ship.speed) < deadzone) ship.speed = 0;
    }
  }

  /** Advance ship position by its current velocity vector (scaled by dt). */
  static _integrateMotion(ship, dt) {
    const s = frameScale(dt);
    ship.x += Math.sin(ship.rotation) * ship.speed * s;
    ship.y += Math.cos(ship.rotation) * ship.speed * s;
  }

  /**
   * Update ship within rectangular bounds (combat arena).
   * @param {Ship} ship
   * @param {Input} input
   * @param {number} dt
   * @param {{width:number,height:number}=} bounds
   */
  static update(ship, input, dt, bounds, wind = null) {
    if (ship.dead) return;
    ship.beginTick?.(); // Sailing_Improvements.md §1.6: invalidate effectiveMaxSpeed cache
    this._applyControls(ship, input, dt, wind);
    this._integrateMotion(ship, dt);
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
    ship.beginTick?.(); // Sailing_Improvements.md §1.6
    // Wind, if any, rides along on the corridor object (kept optional for back-compat).
    this._applyControls(ship, input, dt, corridor?.wind ?? null);
    this._integrateMotion(ship, dt);
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
