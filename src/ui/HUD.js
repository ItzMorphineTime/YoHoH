/**
 * YoHoH — HUD: heading arrow, speed bar, hull/sails, cannon status
 * GDD §8.1: heading arrow + speed bar + cannon arc preview
 */

import { CREW } from '../config.js';
import { getStationFillInfo, STATION_NAMES } from '../systems/CrewSystem.js';
import { esc } from '../utils/escapeHtml.js';

// Short-form labels for the sailing stations pill (Sailing_Improvements.md §2.5)
const STATION_SHORT = {
  helmsman: 'Helm',
  gunner_port: 'GunP',
  gunner_starboard: 'GunS',
  carpenter: 'Carp',
  navigator: 'Nav',
  sailing: 'Sail',
  bilge: 'Bilge',
  man_at_arms: 'Arms',
};

export class HUD {
  constructor(container) {
    this.container = container;
    this.elements = {};
  }

  init() {
    const hud = document.getElementById('hud');
    if (!hud) return;

    hud.innerHTML = `
      <div class="hud-panel hud-stats">
        <div class="hud-stat">
          <span class="hud-label">Hull</span>
          <div class="hud-bar"><div id="hud-hull-bar" class="hud-bar-fill"></div></div>
          <span id="hud-hull" class="hud-value">100</span>
        </div>
        <div class="hud-stat">
          <span class="hud-label">Sails</span>
          <div class="hud-bar"><div id="hud-sails-bar" class="hud-bar-fill"></div></div>
          <span id="hud-sails" class="hud-value">100</span>
        </div>
        <div class="hud-stat">
          <span class="hud-label">Speed</span>
          <div class="hud-bar"><div id="hud-speed-bar" class="hud-bar-fill"></div></div>
          <span id="hud-speed" class="hud-value">0</span>
        </div>
        <div class="hud-stat hud-stat-bilge">
          <span class="hud-label">Bilge</span>
          <div class="hud-bar"><div id="hud-bilge-bar" class="hud-bar-fill"></div></div>
          <span id="hud-bilge" class="hud-value">0</span>
        </div>
        <div class="hud-stat hud-stat-leaks">
          <span class="hud-label">Leaks</span>
          <span id="hud-leaks" class="hud-value">0</span>
        </div>
      </div>
      <div class="hud-panel hud-heading">
        <span class="hud-label">Heading</span>
        <div class="hud-compass">
          <span class="hud-compass-north" aria-hidden="true">N</span>
          <div id="hud-compass-needle"></div>
        </div>
      </div>
      <div class="hud-panel hud-controls">
        <span class="hud-key">Q</span> Port
        <span class="hud-key">E</span> Starboard
        <span id="hud-cannon-status" class="hud-cannon-status"></span>
      </div>
      <div class="hud-panel hud-mode">
        <span id="hud-mode">Combat</span>
      </div>
      <!-- Sailing_Improvements.md §2.1: voyage info panel — hidden in combat -->
      <div class="hud-panel hud-voyage" id="hud-voyage" style="display:none">
        <div class="hud-voyage-row">
          <span class="hud-voyage-label">To</span>
          <span id="hud-voyage-dest" class="hud-voyage-value">—</span>
        </div>
        <div class="hud-voyage-row">
          <span class="hud-voyage-label">Dist</span>
          <span id="hud-voyage-distance" class="hud-voyage-value">—</span>
        </div>
        <div class="hud-voyage-row">
          <span class="hud-voyage-label">ETA</span>
          <span id="hud-voyage-eta" class="hud-voyage-value">—</span>
        </div>
        <div class="hud-voyage-row">
          <span class="hud-voyage-label">Bearing</span>
          <span id="hud-voyage-bearing" class="hud-voyage-value">—</span>
        </div>
        <!-- Sailing_Improvements.md §4.1: wind effect on speed -->
        <div class="hud-voyage-row" id="hud-voyage-wind-row" style="display:none">
          <span class="hud-voyage-label">Wind</span>
          <span id="hud-voyage-wind" class="hud-voyage-value">—</span>
        </div>
        <!-- Sailing_Improvements.md §2.3: approaching destination prompt -->
        <div class="hud-voyage-dock-prompt" id="hud-voyage-dock" style="display:none">
          Approaching — press <kbd>F</kbd> to dock
        </div>
      </div>
      <!-- Sailing_Improvements.md §2.5: stations-active pill row (sailing only) -->
      <div class="hud-panel hud-stations" id="hud-stations" style="display:none">
        <span class="hud-stations-label">Stations</span>
        <div class="hud-stations-chips" id="hud-stations-chips"></div>
      </div>
    `;

    this.elements.hull = document.getElementById('hud-hull');
    this.elements.hullBar = document.getElementById('hud-hull-bar');
    this.elements.sails = document.getElementById('hud-sails');
    this.elements.sailsBar = document.getElementById('hud-sails-bar');
    this.elements.speed = document.getElementById('hud-speed');
    this.elements.speedBar = document.getElementById('hud-speed-bar');
    this.elements.bilge = document.getElementById('hud-bilge');
    this.elements.bilgeBar = document.getElementById('hud-bilge-bar');
    this.elements.leaks = document.getElementById('hud-leaks');
    this.elements.compassNeedle = document.getElementById('hud-compass-needle');
    this.elements.cannonStatus = document.getElementById('hud-cannon-status');
    this.elements.mode = document.getElementById('hud-mode');
    // Sailing_Improvements.md §2.1: voyage info panel
    this.elements.voyagePanel = document.getElementById('hud-voyage');
    this.elements.voyageDest = document.getElementById('hud-voyage-dest');
    this.elements.voyageDistance = document.getElementById('hud-voyage-distance');
    this.elements.voyageEta = document.getElementById('hud-voyage-eta');
    this.elements.voyageBearing = document.getElementById('hud-voyage-bearing');
    this.elements.voyageDockPrompt = document.getElementById('hud-voyage-dock');
    // Sailing_Improvements.md §4.1: wind row
    this.elements.voyageWindRow = document.getElementById('hud-voyage-wind-row');
    this.elements.voyageWind = document.getElementById('hud-voyage-wind');
    // Sailing_Improvements.md §2.5: stations pill
    this.elements.stationsPanel = document.getElementById('hud-stations');
    this.elements.stationsChips = document.getElementById('hud-stations-chips');
  }

