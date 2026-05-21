# YoHoH — Transaction Ledger Design

**Document status:** Design + roadmap for a player-facing transaction ledger covering currencies (gold, infamy) and inventories (cargo, crew, ship state, upgrades). Distinct from the diagnostic Logger (Logging_Improvements.md): the **Ledger is the audit trail of game-economic state**, the **Logger is for developer diagnostics**. They share infrastructure (persistence, runtime toggles, UI surface) but have different shapes, retention rules, and consumers.
**Last updated:** 2026-05-18

> **Phase X1 landed (2026-05-18):** Foundation ships. New `src/utils/Ledger.js` (singleton `ledger` instance) with pre-allocated 4096-entry ring buffer, in-place object reuse, debounced LocalStorage persistence (last 1000 entries × last 5 sessions), quota-recovery, CSV / JSON export, query API with filters (types / categories / sources / since / until / search / sessionId / limit). New `src/utils/LedgerSources.js` — single source of truth for the source vocabulary. Game grew five helpers (`_adjustGold` / `_adjustInfamy` / `_adjustCargo` / `_addCrew` / `_removeCrew`) — single mutation point per economic dimension. Six high-traffic sites migrated: starting gold (after Logger boot), flotsam recovered, cancel-voyage penalty, combat loot, sailing supplies, dock fee. Port net-session bookkeeping entry on `_leavePort` (full per-transaction decomposition deferred to X2). DebugOverlay grew a Ledger tab with type/category/search filters + summary strip (gold +X/-Y = net Z) + CSV/JSON export. See §11 below for landing notes.
**Companion docs:** [Logging_Improvements.md](Logging_Improvements.md) (Logger / DebugOverlay foundation), [Port_Improvements.md](Port_Improvements.md) (port spend / earn), [Sailing_Improvements.md](Sailing_Improvements.md) (supplies / cancel-voyage cost), [Battle_Improvements.md](Battle_Improvements.md) (combat loot), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

> Scope: every code path that mutates `_playerGold`, `_playerInfamy`, `_playerCargo`, `_crewRoster`, `_playerShipState`, or `_playerUpgrades`. The Ledger records the delta + before/after + source so the player (and developer) can answer "where did my money go?" / "how did I lose two crew?" / "when did I buy this upgrade?".

---

## 1. Why this is needed

Today the game mutates economic state in ~15 different files with no shared audit trail. The player sees:

- Gold goes from 100 → 95: was that a sailing supply cost? A dock fee? A trade? A bug?
- Cargo's `rum` count drops by 1: a crew member drank it? Sold? Stolen by combat? Auto-decremented somewhere?
- Crew count drops from 4 to 3: morale? Combat casualty? Manual dismiss?
- The Port "activity log" (Port_Improvements §3.8) covers port-internal transactions but nothing else.

When a player reports "my gold disappeared after combat" or "I had 5 rum and now I have 3" we have no record to consult. The new diagnostic Logger helps for code-path tracing but doesn't capture the *semantic* economic event.

A **Ledger** captures every economic transaction as a structured, queryable, persistent record so:

1. **Players** can pop open a Transactions tab and see "what happened to my money / inventory in this session" (and across sessions, capped).
2. **Developers** debugging an econ bug can see the exact sequence of `gold -5 (supplies) → gold -3 (dock_fee) → gold +50 (combat_loot)` instead of inferring.
3. **Future analytics** (opt-in) can aggregate playtest data on what players spend on.
4. **Save/load + crash recovery** carries the recent ledger so loading a save shows recent transactions.

---

## 2. Ledger entry shape

Every economic mutation produces ONE entry. Entries are immutable once recorded.

```js
{
  id: 1234,                     // monotonic, per-session
  ts: 1716000000000,            // milliseconds since epoch
  sessionId: 'sess_8f2a...',    // changes per Game.init; lets us segment cross-session dumps

  type: 'gold_change'           // see §3 for the type catalogue
      | 'infamy_change'
      | 'cargo_change'
      | 'crew_change'
      | 'ship_state_change'
      | 'upgrade_purchased',

  category: 'port'              // coarse bucket — useful for filtering
          | 'sailing'
          | 'combat'
          | 'crew'
          | 'voyage'
          | 'system',           // e.g. starting gold, dev cheats

  source: 'market_buy'          // concrete reason — see §3 for the catalogue
        | 'market_sell'
        | 'dock_fee'
        | 'supplies_cost'
        | 'combat_loot'
        | 'crew_hire'
        | 'rum_served'
        | 'repair_hull'
        | 'cancel_voyage_penalty'
        | 'flotsam_recovered'
        | 'debris_hull_damage'
        | ...,

  delta: -5,                    // signed; positive = gained, negative = spent
  balance: 95,                  // post-mutation balance (or count, for inventory)

  context: {                    // free-form metadata, payload varies by source
    good?: 'rum',               // for cargo events
    quantity?: 1,
    unitPrice?: 5,
    enemy?: 'Raider',           // for combat events
    islandId?: 3,               // for port events
    routeId?: '4↔7',            // for voyage events
    crewId?: 'crew_abc',        // for crew events
    upgradeId?: 'plating',      // for upgrade events
    [...]
  },

  state: 'OVERWORLD'            // game state when the event fired
       | 'SAILING'
       | 'COMBAT'
       | 'PORT'
       | 'MENU',
}
```

