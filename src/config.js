/**
 * YoHoH — Game configuration
 * Centralized options for gameplay, rendering, and UI.
 * Tune values here for easier balancing and experimentation.
 */

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
  destMarkerRadius: 25,
  destMarkerOpacity: 0.8,
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

// ─── Ship (combat) ─────────────────────────────────────────────────────────
export const SHIP = {
  maxSpeed: 0.5,
  thrust: 0.125,
  friction: 0.55,
  turnRate: 0.035,
  brakeMult: 0.7,
  highSpeedTurnPenalty: 0.5,
};

// ─── Sailing (route travel) ────────────────────────────────────────────────
export const SAILING = {
  maxSpeed: 0.1,
  thrust: 0.025,
  friction: 0.998,
  turnRate: 0.015,
  brakeMult: 0.75,
  highSpeedTurnPenalty: 0.4,
};

// ─── Sailing System (shared physics) ───────────────────────────────────────
export const SAILING_SYSTEM = {
  speedDeadzone: 0.02,
  minTurnPenalty: 0.3,
  reverseSpeedMult: 0.5,
  corridorLenEpsilon: 0.001,
};

// ─── Game Loop ─────────────────────────────────────────────────────────────
export const GAME = {
  maxDt: 0.1,
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
  sailingPathRefLength: 500,
  sailingCorridorColor: 0x2a4a6a,
  sailingCorridorOpacity: 0.35,
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
};

// ─── UI ────────────────────────────────────────────────────────────────────
export const UI = {
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
    background: '#0a1628',
    border: '#2a4a6a',
    waterTint: '#1e3a5f',
    waterAlpha: 0.5,
    rock: '#4a3728',
    enemy: '#cc4444',
    player: '#44cc44',
    playerDirection: '#88ff88',
    route: '#3a6a9a',
    routeActive: '#6bca9a',
    islandHome: '#4a7c59',
    islandDanger: '#8b4444',
    islandAppeal: '#6b9b7a',
    islandDefault: '#5a6a5a',
    currentIsland: '#ffcc44',
    currentIslandStroke: '#ffdd66',
  },
  bigMapColors: {
    background: '#0a1628',
    border: '#2a4a6a',
    route: '#3a6a9a',
    routeActive: '#6bca9a',
    islandHome: '#4a7c59',
    islandDanger: '#8b4444',
    islandAppeal: '#6b9b7a',
    islandDefault: '#5a6a5a',
    currentIsland: '#ffcc44',
    currentIslandStroke: '#ffdd66',
    ship: '#44cc44',
    shipStroke: '#88ff88',
    text: '#e8e6e3',
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
