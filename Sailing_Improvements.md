# YoHoH — Sailing UX & Logic Improvements

**Document status:** Analysis & roadmap for the sailing phase (route travel between islands), the physics model, the HUD/minimap/chart-screen affordances, and surrounding code smells.
**Last updated:** 2026-05-17
**Companion docs:** [Improvements.md](Improvements.md) (general code quality), [Port_Improvements.md](Port_Improvements.md) (port screen + crew UX), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Tracks sailing-specific issues: bugs (some long-latent), physics correctness, UX gaps, and structural improvements.

> **Progress (2026-05-17):** First pass complete — §1.1, §1.2, §1.3, §1.4, §1.6, §2.1, §2.3, §2.4, §2.5, §2.6, §2.7, §2.8, §2.9, §4.1, §4.3, §4.4 landed. §1.5 (wake mesh rotation verification) and §2.10 (drop lateral corridor input) deferred — both need a visual playtest to decide direction. §3.1 (config consolidation) deferred — large refactor for low impact relative to the gameplay items just landed.
>
> **Diagnostic build (2026-05-17):** User reported "ship doesn't move on W" + "Set Sail click does nothing" after the first pass. Built a toggleable **debug overlay** (`` ` `` / backtick to toggle) with live state, rolling event log, and Copy / Download buttons. Instrumented `_startSailing`, `startTravel`, the canvas route-click hit-test, `_onStartSailing`, and `console.warn`/`error` so the overlay reveals exactly where the chain breaks. Also defensively reordered `startTravel` so a thrown error during `createShip`/`setStationEffects` can no longer leave the scene in a half-traveling state. See §6 below for the diagnostic playbook.
>
> **Root cause identified (2026-05-17):** Debug overlay showed `friction: 0.5500` on a sloop in sailing mode — that's the **combat** friction, not the **sailing** friction (which should be 0.998). The bug was in `getShipStatsFromConfig`: both `friction` and `brakeMult` used `cls?.friction` / `cls?.brakeMult` directly instead of looking up the sailing-prefixed `cls?.sailingFriction` / `cls?.sailingBrakeMult` first. Same shadowing pattern as the `SAILING.maxSpeed` bug from §1.2 — silently bugged since the class system was added. With combat friction (0.55), each sailing tick at 120 fps adds `thrust*0.5 = 0.0125` then multiplies by `0.55^0.5 ≈ 0.74`, giving an equilibrium speed below the 0.02 deadzone — which then snapped speed back to 0 every frame. Ship never moved.
>
> **Two fixes shipped:**
> 1. `Ship.getShipStatsFromConfig` — `friction` and `brakeMult` now look up `cls[`${prefix}Friction`]` / `cls[`${prefix}BrakeMult`]` first.
> 2. `SailingSystem._applyControls` — deadzone snap now only runs when **neither W nor S is held**. Previously, at high framerates the per-tick thrust delta could be smaller than the deadzone, causing the ship to snap back to 0 every frame even during active acceleration.
>
> **Set Sail click "nothing happens" diagnosis:** The user's log shows `startTravel OK` and `state=SAILING` — so the click chain WAS working. The perception of "nothing happens" was actually the ship-not-moving bug: pressing Set Sail did start the voyage, but the ship was stuck at the origin so the player saw no visual change.
>
> **Feel tuning pass (2026-05-17):** After fixing movement, acceleration was visibly too fast (ship snapped to top speed in <0.1s) and pressing S could push the ship into reverse. Two more fixes:
> 1. **`SAILING.accelMultiplier` (default 0.05)** — new global knob, scales thrust independently from `speedMultiplier`. At 0.05, sloops now take ~1.5s to reach top speed instead of snapping. Lower for heavier feel; higher for snappier. Applied in `Ship.getShipStatsFromConfig` as `thrust = rawThrust * speedMult * accelMult`. Combat thrust unaffected (only `useSailing` paths read `accelMultiplier`).
> 2. **No reverse** — `SailingSystem._applyControls` now clamps the S-key path at **0** instead of `-effectiveMax * reverseMult`. Ships in YoHoH never reverse; S is a brake-only key. Removed the now-unused `SAILING_SYSTEM.reverseSpeedMult` config field.

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

### 1.1 🔴 Sailing physics is **not frame-rate independent**  ✅
**Where:** [src/systems/SailingSystem.js](src/systems/SailingSystem.js) — `_applyControls`, `_integrateMotion`

**Symptom:** None of the motion math uses `dt`. Thrust, friction, turning, and position integration are all **per-frame deltas**:

```js
// _applyControls
ship.speed = Math.min(ship.speed + thrust, effectiveMax);
ship.speed *= friction;
ship.rotation -= actualTurnRate;
// _integrateMotion
ship.x += Math.sin(ship.rotation) * ship.speed;  // ← no dt
ship.y += Math.cos(ship.rotation) * ship.speed;
```

At 60 fps with `friction = 0.998`, speed decays ~11% per second. At 144 fps, the same code applies friction 144 times per second → ~25% decay/sec → ship feels sluggish. At 30 fps it feels twice as floaty.

**Inconsistency:** Other systems already use `dt` correctly:
- `Ship.updateBilge(dt, …)`
- `Ship.repairTick(dt, …)`
- `Ship.updateCooldowns(dt)`
- `updateMoraleDecay(roster, dt, maxCrew)`
- `Projectile.update(dt)` — `this.x += Math.sin(this.rotation) * this.speed * dt`

So the ship's own motion is the only thing on a per-frame clock. This is the single biggest physics bug.

**Status:** Done — used the cheaper-tune approach. `SailingSystem` defines `frameScale(dt) = dt * SAILING.referenceFps` (default 60). Thrust, turn rate, and position integration multiply by `frameScale`; friction uses `Math.pow(friction, frameScale)` so the per-tick semantics are preserved. Clamped to a 15× cap so a freakishly long frame (alt-tab) doesn't teleport the ship.

### 1.2 🔴 `SAILING.maxSpeed = 10.0` bump does nothing for any real ship class  ✅
**Where:** [src/config.js:149](src/config.js), [src/entities/Ship.js:18](src/entities/Ship.js)

The user just changed `SAILING.maxSpeed` from `0.1` to `10.0`, presumably hoping for faster sailing. **It has no effect on gameplay** because the lookup in `getShipStatsFromConfig` is:

```js
maxSpeed: opts.maxSpeed
       ?? cls?.[`${prefix}MaxSpeed`]   // ← `cls.sailingMaxSpeed`
       ?? cls?.maxSpeed
       ?? base.maxSpeed,               // ← SAILING.maxSpeed (the bumped value)
```

For every ship class:
- `SHIP_CLASSES.sloop.sailingMaxSpeed = 0.1`
- `SHIP_CLASSES.brigantine.sailingMaxSpeed = 0.095`
- `SHIP_CLASSES.galleon.sailingMaxSpeed = 0.085`

So the class-specific override always wins. `SAILING.maxSpeed` is only a fallback for ships with no class config (which doesn't happen for the player).

**Status:** Done — added `SAILING.speedMultiplier` (default 1.0) applied **after** the per-class lookup in `Ship.getShipStatsFromConfig`. Comments at the top of `SAILING` now document the override hierarchy. The user's bumped `SAILING.maxSpeed = 10.0` was preserved as a fallback-only value (it still has no effect, but the comment explains why) — set `speedMultiplier` to globally scale every ship.

### 1.3 🟠 Big-Map (Chart Screen) doesn't pause sailing  ✅
**Where:** [src/Game.js:261-267](src/Game.js)

```js
if (this.bigMapUI.isVisible()) {
  …
  overworldScene.update(dt, input);  // ← still updates the ship
  return;
}
```

While the player has the chart screen open mid-voyage, the ship continues moving (and the encounter timer continues ticking — though the early `return` means encounters can't actually fire while the map is open, since the encounter check is below this `return`). Two valid choices:

- **Pause everything:** skip `overworldScene.update` when bigMap is visible.
- **Keep everything live:** also let encounters fire, but show the chart over the action (more dramatic).

**Status:** Done — chose **pause everything** (clean planning mode). Opening the chart screen during sailing now stops the ship, the encounter timer, station-effects refresh, and morale decay. The earlier `overworldScene.update(dt, input)` call inside the `bigMapUI.isVisible()` branch is removed.

### 1.4 🟠 Encounter trigger + arrival can collide in the same frame  ✅
**Where:** [src/Game.js:288-305](src/Game.js)

```js
if (overworldScene.isTraveling()) {
  // encounter timer check; possibly transition to COMBAT
} else {
  // show "Arrived at X!" toast; transition to OVERWORLD
}
```

`overworldScene.update(dt, input)` may set `isTraveling()` to `false` mid-tick (on arrival). Then we hit the `else` and show the arrival toast. Good. But the encounter timer is reset (`this._encounterTimer = null`) only in the `else` branch — so if a voyage *ends* on the same tick it would have rolled an encounter, the encounter was about to fire and is now cancelled. That's actually the correct behaviour (you can't be ambushed at the dock), but the ordering is fragile.

**Status:** Done — extracted `_resetEncounterTimer()` (also clears the new warning state from §2.4). It's now called on arrival, on combat defeat → overworld, on voyage cancellation, and on any state-out path. The contract is centralised.

### 1.5 🟡 Wake mesh rotation math is suspect  ⏳ DEFERRED
**Status:** Deferred — verification requires a non-symmetrical wake texture and visual playtest to confirm. The rectangular fallback currently looks fine. Will revisit when adding wake polish.


**Where:** [src/Renderer.js:577-578](src/Renderer.js)

```js
this.sailingWakeMesh.rotation.z = Math.atan2(-Math.cos(r), -Math.sin(r));
```

The standard "rotate to face direction" formula is `atan2(dy, dx)` for a plane mesh aligned to the +X axis. Here we want the wake plane aligned to the ship's rear axis. The back-direction vector is `(-sin r, -cos r)`. `atan2(-cos r, -sin r)` is correct **only if** the wake's default orientation has its long axis along +X but is interpreted with y/x swapped — which is not standard. Likely correct by visual coincidence (rectangular meshes look fine at almost any rotation), but **worth verifying with a non-symmetrical wake texture** before adding wake polish.

### 1.6 🟡 `effectiveMaxSpeed` is read every frame and recomputes 4 multiplications  ✅
**Where:** [src/entities/Ship.js:113-115](src/entities/Ship.js)

```js
get effectiveMaxSpeed() {
  return this.maxSpeed * this.sailSpeedMult * this.crewMult * this.bilgeSpeedMult * this.sailingStationMult;
}
```

**Status:** Done — added per-tick cache (`_effMaxSpeedCache`) plus a `getEffectiveMaxSpeedBreakdown()` method that returns `{ base, sailMult, crewMult, bilgeMult, stationMult, total }`. Invalidated via `ship.beginTick()` called at the top of `SailingSystem.update` / `updateInCorridor`. HUD speed value now has a breakdown tooltip ("Effective max: 0.07 / 0.10 — sails -30%, bilge -10%").

### 1.7 🟢 No "no input → ship slows to 0" feedback to player
**Where:** SailingSystem deadzone

`speedDeadzone = 0.02` in config snaps small speeds to 0. With sloop sailingMaxSpeed = 0.1, that's 20% of max. So if the player releases W with speed = 0.025, the ship glides; at 0.019 it snaps to 0. That visible snap at low speed feels abrupt. Either lower the deadzone or visually fade out the wake more gradually.

---

## 2. UX gaps

### 2.1 🟠 The voyage gives almost no information to the player  ✅
**Today:** HUD shows hull/sails/speed/bilge/leaks bars; minimap shows island layout + progress bar; chart screen (M) gives the strategic view.

**Status:** Done.
- ETA / distance remaining: new `OverworldScene.getVoyageInfo()` exposes `distanceTotal`, `distanceRemaining`, `progress`, `etaSec`, `bearingRad`, `headingDeltaRad`. HUD shows a "To / Dist / ETA / Bearing" panel during sailing.
- Effective max speed breakdown: see §1.6 — tooltip on the speed bar value.
- Heading-vs-destination delta: 8-point compass bearing + `↻` / `↺` / `✓` indicator with degrees off-axis.
- Wind state: see §4.1 — wind row appears when active.

### 2.2 🟠 No reason to brake, throttle, or steer except in combat
The corridor confines you, the sailing physics keeps you on the bearing line, and no obstacles exist inside the corridor. Pressing W to maximum speed is always optimal. Sailing reduces to "press W, wait, optionally open M for the chart."

**Suggestions** (each could be a separate item):
- **Random sub-events inside the corridor** — debris/flotsam to pick up (small loot), small whirlpools to dodge laterally, friendly ship passing for a brief chat.
- **Stamina / fatigue** — going full-throttle accrues a small wear on hull/sails over time (already kind of implicit via leaks, but make it explicit).
- **Wind direction** with downwind speed bonus / upwind penalty so heading matters.
- **Cargo overload penalty** — over-laden ship sails slower and turns worse; encourages route-planning.

### 2.3 🟠 Arrival is sudden and feels accidental  ✅
**Today:** When the corridor's `clampedT >= 1`, you instantly arrive, get a toast, and snap to OVERWORLD.

**Issues:**
- No "approaching destination" cue (no audio, no visual slow-down, no zoom-in on the destination island).
- No "Dock" prompt — you don't choose to enter port; the next state transition is automatic.
- If you reverse near the dock at high speed, you might unintentionally trigger arrival before braking.

**Status:** Done. New `ARRIVAL.approachFraction = 0.85` (configurable). When `OverworldScene.isApproachingDestination()` returns true (last 15% of corridor by default), the HUD voyage panel shows a pulsing "Approaching — press F to dock" prompt. F triggers `OverworldScene.earlyDock()` which finalises the voyage at the destination. Auto-arrival at clampedT≥1 remains as fallback.

*Follow-up:* a corresponding visual cue on the corridor (ring/zone in 3D scene) is still pending — purely cosmetic.

### 2.4 🟠 Encounter happens with zero player warning  ✅
Poisson timer fires and combat starts instantly. The player has no advance signal (no "Ship on the horizon" toast, no visible enemy ship growing larger, no opportunity to flee).

**Status:** Done. Encounters now go through a configurable warning window (`COMBAT.encounterWarning`, default 3s). When the Poisson timer fires, the player gets a "⚠ Sail on the horizon! Hold W to flee (3s)." toast and a `_encounterWarningTimer` counts down. If they hold W (full thrust) for ≥ `fleeThrottleFraction × durationSec` (default 70%) and pass a `fleeSuccessChance` roll (default 55%), the encounter is cancelled with a "You outran them!" toast. Otherwise combat starts as before.

*Follow-up:* minimap-telegraph (enemy dot in corridor before combat) still pending — pure visual polish.

### 2.5 🟠 The sailing HUD doesn't surface morale or station-effects feedback  ✅
**Today:** During sailing, station effects (helmsman → turn rate, sailing → speed, carpenter → repair) are computed every tick and applied to the ship, but the player gets no feedback on what they're doing.

**Status:** Done (initial pass). New "Stations" HUD panel shows compact chips for each station with `Helm 1/1`, `GunP 0/2`, etc. Chips colour-code filled/partial/empty. Tooltip on each chip shows full station name + fill count.

*Follow-up:* hull-bar repair tick and bilge-pump arrow are still pending (more nuanced UI feedback).

### 2.6 🟡 Camera doesn't react to gameplay  ✅
**Where:** `_updateSailingCamera` uses a static `cfg.camera.zoom`.

**Status:** Done. `_updateSailingCamera` now pulls the camera zoom 0%–15% wider as speed approaches `effectiveMaxSpeed`, smoothed by a separate zoom-lerp (0.08). Camera shake / arrival-zoom-in still pending.

### 2.7 🟡 No keyboard-shortcut sheet on the sailing screen  ✅
**Status:** Done — the sailing mode line now reads `"WASD ▸ Sail · K ▸ Crew · M ▸ Chart · Esc ▸ Cancel"`. (A proper `?` overlay with all bindings is still on the wishlist.)

### 2.8 🟡 No way to cancel a voyage mid-route  ✅
**Today:** Once `startTravel()` runs, the player is committed. Only ways out are arrival, defeat in combat, or quitting.

**Status:** Done. New `Game._cancelVoyage()` snapshots ship state (so leaks/hull damage carry over), calls the existing `overworldScene.cancelTravel()`, clears the encounter timer, shows a toast, and returns to OVERWORLD at the origin. Surfaced as a "↺ Cancel Voyage" button in MapUI's info panel, visible only while traveling.

*Follow-up:* morale/supplies penalty for cancelling is still pending.

### 2.9 🟢 Sailing wake threshold doesn't update with effective max speed  ✅
**Where:** [src/Renderer.js:564-568](src/Renderer.js)

**Status:** Done. Threshold is now treated as a **fraction** of effective max when < 1 (default `0.1` = wake when speed > 10% of capacity). Legacy absolute values ≥ 1 still work for backward compat. Wake now appears reliably even with battered sails/crew.

### 2.10 🟢 Corridor lateral movement is invisible to the player  ⏳ DEFERRED
**Status:** Design decision deferred. The §4.3 shoals modifier now narrows the corridor, which is one valid gameplay reason for lateral movement. Larger plan: keep lateral input + add §4.2-style sub-events (flotsam, debris). Revisit when sub-events land.

---

## 3. Code-structure improvements

### 3.1 🟡 Sailing physics constants are scattered  ⏳ DEFERRED
- `SAILING` (base fallback)
- `SHIP_CLASSES.*.sailing*` (per-class)
- `SAILING_SYSTEM` (deadzone, turn penalty, corridor epsilon)
- `SAILING_RENDER` (visual + camera config)

**Status:** Deferred — large refactor, low immediate impact compared to the gameplay items just landed. New `ARRIVAL`, `WIND`, `CARGO_LOAD`, and `ROUTE_MODIFIER_EFFECTS` were added as top-level config blocks rather than nested under `SAILING.*` for the moment; consolidation can happen as a single sweep later.

**Better target structure (for future):** consolidate gameplay-affecting sailing knobs in a single `SAILING` namespace with sub-objects (`SAILING.physics`, `SAILING.encounter`, `SAILING.arrival`, `SAILING.wind`, `SAILING.cargoLoad`, `SAILING.routeModifiers`). Move purely visual stuff to `SAILING_RENDER`. Per-class overrides stay where they are but reference `SAILING.physics` defaults explicitly.

### 3.2 🟡 `SailingSystem` is the only stateless static class
Other systems are also static (`CombatSystem` has state — projectile pool — and is instantiated). For consistency, either make `SailingSystem` regular methods on an instance (so it can carry per-ship physics state like a smoothing filter or wind), or convert everything to free functions.

### 3.3 🟡 `OverworldScene.update` is doing two jobs
1. Apply sailing physics + bilge + repair ticks (during a voyage).
2. Return the arrived ship state when the voyage ends.

This is fine for now but the method is the main per-frame consumer in SAILING state. As more travel-time mechanics land (wind, sub-events, fatigue), this will balloon. Worth planning a small `VoyageController` layer that owns the tick loop and stays decoupled from OverworldScene's data ownership.

### 3.4 🟡 `Game._updateSailing` blurs concerns
Currently does: chart screen toggle, sailing update, morale decay, station effects refresh, encounter timer, arrival toast, state transitions. About six different responsibilities.

After the §3.3 refactor, `VoyageController.tick(dt, input)` would absorb morale decay, station effects, the encounter timer, and the arrival detection, leaving Game with just state-machine transitions.

### 3.5 🟢 `lastTravelRoute` tracking in MapUI is the only "previous travel route" cache
**Where:** [src/ui/MapUI.js:241-248](src/ui/MapUI.js)

Used purely to fire the "Setting sail to X!" toast once per voyage. Could move to PortScene / OverworldScene as a proper voyage-state machine ("PLANNING → DEPARTED → IN_TRANSIT → APPROACHING → ARRIVED") that emits events; UI subscribes to events instead of diffing across frames.

---

## 4. New mechanics worth considering

### 4.1 🟢 Wind direction (planned, IMPLEMENTATION_PLAN §8.1 S.2)  ✅
**Status:** Done (gameplay layer). Each map now stores `wind.angleRad` (randomised at generation, persisted via MapSerializer). `SailingSystem.computeWindMultiplier(ship, wind)` returns +25%/-20% based on heading-vs-wind alignment (cosine curve, configurable via `WIND.bonusMult` / `penaltyMult` / `shape`). The result is stashed on `ship._windMult` so the HUD voyage panel shows a `🌬+18%` pill when active.

*Follow-up:* faint wind arrow on the minimap / chart screen still pending — purely cosmetic.

### 4.2 🟢 Sub-events along the corridor
- 1-3 small lateral events per voyage (flotsam, debris, mini-storm cells, friendly NPC).
- Each is a circle the player can intercept by drifting inside the corridor.
- Loot: gold, rumors, occasional unique items.

### 4.3 🟢 Voyage difficulty modifiers  ✅
**Status:** Done. New `ROUTE_MODIFIER_EFFECTS` config maps each modifier to gameplay effects:
- **stormy:** `thrustMult 0.75`, `maxSpeedMult 0.85`, `frictionPower 0.997`, `hullDamagePerSecond 0.5`
- **patrolled:** `encounterRateMult 2.0`
- **shoals:** `corridorWidthMult 0.65`, `bilgeWaterPerSecond 0.4`

`OverworldScene._applyRouteModifiers(dt, baseCorridorWidth)` re-applies multipliers each tick (using a cached `_routeBasePhysics` so multipliers don't ratchet). Hull damage / bilge water tick on the ship in real time. Game's `_currentEncounterRateMult()` reads the route's modifiers and scales the Poisson λ when sampling delays. Multipliers stack multiplicatively when a route has multiple modifiers.

### 4.4 🟢 Cargo / overload effect  ✅
**Status:** Done. New `CARGO_LOAD` config: linear ramp from `softCap 0.8` to 1.0 imposing `maxPenalty 0.25` (top speed) and `maxTurnPenalty 0.20` (turn rate) at full hold. `getCargoLoadPenalty(loadRatio, cfg)` helper in `utils/upgrades.js`. `OverworldScene._applyCargoLoadPenalty(cargo, shipClassId, upgrades)` is called once at `startTravel()` and writes `_cargoLoadInfo` on the ship for future HUD use.

### 4.5 🟢 Heading hint / autopilot
- "Set heading to dock" auto-faces the ship to the destination (one press).
- Optional autopilot toggle: ship sails itself at 70% of effective max while you focus on station management. Disabled mid-encounter.

---

## 5. Recommended order of attack

Top items are the highest-impact / lowest-risk wins.

| # | Item | Effort | Impact | Status |
|---|------|--------|--------|--------|
| 1 | §1.2 — Document & wire `SAILING.speedMultiplier` | S | 🔴 | ✅ |
| 2 | §1.1 — Make sailing physics dt-scaled (frame-rate independent) | M | 🔴 | ✅ |
| 3 | §2.8 — Cancel-voyage button using existing `cancelTravel()` | S | 🟠 | ✅ |
| 4 | §2.4 — Pre-encounter warning toast + flee window | S | 🟠 | ✅ |
| 5 | §1.3 — Chart Screen pauses sailing | S | 🟠 | ✅ |
| 6 | §1.4 — Centralise encounter-timer resets | S | 🟠 | ✅ |
| 7 | §2.1 — ETA + heading-vs-destination delta on HUD | M | 🟠 | ✅ |
| 8 | §2.3 — Arrival zone + "Press F to dock" prompt | M | 🟠 | ✅ |
| 9 | §2.6 — Speed-relative camera zoom | S | 🟡 | ✅ |
| 10 | §2.9 — Normalize wake threshold to fraction of effective max | S | 🟡 | ✅ |
| 11 | §2.5 — Stations-active pill on sailing HUD | M | 🟡 | ✅ |
| 12 | §4.3 — Wire route modifiers (stormy/patrolled/shoals) into actual sailing effects | M | 🟡 | ✅ |
| 13 | §4.4 — Cargo overload speed/turn penalty | S | 🟢 | ✅ |
| 14 | §4.1 — Wind direction with simple bonus/penalty | M | 🟢 | ✅ |
| 15 | §1.6 — Cache `effectiveMaxSpeed` per tick + breakdown tooltip | S | 🟢 | ✅ |
| 16 | §2.7 — Sailing keyboard-shortcut sheet (mode line) | S | 🟢 | ✅ |
| — | — | — | — | — |
| 17 | §3.3 / §3.4 — Extract `VoyageController` once mechanics start to pile up | L | 🟡 | ⏳ |
| 18 | §4.2 — Corridor sub-events (flotsam, debris) | L | 🟢 | ⏳ |
| 19 | §4.5 — Autopilot / heading-to-dock helper | M | 🟢 | ⏳ |
| 20 | §2.10 — Drop or repurpose lateral corridor movement | S | 🟢 | ⏳ (design call) |
| 21 | §1.5 — Verify wake mesh rotation with non-symmetrical texture | S | 🟢 | ⏳ (visual playtest) |
| 22 | §3.1 — Consolidate sailing config namespaces | M | 🟡 | ⏳ |
| 23 | Wind arrow on minimap / chart screen | S | 🟢 | ⏳ (split from §4.1) |
| 24 | Hull-repair / bilge-pump indicator arrows | S | 🟢 | ⏳ (split from §2.5) |
| 25 | Corridor approach-zone visual (3D ring) | S | 🟢 | ⏳ (split from §2.3) |
| 26 | Minimap enemy-telegraph before combat | S | 🟢 | ⏳ (split from §2.4) |
| 27 | Cancel-voyage morale/supplies penalty | S | 🟢 | ⏳ (split from §2.8) |
| 28 | `?` overlay sheet listing all bindings | S | 🟢 | ⏳ (split from §2.7) |

Each landed item should be ticked here and (if relevant) noted in `Improvements.md` / `IMPLEMENTATION_PLAN.md`.

---

## 6. Diagnostic playbook (debug overlay)

A toggleable debug overlay is built into the running game. **Press `` ` `` (backtick) to show/hide.**

**Sharing the dump:**
- Click **Download** in the overlay header → saves a timestamped `yohoh-debug-*.txt` file with all live sections + the full event log
- Click **Copy** → copies the same dump to the clipboard
- Overlay text is selectable for normal copy/paste

The overlay shows live state in four sections plus a rolling event log:

| Section | What it shows |
|---|---|
| **Game** | fps, current game state, live keyboard state (W/A/S/D), mouse NDC + leftDown, selected/hovered route |
| **Overworld** | current island, `isTraveling`, active travel route (a↔b), wind angle |
| **Ship** | position, rotation (degrees), `speed` and `effectiveMaxSpeed`, `maxSpeed/thrust/friction`, breakdown (sail × crew × bilge × station), wind multiplier, cargo-load info, hull/sail/crew/bilge/leaks |
| **Sailing** | encounter countdown timer, warning timer, flee-throttle accumulator, voyage progress + ETA |

The **EVENTS** log at the bottom catches:
- `MapUI._onStartSailing` invocations (button click reached UI)
- `Game._startSailing called: ...` + failure reasons
- `startTravel BLOCKED: ...` / `startTravel OK: ...` from OverworldScene
- `canvas click at graph (x, y) → route=...` from the map hit-test
- `console.warn` / `console.error` messages (piped in)
- Window-level errors and unhandled rejections

**Keyboard shortcuts inside the overlay:**
- `` ` `` — toggle visibility
- `Shift+L` (while overlay visible) — clear the event log
- `Shift+D` (while overlay visible) — download dump as `.txt`
- `Shift+C` (while overlay visible, no text selected) — copy dump to clipboard

### What to look for when ship doesn't move

| Symptom in overlay | Likely cause |
|---|---|
| `KeyW: false` while pressing W | OS / focus issue, or another modal eating the key |
| `KeyW: true`, but `speed` stays 0 | `effectiveMaxSpeed` ≤ deadzone (0.02). Check Ship breakdown — likely sailingStationMult (empty crew = 0.7225) × everything else collapsed below 0.02 |
| `speed` rises but ship position doesn't change | `_integrateMotion` bug or coordinate scaling issue |
| Speed rises and pos updates but ship looks stuck | Corridor clamp pulling back to origin (rotation pointing wrong direction?) |
| `effectiveMaxSpeed` is 0 | Likely `crewMult` or `sailSpeedMult` collapsed; check Ship breakdown |

### What to look for when Set Sail click does nothing

| Symptom in overlay log | Likely cause |
|---|---|
| `canvas click at graph (x, y) → route=null` after clicking the route line | Hit-test missed; click was too far from the line, OR the route doesn't touch the current island (filter) |
| Click logged with route, but no `MapUI._onStartSailing` entry after pressing Start Sailing | DOM click handler not bound (`init()` didn't run), or another overlay intercepting the click |
| `MapUI._onStartSailing: pendingRoute=false` | Selection panel state was cleared between selecting and clicking. Check that selectedRoute persisted |
| `_startSailing called: route=[a↔b]` followed by `✗ FAIL: ...` | Specific failure reason logged (no current island / no edge / not enough gold for supplies / etc) |
| `startTravel BLOCKED: already traveling on [...]` | Old voyage didn't clean up; the defensive reorder in `startTravel` should make this self-heal on next attempt |
| No log at all on button click | The button's click handler isn't reaching `_onStartSailing`. Check pointer-events / z-index on overlay siblings |
