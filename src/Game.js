/**
 * YoHoH — Game loop and state machine
 * Phase A: Combat scene with ship, enemies, projectiles
 */

import { GAME_STATES } from './config.js';
import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { CombatScene } from './scenes/CombatScene.js';
import { HUD } from './ui/HUD.js';
import { Minimap } from './ui/Minimap.js';

export class Game {
  constructor(container) {
    this.container = container;
    this.state = GAME_STATES.COMBAT;
    this.renderer = new Renderer(container);
    this.input = new Input();
    this.hud = new HUD(container);
    this.minimap = new Minimap(container);

    this.combatScene = new CombatScene();

    this.lastTime = 0;
    this.running = false;
  }

  init() {
    this.renderer.init();
    this.input.init(this.renderer.renderer.domElement);
    this.hud.init();
    this.minimap.init();
    this.combatScene.init();

    this.running = true;
    this.lastTime = performance.now();
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
    this.render();
    this.input.endFrame();

    requestAnimationFrame(() => this._loop());
  }

  update(dt) {
    if (this.state === GAME_STATES.COMBAT) {
      this._updateCombat(dt);
    }
  }

  _updateCombat(dt) {
    const { combatScene, input } = this;

    // Restart combat (R) when victory/defeat
    const result = combatScene.getResult();
    if ((result === 'victory' || result === 'defeat') && input.isKeyDown('KeyR')) {
      combatScene.init();
    }

    // Aim-then-fire: Q/E first press = aim arrow, second press = fire
    combatScene.handleAimInput(input);

    combatScene.update(dt, input);
  }

  render() {
    const { renderer, combatScene, hud, minimap } = this;

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

    renderer.render();
  }
}
