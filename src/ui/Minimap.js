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
    this._lastOverworldTransform = null;
    this._lastOverworldNodes = null;
    this._minimapTooltip = null;
    this._isOverworldView = false;
  }

  _resize() {
    const wrapper = document.getElementById('minimap-wrapper');
    if (!wrapper || !this.canvas) return;
    const w = wrapper.clientWidth || this.size;
    const h = wrapper.clientHeight || this.size;
    const s = Math.min(w, h, UI_MINIMAP.sizeMaxCustom ?? 320);
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

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'minimap-resize-handle';
    resizeHandle.title = 'Drag to resize minimap';
    resizeHandle.setAttribute('aria-label', 'Resize minimap');
    resizeHandle.addEventListener('mousedown', (e) => this._onResizeStart(e));
    wrapper.appendChild(resizeHandle);

    this.ctx = this.canvas.getContext('2d');
    this._resizeDrag = null;
    this._loadCustomSize();
    this._resize();
    window.addEventListener('resize', () => this._resize());

    // N.2: Island tooltip on hover
    this._minimapTooltip = document.createElement('div');
    this._minimapTooltip.className = 'minimap-tooltip';
    this._minimapTooltip.setAttribute('aria-hidden', 'true');
    this._minimapTooltip.style.display = 'none';
    wrapper.appendChild(this._minimapTooltip);
    this._boundMinimapMouseMove = (e) => this._onMinimapMouseMove(e);
    this._boundMinimapMouseLeave = () => this._hideMinimapTooltip();
    this.canvas.addEventListener('mousemove', this._boundMinimapMouseMove);
    this.canvas.addEventListener('mouseleave', this._boundMinimapMouseLeave);
  }

  _loadCustomSize() {
    try {
      const saved = localStorage.getItem('yohoh-minimap-size');
      if (saved) {
        const size = parseInt(saved, 10);
        if (!isNaN(size) && size >= UI_MINIMAP.sizeMin && size <= (UI_MINIMAP.sizeMaxCustom ?? 320)) {
          const wrapper = document.getElementById('minimap-wrapper');
          if (wrapper) {
            wrapper.style.width = `${size}px`;
            wrapper.style.height = `${size}px`;
          }
        }
      }
    } catch (_) {}
  }

  _saveCustomSize(size) {
    try {
      localStorage.setItem('yohoh-minimap-size', String(size));
    } catch (_) {}
  }

  _onResizeStart(e) {
    e.preventDefault();
    e.stopPropagation();
    const wrapper = document.getElementById('minimap-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    this._resizeDrag = {
      cornerX: rect.right,
      cornerY: rect.top,
      grabOffsetX: e.clientX - rect.left,
      grabOffsetY: e.clientY - rect.bottom,
      pendingClientX: e.clientX,
      pendingClientY: e.clientY,
      rafId: null,
    };
    wrapper.classList.add('resizing');
    document.body.classList.add('minimap-resizing');
    this._boundResizeMove = (ev) => this._onResizeMove(ev);
    this._boundResizeEnd = () => this._onResizeEnd();
    document.addEventListener('mousemove', this._boundResizeMove);
    document.addEventListener('mouseup', this._boundResizeEnd);
  }

  _onResizeMove(e) {
    if (!this._resizeDrag) return;
    this._resizeDrag.pendingClientX = e.clientX;
    this._resizeDrag.pendingClientY = e.clientY;
    if (this._resizeDrag.rafId == null) {
      this._resizeDrag.rafId = requestAnimationFrame(() => this._applyResize());
    }
  }

  _applyResize() {
    const drag = this._resizeDrag;
    if (!drag || drag.rafId == null) return;
    drag.rafId = null;

    const wrapper = document.getElementById('minimap-wrapper');
    if (!wrapper) return;

    const { cornerX, cornerY, grabOffsetX, grabOffsetY, pendingClientX, pendingClientY } = drag;
    const virtualLeft = pendingClientX - grabOffsetX;
    const virtualBottom = pendingClientY - grabOffsetY;
    const newWidth = cornerX - virtualLeft;
    const newHeight = virtualBottom - cornerY;
    const minSize = UI_MINIMAP.sizeMin;
    const maxSize = UI_MINIMAP.sizeMaxCustom ?? 320;
    const newSize = Math.max(minSize, Math.min(maxSize, Math.min(newWidth, newHeight)));

    wrapper.style.width = `${newSize}px`;
    wrapper.style.height = `${newSize}px`;
    this._resize();
  }

  _onResizeEnd() {
    if (this._resizeDrag?.rafId != null) {
      cancelAnimationFrame(this._resizeDrag.rafId);
    }
    const wrapper = document.getElementById('minimap-wrapper');
    if (wrapper) {
      wrapper.classList.remove('resizing');
      if (this._resizeDrag) this._saveCustomSize(Math.round(wrapper.offsetWidth));
    }
    document.body.classList.remove('minimap-resizing');
    this._resizeDrag = null;
    document.removeEventListener('mousemove', this._boundResizeMove);
    document.removeEventListener('mouseup', this._boundResizeEnd);
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
    this._isOverworldView = true;
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
      const isCurrent = node === currentIsland;
      const rMult = isCurrent ? 1.4 : 1;
      const r = Math.max(2, islandRadius * scale * UI.minimapDotSizes.islandScale * rMult);
      this.ctx.fillStyle = isCurrent ? (c.currentIsland ?? '#ffcc44')
        : node === map.homeNode ? c.islandHome
        : node.dangerous ? c.islandDanger : node.appealing ? c.islandAppeal : c.islandDefault;
      this.ctx.beginPath();
      this.ctx.arc(px, py, r, 0, Math.PI * 2);
      this.ctx.fill();
      if (isCurrent) {
        this.ctx.strokeStyle = c.currentIslandStroke ?? '#ffdd66';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }

    const { px, py } = toScreen(shipPosition.x, shipPosition.y);
    this.ctx.fillStyle = c.player;
    this.ctx.beginPath();
    this.ctx.arc(px, py, UI.minimapDotSizes.player, 0, Math.PI * 2);
    this.ctx.fill();

    // Sailing progress bar (when traveling)
    if (travelRoute && currentIsland) {
      const origin = travelRoute.a === currentIsland ? travelRoute.a : travelRoute.b;
      const dest = travelRoute.a === currentIsland ? travelRoute.b : travelRoute.a;
      const ax = origin.position.x;
      const ay = origin.position.y;
      const bx = dest.position.x;
      const by = dest.position.y;
      const totalDist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
      const remainDist = Math.sqrt((bx - shipPosition.x) ** 2 + (by - shipPosition.y) ** 2);
      const progress = totalDist > 0 ? Math.max(0, 1 - remainDist / totalDist) : 1;
      const barW = this.size - padding * 2;
      const barH = 4;
      const barX = padding;
      const barY = this.size - padding - barH - 2;
      this.ctx.fillStyle = c.border;
      this.ctx.fillRect(barX, barY, barW, barH);
      this.ctx.fillStyle = c.routeActive;
      this.ctx.fillRect(barX, barY, barW * progress, barH);
    }

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

    // Store for tooltip hit detection (N.2)
    this._lastOverworldTransform = { cx, cy, midX, midY, scale };
    this._lastOverworldNodes = nodes;
    this._lastOverworldIslandRadius = islandRadius;
  }

  _onMinimapMouseMove(e) {
    if (!this._lastOverworldNodes || !this._lastOverworldTransform || !this.canvas || !this._minimapTooltip) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const { cx, cy, midX, midY, scale } = this._lastOverworldTransform;
    const worldX = midX + (px - cx) / scale;
    const worldY = midY - (py - cy) / scale;
    const rMult = 1.5;
    const hitRadius = this._lastOverworldIslandRadius * scale * (UI.minimapDotSizes?.islandScale ?? 0.3) * rMult;
    let nearest = null;
    let nearestDist = hitRadius;
    for (const node of this._lastOverworldNodes) {
      const dx = node.position.x - worldX;
      const dy = node.position.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nodeScreenR = Math.max(2, this._lastOverworldIslandRadius * scale * (UI.minimapDotSizes?.islandScale ?? 0.3));
      if (dist * scale < nodeScreenR * 2 && dist < nearestDist) {
        nearestDist = dist;
        nearest = node;
      }
    }
    if (nearest) {
      const name = nearest.name || `Island ${nearest.id}`;
      this._minimapTooltip.textContent = name;
      this._minimapTooltip.style.display = 'block';
      this._minimapTooltip.style.left = `${e.clientX + 12}px`;
      this._minimapTooltip.style.top = `${e.clientY + 8}px`;
    } else {
      this._hideMinimapTooltip();
    }
  }

  _hideMinimapTooltip() {
    if (this._minimapTooltip) this._minimapTooltip.style.display = 'none';
  }
}
