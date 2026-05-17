/**
 * YoHoH — Overworld scene: procedural archipelago map, islands, routes, travel
 * GDD §7.1: graph of islands connected by routes; click-to-travel
 * Uses SailingSystem for player-controlled sailing along route corridor
 */

import { createShip } from '../entities/ships.js';
import { SailingSystem } from '../systems/SailingSystem.js';
import { getStationEffects } from '../systems/CrewSystem.js';
import { getCreateShipOptsFromUpgrades, getCargoLoadPenalty, getCargoCapacityWithUpgrades } from '../utils/upgrades.js';
import { generateMap } from '../map/MapGenerator.js';
import { deserialize, serialize } from '../map/MapSerializer.js';
import { getRouteModifiers } from '../utils/routeModifiers.js';
import { OVERWORLD, OVERWORLD_RENDER, SAILING, SAILING_RENDER, ARRIVAL, ROUTE_MODIFIER_EFFECTS, CARGO_LOAD } from '../config.js';
import { getGoods } from '../systems/EconomySystem.js';

export class OverworldScene {
  constructor() {
    this.map = null;
    this.currentIsland = null;
    this.travelRoute = null;
    this.sailingShip = null;
    this.shipPosition = { x: 0, y: 0 };
  }

  init(mapData = null, currentIslandId = null) {
    if (mapData) {
      this.map = deserialize(mapData);
      this.currentIsland = this._getNodeById(currentIslandId) ?? this.map.homeNode;
    } else {
      this.map = generateMap({
        numIslands: OVERWORLD.numIslands,
        expansionDistance: OVERWORLD.expansionDistance,
        seed: Math.floor(Math.random() * OVERWORLD.seedMax),
      });
      this.currentIsland = this.map.homeNode;
    }
    this.travelRoute = null;
    this.sailingShip = null;
    this._updateShipPosition();
  }

  /** Get node by id (for save/load). */
  _getNodeById(id) {
    if (id == null || !this.map?.nodes) return null;
    return this.map.nodes.find(n => n.id === id) ?? null;
  }

  /** Serialize current map for save */
  serializeMap() {
    return this.map ? serialize(this.map) : null;
  }

  /** Load map from serialized JSON. Optionally set current island by id. */
  loadMap(json, currentIslandId = null) {
    try {
      this.map = deserialize(json);
      this.currentIsland = (currentIslandId != null && this._getNodeById(currentIslandId))
        ? this._getNodeById(currentIslandId)
        : this.map.homeNode;
      this.travelRoute = null;
      this.sailingShip = null;
      this._updateShipPosition();
      return true;
    } catch (e) {
      console.error('Failed to load map:', e);
      return false;
    }
  }

  _updateShipPosition() {
    if (this.currentIsland) {
      this.shipPosition.x = this.currentIsland.position.x;
      this.shipPosition.y = this.currentIsland.position.y;
    }
  }

  /**
   * Advance the scene one tick. Returns a non-null `arrivedShipState` on the
   * single frame the ship completes a voyage (so callers can persist hull/sails/
   * leaks across the OVERWORLD ↔ PORT transition). Returns null otherwise.
   * (Improvements.md §4.3)
   * @returns {Object|null}
   */
  update(dt, input) {
    if (!(this.travelRoute && this.sailingShip)) return null;

    const { a, b } = this.travelRoute;
    const origin = a === this.currentIsland ? a : b;
    const dest = a === this.currentIsland ? b : a;
    let corridorWidth = SAILING_RENDER?.corridorWidth ?? OVERWORLD_RENDER?.sailingCorridorWidth ?? OVERWORLD.sailingCorridorWidth;

    // Sailing_Improvements.md §4.3: apply route modifiers as live gameplay effects.
    // Cache base physics on the ship once so we can restore-and-reapply each tick
    // without "ratcheting" (otherwise multipliers stack on themselves).
    this._applyRouteModifiers(dt, corridorWidth);
    corridorWidth = this._modifiedCorridorWidth ?? corridorWidth;

    const corridor = {
      a: { x: origin.position.x, y: origin.position.y },
      b: { x: dest.position.x, y: dest.position.y },
      width: corridorWidth,
      wind: this.map?.wind ?? null, // Sailing_Improvements.md §4.1
    };
    const arrived = SailingSystem.updateInCorridor(this.sailingShip, input, dt, corridor);
    this.sailingShip.updateBilge(dt, this.sailingShip._stationEffects?.bilgePumpMult ?? 1);
    this.sailingShip.repairTick(dt, this.sailingShip._stationEffects?.repairMult ?? 1, this.sailingShip._stationEffects?.leakRepairMult ?? 1);
    this.shipPosition.x = this.sailingShip.x;
    this.shipPosition.y = this.sailingShip.y;

    if (arrived || this.sailingShip.dead) {
      const arrivedShipState = this._extractShipState(this.sailingShip);
      this.currentIsland = dest;
      this.travelRoute = null;
      this.sailingShip = null;
      this._modifiedCorridorWidth = null;
      this._routeBasePhysics = null;
      this._updateShipPosition();
      return arrivedShipState;
    }
    return null;
  }

