/**
 * YoHoH — Game configuration
 * Centralized options for gameplay, rendering, and UI.
 * Tune values here for easier balancing and experimentation.
 *
 * Config schema (by view):
 * - WORLD, CAMERA: shared
 * - OVERWORLD: gameplay (map gen, click thresholds)
 * - OVERWORLD_RENDER: overworld map display (island/route sizes)
 * - SAILING_RENDER: sailing view (corridor, water, islands)
 * - COMBAT, RENDER: combat arena + shared mesh colors/sizes
 * - UI.mapColors: shared map palette (islands, routes) — used by BigMapUI, Minimap
 * - UI.chartScreen, UI.routeSelection: Chart Screen & route panel options
 */

// ─── Lore & World-Building (Shattered Seas) ───────────────────────────────────
// See LORE.md and public/data/lore.json for full backstory and Pirate Kings.
export const LORE = {
  worldName: 'The Shattered Seas',
  homePortName: 'Home Port',
  coreMission: 'Rescue and save the last of the dragons.',
  dragonSanctuaries: 'Hidden islands where rescued eggs can hatch and young dragons thrive.',
  pirateKings: [
    { id: 'jasper_barrow', name: 'Jasper Barrow', domain: 'Veilwake Sea', hazard: 'fog' },
    { id: 'mordekai_drakon', name: 'Mordekai Drakon', domain: 'Coiled Expanse', hazard: 'serpents' },
    { id: 'adara_thalassa', name: 'Lady Adara Thalassa', domain: 'Drowned Crown', hazard: 'coral' },
    { id: 'nimue_tideborn', name: 'Nimue Tideborn', domain: 'Black Spiral', hazard: 'darkness' },
    { id: 'ebon_flameheart', name: 'Captain Ebon Flameheart', domain: 'Ashen Reach', hazard: 'fire' },
  ],
};

// ─── World & Camera ─────────────────────────────────────────────────────────
export const WORLD = {
  width: 200,
  height: 200,
};

export const CAMERA = {
  zoom: 4.5,
  combatZoom: 2.5,
  overworldZoom: 0.5,
  sailingZoom: 2.5,
  near: 0.1,
  far: 1000,
  positionZ: 100,
};

// ─── Overworld & Map ───────────────────────────────────────────────────────
export const OVERWORLD = {
  mapScale: 1,
  worldScale: 10,
  islandRadius: 32,
  routeWidth: 16,
  sailingCorridorWidth: 16,
  expansionDistance: 85,
  arrivalRadius: 4,
  numIslands: 12,
  seedMax: 100000,
  islandClickThreshold: 22,
  routeClickThreshold: 22,
};

// ─── Overworld & Sailing Rendering ─────────────────────────────────────────
export const OVERWORLD_RENDER = {
  worldScale: 10,
  islandRadius: 12,
  routeWidth: 8,
  sailingCorridorWidth: 8,
};

// ─── Sailing Screen Options ───────────────────────────────────────────────
export const SAILING_RENDER = {
  islandRadius: 128, // in sailing view units (graph * worldScale); matches OVERWORLD.islandRadius * 10
  routeWidth: 25,
  corridorWidth: 25,
  waterPlaneScale: 4,
  waterGradient: true,
  corridorColor: 0x2a4a6a,
  corridorOpacity: 0.35,
  wakeLengthMax: 40,              // S.3: max wake length at full speed
  wakeWidth: 12,
  wakeColor: 0x5a8aba,
  wakeOpacity: 0.4,
  wakeSpeedThreshold: 0.02,
  corridorEdgeColor: 0x3a5a7a,   // S.5: subtle edge markers at corridor bounds
  corridorEdgeOpacity: 0.5,
  corridorEdgeWidth: 2,
  destMarkerRadius: 25,
  destMarkerOpacity: 0.8,
  cameraSmoothingLerp: 0.12,     // M.2: camera follow smoothing (0=instant, 0.1=smooth)
};

// ─── Game States ───────────────────────────────────────────────────────────
export const GAME_STATES = {
  MENU: 'MENU',
  OVERWORLD: 'OVERWORLD',
  SAILING: 'SAILING',
  COMBAT: 'COMBAT',
  PORT: 'PORT',
};

