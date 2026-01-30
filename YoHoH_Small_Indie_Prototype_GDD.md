# You Only Have One Hull — Small Indie Prototype (GDD)

**Document status:** Draft v0.2 (prototype-focused)  
**Last updated:** 2026-01-29  
**Scope:** *Small indie prototype* (single-player first; optional co-op as stretch)  

> **One sentence:** Sail a stylized archipelago, trade goods for profit, upgrade your ship and crew, and outsmart pirates and “Pirate Kings” in readable top‑down naval combat.

---

## Table of Contents
1. [High Concept](#1-high-concept)  
2. [Design Goals](#2-design-goals)  
3. [Target Audience & Platforms](#3-target-audience--platforms)  
4. [Pillars](#4-pillars)  
5. [Player Fantasy](#5-player-fantasy)  
6. [Core Gameplay Loop](#6-core-gameplay-loop)  
7. [Game Structure](#7-game-structure)  
8. [Core Systems](#8-core-systems)  
9. [Progression](#9-progression)  
10. [Enemies & Encounters](#10-enemies--encounters)  
11. [Boss Design](#11-boss-design-prototype)  
12. [Narrative & Tone](#12-narrative--tone-prototype)  
13. [Art Direction](#13-art-direction)  
14. [Audio Direction](#14-audio-direction)  
15. [UX / UI Requirements](#15-ux--ui-requirements-prototype)  
16. [Technical Notes](#16-technical-notes-prototype)  
17. [Scope Boundaries](#17-scope-boundaries)  
18. [Milestones](#18-milestones-suggested)  
19. [Risks & Mitigations](#19-risks--mitigations)  
20. [Future Expansion Hooks](#20-future-expansion-hooks-non-prototype)  
21. [Appendix](#21-appendix)  

---

## 1. High Concept

A top‑down pirate sea adventure where the player captains a ship, **buys and sells goods between islands**, upgrades their vessel, and manages a **lightweight crew system**—while surviving hazards, pirates, and Pirate King strongholds.

**Genre:** Action‑Adventure + Trading / Light RPG  
**Camera:** Top‑down (2D or 2.5D)  
**Session length target:** 15–30 minutes (meaningful progress each session)

---

## 2. Design Goals

1. **Trading that feels like adventure**, not a spreadsheet.
2. **Naval combat that is readable** (positioning + broadside arcs) and fast to learn.
3. **Progression through profit:** upgrades unlock farther routes and better margins.
4. **Light crew management:** meaningful choices with minimal UI burden.
5. **Prototype-first scope:** build the fun loop before any big “online world” systems.

---

## 3. Target Audience & Platforms

- Players who enjoy: pirate fantasy, trading games, top‑down action, ship upgrading.
- **Platforms (prototype):** PC (Windows/Mac/Linux).
- **Controls:** Mouse+keyboard; gamepad support as stretch.

---

## 4. Pillars

### 4.1 The Sea Is a Board Game
A strategic overworld map of islands and routes where **distance increases danger and reward**.

### 4.2 Profit Is Progress
Money and cargo drive progression: better margins → better ship → farther routes.

### 4.3 Your Crew Is Your Build
Crew stations and traits create build variety without heavy micromanagement.

### 4.4 Risk Has Teeth (But Not Misery)
Defeat costs time, supplies, and a percentage of cargo—not the entire save.

---

## 5. Player Fantasy

- Start as a fresh captain with a starter sloop.
- Learn ports, routes, and price patterns.
- Outsail pirates using turning radius, cannon arcs, and terrain.
- Recruit and train a crew that “feels” like a team.
- **Rescue and save dragons**—find eggs, free captives, ferry them to sanctuaries.
- Challenge Pirate King lieutenants and raid strongholds (often to free captured dragons).

---

## 6. Core Gameplay Loop

### 6.1 Primary Loop (10–20 minutes)
1. **Dock** → check market prices + rumors/contracts  
2. **Buy / Accept** → select cargo and/or contract  
3. **Sail** → choose route; face events and encounters  
4. **Fight / Flee** → ship combat + boarding choice  
5. **Sell / Turn in** → profit or complete contract  
6. **Upgrade** → ship modules + crew hires/training  
7. **Push outward** → unlock farther islands and higher stakes

### 6.2 Secondary Loops
- **Crew loop:** recruit → assign stations → pay shares → morale drift
- **Ship loop:** module choices → damage/repair → capacity vs combat tradeoffs
- **Reputation loop (light):** faction standing → better prices + port access

---

## 7. Game Structure

### 7.1 Overworld Map (Strategic)
- The world is a **graph of islands connected by routes**.
- The starter region is safer; danger and rewards increase with **graph distance**.
- Routes can have modifiers: **stormy**, **patrolled**, **shoals**, **fog**, etc.

**Prototype implementation options**
- **Option A (recommended):** hand-authored map (fastest to fun, easiest balancing)  
- **Option B (stretch):** seeded procedural planar graph with archipelago clustering  

### 7.2 Encounter Maps (Tactical)
Encounters transition into a bounded **top‑down sea arena** with:
- rocks/shoals/islets (navigation + cover)
- optional simple current lanes
- rare visibility events (fog) for variety

---

## 8. Core Systems

## 8.1 Sailing & Handling
**Movement model:** momentum + turning radius (arcade‑sim hybrid)
- forward thrust, braking, drift
- turning slows at high speed
- shallow water zones: speed penalty + optional scrape damage

**HUD essentials**
- heading arrow + speed bar
- cannon arc preview (port/starboard)
- damage indicators (hull/sails/crew)

---

## 8.2 Naval Combat (Real‑Time)

### 8.2.1 Weapons
- **Port broadside** (left)
- **Starboard broadside** (right)

**Ammo (prototype)**
- Standard shot (baseline)
- Chain shot (sails damage / speed reduction) — rare loot or upgrade

### 8.2.2 Damage Model
- **Hull HP** (lose condition when 0)
- **Sails** (speed multiplier)
- **Crew effectiveness** (global multiplier; reduced by hits / boarding / morale)

### 8.2.3 Encounter Outcomes
- **Victory:** loot + salvage + reputation
- **Defeat:** lose % of cargo + supplies cost; respawn at last safe port

### 8.2.4 Grapple & Boarding
Boarding is a **high‑risk, high‑reward finisher**.
- Requires target below a hull threshold and within grapple range.
- Outcome based on: boarding stat + morale + upgrades.

**Boarding resolution (prototype)**
- Fast result screen + one choice:
  - **“Plunder Deep”** (more loot, more injuries)
  - **“Secure & Sail”** (safer, less loot)
- Produces: loot bundle, injuries, morale change.

> **Out of scope:** full on-foot combat layer (sword fighting/brawling reserved for expansion).

---

## 8.3 Economy & Trading

### 8.3.1 Goods (Prototype Set)
A small set is easier to learn and balance.

| Category | Goods (Example) | Notes |
|---|---|---|
| Staples | Rum, Timber, Cloth, Iron | Most ports trade these |
| Military | Powder, Cannon Parts | High demand near conflict routes |
| Luxury | Spices, Pearls | Low volume, high margin |
| Exotic (rare) | Relics | Late game / boss islands |

### 8.3.2 Price Model (Readable + Tunable)
Each island has:
- **Base Price** per good
- **Bias** (produces/consumes certain goods)
- **Variance** (how much prices swing)
- **Event Shocks** (temporary modifiers)

**Simple formula (design intent)**
- `Price = Base × (1 + Bias) × Trend × Event × RandomNoise`
- Noise stays small; **events and bias** do the heavy lifting so players can read the world.

### 8.3.3 Rumors & Contracts
- **Rumors**: “Powder selling high at Port Ember (2 days)”
- **Contracts**:
  - Delivery (guaranteed profit + time limit)
  - Smuggling (high profit, inspection risk)
  - Salvage rights (wreck marker, loot lottery)

### 8.3.4 Economy Sinks (Pacing)
- Repairs + supplies
- Crew shares/wages
- Dock fees (scale with ship tier)
- Optional insurance (reduces defeat loss)

---

## 8.4 Crew System (Light Micromanagement)

### 8.4.1 Hiring
Crew recruited from **taverns** and special encounters.
Each crew member has:
- station aptitude (e.g., gunner)
- 1 positive trait
- 1 negative trait
- morale baseline

### 8.4.2 Stations (Prototype)
| Station | What it improves |
|---|---|
| Helmsman | turn rate + drift control |
| Gunner (Port/Starboard) | reload speed + accuracy cone |
| Carpenter | repair rate + leak-stopping chance |
| Navigator | encounter avoidance + rumor accuracy |
| Boarding Lead | grapple strength + boarding results |

### 8.4.3 Crew Size & Shares
- More crew = better performance
- But larger crew takes a larger share of profits (automatic split)

### 8.4.4 Morale (Lightweight)
Morale influences:
- minor stat buffs/debuffs
- chance to panic under heavy damage

Morale shifts from:
- pay, victories, voyage length, injuries, food/rum quality

---

## 8.5 Ship Upgrades & Customization

### 8.5.1 Ship Stats
- Hull HP, Speed, Turn Rate
- Cargo Capacity, Crew Capacity
- Broadside Damage, Reload Time

### 8.5.2 Ship Tiers (Prototype)
| Tier | Name | Role | Unlock |
|---|---|---|---|
| 1 | Sloop | starter / agile | default |
| 2 | Brig | balanced trader-fighter | Infamy 3 |
| 3 | Frigate | combat-leaning | Infamy 6 |

### 8.5.3 Upgrade Slots (Prototype)
| Slot | Example Upgrades | Tradeoff |
|---|---|---|
| Hull | Plating, Reinforced Bulkheads | heavier = slower |
| Sails | Fast rigging, Tight turns | lower durability |
| Cannons | Heavy shot, Quick reload | cost + heat |
| Cargo | Expanded hold | heavier turn |
| Utility | Repair kit, Smoke bomb (escape) | consumable cost |
| Boarding | Grapples, Marines | less cargo space |

### 8.5.4 Cosmetics (Optional)
Flags, paint, figurehead, sail pattern (earned from bosses/contracts).

---

## 8.6 Islands & Biomes

### 8.6.1 Island Types
- **Normal ports:** market + tavern + shipwright
- **Forage/exotic islands:** gather rare materials; light risk
- **Pirate King strongholds:** boss encounter + unique loot

### 8.6.2 Port Services
- Market
- Shipwright (upgrades/repairs)
- Tavern (crew + rumors + contracts)
- Warehouse (optional: store cargo)

---

## 8.7 Fast Travel (Prototype Friendly)
- **Ferries** between certain safe islands for a fee.
- **Magic/dragons**: reserved for expansion.

---

## 9. Progression

### 9.1 Captain Progression (“Infamy”)
Earned from:
- profit, contracts, victories, boss kills

Unlocks:
- ship tiers
- crew cap
- access to outer routes/ports
- higher contract tiers

### 9.2 Crew Progression
- Station XP grants small bonuses
- Specific roles/skills for each Station
- Injuries temporarily reduce performance until healed at dock

### 9.3 Loot & Items
- upgrade components
- consumables (optional)
- cosmetics
- **dragon eggs** (quest item: deliver to sanctuary, not to Kings)

---

## 10. Enemies & Encounters

### 10.1 Enemy Archetypes
| Type | Behavior | Player lesson |
|---|---|---|
| Trader | flees, light defenses | chase & positioning |
| Raider | rush grapple | deny boarding / kite |
| Interceptor | fast protector | pick targets, terrain |
| Privateer | balanced | core skill check |
| Lieutenant | gimmick kit | counterplay |
| Stronghold | multi-phase | endgame loop |

### 10.2 Encounter Types
- pirate ambush
- merchant convoy
- storm hazard (navigation check)
- wreck salvage
- reef maze (short navigation challenge)
- **dragon egg discovery** (volcanic islands, wrecks; Kings' hunters may pursue)
- rare “ghost lights” event (optional)

---

## 11. Boss Design (Prototype)

### 11.1 Pirate King Lieutenant (Example Spec)
**Theme:** chain shot + aggressive boarding  
**Mechanics:**
- fires chain shot every N seconds to cripple sails
- attempts grapple at 50% hull
- summons a small escort once per fight (optional)

**Rewards:**
- unique cannon component
- cosmetic flag
- unlock: stronghold coordinates (next goal)
- **rescued dragon / dragon egg** (if lieutenant was transporting one)

---

## 12. Narrative & Tone (Prototype)

**Tone:** adventurous, slightly comedic, readable fantasy piracy—with darker undertones when the Pirate Kings are involved.  
**Narrative footprint:** light framing + emergent player stories.  
**World:** *The Shattered Seas* — a fractured archipelago where old empires drowned and five Pirate Kings rose from the wreckage. See `LORE.md` for full world-building and King backstories.

**Core mission: Dragons**  
Your secret calling is to **rescue and save the last of the dragons**. Most of the Five Pirate Kings hunt them relentlessly—for power, for rituals, to feed the deep, or to eliminate rivals. You find eggs before hunters do, free captured dragons from strongholds, and ferry them to **dragon sanctuaries** where they can thrive. Jasper Barrow (Ghost Captain) does *not* hunt dragons and may aid your cause.

**Prototype beats**
- You are a new captain climbing the ranks in the **Home Waters**—the last bastion of order.
- The **Five Pirate Kings** dominate the outer seas; **four of them hunt dragons**; Jasper protects them:
  - *Jasper Barrow* (Ghost Captain) — Veilwake Sea; **protects dragons**, aids rescuers
  - *Mordekai Drakon* (Sea Serpent King) — Coiled Expanse; hunts dragons (rivalry)
  - *Adara Thalassa* (Queen of Leviathans) — Drowned Crown; hunts dragons (sovereignty)
  - *Nimue Tideborn* (Kraken Caller) — Black Spiral; hunts dragons (feeds the deep)
  - *Ebon Flameheart* (Dragon Marauder) — Ashen Reach; hunts all dragons except Blackfang
- Defeating lieutenants reveals a stronghold location—and may free captured dragons.
- Route modifiers (fog, serpent marks, coral, darkness, ash) hint at which King's domain you're entering.

---

## 13. Art Direction

### 13.1 Visual Style
- stylized top‑down 2.5D (or clean 2D)
- strong silhouettes, clear cannon arcs
- biome palettes per archipelago (coral, ash, fog, jungle)

### 13.2 UI Style
- nautical charts, compass motifs
- market UI optimized for fast decisions (profit hints)

---

## 14. Audio Direction

- ambience: sea + ports
- combat: chunky cannons, splinters, rope tension
- music: shanty‑inspired themes; tension layers in combat
- stingers: contract complete, boarding success, boss phase shift

---

## 15. UX / UI Requirements (Prototype)

### 15.1 Key Screens
- main menu
- world map (routes, danger rating, travel cost)
- port hub (market / tavern / shipwright)
- combat HUD
- results screen (loot, repairs, crew shares)
- upgrade screen (stat deltas + preview)

### 15.2 Accessibility (Minimum)
- rebindable controls
- UI text scaling
- icon shapes for good categories (colorblind support)

---

## 16. Technical Notes (Prototype)

- deterministic seeded world (optional) for repeatable testing
- AI: patrol, chase, broadside, flee, grapple attempt
- save system:
  - ship + upgrades
  - crew roster + morale
  - discovered islands + reputation

---

## 17. Scope Boundaries

### In Scope
- trading economy + contracts
- real‑time ship combat (broadside)
- boarding resolution (simple)
- crew stations + morale (light)
- upgrades + ship tiers
- 8–12 islands worth of content

### Out of Scope
- MMO features, clans, player shops, premium currency
- governance/blockades as a system
- on‑foot combat layer
- dragons as mounts / travel
- large-scale RTS battles

---

## 18. Milestones (Suggested)

### Milestone A — “Fun First Combat”
- ship handling, shooting, 2 enemy types, basic loot

### Milestone B — “Trading Loop”
- 6–8 goods, market UI, buy/sell, repairs, simple variance

### Milestone C — “Crew + Upgrades”
- hire crew, stations, 6–8 upgrades, ship tier 2

### Milestone D — “Vertical Slice”
- 8–12 islands, contracts, 1 lieutenant boss, tuned economy

---

## 19. Risks & Mitigations

- **Economy exploits** → sinks, caps, and event-driven spikes; avoid unlimited arbitrage loops
- **Combat readability** → strong arc previews; limited VFX clutter
- **Content volume** → archetypes + procedural encounter modifiers
- **Scope creep** → keep expansion ideas in a separate “Phase 2” document

---

## 20. Future Expansion Hooks (Non‑Prototype)

- governance / blockades
- player shops / crafting economy
- dragons and long‑range travel
- optional turn‑based tactical PvP arena mode

---

## 21. Appendix

### 21.1 Glossary
- **Infamy:** captain level used for unlocks  
- **Stronghold:** pirate king base / boss area  
- **Bias:** island’s tendency to buy/sell certain goods at a better rate  

### 21.2 Content Targets (Prototype)
- 8–12 islands, 6–10 route modifiers, 10–15 encounter cards
- 3 ship tiers, ~10 upgrades, 20–30 crew members (traits generated)
- 1 lieutenant boss + 1 stronghold boss (stretch)

---
