/**
 * YoHoH — You Only Have One Hull
 * Main entry point. D.10: Main menu with New Game, Continue, Settings.
 */

import { Game } from './Game.js';
import { hasSave } from './utils/saveSystem.js';

// Apply saved UI scale on load (before game starts)
(function initSettings() {
  const STORAGE_KEY = 'yohoh-ui-scale';
  const scaleInput = document.getElementById('settings-ui-scale');
  const scaleValue = document.getElementById('settings-scale-value');
  const applyScale = (v) => {
    const scale = parseFloat(v);
    document.documentElement.style.setProperty('--ui-scale', String(scale));
    if (scaleValue) scaleValue.textContent = `${Math.round(scale * 100)}%`;
    try { localStorage.setItem(STORAGE_KEY, String(scale)); } catch (_) {}
  };
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved ? parseFloat(saved) : 1;
  const clamped = Math.max(0.75, Math.min(1.5, initial));
  applyScale(clamped);
  if (scaleInput) {
    scaleInput.value = String(clamped);
    scaleInput.addEventListener('input', (e) => applyScale(e.target.value));
  }
})();

const container = document.getElementById('game-container');
const menuOverlay = document.getElementById('main-menu-overlay');
const newGameBtn = document.getElementById('menu-new-game');
const continueBtn = document.getElementById('menu-continue');
const settingsBtn = document.getElementById('menu-settings');
const settingsModal = document.getElementById('settings-modal');
const settingsOpenBtn = document.getElementById('settings-btn');

if (!container) {
  console.error('Game container #game-container not found');
} else {
  const game = new Game(container);

  // D.10: Enable Continue if save exists
  if (continueBtn && hasSave()) {
    continueBtn.disabled = false;
  }

  function startGame(loadState) {
    if (menuOverlay) menuOverlay.classList.add('hidden');
    game.init(loadState);
  }

  newGameBtn?.addEventListener('click', () => startGame(null));
  continueBtn?.addEventListener('click', () => {
    const state = game.loadGame();
    if (state) startGame(state);
  });

  settingsBtn?.addEventListener('click', () => {
    if (settingsModal) settingsModal.classList.add('visible');
    if (settingsModal) settingsModal.focus();
  });

  // Settings modal close (from existing settings flow)
  const settingsClose = document.getElementById('settings-close');
  settingsClose?.addEventListener('click', () => {
    if (settingsModal) settingsModal.classList.remove('visible');
  });
  settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('visible');
  });
  settingsModal?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') settingsModal.classList.remove('visible');
  });
}
