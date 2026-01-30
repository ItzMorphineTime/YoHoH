/**
 * YoHoH — Game configuration
 */

export const WORLD = {
  width: 200,
  height: 200,
};

export const CAMERA = {
  zoom: 20,
  near: 0.1,
  far: 1000,
};

export const GAME_STATES = {
  MENU: 'MENU',
  OVERWORLD: 'OVERWORLD',
  COMBAT: 'COMBAT',
  PORT: 'PORT',
};

// Phase A: Combat
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
};

export const SHIP = {
  maxSpeed: 2,
  thrust: 0.12,
  friction: 0.98,
  turnRate: 0.035,
  brakeMult: 0.7,
  highSpeedTurnPenalty: 0.5,
};
