/**
 * YoHoH — Ledger source vocabulary
 *
 * Single source of truth for every `source` string that can appear on a
 * Ledger entry. Importing from this module means typos become compile-time
 * errors instead of silently fragmenting the audit trail.
 *
 * See Ledger_Improvements.md §3 for the per-source `context` schema.
 */

// ─── Categories ────────────────────────────────────────────────────────────
// Coarse buckets — useful for "group by category" queries / UI filters.
export const CATEGORY = Object.freeze({
  PORT:    'port',
  SAILING: 'sailing',
  COMBAT:  'combat',
  VOYAGE:  'voyage',
  CREW:    'crew',
  SHIP:    'ship',
  SYSTEM:  'system',
});

// ─── Entry types ───────────────────────────────────────────────────────────
// Each entry carries exactly one of these. Filters on `type` are common
// (e.g. "show only gold changes").
export const TYPE = Object.freeze({
  GOLD:       'gold_change',
  INFAMY:     'infamy_change',
  CARGO:      'cargo_change',
  CREW:       'crew_change',
  SHIP_STATE: 'ship_state_change',
  UPGRADE:    'upgrade_purchased',
});

// ─── Source catalogue ──────────────────────────────────────────────────────
// Keep this list flat + alphabetical within each section so a code reviewer
// can spot a missing-source typo at a glance.

export const SOURCE = Object.freeze({
  // ─── System / dev ────────────────────────────────────────────────────────
  SYSTEM_STARTING_GOLD: 'system_starting_gold',
  DEV_CHEAT_GRANT:      'dev_cheat_grant',

  // ─── Port ────────────────────────────────────────────────────────────────
  MARKET_BUY:            'market_buy',
  MARKET_SELL:           'market_sell',
  DOCK_FEE:              'dock_fee',
  CREW_HIRE:             'crew_hire',
  CREW_DISMISS:          'crew_dismiss',
  REPAIR_HULL:           'repair_hull',
  REPAIR_SAILS:          'repair_sails',
  REPAIR_LEAKS:          'repair_leaks',
  REPAIR_AT_PORT:        'repair_at_port',
  SHIPWRIGHT_PURCHASE:   'shipwright_purchase',
  SHIPWRIGHT_REMOVE:     'shipwright_remove',
  SHIP_PURCHASE:         'ship_purchase',
  RUM_SERVED:            'rum_served',

  // ─── Sailing / voyage ────────────────────────────────────────────────────
  SUPPLIES_COST:         'supplies_cost',
  CANCEL_VOYAGE_PENALTY: 'cancel_voyage_penalty',
  VOYAGE_ARRIVAL:        'voyage_arrival',
  FLOTSAM_RECOVERED:     'flotsam_recovered',
  DEBRIS_HULL_DAMAGE:    'debris_hull_damage',
  WHIRLPOOL_DRAG:        'whirlpool_drag',

  // ─── Combat ──────────────────────────────────────────────────────────────
  COMBAT_LOOT:           'combat_loot',
  COMBAT_VICTORY:        'combat_victory',
  COMBAT_LOOT_BONUS:     'combat_loot_bonus',
  COMBAT_DAMAGE_TAKEN:   'combat_damage_taken',
  TRADE_SALE_BONUS:      'trade_sale_bonus',
  COMBAT_CAPTURE:        'combat_capture',
  CREW_COMBAT_LOSS:      'crew_combat_loss',

  // ─── Crew (non-combat) ──────────────────────────────────────────────────
  CREW_MORALE_DECAY:     'crew_morale_decay',

  // ─── Infamy unlocks (informational, no delta) ───────────────────────────
  UNLOCK_BRIGANTINE:     'unlock_brigantine',
  UNLOCK_GALLEON:        'unlock_galleon',
});

/** All known sources as an array — useful for filter dropdowns. */
export const ALL_SOURCES = Object.freeze(Object.values(SOURCE));

/** All known categories as an array. */
export const ALL_CATEGORIES = Object.freeze(Object.values(CATEGORY));

/** All known types as an array. */
export const ALL_TYPES = Object.freeze(Object.values(TYPE));

/**
 * Hint mapping: source → category. Helpers can default the category from
 * the source so callers don't have to repeat themselves.
 */
export const SOURCE_TO_CATEGORY = Object.freeze({
  [SOURCE.SYSTEM_STARTING_GOLD]:  CATEGORY.SYSTEM,
  [SOURCE.DEV_CHEAT_GRANT]:       CATEGORY.SYSTEM,

  [SOURCE.MARKET_BUY]:            CATEGORY.PORT,
  [SOURCE.MARKET_SELL]:           CATEGORY.PORT,
  [SOURCE.DOCK_FEE]:              CATEGORY.PORT,
  [SOURCE.CREW_HIRE]:             CATEGORY.PORT,
  [SOURCE.CREW_DISMISS]:          CATEGORY.PORT,
  [SOURCE.REPAIR_HULL]:           CATEGORY.PORT,
  [SOURCE.REPAIR_SAILS]:          CATEGORY.PORT,
  [SOURCE.REPAIR_LEAKS]:          CATEGORY.PORT,
  [SOURCE.REPAIR_AT_PORT]:        CATEGORY.PORT,
  [SOURCE.SHIPWRIGHT_PURCHASE]:   CATEGORY.PORT,
  [SOURCE.SHIPWRIGHT_REMOVE]:     CATEGORY.PORT,
  [SOURCE.SHIP_PURCHASE]:         CATEGORY.PORT,
  [SOURCE.RUM_SERVED]:            CATEGORY.PORT,

  [SOURCE.SUPPLIES_COST]:         CATEGORY.SAILING,
  [SOURCE.CANCEL_VOYAGE_PENALTY]: CATEGORY.VOYAGE,
  [SOURCE.VOYAGE_ARRIVAL]:        CATEGORY.VOYAGE,
  [SOURCE.FLOTSAM_RECOVERED]:     CATEGORY.VOYAGE,
  [SOURCE.DEBRIS_HULL_DAMAGE]:    CATEGORY.VOYAGE,
  [SOURCE.WHIRLPOOL_DRAG]:        CATEGORY.VOYAGE,

  [SOURCE.COMBAT_LOOT]:           CATEGORY.COMBAT,
  [SOURCE.COMBAT_VICTORY]:        CATEGORY.COMBAT,
  [SOURCE.COMBAT_LOOT_BONUS]:     CATEGORY.COMBAT,
  [SOURCE.COMBAT_DAMAGE_TAKEN]:   CATEGORY.COMBAT,
  [SOURCE.TRADE_SALE_BONUS]:      CATEGORY.COMBAT,
  [SOURCE.COMBAT_CAPTURE]:        CATEGORY.COMBAT,
  [SOURCE.CREW_COMBAT_LOSS]:      CATEGORY.COMBAT,

  [SOURCE.CREW_MORALE_DECAY]:     CATEGORY.CREW,

  [SOURCE.UNLOCK_BRIGANTINE]:     CATEGORY.SYSTEM,
  [SOURCE.UNLOCK_GALLEON]:        CATEGORY.SYSTEM,
});
