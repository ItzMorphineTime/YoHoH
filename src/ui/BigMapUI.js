/**
 * YoHoH — Chart Screen (M key): strategic map overlay with pan/zoom
 */

import { OVERWORLD, UI } from '../config.js';

const { bigMap: UI_BIGMAP } = UI;

export class BigMapUI {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.visible = false;
    this.size = UI_BIGMAP.sizeMin;
    this.panX = 0;
    this.panY = 0;
    this.zoomLevel = 1;
    this.minZoom = 0.5;
    this.maxZoom = 3;
    this._dragStart = null;
  }

  _resize() {
    if (!this.canvas) return;
    const v = Math.min(window.innerWidth, window.innerHeight) * UI_BIGMAP.viewportRatio;
    const s = Math.min(UI_BIGMAP.sizeMax, Math.max(UI_BIGMAP.sizeMin, v | 0));
    if (s !== this.size) {
      this.size = s;
      this.canvas.width = this.size;
      this.canvas.height = this.size;
      this.canvas.style.width = `${this.size}px`;
      this.canvas.style.height = `${this.size}px`;
    }
  }

  _handleKey = (e) => {
    if (!this.visible) return;
    if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  };

  init() {
    this.canvas = document.getElementById('big-map-canvas');
    const overlay = document.getElementById('big-map-overlay');
    const closeBtn = overlay?.querySelector('.big-map-close');
    const centerBtn = overlay?.querySelector('.chart-center-btn');
    const zoomInBtn = overlay?.querySelector('.chart-zoom-in');
    const zoomOutBtn = overlay?.querySelector('.chart-zoom-out');
    if (!this.canvas || !overlay) return;

    this._resize();
    this.ctx = this.canvas.getContext('2d');

    document.addEventListener('keydown', this._handleKey);
    overlay.addEventListener('keydown', this._handleKey);
    window.addEventListener('resize', () => this._resize());
    closeBtn?.addEventListener('click', () => this.hide());
    centerBtn?.addEventListener('click', () => this._centerOnShip());
    zoomInBtn?.addEventListener('click', () => this._zoomIn());
    zoomOutBtn?.addEventListener('click', () => this._zoomOut());

    this.canvas.addEventListener('mousedown', (e) => this._onDragStart(e));
    document.addEventListener('mousemove', (e) => this._onDragMove(e));
    document.addEventListener('mouseup', () => this._onDragEnd());
    this.canvas.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
  }

  _centerOnShip() {
    this.panX = 0;
    this.panY = 0;
  }

  _onDragStart(e) {
    if (e.button !== 0) return;
    this._dragStart = { x: e.clientX + this.panX, y: e.clientY + this.panY };
  }

  _onDragMove(e) {
    if (!this._dragStart) return;
    this.panX = this._dragStart.x - e.clientX;
    this.panY = this._dragStart.y - e.clientY;
  }

  _onDragEnd() {
    this._dragStart = null;
  }

  _onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel + delta));
  }

  _zoomIn() {
    this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + 0.25);
  }

  _zoomOut() {
    this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - 0.25);
  }

  show() {
    this.visible = true;
    const overlay = document.getElementById('big-map-overlay');
    overlay?.classList.add('visible');
    requestAnimationFrame(() => overlay?.focus());
  }

  hide() {
    this.visible = false;
    document.getElementById('big-map-overlay')?.classList.remove('visible');
  }

  toggle() {
    this.visible = !this.visible;
    const overlay = document.getElementById('big-map-overlay');
    overlay?.classList.toggle('visible', this.visible);
    if (this.visible) {
      requestAnimationFrame(() => overlay?.focus());
      this._centerOnShip();
      this.zoomLevel = 1;
    }
  }

  isVisible() {
    return this.visible;
  }

  update(map, shipPosition, currentIsland, travelRoute) {
    if (!this.ctx || !this.canvas || !this.visible || !map) return;
    this._resize();

    const { islandRadius } = OVERWORLD;
    const c = UI.bigMapColors;
    const s = UI.bigMapSizes;
    const padding = s.padding;
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
    const mapW = this.size - padding * 2;
    const mapH = this.size - padding * 2 - (s.legendHeight || 0);
    const baseScale = Math.min(mapW / rangeX, mapH / rangeY) * this.zoomLevel;
    const scale = baseScale;
    const cx = this.size / 2 + this.panX;
    const cy = (this.size - (s.legendHeight || 0)) / 2 + this.panY;
    const midX = travelRoute ? shipPosition.x : (minX + maxX) / 2;
    const midY = travelRoute ? shipPosition.y : (minY + maxY) / 2;

    const toScreen = (x, y) => ({
      px: cx + (x - midX) * scale,
      py: cy - (y - midY) * scale,
    });

    this.ctx.fillStyle = c.background;
    this.ctx.fillRect(0, 0, this.size, this.size);

    this.ctx.strokeStyle = c.border;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(2, 2, this.size - 4, this.size - 4);
    this.ctx.strokeStyle = 'rgba(42, 74, 106, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(4, 4, this.size - 8, this.size - 8);

    for (const edge of edges) {
      const { a, b } = edge;
      const pa = toScreen(a.position.x, a.position.y);
      const pb = toScreen(b.position.x, b.position.y);
      const isActiveRoute = travelRoute && (
        (edge.a === travelRoute.a && edge.b === travelRoute.b) ||
        (edge.a === travelRoute.b && edge.b === travelRoute.a)
      );
      this.ctx.strokeStyle = isActiveRoute ? c.routeActive : c.route;
      this.ctx.lineWidth = isActiveRoute ? s.routeActiveWidth : s.routeWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(pa.px, pa.py);
      this.ctx.lineTo(pb.px, pb.py);
      this.ctx.stroke();
    }

    const destNode = travelRoute ? (travelRoute.a === currentIsland ? travelRoute.b : travelRoute.a) : null;

    for (const node of nodes) {
      const { px, py } = toScreen(node.position.x, node.position.y);
      const r = Math.max(s.islandMinRadius, islandRadius * scale * s.islandScale);
      const isDest = node === destNode;
      this.ctx.fillStyle = node === map.homeNode ? c.islandHome
        : node.dangerous ? c.islandDanger
        : node.appealing ? c.islandAppeal : c.islandDefault;
      this.ctx.beginPath();
      this.ctx.arc(px, py, r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = isDest ? c.shipStroke : c.border;
      this.ctx.lineWidth = isDest ? 2 : 1;
      this.ctx.stroke();
      if (isDest) {
        this.ctx.beginPath();
        this.ctx.arc(px, py, r + 4, 0, Math.PI * 2);
        this.ctx.strokeStyle = c.routeActive;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    }

    const { px, py } = toScreen(shipPosition.x, shipPosition.y);
    this.ctx.fillStyle = c.ship;
    this.ctx.beginPath();
    this.ctx.arc(px, py, s.shipRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = c.shipStroke;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    const labelFont = `${s.labelFontSize || 10}px sans-serif`;
    this.ctx.font = labelFont;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    for (const node of nodes) {
      const { px, py } = toScreen(node.position.x, node.position.y);
      const r = Math.max(s.islandMinRadius, islandRadius * scale * s.islandScale);
      const name = (node.name || `Island ${node.id}`).slice(0, 12);
      this.ctx.fillStyle = c.text;
      this.ctx.fillText(name, px, py - r - 6);
    }

    const compSize = s.compassSize || 28;
    const compX = this.size - compSize - 12;
    const compY = compSize + 12;
    this.ctx.strokeStyle = c.border;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(compX, compY, compSize / 2, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.fillStyle = c.text;
    this.ctx.font = `${Math.round(compSize * 0.35)}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('N', compX, compY - compSize / 4);

    const legY = this.size - s.textBottomOffset - 8;
    const legX = 12;
    this.ctx.font = `${s.fontSize - 2}px sans-serif`;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    const legends = [
      { color: c.islandHome, label: 'Home' },
      { color: c.islandDanger, label: 'Danger' },
      { color: c.islandAppeal, label: 'Safe' },
      { color: c.islandDefault, label: 'Other' },
    ];
    let lx = legX;
    for (const leg of legends) {
      this.ctx.fillStyle = leg.color;
      this.ctx.beginPath();
      this.ctx.arc(lx + 6, legY, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = c.border;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.fillStyle = c.text;
      this.ctx.fillText(leg.label, lx + 14, legY);
      lx += 52;
    }

    this.ctx.fillStyle = c.text;
    this.ctx.font = `${s.fontSize}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Drag to pan · Scroll or +/- to zoom · M or Esc to close', this.size / 2, this.size - 10);
  }
}
