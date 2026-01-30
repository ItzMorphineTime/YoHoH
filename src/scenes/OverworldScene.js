/**
 * YoHoH — Overworld scene: procedural archipelago map, islands, routes, travel
 * GDD §7.1: graph of islands connected by routes; click-to-travel
 * Uses SailingSystem for player-controlled sailing along route corridor
 */

import { createShip } from '../entities/ships.js';
import { SailingSystem } from '../systems/SailingSystem.js';
import { getStationEffects } from '../systems/CrewSystem.js';
import { generateMap } from '../map/MapGenerator.js';
import { deserialize, serialize } from '../map/MapSerializer.js';
import { OVERWORLD, OVERWORLD_RENDER, SAILING, SAILING_RENDER } from '../config.js';

export class OverworldScene {
  constructor() {
    this.map = null;
    this.currentIsland = null;
    this.travelRoute = null;
    this.sailingShip = null;
    this.shipPosition = { x: 0, y: 0 };
  }

  init(mapData = null) {
    if (mapData) {
      this.map = deserialize(mapData);
      this.currentIsland = this.map.homeNode;
    } else {
      this.map = generateMap({
        numIslands: OVERWORLD.numIslands,
        expansionDistance: OVERWORLD.expansionDistance,
        seed: Math.floor(Math.random() * OVERWORLD.seedMax),
      });
      this.currentIsland = this.map.homeNode;
    }
    this.currentIsland = this.map.homeNode;
    this.travelRoute = null;
    this.sailingShip = null;
    this._updateShipPosition();
  }

  /** Serialize current map for save */
  serializeMap() {
    return this.map ? serialize(this.map) : null;
  }

  /** Load map from serialized JSON */
  loadMap(json) {
    try {
      this.map = deserialize(json);
      this.currentIsland = this.map.homeNode;
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

  update(dt, input) {
    if (this.travelRoute && this.sailingShip) {
      const { a, b } = this.travelRoute;
      const origin = a === this.currentIsland ? a : b;
      const dest = a === this.currentIsland ? b : a;
      const corridorWidth = SAILING_RENDER?.corridorWidth ?? OVERWORLD_RENDER?.sailingCorridorWidth ?? OVERWORLD.sailingCorridorWidth;
      const corridor = {
        a: { x: origin.position.x, y: origin.position.y },
        b: { x: dest.position.x, y: dest.position.y },
        width: corridorWidth,
      };
      const arrived = SailingSystem.updateInCorridor(this.sailingShip, input, dt, corridor);
      this.sailingShip.updateBilge(dt, this.sailingShip._stationEffects?.bilgePumpMult ?? 1);
      this.sailingShip.repairTick(dt, this.sailingShip._stationEffects?.repairMult ?? 1, this.sailingShip._stationEffects?.leakRepairMult ?? 1);
      this.shipPosition.x = this.sailingShip.x;
      this.shipPosition.y = this.sailingShip.y;

      if (arrived || this.sailingShip.dead) {
        this._lastArrivedShipState = this._extractShipState(this.sailingShip);
        this.currentIsland = dest;
        this.travelRoute = null;
        this.sailingShip = null;
        this._updateShipPosition();
      }
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

  /** Get last arrived ship state (for Game to persist). Clears after read. */
  consumeLastArrivedShipState() {
    const s = this._lastArrivedShipState ?? null;
    this._lastArrivedShipState = null;
    return s;
  }

  /** Start travel along route from current island to target. Uses SailingSystem for player control. */
  startTravel(targetIsland, crewRoster = [], shipClassId = 'sloop', shipState = null) {
    if (this.travelRoute) return false;
    if (!this.currentIsland) return false;
    const edge = this._findEdge(this.currentIsland, targetIsland);
    if (!edge) return false;
    this.travelRoute = edge;
    const dx = targetIsland.position.x - this.currentIsland.position.x;
    const dy = targetIsland.position.y - this.currentIsland.position.y;
    const stateOpts = shipState ? {
      hull: shipState.hull,
      sails: shipState.sails,
      crew: shipState.crew,
      bilgeWater: shipState.bilgeWater,
      leaks: shipState.leaks,
    } : {};
    this.sailingShip = createShip(shipClassId, {
      x: this.currentIsland.position.x,
      y: this.currentIsland.position.y,
      rotation: Math.atan2(dx, dy),
      isPlayer: true,
      useSailing: true,
      ...stateOpts,
    });
    this.sailingShip.setStationEffects(getStationEffects(crewRoster, shipClassId));
    return true;
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

  /** Get route info for UI: destination name, distance, danger level */
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
    };
  }
}
