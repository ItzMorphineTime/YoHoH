/**
 * YoHoH — Port scene: docked at island
 * B.9: Market, Shipwright (repairs), Tavern (hire crew)
 * C.2: Tavern UI for hiring crew
 */

import { assignStation, unassignStation } from '../systems/CrewSystem.js';
import { SHIP_CLASSES, REPAIR } from '../config.js';
import { getGoods, getBuyPrice, getSellPrice } from '../systems/EconomySystem.js';

export class PortScene {
  constructor() {
    this.currentIsland = null;
    this.crewRoster = [];
    this.shipClassId = null;
    this.shipState = null;
    this.cargo = {}; // { goodId: quantity }
    this.activeTab = 'tavern';
  }

  init(island, crewRoster = [], gold = 0, shipClassId = null, shipState = null, cargo = {}) {
    this.currentIsland = island;
    this.crewRoster = Array.isArray(crewRoster) ? [...crewRoster] : [];
    this.gold = gold;
    this.shipClassId = shipClassId ?? 'sloop';
    this.shipState = shipState ? { ...shipState } : this._defaultShipState();
    this.cargo = typeof cargo === 'object' && cargo !== null ? { ...cargo } : {};
    this.activeTab = 'tavern';
  }

  getCargo() {
    return { ...this.cargo };
  }

  getCargoCapacity() {
    const cls = SHIP_CLASSES?.[this.shipClassId];
    return cls?.cargoCapacity ?? 20;
  }

  getCargoUsed() {
    const goods = getGoods();
    let used = 0;
    for (const [goodId, qty] of Object.entries(this.cargo)) {
      if (qty <= 0) continue;
      const good = goods.find(g => g.id === goodId);
      used += (good?.unitSize ?? 1) * qty;
    }
    return used;
  }

  buyGood(goodId) {
    const goods = getGoods();
    const good = goods.find(g => g.id === goodId);
    if (!good) return false;
    const price = getBuyPrice(goodId, this.currentIsland);
    if (this.gold < price) return false;
    const unitSize = good.unitSize ?? 1;
    const capacity = this.getCargoCapacity();
    const used = this.getCargoUsed();
    if (used + unitSize > capacity) return false;
    this.gold -= price;
    this.cargo[goodId] = (this.cargo[goodId] ?? 0) + 1;
    return true;
  }

  sellGood(goodId) {
    const qty = this.cargo[goodId] ?? 0;
    if (qty <= 0) return false;
    const price = getSellPrice(goodId, this.currentIsland);
    this.gold += price;
    this.cargo[goodId] = qty - 1;
    if (this.cargo[goodId] <= 0) delete this.cargo[goodId];
    return true;
  }

  _defaultShipState() {
    const cls = SHIP_CLASSES?.[this.shipClassId];
    return {
      hull: cls?.hullMax ?? 100,
      hullMax: cls?.hullMax ?? 100,
      sails: cls?.sailMax ?? 100,
      sailMax: cls?.sailMax ?? 100,
      crew: cls?.crewMax ?? 100,
      crewMax: cls?.crewMax ?? 100,
      bilgeWater: 0,
      bilgeWaterMax: cls?.bilgeWaterMax ?? 100,
      leaks: 0,
    };
  }

  getShipState() {
    return this.shipState ? { ...this.shipState } : null;
  }

  getShipClassId() {
    return this.shipClassId;
  }

  getMaxCrew() {
    return this._getMaxCrew();
  }

  getCurrentIsland() {
    return this.currentIsland;
  }

  getCrewRoster() {
    return this.crewRoster;
  }

  getGold() {
    return this.gold ?? 0;
  }

  setGold(value) {
    this.gold = Math.max(0, value);
  }

  getActiveTab() {
    return this.activeTab;
  }

  setActiveTab(tab) {
    if (['tavern', 'shipwright', 'market'].includes(tab)) {
      this.activeTab = tab;
    }
  }

  _getMaxCrew() {
    const cls = this.shipClassId && SHIP_CLASSES?.[this.shipClassId] ? SHIP_CLASSES[this.shipClassId] : null;
    return cls?.crewMax ?? 20;
  }

  /** Update ship state max values when ship class changes. */
  adaptShipStateToClass() {
    if (!this.shipState) return;
    const cls = SHIP_CLASSES?.[this.shipClassId];
    if (!cls) return;
    this.shipState.hullMax = cls.hullMax ?? this.shipState.hullMax;
    this.shipState.sailMax = cls.sailMax ?? this.shipState.sailMax;
    this.shipState.crewMax = cls.crewMax ?? this.shipState.crewMax;
    this.shipState.bilgeWaterMax = cls.bilgeWaterMax ?? this.shipState.bilgeWaterMax;
    this.shipState.hull = Math.min(this.shipState.hull, this.shipState.hullMax);
    this.shipState.sails = Math.min(this.shipState.sails, this.shipState.sailMax);
    this.shipState.crew = Math.min(this.shipState.crew, this.shipState.crewMax);
    this.shipState.bilgeWater = Math.min(this.shipState.bilgeWater, this.shipState.bilgeWaterMax);
  }

  /** Add crew to roster (after hire). Returns true if added. */
  addCrew(crew) {
    const maxCrew = this._getMaxCrew();
    if (!crew || (this.crewRoster?.length ?? 0) >= maxCrew) return false;
    this.crewRoster = this.crewRoster ?? [];
    this.crewRoster.push(crew);
    return true;
  }

  /** Assign crew to station */
  assignCrewToStation(crewId, station) {
    return assignStation(this.crewRoster, crewId, station, this.shipClassId);
  }

  /** Unassign crew from station */
  unassignCrew(crewId) {
    return unassignStation(this.crewRoster, crewId);
  }

  /** Remove crew from roster (dismiss). Returns true if removed. */
  removeCrew(crewId) {
    const idx = this.crewRoster?.findIndex(c => c.id === crewId);
    if (idx == null || idx < 0) return false;
    this.crewRoster.splice(idx, 1);
    return true;
  }

  /** Repair hull at shipwright. Returns cost paid or 0 if can't afford / full. */
  repairHull() {
    if (!this.shipState) return 0;
    const needed = this.shipState.hullMax - this.shipState.hull;
    if (needed <= 0) return 0;
    const costPer = REPAIR?.hullRepairCostPerPoint ?? 0.5;
    const cost = Math.ceil(needed * costPer);
    if (this.gold < cost) return 0;
    this.gold -= cost;
    this.shipState.hull = this.shipState.hullMax;
    return cost;
  }

  /** Repair sails at shipwright. Returns cost paid or 0. */
  repairSails() {
    if (!this.shipState) return 0;
    const needed = this.shipState.sailMax - this.shipState.sails;
    if (needed <= 0) return 0;
    const costPer = REPAIR?.sailRepairCostPerPoint ?? 0.3;
    const cost = Math.ceil(needed * costPer);
    if (this.gold < cost) return 0;
    this.gold -= cost;
    this.shipState.sails = this.shipState.sailMax;
    return cost;
  }

  /** Repair leaks at shipwright. Returns cost paid or 0. */
  repairLeaks() {
    if (!this.shipState) return 0;
    const leaks = Math.floor(this.shipState.leaks ?? 0);
    if (leaks <= 0) return 0;
    const costPer = REPAIR?.leakRepairCostPerLeak ?? 5;
    const cost = leaks * costPer;
    if (this.gold < cost) return 0;
    this.gold -= cost;
    this.shipState.leaks = 0;
    return cost;
  }
}