**Design notes:**
- `balance` is captured at write time so a snapshot can reconstruct totals without summing from zero. Trades off storage size for query speed.
- `context` is intentionally untyped — different sources need different fields. Schema documented per-source in §3.
- `sessionId` lets us distinguish "current session" from "history" in queries / dumps.
- Entries are **immutable** — corrections happen as new offsetting entries, not edits. Mirrors real bookkeeping.

---

## 3. Source catalogue (the WHY behind every entry)

Every site that mutates economic state declares a `source`. This is the *vocabulary* the Ledger speaks — when you query "where did my gold go?", the source tells you.

### 3.1 Gold (`type: 'gold_change'`)

| Source | When | Sign | Context fields |
|---|---|---|---|
| `system_starting_gold` | New game init | + | `{ amount }` |
| `market_buy` | Port market purchase | - | `{ islandId, good, quantity, unitPrice }` |
| `market_sell` | Port market sale | + | `{ islandId, good, quantity, unitPrice }` |
| `dock_fee` | Entering port | - | `{ islandId, fee }` |
| `supplies_cost` | Setting sail | - | `{ routeId, cost }` |
| `combat_loot` | Combat victory | + | `{ enemyCount, totalSalvage }` |
| `crew_hire` | Tavern hire | - | `{ crewId, hireCost }` |
| `repair_hull` | Shipwright hull repair | - | `{ points, costPerPoint }` |
| `repair_sails` | Shipwright sails repair | - | `{ points, costPerPoint }` |
| `repair_leaks` | Shipwright leak repair | - | `{ leaks, costPerLeak }` |
| `upgrade_purchase` | Shipwright upgrade | - | `{ upgradeId, slot }` |
| `ship_purchase` | Shipwright new ship | - | `{ classId, cost }` |
| `cancel_voyage_penalty` | Player cancels voyage | - | `{ amount }` |
| `flotsam_recovered` | Corridor event | + | `{ amount }` |
| `dev_cheat_grant` | Dev cheat | ± | `{ amount }` |

### 3.2 Infamy (`type: 'infamy_change'`)

| Source | When | Sign | Context fields |
|---|---|---|---|
| `combat_victory` | Each combat win | + | `{ amount }` |
| `combat_loot_bonus` | Per gold from combat | + | `{ gold, rate }` |
| `trade_sale_bonus` | Per gold from selling goods | + | `{ gold, rate }` |
| `unlock_brigantine` | Crossing tier threshold | (info only — no delta) | `{ threshold }` |
| `unlock_galleon` | ditto | (info only) | `{ threshold }` |

### 3.3 Cargo (`type: 'cargo_change'`, ONE entry per good per mutation)

| Source | When | Sign | Context fields |
|---|---|---|---|
| `market_buy` | Port purchase | + | `{ islandId, good, unitPrice }` |
| `market_sell` | Port sale | - | `{ islandId, good, unitPrice }` |
| `rum_served` | Tavern serve-rum | - | `{ good: 'rum' }` |
| `flotsam_recovered` | Corridor flotsam (future: when flotsam drops cargo not gold) | + | `{ good, quantity }` |
| `combat_capture` | (Future) captured enemy cargo | + | `{ good, quantity }` |

### 3.4 Crew (`type: 'crew_change'`)

| Source | When | Sign | Context fields |
|---|---|---|---|
| `crew_hire` | Tavern hire | + | `{ crewId, name, hireCost }` |
| `crew_dismiss` | Tavern dismiss | - | `{ crewId, name }` |
| `crew_combat_loss` | (Future) combat crew damage | - | `{ casualties, enemy }` |
| `crew_morale_decay` | Morale below threshold | (info) | `{ crewId, morale }` |

### 3.5 Ship state (`type: 'ship_state_change'`)

