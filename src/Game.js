/**
 * YoHoH — Game loop and state machine
 * Phase A: Combat | Phase B: Overworld, Sailing, Save/Load
 */

import { GAME_STATES, GAME, COMBAT, OVERWORLD, ECONOMY, SHIP_CLASSES } from './config.js';
import { loadGoods } from './systems/EconomySystem.js';
import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { CombatScene } from './scenes/CombatScene.js';
import { OverworldScene } from './scenes/OverworldScene.js';
import { PortScene } from './scenes/PortScene.js';
import { HUD } from './ui/HUD.js';
import { Minimap } from './ui/Minimap.js';
import { MapUI } from './ui/MapUI.js';
import { BigMapUI } from './ui/BigMapUI.js';
import { PortUI } from './ui/PortUI.js';
import { getStationEffects, updateMoraleDecay } from './systems/CrewSystem.js';
import { saveToStorage, loadFromStorage, loadWithStatus, LOAD_STATUS } from './utils/saveSystem.js';
import { PortController } from './controllers/PortController.js'; // Improvements.md §5.1

export class Game {
  constructor(container) {
    this.container = container;
    this.state = GAME_STATES.OVERWORLD;
    this.renderer = new Renderer(container);
    this.input = new Input();
    this.hud = new HUD(container);
    this.minimap = new Minimap(container);
    this.mapUI = new MapUI(container);
    this.bigMapUI = new BigMapUI();

    this.combatScene = new CombatScene();
    this.overworldScene = new OverworldScene();
    this.portScene = new PortScene();
    this.portUI = new PortUI(container);

    this._playerGold = GAME?.startingGold ?? 0;
    this._playerInfamy = 0;
    this._crewRoster = [];
    this._playerShipClass = GAME?.defaultShipClass ?? 'sloop';
    this._playerShipState = null; // hull, sails, crew, bilgeWater, leaks; persisted across sailing/port
    this._playerCargo = {}; // { goodId: quantity }; persisted across port
    this._playerUpgrades = {}; // { slotId: upgradeId }; C.7, C.10

    this.lastTime = 0;
    this.running = false;
    this._hoveredRoute = null;
    this._selectedRoute = null;
    this._overworldPan = { x: 0, y: 0 };
    this._overworldZoom = 1;
    this._overworldDragStart = null;
  }

  /** D.9: Get current game state for save. */
  getSaveState() {
    const currentIsland = this.overworldScene.getCurrentIsland?.();
    const mapJson = this.overworldScene.serializeMap?.();
    return {
      gold: this._playerGold ?? 0,
      infamy: this._playerInfamy ?? 0,
      crewRoster: [...(this._crewRoster ?? [])],
      shipClass: this._playerShipClass ?? 'sloop',
      shipState: this._playerShipState ? { ...this._playerShipState } : null,
      cargo: { ...(this._playerCargo ?? {}) },
      upgrades: { ...(this._playerUpgrades ?? {}) },
      unlockedShipClasses: [...(this._playerUnlockedShipClasses ?? ['sloop'])],
      currentIslandId: currentIsland?.id ?? 0,
      mapJson: mapJson ?? null,
    };
  }

  /** D.9: Save game to localStorage. Returns true on success. */
  saveGame() {
    return saveToStorage(this.getSaveState());
  }

  /** D.9: Load game state from localStorage. Returns state or null. */
  loadGame() {
    return loadFromStorage();
  }

  /**
   * D.9: Load with status — surfaces corrupt-save / version-mismatch cases
   * so callers can react (e.g. show a toast). (Improvements.md §4.1)
   * @returns {{ status: string, state: Object|null }}
   */
  loadGameWithStatus() {
    return loadWithStatus();
  }

