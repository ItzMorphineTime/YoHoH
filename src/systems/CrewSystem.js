/**
 * YoHoH — Crew system: roster, stations, station effects
 * GDD §8.4: hire crew, assign stations, morale (light)
 * Supports variable station slots per ship class
 */

import { CREW, SHIP_CLASSES } from '../config.js';

/** Create a new crew member */
export function createCrewMember(opts = {}) {
  return {
    id: opts.id ?? `crew_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: opts.name ?? 'Sailor',
    station: opts.station ?? null,
    morale: opts.morale ?? CREW.moraleBaseline ?? 1,
  };
}

/** Get station slots for a ship class. Returns { stationId: slots } */
export function getStationSlots(shipClassId) {
  if (!shipClassId || !SHIP_CLASSES?.[shipClassId]) return {};
  return SHIP_CLASSES[shipClassId].stationSlots ?? {};
}

/** Count crew assigned to each station */
export function getStationFillCounts(roster) {
  const counts = {};
  for (const c of roster ?? []) {
    if (!c.station) continue;
    counts[c.station] = (counts[c.station] ?? 0) + 1;
  }
  return counts;
}

/** Get stations that have open slots (for assignment dropdown) */
export function getAvailableStations(roster, shipClassId = null) {
  const slots = getStationSlots(shipClassId);
  const fillCounts = getStationFillCounts(roster);
  const stations = CREW.stations ?? [];
  return stations.filter(s => {
    const max = slots[s] ?? 1;
    const filled = fillCounts[s] ?? 0;
    return filled < max;
  });
}

/** Get fill count for a station (for UI display e.g. "1/2") */
export function getStationFillInfo(roster, shipClassId) {
  const slots = getStationSlots(shipClassId);
  const fillCounts = getStationFillCounts(roster);
  const result = {};
  for (const s of CREW.stations ?? []) {
    result[s] = { filled: fillCounts[s] ?? 0, slots: slots[s] ?? 1 };
  }
  return result;
}

/** Get stations a specific crew member can be assigned to (for dropdown). Includes current station. */
export function getAssignableStationsForCrew(roster, shipClassId, crewId) {
  const crew = roster?.find(c => c.id === crewId);
  const slots = getStationSlots(shipClassId);
  const fillCounts = getStationFillCounts(roster);
  const stations = CREW.stations ?? [];
  return stations.filter(s => {
    const max = slots[s] ?? 1;
    let filled = fillCounts[s] ?? 0;
    if (crew?.station === s) filled -= 1;
    return filled < max;
  });
}

/** Assign crew to station. Returns true if assigned. Respects station slot limits. */
export function assignStation(roster, crewId, station, shipClassId = null) {
  const crew = roster?.find(c => c.id === crewId);
  if (!crew) return false;
  const validStations = CREW.stations ?? [];
  if (station && !validStations.includes(station)) return false;
  if (station) {
    const slots = getStationSlots(shipClassId);
    const fillCounts = getStationFillCounts(roster);
    const max = slots[station] ?? 1;
    const filled = fillCounts[station] ?? 0;
    if (crew.station === station) return true;
    if (filled >= max) return false;
  }
  crew.station = station || null;
  return true;
}

/** Unassign crew from station */
export function unassignStation(roster, crewId) {
  return assignStation(roster, crewId, null);
}

/** Hire crew. Returns new crew member or null if can't afford / at max. */
export function hireCrew(roster, gold, cost = CREW.hireCost, maxCrew = CREW.maxCrew) {
  if (gold < cost) return null;
  const max = maxCrew ?? 20;
  if ((roster?.length ?? 0) >= max) return null;
  const crew = createCrewMember();
  return { crew, cost };
}

/** Map station -> result keys it affects (for C.6b unassigned penalty) */
const STATION_TO_EFFECT_KEYS = {
  helmsman: ['turnRateMult'],
  gunner_port: ['portReloadMult'],
  gunner_starboard: ['starboardReloadMult'],
  carpenter: ['repairMult', 'leakRepairMult'],
  navigator: ['sailSpeedMult'],
  sailing: ['sailSpeedMult'],
  bilge: ['bilgePumpMult'],
  man_at_arms: ['crewMult'],
};

/** Compute station effect multipliers for ship stats. Multiple crew per station stack multiplicatively. C.6: morale scales effectiveness. C.6b: unassigned stations reduce effectiveness. */
export function getStationEffects(roster, shipClassId = null) {
  const effects = CREW.stationEffects ?? {};
  const slots = getStationSlots(shipClassId);
  const fillCounts = getStationFillCounts(roster);
  const moraleMult = getAverageMorale(roster);
  const unassignedPenalty = CREW.unassignedStationPenalty ?? 0.85;
  const result = {
    turnRateMult: 1,
    portReloadMult: 1,
    starboardReloadMult: 1,
    repairMult: 1,
    leakRepairMult: 1,
    sailSpeedMult: 1,
    bilgePumpMult: 1,
    crewMult: 1,
  };
  for (const [station, count] of Object.entries(fillCounts)) {
    const max = slots[station] ?? 1;
    const capped = Math.min(count, max);
    const e = effects[station];
    if (!e || capped <= 0) continue;
    for (let i = 0; i < capped; i++) {
      if (e.turnRateMult) result.turnRateMult *= e.turnRateMult;
      if (e.portReloadMult) result.portReloadMult *= e.portReloadMult;
      if (e.starboardReloadMult) result.starboardReloadMult *= e.starboardReloadMult;
      if (e.repairMult) result.repairMult *= e.repairMult;
      if (e.leakRepairMult) result.leakRepairMult *= e.leakRepairMult;
      if (e.sailSpeedMult) result.sailSpeedMult *= e.sailSpeedMult;
      if (e.bilgePumpMult) result.bilgePumpMult *= e.bilgePumpMult;
      if (e.crewMult) result.crewMult *= e.crewMult;
    }
  }
  // C.6b: unassigned stations apply penalty (encourage full roster on larger ships)
  for (const station of CREW.stations ?? []) {
    const max = slots[station] ?? 0;
    if (max <= 0) continue;
    const filled = fillCounts[station] ?? 0;
    if (filled > 0) continue;
    const keys = STATION_TO_EFFECT_KEYS[station];
    if (keys) for (const k of keys) result[k] *= unassignedPenalty;
  }
  // C.6: morale scales all station effects (low morale = reduced effectiveness)
  for (const k of Object.keys(result)) {
    result[k] *= moraleMult;
  }
  return result;
}

/** C.6: Average morale of crew (0–1). Used to scale station effects. */
export function getAverageMorale(roster) {
  const arr = roster ?? [];
  if (arr.length === 0) return CREW.moraleBaseline ?? 1;
  const sum = arr.reduce((a, c) => a + (c.morale ?? CREW.moraleBaseline ?? 1), 0);
  return Math.max(CREW.moraleMin ?? 0.2, Math.min(CREW.moraleMax ?? 1, sum / arr.length));
}

/** C.6: Decay morale during voyage. C.6c: faster decay when undercrewed. */
export function updateMoraleDecay(roster, dt, maxCrew = null) {
  const arr = roster ?? [];
  if (arr.length === 0) return;
  const baseRate = CREW.moraleDecayPerSecond ?? 0.0015;
  const mult = CREW.undercrewedMoraleDecayMult ?? 1.5;
  const threshold = CREW.undercrewedThreshold ?? 0.5;
  const max = maxCrew ?? arr.length;
  const ratio = max > 0 ? arr.length / max : 1;
  const rate = ratio < threshold ? baseRate * mult : baseRate;
  const delta = rate * dt;
  for (const c of arr) {
    c.morale = Math.max(CREW.moraleMin ?? 0.2, (c.morale ?? 1) - delta);
  }
}

/** C.6: Boost morale on combat victory. */
export function applyVictoryMoraleBoost(roster) {
  const gain = CREW.moraleVictoryGain ?? 0.1;
  for (const c of roster ?? []) {
    c.morale = Math.min(CREW.moraleMax ?? 1, (c.morale ?? 1) + gain);
  }
}

/** C.6: Serve rum from cargo to raise crew morale. Consumes 1 rum. Returns true if served. */
export function serveRum(roster, cargo) {
  const rumId = CREW.rumGoodId ?? 'rum';
  const qty = cargo?.[rumId] ?? 0;
  if (qty < 1 || !roster?.length) return false;
  cargo[rumId] = qty - 1;
  if (cargo[rumId] <= 0) delete cargo[rumId];
  const gain = CREW.moraleRumGain ?? 0.2;
  for (const c of roster) {
    c.morale = Math.min(CREW.moraleMax ?? 1, (c.morale ?? 1) + gain);
  }
  return true;
}

/** Station display names */
export const STATION_NAMES = {
  helmsman: 'Helmsman',
  gunner_port: 'Gunner (Port)',
  gunner_starboard: 'Gunner (Starboard)',
  carpenter: 'Carpenter',
  navigator: 'Navigator',
  sailing: 'Sailing',
  bilge: 'Bilge',
  man_at_arms: 'Man at Arms',
};