  /**
   * Sailing_Improvements.md §4.3: re-apply route modifier multipliers to ship
   * physics (thrust, maxSpeed) and tick ongoing effects (hull wear, bilge from
   * shoals). Modifiers stack multiplicatively.
   */
  _applyRouteModifiers(dt, baseCorridorWidth) {
    const ship = this.sailingShip;
    const edge = this.travelRoute;
    if (!ship || !edge) return;
    // Cache the ship's untouched base physics so we can recompute cleanly each tick.
    if (!this._routeBasePhysics || this._routeBasePhysics.shipRef !== ship) {
      this._routeBasePhysics = {
        shipRef: ship,
        thrust: ship.thrust,
        maxSpeed: ship.maxSpeed,
        friction: ship.friction,
      };
    }
    const base = this._routeBasePhysics;
    let thrustMult = 1, maxSpeedMult = 1, frictionTarget = base.friction;
    let corridorWidthMult = 1, hullDmgPerSec = 0, bilgePerSec = 0;
    const mods = getRouteModifiers(edge) ?? [];
    for (const m of mods) {
      const eff = ROUTE_MODIFIER_EFFECTS[m];
      if (!eff) continue;
      if (eff.thrustMult) thrustMult *= eff.thrustMult;
      if (eff.maxSpeedMult) maxSpeedMult *= eff.maxSpeedMult;
      if (eff.frictionPower != null) frictionTarget = Math.min(frictionTarget, eff.frictionPower);
      if (eff.corridorWidthMult) corridorWidthMult *= eff.corridorWidthMult;
      if (eff.hullDamagePerSecond) hullDmgPerSec += eff.hullDamagePerSecond;
      if (eff.bilgeWaterPerSecond) bilgePerSec += eff.bilgeWaterPerSecond;
    }
    ship.thrust = base.thrust * thrustMult;
    ship.maxSpeed = base.maxSpeed * maxSpeedMult;
    ship.friction = frictionTarget;
    this._modifiedCorridorWidth = baseCorridorWidth * corridorWidthMult;
    // Ongoing damage / bilge intake from the route
    if (hullDmgPerSec > 0 && !ship.dead) {
      ship.hull = Math.max(0, ship.hull - hullDmgPerSec * dt);
      if (ship.hull <= 0) ship.dead = true;
    }
    if (bilgePerSec > 0) {
      ship.bilgeWater = Math.min(ship.bilgeWaterMax ?? 100, (ship.bilgeWater ?? 0) + bilgePerSec * dt);
    }
  }

  getMap() {
    return this.map;
  }

  getCurrentIsland() {
    return this.currentIsland;
  }

  getShipPosition() {
    return this.shipPosition;
  }

  isTraveling() {
    return !!this.travelRoute;
  }

  /**
   * Sailing_Improvements.md §2.3: true when the ship has crossed the arrival
   * approach line (last ~15% of the corridor by default) but hasn't yet
   * auto-arrived. Lets the HUD show a "press F to dock" affordance.
   */
  isApproachingDestination() {
    const info = this.getVoyageInfo();
    if (!info) return false;
    const threshold = ARRIVAL?.approachFraction ?? 0.85;
    return info.progress >= threshold;
  }

  /**
   * Force-finalise the current voyage at the destination. Returns the same
   * arrivedShipState payload that `update()` would have returned on the
   * arrival frame; or null if not traveling. (Sailing_Improvements.md §2.3)
   */
  earlyDock() {
    if (!this.travelRoute || !this.sailingShip) return null;
    const { a, b } = this.travelRoute;
    const dest = a === this.currentIsland ? b : a;
    const arrivedShipState = this._extractShipState(this.sailingShip);
    this.currentIsland = dest;
    this.travelRoute = null;
    this.sailingShip = null;
    this._updateShipPosition();
    return arrivedShipState;
  }