These fire when the persistent `_playerShipState` is mutated outside of the per-tick repair / damage flow. Real-time hull tick changes don't ledger every frame — too noisy. They ledger on **bookmark events**: arrival, port repair, combat-result handoff.

| Source | When | Context fields |
|---|---|---|
| `voyage_arrival` | Voyage completes | `{ from, to, hullBefore, hullAfter, sailsBefore, sailsAfter, leaksBefore, leaksAfter }` |
| `combat_damage_taken` | Combat ends | `{ totalHullDamage, totalSailDamage, leaksAdded }` |
| `repair_at_port` | Shipwright repair | `{ hullRepaired, sailsRepaired, leaksRepaired }` |
| `cancel_voyage` | Player cancels | `{ snapshot: shipState }` |

### 3.6 Upgrades (`type: 'upgrade_purchased'`)

| Source | When | Context fields |
|---|---|---|
| `shipwright_purchase` | Buy an upgrade | `{ upgradeId, slot, cost, replacedUpgradeId? }` |
| `shipwright_remove` | (Future) remove an upgrade | `{ upgradeId, slot, refund? }` |

---

## 4. API

```js
import { ledger } from './utils/Ledger.js';

// Record a transaction
ledger.record({
  type: 'gold_change',
  category: 'sailing',
  source: 'supplies_cost',
  delta: -3,
  balance: this._playerGold,
  context: { routeId, cost: 3 },
  state: this.state,
});

// Query past entries
ledger.query({
  types: ['gold_change'],
  categories: ['port'],
  sources: ['market_buy', 'market_sell'],
  since: Date.now() - 5 * 60 * 1000,   // last 5 minutes
  until: Date.now(),
  search: 'rum',                        // matches msg / context fields
  limit: 100,
  sessionId: 'sess_abc',                // omit for all sessions
}) // → entries[]

// Summary aggregates
ledger.summary({ since, until })
// → { goldGained, goldSpent, goldNet, byCategory: {...}, bySource: {...},
//     topGains: [...], topSpends: [...] }

// Export
ledger.exportCsv({ since, until })  // text/csv string
ledger.exportJson({ since, until }) // pretty-printed string

// Session control
ledger.clear()                       // current session only
ledger.clearAll()                    // all persisted history
ledger.snapshot()                    // current totals + count
```

### Convenience helpers on Game

Rather than scattering `ledger.record(…)` calls everywhere, Game gets a small helper layer:

```js
// Wraps `this._playerGold += delta` AND records the transaction.
this._adjustGold(delta, { source, category, context });

// Same for infamy
this._adjustInfamy(delta, { source, category, context });

// Cargo — fires per good
this._adjustCargo(goodId, delta, { source, category, context });

// Crew — passes the crew member object/id
this._addCrew(crew, { source, context });
this._removeCrew(crewId, { source, context });

// Ship state bookmark
this._bookmarkShipState(snapshot, { source, context });
```