// ─── Combat ────────────────────────────────────────────────────────────────
export const COMBAT = {
  arenaWidth: 300,
  arenaHeight: 300,
  cannonArcDeg: 60,
  cannonRange: 80,
  cannonCooldown: 1.5,
  projectileSpeed: 120,
  projectileDamage: 25,
  sailDamageMult: 0.5,
  hullMax: 100,
  sailMax: 100,
  crewMax: 100,
  playerSpawnX: 0,
  playerSpawnY: -80,
  playerSpawnRotation: 0,
  enemyRaiderX: 60,
  enemyRaiderY: 60,
  enemyRaiderRotation: Math.PI,
  enemyTraderX: -70,
  enemyTraderY: 50,
  enemyTraderRotation: 0,
  lootGoldDefault: 50,
  lootSalvageDefault: 25,
  encounterChancePerSecond: 0.006,
};

// ─── Combat Rocks (procedural or fixed) ─────────────────────────────────────
export const COMBAT_ROCKS = [
  { x: 40, y: -30, r: 12 },
  { x: -50, y: -40, r: 10 },
  { x: -30, y: 60, r: 8 },
  { x: 70, y: -50, r: 15 },
];

// ─── Ship (combat) — fallback when ship class doesn't override ─────────────
export const SHIP = {
  maxSpeed: 0.5,
  thrust: 0.125,
  friction: 0.55,
  turnRate: 0.035,
  brakeMult: 0.7,
  highSpeedTurnPenalty: 0.5,
};

// ─── Sailing (route travel) — fallback ───────────────────────────────────────
export const SAILING = {
  maxSpeed: 0.1,
  thrust: 0.025,
  friction: 0.998,
  turnRate: 0.015,
  brakeMult: 0.75,
  highSpeedTurnPenalty: 0.4,
};

// ─── Ship Classes — different sizes with stats and station slots ───────────
export const SHIP_CLASSES = {
  sloop: {
    name: 'Sloop',
    cannonCount: 1, // C.10c: broadsides per class
    hullMax: 80,
    sailMax: 80,
    crewMax: 60,
    bilgeWaterMax: 80,
    maxSpeed: 0.5,
    thrust: 0.125,
    friction: 0.55,
    turnRate: 0.038,
    brakeMult: 0.7,
    highSpeedTurnPenalty: 0.5,
    sailingMaxSpeed: 0.1,
    sailingThrust: 0.025,
    sailingFriction: 0.998,
    sailingTurnRate: 0.016,
    sailingBrakeMult: 0.75,
    sailingHighSpeedTurnPenalty: 0.4,
    cannonCooldown: 1.5,
    cargoCapacity: 20,
    stationSlots: {
      helmsman: 1,
      gunner_port: 1,
      gunner_starboard: 1,
      carpenter: 1,
      navigator: 1,
      sailing: 1,
      bilge: 1,
      man_at_arms: 1,
    },
  },
  brigantine: {
    name: 'Brigantine',
    cannonCount: 2, // C.10c: broadsides per class
    hullMax: 120,
    sailMax: 120,
    crewMax: 100,
    bilgeWaterMax: 120,
    maxSpeed: 0.45,
    thrust: 0.12,
    friction: 0.55,
    turnRate: 0.032,
    brakeMult: 0.7,
    highSpeedTurnPenalty: 0.52,
    sailingMaxSpeed: 0.095,
    sailingThrust: 0.023,
    sailingFriction: 0.998,
    sailingTurnRate: 0.014,
    sailingBrakeMult: 0.75,
    sailingHighSpeedTurnPenalty: 0.42,
    cannonCooldown: 1.5,
    cargoCapacity: 40,
    stationSlots: {
      helmsman: 1,
      gunner_port: 2,
      gunner_starboard: 2,
      carpenter: 1,
      navigator: 1,
      sailing: 2,
      bilge: 2,
      man_at_arms: 2,
    },
  },
  galleon: {
    name: 'Galleon',
    cannonCount: 3, // C.10c: broadsides per class
    hullMax: 150,
    sailMax: 150,
    crewMax: 150,
    bilgeWaterMax: 150,
    maxSpeed: 0.38,
    thrust: 0.1,
    friction: 0.55,
    turnRate: 0.028,
    brakeMult: 0.7,
    highSpeedTurnPenalty: 0.55,
    sailingMaxSpeed: 0.085,
    sailingThrust: 0.02,
    sailingFriction: 0.998,
    sailingTurnRate: 0.012,
    sailingBrakeMult: 0.75,
    sailingHighSpeedTurnPenalty: 0.45,
    cannonCooldown: 1.5,
    cargoCapacity: 60,
    stationSlots: {
      helmsman: 1,
      gunner_port: 3,
      gunner_starboard: 3,
      carpenter: 2,
      navigator: 2,
      sailing: 3,
      bilge: 3,
      man_at_arms: 3,
    },
  },
};

