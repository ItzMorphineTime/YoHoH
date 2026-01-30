/**
 * YoHoH — Sailing system: momentum, thrust, braking, drift, turning
 * GDD §8.1: forward thrust, braking, drift; turning slows at high speed
 */

import { SHIP } from '../config.js';

export class SailingSystem {
  static update(ship, input, dt, bounds) {
    if (ship.dead) return;

    const { thrust, friction, turnRate, brakeMult, highSpeedTurnPenalty } = ship;
    const effectiveMax = ship.effectiveMaxSpeed;

    // Forward / backward thrust
    if (input.isKeyDown('KeyW')) {
      ship.speed = Math.min(ship.speed + thrust, effectiveMax);
    }
    if (input.isKeyDown('KeyS')) {
      ship.speed = Math.max(ship.speed - thrust * brakeMult, -effectiveMax * 0.5);
    }

    // Turning: slower at high speed (GDD §8.1)
    const turnPenalty = 1 - Math.abs(ship.speed) / (ship.maxSpeed + 0.01) * highSpeedTurnPenalty;
    const actualTurnRate = turnRate * Math.max(0.3, turnPenalty);

    if (input.isKeyDown('KeyA')) {
      ship.rotation += actualTurnRate;
    }
    if (input.isKeyDown('KeyD')) {
      ship.rotation -= actualTurnRate;
    }

    // Friction / drift
    ship.speed *= friction;
    if (Math.abs(ship.speed) < 0.02) ship.speed = 0;

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
}
