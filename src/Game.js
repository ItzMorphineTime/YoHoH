/**
 * YoHoH — Game loop and state machine
 * Phase A: Combat | Phase B: Overworld, Sailing, Save/Load
 */

import { GAME_STATES, GAME, COMBAT, OVERWORLD } from './config.js';
import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { CombatScene } from './scenes/CombatScene.js';
import { OverworldScene } from './scenes/OverworldScene.js';
import { HUD } from './ui/HUD.js';
import { Minimap } from './ui/Minimap.js';
import { MapUI } from './ui/MapUI.js';
import { BigMapUI } from './ui/BigMapUI.js';

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

    this.lastTime = 0;
    this.running = false;
    this._hoveredRoute = null;
    this._selectedRoute = null;
    this._overworldPan = { x: 0, y: 0 };
    this._overworldZoom = 1;
    this._overworldDragStart = null;
  }

  init() {
    this.renderer.init();
    this.input.init(this.renderer.renderer.domElement);
    this.hud.init();
    this.minimap.init();
    this.mapUI.init();
    this.bigMapUI.init();
    this.combatScene.init();
    this.overworldScene.init();

    this.mapUI.onSaveMap = () => this.overworldScene.serializeMap();
    this.mapUI.onLoadMap = (json) => this.overworldScene.loadMap(json);
    this.mapUI.onStartSailing = (route) => this._startSailing(route);
    this.mapUI.onDeselectRoute = () => { this._selectedRoute = null; };
    this._initOverworldNavControls();
    this._initSettings();

    const canvas = this.renderer?.renderer?.domElement;
    canvas?.addEventListener('wheel', (e) => this._onOverworldWheel(e), { passive: false });

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

    overworldScene.update(dt, input);

    const encounterChance = COMBAT?.encounterChancePerSecond ?? 0.006;
    if (overworldScene.isTraveling() && Math.random() < encounterChance * dt) {
      this._sailingPositionBeforeCombat = { ...overworldScene.getShipPosition() };
      this.state = GAME_STATES.COMBAT;
      this.combatScene.init(overworldScene.getSailingShip());
    } else if (!overworldScene.isTraveling()) {
      this.state = GAME_STATES.OVERWORLD;
    }
  }

  _updateCombat(dt) {
    const { combatScene, input } = this;

    const result = combatScene.getResult();
    if ((result === 'victory' || result === 'defeat') && input.isKeyDown('KeyR')) {
      combatScene.init();
    }
    if (result === 'victory' && input.isKeyJustPressed('Escape')) {
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

  _startSailing(route) {
    const currentIsland = this.overworldScene.getCurrentIsland();
    if (!route || !currentIsland) return false;
    const { a, b } = route;
    const target = a === currentIsland ? b : a;
    if (!target) return false;
    const ok = this.overworldScene.startTravel(target);
    if (ok) {
      this._selectedRoute = null;
      this.state = GAME_STATES.SAILING;
    }
    return ok;
  }

  _isClickOnUI() {
    const canvas = this.renderer?.renderer?.domElement;
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + (this.input.mouse.x + 1) / 2 * rect.width;
    const y = rect.top + (1 - this.input.mouse.y) / 2 * rect.height;
    const el = document.elementFromPoint(x, y);
    return el?.closest('#map-ui, #big-map-overlay, #overworld-map-controls, #settings-btn, #settings-modal, .map-route-selection-panel') != null;
  }

  _isMouseOverCanvas() {
    const canvas = this.renderer?.renderer?.domElement;
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + (this.input.mouse.x + 1) / 2 * rect.width;
    const y = rect.top + (1 - this.input.mouse.y) / 2 * rect.height;
    const el = document.elementFromPoint(x, y);
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
      renderer.updateOverworld(map, shipPos, currentIsland, displayRoute, !!selectedRoute, this._overworldPan, this._overworldZoom);
      mapUI.show();
      const connectedRoutes = overworldScene.getConnectedRoutes?.() ?? [];
      mapUI.update(currentIsland, false, null, displayRoute ? overworldScene.getRouteInfo(displayRoute) : null, hoveredRoute, selectedRoute, connectedRoutes);
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
