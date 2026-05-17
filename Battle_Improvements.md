# YoHoH — Battle (Combat) Logic & UX Improvements

**Document status:** Analysis & roadmap for the combat phase — what happens after `COMBAT.encounterWarning` resolves and the state machine flips to `GAME_STATES.COMBAT`. Covers projectile physics, enemy AI, broadside aim/fire UX, damage model, victory/defeat flow, and the supporting renderer + HUD surface.
**Last updated:** 2026-05-18
**Companion docs:** [Improvements.md](Improvements.md) (general code quality), [Sailing_Improvements.md](Sailing_Improvements.md) (voyage phase), [Charting_Improvements.md](Charting_Improvements.md) (chart screen + minimap), [Port_Improvements.md](Port_Improvements.md) (port + crew UX), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Scope: `CombatScene`, `CombatSystem`, `Enemy`, `Projectile`, `Ship` cannon/damage methods, the combat branches of `Game._updateCombat` and `Renderer.updateCombat`, the combat-mode `HUD.update`, the `COMBAT` config block, and the combat-arena `Minimap` path.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Bug / blocker — user-facing functionality broken or physically incorrect |
| 🟠 | High-priority UX issue |
| 🟡 | Medium — refactor or polish |
| 🟢 | Nice-to-have / forward-compat |

---

## 1. Bugs & physics-correctness issues

### 1.1 🔴 Enemy movement is not frame-rate independent
**Where:** [src/entities/Enemy.js:60-63](src/entities/Enemy.js)

```js
// Inside Enemy.update(), after AI decides turn + thrust
this.speed *= this.friction;
if (Math.abs(this.speed) < 0.02) this.speed = 0;
this.x += Math.sin(this.rotation) * this.speed;
this.y += Math.cos(this.rotation) * this.speed;
```

This is the **same bug** that Sailing_Improvements §1.1 fixed for the player ship — none of this uses `dt`. At 60 fps friction decays speed ~11%/sec, at 144 fps ~25%/sec. Enemies feel sluggish on a high-refresh monitor and twitchy on a low-fps machine.

**Worse**: the entire `update()` body — including the `this.x +=` integration — is gated behind `this.aiTimer >= this.aiInterval` (line 45 — `if (this.aiTimer < this.aiInterval) return;`). The interval is `0.5s`, so **enemies only move twice a second**. They appear to teleport in 0.5-second hops rather than glide. The AI *decision* should be on an interval; the *physics integration* should not.

**Suggested fix:** Reuse `SailingSystem` for enemies. AI emits a synthetic input object each tick (similar to the autopilot Proxy wrapper in §4.5); SailingSystem handles dt-scaled physics. Only re-roll the AI's turn / thrust intent every `aiInterval` seconds.

### 1.2 🔴 Hit detection uses a hard-coded radius of 8 units
**Where:** [src/systems/CombatSystem.js:85](src/systems/CombatSystem.js)

```js
const dist = Math.sqrt(dx * dx + dy * dy);
if (dist < 8) {
  ship.takeDamage(p.damage, 'hull');
  ...
}
```

`8` is the magic-number collision radius for **every** ship — sloop, brigantine, galleon, enemy, player. Yet the renderer already uses `SHIP_GEOMETRY.classes[id].scale` to draw galleons 40% larger than sloops. So a galleon visually fills more space than its collision footprint, and a sloop's collision is larger than the visual hull. Projectiles pass through galleon sails and clip thin air around sloops.

**Suggested fix:** Add `collisionRadius` to ship class config (8 sloop, 10 brigantine, 12 galleon) and read from `ship.collisionRadius ?? 8` in the hit test.

### 1.3 🔴 `CombatScene.init()` overrides player physics with raw class fields
**Where:** [src/scenes/CombatScene.js:36-42](src/scenes/CombatScene.js)

```js
const cls = this.player.shipClassId && SHIP_CLASSES?.[this.player.shipClassId];
this.player.maxSpeed = cls?.maxSpeed ?? SHIP.maxSpeed;
this.player.thrust = cls?.thrust ?? SHIP.thrust;
this.player.friction = cls?.friction ?? SHIP.friction;
// ...
```