// ─── Ship Upgrades (C.7, C.10) — Hull, Sails, Cannons, Cargo, Utility, Boarding ─
export const UPGRADE_SLOTS = ['hull', 'sails', 'cannons', 'cargo', 'utility', 'boarding'];

export const UPGRADES = {
  // Hull slot
  plating: { id: 'plating', name: 'Plating', slot: 'hull', cost: 80, hullMax: 10 },
  reinforced_hull: { id: 'reinforced_hull', name: 'Reinforced Hull', slot: 'hull', cost: 120, hullMax: 15, maxSpeedMult: 0.95 },
  // Sails slot
  fast_rigging: { id: 'fast_rigging', name: 'Fast Rigging', slot: 'sails', cost: 90, sailSpeedMult: 1.1 },
  storm_sails: { id: 'storm_sails', name: 'Storm Sails', slot: 'sails', cost: 100, sailMax: 15 },
  // Cannons slot
  heavy_shot: { id: 'heavy_shot', name: 'Heavy Shot', slot: 'cannons', cost: 110, cannonDamageMult: 1.15 },
  quick_reload: { id: 'quick_reload', name: 'Quick Reload', slot: 'cannons', cost: 95, cannonCooldownMult: 0.9 },
  // Cargo slot
  extra_holds: { id: 'extra_holds', name: 'Extra Holds', slot: 'cargo', cost: 70, cargoCapacity: 5 },
  storage_nets: { id: 'storage_nets', name: 'Storage Nets', slot: 'cargo', cost: 85, cargoCapacity: 10 },
  // Utility slot
  reinforced_bilge: { id: 'reinforced_bilge', name: 'Reinforced Bilge', slot: 'utility', cost: 75, bilgeWaterMax: 20 },
  navigator_tools: { id: 'navigator_tools', name: "Navigator's Tools", slot: 'utility', cost: 80, turnRateMult: 1.05 },
  // Boarding slot
  boarding_nets: { id: 'boarding_nets', name: 'Boarding Nets', slot: 'boarding', cost: 65, crewMult: 1.08 },
  grappling_hooks: { id: 'grappling_hooks', name: 'Grappling Hooks', slot: 'boarding', cost: 90, crewMult: 1.12 },
};

// ─── Crew & Stations (GDD §8.4) ─────────────────────────────────────────────
export const CREW = {
  hireCost: 25,
  maxCrew: 20,
  moraleBaseline: 1,
  moraleMin: 0.2,
  moraleMax: 1,
  moraleDecayPerSecond: 0.0015,   // C.6: voyage length drains morale
  moraleRumGain: 0.2,             // C.6: per rum served
  moraleVictoryGain: 0.1,        // C.6: per combat victory
  rumGoodId: 'rum',
  unassignedStationPenalty: 0.85,  // C.6b: multiplier when station has 0 crew (0.85 = 15% penalty)
  undercrewedMoraleDecayMult: 1.5, // C.6c: morale decays faster when crew < 50% of max (1.5 = 50% faster)
  undercrewedThreshold: 0.5,       // C.6c: crew/maxCrew below this = undercrewed
  stations: ['helmsman', 'gunner_port', 'gunner_starboard', 'carpenter', 'navigator', 'sailing', 'bilge', 'man_at_arms'],
  stationEffects: {
    helmsman: { turnRateMult: 1.15 },
    gunner_port: { portReloadMult: 1.1 },
    gunner_starboard: { starboardReloadMult: 1.1 },
    carpenter: { repairMult: 1.2, leakRepairMult: 1.3 },
    navigator: { sailSpeedMult: 1.05 },
    sailing: { sailSpeedMult: 1.1 },
    bilge: { bilgePumpMult: 1.5 },
    man_at_arms: { crewMult: 1.1 },
  },
};

// ─── Bilge & Leaks ─────────────────────────────────────────────────────────
export const BILGE = {
  bilgeWaterMax: 100,
  leakWaterRate: 2,        // bilge water per leak per second
  basePumpRate: 5,        // bilge water pumped per second (no crew)
  leaksPerHullDamage: 0.04, // leaks gained per point of hull damage taken
};

// ─── Repair (Carpenter, Shipwright) ───────────────────────────────────────
export const REPAIR = {
  hullRepairPerSecond: 2,   // base hull repaired per second per carpenter
  leakRepairPerSecond: 0.5, // base leaks repaired per second per carpenter
  hullRepairCostPerPoint: 0.5,  // gold per hull point at shipwright
  sailRepairCostPerPoint: 0.3,   // gold per sail point at shipwright
  leakRepairCostPerLeak: 5,     // gold per leak fixed at shipwright
};

