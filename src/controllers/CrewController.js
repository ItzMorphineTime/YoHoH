/**
 * YoHoH — CrewController (Port_Improvements.md §5)
 *
 * Mediates between the CrewUI overlay and the underlying systems:
 *   - Assign / dismiss / serve rum / hire requests
 *   - Recomputes the sailing ship's station effects on every change so that
 *     gameplay (turn rate, reload, sail speed, etc.) responds immediately —
 *     not just when arriving at port.
 *
 * Behaviour split by location:
 *   - At port (Game.state === PORT): mutations go through `portScene` (so gold
 *     accounting, dock-fee balance, etc. stay consistent). PortController is the
 *     authoritative path; CrewController forwards to it via `host.delegateToPort`.
 *   - At sea / overworld / combat: mutations operate directly on Game's
 *     `_crewRoster` and trigger a station-effects refresh.
 */

import { CREW } from '../config.js';
import {
  assignStation,
  unassignStation,
  serveRum as crewServeRum,
  hireCrew,
  createCrewMember,
  getStationEffects,
} from '../systems/CrewSystem.js';

/**
 * @typedef {Object} CrewControllerHost
 * @property {() => string} getState                          GAME_STATES value
 * @property {() => Array} getCrewRoster
 * @property {() => string} getShipClassId
 * @property {() => Object} getPlayerCargo
 * @property {() => number} getGold
 * @property {(v:number) => void} setGold
 * @property {() => Object|null} getSailingShip               null when not at sea
 * @property {() => Object|null} getCombatPlayerShip          null when not in combat
 * @property {() => Object|null} getPortScene                 only meaningful when state===PORT
 * @property {() => any} getPortController                    so we can delegate fully when at port
 * @property {(roster:Array) => void} setCrewRoster
 * @property {() => any} getCrewUI                            optional — to trigger UI refresh
 */

export class CrewController {
  /** @param {{ host: CrewControllerHost }} deps */
  constructor({ host }) {
    this.host = host;
  }

  // ─── Public API used by CrewUI ────────────────────────────────────────────

  isAtPort() {
    return this.host?.getState?.() === 'PORT';
  }

  /** Re-apply station effects to any active ship so changes take effect immediately. */
  refreshStationEffects() {
    const roster = this.host?.getCrewRoster?.() ?? [];
    const shipClassId = this.host?.getShipClassId?.() ?? 'sloop';
    const effects = getStationEffects(roster, shipClassId);
    const sailing = this.host?.getSailingShip?.();
    if (sailing?.setStationEffects) sailing.setStationEffects(effects);
    const combat = this.host?.getCombatPlayerShip?.();
    if (combat?.setStationEffects) combat.setStationEffects(effects);
  }

  /** Assign / unassign a crew member to a station. */
  onAssignStation(crewId, station) {
    if (this.isAtPort()) {
      const portCtl = this.host?.getPortController?.();
      portCtl?.onAssignStation?.(crewId, station);
    } else {
      const roster = this.host?.getCrewRoster?.() ?? [];
      const shipClassId = this.host?.getShipClassId?.() ?? null;
      assignStation(roster, crewId, station, shipClassId);
    }
    this.refreshStationEffects();
    this._refreshUI();
  }

  /** Dismiss a crew member. Port-only — guard at the UI layer too, but be defensive. */
  onDismissCrew(crewId) {
    if (!this.isAtPort()) return;
    const portCtl = this.host?.getPortController?.();
    portCtl?.onDismissCrew?.(crewId);
    this.refreshStationEffects();
    this._refreshUI();
  }

  /** Serve a unit of rum to raise crew morale. Works anywhere with rum in cargo. */
  onServeRum() {
    if (this.isAtPort()) {
      this.host?.getPortController?.()?.onServeRum?.();
    } else {
      const roster = this.host?.getCrewRoster?.() ?? [];
      const cargo = this.host?.getPlayerCargo?.() ?? {};
      crewServeRum(roster, cargo);
    }
    this.refreshStationEffects();
    this._refreshUI();
  }

  /** Hire crew — port-only. */
  onHireCrew() {
    if (!this.isAtPort()) return;
    this.host?.getPortController?.()?.onHireCrew?.();
    this.refreshStationEffects();
    this._refreshUI();
  }

  // ─── private ──────────────────────────────────────────────────────────────

  _refreshUI() {
    const ui = this.host?.getCrewUI?.();
    ui?.update?.();
    // Also refresh the port screen (when docked) so the Tavern panel reflects the change.
    if (this.isAtPort()) {
      const portScene = this.host?.getPortScene?.();
      const portUI = this.host?.getPortUI?.();
      if (portScene && portUI?.update) portUI.update(portScene);
    }
  }
}