  /** D.9: Apply loaded state to game. Call before init when continuing. */
  applyLoadedState(state) {
    if (!state) return;
    this._playerGold = state.gold ?? GAME?.startingGold ?? 0;
    this._playerInfamy = state.infamy ?? 0;
    this._crewRoster = Array.isArray(state.crewRoster) ? state.crewRoster : [];
    this._playerShipClass = state.shipClass ?? 'sloop';
    this._playerShipState = state.shipState ? { ...state.shipState } : null;
    this._playerCargo = state.cargo && typeof state.cargo === 'object' ? { ...state.cargo } : {};
    this._playerUpgrades = state.upgrades && typeof state.upgrades === 'object' ? { ...state.upgrades } : {};
    this._playerUnlockedShipClasses = Array.isArray(state.unlockedShipClasses) ? state.unlockedShipClasses : ['sloop'];
  }

  init(loadState = null) {
    if (loadState) this.applyLoadedState(loadState);

    this.renderer.init();
    this.input.init(this.renderer.renderer.domElement);
    this.hud.init();
    this.minimap.init();
    this.mapUI.init();
    this.bigMapUI.init();
    this.combatScene.init();

    if (loadState?.mapJson) {
      this.overworldScene.init(loadState.mapJson, loadState.currentIslandId ?? 0);
    } else {
      this.overworldScene.init();
    }

    this.mapUI.onSaveMap = () => this.overworldScene.serializeMap();
    this.mapUI.onLoadMap = (json) => this.overworldScene.loadMap(json);
    this.mapUI.onSaveGame = () => this.saveGame();
    this.mapUI.onStartSailing = (route) => this._startSailing(route);
    this.mapUI.onDeselectRoute = () => { this._selectedRoute = null; };
    this.mapUI.onEnterPort = () => this._enterPort();

    this.portUI.init();

    // Improvements.md §5.1: All port handlers live on PortController. The host
    // accessors expose just the cross-cutting player state the controller needs
    // (infamy, unlocked ship classes, current ship class).
    this.portController = new PortController({
      portScene: this.portScene,
      portUI: this.portUI,
      host: {
        onLeavePort: () => this._leavePort(),
        getInfamy: () => this._playerInfamy ?? 0,
        setInfamy: (v) => { this._playerInfamy = v; },
        getUnlockedShipClasses: () => this._playerUnlockedShipClasses ?? ['sloop'],
        setUnlockedShipClasses: (v) => { this._playerUnlockedShipClasses = v; },
        setShipClass: (id) => { this._playerShipClass = id; },
      },
    });
    this.portController.bindUI();
    this._initOverworldNavControls();
    this._initSettings();

    const canvas = this.renderer?.renderer?.domElement;
    canvas?.addEventListener('wheel', (e) => this._onOverworldWheel(e), { passive: false });

    loadGoods().catch(() => {}); // Preload goods for Market
    this.running = true;
    this.lastTime = performance.now();
    document.body.dataset.gameState = this.state;
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, GAME?.maxDt ?? 0.1);
    this.lastTime = now;

    this.update(dt);
    this.render();
    this.input.endFrame();

