/**
 * YoHoH — Ship entity (player or AI)
 * Position, rotation, velocity, momentum, damage model, cannon arcs
 */

import { COMBAT, SHIP } from '../config.js';

export class Ship {
  constructor(opts = {}) {
    this.x = opts.x ?? 0;
    this.y = opts.y ?? 0;
    this.rotation = opts.rotation ?? 0;
    this.speed = opts.speed ?? 0;
    this.maxSpeed = opts.maxSpeed ?? SHIP.maxSpeed;
    this.thrust = opts.thrust ?? SHIP.thrust;
    this.friction = opts.friction ?? SHIP.friction;
    this.turnRate = opts.turnRate ?? SHIP.turnRate;
    this.brakeMult = opts.brakeMult ?? SHIP.brakeMult;
    this.highSpeedTurnPenalty = opts.highSpeedTurnPenalty ?? SHIP.highSpeedTurnPenalty;

    // Damage model (GDD §8.2.2)
    this.hull = opts.hull ?? COMBAT.hullMax;
    this.hullMax = opts.hullMax ?? COMBAT.hullMax;
    this.sails = opts.sails ?? COMBAT.sailMax;
    this.sailMax = opts.sailMax ?? COMBAT.sailMax;
    this.crew = opts.crew ?? COMBAT.crewMax;
    this.crewMax = opts.crewMax ?? COMBAT.crewMax;

    // Cannon state
    this.cannonCooldown = opts.cannonCooldown ?? COMBAT.cannonCooldown;
    this.portCooldown = 0;
    this.starboardCooldown = 0;

    this.isPlayer = opts.isPlayer ?? false;
    this.dead = false;
  }

  /** Speed multiplier from sail damage (0–1) */
  get sailSpeedMult() {
    return Math.max(0.2, this.sails / this.sailMax);
  }

  /** Crew effectiveness multiplier (0–1) */
  get crewMult() {
    return Math.max(0.2, this.crew / this.crewMax);
  }

  /** Effective max speed after sail damage */
  get effectiveMaxSpeed() {
    return this.maxSpeed * this.sailSpeedMult * this.crewMult;
  }

  /** Cannon arc half-angle in radians */
  get cannonArcRad() {
    return (COMBAT.cannonArcDeg / 2) * (Math.PI / 180);
  }

  /** Port arc: left side of ship. Forward = +Y when rotation=0; port = left = +X when rot=0 */
  getPortArc() {
    const half = this.cannonArcRad;
    const center = Math.PI - this.rotation; // left of forward
    return { start: center - half, end: center + half };
  }

  /** Starboard arc: right side of ship */
  getStarboardArc() {
    const half = this.cannonArcRad;
    const center = -this.rotation; // right of forward
    return { start: center - half, end: center + half };
  }

  /** Check if angle (from ship center to target) is in port arc. atan2(dy,dx) = angle from +X */
  isInPortArc(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const angle = Math.atan2(dy, dx);
    const arc = this.getPortArc();
    return this._angleInArc(angle, arc.start, arc.end);
  }

  /** Check if angle is in starboard arc */
  isInStarboardArc(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const angle = Math.atan2(dy, dx);
    const arc = this.getStarboardArc();
    return this._angleInArc(angle, arc.start, arc.end);
  }

  _angleInArc(angle, start, end) {
    const twoPi = Math.PI * 2;
    let a = ((angle % twoPi) + twoPi) % twoPi;
    let s = ((start % twoPi) + twoPi) % twoPi;
    let e = ((end % twoPi) + twoPi) % twoPi;
    if (s <= e) return a >= s && a <= e;
    return a >= s || a <= e;
  }

  /** Can fire port broadside? */
  canFirePort() {
    return this.portCooldown <= 0 && !this.dead;
  }

  /** Can fire starboard broadside? */
  canFireStarboard() {
    return this.starboardCooldown <= 0 && !this.dead;
  }

  /** Fire port broadside; returns true if fired */
  firePort() {
    if (!this.canFirePort()) return false;
    this.portCooldown = this.cannonCooldown;
    return true;
  }

  /** Fire starboard broadside */
  fireStarboard() {
    if (!this.canFireStarboard()) return false;
    this.starboardCooldown = this.cannonCooldown;
    return true;
  }

  /** Apply damage (hull, sails, crew) */
  takeDamage(amount, type = 'hull') {
    if (this.dead) return;
    if (type === 'sails') {
      this.sails = Math.max(0, this.sails - amount);
    } else if (type === 'crew') {
      this.crew = Math.max(0, this.crew - amount);
    } else {
      this.hull = Math.max(0, this.hull - amount);
    }
    if (this.hull <= 0) this.dead = true;
  }

  /** Update cooldowns */
  updateCooldowns(dt) {
    if (this.portCooldown > 0) this.portCooldown -= dt;
    if (this.starboardCooldown > 0) this.starboardCooldown -= dt;
  }
}
