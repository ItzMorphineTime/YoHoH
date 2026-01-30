/**
 * YoHoH — Ship entity (player or AI)
 * Base class for all ship types. Subclasses (Sloop, Brigantine, Galleon) define stats and station slots.
 */

import { BILGE, COMBAT, REPAIR, SHIP, SAILING, SHIP_CLASSES } from '../config.js';

/** Get merged stats from class config + opts. opts overrides config. */
function getShipStatsFromConfig(classConfig, opts = {}, useSailing = false) {
  const cls = classConfig;
  const prefix = useSailing ? 'sailing' : '';
  const base = useSailing ? SAILING : SHIP;
  return {
    hullMax: opts.hullMax ?? cls?.hullMax ?? COMBAT.hullMax,
    sailMax: opts.sailMax ?? cls?.sailMax ?? COMBAT.sailMax,
    crewMax: opts.crewMax ?? cls?.crewMax ?? COMBAT.crewMax,
    bilgeWaterMax: opts.bilgeWaterMax ?? cls?.bilgeWaterMax ?? (BILGE?.bilgeWaterMax ?? 100),
    maxSpeed: opts.maxSpeed ?? cls?.[`${prefix}MaxSpeed`] ?? cls?.maxSpeed ?? base.maxSpeed,
    thrust: opts.thrust ?? cls?.[`${prefix}Thrust`] ?? cls?.thrust ?? base.thrust,
    friction: opts.friction ?? cls?.friction ?? base.friction,
    turnRate: opts.turnRate ?? cls?.[`${prefix}TurnRate`] ?? cls?.turnRate ?? base.turnRate,
    brakeMult: opts.brakeMult ?? cls?.brakeMult ?? base.brakeMult,
    highSpeedTurnPenalty: opts.highSpeedTurnPenalty ?? cls?.[`${prefix}HighSpeedTurnPenalty`] ?? cls?.highSpeedTurnPenalty ?? base.highSpeedTurnPenalty,
    cannonCooldown: opts.cannonCooldown ?? cls?.cannonCooldown ?? COMBAT.cannonCooldown,
  };
}

export class Ship {
  /** Override in subclasses. Returns class config from SHIP_CLASSES. */
  static getClassConfig() {
    return null;
  }

  /** Override in subclasses. Returns ship class id string (e.g. 'sloop'). */
  static get shipClassId() {
    return null;
  }

  constructor(opts = {}) {
    const classConfig = opts._classConfig ?? this.constructor.getClassConfig?.() ?? null;
    const useSailing = opts.useSailing ?? false;
    const stats = getShipStatsFromConfig(classConfig, opts, useSailing);

    this.shipClassId = opts.shipClassId ?? opts.shipClass ?? this.constructor.shipClassId ?? null;
    this.x = opts.x ?? 0;
    this.y = opts.y ?? 0;
    this.rotation = opts.rotation ?? 0;
    this.speed = opts.speed ?? 0;
    this.maxSpeed = opts.maxSpeed ?? stats.maxSpeed;
    this.thrust = opts.thrust ?? stats.thrust;
    this.friction = opts.friction ?? stats.friction;
    this.turnRate = opts.turnRate ?? stats.turnRate;
    this.brakeMult = opts.brakeMult ?? stats.brakeMult;
    this.highSpeedTurnPenalty = opts.highSpeedTurnPenalty ?? stats.highSpeedTurnPenalty;

    // Damage model (GDD §8.2.2)
    this.hull = opts.hull ?? stats.hullMax;
    this.hullMax = opts.hullMax ?? stats.hullMax;
    this.sails = opts.sails ?? stats.sailMax;
    this.sailMax = opts.sailMax ?? stats.sailMax;
    this.crew = opts.crew ?? stats.crewMax;
    this.crewMax = opts.crewMax ?? stats.crewMax;

    // Bilge & leaks
    this.bilgeWater = opts.bilgeWater ?? 0;
    this.bilgeWaterMax = opts.bilgeWaterMax ?? stats.bilgeWaterMax;
    this.leaks = opts.leaks ?? 0;

    // Station effects (set by Game when sailing; from crew roster)
    this._stationEffects = opts.stationEffects ?? null;

    // Cannon state
    this.cannonCooldown = opts.cannonCooldown ?? stats.cannonCooldown;
    this.portCooldown = 0;
    this.starboardCooldown = 0;

    this.isPlayer = opts.isPlayer ?? false;
    this.dead = false;
  }

