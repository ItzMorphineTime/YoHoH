/**
 * YoHoH — CrewUI: standalone crew-management overlay (Port_Improvements.md §5)
 *
 * Reachable from any game state (OVERWORLD, SAILING, COMBAT, PORT). Renders the
 * crew roster, station assignments, morale, station fill chips, and the
 * Serve Rum action. Hiring and Dismissing are gated to docked state.
 *
 * The overlay is non-modal — opening it during sailing or combat does not pause
 * gameplay. (Optional pause-on-open could be added later behind a CREW config.)
 *
 * State is read from a small host contract so this class stays decoupled from
 * Game internals:
 *   host.getCrewRoster() → Crew[]
 *   host.getShipClassId() → string
 *   host.getPlayerCargo() → { goodId: qty }
 *   host.getMaxCrew() → number
 *   host.isAtPort() → boolean
 *   host.getHireCost() → number              (only used when at port)
 *   host.getGold() → number                  (only used when at port)
 *   host.onAssignStation(crewId, station)
 *   host.onDismissCrew(crewId)
 *   host.onServeRum()
 *   host.onHireCrew()
 *
 * All mutation paths funnel through these callbacks so the same UI works
 * whether the request is fulfilled by PortController (in port) or directly
 * by CrewController (at sea).
 */

import { CREW } from '../config.js';
import {
  getStationFillInfo,
  getAssignableStationsForCrew,
  getAverageMorale,
  STATION_NAMES,
} from '../systems/CrewSystem.js';
import { esc } from '../utils/escapeHtml.js';

export class CrewUI {
  /**
   * @param {{ host: any }} deps
   */
  constructor({ host }) {
    this.host = host;
    this.overlay = null;
    this.toggleBtn = null;
    this._visible = false;
    this._boundKeydown = null;
  }

  init() {
    this.overlay = document.getElementById('crew-overlay');
    this.toggleBtn = document.getElementById('crew-toggle-btn');
    if (!this.overlay) return;

    // Header buttons
    this.overlay.querySelector('.crew-close-btn')?.addEventListener('click', () => this.hide());
    this.overlay.querySelector('#crew-serve-rum')?.addEventListener('click', () => this._onServeRum());
    this.overlay.querySelector('#crew-hire-btn')?.addEventListener('click', () => this._onHire());

    // Floating toggle button
    this.toggleBtn?.addEventListener('click', () => this.toggle());

    // Global K + Esc keybinds. Esc only closes if overlay is open.
    this._boundKeydown = (e) => {
      if (e.key === 'Escape' && this._visible) {
        e.preventDefault();
        this.hide();
        return;
      }
      // K toggles, but only when no text input has focus and no other modal is open.
      if ((e.key === 'k' || e.key === 'K') && !this._isTypingInInput() && !this._anotherModalOpen()) {
        e.preventDefault();
        this.toggle();
      }
    };
    document.addEventListener('keydown', this._boundKeydown);
  }

  /** Programmatic visibility helpers. */
  show() {
    if (!this.overlay) return;
    this._visible = true;
    this.overlay.classList.add('visible');
    document.body.classList.add('crew-open');
    this.update();
  }
  hide() {
    if (!this.overlay) return;
    this._visible = false;
    this.overlay.classList.remove('visible');
    document.body.classList.remove('crew-open');
  }
  toggle() { this._visible ? this.hide() : this.show(); }
  isVisible() { return this._visible; }

