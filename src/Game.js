/**
 * YoHoH — Game loop and state machine
 * Phase A: Combat | Phase B: Overworld, Sailing, Save/Load
 */

import { GAME_STATES, GAME, COMBAT, OVERWORLD, ECONOMY, SHIP_CLASSES, ROUTE_MODIFIER_EFFECTS, CANCEL_VOYAGE, CREW, CORRIDOR_EVENTS, AUTOPILOT } from './config.js';
import { getRouteModifiers } from './utils/routeModifiers.js';
import { loadGoods } from './systems/EconomySystem.js';
import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { CombatScene, COMBAT_RESULT } from './scenes/CombatScene.js';
import { OverworldScene } from './scenes/OverworldScene.js';
import { PortScene } from './scenes/PortScene.js';
import { HUD } from './ui/HUD.js';
import { Minimap } from './ui/Minimap.js';
import { MapUI } from './ui/MapUI.js';
import { MapChartingUI } from './ui/MapChartingUI.js';
import { PortUI } from './ui/PortUI.js';
import { CrewUI } from './ui/CrewUI.js';                            // Port_Improvements.md §5
import { DebugOverlay } from './ui/DebugOverlay.js';                // Sailing_Improvements.md: debug
import { HelpOverlay } from './ui/HelpOverlay.js';                  // Sailing_Improvements.md #28: keybinds
import { getStationEffects, updateMoraleDecay } from './systems/CrewSystem.js';
import { saveToStorage, loadFromStorage, loadWithStatus, LOAD_STATUS } from './utils/saveSystem.js';
import { PortController } from './controllers/PortController.js';   // Improvements.md §5.1
import { CrewController } from './controllers/CrewController.js';   // Port_Improvements.md §5
import {
  log,
  ConsoleSink, OverlaySink, MemorySink, LocalStorageSink,
  parseLogUrlParam, restoreLogLevels, persistLogLevels,
} from './utils/Logger.js';
import { ledger, TYPE as LEDGER_TYPE, SOURCE as LEDGER_SOURCE } from './utils/Ledger.js';

export class Game {
  constructor(container) {
    this.container = container;
    this.state = GAME_STATES.OVERWORLD;
    this.renderer = new Renderer(container);
    this.input = new Input();
    this.hud = new HUD(container);
    this.minimap = new Minimap(container);
    this.mapUI = new MapUI(container);
    this.mapChartingUI = new MapChartingUI();

    this.combatScene = new CombatScene();
    this.overworldScene = new OverworldScene();
    this.portScene = new PortScene();
    this.portUI = new PortUI(container);
    this.debug = new DebugOverlay(); // backtick (`) toggles
    this.help = new HelpOverlay();   // ? toggles
    // Port_Improvements.md §5: CrewUI shell + controller. Init wires DOM later.
    this.crewController = null; // built in init() so it can reference portController
    this.crewUI = null;          // ditto

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
    // Sailing_Improvements.md §4.5: autopilot persistent toggle (reset per voyage).
    this._autopilotOn = false;
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
    this.mapChartingUI.init();
    this.combatScene.init();

    if (loadState?.mapJson) {
      this.overworldScene.init(loadState.mapJson, loadState.currentIslandId ?? 0);
    } else {
      this.overworldScene.init();
    }

    this.mapUI.onSaveMap = () => this.overworldScene.serializeMap();
    this.mapUI.onLoadMap = (json) => {
      // Sailing_Improvements.md "Start Sailing silent-fail" (2026-05-18):
      // clear stale route references so the player doesn't end up holding a
      // selection that points to nodes from the previous map.
      const ok = this.overworldScene.loadMap(json);
      if (ok) {
        this._selectedRoute = null;
        this._hoveredRoute = null;
      }
      return ok;
    };
    this.mapUI.onSaveGame = () => this.saveGame();
    this.mapUI.onStartSailing = (route) => this._startSailing(route);
    this.mapUI.onDeselectRoute = () => { this._selectedRoute = null; };
    this.mapUI.onEnterPort = () => this._enterPort();
    this.mapUI.onCancelVoyage = () => this._cancelVoyage(); // Sailing_Improvements.md §2.8

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

    // Port_Improvements.md §5: standalone crew overlay. CrewController routes
    // actions to PortController when docked, or directly to CrewSystem when at sea.
    this.crewController = new CrewController({ host: this._buildCrewControllerHost() });
    this.crewUI = new CrewUI({ host: this._buildCrewUIHost() });
    this.crewUI.init();
    this.debug.init();
    this.help.init();
    this.hud.onHelp = () => this.help?.toggle();

    // Logging_Improvements.md — wire the canonical Logger with four sinks.
    // Order: register sinks → apply config preset → restore persisted levels →
    // apply URL-param overrides → bridge legacy hooks.
    this._initLogger();

    log.info('game', `Game init complete; state=${this.state}`);
    this.portController.setCrewUI?.(this.crewUI); // keep crew overlay in sync with port actions
    // Tavern "Manage Crew" button → open the standalone overlay
    this.portUI.onManageCrew = () => this.crewUI?.show();

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
    // Battle_Improvements.md §2.7: decay camera shake after the frame is drawn.
    this.renderer?.tickShake?.(dt);
    this._pushDebugFrame(dt);
    this.input.endFrame();

    requestAnimationFrame(() => this._loop());
  }