  /** Get station slots for this ship class (for crew assignment) */
  getStationSlots() {
    if (!this.shipClassId || !SHIP_CLASSES?.[this.shipClassId]) return {};
    return SHIP_CLASSES[this.shipClassId].stationSlots ?? {};
  }

  /** Speed multiplier from sail damage (0–1) */
  get sailSpeedMult() {
    return Math.max(0.2, this.sails / this.sailMax);
  }

  /** Crew effectiveness multiplier (0–1) */
  get crewMult() {
    return Math.max(0.2, this.crew / this.crewMax);
  }

  /** Speed multiplier from bilge water (1 at empty, ~0.2 at full) */
  get bilgeSpeedMult() {
    const max = this.bilgeWaterMax ?? 100;
    if (max <= 0) return 1;
    const ratio = Math.min(1, this.bilgeWater / max);
    return Math.max(0.2, 1 - ratio * 0.8);
  }

  /** Sailing station speed bonus (from crew roster) */
  get sailingStationMult() {
    return this._stationEffects?.sailSpeedMult ?? 1;
  }

  /** Effective max speed: sails, crew, bilge water, sailing station */
  get effectiveMaxSpeed() {
    return this.maxSpeed * this.sailSpeedMult * this.crewMult * this.bilgeSpeedMult * this.sailingStationMult;
  }

  /** Set station effects (from CrewSystem.getStationEffects) */
  setStationEffects(effects) {
    this._stationEffects = effects;
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

  /** Apply damage (hull, sails, crew). Hull damage increases leaks. */
  takeDamage(amount, type = 'hull') {
    if (this.dead) return;
    if (type === 'sails') {
      this.sails = Math.max(0, this.sails - amount);
    } else if (type === 'crew') {
      this.crew = Math.max(0, this.crew - amount);
    } else {
      this.hull = Math.max(0, this.hull - amount);
      const leaksPerDamage = BILGE?.leaksPerHullDamage ?? 0.04;
      this.leaks = Math.max(0, (this.leaks ?? 0) + amount * leaksPerDamage);
    }
    if (this.hull <= 0) this.dead = true;
  }

  /** Carpenter repair: hull and leaks repaired over time. repairMult/leakRepairMult from crew. */
  repairTick(dt, repairMult = 1, leakRepairMult = 1) {
    if (this.dead) return;
    const hullRate = (REPAIR?.hullRepairPerSecond ?? 2) * repairMult * dt;
    const leakRate = (REPAIR?.leakRepairPerSecond ?? 0.5) * leakRepairMult * dt;
    this.hull = Math.min(this.hullMax, this.hull + hullRate);
    this.leaks = Math.max(0, (this.leaks ?? 0) - leakRate);
  }

  /** Update bilge water: leaks add water, bilge station pumps it out. */
  updateBilge(dt, bilgePumpMult = 1) {
    const leakRate = BILGE?.leakWaterRate ?? 2;
    const basePump = BILGE?.basePumpRate ?? 5;
    this.bilgeWater = Math.max(0, (this.bilgeWater ?? 0) + (this.leaks ?? 0) * leakRate * dt - basePump * bilgePumpMult * dt);
    this.bilgeWater = Math.min(this.bilgeWater, this.bilgeWaterMax ?? 100);
  }

  /** Update cooldowns */
  updateCooldowns(dt) {
    if (this.portCooldown > 0) this.portCooldown -= dt;
    if (this.starboardCooldown > 0) this.starboardCooldown -= dt;
  }
}