// ─── Economy (B.6–B.11) ───────────────────────────────────────────────────
export const ECONOMY = {
  priceVariance: 0.15,    // ±15% variance per island (from distanceFromHome, portType)
  sellSpread: 0.9,       // sell price = buy price * 0.9 (10% spread)
  dockFee: 5,            // gold paid when entering port (B.11 economy sink); 0 to disable
  suppliesCost: 3,       // gold paid when setting sail (B.11 economy sink); 0 to disable
};

// ─── Sailing System (shared physics) ───────────────────────────────────────
export const SAILING_SYSTEM = {
  speedDeadzone: 0.02,
  minTurnPenalty: 0.3,
  reverseSpeedMult: 0.5,
  corridorLenEpsilon: 0.001,
};

// ─── Infamy (C.11) — progression; unlocks ship tiers ───────────────────────
export const INFAMY = {
  infamyPerVictory: 1,           // Infamy gained per combat victory
  infamyPerGoldFromCombat: 0.02, // Infamy per gold from combat loot
  infamyPerGoldFromSale: 0.01,   // Infamy per gold from selling goods (trading profit proxy)
  brigantineUnlock: 3,           // C.11a: Brigantine unlocks at Infamy 3
  galleonUnlock: 5,              // C.11a: Galleon unlocks at Infamy 5
  brigantineCost: 500,           // C.10a: gold to purchase Brigantine
  galleonCost: 1200,             // C.10a: gold to purchase Galleon
};

// ─── Game Loop ─────────────────────────────────────────────────────────────
export const GAME = {
  maxDt: 0.1,
  startingGold: 100, // For testing; set to 0 for no starting gold
  defaultShipClass: 'sloop',
};

// ─── Rendering ─────────────────────────────────────────────────────────────
export const RENDER = {
  waterPlaneSizeMin: 1200,
  clearColor: 0x0a1628,
  waterColor: 0x1e3a5f,
  arenaBorderColor: 0x4a6fa5,
  arenaBorderZ: 0.5,
  shipHullColor: 0x5c4033,
  shipMastColor: 0x3d2817,
  shipSailColor: 0xe8dcc8,
  shipOverworldColor: 0x2d5016,
  aimArrowColor: 0xffaa00,
  aimArrowOpacity: 0.7,
  aimArrowSize: 6,
  aimArrowLengthMult: 0.6,
  portArcColor: 0xff6600,
  starboardArcColor: 0x00cc66,
  cannonArcOpacity: 0.25,
  cannonArcZ: 0.2,
  cannonArcSegments: 16,
  enemyHullColor: 0x8b0000,
  enemyMastColor: 0x4a2511,
  enemySailColor: 0x8b4513,
  projectileColor: 0x444444,
  rockColor: 0x4a3728,
  rockSegments: 12,
  islandHomeColor: 0x4a7c59,
  islandDangerColor: 0x8b4444,
  islandAppealColor: 0x6b9b7a,
  islandDefaultColor: 0x5a6a5a,
  islandCurrentColor: 0xffcc44,
  islandCurrentRadiusMult: 1.4,
  islandCurrentRingColor: 0xffdd66,
  islandCurrentRingWidth: 3,
  routeColor: 0x3a6a9a,
  routeHoverColor: 0x5a8aba,
  routeHoverWidthMult: 1.3,
  // B.4 Route modifiers (stormy, patrolled, shoals)
  routeStormyColor: 0x4a5a7a,
  routePatrolledColor: 0x6a4a4a,
  routeShoalsColor: 0x6a5a3a,
  sailingPathRefLength: 500,
  sailingCorridorColor: 0x2a4a6a,
  sailingCorridorOpacity: 0.35,
  sailingCorridorEdgeColor: 0x3a5a7a,
  sailingCorridorEdgeOpacity: 0.5,
  sailingCorridorEdgeWidth: 2,
  sailingWakeLengthMax: 40,
  sailingWakeWidth: 12,
  sailingWakeColor: 0x5a8aba,
  sailingWakeOpacity: 0.4,
  sailingWakeSpeedThreshold: 0.02,
  sailingWaterGradient: true,
  sailingDestColor: 0x4a7c59,
  sailingDestOpacity: 0.8,
  sailingDestRadius: 25,
  sailingDestSegments: 16,
  sailingWaterPlaneScale: 4,
  overworldShipRadius: 4,
  overworldShipHeight: 12,
  overworldShipSegments: 6,
  sailingShipRadius: 8,
  sailingShipHeight: 24,
  sailingShipSegments: 8,
};

