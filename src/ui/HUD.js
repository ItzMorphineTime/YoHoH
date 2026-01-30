/**
 * YoHoH — HUD: heading arrow, speed bar, hull/sails, cannon status
 * GDD §8.1: heading arrow + speed bar + cannon arc preview
 */

export class HUD {
  constructor(container) {
    this.container = container;
    this.elements = {};
  }

  init() {
    const hud = document.getElementById('hud');
    if (!hud) return;

    hud.innerHTML = `
      <div class="hud-panel hud-stats">
        <div class="hud-stat">
          <span class="hud-label">Hull</span>
          <div class="hud-bar"><div id="hud-hull-bar" class="hud-bar-fill"></div></div>
          <span id="hud-hull" class="hud-value">100</span>
        </div>
        <div class="hud-stat">
          <span class="hud-label">Sails</span>
          <div class="hud-bar"><div id="hud-sails-bar" class="hud-bar-fill"></div></div>
          <span id="hud-sails" class="hud-value">100</span>
        </div>
        <div class="hud-stat">
          <span class="hud-label">Speed</span>
          <div class="hud-bar"><div id="hud-speed-bar" class="hud-bar-fill"></div></div>
          <span id="hud-speed" class="hud-value">0</span>
        </div>
        <div class="hud-stat hud-stat-bilge">
          <span class="hud-label">Bilge</span>
          <div class="hud-bar"><div id="hud-bilge-bar" class="hud-bar-fill"></div></div>
          <span id="hud-bilge" class="hud-value">0</span>
        </div>
        <div class="hud-stat hud-stat-leaks">
          <span class="hud-label">Leaks</span>
          <span id="hud-leaks" class="hud-value">0</span>
        </div>
      </div>
      <div class="hud-panel hud-heading">
        <span class="hud-label">Heading</span>
        <div class="hud-compass">
          <span class="hud-compass-north" aria-hidden="true">N</span>
          <div id="hud-compass-needle"></div>
        </div>
      </div>
      <div class="hud-panel hud-controls">
        <span class="hud-key">Q</span> Port
        <span class="hud-key">E</span> Starboard
        <span id="hud-cannon-status" class="hud-cannon-status"></span>
      </div>
      <div class="hud-panel hud-mode">
        <span id="hud-mode">Combat</span>
      </div>
    `;

    this.elements.hull = document.getElementById('hud-hull');
    this.elements.hullBar = document.getElementById('hud-hull-bar');
    this.elements.sails = document.getElementById('hud-sails');
    this.elements.sailsBar = document.getElementById('hud-sails-bar');
    this.elements.speed = document.getElementById('hud-speed');
    this.elements.speedBar = document.getElementById('hud-speed-bar');
    this.elements.bilge = document.getElementById('hud-bilge');
    this.elements.bilgeBar = document.getElementById('hud-bilge-bar');
    this.elements.leaks = document.getElementById('hud-leaks');
    this.elements.compassNeedle = document.getElementById('hud-compass-needle');
    this.elements.cannonStatus = document.getElementById('hud-cannon-status');
    this.elements.mode = document.getElementById('hud-mode');
  }

  update(ship, result, loot, aimingSide) {
    if (!ship) return;

    const hullPct = Math.max(0, ship.hull / ship.hullMax) * 100;
    const sailsPct = Math.max(0, ship.sails / ship.sailMax) * 100;
    const speedPct = (Math.abs(ship.speed) / ship.effectiveMaxSpeed) * 100;

    if (this.elements.hull) this.elements.hull.textContent = Math.round(ship.hull);
    if (this.elements.hullBar) this.elements.hullBar.style.width = `${hullPct}%`;
    if (this.elements.sails) this.elements.sails.textContent = Math.round(ship.sails);
    if (this.elements.sailsBar) this.elements.sailsBar.style.width = `${sailsPct}%`;
    if (this.elements.speed) this.elements.speed.textContent = Math.abs(ship.speed).toFixed(1);
    if (this.elements.speedBar) this.elements.speedBar.style.width = `${speedPct}%`;

    const bilgeMax = ship.bilgeWaterMax ?? 100;
    const bilgePct = bilgeMax > 0 ? Math.min(100, (ship.bilgeWater ?? 0) / bilgeMax * 100) : 0;
    if (this.elements.bilge) this.elements.bilge.textContent = Math.round(ship.bilgeWater ?? 0);
    if (this.elements.bilgeBar) this.elements.bilgeBar.style.width = `${bilgePct}%`;
    if (this.elements.leaks) this.elements.leaks.textContent = (ship.leaks ?? 0).toFixed(1);

    // Heading compass — needle points up when rotation=0 (facing +Y)
    if (this.elements.compassNeedle) {
      const deg = ship.rotation * 180 / Math.PI;
      this.elements.compassNeedle.style.transform = `rotate(${deg}deg)`;
    }

    // Cannon status — aim-then-fire or cooldown
    const cd = Math.max(ship.portCooldown, ship.starboardCooldown);
    if (this.elements.cannonStatus) {
      if (aimingSide) {
        this.elements.cannonStatus.textContent = `Aiming ${aimingSide} — press again to fire`;
      } else {
        this.elements.cannonStatus.textContent = cd > 0 ? `Reload ${cd.toFixed(1)}s` : 'Q/E: aim, then fire';
      }
    }

    if (result === 'victory') {
      if (this.elements.mode) this.elements.mode.textContent = `Victory! Gold: ${loot?.gold ?? 0} | Salvage: ${loot?.salvage ?? 0} — R to restart`;
    } else if (result === 'defeat') {
      if (this.elements.mode) this.elements.mode.textContent = 'Defeat — Ship sunk! R to restart';
    } else if (this.elements.mode) {
      this.elements.mode.textContent = 'Combat';
    }
  }

  /** Sailing mode: hull, sails, speed, sailing controls */
  updateSailing(ship) {
    if (!ship) return;
    this.update(ship, null, null, null);
    if (this.elements.mode) this.elements.mode.textContent = 'WASD — Sail | M for chart';
    if (this.elements.cannonStatus) this.elements.cannonStatus.textContent = '';
  }
}
