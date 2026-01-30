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

    this.running = true;
    this.lastTime = performance.now();
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

    if (input.isMouseJustPressed() && !this._isClickOnUI()) {
      overworldScene.handleClick(graphX, graphY, 1);
    }

    overworldScene.update(dt, input);

    if (overworldScene.isTraveling()) {
      this.state = GAME_STATES.SAILING;
    }
  }

  _updateSailing(dt) {
    const { overworldScene, input } = this;

    if (this.bigMapUI.isVisible()) {
      if (input.isKeyJustPressed('KeyM') || input.isKeyJustPressed('Escape')) {
        this.bigMapUI.hide();
      }
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

  _isClickOnUI() {
    const canvas = this.renderer?.renderer?.domElement;
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + (this.input.mouse.x + 1) / 2 * rect.width;
    const y = rect.top + (1 - this.input.mouse.y) / 2 * rect.height;
    const el = document.elementFromPoint(x, y);
    return el?.closest('#map-ui, #big-map-overlay') != null;
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
      renderer.updateOverworld(map, shipPos, currentIsland, hoveredRoute);
      mapUI.show();
      mapUI.update(currentIsland, false, hoveredRoute, hoveredRoute ? overworldScene.getRouteInfo(hoveredRoute) : null);
      document.getElementById('hud')?.style.setProperty('display', 'none');
      document.getElementById('minimap-wrapper')?.style.setProperty('display', 'none');
      if (bigMapUI.isVisible()) {
        bigMapUI.update(map, shipPos, currentIsland, null);
      }
    } else if (this.state === GAME_STATES.SAILING) {
      const map = overworldScene.getMap();
      const shipPos = overworldScene.getShipPosition();
      const sailingShip = overworldScene.getSailingShip();
      const currentIsland = overworldScene.getCurrentIsland();
      const travelRoute = overworldScene.travelRoute;
      renderer.updateSailing(sailingShip, shipPos, travelRoute);
      mapUI.show();
      mapUI.update(currentIsland, true, travelRoute, overworldScene.getRouteInfo(travelRoute));
      document.getElementById('hud')?.style.setProperty('display', 'flex');
      hud.updateSailing(sailingShip);
      document.getElementById('minimap-wrapper')?.style.setProperty('display', 'block');
      minimap.updateOverworld(map, shipPos, currentIsland, travelRoute);
      if (bigMapUI.isVisible()) {
        bigMapUI.update(map, shipPos, currentIsland, travelRoute);
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
      document.getElementById('minimap-wrapper')?.style.setProperty('display', 'block');
    }

    renderer.render();
  }
}