    requestAnimationFrame(() => this._loop());
  }

  update(dt) {
    if (this.state === GAME_STATES.OVERWORLD) {
      this._updateOverworld(dt);
    } else if (this.state === GAME_STATES.SAILING) {
      this._updateSailing(dt);
    } else if (this.state === GAME_STATES.COMBAT) {
      this._updateCombat(dt);
    } else if (this.state === GAME_STATES.PORT) {
      this._updatePort(dt);
    }
  }

  _updateOverworld(dt) {
    const { overworldScene, input } = this;

    if (this.bigMapUI.isVisible()) {
      if (input.isKeyJustPressed('KeyM') || input.isKeyJustPressed('Escape')) {
        this.bigMapUI.hide();
      }
      this._hoveredRoute = null;
      return;
    }

    if (input.isKeyJustPressed('KeyM')) {
      this.bigMapUI.toggle();
      return;
    }

    const worldScale = OVERWORLD?.worldScale ?? 10;
    const ndc = input.getMouseNDC();
    const shipPos = overworldScene.getShipPosition();
    const world = this.renderer.ndcToWorldOverworld(ndc.x, ndc.y, shipPos);
    const graphX = world.x / worldScale;
    const graphY = world.y / worldScale;
    this._hoveredRoute = this._isMouseOverCanvas() ? overworldScene.getRouteNearPosition(graphX, graphY, 1) : null;

    if (input.isLeftMouseJustPressed() && !this._isClickOnUI()) {
      const route = overworldScene.getRouteNearPosition(graphX, graphY, 1);
      if (route) {
        this._selectedRoute = route;
        this._overworldDragStart = null;
      } else {
        this._selectedRoute = null;
        this._overworldDragStart = { x: input.mouse.x, y: input.mouse.y, panX: this._overworldPan.x, panY: this._overworldPan.y };
      }
    }
    if (input.isMiddleMouseJustPressed() && !this._isClickOnUI()) {
      this._overworldDragStart = { x: input.mouse.x, y: input.mouse.y, panX: this._overworldPan.x, panY: this._overworldPan.y };
    }
    if (input.isMouseDown() && this._overworldDragStart) {
      const halfW = (this.renderer?.renderer?.domElement?.clientWidth ?? 800) / 2;
      const halfH = (this.renderer?.renderer?.domElement?.clientHeight ?? 600) / 2;
      const zoom = Math.max(0.1, this.renderer?.lastOverworldZoom ?? 0.25);
      const scaleX = halfW / zoom;
      const scaleY = halfH / zoom;
      const ndcDx = input.mouse.x - this._overworldDragStart.x;
      const ndcDy = input.mouse.y - this._overworldDragStart.y;
      this._overworldPan.x = this._overworldDragStart.panX - ndcDx * scaleX;
      this._overworldPan.y = this._overworldDragStart.panY - ndcDy * scaleY;
    }
    if (!input.isMouseDown()) this._overworldDragStart = null;

    overworldScene.update(dt, input);

    if (overworldScene.isTraveling()) {
      this._selectedRoute = null;
      this.state = GAME_STATES.SAILING;
    }
  }

  _updateSailing(dt) {
    const { overworldScene, input } = this;

    if (this.bigMapUI.isVisible()) {
      if (input.isKeyJustPressed('KeyM') || input.isKeyJustPressed('Escape')) {
        this.bigMapUI.hide();
      }
      overworldScene.update(dt, input);
      return;
    }

    if (input.isKeyJustPressed('KeyM')) {
      this.bigMapUI.toggle();
    }

    // Improvements.md §4.3: OverworldScene.update() returns the arrived ship state
    // on the single frame the voyage completes (replaces the consume-on-read side channel).
    const arrivedState = overworldScene.update(dt, input);
    if (arrivedState) this._playerShipState = arrivedState;

    // C.6: morale decays during voyage; C.6c: faster decay when undercrewed
    const maxCrew = SHIP_CLASSES?.[this._playerShipClass ?? 'sloop']?.crewMax ?? 20;
    updateMoraleDecay(this._crewRoster ?? [], dt, maxCrew);
    const sailingShip = overworldScene.getSailingShip?.();
    if (sailingShip) {
      sailingShip.setStationEffects(getStationEffects(this._crewRoster ?? [], this._playerShipClass ?? 'sloop'));
    }

    // Improvements.md §6.3: Poisson-process encounter timer — framerate-independent.
    // Maintain a countdown sampled from Exp(λ); when it crosses 0, trigger and resample.
    if (overworldScene.isTraveling()) {
      const lambda = COMBAT?.encounterChancePerSecond ?? 0.006; // events per second
      if (this._encounterTimer == null || !isFinite(this._encounterTimer)) {
        this._encounterTimer = this._sampleEncounterDelay(lambda);
      }
      this._encounterTimer -= dt;
      if (this._encounterTimer <= 0) {
        this._encounterTimer = this._sampleEncounterDelay(lambda);
        this._sailingPositionBeforeCombat = { ...overworldScene.getShipPosition() };
        this.state = GAME_STATES.COMBAT;
        this.combatScene.init(overworldScene.getSailingShip());
      }
    } else {
      this._encounterTimer = null; // reset on arrival; new voyage resamples
      const arrivedIsland = overworldScene.getCurrentIsland();
      if (arrivedIsland?.name) this.mapUI.showToast(`Arrived at ${arrivedIsland.name}!`);
      this.state = GAME_STATES.OVERWORLD;
    }
  }

  /** Sample an Exp(λ) waiting time for the next encounter. (Improvements.md §6.3) */
  _sampleEncounterDelay(lambda) {
    if (!lambda || lambda <= 0) return Infinity;
    // Inverse-CDF sampling: -ln(U) / λ where U ∈ (0,1].
    const u = Math.max(1e-9, Math.random());
    return -Math.log(u) / lambda;
  }

  _updateCombat(dt) {
    const { combatScene, input } = this;

    const result = combatScene.getResult();
    if ((result === 'victory' || result === 'defeat') && input.isKeyDown('KeyR')) {
      combatScene.init();
    }
    if (result === 'victory' && input.isKeyJustPressed('Escape')) {
      const loot = combatScene.getLoot();
      this._playerGold = (this._playerGold ?? 0) + (loot?.gold ?? 0);
      if (this.overworldScene.isTraveling()) {
        const ship = this.overworldScene.getSailingShip();
        const pos = this._sailingPositionBeforeCombat;
        if (ship && pos) {
          ship.x = pos.x;
          ship.y = pos.y;
        }
        this.state = GAME_STATES.SAILING;
      } else {
        this.state = GAME_STATES.OVERWORLD;
      }
    }
    if (result === 'defeat' && input.isKeyJustPressed('Escape')) {
      this.overworldScene.cancelTravel();
      this.state = GAME_STATES.OVERWORLD;
    }

    combatScene.handleAimInput(input);
    combatScene.update(dt, input);
  }

  _initOverworldNavControls() {
    const controls = document.getElementById('overworld-map-controls');
    const zoomIn = controls?.querySelector('.overworld-zoom-in');
    const zoomOut = controls?.querySelector('.overworld-zoom-out');
    const center = controls?.querySelector('.overworld-center');
    zoomIn?.addEventListener('click', () => {
      this._overworldZoom = Math.min(3, this._overworldZoom + 0.25);
    });
    zoomOut?.addEventListener('click', () => {
      this._overworldZoom = Math.max(0.5, this._overworldZoom - 0.25);
    });
    center?.addEventListener('click', () => {
      this._overworldPan = { x: 0, y: 0 };
      this._overworldZoom = 1;
    });
  }

  _initSettings() {
    const STORAGE_KEY = 'yohoh-ui-scale';
    const scaleInput = document.getElementById('settings-ui-scale');
    const scaleValue = document.getElementById('settings-scale-value');
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('settings-btn');
    const closeBtn = document.getElementById('settings-close');

    const applyScale = (v) => {
      const scale = parseFloat(v);
      document.documentElement.style.setProperty('--ui-scale', String(scale));
      if (scaleValue) scaleValue.textContent = `${Math.round(scale * 100)}%`;
      try { localStorage.setItem(STORAGE_KEY, String(scale)); } catch (_) {}
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ? parseFloat(saved) : 1;
    const clamped = Math.max(0.75, Math.min(1.5, initial));
    applyScale(clamped);
    if (scaleInput) scaleInput.value = String(clamped);

    openBtn?.addEventListener('click', () => {
      modal?.classList.add('visible');
      modal?.focus();
    });
    closeBtn?.addEventListener('click', () => modal?.classList.remove('visible'));
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('visible');
    });
    modal?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') modal?.classList.remove('visible');
    });
    scaleInput?.addEventListener('input', (e) => applyScale(e.target.value));
  }

  _onOverworldWheel(e) {
    if (this.state !== GAME_STATES.OVERWORLD || this.bigMapUI.isVisible()) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    this._overworldZoom = Math.max(0.5, Math.min(3, this._overworldZoom + delta));
  }

  _enterPort() {
    const currentIsland = this.overworldScene.getCurrentIsland();
    if (!currentIsland) return;
    // D.9: Auto-save when entering port
    this.saveGame();
    const dockFee = ECONOMY?.dockFee ?? 0;
    const goldAfterDock = Math.max(0, (this._playerGold ?? 0) - dockFee);
    this.portScene.init(currentIsland, [...(this._crewRoster ?? [])], goldAfterDock, this._playerShipClass ?? 'sloop', this._playerShipState ?? null, { ...(this._playerCargo ?? {}) }, { ...(this._playerUpgrades ?? {}) }, this._playerInfamy ?? 0, [...(this._playerUnlockedShipClasses ?? ['sloop'])]);
    this.portScene.dockFeePaid = dockFee;
    this.portUI.show(this.portScene);
    this.state = GAME_STATES.PORT;
  }

  _leavePort() {
    this._crewRoster = [...(this.portScene.getCrewRoster() ?? [])];
    this._playerGold = this.portScene.getGold();
    this._playerShipState = this.portScene.getShipState?.() ?? this._playerShipState;
    this._playerUpgrades = this.portScene.getUpgrades?.() ?? this._playerUpgrades;
    this._playerCargo = this.portScene.getCargo?.() ?? this._playerCargo ?? {};
    this.portUI.hide();
    this.state = GAME_STATES.OVERWORLD;
  }

  // Port-screen handlers now live on PortController (Improvements.md §5.1).
  // Game keeps _enterPort / _leavePort because they straddle state-machine
  // transitions; everything in between is the controller's responsibility.

  _updatePort(_dt) {
    // PortUI is updated only when state changes (via _onPort* handlers and on entry via show()).
    // No per-frame work here — the port is otherwise static. (Improvements.md §1.3)
  }

  _startSailing(route) {
    const currentIsland = this.overworldScene.getCurrentIsland();
    if (!route || !currentIsland) return false;
    const { a, b } = route;
    const target = a === currentIsland ? b : a;
    if (!target) return false;
    const suppliesCost = ECONOMY?.suppliesCost ?? 0;
    const gold = this._playerGold ?? 0;
    if (suppliesCost > 0 && gold < suppliesCost) {
      this.mapUI.showToast(`Need ${suppliesCost} gold for supplies!`, 'error');
      return false;
    }
    const ok = this.overworldScene.startTravel(target, this._crewRoster ?? [], this._playerShipClass ?? 'sloop', this._playerShipState ?? null, this._playerUpgrades ?? {});
    if (ok) {
      if (suppliesCost > 0) this._playerGold = Math.max(0, gold - suppliesCost);
      this._selectedRoute = null;
      this.state = GAME_STATES.SAILING;
    }
    return ok;
  }

  /**
   * Run an `elementFromPoint` lookup for the current mouse position, caching by
   * NDC coords so a stationary mouse returns instantly. `elementFromPoint` forces
   * a synchronous layout — calling it every frame causes a measurable reflow tax
   * on the overworld hover path. (Improvements.md §2.1)
   * @returns {Element|null}
   */
  _hitTestAtMouse() {
    const canvas = this.renderer?.renderer?.domElement;
    if (!canvas) return null;
    const mx = this.input.mouse.x;
    const my = this.input.mouse.y;
    if (this._hitCacheX === mx && this._hitCacheY === my && this._hitCacheEl !== undefined) {
      return this._hitCacheEl;
    }
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + (mx + 1) / 2 * rect.width;
    const y = rect.top + (1 - my) / 2 * rect.height;
    const el = document.elementFromPoint(x, y);
    this._hitCacheX = mx;
    this._hitCacheY = my;
    this._hitCacheEl = el;
    return el;
  }

  _isClickOnUI() {
    const el = this._hitTestAtMouse();
    return el?.closest('#map-ui, #big-map-overlay, #port-overlay, #overworld-map-controls, #settings-btn, #settings-modal, .map-route-selection-panel') != null;
  }

  _isMouseOverCanvas() {
    const canvas = this.renderer?.renderer?.domElement;
    if (!canvas) return false;
    const el = this._hitTestAtMouse();
    return el === canvas || canvas.contains(el);
  }

  render() {
    const { renderer, combatScene, overworldScene, hud, minimap, mapUI, bigMapUI } = this;

    if (this.state === GAME_STATES.OVERWORLD) {
      const map = overworldScene.getMap();
      const shipPos = overworldScene.getShipPosition();
      const currentIsland = overworldScene.getCurrentIsland();
      const hoveredRoute = this._hoveredRoute ?? null;
      const selectedRoute = this._selectedRoute ?? null;
      const displayRoute = selectedRoute || hoveredRoute;
      renderer.updateOverworld(map, shipPos, currentIsland, displayRoute, !!selectedRoute, this._overworldPan, this._overworldZoom, this._playerShipClass ?? 'sloop');
      mapUI.show();
      const connectedRoutes = overworldScene.getConnectedRoutes?.() ?? [];
      mapUI.update(currentIsland, false, null, displayRoute ? overworldScene.getRouteInfo(displayRoute) : null, hoveredRoute, selectedRoute, connectedRoutes, this._playerGold ?? 0);
      document.getElementById('hud')?.style.setProperty('display', 'none');
      document.getElementById('minimap-wrapper')?.style.setProperty('display', 'none');
      document.getElementById('minimap-wrapper')?.removeAttribute('data-context');
      const navControls = document.getElementById('overworld-map-controls');
      if (bigMapUI.isVisible()) {
        const chartShipPos = { x: shipPos.x, y: shipPos.y };
        bigMapUI.update(map, chartShipPos, currentIsland, null);
        navControls?.classList.remove('visible');
      } else {
        navControls?.classList.add('visible');
      }
    } else if (this.state === GAME_STATES.SAILING) {
      const map = overworldScene.getMap();
      const shipPos = overworldScene.getShipPosition();
      const sailingShip = overworldScene.getSailingShip();
      const currentIsland = overworldScene.getCurrentIsland();
      const travelRoute = overworldScene.travelRoute;
      renderer.updateSailing(sailingShip, shipPos, travelRoute);
      mapUI.show();
      mapUI.update(currentIsland, true, travelRoute, overworldScene.getRouteInfo(travelRoute), null);
      document.getElementById('hud')?.style.setProperty('display', 'flex');
      document.getElementById('overworld-map-controls')?.classList.remove('visible');
      hud.updateSailing(sailingShip);
      const minimapWrapper = document.getElementById('minimap-wrapper');
      minimapWrapper?.style.setProperty('display', 'block');
      minimapWrapper?.setAttribute('data-context', 'sailing');
      minimap.updateOverworld(map, shipPos, currentIsland, travelRoute);
      if (bigMapUI.isVisible()) {
        const chartShipPos = sailingShip
          ? { x: sailingShip.x, y: sailingShip.y }
          : shipPos;
        bigMapUI.update(map, chartShipPos, currentIsland, travelRoute);
      }
    } else if (this.state === GAME_STATES.PORT) {
      document.getElementById('hud')?.style.setProperty('display', 'none');
      document.getElementById('minimap-wrapper')?.style.setProperty('display', 'none');
      document.getElementById('map-ui')?.style.setProperty('display', 'none');
      document.getElementById('overworld-map-controls')?.classList.remove('visible');
      // PortUI DOM is event-driven; do not re-render every frame. (Improvements.md §1.3)
    } else if (this.state === GAME_STATES.COMBAT) {
      const player = combatScene.getPlayer();
      const enemies = combatScene.getEnemies();
      const projectiles = combatScene.getProjectiles();
      const rocks = combatScene.getRocks();
      const result = combatScene.getResult();
      const loot = combatScene.getLoot();
      renderer.updateCombat(player, enemies, projectiles, rocks, combatScene.getAimingSide());
      if (player) {
        renderer.updateCamera(player.x, player.y);
      }
      hud.update(player, result, loot, combatScene.getAimingSide());
      minimap.update(player, enemies, rocks, combatScene.getBounds());
      mapUI.hide();
      document.getElementById('hud')?.style.setProperty('display', 'flex');
      document.getElementById('overworld-map-controls')?.classList.remove('visible');
      document.getElementById('minimap-wrapper')?.style.setProperty('display', 'block');
      document.getElementById('minimap-wrapper')?.removeAttribute('data-context');
    }

    document.body.dataset.gameState = this.state;
    renderer.render();
  }
}
