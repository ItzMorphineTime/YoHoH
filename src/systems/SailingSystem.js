/**
 * YoHoH — Sailing system: momentum, thrust, braking, drift, turning
 * GDD §8.1: forward thrust, braking, drift; turning slows at high speed
 * Supports rectangular bounds (combat) and corridor bounds (route sailing)
 */

import { SHIP, SAILING_SYSTEM } from '../config.js';

export class SailingSystem {
  static update(ship, input, dt, bounds) {
    if (ship.dead) return;

    const { thrust, friction, turnRate, brakeMult, highSpeedTurnPenalty } = ship;
    const effectiveMax = ship.effectiveMaxSpeed;

    // Forward / backward thrust
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

    if (input.isKeyDown('KeyA')) {
      ship.rotation -= actualTurnRate;
    }
    if (input.isKeyDown('KeyD')) {
      ship.rotation += actualTurnRate;
    }

    // Friction / drift
    ship.speed *= friction;
    const deadzone = SAILING_SYSTEM?.speedDeadzone ?? 0.02;
    if (Math.abs(ship.speed) < deadzone) ship.speed = 0;

    // Move
    ship.x += Math.sin(ship.rotation) * ship.speed;
    ship.y += Math.cos(ship.rotation) * ship.speed;

    // Clamp to bounds
    if (bounds) {
      const hw = bounds.width / 2;
      const hh = bounds.height / 2;
      ship.x = Math.max(-hw, Math.min(hw, ship.x));
      ship.y = Math.max(-hh, Math.min(hh, ship.y));
    }
  }

  /**
   * Update ship in a route corridor. Ship moves with WASD, constrained to corridor.
   * corridor: { a: { x, y }, b: { x, y }, width }
   * Returns true when ship has arrived at destination.
   */
  static updateInCorridor(ship, input, dt, corridor) {
    if (ship.dead) return true;

    const { thrust, friction, turnRate, brakeMult, highSpeedTurnPenalty } = ship;
    const effectiveMax = ship.effectiveMaxSpeed;

    if (input.isKeyDown('KeyW')) {
      ship.speed = Math.min(ship.speed + thrust, effectiveMax);
    }
    const reverseMult = SAILING_SYSTEM?.reverseSpeedMult ?? 0.5;
    if (input.isKeyDown('KeyS')) {
      ship.speed = Math.max(ship.speed - thrust * brakeMult, -effectiveMax * reverseMult);
    }

    const minPenalty = SAILING_SYSTEM?.minTurnPenalty ?? 0.3;
    const turnPenalty = 1 - Math.abs(ship.speed) / (ship.maxSpeed + 0.01) * highSpeedTurnPenalty;
    const actualTurnRate = turnRate * Math.max(minPenalty, turnPenalty);

    if (input.isKeyDown('KeyA')) {
      ship.rotation -= actualTurnRate;
    }
    if (input.isKeyDown('KeyD')) {
      ship.rotation += actualTurnRate;
    }

    ship.speed *= friction;
    const deadzone = SAILING_SYSTEM?.speedDeadzone ?? 0.02;
    if (Math.abs(ship.speed) < deadzone) ship.speed = 0;

    ship.x += Math.sin(ship.rotation) * ship.speed;
    ship.y += Math.cos(ship.rotation) * ship.speed;

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
    const projX = ax + t * dx;
    const projY = ay + t * dy;
    const perpX = -dy / len;
    const perpY = dx / len;
    const lateral = (ship.x - projX) * perpX + (ship.y - projY) * perpY;
    const halfWidth = width / 2;

    const clampedT = Math.max(0, Math.min(1, t));
    const clampedLateral = Math.max(-halfWidth, Math.min(halfWidth, lateral));

    ship.x = ax + clampedT * dx + perpX * clampedLateral;
    ship.y = ay + clampedT * dy + perpY * clampedLateral;

    return clampedT >= 1;
  }
}