This bypasses `getShipStatsFromConfig` (the function that already centralises the sailing-vs-combat prefix lookup, the speedMultiplier, the accelMultiplier, etc.). When the player ship is re-entering combat from sailing — the sailing-prefixed stats — this line reverts everything to combat values *imperatively*, but it skips the upgrade-derived multipliers and the cached effective-max. It also won't pick up future per-class combat fields (`sloop.combatFriction` etc.) without an explicit edit here.

Same shadowing-pattern footgun as Sailing_Improvements §1.2 / friction bug.

**Suggested fix:** Drop the manual override block entirely. Have `CombatScene.init` recreate the player via `createShip(shipClassId, { ...stateOpts, useSailing: false })` so `getShipStatsFromConfig` runs once and produces a clean combat-config instance.

### 1.4 🔴 Player ship persists across combat restarts and inherits stale state
**Where:** [src/scenes/CombatScene.js:30-50](src/scenes/CombatScene.js), [src/Game.js:771-772](src/Game.js)

When the player presses `R` after victory/defeat:
```js
if ((result === 'victory' || result === 'defeat') && input.isKeyDown('KeyR')) {
  combatScene.init();
}
```

`combatScene.init()` is called with **no arguments**, so the `if (playerShip && !playerShip.dead)` branch falls through — but the previous `this.player` reference is replaced with a fresh sloop. Meanwhile the actual gameplay player ship (`Game._playerShipState`) is untouched. So:
- `R` after defeat creates a fresh sloop in a new combat that the player never agreed to. The actual save-state ship was sunk; this is a sandbox loop with no persistent consequence. Confusing.
- `R` after victory does the same — wipes the loot just earned and respawns at full health.

`KeyR` is also `isKeyDown` (not `isKeyJustPressed`) so holding R after the result resolves cycles through fresh combats every frame.

