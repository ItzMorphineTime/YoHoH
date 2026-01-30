/**
 * YoHoH — Combat scene: bounded sea arena, rocks/shoals, victory/defeat
 * GDD §8.2: encounter maps with rocks/shoals
 */

import { createShip } from '../entities/ships.js';
import { Enemy, ENEMY_TYPES } from '../entities/Enemy.js';
import { SailingSystem } from '../systems/SailingSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { COMBAT, COMBAT_ROCKS, SHIP, SHIP_CLASSES } from '../config.js';

const COMBAT_RESULT = {
  NONE: 'none',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
};

export class CombatScene {
  constructor() {
    this.bounds = { width: COMBAT.arenaWidth, height: COMBAT.arenaHeight };
    this.rocks = [];
    this.player = null;
    this.enemies = [];
    this.combatSystem = new CombatSystem();
    this.result = COMBAT_RESULT.NONE;
    this.loot = { gold: 0, salvage: 0 };
    this.aimingSide = null; // 'port' | 'starboard' | null — first press aims, second fires
  }

  init(playerShip = null) {
    if (playerShip && !playerShip.dead) {
      this.player = playerShip;
      this.player.x = 0;
      this.player.y = -80;
      this.player.rotation = 0;
      const cls = this.player.shipClassId && SHIP_CLASSES?.[this.player.shipClassId];
      this.player.maxSpeed = cls?.maxSpeed ?? SHIP.maxSpeed;
      this.player.thrust = cls?.thrust ?? SHIP.thrust;
      this.player.friction = cls?.friction ?? SHIP.friction;
      this.player.turnRate = cls?.turnRate ?? SHIP.turnRate;
      this.player.brakeMult = cls?.brakeMult ?? SHIP.brakeMult;
      this.player.highSpeedTurnPenalty = cls?.highSpeedTurnPenalty ?? SHIP.highSpeedTurnPenalty;
    } else {
      this.player = createShip('sloop', {
        x: 0,
        y: -80,
        rotation: 0,
        isPlayer: true,
      });
    }
    this.enemies = [
      new Enemy({ x: 60, y: 60, rotation: Math.PI, type: ENEMY_TYPES.RAIDER }),
      new Enemy({ x: -70, y: 50, rotation: 0, type: ENEMY_TYPES.TRADER }),
    ];
    this.combatSystem = new CombatSystem();
    this.result = COMBAT_RESULT.NONE;
    this.loot = { gold: 0, salvage: 0 };
    this.aimingSide = null;

    this.rocks = [...COMBAT_ROCKS];
  }

  update(dt, input) {
    if (this.result !== COMBAT_RESULT.NONE) return;

    // Player sailing
    SailingSystem.update(this.player, input, dt, this.bounds);

    // Enemies
    for (const e of this.enemies) {
      e.update(dt, this.player, this.combatSystem, this.bounds);
    }

    // Combat
    this.combatSystem.update(dt, this.player, this.enemies);

    // Bilge: leaks add water, bilge station pumps it out
    this.player.updateBilge(dt, this.player._stationEffects?.bilgePumpMult ?? 1);

    // Carpenter repair: hull and leaks over time
    this.player.repairTick(dt, this.player._stationEffects?.repairMult ?? 1, this.player._stationEffects?.leakRepairMult ?? 1);

    // Check victory/defeat
    if (this.player.dead) {
      this.result = COMBAT_RESULT.DEFEAT;
    } else if (this.enemies.every(e => e.dead)) {
      this.result = COMBAT_RESULT.VICTORY;
      for (const e of this.enemies) {
        this.loot.gold += e.lootGold ?? COMBAT.lootGoldDefault;
        this.loot.salvage += e.lootSalvage ?? COMBAT.lootSalvageDefault;
      }
    }
  }

  getPlayer() {
    return this.player;
  }

  getEnemies() {
    return this.enemies;
  }

  getProjectiles() {
    return this.combatSystem.getProjectiles();
  }

  getRocks() {
    return this.rocks;
  }

  getBounds() {
    return this.bounds;
  }

  getResult() {
    return this.result;
  }

  getLoot() {
    return this.loot;
  }

  firePort() {
    return this.combatSystem.fire(this.player, 'port');
  }

  fireStarboard() {
    return this.combatSystem.fire(this.player, 'starboard');
  }

  /** Aim-then-fire: first press shows aim arrow, second press fires */
  handleAimInput(input) {
    if (!this.player || this.player.dead) return;

    if (input.isKeyJustPressed('KeyQ')) {
      if (this.aimingSide === 'port') {
        this.firePort();
        this.aimingSide = null;
      } else {
        this.aimingSide = 'port';
      }
    }
    if (input.isKeyJustPressed('KeyE')) {
      if (this.aimingSide === 'starboard') {
        this.fireStarboard();
        this.aimingSide = null;
      } else {
        this.aimingSide = 'starboard';
      }
    }
  }

  getAimingSide() {
    return this.aimingSide;
  }
}

export { COMBAT_RESULT };
