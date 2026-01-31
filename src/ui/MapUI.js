/**
 * YoHoH — Map UI: overworld HUD, island info, settings (save/load maps)
 */

import { UI, ECONOMY } from '../config.js';
import { getRouteModifiers } from '../utils/routeModifiers.js';

const ONBOARDING_KEY = 'yohoh-onboarding-hint';
const { routeSelection: ROUTE_SELECTION } = UI;

export class MapUI {
  constructor(container) {
    this.container = container;
    this.elements = {};
    this.onSaveMap = null;
    this.onLoadMap = null;
    this.onSaveGame = null;
    this.onEnterPort = null;
    this._hintDismissed = false;
    this._lastTravelRoute = null;
  }

  init() {
    const wrapper = document.getElementById('map-ui');
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div class="map-ui-layout">
        <div class="map-ui-panel map-ui-info">
          <div class="map-ui-current">
            <span class="map-ui-island-label">Docked at</span>
            <span id="map-current-island" class="map-ui-island-name">Home Port</span>
          </div>
          <button type="button" id="map-enter-port-btn" class="map-enter-port-btn" style="display:none">Enter Port</button>
          <span id="map-travel-status" class="map-ui-status">Click a route from your island to sail</span>
          <div id="map-onboarding-hint" class="map-onboarding-hint" style="display:none">
            <span>First time? Click a route from your island to sail.</span>
            <button type="button" class="map-onboarding-dismiss" title="Dismiss">×</button>
          </div>
          <div id="map-route-info" class="map-route-info" style="display:none">
            <span class="map-route-label">Route to</span>
            <span id="map-route-dest" class="map-route-dest-name"></span>
            <div id="map-route-details" class="map-route-details"></div>
          </div>
          <div id="map-route-selection" class="map-route-selection-panel" style="display:none">
            <div class="map-route-selection-header">
              <span class="map-route-label">Selected Route</span>
              <button type="button" class="map-route-deselect" title="Deselect">×</button>
            </div>
            <div id="map-route-selection-current" class="map-route-current-island"></div>
            <div id="map-route-selection-dest" class="map-route-dest-name"></div>
            <div id="map-route-selection-details" class="map-route-details"></div>
            <div id="map-route-selection-dest-info" class="map-route-dest-info"></div>
            <div id="map-route-selection-connected" class="map-route-connected-routes"></div>
            <div class="map-route-selection-actions">
              <button type="button" id="map-start-sailing-btn" class="map-start-sailing-btn">Start Sailing</button>
              <button type="button" id="map-deselect-route-btn" class="map-deselect-btn">Cancel</button>
            </div>
          </div>
        </div>
        <div class="map-ui-settings">
          <button id="map-settings-btn" class="map-settings-btn" title="Settings">⚙</button>
          <div id="map-settings-panel" class="map-settings-panel" data-open="false">
            <button id="map-save-btn" title="Ctrl+S">Save Map</button>
            <label class="map-load-label" title="Load map (Ctrl+O)">
              <input type="file" id="map-load-input" accept=".json" style="display:none">
              <span class="map-load-text">Load Map</span>
            </label>
          </div>
        </div>
      </div>
      <div id="map-toast" class="map-toast" aria-live="polite"></div>
    `;

    this.elements.currentIsland = document.getElementById('map-current-island');
    this.elements.travelStatus = document.getElementById('map-travel-status');
    this.elements.onboardingHint = document.getElementById('map-onboarding-hint');
    this.elements.routeInfo = document.getElementById('map-route-info');
    this.elements.routeDest = document.getElementById('map-route-dest');
    this.elements.routeDetails = document.getElementById('map-route-details');
    this.elements.routeSelection = document.getElementById('map-route-selection');
    this.elements.routeSelectionCurrent = document.getElementById('map-route-selection-current');
    this.elements.routeSelectionDest = document.getElementById('map-route-selection-dest');
    this.elements.routeSelectionDetails = document.getElementById('map-route-selection-details');
    this.elements.routeSelectionDestInfo = document.getElementById('map-route-selection-dest-info');
    this.elements.routeSelectionConnected = document.getElementById('map-route-selection-connected');
    this.elements.startSailingBtn = document.getElementById('map-start-sailing-btn');
    this.elements.deselectRouteBtn = document.getElementById('map-deselect-route-btn');
    this.elements.settingsBtn = document.getElementById('map-settings-btn');
    this.elements.settingsPanel = document.getElementById('map-settings-panel');
    this.elements.saveBtn = document.getElementById('map-save-btn');
    this.elements.loadInput = document.getElementById('map-load-input');
    this.elements.toast = document.getElementById('map-toast');

    this.elements.settingsBtn?.addEventListener('click', () => this._toggleSettings());
    this.elements.onboardingHint?.querySelector('.map-onboarding-dismiss')?.addEventListener('click', () => this._dismissOnboarding());
    try {
      this._hintDismissed = localStorage.getItem(ONBOARDING_KEY) === '1';
    } catch (_) {}
    this.elements.saveGameBtn = document.getElementById('map-save-game-btn');
    this.elements.saveGameBtn?.addEventListener('click', () => this._onSaveGame());
    this.elements.saveBtn?.addEventListener('click', () => this._onSave());
    this.elements.loadInput?.addEventListener('change', (e) => this._onLoad(e));
    this.elements.startSailingBtn?.addEventListener('click', () => this._onStartSailing());
    this.elements.enterPortBtn = document.getElementById('map-enter-port-btn');
    this.elements.enterPortBtn?.addEventListener('click', () => this.onEnterPort?.());
    this.elements.deselectRouteBtn?.addEventListener('click', () => this._onDeselectRoute());
    this.elements.routeSelection?.querySelector('.map-route-deselect')?.addEventListener('click', () => this._onDeselectRoute());
    document.addEventListener('keydown', (e) => this._onKeyDown(e));
    document.addEventListener('click', (e) => {
      if (this.elements.settingsPanel?.dataset.open === 'true' &&
          !wrapper.contains(e.target)) {
        this.elements.settingsPanel.dataset.open = 'false';
      }
    });
  }

  _dismissOnboarding() {
    this._hintDismissed = true;
    if (this.elements.onboardingHint) this.elements.onboardingHint.style.display = 'none';
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch (_) {}
  }

  _onKeyDown(e) {
    if (!document.getElementById('map-ui')?.offsetParent) return;
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        this._onSave();
      } else if (e.key === 'o') {
        e.preventDefault();
        this.elements.loadInput?.click();
      }
    }
  }

  /** Public: show a toast message (e.g. arrival feedback) */
  showToast(msg, type = 'success') {
    this._showToast(msg, type);
  }

  _showToast(msg, type = 'success') {
    const toast = this.elements.toast;
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `map-toast map-toast-${type}`;
    toast.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }

  _onSaveGame() {
    if (this.onSaveGame) {
      const ok = this.onSaveGame();
      this.showToast(ok ? 'Game saved' : 'Save failed', ok ? 'success' : 'error');
      this._toggleSettings();
    }
  }

  _toggleSettings() {
    const panel = this.elements.settingsPanel;
    if (!panel) return;
    panel.dataset.open = panel.dataset.open === 'true' ? 'false' : 'true';
  }

  _onSave() {
    if (this.onSaveMap) {
      const json = this.onSaveMap();
      if (json) {
        const blob = new Blob([json], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `yohoh-map-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        this.showToast('Map saved');
        this._toggleSettings();
      } else {
        this.showToast('Nothing to save', 'error');
      }
    }
  }

  _onLoad(e) {
    const file = e.target?.files?.[0];
    if (!file || !this.onLoadMap) return;
    const loadText = this.elements.loadInput?.closest('.map-load-label')?.querySelector('.map-load-text');
    if (loadText) loadText.textContent = 'Loading…';
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (loadText) loadText.textContent = 'Load Map';
      const json = ev.target?.result;
      if (typeof json === 'string' && this.onLoadMap(json)) {
        this.showToast('Map loaded');
        this._toggleSettings();
      } else {
        this.showToast('Failed to load map', 'error');
      }
    };
    reader.onerror = () => {
      if (loadText) loadText.textContent = 'Load Map';
      this._showToast('Failed to load map', 'error');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  _onStartSailing() {
    if (this._pendingRoute && this.onStartSailing) {
      this.onStartSailing(this._pendingRoute);
    }
  }

  _onDeselectRoute() {
    this._pendingRoute = null;
    if (this.onDeselectRoute) this.onDeselectRoute();
  }

  update(currentIsland, isTraveling, travelRoute, routeInfo, hoveredRoute, selectedRoute, connectedRoutes = [], gold = null) {
    const panel = this.elements.currentIsland?.closest('.map-ui-panel');
    if (panel) {
      const state = isTraveling ? 'sailing' : (hoveredRoute ? 'selecting' : 'docked');
      panel.dataset.state = state;
    }
    if (this.elements.currentIsland && currentIsland) {
      this.elements.currentIsland.textContent = currentIsland.name || `Island ${currentIsland.id}`;
    }
    if (this.elements.enterPortBtn) {
      this.elements.enterPortBtn.style.display = (!isTraveling && currentIsland) ? 'block' : 'none';
    }
    if (this.elements.onboardingHint && !this._hintDismissed) {
      const show = !isTraveling;
      this.elements.onboardingHint.style.display = show ? 'flex' : 'none';
      if (isTraveling) this._dismissOnboarding();
    }
    if (isTraveling && travelRoute && travelRoute !== this._lastTravelRoute) {
      this._lastTravelRoute = travelRoute;
      const dest = travelRoute.a === currentIsland ? travelRoute.b : travelRoute.a;
      const destName = dest?.name || `Island ${dest?.id}`;
      this._showToast(`Setting sail to ${destName}!`);
    } else if (!isTraveling) {
      this._lastTravelRoute = null;
    }
    if (this.elements.travelStatus) {
      this.elements.travelStatus.textContent = isTraveling
        ? 'WASD to sail — M for chart'
        : selectedRoute ? 'Click Start Sailing or Cancel' : 'Click a route to select — then Start Sailing';
    }
    if (selectedRoute && !isTraveling) {
      this._pendingRoute = selectedRoute;
      const cfg = ROUTE_SELECTION ?? {};
      const info = routeInfo ?? this._getRouteInfoFromEdge(selectedRoute);
      const destNode = selectedRoute.a === currentIsland ? selectedRoute.b : selectedRoute.a;
      if (this.elements.routeSelection) {
        this.elements.routeSelection.style.display = 'block';

        if (cfg.showCurrentIsland !== false && this.elements.routeSelectionCurrent && currentIsland) {
          this.elements.routeSelectionCurrent.style.display = 'block';
          this.elements.routeSelectionCurrent.innerHTML = `<span class="map-route-label">Docked at</span><span class="map-route-current-name">${currentIsland.name || `Island ${currentIsland.id}`}</span>`;
        } else if (this.elements.routeSelectionCurrent) {
          this.elements.routeSelectionCurrent.style.display = 'none';
        }

        this.elements.routeSelectionDest.textContent = info?.destination || destNode?.name || `Island ${destNode?.id}`;

        const rows = [];
        rows.push({ icon: '↔', text: `${info?.distance ?? 0} units` });
        if (cfg.showPortType !== false && info?.portType && info.portType !== 'none') rows.push({ icon: '⚓', text: info.portType });
        if (info?.dangerous) rows.push({ icon: '⚠', text: 'Dangerous' });
        if (info?.appealing) rows.push({ icon: '✓', text: 'Safe port' });
        this.elements.routeSelectionDetails.innerHTML = rows
          .map(r => `<span class="map-route-row"><span class="map-route-icon">${r.icon}</span>${r.text}</span>`)
          .join('');

        const destRows = [];
        if (cfg.showDestinationDetails !== false && destNode) {
          if (cfg.showDescription !== false && destNode.description) destRows.push(destNode.description);
          if (cfg.showTreasureLevel !== false && destNode.treasureLevel != null) destRows.push(`Treasure: ${['None', 'Modest', 'Rich', 'Legendary'][destNode.treasureLevel] ?? destNode.treasureLevel}`);
          if (cfg.showHazard !== false && destNode.hazard && destNode.hazard !== 'none') destRows.push(`Hazard: ${destNode.hazard}`);
          if (cfg.showFaction !== false && destNode.faction && destNode.faction !== 'neutral') destRows.push(`Faction: ${destNode.faction}`);
        }
        this.elements.routeSelectionDestInfo.textContent = destRows.length ? destRows.join(' · ') : '';
        this.elements.routeSelectionDestInfo.style.display = destRows.length ? 'block' : 'none';

        const suppliesCost = ECONOMY?.suppliesCost ?? 0;
        const canAffordSupplies = suppliesCost <= 0 || (gold != null && gold >= suppliesCost);
        if (this.elements.startSailingBtn) {
          this.elements.startSailingBtn.disabled = !canAffordSupplies;
          this.elements.startSailingBtn.title = suppliesCost > 0 ? `Supplies: ${suppliesCost} gold` : '';
        }
        if (cfg.showConnectedRoutes !== false && this.elements.routeSelectionConnected && connectedRoutes.length > 0) {
          const maxRoutes = cfg.connectedRoutesMax ?? 8;
          const routesToShow = connectedRoutes.slice(0, maxRoutes);
          const items = routesToShow.map(edge => {
            const other = edge.a === currentIsland ? edge.b : edge.a;
            const routeInfoItem = this._getRouteInfoFromEdge(edge, currentIsland);
            const name = other.name || `Island ${other.id}`;
            const dist = routeInfoItem?.distance ?? 0;
            const isSelected = edge === selectedRoute;
            return `<div class="map-route-connected-item ${isSelected ? 'map-route-connected-selected' : ''}"><span class="map-route-connected-name">${name}</span><span class="map-route-connected-dist">${dist} units</span></div>`;
          }).join('');
          this.elements.routeSelectionConnected.innerHTML = `<span class="map-route-label">Routes from here</span><div class="map-route-connected-list">${items}</div>`;
          this.elements.routeSelectionConnected.style.display = 'block';
        } else if (this.elements.routeSelectionConnected) {
          this.elements.routeSelectionConnected.style.display = 'none';
        }
      }
      if (this.elements.routeInfo) this.elements.routeInfo.style.display = 'none';
    } else {
      this._pendingRoute = null;
      if (this.elements.routeSelection) this.elements.routeSelection.style.display = 'none';
      if (this.elements.routeInfo && this.elements.routeDest && this.elements.routeDetails) {
        const info = routeInfo ?? (travelRoute ? this._getRouteInfoFromEdge(travelRoute, currentIsland) : null);
        if (info && !selectedRoute) {
          this.elements.routeInfo.style.display = 'block';
          this.elements.routeDest.textContent = info.destination;
          const rows = [];
          rows.push({ icon: '↔', text: `${info.distance} units` });
          if (info.dangerous) rows.push({ icon: '⚠', text: 'Dangerous' });
          if (info.appealing) rows.push({ icon: '✓', text: 'Safe port' });
          if (info.portType && info.portType !== 'none') rows.push({ icon: '⚓', text: info.portType });
          const modIcons = { stormy: '⛈', patrolled: '⚔', shoals: '⚠' };
          const modLabels = { stormy: 'Stormy', patrolled: 'Patrolled', shoals: 'Shoals' };
          for (const m of info.modifiers ?? []) rows.push({ icon: modIcons[m] ?? '•', text: modLabels[m] ?? m });
          this.elements.routeDetails.innerHTML = rows
            .map(r => `<span class="map-route-row"><span class="map-route-icon">${r.icon}</span>${r.text}</span>`)
            .join('');
        } else {
          this.elements.routeInfo.style.display = 'none';
        }
      }
    }
  }

  _getRouteInfoFromEdge(edge, currentIsland = null) {
    if (!edge) return null;
    const dest = currentIsland ? (edge.a === currentIsland ? edge.b : edge.a) : (edge.a?.position ? edge.b : edge.a);
    const src = currentIsland || (edge.a?.position ? edge.a : edge.b);
    const dx = dest.position.x - src.position.x;
    const dy = dest.position.y - src.position.y;
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

  show() {
    const wrapper = document.getElementById('map-ui');
    if (wrapper) wrapper.style.display = 'block';
  }

  hide() {
    const wrapper = document.getElementById('map-ui');
    if (wrapper) wrapper.style.display = 'none';
    this.elements.settingsPanel?.setAttribute('data-open', 'false');
  }
}