  /** Refresh the overlay against current host state. Safe to call when hidden. */
  update() {
    if (!this.overlay) return;
    const roster = this.host?.getCrewRoster?.() ?? [];
    const shipClassId = this.host?.getShipClassId?.() ?? 'sloop';
    const cargo = this.host?.getPlayerCargo?.() ?? {};
    const maxCrew = this.host?.getMaxCrew?.() ?? CREW.maxCrew ?? 20;
    const atPort = !!this.host?.isAtPort?.();
    const fillInfo = getStationFillInfo(roster, shipClassId);
    const avgMorale = getAverageMorale(roster);

    // Header summary
    const countEl = this.overlay.querySelector('#crew-count');
    const maxEl = this.overlay.querySelector('#crew-max');
    const moraleEl = this.overlay.querySelector('#crew-morale-value');
    if (countEl) countEl.textContent = String(roster.length);
    if (maxEl) maxEl.textContent = String(maxCrew);
    if (moraleEl) moraleEl.textContent = roster.length ? `${Math.round(avgMorale * 100)}%` : '—';

    // Serve Rum button
    const rumGoodId = CREW.rumGoodId ?? 'rum';
    const rumQty = cargo?.[rumGoodId] ?? 0;
    const serveBtn = this.overlay.querySelector('#crew-serve-rum');
    if (serveBtn) {
      serveBtn.disabled = rumQty < 1 || roster.length === 0;
      serveBtn.textContent = `Serve Rum (${rumQty})`;
    }

    // Station chips
    const stationOverviewEl = this.overlay.querySelector('#crew-station-overview');
    if (stationOverviewEl) {
      const stations = CREW.stations ?? [];
      stationOverviewEl.innerHTML = stations.map(s => {
        const info = fillInfo[s];
        const filled = info?.filled ?? 0;
        const slots = info?.slots ?? 1;
        const isFilled = filled >= slots && slots > 0;
        const isEmpty = filled === 0;
        const chipClass = isFilled ? 'filled' : (isEmpty ? 'empty' : '');
        const name = STATION_NAMES[s] ?? s;
        return `<span class="crew-station-chip ${chipClass}" title="${esc(name)}">${esc(name)}: ${filled}/${slots}</span>`;
      }).join('');
    }

    // Roster
    const rosterEl = this.overlay.querySelector('#crew-roster');
    if (rosterEl) {
      if (roster.length === 0) {
        rosterEl.innerHTML = '<p class="crew-empty">No crew aboard. Hire sailors at a tavern.</p>';
      } else {
        rosterEl.innerHTML = roster.map(c => {
          const assignable = getAssignableStationsForCrew(roster, shipClassId, c.id);
          const stationOpts = [
            { value: '', label: '— Unassigned —' },
            ...assignable.map(s => {
              const info = fillInfo[s];
              const slotLabel = info?.slots > 1 ? ` (${info?.filled ?? 0}/${info.slots})` : '';
              return { value: s, label: `${STATION_NAMES[s] ?? s}${slotLabel}` };
            }),
          ].map(o => {
            const sel = c.station === o.value ? ' selected' : '';
            return `<option value="${esc(o.value)}"${sel}>${esc(o.label)}</option>`;
          }).join('');
          const morale = Math.round((c.morale ?? 1) * 100);
          let moraleClass = '';
          if (morale < 40) moraleClass = ' crit';
          else if (morale < 70) moraleClass = ' low';
          return `
            <div class="crew-roster-item" data-crew-id="${esc(c.id)}">
              <span class="crew-name">${esc(c.name)}</span>
              <span class="crew-morale-pill${moraleClass}" title="Morale">${morale}%</span>
              <select class="crew-station-select" data-crew-id="${esc(c.id)}">
                ${stationOpts}
              </select>
              <button type="button" class="crew-dismiss-btn" data-crew-id="${esc(c.id)}" ${atPort ? '' : 'disabled'} title="${atPort ? 'Dismiss crew' : 'Can only dismiss while docked'}">Dismiss</button>
            </div>
          `;
        }).join('');
        // Rebind per-row handlers
        rosterEl.querySelectorAll('.crew-station-select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const crewId = e.target.dataset.crewId;
            const val = e.target.value;
            this.host?.onAssignStation?.(crewId, val || null);
          });
        });
        rosterEl.querySelectorAll('.crew-dismiss-btn:not(:disabled)').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const crewId = e.currentTarget.dataset.crewId;
            if (crewId) this.host?.onDismissCrew?.(crewId);
          });
        });
      }
    }

    // Port-only actions row
    const portActionsEl = this.overlay.querySelector('#crew-port-actions');
    const hireBtn = this.overlay.querySelector('#crew-hire-btn');
    const hint = this.overlay.querySelector('.crew-port-hint');
    if (hireBtn) {
      const hireCost = this.host?.getHireCost?.() ?? CREW.hireCost ?? 25;
      const gold = this.host?.getGold?.() ?? 0;
      hireBtn.textContent = `Hire Crew (${hireCost} gold)`;
      hireBtn.disabled = !atPort || gold < hireCost || roster.length >= maxCrew;
      hireBtn.style.display = atPort ? '' : 'none';
    }
    if (hint) hint.style.display = atPort ? 'none' : '';
    if (portActionsEl) portActionsEl.classList.toggle('at-sea', !atPort);
  }

  // ─── private ──────────────────────────────────────────────────────────────

  _onServeRum() {
    this.host?.onServeRum?.();
    this.update();
  }

  _onHire() {
    this.host?.onHireCrew?.();
    this.update();
  }

  /** Avoid hijacking K while the user is typing into a text input. */
  _isTypingInInput() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  }

  /** Avoid opening crew over the chart screen / settings / port etc. */
  _anotherModalOpen() {
    const chartOverlay = document.getElementById('map-charting-overlay');
    if (chartOverlay?.classList?.contains('visible')) return true;
    const settings = document.getElementById('settings-modal');
    if (settings?.classList?.contains('visible')) return true;
    // Port overlay handles its own UX; allow crew to open OVER port so the
    // player can use the same overlay to micromanage there too.
    return false;
  }
}