  /**
   * Sailing_Improvements.md §2.5: render the compact station-fill pill row.
   * Pass null/undefined to hide it.
   */
  updateStations(roster, shipClassId) {
    const panel = this.elements.stationsPanel;
    const chipsEl = this.elements.stationsChips;
    if (!panel || !chipsEl) return;
    if (!roster) { panel.style.display = 'none'; return; }
    panel.style.display = '';
    const fillInfo = getStationFillInfo(roster, shipClassId);
    const stations = CREW.stations ?? [];
    chipsEl.innerHTML = stations.map(s => {
      const info = fillInfo[s];
      const filled = info?.filled ?? 0;
      const slots = info?.slots ?? 0;
      if (slots <= 0) return '';
      const isFilled = filled >= slots;
      const isEmpty = filled === 0;
      const cls = isFilled ? 'filled' : isEmpty ? 'empty' : 'partial';
      const label = STATION_SHORT[s] ?? s;
      const title = `${STATION_NAMES[s] ?? s}: ${filled}/${slots}`;
      return `<span class="hud-stations-chip ${cls}" title="${esc(title)}">${esc(label)} ${filled}/${slots}</span>`;
    }).join('');
  }

  /**
   * Sailing_Improvements.md §2.1: render the voyage panel.
   * Pass null/undefined to hide it.
   */
  updateVoyage(info) {
    const panel = this.elements.voyagePanel;
    if (!panel) return;
    if (!info) {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = '';
    if (this.elements.voyageDest) this.elements.voyageDest.textContent = info.destination?.name ?? '—';
    if (this.elements.voyageDistance) {
      const remaining = Math.max(0, Math.round(info.distanceRemaining ?? 0));
      const total = Math.max(1, Math.round(info.distanceTotal ?? 0));
      this.elements.voyageDistance.textContent = `${remaining} / ${total} u`;
    }
    if (this.elements.voyageEta) {
      if (info.etaSec == null || !isFinite(info.etaSec) || info.etaSec > 9999) {
        this.elements.voyageEta.textContent = '—';
      } else {
        const s = Math.max(0, Math.round(info.etaSec));
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        this.elements.voyageEta.textContent = mins > 0 ? `${mins}m ${String(secs).padStart(2, '0')}s` : `${secs}s`;
      }
    }
    if (this.elements.voyageBearing) {
      // Show 8-point compass + delta from current heading.
      const bearingDeg = ((info.bearingRad ?? 0) * 180 / Math.PI + 360) % 360;
      const compass8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const idx = Math.round(bearingDeg / 45) % 8;
      const deltaDeg = Math.round((info.headingDeltaRad ?? 0) * 180 / Math.PI);
      const arrow = deltaDeg > 5 ? '↻' : deltaDeg < -5 ? '↺' : '✓';
      this.elements.voyageBearing.textContent = `${compass8[idx]} ${arrow}${Math.abs(deltaDeg) > 5 ? ` ${Math.abs(deltaDeg)}°` : ''}`;
    }
    // Sailing_Improvements.md §2.3: dock prompt when approaching
    if (this.elements.voyageDockPrompt) {
      const approaching = (info.progress ?? 0) >= 0.85;
      this.elements.voyageDockPrompt.style.display = approaching ? '' : 'none';
    }
  }

  update(ship, result, loot, aimingSide) {
    if (!ship) return;

    const hullPct = Math.max(0, ship.hull / ship.hullMax) * 100;
    const sailsPct = Math.max(0, ship.sails / ship.sailMax) * 100;
    const speedPct = (Math.abs(ship.speed) / ship.effectiveMaxSpeed) * 100;

    if (this.elements.hull) this.elements.hull.textContent = Math.round(ship.hull);
    if (this.elements.hullBar) this.elements.hullBar.style.width = `${hullPct}%`;
    if (this.elements.sails) this.elements.sails.textContent = Math.round(ship.sails);
    if (this.elements.sailsBar) this.elements.sailsBar.style.width = `${sailsPct}%`;
    if (this.elements.speed) {
      this.elements.speed.textContent = Math.abs(ship.speed).toFixed(2);
      // Sailing_Improvements.md §1.6: breakdown tooltip
      const bd = ship.getEffectiveMaxSpeedBreakdown?.();
      if (bd) {
        const pct = (m) => `${Math.round((m - 1) * 100)}%`;
        const parts = [];
        if (bd.sailMult < 1) parts.push(`sails ${pct(bd.sailMult)}`);
        if (bd.crewMult < 1) parts.push(`crew ${pct(bd.crewMult)}`);
        if (bd.bilgeMult < 1) parts.push(`bilge ${pct(bd.bilgeMult)}`);
        if (bd.stationMult > 1) parts.push(`sailing-station +${pct(bd.stationMult).replace('-', '')}`);
        this.elements.speed.title = `Effective max: ${bd.total.toFixed(2)} / ${bd.base.toFixed(2)}${parts.length ? ' — ' + parts.join(', ') : ''}`;
      }
    }
    if (this.elements.speedBar) this.elements.speedBar.style.width = `${speedPct}%`;

    const bilgeMax = ship.bilgeWaterMax ?? 100;
    const bilgePct = bilgeMax > 0 ? Math.min(100, (ship.bilgeWater ?? 0) / bilgeMax * 100) : 0;
    if (this.elements.bilge) this.elements.bilge.textContent = Math.round(ship.bilgeWater ?? 0);
    if (this.elements.bilgeBar) this.elements.bilgeBar.style.width = `${bilgePct}%`;
    if (this.elements.leaks) this.elements.leaks.textContent = (ship.leaks ?? 0).toFixed(1);

    // Heading compass — needle points up when rotation=0 (facing +Y)
    if (this.elements.compassNeedle) {
      const deg = ship.rotation * 180 / Math.PI;
      this.elements.compassNeedle.style.transform = `rotate(${deg}deg)`;
    }

    // Cannon status — aim-then-fire or cooldown
    const cd = Math.max(ship.portCooldown, ship.starboardCooldown);
    if (this.elements.cannonStatus) {
      if (aimingSide) {
        this.elements.cannonStatus.textContent = `Aiming ${aimingSide} — press again to fire`;
      } else {
        this.elements.cannonStatus.textContent = cd > 0 ? `Reload ${cd.toFixed(1)}s` : 'Q/E: aim, then fire';
      }
    }

    if (result === 'victory') {
      if (this.elements.mode) this.elements.mode.textContent = `Victory! Gold: ${loot?.gold ?? 0} | Salvage: ${loot?.salvage ?? 0} — R to restart`;
    } else if (result === 'defeat') {
      if (this.elements.mode) this.elements.mode.textContent = 'Defeat — Ship sunk! R to restart';
    } else if (this.elements.mode) {
      this.elements.mode.textContent = 'Combat';
    }
    // Sailing_Improvements.md §2.1 / §2.5: voyage + stations panels are sailing-only
    if (this.elements.voyagePanel) this.elements.voyagePanel.style.display = 'none';
    if (this.elements.stationsPanel) this.elements.stationsPanel.style.display = 'none';
  }

  /**
   * Sailing mode: hull, sails, speed, sailing controls, voyage panel, stations.
   * @param {Ship} ship
   * @param {Object|null} voyageInfo
   * @param {{ roster?: Array, shipClassId?: string }=} extras
   */
  updateSailing(ship, voyageInfo = null, extras = {}) {
    if (!ship) return;
    this.update(ship, null, null, null);
    if (this.elements.mode) this.elements.mode.textContent = 'WASD ▸ Sail · K ▸ Crew · M ▸ Chart · Esc ▸ Cancel';
    if (this.elements.cannonStatus) this.elements.cannonStatus.textContent = '';
    this.updateVoyage(voyageInfo);
    if (extras?.roster) this.updateStations(extras.roster, extras.shipClassId);
    else if (this.elements.stationsPanel) this.elements.stationsPanel.style.display = 'none';
    // Sailing_Improvements.md §4.1: wind feedback (only when ship has a windMult)
    const wm = ship._windMult;
    if (this.elements.voyageWindRow && this.elements.voyageWind) {
      if (wm == null || Math.abs(wm - 1) < 0.005) {
        this.elements.voyageWindRow.style.display = 'none';
      } else {
        this.elements.voyageWindRow.style.display = '';
        const pct = Math.round((wm - 1) * 100);
        const icon = pct > 0 ? '🌬+' : '🌬';
        this.elements.voyageWind.textContent = `${icon}${pct}%`;
        this.elements.voyageWind.style.color = pct > 0 ? '#aacc88' : '#cc8844';
      }
    }
  }
}
