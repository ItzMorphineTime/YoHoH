/**
 * YoHoH — You Only Have One Hull
 * Main entry point
 */

import { Game } from './Game.js';

const container = document.getElementById('game-container');
if (!container) {
  console.error('Game container #game-container not found');
} else {
  const game = new Game(container);
  game.init();
}