**Suggested fix:** Either remove the R-restart in the production build (it's a dev convenience) or gate it behind a "Dev cheat" flag like `GAME.devCheats`. Use `isKeyJustPressed` either way to avoid rapid-fire restart.

### 1.5 🟠 Game.js uses string literals for combat results instead of the enum
**Where:** [src/Game.js:771-789](src/Game.js)

`CombatScene` exports `COMBAT_RESULT = { NONE, VICTORY, DEFEAT }` but `_updateCombat` compares to `'victory'` / `'defeat'` strings directly. Works because the enum values happen to be those exact strings, but it's a footgun — rename them and the file silently breaks.

**Suggested fix:** Import `COMBAT_RESULT` from `CombatScene` and compare to the constants.

### 1.6 🟠 Cannon arc convention vs ship movement convention conflict
**Where:** [src/entities/Ship.js:170-181](src/entities/Ship.js)

Ship movement convention is `forward = (sin r, cos r)` (rotation=0 → +Y), but cannon arcs use `atan2(dy, dx)` which is the +X convention. The arc compensates by setting `portCenter = π - rotation` and `starboardCenter = -rotation`. Then `_spawnProjectile` un-mixes the conventions with `rotation = π/2 - centerAngle`. Functional, but every reader has to derive the math from scratch.

**Suggested fix:** Pick one convention. Recommend (`sin r, cos r`) everywhere with `getPortDirection()` / `getStarboardDirection()` returning unit vectors directly. Hit-tests use vector dot products instead of angle wrapping.

### 1.7 🟠 Combat never applies crew damage despite the data model supporting it
**Where:** [src/entities/Ship.js:235-247](src/entities/Ship.js), [src/systems/CombatSystem.js:86-87](src/systems/CombatSystem.js)

`Ship.takeDamage` accepts `'hull' | 'sails' | 'crew'`. Cannons only ever fire `'hull'` + `'sails'`. `crew` is dead-code path. The 'grapple' / 'boarding' upgrades suggest the original design wanted crew-to-crew combat, but no system implements it.

**Suggested fix:** Either implement a crew-damage path (boarding action, grape-shot ammo type — see §4.3 / §4.5 below) or drop the `'crew'` branch and the `crewMax` field. Document the choice.

### 1.8 🟠 Rocks have no collision — projectiles pass through them
**Where:** [src/entities/Projectile.js:29-34](src/entities/Projectile.js), [src/scenes/CombatScene.js:60](src/scenes/CombatScene.js)

`COMBAT_ROCKS` is a 4-rock array used purely as visual decoration. Neither projectiles nor ships collide with them, even though they're rendered at the same z. The rocks look like cover; they aren't. Tactically misleading.

**Suggested fix:** Add rock collision to projectile updates and to the SailingSystem clamp. Ships gently bounce off; projectiles spawn a small splash and despawn. Rocks then become real cover.

### 1.9 🟡 `aiInterval = 0.5s` decisions but `aiTimer` increments per call
**Where:** [src/entities/Enemy.js:44-46](src/entities/Enemy.js)

```js
this.aiTimer += dt;
if (this.aiTimer < this.aiInterval) return;
this.aiTimer = 0;
```

After the early `return` no work happens, including the cooldown tick `updateCooldowns(dt)` at line 72 — so an enemy that fires can't tick its cooldown for up to 0.5s after the shot. Cannons end up with effective cooldowns of `cooldown + (0 to aiInterval)` instead of `cooldown`. Minor but inconsistent.

**Suggested fix:** Split the loop. Cooldowns + integration every tick; AI decisions only every `aiInterval` seconds (pair with §1.1's SailingSystem rewire).

### 1.10 🟢 Enemy hardcodes hull/sails to `0.8 × COMBAT.hullMax`
**Where:** [src/entities/Enemy.js:20-23](src/entities/Enemy.js)

Every enemy regardless of type has the same hull/sail health (80 / 80). Trader and Raider are functionally identical bags of HP that just steer differently. The original GDD comment mentions traders are weaker, raiders are tougher — that nuance is lost.

**Suggested fix:** Per-type stat blocks in a small `ENEMY_CLASSES` config (analogous to `SHIP_CLASSES`). Trader: low HP / low cannon count / high cargo. Raider: medium HP / high fire rate / aggressive. Add a future `Hunter`, `Patrol`, `Pirate King` for variety.

---

## 2. UX gaps

### 2.1 🔴 Player has no idea what they're fighting
**Today:** Combat starts, the camera centres on the player ship, and two red-hulled triangles appear. No on-screen indication of which ship is which class, what their HP is, who's closer, what their loot will be, or how to win.

**Suggested fix:** Lightweight enemy nameplate above each hostile — class icon + a one-row hull bar ("Raider" + a 60-px bar). Updated every frame; pooled mesh count = enemy count. Optionally show the ship type ("Sloop / Brigantine / Galleon" once tiered enemies land per §1.10).

### 2.2 🔴 No win-condition / objective hint
The mode line just says `"Combat"`. New players don't know whether they need to sink everyone, board, or survive a timer. After-action toast on victory shows "Victory!" but during the fight there's zero guidance.

**Suggested fix:** Sub-line under "Combat" reading "Sink all enemies (2/2 remaining)" — updates as ships go down. Free; same render path as the existing mode line.

### 2.3 🟠 No mid-combat flee / retreat option
Once combat starts the player is committed. Sailing has a pre-combat flee window (Sailing §2.4) and a cancel-voyage button (§2.8). Combat has neither. The player can't bail when the fight goes badly except by dying.

**Suggested fix:** Add `Tab` (or `B` for "Break engagement") — disengage attempt. Requires being >X distance from all enemies AND moving away for N seconds. On success: combat ends, return to sailing with a "You broke off!" toast. On failure: combat continues, brief speed penalty (sails dragging). Mirrors the pre-combat flee pattern.

### 2.4 🟠 No reload visualisation on the cannon arcs
**Where:** [src/Renderer.js:441-448](src/Renderer.js)

Both port and starboard arc meshes are always visible, always the same color. The cooldown timer ticks down in HUD text — but the arc itself doesn't communicate readiness vs reloading. Quick play test: glance at the arc, see green → fire. Should be: dimmed/red while reloading, full color when ready.

**Suggested fix:** Modulate `arcMesh.material.opacity` by `1 - portCooldown / cannonCooldown`. Tint to red when 0 < cooldown < 0.3 (almost ready). Tiny render-side change, big readability win.

### 2.5 🟠 Aim-then-fire UX is OK but no "fire when in arc" assist
The aim-then-fire pattern (Q to aim, Q again to fire) is fine for deliberate play. But new players spam-press Q expecting an immediate shot and get the aim arrow instead. Some players want auto-fire while a target is in the arc.

**Suggested fix:** Add a `COMBAT.autoFire` config + a runtime toggle (`F` key during combat?) — when on, broadsides fire automatically whenever an enemy enters the arc AND the cannon is off cooldown. Default off so deliberate play wins.

### 2.6 🟠 No projectile feedback — hits and misses feel identical
A cannonball flies in a straight line, vanishes (either timed-out or hit). No splash where it lands, no impact flash on the target, no muzzle flash where it left. Players can't tell which of their 3-cannon brigantine volleys actually hit.

**Suggested fix:** Cheap visuals — a small expanding circle at the projectile's death position (cyan for water, orange for ship hit). A 0.2s muzzle flash plane at the ship's broadside. Both pool-able.

### 2.7 🟠 No damage feedback on the player when hit
The hull bar ticks down; that's it. No screen shake, no edge flash, no audio cue. In genre this is the moment-to-moment feedback that lets you feel the fight.

**Suggested fix:** Camera-shake on player hull damage scaled by damage amount; brief red vignette via a CSS overlay; HUD hull bar pulses red on impact.

### 2.8 🟠 Enemy ships look identical
**Where:** [src/Renderer.js](src/Renderer.js) — `_getOrCreateEnemyMesh` uses one mesh template

The renderer pools enemies as identical red-hulled triangles. No visual class differentiation (sloop vs brigantine vs galleon), no flag/banner to indicate faction, no behaviour signal (a fleeing trader vs a charging raider look the same from across the arena).

**Suggested fix:** Pull `shipClassId` from each enemy (once §1.10 lands), use `getShipClassScale` like the player mesh. Tint the sail by AI behaviour (yellow = trader, red = raider, dark red = pirate king tier). Add a tiny direction-of-intent arrow above each enemy showing where they're trying to go.

### 2.9 🟠 Defeat has no flow — just "R to restart"
**Where:** [src/Game.js:789-792](src/Game.js), [src/ui/HUD.js:354-355](src/ui/HUD.js)

Defeat shows "Ship sunk! R to restart" in the mode line. R restarts the combat with a fresh sloop (see §1.4). Esc returns to overworld and cancels the voyage.

**Suggested fix:** Proper defeat overlay with options: *Continue (lose ship + cargo, respawn at home)*, *Load Save (last autosave)*, *Main Menu*. R-restart becomes a dev-only cheat.

### 2.10 🟡 Combat HUD shows no enemy count or fleet status
"You vs N enemies" is fundamental info. Currently HUD shows your hull/sails/speed/bilge/leaks/cannons but nothing about the enemy. Even a count chip ("Enemies: 2") would help.

**Suggested fix:** Add an enemy-list panel on the opposite side of the HUD: one row per enemy with class icon, HP bar, distance, optional bearing arrow. Same DOM-update pattern as the stations chip row.

### 2.11 🟡 No combat log / event feed
"Raider sank!", "Critical hit on sails!", "Hull damage 25", "You hit your mark!" — none of these surface to the player. The toast system used by sailing events is a perfect fit.

**Suggested fix:** Pipe damage-dealt, ship-sunk, and crew-loss events into `mapUI.showToast` (or a combat-scoped log panel). Reuse the Port_Improvements activity-log pattern — fixed-height scrolling list, configurable retention.

### 2.12 🟡 Camera doesn't react to combat
**Where:** [src/Renderer.js:1095](src/Renderer.js)

```js
renderer.updateCamera(player.x, player.y);
```

Static zoom (`cfg.camera.zoom`), no shake, no zoom-out on multiple targets, no zoom-in on the killing blow. Sailing got the speed-relative zoom (§2.6); combat got nothing.

**Suggested fix:** Camera shake on hits (already in §2.7), gentle zoom-out by 5–10% when multiple enemies present, brief zoom-in punch on a kill. All time-driven; cheap.

### 2.13 🟢 No fight music / SFX hooks
Currently silent. Audio is out of scope per the GDD but stubbing the call sites (`audio.playSfx('cannon-fire')` etc.) means dropping in sound later is a few lines, not a refactor.

---

## 3. Code-structure improvements

### 3.1 🟡 `Enemy.update` re-implements physics inline instead of using `SailingSystem`
**Where:** [src/entities/Enemy.js:59-73](src/entities/Enemy.js)

Lines 60–70 mirror what `SailingSystem._integrateMotion` + `_applyControls` + bounds-clamp already do — but without `dt`, without `frameScale`, without the wind multiplier (irrelevant for combat but consistent for any future "wind in combat"), and without the deadzone-on-input guard.

**Suggested fix:** Build a tiny `AIInput` wrapper exposing `isKeyDown(code)` based on the AI's intent, then `SailingSystem.update(enemy, aiInput, dt, bounds)`. All physics goes through one path. Bundles with §1.1.

### 3.2 🟡 `CombatSystem.update` is O(P × S) per frame
**Where:** [src/systems/CombatSystem.js:76-92](src/systems/CombatSystem.js)

For each projectile, iterate every live ship. With 30 projectiles in flight + 4 ships = 120 hit-tests / frame. Fine for now. If enemy count grows past ~10 or a "fleet battle" mode lands, add a spatial bucket (already on Improvements.md §6.2 backlog). The `dist` calc inside the loop also uses `Math.sqrt` — could use squared distance vs squared threshold to skip the sqrt.

### 3.3 🟡 `CombatScene.init` does double-duty for "first init" and "restart"
**Where:** [src/scenes/CombatScene.js:30-61](src/scenes/CombatScene.js)

Two failure modes:
- Called with the player ship → reset its position/rotation but keep the instance (and stale physics overrides — see §1.3).
- Called without args → create a fresh sloop (see §1.4 for why that's wrong post-defeat).

The arg-overloading hides intent. Separate methods (`startEncounter(playerShip, enemySpec)` + `restartEncounter()`) would be clearer. Encounter spec drives §1.10's tiered enemies.

### 3.4 🟡 Hardcoded enemy spawn positions in `CombatScene.init`
**Where:** [src/scenes/CombatScene.js:51-54](src/scenes/CombatScene.js)

```js
this.enemies = [
  new Enemy({ x: 60, y: 60, rotation: Math.PI, type: ENEMY_TYPES.RAIDER }),
  new Enemy({ x: -70, y: 50, rotation: 0, type: ENEMY_TYPES.TRADER }),
];
```

Every encounter is the same two ships in the same spots. `COMBAT.enemyRaiderX/Y` etc. exist in config but are unused — orphan fields.

**Suggested fix:** New `EncounterSpec` object (or inline factory) takes the route's danger level, the ship class config, and the encounter rate's recent history (anti-frustration) to produce 1–3 enemies with positions, types, and HP scaled accordingly. Drop the unused config keys.

### 3.5 🟡 Combat doesn't read route modifiers
The voyage that triggered the encounter happened on a **stormy / patrolled / shoals** route — but the combat that follows has no idea. The Sailing_Improvements §4.3 modifier system stops at the encounter handshake.

**Suggested fix:** Pass `travelRoute` (or just `routeModifiers`) into `combatScene.init(playerShip, { modifiers })`. Stormy = reduce visibility (combat arena fog), narrow arc, hull damage tick. Patrolled = enemies are well-armed (extra cannons, higher fire rate). Shoals = arena littered with rocks; collision matters more. These naturally couple combat back into the strategic-layer choice.

### 3.6 🟡 `Renderer.updateCombat` is one big imperative block
**Where:** [src/Renderer.js:408-495](src/Renderer.js)

Same shape as the Charting_Improvements §2.4 critique of `BigMapUI.update`: 80+ lines of imperative mesh updates for ship / arcs / aim arrow / enemies / projectiles / rocks. Splitting into `_drawPlayerCombat`, `_drawEnemies`, `_drawProjectiles`, `_drawRocks` doesn't change runtime cost but makes the surface much easier to extend (per-enemy nameplates, muzzle flashes, etc).

### 3.7 🟢 `combatScene` and `combatSystem` overlap conceptually
`CombatScene` owns the enemies, the result, the loot, and the aim state. `CombatSystem` owns the projectiles. Both speak the same language (ships, cannons, damage). When the system grows — boarding, ammo types, status effects — the line between them will blur. Worth keeping the two layers but renaming for clarity: `CombatScene = orchestrator/state`, `CombatSystem = projectile lifecycle + hit-detection`. Document the boundary.

---

## 4. New mechanics worth considering

### 4.1 🟢 Tiered enemy classes + scaling difficulty
- `ENEMY_CLASSES` config: `trader_sloop`, `raider_sloop`, `raider_brigantine`, `pirate_king_galleon`, etc.
- Each has hull/sails/cannons/AI-personality/loot tier.
- Encounter spec rolls 1–3 enemies based on route danger + player infamy (high infamy = tougher ships).

### 4.2 🟢 Boarding actions (the missing crew-combat layer)
The `boarding_nets` and `grappling_hooks` upgrades exist in `UPGRADES` but do nothing. Suggested loop:
- When player is within ~10 units of an enemy AND speeds match within tolerance → `B` action becomes available.
- Board → mini-resolution: roll based on crew count × morale × boarding-upgrade bonus.
- Win → take loot + optional capture-ship + crew loss.
- Lose → crew damage on both sides; combat continues normally.

### 4.3 🟢 Ammo type selection
- Round shot (default): hull damage.
- Chain shot: 2× sail damage, 0.5× hull damage.
- Grape shot: 2× crew damage, 0 hull/sails damage (boarding setup).
- Heavy shot: 1.5× hull damage, 1.5× cooldown, costs supplies.

Switch with `1/2/3/4` keys mid-combat. Adds tactical depth without changing the broadside loop.

### 4.4 🟢 Wind in combat
Already implemented in sailing (§4.1). Combat ignores the map wind. Wiring it in:
- Same `computeWindMultiplier` already used by SailingSystem.
- Tactical layer: tack into the wind for slow precision, sail with the wind to close fast but lose maneuverability.
- Visual: small wind arrow in a corner of the arena (matches the chart wind arrow #23).

### 4.5 🟢 Critical hits & ship status effects
- 10% chance per shot to land a critical: triggers one of {sails-on-fire, helm-jammed, cannon-disabled}.
- Status effects last N seconds and create gameplay reads ("their helm is jammed, push the broadside!").
- Carpenter station can clear status faster.

### 4.6 🟢 Surrender mechanic
- Enemy hull below 25% AND morale-equivalent rolled → emit white-flag toast.
- Player choice: accept (no further damage, normal loot drop) or finish them (extra infamy, no loot).
- Couples to infamy progression nicely — pacifist runs become viable.

### 4.7 🟢 Capturable ships
- After surrender (4.6), option to capture the enemy ship.
- Adds it to the player's fleet (or replaces current ship with the better one).
- Long-form goal: capture a galleon without buying one.

### 4.8 🟢 Combat morale loop
- Enemy ship sinks → +morale to all player crew (already kind of exists via `CREW.moraleVictoryGain`, but applied only on full victory).
- Player ship takes critical hit → -morale to crew. Low morale could disable a station temporarily.

### 4.9 🟢 Combat duration cap / "darkness falls"
Long stalemates aren't fun. After 90s of no progress, a "fog rolls in" event ends combat — both sides disengage. Player keeps any partial loot but rolls infamy reduction.

---

## 5. Recommended order of attack

Top items are the highest-impact / lowest-risk wins. Effort: S (≤1h), M (≤3h), L (significant).

| # | Item | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1 | §1.1 — dt-scale enemy movement (separate AI-decision tick from physics tick) | M | 🔴 | ⏳ |
| 2 | §1.2 — Per-class collision radius | S | 🔴 | ⏳ |
| 3 | §1.4 — Gate `R`-restart behind dev-cheat / fix `isKeyJustPressed` | S | 🔴 | ⏳ |
| 4 | §1.5 — Replace string literals with `COMBAT_RESULT` enum import | S | 🟠 | ⏳ |
| 5 | §1.3 — Drop manual physics override in `CombatScene.init`; rebuild via `createShip` | S | 🔴 | ⏳ |
| 6 | §2.1 / §2.10 — Enemy nameplates + HP bars on each hostile + enemy-count chip in HUD | M | 🔴 | ⏳ |
| 7 | §2.2 — Win-condition sub-line in HUD ("Sink all enemies (2/2)") | S | 🔴 | ⏳ |
| 8 | §2.4 — Cannon arc opacity reflects cooldown | S | 🟠 | ⏳ |
| 9 | §2.6 — Projectile splash + muzzle flash visuals | M | 🟠 | ⏳ |
| 10 | §2.7 — Damage feedback on player (camera shake + HUD pulse + vignette) | S | 🟠 | ⏳ |
| 11 | §1.8 — Rocks become real collision (projectiles + ships) | M | 🟠 | ⏳ |
| 12 | §2.11 — Combat event log (damage / sinks / hits) via existing toast system | S | 🟡 | ⏳ |
| 13 | §1.6 — Unify cannon arc + movement angle convention | M | 🟠 | ⏳ |
| 14 | §3.1 — Enemy uses `SailingSystem` (bundles with #1) | M | 🟡 | ⏳ |
| — | — | — | — | — |
| 15 | §1.7 / §1.10 — Per-type enemy stats + crew-damage path lit up | M | 🟢 | ⏳ |
| 16 | §3.4 / §4.1 — `EncounterSpec` + tiered enemy classes scaled by route danger / infamy | L | 🟢 | ⏳ |
| 17 | §3.5 — Route modifiers shape combat (stormy / patrolled / shoals) | M | 🟢 | ⏳ |
| 18 | §2.3 — Mid-combat flee / disengage | M | 🟠 | ⏳ |
| 19 | §2.9 — Proper defeat overlay (Continue / Load / Main Menu) | M | 🟠 | ⏳ |
| 20 | §4.2 — Boarding actions (wire up `boarding_nets` / `grappling_hooks`) | L | 🟢 | ⏳ |
| 21 | §4.3 — Ammo type selection (round / chain / grape / heavy) | M | 🟢 | ⏳ |
| 22 | §4.4 — Wind in combat | S | 🟢 | ⏳ |
| 23 | §2.5 — Auto-fire toggle | S | 🟢 | ⏳ |
| 24 | §2.8 — Visual enemy-class differentiation (scale + sail tint) | M | 🟢 | ⏳ |
| 25 | §2.12 — Combat camera reactions (shake / zoom-out / kill-zoom) | M | 🟢 | ⏳ |
| 26 | §4.5 — Critical hits + ship status effects | M | 🟢 | ⏳ |
| 27 | §4.6 — Surrender mechanic | M | 🟢 | ⏳ |
| 28 | §4.7 — Capturable ships | L | 🟢 | ⏳ |
| 29 | §4.8 — Combat morale feedback loop | S | 🟢 | ⏳ |
| 30 | §4.9 — Combat duration cap ("darkness falls") | S | 🟢 | ⏳ |
| 31 | §3.2 — Spatial bucket for hit-tests (only if combat scales) | M | 🟢 | ⏳ |
| 32 | §3.6 — Split `Renderer.updateCombat` into sub-helpers | S | 🟡 | ⏳ |
| 33 | §1.9 — Decouple enemy cooldown tick from AI-decision tick (bundles with #1) | S | 🟡 | ⏳ |

---

## 6. Open design questions

1. **Should combat support "disengage" or commit-only?** Today the encounter system has a pre-combat flee window (Sailing §2.4) — once that window passes the player is locked in. Cleaner narrative but punishes misclicks. §2.3 proposes adding mid-combat flee.
2. **R-restart: dev cheat or production feature?** If it stays, it needs full ship-state reset semantics (and shouldn't run on `isKeyDown`). If it goes, defeat needs a proper continue/load flow first.
3. **Boarding: minigame or instant resolve?** A click-button mini-resolve is fastest to ship. A small Pirates!-style fencing minigame is more memorable but a big build.
4. **Capture vs sink:** if capturable ships land (§4.7), how does the player switch fleets? Replace current ship instantly (loses cargo)? Drag back to a port to formalize? Park as a "second ship" hireable later?
5. **Ammo cost / inventory:** ammo-types could be free (just a toggle) or come from cargo (heavy shot consumes `iron`, chain shot consumes `rope`). Latter ties into Market economy. Tradeoff: depth vs friction.
6. **Combat duration & "long stalemate":** is the §4.9 fog-rolls-in escape the right shape, or should the AI simply get more aggressive over time?
7. **Defeat permadeath?** Roguelike permadeath has appeal but the current save system is checkpoint-based. Defeat-loses-ship-but-not-progress feels closer to current architecture. Worth a deliberate call.

These are tagged for a future design sweep.

---

## 7. Cross-references to other docs

- **Sailing_Improvements §2.4** (encounter warning + flee window) gates entry to combat. Mid-combat flee (§2.3 here) should mirror its pattern.
- **Sailing_Improvements §4.3** (route modifiers) — §3.5 here proposes carrying modifiers into combat.
- **Port_Improvements §5** (Crew overlay) — combat morale loops (§4.8) feed back into the crew system. Boarding actions (§4.2) should surface in the Crew UI's station overview.
- **Improvements.md §6.2** (spatial grid for hit detection) — same backlog item, surfaces here as §3.2 once enemy count grows.
- **Charting_Improvements.md** — minimap combat-mode rendering already deferred (Charting §4.5) and unaffected by these changes.
