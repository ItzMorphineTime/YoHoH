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

/** Compute station effect multipliers for ship stats. Multiple crew per station stack multiplicatively. */
export function getStationEffects(roster, shipClassId = null) {
  const effects = CREW.stationEffects ?? {};
  const slots = getStationSlots(shipClassId);
  const fillCounts = getStationFillCounts(roster);
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
  return result;
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
