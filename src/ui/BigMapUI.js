/**
 * YoHoH — Chart Screen (M key): strategic map overlay with pan/zoom
 */

import { OVERWORLD, UI } from '../config.js';
import { getRouteModifiers, getPrimaryModifier } from '../utils/routeModifiers.js';

const { bigMap: UI_BIGMAP, chartScreen: CHART_SCREEN } = UI;

export class BigMapUI {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.visible = false;
    this.size = UI_BIGMAP.sizeMin;
    this._dpr = 1;
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
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bufferSize = (s * dpr) | 0;
    if (bufferSize !== this.canvas.width || s !== this.size) {
      this.size = s;
      this._dpr = dpr;
      this.canvas.width = bufferSize;
      this.canvas.height = bufferSize;
      this.canvas.style.width = `${s}px`;
      this.canvas.style.height = `${s}px`;
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
    this._dragStart = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPanX: this.panX,
      startPanY: this.panY,
    };
  }

  _onDragMove(e) {
    if (!this._dragStart) return;
    this.panX = this._dragStart.startPanX + (e.clientX - this._dragStart.startClientX);
    this.panY = this._dragStart.startPanY + (e.clientY - this._dragStart.startClientY);
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
    const chart = CHART_SCREEN ?? {};
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
    const dpr = this._dpr ?? 1;
    const baseScale = Math.min(mapW / rangeX, mapH / rangeY) * this.zoomLevel * dpr;
    const scale = baseScale;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const ox = (s.centerOffsetX ?? 0) * dpr;
    const oy = (s.centerOffsetY ?? 0) * dpr;
    const cx = w / 2 + this.panX * dpr + ox;
    const cy = h / 2 + this.panY * dpr + oy;

    const midX = Number(shipPosition?.x ?? 0);
    const midY = Number(shipPosition?.y ?? 0);

    const toScreen = (x, y) => ({
      px: cx + (x - midX) * scale,
      py: cy - (y - midY) * scale,
    });

    this.ctx.fillStyle = c.background;
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.strokeStyle = c.border;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(2, 2, w - 4, h - 4);
    this.ctx.strokeStyle = 'rgba(42, 74, 106, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(4, 4, w - 8, h - 8);

    for (const edge of edges) {
      const { a, b } = edge;
      const pa = toScreen(a.position.x, a.position.y);
      const pb = toScreen(b.position.x, b.position.y);
      const isActiveRoute = travelRoute && (
        (edge.a === travelRoute.a && edge.b === travelRoute.b) ||
        (edge.a === travelRoute.b && edge.b === travelRoute.a)
      );
      let routeColor = isActiveRoute ? c.routeActive : c.route;
      if (!isActiveRoute) {
        const primary = getPrimaryModifier(getRouteModifiers(edge));
        if (primary === 'stormy') routeColor = c.routeStormy ?? c.route;
        else if (primary === 'patrolled') routeColor = c.routePatrolled ?? c.route;
        else if (primary === 'shoals') routeColor = c.routeShoals ?? c.route;
      }
      this.ctx.strokeStyle = routeColor;
      this.ctx.lineWidth = isActiveRoute ? (chart.routeActiveWidth ?? s.routeActiveWidth) : (chart.routeWidth ?? s.routeWidth);
      this.ctx.beginPath();
      this.ctx.moveTo(pa.px, pa.py);
      this.ctx.lineTo(pb.px, pb.py);
      this.ctx.stroke();
    }

    const destNode = travelRoute ? (travelRoute.a === currentIsland ? travelRoute.b : travelRoute.a) : null;

    for (const node of nodes) {
      const { px, py } = toScreen(node.position.x, node.position.y);
      const isCurrent = node === currentIsland;
      const rMult = isCurrent ? (chart.currentIslandRadiusMult ?? s.currentIslandRadiusMult ?? 1.3) : 1;
      const islandScale = chart.islandScale ?? s.islandScale ?? 0.3;
      const r = Math.max(s.islandMinRadius, islandRadius * scale * islandScale * rMult);
      const isDest = node === destNode;
      this.ctx.fillStyle = isCurrent ? (c.currentIsland ?? '#ffcc44')
        : node === map.homeNode ? c.islandHome
        : node.dangerous ? c.islandDanger
        : node.appealing ? c.islandAppeal : c.islandDefault;
      this.ctx.beginPath();
      this.ctx.arc(px, py, r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = isCurrent ? (c.currentIslandStroke ?? '#ffdd66') : (isDest ? c.shipStroke : c.border);
      this.ctx.lineWidth = isCurrent ? 3 : (isDest ? 2 : 1);
      this.ctx.stroke();
      if (isCurrent) {
        this.ctx.beginPath();
        this.ctx.arc(px, py, r + 4, 0, Math.PI * 2);
        this.ctx.strokeStyle = c.currentIslandStroke ?? '#ffdd66';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([3, 3]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      } else if (isDest) {
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

    const labelFontSize = chart.labelFontSize ?? s.labelFontSize ?? 10;
    const labelMaxLen = chart.labelMaxLength ?? 12;
    const labelFont = `${labelFontSize}px sans-serif`;
    this.ctx.font = labelFont;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    if (chart.showIslandLabels !== false) {
      for (const node of nodes) {
        const { px, py } = toScreen(node.position.x, node.position.y);
        const islandScale = chart.islandScale ?? s.islandScale ?? 0.3;
        const r = Math.max(s.islandMinRadius, islandRadius * scale * islandScale);
        const name = (node.name || `Island ${node.id}`).slice(0, labelMaxLen);
        this.ctx.fillStyle = c.text;
        this.ctx.fillText(name, px, py - r - 6);
      }
    }

    if (chart.showCompass !== false) {
      const compSize = s.compassSize || 28;
      const compX = w - compSize - 12;
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
    }

    const legY = h - s.textBottomOffset - 8;
    const legX = 12;
    const legendEntries = chart.legendEntries ?? ['docked', 'home', 'danger', 'safe', 'other'];
    const legendMap = {
      docked: { color: c.currentIsland ?? '#ffcc44', label: 'Docked' },
      home: { color: c.islandHome, label: 'Home' },
      danger: { color: c.islandDanger, label: 'Danger' },
      safe: { color: c.islandAppeal, label: 'Safe' },
      other: { color: c.islandDefault, label: 'Other' },
    };
    if (chart.showLegend !== false && legendEntries.length > 0) {
      this.ctx.font = `${s.fontSize - 2}px sans-serif`;
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      let lx = legX;
      for (const key of legendEntries) {
        const leg = legendMap[key];
        if (!leg) continue;
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
    }

    if (chart.showHelpText !== false) {
      this.ctx.fillStyle = c.text;
      this.ctx.font = `${s.fontSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Drag to pan · Scroll or +/- to zoom · M or Esc to close', w / 2, h - 10);
    }
  }
}