  /** Push live state into the debug overlay each frame. (Sailing_Improvements.md: debug) */
  _pushDebugFrame(dt) {
    if (!this.debug?.isVisible?.()) return;
    const fps = dt > 0 ? Math.round(1 / dt) : 0;
    const lines = [];
    lines.push(`fps     : ${fps}`);
    lines.push(`state   : ${this.state}`);
    lines.push(`KeyW    : ${this.input.isKeyDown('KeyW')}    KeyS:${this.input.isKeyDown('KeyS')}  KeyA:${this.input.isKeyDown('KeyA')}  KeyD:${this.input.isKeyDown('KeyD')}`);
    lines.push(`mouse   : NDC(${this.input.mouse.x.toFixed(2)}, ${this.input.mouse.y.toFixed(2)})  leftDown=${this.input.mouse.leftDown}`);
    lines.push(`selRoute: ${this._selectedRoute ? `[${this._selectedRoute.a?.id}↔${this._selectedRoute.b?.id}]` : 'null'}`);
    lines.push(`hoverRt : ${this._hoveredRoute ? `[${this._hoveredRoute.a?.id}↔${this._hoveredRoute.b?.id}]` : 'null'}`);
    this.debug.setSection('Game', lines);

    const ow = [];
    const island = this.overworldScene?.getCurrentIsland?.();
    ow.push(`current : ${island ? `${island.name} (id ${island.id}) at (${island.position.x.toFixed(1)}, ${island.position.y.toFixed(1)})` : 'null'}`);
    ow.push(`traveling: ${this.overworldScene?.isTraveling?.()}`);
    ow.push(`travelRoute: ${this.overworldScene?.travelRoute ? `[${this.overworldScene.travelRoute.a?.id}↔${this.overworldScene.travelRoute.b?.id}]` : 'null'}`);
    const wind = this.overworldScene?.getMap?.()?.wind;
    ow.push(`wind    : ${wind ? `${(wind.angleRad * 180 / Math.PI).toFixed(0)}°` : 'none'}`);
    this.debug.setSection('Overworld', ow);

    const ship = this.overworldScene?.getSailingShip?.() ?? this.combatScene?.getPlayer?.();
    if (ship) {
      const bd = ship.getEffectiveMaxSpeedBreakdown?.();
      const s = [];
      s.push(`pos     : (${ship.x.toFixed(2)}, ${ship.y.toFixed(2)})`);
      s.push(`rotation: ${(ship.rotation * 180 / Math.PI).toFixed(1)}°`);
      s.push(`speed   : ${ship.speed.toFixed(4)}  /  effMax ${(ship.effectiveMaxSpeed ?? 0).toFixed(4)}`);
      s.push(`maxSpeed: ${ship.maxSpeed.toFixed(4)}   thrust: ${ship.thrust.toFixed(4)}   friction: ${ship.friction.toFixed(4)}`);
      if (bd) s.push(`breakdown: sail×${bd.sailMult.toFixed(2)} crew×${bd.crewMult.toFixed(2)} bilge×${bd.bilgeMult.toFixed(2)} station×${bd.stationMult.toFixed(2)}`);
      s.push(`windMult: ${ship._windMult != null ? ship._windMult.toFixed(3) : 'n/a'}`);
      s.push(`cargoLoad: ${ship._cargoLoadInfo ? `${(ship._cargoLoadInfo.ratio * 100).toFixed(0)}% (×${ship._cargoLoadInfo.maxSpeedMult.toFixed(2)} speed)` : 'none'}`);
      s.push(`hull/sail/crew: ${Math.round(ship.hull)}/${ship.hullMax}  ${Math.round(ship.sails)}/${ship.sailMax}  ${Math.round(ship.crew)}/${ship.crewMax}`);
      s.push(`bilge/leaks: ${Math.round(ship.bilgeWater ?? 0)}/${ship.bilgeWaterMax ?? 0}  leaks ${(ship.leaks ?? 0).toFixed(2)}`);
      this.debug.setSection('Ship', s);
    } else {
      this.debug.setSection('Ship', '(no active ship)');
    }

    if (this.state === GAME_STATES.SAILING) {
      const e = [];
      e.push(`encTimer : ${this._encounterTimer != null ? this._encounterTimer.toFixed(2) + 's' : 'null'}`);
      e.push(`warning  : ${this._encounterWarningTimer != null ? this._encounterWarningTimer.toFixed(2) + 's' : 'null'}`);
      e.push(`fleeAccum: ${(this._encounterFleeAccum ?? 0).toFixed(2)}s`);
      const v = this.overworldScene?.getVoyageInfo?.();
      if (v) e.push(`voyage   : ${v.distanceRemaining.toFixed(1)}/${v.distanceTotal.toFixed(1)} (${(v.progress * 100).toFixed(0)}%)  eta ${v.etaSec != null ? v.etaSec.toFixed(1) + 's' : '—'}`);
      // Sailing_Improvements.md §4.5
      const apShip = this.overworldScene?.getSailingShip?.();
      const apState = apShip?._autopilotState;
      if (this._autopilotOn) {
        const dir = [];
        if (apState?.needThrust) dir.push('W');
        if (apState?.needBrake)  dir.push('S');
        if (apState?.needLeft)   dir.push('A');
        if (apState?.needRight)  dir.push('D');
        const deltaDeg = apState ? (apState.delta * 180 / Math.PI).toFixed(1) : '—';
        e.push(`autopilot: ON  target ${apState?.targetSpeed?.toFixed(4) ?? '—'}  Δhdg ${deltaDeg}°  keys [${dir.join('') || '—'}]`);
      } else {
        e.push('autopilot: off');
      }
      this.debug.setSection('Sailing', e);
    }
    this.debug.flush();
  }