These helpers are the **enforcement point**: any direct `this._playerGold = ...` assignment is a code-review red flag (eventually enforced by a lint rule, see Logging_Improvements §4.3 #13).

---

## 5. Persistence & retention

- Memory ring buffer (default 4096 entries — bigger than the Logger because economic events are rarer per second).
- LocalStorage persistence — default last 1000 entries per session, plus the **N most recent sessions** preserved (default N = 5 — about a week of normal play).
- Quota-exceeded handling: halve the persisted buffer and retry (same pattern as `LocalStorageSink`).
- Save game integration: the active session's ledger snapshot is included in the save state (D.9). Loading a save restores it so "what did I just spend on?" survives a quit/resume.

---

## 6. UI surfaces

### 6.1 Developer surface — DebugOverlay "Ledger" tab

Once the DebugOverlay UI overhaul lands (Logging_Improvements §10), a new **Ledger** tab joins State / Events / Config. It renders a virtualised table of recent entries with column filters (Time / Type / Category / Source / Δ / Balance / State / Context), plus a summary strip at the top (Gold net / Total transactions / By-category breakdown). Export buttons for CSV + JSON.

### 6.2 Player surface — Port "Activity Log" extension

The existing Port `activity-log` panel (Port_Improvements §3.8) was the prototype for this work. Once the Ledger lands, that panel is rewritten to read from the Ledger rather than maintaining its own array — players see a unified history across port sessions.

### 6.3 Player surface — Captain's Log (stretch)

A future global "Captain's Log" overlay (toggleable with `J` or similar) reads from the Ledger. Tabs: Treasury (gold + infamy), Hold (cargo flow), Crew (hires/losses), Ship (damage + repairs). Filter by time range, by category, by source. A real player-facing audit panel, not a debug tool.

---

## 7. Concrete proposed items

| # | Item | Effort | Impact | Status |
|---|---|---|---|---|
| 1 | **`src/utils/Ledger.js`** — record / query / summary / export / persist. Ring buffer + LocalStorage debounce. | M | 🔴 | ✅ |
| 2 | **Source catalogue + constants module** — every `source` string lives in a single `LedgerSources.js`. | S | 🟠 | ✅ |
| 3 | **Game `_adjustGold` / `_adjustInfamy` / `_adjustCargo` / `_addCrew` / `_removeCrew` helpers** — single mutation point per economic dimension. | S | 🔴 | ✅ |
| 4 | **Migrate every `this._playerGold = ...` / `this._playerInfamy = ...` / cargo assignment** to use the helpers. | M | 🔴 | ⏳ (high-traffic done; PortController + remaining sites in X2) |
| 5 | **Hook PortController → Ledger** — per-transaction entries for market buy/sell, repair, upgrade, ship purchase, crew hire. | M | 🔴 | ⏳ (deferred to X2 — net-session entry on `_leavePort` covers the gap for now) |
| 6 | **Hook combat / sailing / corridor-events → Ledger** — combat loot, supplies, cancel-voyage, flotsam, debris. | M | 🔴 | ✅ (combat loot, supplies, cancel-voyage, flotsam done) |
| 7 | **Ship-state bookmarks** — arrival, port repair, combat-end. | S | 🟠 | ⏳ |
| 8 | **DebugOverlay Ledger tab** — table view + column filters + summary strip + export. | M | 🟠 | ✅ |
| 9 | **Save game integration** — include `ledger.snapshot()` in save state; restore on load. | S | 🟡 | ⏳ |
| 10 | **Player-facing Captain's Log overlay** (stretch) — read-only ledger view; filter by time + category; CSV export. | L | 🟢 | ⏳ |
| 11 | **Lint rule banning direct `this._playerGold = ...` etc** — once helpers are universal. | S | 🟡 | ⏳ |
| 12 | **Cross-session retention policy** — config knob (default 5 sessions). UI to view / clear old sessions. | S | 🟡 | ✅ (config done; UI deferred) |
| 13 | **Aggregate analytics queries** — `ledger.summary` returns totals by category. | S | 🟢 | ✅ |

---

## 8. Recommended order of attack

### Phase X1 — Foundation
- Item 1: `Ledger.js` module
- Item 2: source catalogue
- Item 3: helper layer on Game
- Item 9: save game integration

### Phase X2 — Coverage
- Item 4: full migration of direct assignment sites
- Item 5: Port hooks
- Item 6: Combat / sailing / corridor-event hooks
- Item 7: Ship-state bookmarks

### Phase X3 — Surfacing
- Item 8: DebugOverlay Ledger tab (depends on Log UI overhaul shipping first)
- Item 11: lint rule

### Phase X4 — Player-facing (stretch)
- Item 10: Captain's Log overlay
- Item 12: cross-session retention UI
- Item 13: aggregate analytics queries

---

## 9. Open design questions

1. **Inventory granularity**: cargo events fire one entry per good. A market multi-buy of 3 different goods produces 3 entries. Good for granularity, slightly chatty for the UI. Worth a "group adjacent same-source entries" view filter? Probably yes — keep raw data clean, fold in UI.
2. **Hull/sails per-tick changes**: skipped — would emit hundreds of entries per voyage. Bookmark events only (arrival / combat-end / repair). What about long-duration leaks slowly draining the hull? Probably fold into the voyage-arrival bookmark with `damageDuringVoyage` field.
3. **Crew morale**: real number, changes constantly. Don't ledger every frame — only emit on threshold crossings ("morale dropped below 0.5") or on serve-rum / decay-per-day events.
4. **Save-file size impact**: 1000 entries × ~150 bytes = ~150 KB per session. Acceptable for localStorage (5–10 MB quota) but the save file itself doubles in size. Trim aggressively for the save — keep only last N entries per session in the save (say 200), full buffer in the runtime memory ring.
5. **Refunds / corrections**: e.g. player buys an upgrade then refunds it. Two separate entries (`upgrade_purchase` -100 then `upgrade_refund` +100) rather than mutating the first? Probably yes — immutable bookkeeping; the summary can net them.
6. **Multi-currency future-proofing**: today the only currency is gold. If we add a second (silver? infamy spent as currency?), the entry shape should already accommodate (`type: 'gold_change'` / `'silver_change'` etc. or generalise to `currency_change` with a `currency` field). Lean toward the latter from day 1.

---

## 11. Phase X1 landing notes (2026-05-18)

### New modules
- `src/utils/LedgerSources.js` — `TYPE`, `CATEGORY`, `SOURCE` enums + `SOURCE_TO_CATEGORY` defaulting map. ~25 sources covering port / sailing / combat / voyage / crew / system / future-combat.
- `src/utils/Ledger.js` — singleton `ledger` instance with pre-allocated 4096-entry ring buffer (mutated in place — no GC pressure), debounced LocalStorage persistence (last 1000 entries × last 5 sessions configurable), CSV/JSON export, query API with filters (`types`, `categories`, `sources`, `since`/`until`, `search`, `sessionId`, `limit`), and a running tally (`_tally`) for fast `snapshot()` reads without re-querying.

### Game helpers
- `_adjustGold(delta, opts)` — mutates `_playerGold` AND records a `gold_change` entry. Source defaulted from the opts.
- `_adjustInfamy(delta, opts)` — same pattern for infamy.
- `_adjustCargo(goodId, delta, opts)` — per-good cargo mutation; auto-deletes the key on zero.
- `_addCrew(crew, opts)` / `_removeCrew(crewId, opts)` — crew with auto-balance calculation.

### Migrated call sites (6 high-traffic — full Game.js sweep done; PortController is X2)
- `Game.init` — `system_starting_gold` recorded once after the Logger boots so the audit trail starts from a known balance.
- `Game._handleCorridorEvents` (flotsam case) — `flotsam_recovered`.
- `Game._cancelVoyage` — `cancel_voyage_penalty`.
- `Game._updateCombat` (victory path) — `combat_loot` with enemy count + salvage in context.
- `Game._startSailing` (success path) — `supplies_cost` with route id + cost in context.
- `Game._enterPort` — `dock_fee` recorded before handing gold to the port scene.
- `Game._leavePort` — single `port_net_session` bookkeeping entry capturing the net delta across the port session. **Not in the canonical source catalogue** (it's a temporary placeholder) so a code audit will catch it when X2 lands the per-transaction PortController hooks. Until then the net entry stops the ledger from being blind to port time.

### UI surface — DebugOverlay Ledger tab
- Summary strip: `N entries · gold +X / -Y = Z` over the current filter.
- Filter bar: type dropdown, category dropdown, text search, CSV / JSON export buttons.
- Table: newest-first (matches the player's "what did I just spend?" instinct), grid of `time · source · cat · Δ · balance · context`. Δ colour-coded green/red.
- Capped at 500 rendered rows for now (virtualisation proper is L3 — same scope as the Events tab virtualisation).
- Auto-refreshes via `ledger.onChange` RAF-throttled so log-heavy frames don't cause DOM thrash.

### What's NOT yet done (the X2 / X3 / X4 backlog)

| Item | Why deferred |
|---|---|
| §3 #4 — full migration sweep | The bulk of remaining direct `_playerGold` assignments live inside `PortController` / port-scene flows; depends on item #5. |
| §3 #5 — Per-transaction PortController hooks | Larger surface (market buy/sell × goods, repair × hull/sails/leaks, upgrade purchase, ship purchase, crew hire). Sized as its own X2 session. |
| §3 #7 — Ship-state bookmark entries | Needs to define the `ship_state_change` payload precisely and pick the bookmark moments (arrival/port-end/combat-end). Quick once specified. |
| §3 #9 — Save-game integration | One-line addition once we decide how much ledger to persist into the save vs leave to localStorage. |
| §3 #10 — Player Captain's Log overlay | Big new UI surface — L4 stretch. |
| §3 #11 — Lint rule banning direct mutation | Useful once #4 + #5 are universal. |

---

## 10. Cross-references

- **Logging_Improvements §0** — Ledger inherits the same performance constraint: writing an entry is a single object construction + ring-buffer slot write. No DOM work on the hot path. Debounced LocalStorage flushes. Sinks wrapped in try/catch.
- **Logging_Improvements §10 (Log UI overhaul)** — the Ledger tab depends on the tabbed DebugOverlay landing first.
- **Port_Improvements §3.8** — current Port activity log is a prototype; gets rewritten to read from the Ledger.
- **Sailing_Improvements §7** — the Start Sailing silent-fail showed how invisible economic changes (supplies cost) caused confusion. The Ledger gives us a permanent answer to "where did my gold go?".
