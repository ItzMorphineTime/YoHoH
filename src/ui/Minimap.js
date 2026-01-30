/**
 * YoHoH — Minimap: combat arena or overworld/sailing map
 */

import { OVERWORLD, UI } from '../config.js';

const { minimap: UI_MINIMAP } = UI;

export class Minimap {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.size = UI_MINIMAP.sizeDefault;
    this.padding = UI_MINIMAP.sizeDefault * UI_MINIMAP.paddingRatio;
  }

  _resize() {
    const wrapper = document.getElementById('minimap-wrapper');
    if (!wrapper || !this.canvas) return;
    const w = wrapper.clientWidth || this.size;
    const h = wrapper.clientHeight || this.size;
    const s = Math.min(w, h, UI_MINIMAP.sizeMax);
    if (s !== this.size) {
      this.size = Math.max(UI_MINIMAP.sizeMin, s);
      this.padding = Math.max(UI_MINIMAP.paddingMin, this.size * UI_MINIMAP.paddingRatio);
      this.canvas.width = this.size;
      this.canvas.height = this.size;
    }
  }

  init() {
    const wrapper = document.getElementById('minimap-wrapper');
    if (!wrapper) return;

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('minimap-canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    wrapper.innerHTML = '';
    wrapper.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  update(player, enemies, rocks, bounds) {
    if (!this.ctx || !this.canvas) return;
    this._resize();

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
    const c = UI.minimapColors;
    this.ctx.fillStyle = c.background;
    this.ctx.fillRect(0, 0, this.size, this.size);

    // Border
    this.ctx.strokeStyle = c.border;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(1, 1, this.size - 2, this.size - 2);

    // Water tint
    this.ctx.fillStyle = c.waterTint;
    this.ctx.globalAlpha = c.waterAlpha;
    this.ctx.fillRect(this.padding, this.padding, this.size - this.padding * 2, this.size - this.padding * 2);
    this.ctx.globalAlpha = 1;

    // Rocks
    const dot = UI.minimapDotSizes;
    for (const r of rocks || []) {
      const { px, py } = toScreen(r.x, r.y);
      this.ctx.fillStyle = c.rock;
      this.ctx.beginPath();
      this.ctx.arc(px, py, Math.max(2, r.r * scale * dot.rockScale), 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Enemies
    for (const e of enemies || []) {
      if (e.dead) continue;
      const { px, py } = toScreen(e.x, e.y);
      this.ctx.fillStyle = c.enemy;
      this.ctx.beginPath();
      this.ctx.arc(px, py, dot.enemy, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Player (green dot + direction line)
    if (player && !player.dead) {
      const { px, py } = toScreen(player.x, player.y);
      this.ctx.fillStyle = c.player;
      this.ctx.beginPath();
      this.ctx.arc(px, py, dot.player, 0, Math.PI * 2);
      this.ctx.fill();
      // Direction: forward = (sin r, cos r), canvas Y is flipped so dy = -cos r
      const len = dot.playerDirectionLen;
      const dx = Math.sin(player.rotation) * len;
      const dy = -Math.cos(player.rotation) * len;
      this.ctx.strokeStyle = c.playerDirection;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(px + dx, py + dy);
      this.ctx.stroke();
    }
  }

  /** Overworld/sailing minimap: islands, routes, ship position. Press M for big map. */
  updateOverworld(map, shipPosition, currentIsland, travelRoute) {
    if (!this.ctx || !this.canvas || !map) return;
    this._resize();

    const { islandRadius } = OVERWORLD;
    const padding = Math.max(UI_MINIMAP.paddingMin, this.size * UI_MINIMAP.paddingRatio);
    const nodes = map.nodes;
    const edges = map.edges;

    const xs = nodes.map(n => n.position.x);
    const ys = nodes.map(n => n.position.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const rangeX = Math.max(maxX - minX, 1);
    const rangeY = Math.max(maxY - minY, 1);
    const scale = Math.min(
      (this.size - padding * 2) / rangeX,
      (this.size - padding * 2) / rangeY
    );
    const cx = this.size / 2;
    const cy = this.size / 2;
    const midX = travelRoute ? shipPosition.x : (minX + maxX) / 2;
    const midY = travelRoute ? shipPosition.y : (minY + maxY) / 2;

    const toScreen = (x, y) => ({
      px: cx + (x - midX) * scale,
      py: cy - (y - midY) * scale,
    });

    const c = UI.minimapColors;
    this.ctx.fillStyle = c.background;
    this.ctx.fillRect(0, 0, this.size, this.size);
    this.ctx.strokeStyle = c.border;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(1, 1, this.size - 2, this.size - 2);

    for (const edge of edges) {
      const pa = toScreen(edge.a.position.x, edge.a.position.y);
      const pb = toScreen(edge.b.position.x, edge.b.position.y);
      const isActiveRoute = travelRoute && (
        (edge.a === travelRoute.a && edge.b === travelRoute.b) ||
        (edge.a === travelRoute.b && edge.b === travelRoute.a)
      );
      this.ctx.strokeStyle = isActiveRoute ? c.routeActive : c.route;
      this.ctx.lineWidth = isActiveRoute ? 3 : 2;
      this.ctx.beginPath();
      this.ctx.moveTo(pa.px, pa.py);
      this.ctx.lineTo(pb.px, pb.py);
      this.ctx.stroke();
    }

    for (const node of nodes) {
      const { px, py } = toScreen(node.position.x, node.position.y);
      const r = Math.max(2, islandRadius * scale * UI.minimapDotSizes.islandScale);
      this.ctx.fillStyle = node === map.homeNode ? c.islandHome
        : node.dangerous ? c.islandDanger : node.appealing ? c.islandAppeal : c.islandDefault;
      this.ctx.beginPath();
      this.ctx.arc(px, py, r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    const { px, py } = toScreen(shipPosition.x, shipPosition.y);
    this.ctx.fillStyle = c.player;
    this.ctx.beginPath();
    this.ctx.arc(px, py, UI.minimapDotSizes.player, 0, Math.PI * 2);
    this.ctx.fill();

    // North indicator (consistent with Chart Screen compass)
    const compSize = 14;
    const compX = this.size - compSize - 4;
    const compY = compSize + 4;
    this.ctx.strokeStyle = c.border;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(compX, compY, compSize / 2, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.fillStyle = c.player;
    this.ctx.font = `${Math.round(compSize * 0.4)}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#b8c4d0';
    this.ctx.fillText('N', compX, compY - compSize / 4);
  }
}
