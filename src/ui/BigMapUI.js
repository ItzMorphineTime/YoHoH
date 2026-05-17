/**
 * YoHoH — Chart Screen (M key): strategic map overlay with pan/zoom
 */

import { OVERWORLD, UI } from '../config.js';
import { getRouteModifiers, getPrimaryModifier } from '../utils/routeModifiers.js';
import { esc } from '../utils/escapeHtml.js';
import { isNodeVisible, isEdgeVisible, FOG_UNKNOWN_LABEL, FOG_UNKNOWN_DESC } from '../utils/fogOfWar.js';

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
    // Dirty-flag cache (Improvements.md §2.2).
    this._dirty = {
      map: null, shipX: NaN, shipY: NaN,
      currentIsland: null, travelRoute: null,
      panX: NaN, panY: NaN, zoomLevel: NaN, size: 0, dpr: 0,
    };
    // Charting_Improvements.md §1.2: hover tooltip state. `_lastTransform`
    // captures the projection used in the most recent draw so mousemove can
    // invert it without re-deriving bounds / scale.
    this._tooltip = null;
    this._lastTransform = null;
    this._lastNodes = null;
    this._lastCurrentIsland = null;
    this._lastMap = null;
  }

  /** Force a redraw on next update(). Call when pan/zoom changes outside update(). */
  invalidate() {
    this._dirty.map = null;
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
    // Ignore keyboard nav when typing in an input
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
      return;
    }
    // Charting_Improvements.md §1.7: keyboard pan / zoom / fit / reset
    const PAN_STEP = 40;
    switch (e.key) {
      case '+':
      case '=':
        e.preventDefault(); this._zoomIn(); this.invalidate(); break;
      case '-':
      case '_':
        e.preventDefault(); this._zoomOut(); this.invalidate(); break;
      case '0':
      case 'Home':
        e.preventDefault();
        this._centerOnShip();
        this.zoomLevel = 1;
        break;
      case 'f':
      case 'F':
        e.preventDefault(); this._fitMap(); break;
      case 'ArrowLeft':
        e.preventDefault(); this.panX += PAN_STEP; this.invalidate(); break;
      case 'ArrowRight':
        e.preventDefault(); this.panX -= PAN_STEP; this.invalidate(); break;
      case 'ArrowUp':
        e.preventDefault(); this.panY += PAN_STEP; this.invalidate(); break;
      case 'ArrowDown':
        e.preventDefault(); this.panY -= PAN_STEP; this.invalidate(); break;
    }
  };

  init() {
    this.canvas = document.getElementById('big-map-canvas');
    const overlay = document.getElementById('big-map-overlay');
    const closeBtn = overlay?.querySelector('.big-map-close');
    const centerBtn = overlay?.querySelector('.chart-center-btn');
    const fitBtn = overlay?.querySelector('.chart-fit-btn');
    const zoomInBtn = overlay?.querySelector('.chart-zoom-in');
    const zoomOutBtn = overlay?.querySelector('.chart-zoom-out');
    if (!this.canvas || !overlay) return;

    // Charting_Improvements.md §1.5: voyage info strip elements
    this._voyageStrip = document.getElementById('chart-voyage-strip');
    this._voyageEls = {
      dest:     document.getElementById('chart-voyage-dest'),
      distance: document.getElementById('chart-voyage-distance'),
      eta:      document.getElementById('chart-voyage-eta'),
      bearing:  document.getElementById('chart-voyage-bearing'),
      wind:     document.getElementById('chart-voyage-wind'),
    };

    this._resize();
    this.ctx = this.canvas.getContext('2d');

    document.addEventListener('keydown', this._handleKey);
    overlay.addEventListener('keydown', this._handleKey);
    window.addEventListener('resize', () => this._resize());
    closeBtn?.addEventListener('click', () => this.hide());
    centerBtn?.addEventListener('click', () => this._centerOnShip());
    fitBtn?.addEventListener('click', () => this._fitMap());
    zoomInBtn?.addEventListener('click', () => this._zoomIn());
    zoomOutBtn?.addEventListener('click', () => this._zoomOut());

    this.canvas.addEventListener('mousedown', (e) => this._onDragStart(e));
    document.addEventListener('mousemove', (e) => this._onDragMove(e));
    document.addEventListener('mouseup', () => this._onDragEnd());
    this.canvas.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });

    // Charting_Improvements.md §1.2: island tooltip on hover. Tooltip lives in
    // the document body so it can layer above the chart overlay; pointer-events
    // off so it never intercepts pan/zoom.
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'big-map-tooltip';
    this._tooltip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this._tooltip);
    this.canvas.addEventListener('mousemove', (e) => this._onHoverMove(e));
    this.canvas.addEventListener('mouseleave', () => this._hideTooltip());
  }

  _centerOnShip() {
    this.panX = 0;
    this.panY = 0;
    this.invalidate();
  }

  /**
   * Charting_Improvements.md §1.6: zoom-and-pan to show every island with
   * comfortable padding. Useful as the default "I have no idea where I am"
   * action and at the start of every chart session.
   *
   * Math: the projection is anchored on the ship (`midX = shipPos.x`). To put
   * the bounding-box centroid at screen centre, pan = (ship - centroid) × scale.
   * Zoom is set to 0.9 to leave a 5% margin on each side.
   */
  _fitMap() {
    const map = this._lastMap;
    if (!map?.nodes?.length) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of map.nodes) {
      const { x, y } = n.position;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const centroidX = (minX + maxX) / 2;
    const centroidY = (minY + maxY) / 2;
    this.zoomLevel = 0.9;

    // Compute the scale that the NEXT draw will use (we just changed zoomLevel).
    const s = UI.bigMapSizes ?? {};
    const padding = s.padding ?? 36;
    const legendHeight = s.legendHeight ?? 0;
    const mapW = this.size - padding * 2;
    const mapH = this.size - padding * 2 - legendHeight;
    const rangeX = Math.max(maxX - minX, 1);
    const rangeY = Math.max(maxY - minY, 1);
    const dpr = this._dpr ?? 1;
    const nextScale = Math.min(mapW / rangeX, mapH / rangeY) * this.zoomLevel * dpr;

    // Use the ship anchor from the most recent draw (cached on `_lastTransform`).
    const shipX = this._lastTransform?.midX;
    const shipY = this._lastTransform?.midY;
    if (typeof shipX === 'number' && typeof shipY === 'number') {
      this.panX = (shipX - centroidX) * nextScale / dpr;
      this.panY = (centroidY - shipY) * nextScale / dpr;
    } else {
      this.panX = 0;
      this.panY = 0;
    }
    this.invalidate();
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
    this.invalidate(); // ensure first frame after open paints fresh
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
      this.invalidate();
      requestAnimationFrame(() => overlay?.focus());
      this._centerOnShip();
      this.zoomLevel = 1;
    }
  }

  isVisible() {
    return this.visible;
  }

  update(map, shipPosition, currentIsland, travelRoute, corridorEvents = null, voyageInfo = null, sailingShip = null) {
    if (!this.ctx || !this.canvas || !this.visible || !map) return;
    this._resize();

    // Charting_Improvements.md §1.5: live voyage strip — pure DOM update, no
    // canvas paint, so it runs every call (cheap text replacement). Hidden when
    // not traveling.
    this._updateVoyageStrip(voyageInfo, sailingShip);

    // Improvements.md §2.2: dirty-flag — skip when nothing changed.
    // Charting_Improvements.md §1.4: include corridor-event signature so dots
    // appear/disappear as events trigger.
    // Charting_Improvements.md §5.3 / §5.1: include a 50ms time bucket so the
    // current-island pulse + active-route flow dashes keep animating even when
    // the player is docked or motionless (otherwise dirty short-circuits).
    const sx = shipPosition?.x ?? 0;
    const sy = shipPosition?.y ?? 0;
    const d = this._dirty;
    const eventsSig = corridorEvents
      ? `${corridorEvents.length}:${corridorEvents.filter(e => !e.triggered).length}`
      : '';
    const animTick = Math.floor((typeof performance !== 'undefined' ? performance.now() : Date.now()) / 50);
    if (
      d.map === map &&
      d.shipX === sx && d.shipY === sy &&
      d.currentIsland === currentIsland &&
      d.travelRoute === travelRoute &&
      d.panX === this.panX && d.panY === this.panY &&
      d.zoomLevel === this.zoomLevel &&
      d.size === this.size && d.dpr === this._dpr &&
      d.eventsSig === eventsSig &&
      d.animTick === animTick
    ) {
      return;
    }
    d.map = map; d.shipX = sx; d.shipY = sy;
    d.currentIsland = currentIsland; d.travelRoute = travelRoute;
    d.panX = this.panX; d.panY = this.panY;
    d.zoomLevel = this.zoomLevel; d.size = this.size; d.dpr = this._dpr;
    d.eventsSig = eventsSig;
    d.animTick = animTick;

    const { islandRadius } = OVERWORLD;
    const c = UI.bigMapColors;
    const s = UI.bigMapSizes;
    const chart = CHART_SCREEN ?? {};
    const padding = s.padding;
    const nodes = map.nodes;
    const edges = map.edges;

    // Charting_Improvements.md §5.4: bounding box only spans visible islands.
    // Undiscovered + non-adjacent islands stay hidden from the view (no scale
    // skew or "blank space hint" toward unrevealed regions).
    const visibleNodes = nodes.filter(isNodeVisible);
    const bboxSrc = visibleNodes.length > 0 ? visibleNodes : nodes; // fallback if everything is hidden (shouldn't happen — home always discovered)
    const xs = bboxSrc.map(n => n.position.x);
    const ys = bboxSrc.map(n => n.position.y);
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
      // Charting_Improvements.md §5.4: skip edges with both endpoints undiscovered
      if (!isEdgeVisible(edge)) continue;
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

      // Charting_Improvements.md §5.1: animated flow-direction dashes layered
      // on top of the active route. Origin → destination ordering ensures the
      // dashes march toward the player's actual goal regardless of edge a/b.
      if (isActiveRoute && currentIsland) {
        const origin = (edge.a === currentIsland) ? edge.a : edge.b;
        const dest   = (edge.a === currentIsland) ? edge.b : edge.a;
        const ph = toScreen(origin.position.x, origin.position.y);
        const pt = toScreen(dest.position.x,   dest.position.y);
        const t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
        this.ctx.save();
        this.ctx.strokeStyle = c.shipStroke ?? '#88ff88';
        this.ctx.lineWidth = Math.max(2, (chart.routeActiveWidth ?? s.routeActiveWidth) - 2);
        this.ctx.setLineDash([10 * dpr, 8 * dpr]);
        this.ctx.lineDashOffset = -(t / 60);
        this.ctx.beginPath();
        this.ctx.moveTo(ph.px, ph.py);
        this.ctx.lineTo(pt.px, pt.py);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    const destNode = travelRoute ? (travelRoute.a === currentIsland ? travelRoute.b : travelRoute.a) : null;

    for (const node of nodes) {
      // Charting_Improvements.md §5.4: skip nodes that aren't yet revealed
      if (!isNodeVisible(node)) continue;
      const { px, py } = toScreen(node.position.x, node.position.y);
      const isCurrent = node === currentIsland;
      const rMult = isCurrent ? (chart.currentIslandRadiusMult ?? s.currentIslandRadiusMult ?? 1.3) : 1;
      const islandScale = chart.islandScale ?? s.islandScale ?? 0.3;
      const r = Math.max(s.islandMinRadius, islandRadius * scale * islandScale * rMult);
      const isDest = node === destNode;
      // Undiscovered-but-adjacent: render as fog-tinted neutral circle, no tags
      const isFog = !node.discovered;
      this.ctx.fillStyle = isFog ? '#3a4a5a'
        : isCurrent ? (c.currentIsland ?? '#ffcc44')
        : node === map.homeNode ? c.islandHome
        : node.dangerous ? c.islandDanger
        : node.appealing ? c.islandAppeal : c.islandDefault;
      this.ctx.beginPath();
      this.ctx.arc(px, py, r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = isFog ? '#5a6a7a'
        : isCurrent ? (c.currentIslandStroke ?? '#ffdd66')
        : (isDest ? c.shipStroke : c.border);
      this.ctx.lineWidth = isCurrent ? 3 : (isDest ? 2 : 1);
      if (isFog) this.ctx.setLineDash([2, 2]);
      this.ctx.stroke();
      if (isFog) this.ctx.setLineDash([]);
      if (isCurrent) {
        // Charting_Improvements.md §5.3: pulsing "you are here" — outer dashed
        // ring fades opacity, plus a second expanding halo at lower alpha to
        // draw the eye on first opening the chart.
        const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 700;
        const pulse = 0.55 + 0.45 * Math.abs(Math.sin(t));
        this.ctx.save();
        this.ctx.globalAlpha = pulse;
        this.ctx.beginPath();
        this.ctx.arc(px, py, r + 4, 0, Math.PI * 2);
        this.ctx.strokeStyle = c.currentIslandStroke ?? '#ffdd66';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([3, 3]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        // Expanding halo — opacity inverse to its scale so it fades as it grows
        const haloScale = 1.5 + Math.abs(Math.sin(t)) * 0.8;
        this.ctx.globalAlpha = (1 - Math.abs(Math.sin(t))) * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(px, py, r * haloScale + 6, 0, Math.PI * 2);
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        this.ctx.restore();
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

    // Charting_Improvements.md §1.4: render corridor sub-events as small dots,
    // matching the minimap colour scheme so the player learns one icon vocab.
    if (Array.isArray(corridorEvents)) {
      for (const evt of corridorEvents) {
        if (!evt || evt.triggered) continue;
        const p = toScreen(evt.x, evt.y);
        let col = '#cccccc';
        if (evt.type === 'flotsam') col = '#ffcc44';
        else if (evt.type === 'debris') col = '#8a6a4a';
        else if (evt.type === 'whirlpool') col = '#8acaff';
        else if (evt.type === 'friendly') col = '#aacc88';
        this.ctx.fillStyle = col;
        this.ctx.beginPath();
        this.ctx.arc(p.px, p.py, 4 * dpr, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = c.border;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
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

    // Charting_Improvements.md §2.5: heading line — only when actively sailing
    // (no rotation when docked). Mirrors the minimap convention: forward =
    // (sin r, cos r) in world space; canvas Y is flipped so dy negates cos.
    if (sailingShip && typeof sailingShip.rotation === 'number' && travelRoute) {
      const len = 18 * dpr;
      const dx =  Math.sin(sailingShip.rotation) * len;
      const dy = -Math.cos(sailingShip.rotation) * len;
      this.ctx.strokeStyle = c.shipStroke;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(px + dx, py + dy);
      this.ctx.stroke();
    }

    const labelFontSize = chart.labelFontSize ?? s.labelFontSize ?? 10;
    const labelMaxLen = chart.labelMaxLength ?? 12;
    const labelFont = `${labelFontSize}px sans-serif`;
    this.ctx.font = labelFont;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    if (chart.showIslandLabels !== false) {
      for (const node of nodes) {
        // Charting_Improvements.md §5.4: only label visible islands; fog ones get "???"
        if (!isNodeVisible(node)) continue;
        const { px, py } = toScreen(node.position.x, node.position.y);
        const islandScale = chart.islandScale ?? s.islandScale ?? 0.3;
        const r = Math.max(s.islandMinRadius, islandRadius * scale * islandScale);
        const realName = (node.name || `Island ${node.id}`).slice(0, labelMaxLen);
        const label = node.discovered ? realName : FOG_UNKNOWN_LABEL;
        this.ctx.fillStyle = node.discovered ? c.text : '#7a8a9a';
        this.ctx.fillText(label, px, py - r - 6);
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

      // Sailing_Improvements.md #23: wind arrow next to compass
      if (map?.wind && typeof map.wind.angleRad === 'number') {
        const windX = compX - compSize - 18;
        const windY = compY;
        const r = compSize / 2;
        this.ctx.save();
        this.ctx.translate(windX, windY);
        this.ctx.rotate(map.wind.angleRad);
        this.ctx.strokeStyle = '#8acaff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -r); this.ctx.lineTo(0, r);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, r);
        this.ctx.lineTo(-r * 0.4, r * 0.55);
        this.ctx.moveTo(0, r);
        this.ctx.lineTo(r * 0.4, r * 0.55);
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx.fillStyle = '#8acaff';
        this.ctx.font = `${Math.round(compSize * 0.3)}px sans-serif`;
        this.ctx.fillText('WIND', windX, compY + compSize / 1.4);
      }
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

      // Charting_Improvements.md §1.3: second row for ROUTE colours. Without
      // this the player has no key for the stormy/patrolled/shoals tints and
      // the route palette is dead weight.
      const routeLegY = legY - 16;
      const routeEntries = [
        { color: c.routeActive,    label: 'Active' },
        { color: c.route,          label: 'Safe' },
        { color: c.routeStormy    ?? c.route, label: 'Stormy' },
        { color: c.routePatrolled ?? c.route, label: 'Patrolled' },
        { color: c.routeShoals    ?? c.route, label: 'Shoals' },
      ];
      let rlx = legX;
      for (const leg of routeEntries) {
        this.ctx.strokeStyle = leg.color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(rlx, routeLegY);
        this.ctx.lineTo(rlx + 14, routeLegY);
        this.ctx.stroke();
        this.ctx.fillStyle = c.text;
        this.ctx.fillText(leg.label, rlx + 18, routeLegY);
        rlx += 64;
      }
    }

    if (chart.showHelpText !== false) {
      this.ctx.fillStyle = c.text;
      this.ctx.font = `${s.fontSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Drag to pan · Scroll or +/- to zoom · M or Esc to close', w / 2, h - 10);
    }

    // Charting_Improvements.md §1.2: stash the projection + node list so the
    // mousemove hit-test can invert `toScreen` without re-deriving bounds.
    // All values are in BUFFER pixels; the hover handler converts CSS → buffer.
    this._lastTransform = { cx, cy, midX, midY, scale, dpr };
    this._lastNodes = nodes;
    this._lastCurrentIsland = currentIsland;
    this._lastMap = map;
    this._lastIslandRadius = islandRadius;
    this._lastIslandScale = chart.islandScale ?? s.islandScale ?? 0.3;

    // Charting_Improvements.md §6.1: refresh a screen-reader summary of the
    // chart state. Cheap text replace — only changes when the underlying
    // dataset changes (which is the same gating as the dirty-flag above).
    const discovered = nodes.filter(n => n.discovered).length;
    const total = nodes.length;
    const here = currentIsland?.name ?? (currentIsland ? `Island ${currentIsland.id}` : 'unknown');
    let aria = `Chart Screen. ${total} islands, ${discovered} charted. Ship at ${here}.`;
    if (travelRoute && destNode) {
      const dn = destNode.discovered ? (destNode.name ?? `Island ${destNode.id}`) : 'an uncharted island';
      aria += ` Traveling to ${dn}.`;
    }
    this.canvas.setAttribute('aria-label', aria);
  }

  /**
   * Charting_Improvements.md §1.5: refresh the voyage info strip at the top
   * of the chart. Mirrors the HUD voyage panel so opening the chart mid-voyage
   * no longer hides the ETA / distance / bearing the player was reading.
   */
  _updateVoyageStrip(voyageInfo, sailingShip) {
    const strip = this._voyageStrip;
    if (!strip) return;
    if (!voyageInfo) {
      strip.style.display = 'none';
      return;
    }
    strip.style.display = 'flex';
    const els = this._voyageEls;
    if (els.dest) els.dest.textContent = voyageInfo.destination?.name ?? '—';
    if (els.distance) {
      const remaining = Math.max(0, Math.round(voyageInfo.distanceRemaining ?? 0));
      const total = Math.max(1, Math.round(voyageInfo.distanceTotal ?? 0));
      els.distance.textContent = `${remaining} / ${total} u`;
    }
    if (els.eta) {
      const s = voyageInfo.etaSec;
      if (s == null || !isFinite(s) || s > 9999) {
        els.eta.textContent = '—';
      } else {
        const secs = Math.max(0, Math.round(s));
        const mins = Math.floor(secs / 60);
        const rem = secs % 60;
        els.eta.textContent = mins > 0 ? `${mins}m ${String(rem).padStart(2, '0')}s` : `${rem}s`;
      }
    }
    if (els.bearing) {
      const bearingDeg = ((voyageInfo.bearingRad ?? 0) * 180 / Math.PI + 360) % 360;
      const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const idx = Math.round(bearingDeg / 45) % 8;
      const deltaDeg = Math.round((voyageInfo.headingDeltaRad ?? 0) * 180 / Math.PI);
      const arrow = deltaDeg > 5 ? '↻' : deltaDeg < -5 ? '↺' : '✓';
      els.bearing.textContent = `${labels[idx]} ${arrow}${Math.abs(deltaDeg) > 5 ? ` ${Math.abs(deltaDeg)}°` : ''}`;
    }
    if (els.wind) {
      const wm = sailingShip?._windMult;
      if (wm == null || Math.abs(wm - 1) < 0.005) {
        els.wind.textContent = '—';
        els.wind.style.color = '';
      } else {
        const pct = Math.round((wm - 1) * 100);
        els.wind.textContent = `${pct > 0 ? '+' : ''}${pct}%`;
        els.wind.style.color = pct > 0 ? '#aacc88' : '#cc8844';
      }
    }
  }

  /**
   * Charting_Improvements.md §1.2: convert mouse position → world coords,
   * find the nearest island within a generous hit radius, and render a rich
   * tooltip with port type, treasure, hazard, faction, distance, etc.
   */
  _onHoverMove(e) {
    if (!this.visible || !this._lastTransform || !this._lastNodes || !this._tooltip) return;
    const node = this._nodeUnderMouse(e);
    if (!node) {
      this._hideTooltip();
      return;
    }
    this._tooltip.innerHTML = this._buildTooltipHTML(node);
    this._tooltip.style.display = 'block';
    // Position with small offset so the cursor doesn't sit on the tooltip
    const px = Math.min(window.innerWidth - 270, e.clientX + 14);
    const py = Math.min(window.innerHeight - 120, e.clientY + 12);
    this._tooltip.style.left = `${px}px`;
    this._tooltip.style.top = `${py}px`;
  }

  _hideTooltip() {
    if (this._tooltip) this._tooltip.style.display = 'none';
  }

  /** Hit-test mouse against the nodes captured by the last draw. */
  _nodeUnderMouse(e) {
    const { cx, cy, midX, midY, scale, dpr } = this._lastTransform;
    const rect = this.canvas.getBoundingClientRect();
    // CSS px → buffer px (canvas.width is in buffer pixels = css * dpr).
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    const bufX = cssX * (this.canvas.width / rect.width);
    const bufY = cssY * (this.canvas.height / rect.height);
    const worldX = midX + (bufX - cx) / scale;
    const worldY = midY - (bufY - cy) / scale;
    const nodeR = Math.max(8, this._lastIslandRadius * scale * this._lastIslandScale) / scale; // hit radius in world units (~icon size)
    const hitRWorld = nodeR * 1.4; // generous
    let best = null;
    let bestDist = Infinity;
    for (const node of this._lastNodes) {
      // Charting_Improvements.md §5.4: don't hit-test hidden nodes
      if (!isNodeVisible(node)) continue;
      const dx = node.position.x - worldX;
      const dy = node.position.y - worldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= hitRWorld && dist < bestDist) {
        best = node;
        bestDist = dist;
      }
    }
    return best;
  }

  /** Compose a rich tooltip body. Falls back gracefully when fields are missing. */
  _buildTooltipHTML(node) {
    const cur = this._lastCurrentIsland;
    const isCurrent = node === cur;
    const isHome = node === this._lastMap?.homeNode;

    // Charting_Improvements.md §5.4: undiscovered islands show minimal info —
    // distance only (which is implied by the route they connect to anyway).
    if (!node.discovered) {
      const rows = [];
      if (cur) {
        const dx = node.position.x - cur.position.x;
        const dy = node.position.y - cur.position.y;
        const d = Math.round(Math.sqrt(dx * dx + dy * dy));
        rows.push(`<div class="big-map-tooltip-row"><span class="label">Distance</span><span>${d} u</span></div>`);
      }
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Status</span><span class="tag-undiscovered">Uncharted</span></div>`);
      return `<div class="big-map-tooltip-name tag-undiscovered">${FOG_UNKNOWN_LABEL}</div>${rows.join('')}<div class="big-map-tooltip-desc">${esc(FOG_UNKNOWN_DESC)}</div>`;
    }

    const rows = [];
    // Distance from current island
    if (cur && !isCurrent) {
      const dx = node.position.x - cur.position.x;
      const dy = node.position.y - cur.position.y;
      const d = Math.round(Math.sqrt(dx * dx + dy * dy));
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Distance</span><span>${d} u</span></div>`);
    } else if (isCurrent) {
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Status</span><span class="tag-home">Docked here</span></div>`);
    }
    if (node.portType && node.portType !== 'none') {
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Port</span><span>${esc(String(node.portType))}</span></div>`);
    }
    if (node.treasureLevel != null) {
      const labels = ['None', 'Modest', 'Rich', 'Legendary'];
      const lbl = labels[node.treasureLevel] ?? `Tier ${node.treasureLevel}`;
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Treasure</span><span>${esc(lbl)}</span></div>`);
    }
    if (node.hazard && node.hazard !== 'none') {
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Hazard</span><span class="tag-danger">${esc(String(node.hazard))}</span></div>`);
    }
    if (node.faction && node.faction !== 'neutral') {
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Faction</span><span>${esc(String(node.faction))}</span></div>`);
    }
    const tags = [];
    if (isHome) tags.push('<span class="tag-home">Home Port</span>');
    if (node.dangerous) tags.push('<span class="tag-danger">Dangerous</span>');
    if (node.appealing) tags.push('<span class="tag-safe">Safe</span>');
    if (tags.length) {
      rows.push(`<div class="big-map-tooltip-row"><span class="label">Tags</span><span>${tags.join(' · ')}</span></div>`);
    }
    const desc = node.description ? `<div class="big-map-tooltip-desc">${esc(String(node.description))}</div>` : '';
    const name = esc(node.name || `Island ${node.id}`);
    return `<div class="big-map-tooltip-name">${name}</div>${rows.join('')}${desc}`;
  }
}