  update(dt) {
    // Sailing_Improvements.md §3.5: drain voyage state events first so any toast
    // (departed / arrived / cancelled) lands before the state-machine logic.
    // This replaces the per-frame `lastTravelRoute` diff that used to live in
    // MapUI.update — UI now reads side-effects, not inferred deltas.
    this._drainVoyageEvents();

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

  /** Sailing_Improvements.md §3.5: drain + dispatch voyage events. */
  _drainVoyageEvents() {
    const events = this.overworldScene?.consumeVoyageEvents?.() ?? [];
    for (const e of events) this._handleVoyageEvent(e);
  }

  /**
   * Sailing_Improvements.md §3.5: dispatch a single voyage event to UI.
   * `cancelled` is intentionally silent — Game._cancelVoyage shows a richer
   * toast that includes the gold/morale penalty, and `sunk` is owned by the
   * combat-defeat flow. The event still fires so future subscribers (logger,
   * achievement system) can react without going through the toast path.
   */
  _handleVoyageEvent(e) {
    if (!e?.type) return;
    switch (e.type) {
      case 'departed':
        this.mapUI?.showToast?.(`Setting sail to ${e.destination?.name ?? 'open sea'}!`);
        log.info('voyage', `departed → ${e.destination?.name}`, e);
        break;
      case 'approaching':
        this.mapUI?.showToast?.(`Land ho — ${e.destination?.name ?? 'destination'}!`, 'success');
        log.info('voyage', `approaching ${e.destination?.name}`, e);
        break;
      case 'arrived':
        this.mapUI?.showToast?.(
          `${e.early ? 'Docked at' : 'Arrived at'} ${e.destination?.name ?? 'port'}!`,
          'success',
        );
        // Charting_Improvements.md §5.4: extra fanfare for first-time discoveries
        if (e.newlyDiscovered) {
          setTimeout(() => {
            this.mapUI?.showToast?.(`📜 Chart updated — ${e.destination?.name ?? 'a new island'} added.`, 'success');
          }, 1200);
        }
        log.info('voyage', `arrived${e.early ? ' (early dock)' : ''}${e.newlyDiscovered ? ' (discovered)' : ''} → ${e.destination?.name}`, e);
        break;
      case 'cancelled':
        log.info('voyage', 'cancelled (toast handled by _cancelVoyage)', e);
        break;
      case 'sunk':
        log.warn('voyage', `sunk near ${e.destination?.name}`, e);
        break;
    }
  }

  _updateOverworld(dt) {
    const { overworldScene, input } = this;

    if (this.mapChartingUI.isVisible()) {
      if (input.isKeyJustPressed('KeyM') || input.isKeyJustPressed('Escape')) {
        this.mapChartingUI.hide();
      }
      this._hoveredRoute = null;
      return;
    }

    if (input.isKeyJustPressed('KeyM')) {
      this.mapChartingUI.toggle();
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
      log.debug('input', () => `canvas click at graph (${graphX.toFixed(1)}, ${graphY.toFixed(1)}) → route=${route ? `[${route.a?.id}↔${route.b?.id}]` : 'null'}`);
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

    // Sailing_Improvements.md §1.3: Chart Screen pauses sailing. Previously the
    // ship kept moving while the chart was open but encounters could not fire,
    // which was an inconsistent middle ground. Now: everything pauses (motion,
    // station effects, morale decay, encounters) — the chart is "planning mode".
    if (this.mapChartingUI.isVisible()) {
      if (input.isKeyJustPressed('KeyM') || input.isKeyJustPressed('Escape')) {
        this.mapChartingUI.hide();
      }
      return;
    }

    if (input.isKeyJustPressed('KeyM')) {
      this.mapChartingUI.toggle();
    }

    // Sailing_Improvements.md §4.5: autopilot keybinds + manual-override detection.
    // H = snap heading to dock (one-shot); Shift+H = toggle autopilot. WASD just-press
    // disengages autopilot so the player can grab the wheel without ceremony.
    this._handleAutopilotKeys(input);
    this._checkAutopilotOverride(input);

    // If autopilot is engaged we wrap the real input so SailingSystem reads
    // synthesized WASD that steers toward the bearing at the cruise throttle.
    const effectiveInput = this._autopilotOn ? this._buildAutopilotInput(input) : input;

    // Improvements.md §4.3: OverworldScene.update() returns the arrived ship state
    // on the single frame the voyage completes (replaces the consume-on-read side channel).
    const arrivedState = overworldScene.update(dt, effectiveInput);
    if (arrivedState) this._playerShipState = arrivedState;

    // Sailing_Improvements.md §4.2: process any corridor sub-events the ship
    // passed through this tick (flotsam loot, debris damage, whirlpool drag, etc).
    this._handleCorridorEvents(overworldScene.consumeTriggeredEvents?.() ?? []);

    // C.6: morale decays during voyage; C.6c: faster decay when undercrewed
    const maxCrew = SHIP_CLASSES?.[this._playerShipClass ?? 'sloop']?.crewMax ?? 20;
    updateMoraleDecay(this._crewRoster ?? [], dt, maxCrew);
    const sailingShip = overworldScene.getSailingShip?.();
    if (sailingShip) {
      sailingShip.setStationEffects(getStationEffects(this._crewRoster ?? [], this._playerShipClass ?? 'sloop'));
    }

    // Sailing_Improvements.md §2.3: early-dock prompt when approaching destination.
    // §3.5: arrival toast is fired by the `arrived` voyage event the next time
    // _drainVoyageEvents() runs (next tick, top of update()).
    if (overworldScene.isTraveling() && overworldScene.isApproachingDestination?.() && input.isKeyJustPressed('KeyF')) {
      const arrived = overworldScene.earlyDock?.();
      if (arrived) {
        this._playerShipState = arrived;
        this._resetEncounterTimer();
        this.state = GAME_STATES.OVERWORLD;
        return;
      }
    }

    // Improvements.md §6.3 + Sailing_Improvements.md §2.4: Poisson-process
    // encounter timer with a pre-combat warning window. When the timer crosses
    // zero we arm a warning; full thrust (W) during the window can flee.
    if (overworldScene.isTraveling()) {
      this._tickEncounter(dt, input);
    } else {
      // Sailing_Improvements.md §3.5: arrival toast is dispatched by the
      // `arrived` voyage event next tick (drained at the top of update()).
      this._resetEncounterTimer();
      this.state = GAME_STATES.OVERWORLD;
    }
  }

  /** Sailing_Improvements.md §2.4: encounter state machine — countdown → warning → combat or flee. */
  _tickEncounter(dt, input) {
    // Sailing_Improvements.md §4.3: patrolled routes double the base rate.
    const baseLambda = COMBAT?.encounterChancePerSecond ?? 0.006;
    const lambda = baseLambda * this._currentEncounterRateMult();
    const cfg = COMBAT?.encounterWarning ?? {};
    const warnDuration = cfg.durationSec ?? 3;
    const fleeFraction = cfg.fleeThrottleFraction ?? 0.7;
    const fleeChance = cfg.fleeSuccessChance ?? 0.55;

    // Warning window active: tick down + accumulate throttle, then resolve.
    if (this._encounterWarningTimer != null) {
      this._encounterWarningTimer -= dt;
      if (input.isKeyDown?.('KeyW')) this._encounterFleeAccum = (this._encounterFleeAccum ?? 0) + dt;
      if (this._encounterWarningTimer <= 0) {
        const fled = (this._encounterFleeAccum ?? 0) >= warnDuration * fleeFraction
          && Math.random() < fleeChance;
        this._encounterWarningTimer = null;
        this._encounterFleeAccum = 0;
        if (fled) {
          this.mapUI.showToast('You outran them!', 'success');
          this._encounterTimer = this._sampleEncounterDelay(lambda);
        } else {
          this._sailingPositionBeforeCombat = { ...this.overworldScene.getShipPosition() };
          this.state = GAME_STATES.COMBAT;
          log.info('state', 'SAILING → COMBAT (encounter)');
          this.combatScene.init(this.overworldScene.getSailingShip());
        }
      }
      return;
    }

    // Normal countdown.
    if (this._encounterTimer == null || !isFinite(this._encounterTimer)) {
      this._encounterTimer = this._sampleEncounterDelay(lambda);
    }
    this._encounterTimer -= dt;
    if (this._encounterTimer <= 0) {
      // Arm the warning. Toast tells the player how to flee.
      this._encounterTimer = this._sampleEncounterDelay(lambda);
      this._encounterWarningTimer = warnDuration;
      this._encounterFleeAccum = 0;
      // Sailing_Improvements.md §4.5: hand the wheel back so the player
      // controls the flee throttle. Disengage silently — the encounter toast
      // is enough noise for one beat.
      if (this._autopilotOn && AUTOPILOT?.disengageOnEncounter !== false) {
        this._autopilotOn = false;
        log.info('autopilot', 'OFF (encounter warning)');
      }
      this.mapUI.showToast(
        `⚠ Sail on the horizon! Hold W to flee (${warnDuration.toFixed(0)}s).`,
        'error',
      );
    }
  }

  /** Clear any pending encounter countdown so the next voyage resamples. (Sailing_Improvements.md §1.4 / §2.4) */
  _resetEncounterTimer() {
    this._encounterTimer = null;
    this._encounterWarningTimer = null;
    this._encounterFleeAccum = 0;
    // Sailing_Improvements.md §4.5: autopilot is voyage-scoped — clear it when
    // the encounter / voyage state machine resets.
    this._autopilotOn = false;
  }

  /**
   * Sailing_Improvements.md §4.2: apply effects + toasts for any corridor
   * sub-events the ship triggered this tick.
   */
  _handleCorridorEvents(events) {
    if (!events || events.length === 0) return;
    const cfg = CORRIDOR_EVENTS;
    const ship = this.overworldScene?.getSailingShip?.();
    for (const evt of events) {
      switch (evt.type) {
        case 'flotsam': {
          const lo = cfg?.flotsamGold?.min ?? 5;
          const hi = cfg?.flotsamGold?.max ?? 25;
          const gold = lo + Math.floor(Math.random() * (hi - lo + 1));
          // Ledger_Improvements.md §3.1
          this._adjustGold(gold, {
            source: LEDGER_SOURCE.FLOTSAM_RECOVERED,
            context: { routeId: this.overworldScene?.travelRoute ? `${this.overworldScene.travelRoute.a?.id}↔${this.overworldScene.travelRoute.b?.id}` : null },
          });
          this.mapUI?.showToast?.(`Flotsam recovered: +${gold} gold!`, 'success');
          break;
        }
        case 'debris': {
          const hullDmg = cfg?.debrisHull ?? 4;
          const leaks = cfg?.debrisLeaks ?? 0.5;
          if (ship && !ship.dead) {
            ship.takeDamage?.(hullDmg, 'hull');
            ship.leaks = (ship.leaks ?? 0) + leaks;
          }
          this.mapUI?.showToast?.(`Hit floating debris! Hull -${hullDmg}`, 'error');
          break;
        }
        case 'whirlpool': {
          const drag = cfg?.whirlpoolSpeedDrag ?? 0.4;
          if (ship) ship.speed = (ship.speed ?? 0) * drag;
          this.mapUI?.showToast?.('Caught in a whirlpool!', 'error');
          break;
        }
        case 'friendly': {
          this.mapUI?.showToast?.('A friendly sail passes by. Fair winds!', 'success');
          break;
        }
        default:
          this.mapUI?.showToast?.(`Event: ${evt.type}`, 'success');
      }
    }
  }

  /**
   * Logging_Improvements.md — set up the canonical Logger.
   *
   * Order matters:
   *   1. Register sinks (Console / Overlay / Memory / LocalStorage).
   *   2. Apply the config preset (`GAME.logging.preset`) for default levels.
   *   3. Restore any persisted user overrides from localStorage.
   *   4. Apply `?log=` URL params if present (and configured to override).
   *   5. Bridge legacy `window.__yohohDebugLog` + console.warn / .error
   *      interception so existing call sites + browser-emitted noise both
   *      route through the new pipe.
   */
  _initLogger() {
    const cfg = GAME?.logging ?? {};
    // 1. Sinks.
    log.addSink(new ConsoleSink());
    log.addSink(new OverlaySink(this.debug));
    log.addSink(new MemorySink(cfg.memoryBufferSize ?? 2048));
    log.addSink(new LocalStorageSink({
      maxEntries: cfg.localStorageMaxEntries ?? 500,
      debounceMs: cfg.localStorageDebounceMs ?? 1500,
    }));
    // 2. Preset (defaults for each sink).
    log.setPreset(cfg.preset ?? 'developer');
    // 3. Persisted user overrides.
    restoreLogLevels(log);
    // 4. URL param overrides (reproduce-this-bug links).
    if (cfg.urlParamOverridesPersisted !== false) {
      const edits = parseLogUrlParam();
      if (edits) {
        for (const e of edits) log.setLevel(e.category, e.level);
        log.info('logger', `Applied ?log= URL overrides: ${edits.length} edit(s)`);
      }
    }
    // Attach the Logger to the DebugOverlay so the level-control panel renders.
    this.debug?.attachLogger?.(log);
    // Ledger_Improvements.md — attach the Ledger so the Ledger tab populates.
    this.debug?.attachLedger?.(ledger);
    // 5. Legacy bridges — keep call sites working until they're migrated.
    if (typeof window !== 'undefined') {
      // `window.__yohohDebugLog(msg)` — used by MapUI, OverworldScene
      window.__yohohDebugLog = (msg) => log.debug('legacy', String(msg));
      // Intercept console.warn / .error so third-party + browser noise also
      // gets routed through the Logger (so it lands in dumps and the overlay).
      const origWarn = console.warn.bind(console);
      const origError = console.error.bind(console);
      console.warn = (...args) => { origWarn(...args); log.warn('console', args.map(String).join(' ')); };
      console.error = (...args) => { origError(...args); log.error('console', args.map(String).join(' ')); };
      // Window-level errors / unhandled rejections — most-likely crash signal.
      window.addEventListener('error', (e) => {
        log.error('window', `${e.message ?? 'error'} @ ${e.filename ?? '?'}:${e.lineno ?? '?'}`, e.error);
      });
      window.addEventListener('unhandledrejection', (e) => {
        log.error('window', `unhandled rejection: ${e.reason}`, e.reason);
      });
    }
    // Persist user-set levels on shutdown so a fresh load remembers them.
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', () => persistLogLevels(log));
    }
    log.onChange(() => persistLogLevels(log));
    log.info('logger', `Logger ready: preset=${log.getPreset()} sinks=${log.sinks.length}`);
    // Ledger_Improvements.md §3.1 — record the starting gold as the
    // first ledger entry so the audit trail starts from a known balance.
    ledger.record({
      type: LEDGER_TYPE.GOLD,
      source: LEDGER_SOURCE.SYSTEM_STARTING_GOLD,
      delta: this._playerGold ?? 0,
      balance: this._playerGold ?? 0,
      context: { amount: this._playerGold ?? 0 },
      state: this.state,
    });
    log.info('ledger', `Ledger ready: session=${ledger.sessionId} starting gold=${this._playerGold ?? 0}`);
  }

  /**
   * Ledger_Improvements.md §4 — single mutation point for player gold.
   * Always call this instead of writing `this._playerGold` directly.
   * Records a Ledger entry tagged with the source + context so the audit
   * trail captures every gold change.
   */
  _adjustGold(delta, opts = {}) {
    if (!delta) return;
    const before = this._playerGold ?? 0;
    this._playerGold = Math.max(0, before + delta);
    const realDelta = this._playerGold - before;
    if (realDelta === 0) return;
    ledger.record({
      type: LEDGER_TYPE.GOLD,
      source: opts.source ?? LEDGER_SOURCE.DEV_CHEAT_GRANT,
      category: opts.category,
      delta: realDelta,
      balance: this._playerGold,
      context: opts.context,
      state: this.state,
    });
  }

  /** Ledger_Improvements.md §4 — single mutation point for player infamy. */
  _adjustInfamy(delta, opts = {}) {
    if (!delta) return;
    const before = this._playerInfamy ?? 0;
    this._playerInfamy = Math.max(0, before + delta);
    ledger.record({
      type: LEDGER_TYPE.INFAMY,
      source: opts.source ?? LEDGER_SOURCE.COMBAT_VICTORY,
      category: opts.category,
      delta,
      balance: this._playerInfamy,
      context: opts.context,
      state: this.state,
    });
  }

  /** Ledger_Improvements.md §4 — single mutation point for cargo (per good). */
  _adjustCargo(goodId, delta, opts = {}) {
    if (!goodId || !delta) return;
    const cargo = this._playerCargo ?? (this._playerCargo = {});
    const before = cargo[goodId] ?? 0;
    cargo[goodId] = Math.max(0, before + delta);
    if (cargo[goodId] === 0) delete cargo[goodId];
    const realDelta = (cargo[goodId] ?? 0) - before;
    if (realDelta === 0) return;
    ledger.record({
      type: LEDGER_TYPE.CARGO,
      source: opts.source ?? 'unknown',
      category: opts.category,
      delta: realDelta,
      balance: cargo[goodId] ?? 0,
      context: { ...opts.context, good: goodId },
      state: this.state,
    });
  }

  /** Ledger_Improvements.md §4 — crew add. */
  _addCrew(crew, opts = {}) {
    if (!crew) return;
    this._crewRoster = this._crewRoster ?? [];
    this._crewRoster.push(crew);
    ledger.record({
      type: LEDGER_TYPE.CREW,
      source: opts.source ?? LEDGER_SOURCE.CREW_HIRE,
      category: opts.category,
      delta: +1,
      balance: this._crewRoster.length,
      context: { ...opts.context, crewId: crew.id, name: crew.name },
      state: this.state,
    });
  }

  /** Ledger_Improvements.md §4 — crew remove. */
  _removeCrew(crewId, opts = {}) {
    if (!crewId) return;
    const arr = this._crewRoster ?? [];
    const idx = arr.findIndex(c => c.id === crewId);
    if (idx < 0) return;
    const [removed] = arr.splice(idx, 1);
    ledger.record({
      type: LEDGER_TYPE.CREW,
      source: opts.source ?? LEDGER_SOURCE.CREW_DISMISS,
      category: opts.category,
      delta: -1,
      balance: arr.length,
      context: { ...opts.context, crewId, name: removed?.name },
      state: this.state,
    });
  }

  /**
   * Sailing_Improvements.md §4.5: handle autopilot keybinds.
   *   H        — snap ship rotation to the current bearing toward destination
   *   Shift+H  — toggle persistent autopilot (auto-steer + auto-throttle)
   *
   * Both are no-ops outside of an active voyage. The toggle refuses to engage
   * while an encounter warning is armed.
   */
  _handleAutopilotKeys(input) {
    if (!AUTOPILOT?.enabled) return;
    if (!input.isKeyJustPressed?.('KeyH')) return;
    const shift = input.isKeyDown?.('ShiftLeft') || input.isKeyDown?.('ShiftRight');
    const traveling = this.overworldScene?.isTraveling?.();
    if (!traveling) {
      this.mapUI?.showToast?.('No voyage in progress.', 'error');
      return;
    }
    if (shift) {
      // Sustained autopilot — refuse to engage during the encounter warning.
      if (this._encounterWarningTimer != null) {
        this.mapUI?.showToast?.('Cannot engage autopilot — sail on the horizon!', 'error');
        return;
      }
      this._autopilotOn = !this._autopilotOn;
      this.mapUI?.showToast?.(
        this._autopilotOn ? '⚙ Autopilot engaged — Shift+H to disengage' : 'Autopilot disengaged.',
        'success',
      );
      log.info('autopilot', `→ ${this._autopilotOn ? 'ON' : 'OFF'}`);
      return;
    }
    // One-shot heading snap.
    const info = this.overworldScene.getVoyageInfo?.();
    const ship = this.overworldScene.getSailingShip?.();
    if (!info || !ship) return;
    ship.rotation = info.bearingRad;
    const compass = this._compass8(info.bearingRad);
    this.mapUI?.showToast?.(`Heading set ${compass} (${Math.round((info.bearingRad * 180 / Math.PI + 360) % 360)}°).`, 'success');
    log.info('autopilot', `heading snap → ${compass}`);
  }

  /**
   * Sailing_Improvements.md §4.5: any manual WASD just-press disengages autopilot.
   * The input.isKeyJustPressed check reads the REAL prevKeys map (which the
   * autopilot wrapper never mutates), so the autopilot's synthesized presses
   * cannot trip this guard.
   */
  _checkAutopilotOverride(input) {
    if (!this._autopilotOn) return;
    if (input.isKeyJustPressed?.('KeyW')
        || input.isKeyJustPressed?.('KeyA')
        || input.isKeyJustPressed?.('KeyS')
        || input.isKeyJustPressed?.('KeyD')) {
      this._autopilotOn = false;
      this.mapUI?.showToast?.('Autopilot disengaged (manual override).', 'success');
      log.info('autopilot', 'OFF (manual override)');
    }
  }

  /**
   * Sailing_Improvements.md §4.5: build a thin wrapper around the real input
   * that overrides W/A/S/D with values derived from voyage geometry so the
   * existing SailingSystem._applyControls can steer the ship without any
   * special-case branching downstream. All other input methods pass through
   * to the real input via Proxy so any future caller still gets the right
   * behaviour (mouse, just-press, etc).
   */
  _buildAutopilotInput(realInput) {
    const ship = this.overworldScene?.getSailingShip?.();
    const info = this.overworldScene?.getVoyageInfo?.();
    if (!ship || !info) return realInput; // safety: nothing to autopilot

    const cfg = AUTOPILOT ?? {};
    const targetFrac = cfg.targetSpeedFraction ?? 0.7;
    const headingDeadzone = cfg.headingDeadzoneRad ?? 0.04;
    const brakeOver = cfg.brakeDeadzoneFraction ?? 1.05;

    const windMult = ship._windMult ?? 1;
    const effMax = (ship.effectiveMaxSpeed ?? ship.maxSpeed ?? 0) * windMult;
    const targetSpeed = effMax * targetFrac;

    // Throttle: thrust while below target; brake hard if we drift well over.
    const needThrust = ship.speed < targetSpeed;
    const needBrake = ship.speed > targetSpeed * brakeOver;

    // Heading: pick port/starboard based on signed delta to bearing.
    const delta = info.headingDeltaRad ?? 0;
    const needLeft = delta < -headingDeadzone;
    const needRight = delta > headingDeadzone;

    // Stash for HUD / debug overlay.
    ship._autopilotState = { needThrust, needBrake, needLeft, needRight, targetSpeed, delta };

    return new Proxy(realInput, {
      get(target, prop) {
        if (prop === 'isKeyDown') {
          return (code) => {
            switch (code) {
              case 'KeyW': return needThrust;
              case 'KeyS': return needBrake;
              case 'KeyA': return needLeft;
              case 'KeyD': return needRight;
              default:     return target.isKeyDown(code);
            }
          };
        }
        const v = Reflect.get(target, prop, target);
        return typeof v === 'function' ? v.bind(target) : v;
      },
    });
  }

  /** 8-point compass label for a bearing in radians (sailing convention). */
  _compass8(angleRad) {
    const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const deg = ((angleRad ?? 0) * 180 / Math.PI + 360) % 360;
    return labels[Math.round(deg / 45) % 8];
  }

  /**
   * Cancel an in-progress voyage and return to the OVERWORLD at the origin
   * island. Persists the current sailing-ship state (so leaks/hull damage carry
   * over) and clears the encounter timer. (Sailing_Improvements.md §2.8)
   *
   * Sailing_Improvements.md #27: applies a small penalty so cancelling isn't free:
   *   - subtract `CANCEL_VOYAGE.goldCost` gold (wasted supplies)
   *   - reduce each crew's morale by `moraleLossPerCrew`
   */
  _cancelVoyage() {
    if (this.state !== GAME_STATES.SAILING || !this.overworldScene.isTraveling()) return;
    // Snapshot ship state before tearing down the sailing ship.
    const sailingShip = this.overworldScene.getSailingShip?.();
    if (sailingShip) {
      this._playerShipState = {
        hull: sailingShip.hull, hullMax: sailingShip.hullMax,
        sails: sailingShip.sails, sailMax: sailingShip.sailMax,
        crew: sailingShip.crew, crewMax: sailingShip.crewMax,
        bilgeWater: sailingShip.bilgeWater, bilgeWaterMax: sailingShip.bilgeWaterMax,
        leaks: sailingShip.leaks,
      };
    }
    // Apply penalties — Ledger_Improvements.md §3.1
    const goldCost = Math.min(CANCEL_VOYAGE?.goldCost ?? 0, this._playerGold ?? 0);
    if (goldCost > 0) {
      this._adjustGold(-goldCost, {
        source: LEDGER_SOURCE.CANCEL_VOYAGE_PENALTY,
        context: {
          routeId: this.overworldScene?.travelRoute
            ? `${this.overworldScene.travelRoute.a?.id}↔${this.overworldScene.travelRoute.b?.id}`
            : null,
          crewMoraleLossPerCrew: CANCEL_VOYAGE?.moraleLossPerCrew ?? 0,
        },
      });
    }
    const moraleLoss = CANCEL_VOYAGE?.moraleLossPerCrew ?? 0;
    const moraleMin = CREW?.moraleMin ?? 0.2;
    if (moraleLoss > 0) {
      for (const c of this._crewRoster ?? []) {
        c.morale = Math.max(moraleMin, (c.morale ?? 1) - moraleLoss);
      }
    }

    this.overworldScene.cancelTravel();
    this._resetEncounterTimer();
    const parts = ['Turned back to the last island'];
    if (goldCost > 0) parts.push(`-${goldCost} gold`);
    if (moraleLoss > 0 && (this._crewRoster?.length ?? 0) > 0) parts.push(`crew morale -${Math.round(moraleLoss * 100)}%`);
    this.mapUI.showToast(parts.join(' · ') + '.', 'success');
    this.state = GAME_STATES.OVERWORLD;
  }

  /** Sample an Exp(λ) waiting time for the next encounter. (Improvements.md §6.3) */
  _sampleEncounterDelay(lambda) {
    if (!lambda || lambda <= 0) return Infinity;
    // Inverse-CDF sampling: -ln(U) / λ where U ∈ (0,1].
    const u = Math.max(1e-9, Math.random());
    return -Math.log(u) / lambda;
  }

  /**
   * Sailing_Improvements.md §4.3: route-modifier-driven multiplier on the
   * encounter rate (e.g. patrolled routes have 2× rate). Stacks multiplicatively.
   */
  _currentEncounterRateMult() {
    const edge = this.overworldScene?.travelRoute;
    if (!edge) return 1;
    const mods = getRouteModifiers(edge) ?? [];
    let mult = 1;
    for (const m of mods) {
      const eff = ROUTE_MODIFIER_EFFECTS?.[m];
      if (eff?.encounterRateMult) mult *= eff.encounterRateMult;
    }
    return mult;
  }

  _updateCombat(dt) {
    const { combatScene, input } = this;

    const result = combatScene.getResult();
    // Battle_Improvements.md §1.4: dev-only restart, guarded by isKeyJustPressed
    // so holding R doesn't loop fresh combats every frame. The production game
    // routes defeat through the proper continue/load flow (see §2.9 in backlog).
    if ((result === COMBAT_RESULT.VICTORY || result === COMBAT_RESULT.DEFEAT)
        && input.isKeyJustPressed('KeyR')
        && GAME?.devCheats?.combatRestart === true) {
      combatScene.init();
    }
    // Battle_Improvements.md §1.5: COMBAT_RESULT enum instead of string literals.
    if (result === COMBAT_RESULT.VICTORY && input.isKeyJustPressed('Escape')) {
      const loot = combatScene.getLoot();
      // Ledger_Improvements.md §3.1 — combat loot
      if (loot?.gold) {
        this._adjustGold(loot.gold, {
          source: LEDGER_SOURCE.COMBAT_LOOT,
          context: {
            enemyCount: this.combatScene?.getEnemies?.()?.length ?? 0,
            salvage: loot?.salvage ?? 0,
          },
        });
      }
      if (this.overworldScene.isTraveling()) {
        const ship = this.overworldScene.getSailingShip();
        const pos = this._sailingPositionBeforeCombat;
        if (ship && pos) {
          ship.x = pos.x;
          ship.y = pos.y;
          // Battle_Improvements.md §1.3: swap physics back to sailing-prefix on
          // return to SAILING. Symmetric counterpart to CombatScene.init's
          // applyClassPhysics({ useSailing: false }).
          ship.speed = 0;
          ship.applyClassPhysics?.({ useSailing: true });
        }
        this.state = GAME_STATES.SAILING;
        log.info('state', 'COMBAT → SAILING (victory, resume voyage)');
      } else {
        this.state = GAME_STATES.OVERWORLD;
        log.info('state', 'COMBAT → OVERWORLD (victory, no travel)');
      }
    }
    if (result === COMBAT_RESULT.DEFEAT && input.isKeyJustPressed('Escape')) {
      this.overworldScene.cancelTravel();
      this._resetEncounterTimer();
      this.state = GAME_STATES.OVERWORLD;
      log.info('state', 'COMBAT → OVERWORLD (defeat)');
    }

    combatScene.handleAimInput(input);
    combatScene.update(dt, input);

    // Battle_Improvements.md §2.11: drain combat events to toasts.
    // Battle_Improvements.md §2.7: `player_hit` also triggers damage feedback.
    const combatEvents = combatScene.consumeCombatEvents?.() ?? [];
    for (const e of combatEvents) this._handleCombatEvent(e);
  }

  /**
   * Battle_Improvements.md §2.7: damage feedback. Three concurrent cues —
   *   • camera shake (amplitude scaled by damage)
   *   • full-screen red vignette (one-shot CSS class)
   *   • HUD hull bar red flash (one-shot CSS class)
   * All time-bounded; reset by removing the class after its CSS duration.
   */
  _onPlayerHit(evt) {
    const dmg = Math.max(0, evt?.damage ?? 0);
    if (dmg <= 0) return;
    // Camera shake — amplitude scales sub-linearly with damage so a single
    // grazing shot doesn't rattle as much as a critical broadside.
    const amp = Math.min(4, 0.5 + dmg * 0.08);
    const dur = Math.min(0.4, 0.15 + dmg * 0.005);
    this.renderer?.triggerShake?.(amp, dur);
    // Vignette flash — fade-out is CSS-driven; we just toggle the class.
    const vignette = document.getElementById('combat-damage-vignette');
    if (vignette) {
      vignette.classList.remove('combat-damage-flash');
      // Re-trigger animation by forcing a reflow before re-adding the class.
      void vignette.offsetWidth;
      vignette.classList.add('combat-damage-flash');
      clearTimeout(this._vignetteTimer);
      this._vignetteTimer = setTimeout(() => vignette.classList.remove('combat-damage-flash'), 80);
    }
    // HUD hull bar flash
    const hullBar = document.getElementById('hud-hull-bar');
    if (hullBar) {
      hullBar.classList.remove('combat-bar-hit');
      void hullBar.offsetWidth;
      hullBar.classList.add('combat-bar-hit');
      clearTimeout(this._hullFlashTimer);
      this._hullFlashTimer = setTimeout(() => hullBar.classList.remove('combat-bar-hit'), 450);
    }
  }

  /** Battle_Improvements.md §2.11: dispatch a single combat event. */
  _handleCombatEvent(e) {
    if (!e?.type) return;
    switch (e.type) {
      case 'combat_start':
        this.mapUI?.showToast?.(`⚔ Combat — ${e.enemyCount} ${e.enemyCount === 1 ? 'enemy' : 'enemies'}!`, 'error');
        break;
      case 'enemy_sunk':
        this.mapUI?.showToast?.(`${e.name ?? 'Enemy'} sunk!`, 'success');
        break;
      case 'player_hit':
        // Battle_Improvements.md §2.7: trigger damage feedback (camera shake +
        // vignette + HUD pulse) — landed by the next item in this pass.
        this._onPlayerHit?.(e);
        break;
      case 'victory':
        this.mapUI?.showToast?.(
          `Victory! +${e.loot?.gold ?? 0} gold, +${e.loot?.salvage ?? 0} salvage`,
          'success',
        );
        break;
      case 'defeat':
        this.mapUI?.showToast?.('Defeat — your ship was sunk!', 'error');
        break;
    }
  }

  /**
   * Build the host object passed to CrewUI. Captures `this` via arrow functions
   * so the UI sees live Game state on every read. When docked, reads pull from
   * the active PortScene (which holds the in-port copy of roster/cargo/gold);
   * elsewhere they pull from Game's persistent fields. (Port_Improvements.md §5)
   */
  _buildCrewUIHost() {
    const atPort = () => this.state === GAME_STATES.PORT;
    return {
      // Data — state-aware to avoid showing a stale Game-side copy while docked
      getCrewRoster: () => atPort() ? (this.portScene.getCrewRoster() ?? []) : (this._crewRoster ?? []),
      getShipClassId: () => atPort() ? (this.portScene.getShipClassId?.() ?? this._playerShipClass ?? 'sloop') : (this._playerShipClass ?? 'sloop'),
      getPlayerCargo: () => atPort() ? (this.portScene.getCargo?.() ?? {}) : (this._playerCargo ?? {}),
      getMaxCrew: () => {
        const cls = atPort() ? this.portScene.getShipClassId?.() : this._playerShipClass;
        return SHIP_CLASSES?.[cls ?? 'sloop']?.crewMax ?? 20;
      },
      isAtPort: atPort,
      getGold: () => atPort() ? (this.portScene.getGold?.() ?? 0) : (this._playerGold ?? 0),
      // Behaviour — delegated to CrewController so the same UI works at sea or in port
      onAssignStation: (crewId, station) => this.crewController?.onAssignStation(crewId, station),
      onDismissCrew: (crewId) => this.crewController?.onDismissCrew(crewId),
      onServeRum: () => this.crewController?.onServeRum(),
      onHireCrew: () => this.crewController?.onHireCrew(),
    };
  }

  /** Build the host object passed to CrewController. (Port_Improvements.md §5) */
  _buildCrewControllerHost() {
    const atPort = () => this.state === GAME_STATES.PORT;
    return {
      getState: () => this.state,
      // Same state-aware sourcing as CrewUI — actions mutate the right copy.
      getCrewRoster: () => atPort() ? (this.portScene.getCrewRoster() ?? []) : (this._crewRoster ?? []),
      getShipClassId: () => atPort() ? (this.portScene.getShipClassId?.() ?? this._playerShipClass ?? 'sloop') : (this._playerShipClass ?? 'sloop'),
      getPlayerCargo: () => atPort() ? (this.portScene.getCargo?.() ?? {}) : (this._playerCargo ?? {}),
      getGold: () => atPort() ? (this.portScene.getGold?.() ?? 0) : (this._playerGold ?? 0),
      setGold: (v) => {
        if (atPort()) this.portScene.setGold?.(v);
        else this._playerGold = Math.max(0, v);
      },
      getSailingShip: () => this.overworldScene?.getSailingShip?.() ?? null,
      getCombatPlayerShip: () => this.combatScene?.getPlayer?.() ?? null,
      getPortScene: () => this.portScene,
      getPortController: () => this.portController,
      getPortUI: () => this.portUI,
      getCrewUI: () => this.crewUI,
    };
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
    if (this.state !== GAME_STATES.OVERWORLD || this.mapChartingUI.isVisible()) return;
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
    // Ledger_Improvements.md §3.1 — dock fee on port entry.
    if (dockFee > 0 && (this._playerGold ?? 0) > 0) {
      const realFee = Math.min(dockFee, this._playerGold ?? 0);
      this._adjustGold(-realFee, {
        source: LEDGER_SOURCE.DOCK_FEE,
        context: { islandId: currentIsland.id, islandName: currentIsland.name, fee: dockFee, paid: realFee },
      });
    }
    this.portScene.init(currentIsland, [...(this._crewRoster ?? [])], this._playerGold ?? 0, this._playerShipClass ?? 'sloop', this._playerShipState ?? null, { ...(this._playerCargo ?? {}) }, { ...(this._playerUpgrades ?? {}) }, this._playerInfamy ?? 0, [...(this._playerUnlockedShipClasses ?? ['sloop'])]);
    this.portScene.dockFeePaid = dockFee;
    this.portUI.show(this.portScene);
    this.state = GAME_STATES.PORT;
    log.info('state', `OVERWORLD → PORT (${currentIsland.name ?? currentIsland.id})`);
    this.crewUI?.update?.(); // Port_Improvements.md §5: re-source roster from portScene
  }

  _leavePort() {
    // Ledger_Improvements.md §3 — reconcile the net economic delta from the port
    // session. Individual port transactions (buy, sell, repair, upgrade, hire)
    // happen inside PortController and currently aren't individually ledgered
    // (X2 phase will hook those). Until then, capture the net delta here as a
    // single bookkeeping entry so the audit trail isn't blind to port time.
    const newCrew  = [...(this.portScene.getCrewRoster() ?? [])];
    const newGold  = this.portScene.getGold();
    const newCargo = this.portScene.getCargo?.() ?? this._playerCargo ?? {};
    const oldGold  = this._playerGold ?? 0;
    const goldDelta = newGold - oldGold;
    this._crewRoster = newCrew;
    this._playerGold = newGold;
    this._playerShipState = this.portScene.getShipState?.() ?? this._playerShipState;
    this._playerUpgrades = this.portScene.getUpgrades?.() ?? this._playerUpgrades;
    this._playerCargo = newCargo;
    if (goldDelta !== 0) {
      // Net entry — not perfect (loses per-transaction granularity) but better
      // than silent. PortController hooks (X2) will replace this with per-tx records.
      ledger.record({
        type: LEDGER_TYPE.GOLD,
        source: 'port_net_session',  // intentionally NOT in SOURCE catalogue — marks "to-be-decomposed"
        category: 'port',
        delta: goldDelta,
        balance: newGold,
        context: { note: 'Net change across port session — decompose in PortController (Phase X2)' },
        state: GAME_STATES.PORT,
      });
    }
    this.portUI.hide();
    this.state = GAME_STATES.OVERWORLD;
    log.info('state', `PORT → OVERWORLD (gold Δ ${goldDelta >= 0 ? '+' : ''}${goldDelta})`);
    this.crewUI?.update?.(); // Port_Improvements.md §5: re-source roster from Game post-leave
  }

  // Port-screen handlers now live on PortController (Improvements.md §5.1).
  // Game keeps _enterPort / _leavePort because they straddle state-machine
  // transitions; everything in between is the controller's responsibility.

  _updatePort(_dt) {
    // PortUI is updated only when state changes (via _onPort* handlers and on entry via show()).
    // No per-frame work here — the port is otherwise static. (Improvements.md §1.3)
  }

  /**
   * Sailing_Improvements.md "Start Sailing silent-fail" (2026-05-18):
   * Every failure path now surfaces a specific toast so the player can
   * see *why* sailing didn't start. Previously these returned `false`
   * silently and only emitted to the debug overlay (which most players
   * don't have open).
   */
  _startSailing(route) {
    log.debug('sailing', () => `_startSailing called: route=${route ? `[${route.a?.id}↔${route.b?.id}]` : 'null'}`);
    if (!route) {
      log.warn('sailing', 'startSailing fail: no route passed in');
      this.mapUI?.showToast?.('Select a route from your island first.', 'error');
      return false;
    }
    const currentIsland = this.overworldScene.getCurrentIsland();
    if (!currentIsland) {
      log.warn('sailing', 'startSailing fail: no current island');
      this.mapUI?.showToast?.('No island to set sail from.', 'error');
      return false;
    }
    const { a, b } = route;
    if (a !== currentIsland && b !== currentIsland) {
      // Stale `_selectedRoute` reference from a previous map (load / new game).
      log.warn('sailing', `startSailing fail: route [${a?.id}↔${b?.id}] doesn't touch currentIsland=${currentIsland.id}`);
      this.mapUI?.showToast?.('That route doesn\'t start from your island. Pick another.', 'error');
      this._selectedRoute = null;
      return false;
    }
    const target = a === currentIsland ? b : a;
    if (!target) {
      log.warn('sailing', 'startSailing fail: route has no opposite endpoint');
      this.mapUI?.showToast?.('Route is malformed — no destination.', 'error');
      this._selectedRoute = null;
      return false;
    }
    const suppliesCost = ECONOMY?.suppliesCost ?? 0;
    const gold = this._playerGold ?? 0;
    if (suppliesCost > 0 && gold < suppliesCost) {
      log.warn('sailing', `startSailing fail: need ${suppliesCost} gold for supplies, have ${gold}`);
      this.mapUI?.showToast?.(
        `Need ${suppliesCost} gold for supplies — you have ${gold}.`,
        'error',
      );
      return false;
    }
    const result = this.overworldScene.startTravel(
      target,
      this._crewRoster ?? [],
      this._playerShipClass ?? 'sloop',
      this._playerShipState ?? null,
      this._playerUpgrades ?? {},
      this._playerCargo ?? {}, // Sailing_Improvements.md §4.4
    );
    const ok = result && result.ok;
    if (ok) {
      // Ledger_Improvements.md §3.1 — supplies cost
      if (suppliesCost > 0) {
        this._adjustGold(-suppliesCost, {
          source: LEDGER_SOURCE.SUPPLIES_COST,
          context: { routeId: `${currentIsland.id}↔${target.id}`, cost: suppliesCost },
        });
      }
      this._selectedRoute = null;
      this.state = GAME_STATES.SAILING;
      log.info('state', `OVERWORLD → SAILING (route [${currentIsland.id}→${target.id}])`);
      return true;
    }
    log.warn('sailing', `startSailing fail: startTravel returned ${result?.reason ?? 'unknown'}`, result);
    this._showStartTravelFailureToast(result);
    return false;
  }

  /** Map OverworldScene.startTravel failure reasons → player-facing toast. */
  _showStartTravelFailureToast(result) {
    const reason = result?.reason ?? 'unknown';
    const detail = result?.detail;
    switch (reason) {
      case 'already-traveling':
        this.mapUI?.showToast?.(`Voyage already in progress${detail ? ` (${detail})` : ''}. Cancel it first.`, 'error');
        break;
      case 'no-current-island':
        this.mapUI?.showToast?.('Lost track of your current island. Try reloading.', 'error');
        break;
      case 'no-edge':
        this.mapUI?.showToast?.(`No route ${detail ? `(${detail})` : 'to that island'}. Pick another.`, 'error');
        this._selectedRoute = null;
        break;
      case 'create-ship-failed':
        this.mapUI?.showToast?.(`Couldn't ready your ship: ${detail ?? 'unknown error'}.`, 'error');
        break;
      default:
        this.mapUI?.showToast?.(`Couldn't set sail (${reason}). Check the debug overlay.`, 'error');
    }
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
    return el?.closest('#map-ui, #map-charting-overlay, #port-overlay, #overworld-map-controls, #settings-btn, #settings-modal, .map-route-selection-panel') != null;
  }

  _isMouseOverCanvas() {
    const canvas = this.renderer?.renderer?.domElement;
    if (!canvas) return false;
    const el = this._hitTestAtMouse();
    return el === canvas || canvas.contains(el);
  }

  render() {
    const { renderer, combatScene, overworldScene, hud, minimap, mapUI, mapChartingUI } = this;

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
      if (mapChartingUI.isVisible()) {
        const chartShipPos = { x: shipPos.x, y: shipPos.y };
        mapChartingUI.update(map, chartShipPos, currentIsland, null);
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
      // Sailing_Improvements.md #25: voyage info also used by renderer for the approach ring
      const voyageInfo = overworldScene.getVoyageInfo?.() ?? null;
      // Sailing_Improvements.md §4.2: corridor events render as pulsing circles
      const corridorEvents = overworldScene.getCorridorEvents?.() ?? null;
      renderer.updateSailing(sailingShip, shipPos, travelRoute, voyageInfo, corridorEvents);
      mapUI.show();
      mapUI.update(currentIsland, true, travelRoute, overworldScene.getRouteInfo(travelRoute), null);
      document.getElementById('hud')?.style.setProperty('display', 'flex');
      document.getElementById('overworld-map-controls')?.classList.remove('visible');
      // Sailing_Improvements.md §2.1 + §2.5 + §4.5: voyage info + crew + autopilot status
      hud.updateSailing(
        sailingShip,
        voyageInfo,
        {
          roster: this._crewRoster ?? [],
          shipClassId: this._playerShipClass ?? 'sloop',
          autopilot: this._autopilotOn === true,
        },
      );
      const minimapWrapper = document.getElementById('minimap-wrapper');
      minimapWrapper?.style.setProperty('display', 'block');
      minimapWrapper?.setAttribute('data-context', 'sailing');
      // Sailing_Improvements.md #26: telegraph enemy on minimap during encounter warning
      const telegraph = { active: this._encounterWarningTimer != null && this._encounterWarningTimer > 0 };
      minimap.updateOverworld(map, shipPos, currentIsland, travelRoute, telegraph, corridorEvents);
      if (mapChartingUI.isVisible()) {
        const chartShipPos = sailingShip
          ? { x: sailingShip.x, y: sailingShip.y }
          : shipPos;
        // Charting_Improvements.md §1.4 / §1.5: corridor events + voyage strip on the chart
        mapChartingUI.update(map, chartShipPos, currentIsland, travelRoute, corridorEvents, voyageInfo, sailingShip);
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
      // Battle_Improvements.md §2.6: pool of short-lived FX (muzzle / splash / hit)
      const combatEffects = combatScene.getEffects?.() ?? null;
      renderer.updateCombat(player, enemies, projectiles, rocks, combatScene.getAimingSide(), combatEffects);
      if (player) {
        renderer.updateCamera(player.x, player.y);
      }
      // Battle_Improvements.md §2.2 / §2.10: pass enemies so HUD can render the
      // "⚔ Sink all enemies (n/total)" objective sub-line + future per-enemy info.
      hud.update(player, result, loot, combatScene.getAimingSide(), { enemies });
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
