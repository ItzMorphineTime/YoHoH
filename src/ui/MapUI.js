/**
 * YoHoH — Map UI: overworld HUD, island info, settings (save/load maps)
 */

const ONBOARDING_KEY = 'yohoh-onboarding-hint';

export class MapUI {
  constructor(container) {
    this.container = container;
    this.elements = {};
    this.onSaveMap = null;
    this.onLoadMap = null;
    this._hintDismissed = false;
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
        </div>
        <div class="map-ui-settings">
          <button id="map-settings-btn" class="map-settings-btn" title="Settings">⚙</button>
          <div id="map-settings-panel" class="map-settings-panel" style="display:none">
            <button id="map-save-btn">Save Map</button>
            <label class="map-load-label">
              <input type="file" id="map-load-input" accept=".json" style="display:none">
              Load Map
            </label>
          </div>
        </div>
      </div>
    `;

    this.elements.currentIsland = document.getElementById('map-current-island');
    this.elements.travelStatus = document.getElementById('map-travel-status');
    this.elements.onboardingHint = document.getElementById('map-onboarding-hint');
    this.elements.routeInfo = document.getElementById('map-route-info');
    this.elements.routeDest = document.getElementById('map-route-dest');
    this.elements.routeDetails = document.getElementById('map-route-details');
    this.elements.settingsBtn = document.getElementById('map-settings-btn');
    this.elements.settingsPanel = document.getElementById('map-settings-panel');
    this.elements.saveBtn = document.getElementById('map-save-btn');
    this.elements.loadInput = document.getElementById('map-load-input');

    this.elements.settingsBtn?.addEventListener('click', () => this._toggleSettings());
    this.elements.onboardingHint?.querySelector('.map-onboarding-dismiss')?.addEventListener('click', () => this._dismissOnboarding());
    try {
      this._hintDismissed = localStorage.getItem(ONBOARDING_KEY) === '1';
    } catch (_) {}
    this.elements.saveBtn?.addEventListener('click', () => this._onSave());
    this.elements.loadInput?.addEventListener('change', (e) => this._onLoad(e));
    document.addEventListener('click', (e) => {
      if (this.elements.settingsPanel?.style.display === 'block' &&
          !wrapper.contains(e.target)) {
        this.elements.settingsPanel.style.display = 'none';
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

  _toggleSettings() {
    const panel = this.elements.settingsPanel;
    if (!panel) return;
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
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
        this._toggleSettings();
      }
    }
  }

  _onLoad(e) {
    const file = e.target?.files?.[0];
    if (!file || !this.onLoadMap) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result;
      if (typeof json === 'string' && this.onLoadMap(json)) {
        this._toggleSettings();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  update(currentIsland, isTraveling, travelRoute, routeInfo) {
    if (this.elements.currentIsland && currentIsland) {
      this.elements.currentIsland.textContent = currentIsland.name || `Island ${currentIsland.id}`;
    }
    if (this.elements.onboardingHint && !this._hintDismissed) {
      const show = !isTraveling;
      this.elements.onboardingHint.style.display = show ? 'flex' : 'none';
      if (isTraveling) this._dismissOnboarding();
    }
    if (this.elements.travelStatus) {
      this.elements.travelStatus.textContent = isTraveling
        ? 'WASD to sail — M for chart'
        : 'Hover route for info — Click to sail';
    }
    if (this.elements.routeInfo && this.elements.routeDest && this.elements.routeDetails) {
      const info = routeInfo ?? (travelRoute ? this._getRouteInfoFromEdge(travelRoute) : null);
      if (info) {
        this.elements.routeInfo.style.display = 'block';
        this.elements.routeDest.textContent = info.destination;
        const rows = [];
        rows.push({ icon: '↔', text: `${info.distance} units` });
        if (info.dangerous) rows.push({ icon: '⚠', text: 'Dangerous' });
        if (info.appealing) rows.push({ icon: '✓', text: 'Safe port' });
        if (info.portType && info.portType !== 'none') rows.push({ icon: '⚓', text: info.portType });
        this.elements.routeDetails.innerHTML = rows
          .map(r => `<span class="map-route-row"><span class="map-route-icon">${r.icon}</span>${r.text}</span>`)
          .join('');
      } else {
        this.elements.routeInfo.style.display = 'none';
      }
    }
  }

  _getRouteInfoFromEdge(edge) {
    if (!edge) return null;
    const dest = edge.a?.position ? edge.b : edge.a;
    const src = edge.a?.position ? edge.a : edge.b;
    const dx = dest.position.x - src.position.x;
    const dy = dest.position.y - src.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return {
      destination: dest.name || `Island ${dest.id}`,
      distance: Math.round(dist),
      dangerous: dest.dangerous,
      appealing: dest.appealing,
      portType: dest.portType || 'none',
    };
  }

  show() {
    const wrapper = document.getElementById('map-ui');
    if (wrapper) wrapper.style.display = 'block';
  }

  hide() {
    const wrapper = document.getElementById('map-ui');
    if (wrapper) wrapper.style.display = 'none';
    this.elements.settingsPanel?.style.setProperty('display', 'none');
  }
}
