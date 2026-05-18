/**
 * YoHoH — Combat scene: bounded sea arena, rocks/shoals, victory/defeat
 * GDD §8.2: encounter maps with rocks/shoals
 */

import { createShip } from '../entities/ships.js';
import { Enemy, ENEMY_TYPES } from '../entities/Enemy.js';
import { SailingSystem } from '../systems/SailingSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { COMBAT, COMBAT_ROCKS } from '../config.js';

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
    // Battle_Improvements.md §2.11: event queue — drained by Game each tick and
    // routed to toasts / future combat log panel. Event shape:
    //   { type: 'enemy_sunk' | 'combat_start' | 'victory' | 'defeat',
    //     name?: string, loot?: { gold, salvage } }
    this._combatEvents = [];
    this._prevPlayerHull = null;
  }

  init(playerShip = null) {
    // Battle_Improvements.md §1.3: keep the SAME ship instance so OverworldScene's
    // `sailingShip` handle survives, then re-derive physics via the centralised
    // `applyClassPhysics({ useSailing: false })`. The old code reached into
    // SHIP_CLASSES directly and skipped the prefix lookup + upgrade multipliers
    // (same shadowing-bug class as Sailing §1.2).
    const spawnX = COMBAT?.playerSpawnX ?? 0;
    const spawnY = COMBAT?.playerSpawnY ?? -80;
    const spawnRot = COMBAT?.playerSpawnRotation ?? 0;
    if (playerShip && !playerShip.dead) {
      this.player = playerShip;
      this.player.x = spawnX;
      this.player.y = spawnY;
      this.player.rotation = spawnRot;
      this.player.speed = 0;
      this.player.applyClassPhysics({ useSailing: false });
    } else {
      this.player = createShip('sloop', {
        x: spawnX,
        y: spawnY,
        rotation: spawnRot,
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

    // Battle_Improvements.md §2.11: announce the encounter via the event queue
    this._combatEvents = [{ type: 'combat_start', enemyCount: this.enemies.length }];
    this._prevPlayerHull = this.player?.hull ?? null;
  }

  update(dt, input) {
    if (this.result !== COMBAT_RESULT.NONE) return;

    // Battle_Improvements.md §2.11: snapshot alive state BEFORE damage runs so
    // we can detect alive→dead transitions after the combat tick.
    const wasAlive = this.enemies.map(e => !e.dead);
    const prevPlayerHull = this.player?.hull ?? 0;

    // Player sailing
    SailingSystem.update(this.player, input, dt, this.bounds);

    // Enemies
    for (const e of this.enemies) {
      e.update(dt, this.player, this.combatSystem, this.bounds);
    }

    // Battle_Improvements.md §1.8: rocks push ships out. Done AFTER physics so
    // the clamp resolves the actual collision; ship loses speed on contact.
    this._pushShipsOutOfRocks();

    // Combat — rocks also block projectiles (CombatSystem handles that).
    this.combatSystem.update(dt, this.player, this.enemies, this.rocks);

    // Bilge: leaks add water, bilge station pumps it out
    this.player.updateBilge(dt, this.player._stationEffects?.bilgePumpMult ?? 1);

    // Carpenter repair: hull and leaks over time
    this.player.repairTick(dt, this.player._stationEffects?.repairMult ?? 1, this.player._stationEffects?.leakRepairMult ?? 1);

    // Battle_Improvements.md §2.11: emit death-transition events
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (wasAlive[i] && e.dead) {
        this._combatEvents.push({
          type: 'enemy_sunk',
          name: this._enemyDisplayName(e),
        });
      }
    }
    // Battle_Improvements.md §2.11 + §2.7: emit player damage events so Game can
    // light up the damage feedback layer (camera shake / vignette / HUD pulse).
    const newPlayerHull = this.player?.hull ?? 0;
    if (newPlayerHull < prevPlayerHull) {
      this._combatEvents.push({
        type: 'player_hit',
        damage: prevPlayerHull - newPlayerHull,
        hullFrac: this.player.hullMax > 0 ? newPlayerHull / this.player.hullMax : 0,
      });
    }
    this._prevPlayerHull = newPlayerHull;

    // Check victory/defeat
    if (this.player.dead) {
      this.result = COMBAT_RESULT.DEFEAT;
      this._combatEvents.push({ type: 'defeat' });
    } else if (this.enemies.every(e => e.dead)) {
      this.result = COMBAT_RESULT.VICTORY;
      for (const e of this.enemies) {
        this.loot.gold += e.lootGold ?? COMBAT.lootGoldDefault;
        this.loot.salvage += e.lootSalvage ?? COMBAT.lootSalvageDefault;
      }
      this._combatEvents.push({ type: 'victory', loot: { ...this.loot } });
    }
  }

  /**
   * Battle_Improvements.md §1.8: ship-vs-rock collision. Pushes any ship that
   * intersects a rock outward to the rock-radius + ship-radius boundary, and
   * bleeds 60% of its speed as a jolt. Runs once per tick after physics.
   */
  _pushShipsOutOfRocks() {
    const all = [this.player, ...this.enemies];
    for (const ship of all) {
      if (!ship || ship.dead) continue;
      const shipR = ship.collisionRadius ?? 8;
      for (const rock of this.rocks) {
        const dx = ship.x - rock.x;
        const dy = ship.y - rock.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = shipR + (rock.r ?? 0);
        if (dist > 0 && dist < minDist) {
          const push = (minDist - dist) / dist;
          ship.x += dx * push;
          ship.y += dy * push;
          ship.speed = (ship.speed ?? 0) * 0.4;
        } else if (dist === 0) {
          // Edge case: exact centre overlap. Pop ship 1 unit in +Y.
          ship.y += minDist;
          ship.speed = 0;
        }
      }
    }
  }

  /** Display name for toasts / combat log. */
  _enemyDisplayName(enemy) {
    const type = (enemy?.type ?? 'enemy').charAt(0).toUpperCase() + (enemy?.type ?? 'enemy').slice(1);
    return type;
  }

  /**
   * Battle_Improvements.md §2.11: drain the combat-event queue. Caller (Game)
   * routes events to toasts / future log panel / camera-shake / etc.
   */
  consumeCombatEvents() {
    const q = this._combatEvents ?? [];
    this._combatEvents = [];
    return q;
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

  /** Battle_Improvements.md §2.6: forward effects list to renderer. */
  getEffects() {
    return this.combatSystem?.getEffects?.() ?? [];
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