  /**
   * Return a snapshot of the current voyage for HUD use, or null when idle.
   * (Sailing_Improvements.md §2.1)
   *   destination       — { name, id }
   *   distanceRemaining — world units along the corridor centre-line
   *   distanceTotal     — total route length
   *   progress          — 0–1
   *   bearingRad        — heading TO destination (atan2(dx, dy) sailing convention)
   *   headingDeltaRad   — bearingRad − ship.rotation, wrapped to [-π, π]
   *   etaSec            — estimated seconds at current speed (null if drifting/zero/reverse)
   */
  getVoyageInfo() {
    if (!this.travelRoute || !this.sailingShip) return null;
    const { a, b } = this.travelRoute;
    const origin = a === this.currentIsland ? a : b;
    const dest = a === this.currentIsland ? b : a;
    const sx = this.sailingShip.x;
    const sy = this.sailingShip.y;
    const ox = origin.position.x;
    const oy = origin.position.y;
    const dx = dest.position.x - ox;
    const dy = dest.position.y - oy;
    const total = Math.sqrt(dx * dx + dy * dy);
    // Project ship onto the corridor centre-line to derive progress + remaining.
    const t = total > 0 ? ((sx - ox) * dx + (sy - oy) * dy) / (total * total) : 1;
    const clampedT = Math.max(0, Math.min(1, t));
    const progress = clampedT;
    const remaining = total * (1 - clampedT);
    // Bearing from ship to destination in the ship's coordinate convention
    // (forward = +Y at rotation=0 → ship moves by (sin r, cos r)).
    const sdx = dest.position.x - sx;
    const sdy = dest.position.y - sy;
    const bearing = Math.atan2(sdx, sdy);
    let headingDelta = bearing - (this.sailingShip.rotation ?? 0);
    // Wrap to [-π, π]
    headingDelta = ((headingDelta + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    const speed = this.sailingShip.speed ?? 0;
    const etaSec = speed > 0 ? remaining / speed : null;
    return {
      destination: { name: dest.name ?? `Island ${dest.id}`, id: dest.id },
      distanceRemaining: remaining,
      distanceTotal: total,
      progress,
      bearingRad: bearing,
      headingDeltaRad: headingDelta,
      etaSec,
    };
  }

  /** Extract ship state for persistence (arrival, port, save). */
  _extractShipState(ship) {
    if (!ship) return null;
    return {
      hull: ship.hull,
      hullMax: ship.hullMax,
      sails: ship.sails,
      sailMax: ship.sailMax,
      crew: ship.crew,
      crewMax: ship.crewMax,
      bilgeWater: ship.bilgeWater,
      bilgeWaterMax: ship.bilgeWaterMax,
      leaks: ship.leaks,
    };
  }

  /** Start travel along route from current island to target. Uses SailingSystem for player control. */
  startTravel(targetIsland, crewRoster = [], shipClassId = 'sloop', shipState = null, upgrades = {}, cargo = null) {
    if (this.travelRoute) {
      if (typeof window !== 'undefined' && window.__yohohDebugLog) window.__yohohDebugLog(`startTravel BLOCKED: already traveling on [${this.travelRoute.a?.id}↔${this.travelRoute.b?.id}]`);
      return false;
    }
    if (!this.currentIsland) {
      if (typeof window !== 'undefined' && window.__yohohDebugLog) window.__yohohDebugLog('startTravel BLOCKED: no current island');
      return false;
    }
    const edge = this._findEdge(this.currentIsland, targetIsland);
    if (!edge) {
      if (typeof window !== 'undefined' && window.__yohohDebugLog) window.__yohohDebugLog(`startTravel BLOCKED: no edge between [${this.currentIsland.id}] and [${targetIsland?.id}]`);
      return false;
    }
    const dx = targetIsland.position.x - this.currentIsland.position.x;
    const dy = targetIsland.position.y - this.currentIsland.position.y;
    const stateOpts = shipState ? {
      hull: shipState.hull,
      sails: shipState.sails,
      crew: shipState.crew,
      bilgeWater: shipState.bilgeWater,
      leaks: shipState.leaks,
    } : {};
    const upgradeOpts = getCreateShipOptsFromUpgrades(upgrades, shipClassId, true);
    // Sailing_Improvements.md (debug): build everything first; commit travelRoute LAST so
    // a thrown exception in createShip / station effects can't leave us with travelRoute
    // set + sailingShip null (which would permanently block future startTravel calls).
    let newShip;
    try {
      newShip = createShip(shipClassId, {
        x: this.currentIsland.position.x,
        y: this.currentIsland.position.y,
        rotation: Math.atan2(dx, dy),
        isPlayer: true,
        useSailing: true,
        ...stateOpts,
        ...upgradeOpts,
      });
      newShip.setStationEffects(getStationEffects(crewRoster, shipClassId));
    } catch (err) {
      console.error('[OverworldScene.startTravel] failed to create sailing ship:', err);
      return false;
    }
    this.sailingShip = newShip;
    this.travelRoute = edge;
    this._routeBasePhysics = null; // force per-ship base physics rebuild
    this._modifiedCorridorWidth = null;
    // Sailing_Improvements.md §4.4: cargo overload — applied once at start, then
    // stored as a pre-modifier baseline (route-modifier code respects it via
    // _routeBasePhysics).
    if (cargo) this._applyCargoLoadPenalty(cargo, shipClassId, upgrades);
    if (typeof window !== 'undefined' && window.__yohohDebugLog) {
      window.__yohohDebugLog(`startTravel OK: [${this.currentIsland.id}→${targetIsland?.id}] ship maxSpeed=${newShip.maxSpeed.toFixed(3)} thrust=${newShip.thrust.toFixed(3)}`);
    }
    return true;
  }

  /** Sailing_Improvements.md §4.4: apply a one-shot cargo-load penalty to the sailing ship. */
  _applyCargoLoadPenalty(cargo, shipClassId, upgrades) {
    if (!this.sailingShip || !cargo) return;
    const cap = getCargoCapacityWithUpgrades(shipClassId, upgrades);
    if (!(cap > 0)) return;
    const goods = getGoods();
    let used = 0;
    for (const [goodId, qty] of Object.entries(cargo)) {
      if (qty <= 0) continue;
      const good = goods.find(g => g.id === goodId);
      used += (good?.unitSize ?? 1) * qty;
    }
    const ratio = used / cap;
    const { maxSpeedMult, turnRateMult } = getCargoLoadPenalty(ratio, CARGO_LOAD);
    this.sailingShip.maxSpeed *= maxSpeedMult;
    this.sailingShip.thrust *= maxSpeedMult; // keep accel proportional
    this.sailingShip.turnRate *= turnRateMult;
    // Stash for the HUD/tooltip if we want to surface it later.
    this.sailingShip._cargoLoadInfo = { ratio, maxSpeedMult, turnRateMult };
  }

  _findEdge(a, b) {
    if (!this.map) return null;
    for (const edge of this.map.edges) {
      if ((edge.a === a && edge.b === b) || (edge.a === b && edge.b === a)) {
        return edge;
      }
    }
    return null;
  }

  /** Get island at screen position (for click detection) */
  getIslandAtPosition(worldX, worldY, scale = 1) {
    if (!this.map) return null;
    const threshold = 15 * scale;
    let closest = null;
    let closestDist = Infinity;
    for (const node of this.map.nodes) {
      const dx = worldX - node.position.x;
      const dy = worldY - node.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold && dist < closestDist) {
        closestDist = dist;
        closest = node;
      }
    }
    return closest;
  }

  /** Get route (edge) near click position — ONLY routes from current island */
  getRouteNearPosition(worldX, worldY, scale = 1) {
    if (!this.map || this.travelRoute || !this.currentIsland) return null;
    const threshold = (OVERWORLD.routeClickThreshold ?? 12) * scale;
    let closest = null;
    let closestDist = Infinity;
    for (const edge of this.map.edges) {
      const { a, b } = edge;
      if (a !== this.currentIsland && b !== this.currentIsland) continue;
      const dist = this._pointToSegmentDist(worldX, worldY, a.position.x, a.position.y, b.position.x, b.position.y);
      if (dist < threshold && dist < closestDist) {
        closestDist = dist;
        closest = edge;
      }
    }
    return closest;
  }

  /** Get routes connected to current island (for highlighting) */
  getConnectedRoutes() {
    if (!this.map || !this.currentIsland) return [];
    return this.map.edges.filter(e => e.a === this.currentIsland || e.b === this.currentIsland);
  }

  _pointToSegmentDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (len * len)));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }

  /** Click handler: if on route FROM current island, start travel to the other island */
  handleClick(worldX, worldY, scale = 1) {
    const route = this.getRouteNearPosition(worldX, worldY, scale);
    if (!route) return false;
    const { a, b } = route;
    const target = a === this.currentIsland ? b : b === this.currentIsland ? a : null;
    if (!target) return false;
    return this.startTravel(target);
  }

  getDestinationIsland() {
    if (!this.travelRoute) return null;
    const { a, b } = this.travelRoute;
    return a === this.currentIsland ? b : a;
  }

  getSailingShip() {
    return this.sailingShip;
  }

  /** Cancel travel (e.g. on defeat) — stay at current island */
  cancelTravel() {
    this.travelRoute = null;
    this.sailingShip = null;
    this._updateShipPosition();
  }

  /** Get route info for UI: destination name, distance, danger level, modifiers (B.4) */
  getRouteInfo(edge) {
    if (!edge) return null;
    const dest = edge.a === this.currentIsland ? edge.b : edge.a;
    const dx = dest.position.x - this.currentIsland.position.x;
    const dy = dest.position.y - this.currentIsland.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return {
      destination: dest.name || `Island ${dest.id}`,
      distance: Math.round(dist),
      dangerous: dest.dangerous,
      appealing: dest.appealing,
      portType: dest.portType || 'none',
      modifiers: getRouteModifiers(edge),
    };
  }
}