// ─── Ship Geometry (Renderer mesh dimensions) ───────────────────────────────
// R.3a: Per-class ship rendering (§9.0.6 I.5) — different size per ship class
export const SHIP_GEOMETRY = {
  hull: { depth: 1.5, points: [[-4, -6], [-3, 6], [0, 7], [3, 6], [4, -6]] },
  mast: { width: 0.8, height: 10, depth: 0.8 },
  sail: { width: 6, height: 8 },
  enemyHull: { depth: 1.2, points: [[-3, -5], [-2.5, 5], [0, 6], [2.5, 5], [3, -5]] },
  enemyMast: { width: 0.6, height: 8, depth: 0.6 },
  enemySail: { width: 4, height: 6 },
  projectileRadius: 2,
  projectileHeight: 6,
  projectileSegments: 6,
  /** Per-class scale (overworld, sailing, combat) — sloop 1.0, brigantine 1.2, galleon 1.4 */
  classes: {
    sloop: { scale: 1.0, overworldScale: 1.0, sailingScale: 1.0 },
    brigantine: { scale: 1.2, overworldScale: 1.15, sailingScale: 1.2 },
    galleon: { scale: 1.4, overworldScale: 1.3, sailingScale: 1.4 },
  },
};

// ─── UI ────────────────────────────────────────────────────────────────────
/** Shared map palette — single source for island/route colors (BigMapUI, Minimap) */
const MAP_COLORS = {
  background: '#0a1628',
  border: '#2a4a6a',
  route: '#3a6a9a',
  routeActive: '#6bca9a',
  routeStormy: '#4a5a7a',
  routePatrolled: '#6a4a4a',
  routeShoals: '#6a5a3a',
  islandHome: '#4a7c59',
  islandDanger: '#8b4444',
  islandAppeal: '#6b9b7a',
  islandDefault: '#5a6a5a',
  currentIsland: '#ffcc44',
  currentIslandStroke: '#ffdd66',
  ship: '#44cc44',
  shipStroke: '#88ff88',
  text: '#e8e6e3',
};

export const UI = {
  mapColors: MAP_COLORS,
  minimap: {
    sizeMin: 64,
    sizeMax: 160,
    sizeDefault: 100,
    sizeMaxCustom: 320,
    paddingRatio: 1 / 12,
    paddingMin: 3,
  },
  bigMap: {
    sizeMin: 600,
    sizeMax: 1200,
    viewportRatio: 0.95,
  },
  minimapColors: {
    ...MAP_COLORS,
    waterTint: '#1e3a5f',
    waterAlpha: 0.5,
    rock: '#4a3728',
    enemy: '#cc4444',
    player: '#44cc44',
    playerDirection: '#88ff88',
  },
  bigMapColors: {
    ...MAP_COLORS,
  },
  minimapDotSizes: {
    rockScale: 0.3,
    enemy: 3,
    player: 4,
    playerDirectionLen: 10,
    islandScale: 0.2,
  },
  mapUI: {
    showLegend: true,
    showIslandLabels: true,
    compassRose: true,
    routeClickFeedback: true,
  },
  // ─── Chart Screen (M key) rendering options ─────────────────────────────
  chartScreen: {
    showIslandLabels: true,
    showLegend: true,
    showCompass: true,
    showHelpText: true,
    islandScale: 0.3,
    currentIslandRadiusMult: 1.3,
    routeWidth: 3,
    routeActiveWidth: 5,
    labelFontSize: 10,
    labelMaxLength: 12,
    legendEntries: ['docked', 'home', 'danger', 'safe', 'other'],
  },
  // ─── Route Selection panel (overworld) rendering options ─────────────────
  routeSelection: {
    showCurrentIsland: true,
    showConnectedRoutes: true,
    showDestinationDetails: true,
    showDescription: true,
    showTreasureLevel: true,
    showHazard: true,
    showFaction: true,
    showPortType: true,
    connectedRoutesMax: 8,
  },
  bigMapSizes: {
    padding: 36,
    currentIslandRadiusMult: 1.3,
    shipRadius: 8,
    islandMinRadius: 6,
    islandScale: 0.3,
    routeWidth: 3,
    routeActiveWidth: 5,
    fontSize: 11,
    labelFontSize: 10,
    textBottomOffset: 24,
    legendHeight: 48,
    compassSize: 32,
    centerOffsetX: 24,
    centerOffsetY: 24,
  },
};
