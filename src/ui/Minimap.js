/**
 * YoHoH — Minimap: top-down overview of combat arena
 */

export class Minimap {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.size = 120;
    this.padding = 8;
  }

  init() {
    const wrapper = document.getElementById('minimap-wrapper');
    if (!wrapper) return;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.classList.add('minimap-canvas');
    wrapper.innerHTML = '';
    wrapper.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  update(player, enemies, rocks, bounds) {
    if (!this.ctx || !this.canvas) return;

    const w = bounds?.width ?? 300;
    const h = bounds?.height ?? 300;
    const scale = Math.min((this.size - this.padding * 2) / w, (this.size - this.padding * 2) / h);
    const cx = this.size / 2;
    const cy = this.size / 2;

    const toScreen = (x, y) => ({
      px: cx + x * scale,
      py: cy - y * scale,
    });

    // Clear
    this.ctx.fillStyle = '#0a1628';
    this.ctx.fillRect(0, 0, this.size, this.size);

    // Border
    this.ctx.strokeStyle = '#2a4a6a';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(1, 1, this.size - 2, this.size - 2);

    // Water tint
    this.ctx.fillStyle = '#1e3a5f';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(this.padding, this.padding, this.size - this.padding * 2, this.size - this.padding * 2);
    this.ctx.globalAlpha = 1;

    // Rocks
    for (const r of rocks || []) {
      const { px, py } = toScreen(r.x, r.y);
      this.ctx.fillStyle = '#4a3728';
      this.ctx.beginPath();
      this.ctx.arc(px, py, Math.max(2, r.r * scale * 0.3), 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Enemies
    for (const e of enemies || []) {
      if (e.dead) continue;
      const { px, py } = toScreen(e.x, e.y);
      this.ctx.fillStyle = '#cc4444';
      this.ctx.beginPath();
      this.ctx.arc(px, py, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Player (green dot + direction line)
    if (player && !player.dead) {
      const { px, py } = toScreen(player.x, player.y);
      this.ctx.fillStyle = '#44cc44';
      this.ctx.beginPath();
      this.ctx.arc(px, py, 4, 0, Math.PI * 2);
      this.ctx.fill();
      // Direction: forward = (sin r, cos r), canvas Y is flipped so dy = -cos r
      const len = 10;
      const dx = Math.sin(player.rotation) * len;
      const dy = -Math.cos(player.rotation) * len;
      this.ctx.strokeStyle = '#88ff88';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(px + dx, py + dy);
      this.ctx.stroke();
    }
  }
}
