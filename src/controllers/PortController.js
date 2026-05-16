/**
 * YoHoH — PortController (Improvements.md §5.1)
 *
 * Owns all port-screen event handlers (hire, assign, repair, buy/sell, upgrade,
 * serve rum, ship-class change). Extracted out of Game.js so the main game
 * loop is freer of pure-UI delegation.
 *
 * Player state lives on the host (Game); the controller talks to it via a
 * small set of accessors so the controller stays decoupled from Game's
 * internal field names. Player gold/cargo/upgrades flow through portScene
 * during the session and are synced back to host on leavePort().
 */

import { ECONOMY, INFAMY, CREW } from '../config.js';
import { hireCrew } from '../systems/CrewSystem.js';

/**
 * @typedef {Object} PortControllerHost
 * @property {() => number} getInfamy
 * @property {(value:number) => void} setInfamy
 * @property {() => string[]} getUnlockedShipClasses
 * @property {(value:string[]) => void} setUnlockedShipClasses
 * @property {(id:string) => void} setShipClass
 */

export class PortController {
  /**
   * @param {{ portScene: any, portUI: any, host: PortControllerHost }} deps
   */
  constructor({ portScene, portUI, host }) {
    this.portScene = portScene;
    this.portUI = portUI;
    this.host = host;
  }

  /** Wire UI callbacks. Idempotent. */
  bindUI() {
    const ui = this.portUI;
    ui.onLeavePort = () => this.host?.onLeavePort?.();
    ui.onHireCrew = () => this.onHireCrew();
    ui.onAssignStation = (crewId, station) => this.onAssignStation(crewId, station);
    ui.onShipClassChange = (id) => this.onShipClassChange(id);
    ui.onRepairHull = () => this.onRepairHull();
    ui.onRepairSails = () => this.onRepairSails();
    ui.onRepairLeaks = () => this.onRepairLeaks();
    ui.onBuyGood = (goodId) => this.onBuyGood(goodId);
    ui.onSellGood = (goodId) => this.onSellGood(goodId);
    ui.onDismissCrew = (crewId) => this.onDismissCrew(crewId);
    ui.onBuyUpgrade = (upgradeId) => this.onBuyUpgrade(upgradeId);
    ui.onServeRum = () => this.onServeRum();
  }

  // ─── Crew ─────────────────────────────────────────────────────────────────

  onHireCrew() {
    const maxCrew = this.portScene.getMaxCrew?.() ?? CREW?.maxCrew ?? 20;
    const result = hireCrew(this.portScene.getCrewRoster(), this.portScene.getGold(), undefined, maxCrew);
    if (!result) return;
    const { crew, cost } = result;
    this.portScene.addCrew(crew);
    this.portScene.setGold(this.portScene.getGold() - cost);
    this.portUI.update(this.portScene);
  }

  onAssignStation(crewId, station) {
    this.portScene.assignCrewToStation(crewId, station || null);
    this.portUI.update(this.portScene);
  }

  onDismissCrew(crewId) {
    if (this.portScene.removeCrew?.(crewId)) this.portUI.update(this.portScene);
  }

  // ─── Repairs ──────────────────────────────────────────────────────────────

  onRepairHull()  { if (this.portScene.repairHull?.())  this.portUI.update(this.portScene); }
  onRepairSails() { if (this.portScene.repairSails?.()) this.portUI.update(this.portScene); }
  onRepairLeaks() { if (this.portScene.repairLeaks?.()) this.portUI.update(this.portScene); }

  // ─── Market ───────────────────────────────────────────────────────────────

  onBuyGood(goodId) {
    if (this.portScene.buyGood?.(goodId)) this.portUI.update(this.portScene);
  }

  onSellGood(goodId) {
    const goldReceived = this.portScene.sellGood?.(goodId) ?? 0;
    if (goldReceived > 0) {
      const infamyGain = (INFAMY?.infamyPerGoldFromSale ?? 0.01) * goldReceived;
      const newInfamy = (this.host?.getInfamy?.() ?? 0) + infamyGain;
      this.host?.setInfamy?.(newInfamy);
      this.portScene.infamy = newInfamy;
      this.portUI.update(this.portScene);
    }
  }

  // ─── Upgrades & Rum ───────────────────────────────────────────────────────

  onBuyUpgrade(upgradeId) {
    if (this.portScene.buyUpgrade?.(upgradeId)) {
      this.portUI.update(this.portScene);
    }
  }

  onServeRum() {
    if (this.portScene.serveRum?.()) {
      this.portUI.update(this.portScene);
    }
  }

  // ─── Ship class change ────────────────────────────────────────────────────

  onShipClassChange(shipClassId) {
    const target = shipClassId ?? 'sloop';
    const unlocked = this.host?.getUnlockedShipClasses?.() ?? ['sloop'];
    const brigantineUnlock = INFAMY?.brigantineUnlock ?? 3;
    const galleonUnlock = INFAMY?.galleonUnlock ?? 5;
    const brigantineCost = INFAMY?.brigantineCost ?? 500;
    const galleonCost = INFAMY?.galleonCost ?? 1200;
    const infamy = this.host?.getInfamy?.() ?? 0;
    const gold = this.portScene.getGold?.() ?? 0;
    const revert = () => this.portUI.update(this.portScene);

    if (target === 'brigantine') {
      if (infamy < brigantineUnlock) return revert();
      if (!unlocked.includes('brigantine') && gold < brigantineCost) return revert();
      if (!unlocked.includes('brigantine')) {
        this.portScene.setGold(gold - brigantineCost);
        this.host?.setUnlockedShipClasses?.([...unlocked, 'brigantine']);
      }
    } else if (target === 'galleon') {
      if (infamy < galleonUnlock) return revert();
      if (!unlocked.includes('galleon') && gold < galleonCost) return revert();
      if (!unlocked.includes('galleon')) {
        this.portScene.setGold(gold - galleonCost);
        this.host?.setUnlockedShipClasses?.([...unlocked, 'galleon']);
      }
    }

    this.host?.setShipClass?.(target);
    this.portScene.shipClassId = target;
    this.portScene.unlockedShipClasses = this.host?.getUnlockedShipClasses?.() ?? unlocked;
    this.portScene.adaptShipStateToClass?.();
    this.portUI.update(this.portScene);
  }
}
