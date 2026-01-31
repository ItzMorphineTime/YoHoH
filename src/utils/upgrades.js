/**
 * C.7, C.10: Ship upgrade utilities
 * Apply upgrade stat deltas to base ship stats
 */

import { SHIP_CLASSES, UPGRADES } from '../config.js';

/**
 * Get effective stat overrides from equipped upgrades.
 * @param {{ [slotId]: upgradeId }} equipped - { hull: 'plating', sails: 'fast_rigging', ... }
 * @param {string} shipClassId
 * @returns {object} Stat overrides to pass to createShip opts
 */
export function getUpgradeStatOverrides(equipped, shipClassId) {
  if (!equipped || typeof equipped !== 'object') return {};
  const cls = SHIP_CLASSES?.[shipClassId];
  if (!cls) return {};
  const overrides = {};
  for (const [slot, upgradeId] of Object.entries(equipped)) {
    if (!upgradeId) continue;
    const up = UPGRADES?.[upgradeId];
    if (!up || up.slot !== slot) continue;
    if (up.hullMax != null) overrides.hullMax = (overrides.hullMax ?? cls.hullMax ?? 80) + up.hullMax;
    if (up.sailMax != null) overrides.sailMax = (overrides.sailMax ?? cls.sailMax ?? 80) + up.sailMax;
    if (up.cargoCapacity != null) overrides.cargoCapacity = (overrides.cargoCapacity ?? cls.cargoCapacity ?? 20) + up.cargoCapacity;
    if (up.bilgeWaterMax != null) overrides.bilgeWaterMax = (overrides.bilgeWaterMax ?? cls.bilgeWaterMax ?? 80) + up.bilgeWaterMax;
    if (up.maxSpeedMult != null) overrides.maxSpeedMult = (overrides.maxSpeedMult ?? 1) * up.maxSpeedMult;
    if (up.sailSpeedMult != null) overrides.sailSpeedMult = (overrides.sailSpeedMult ?? 1) * up.sailSpeedMult;
    if (up.turnRateMult != null) overrides.turnRateMult = (overrides.turnRateMult ?? 1) * up.turnRateMult;
    if (up.cannonCooldownMult != null) overrides.cannonCooldownMult = (overrides.cannonCooldownMult ?? 1) * up.cannonCooldownMult;
    if (up.cannonDamageMult != null) overrides.cannonDamageMult = (overrides.cannonDamageMult ?? 1) * up.cannonDamageMult;
    if (up.crewMult != null) overrides.crewMult = (overrides.crewMult ?? 1) * up.crewMult;
  }
  return overrides;
}

/**
 * Get opts to pass to createShip from upgrades.
 * Merges base class stats with upgrade bonuses.
 */
export function getCreateShipOptsFromUpgrades(equipped, shipClassId, useSailing = false) {
  const overrides = getUpgradeStatOverrides(equipped, shipClassId);
  const cls = SHIP_CLASSES?.[shipClassId];
  if (!cls) return {};
  const opts = {};
  const prefix = useSailing ? 'sailing' : '';
  if (overrides.hullMax != null) opts.hullMax = overrides.hullMax;
  if (overrides.sailMax != null) opts.sailMax = overrides.sailMax;
  if (overrides.bilgeWaterMax != null) opts.bilgeWaterMax = overrides.bilgeWaterMax;
  const baseMaxSpeed = cls?.[`${prefix}MaxSpeed`] ?? cls?.maxSpeed ?? 0.1;
  const baseTurnRate = cls?.[`${prefix}TurnRate`] ?? cls?.turnRate ?? 0.016;
  const baseCooldown = cls?.cannonCooldown ?? 1.5;
  if (overrides.maxSpeedMult != null) opts.maxSpeed = baseMaxSpeed * overrides.maxSpeedMult;
  if (overrides.sailSpeedMult != null) opts.sailSpeedMult = overrides.sailSpeedMult;
  if (overrides.turnRateMult != null) opts.turnRate = baseTurnRate * overrides.turnRateMult;
  if (overrides.cannonCooldownMult != null) opts.cannonCooldown = baseCooldown * overrides.cannonCooldownMult;
  if (overrides.cannonDamageMult != null) opts.cannonDamageMult = overrides.cannonDamageMult;
  if (overrides.crewMult != null) opts.crewMult = overrides.crewMult;
  return opts;
}

/** Get effective cargo capacity (base + upgrades). */
export function getCargoCapacityWithUpgrades(shipClassId, equipped) {
  const cls = SHIP_CLASSES?.[shipClassId];
  const base = cls?.cargoCapacity ?? 20;
  const overrides = getUpgradeStatOverrides(equipped, shipClassId);
  return (overrides.cargoCapacity != null ? overrides.cargoCapacity : base);
}
