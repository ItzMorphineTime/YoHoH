/**
 * Island prop placer — place, remove, rotate props on tile grid
 * Props are 1×1; land only; no terrain flattening; cannot overlap buildings
 */

import * as THREE from 'three';
import { PROP_TYPES, getPropType } from './PropTypes.js';
import { getBuildingSizeFromObject } from './BuildingTypes.js';

export class IslandPropPlacer {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.props = [];
    this.buildings = [];
    this.heightMap = null;
    this.gridSize = 0;
    this.tileSize = 8;
    this.tilesX = 0;
    this.tilesY = 0;
    this.seaLevel = 0.12;
    this.selectedType = 'rock_01';
    this.domElement = null;
    this._boundHandleMouse = this._handleMouse.bind(this);
    this._boundHandleMouseMove = this._handleMouseMove.bind(this);
    this._hoverRafId = null;
    this._lastHoverProp = null;
    this.onPropsChange = null;
    this.onPlacementHover = null;
    this.onPropHover = null;
    this.onPropSelect = null;
  }

  setHeightMap(heightMap) {
    this.heightMap = heightMap ? heightMap.map(row => [...row]) : null;
    this.gridSize = this.heightMap ? this.heightMap.length - 1 : 0;
  }

  setTileConfig(tileSize, tilesX, tilesY) {
    this.tileSize = tileSize || 8;
    this.tilesX = tilesX ?? Math.floor(this.gridSize / this.tileSize);
    this.tilesY = tilesY ?? Math.floor(this.gridSize / this.tileSize);
  }

  setSeaLevel(level) {
    this.seaLevel = level ?? 0.12;
  }

  setProps(props) {
    this.props = Array.isArray(props) ? props.map(p => ({ ...p })) : [];
  }

  setBuildings(buildings) {
    this.buildings = Array.isArray(buildings) ? buildings : [];
  }

  getProps() {
    return this.props.map(p => ({ ...p }));
  }

  setSelectedType(type) {
    if (PROP_TYPES[type]) this.selectedType = type;
  }

  enable(domElement, opts = {}) {
    this.domElement = domElement;
    this._selectionOnly = !!opts.selectionOnly;
    domElement.addEventListener('mousedown', this._boundHandleMouse);
    domElement.addEventListener('mousemove', this._boundHandleMouseMove);
  }

  disable() {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this._boundHandleMouse);
      this.domElement.removeEventListener('mousemove', this._boundHandleMouseMove);
    }
    if (this._hoverRafId != null) {
      cancelAnimationFrame(this._hoverRafId);
      this._hoverRafId = null;
    }
    this._lastHoverProp = null;
    if (this.onPlacementHover) this.onPlacementHover(null, null, false);
    if (this.onPropHover) this.onPropHover(null);
  }

  _updateMouseFromEvent(e) {
    if (!this.domElement) return;
    // Use canvas rect (renderer.domElement) for correct NDC mapping — matches Three.js controls
    const canvas = this.visualizer.getRenderer?.()?.domElement;
    const rect = canvas?.getBoundingClientRect?.() ?? this.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _getTileAtCursor() {
    const mesh = this.visualizer.getMesh();
    if (!mesh || !this.heightMap) return null;

    this.raycaster.setFromCamera(this.mouse, this.visualizer.getCamera());
    this.raycaster.layers.set(0);
    const intersects = this.raycaster.intersectObject(mesh, false);
    if (intersects.length === 0) return null;

    const hit = intersects[0];
    let u, v;
    if (hit.uv) {
      u = Math.max(0, Math.min(1, hit.uv.x));
      v = Math.max(0, Math.min(1, 1 - hit.uv.y));
    } else {
      const point = hit.point.clone();
      mesh.worldToLocal(point);
      u = Math.max(0, Math.min(1, point.x + 0.5));
      v = Math.max(0, Math.min(1, 0.5 - point.y));
    }
    if (this.tilesX <= 0 || this.tilesY <= 0) return null;

    const tx = Math.min(this.tilesX - 1, Math.max(0, Math.floor(u * this.tilesX)));
    const ty = Math.min(this.tilesY - 1, Math.max(0, Math.floor(v * this.tilesY)));
    return { tx, ty };
  }

  _getPropAtTile(tx, ty) {
    for (const p of this.props) {
      if (p.chunkX === tx && p.chunkY === ty) return p;
    }
    return null;
  }

  _isBuildingTile(tx, ty) {
    for (const b of this.buildings) {
      const size = getBuildingSizeFromObject(b);
      const w = size.width, h = size.height;
      if (tx >= b.chunkX && tx < b.chunkX + w && ty >= b.chunkY && ty < b.chunkY + h) return true;
    }
    return false;
  }

  _canPlaceProp(tx, ty) {
    if (tx < 0 || tx >= this.tilesX || ty < 0 || ty >= this.tilesY) return false;
    if (this._isBuildingTile(tx, ty)) return false;
    const gx = Math.min(this.gridSize, tx * this.tileSize);
    const gy = Math.min(this.gridSize, ty * this.tileSize);
    const h = this.heightMap[gy]?.[gx] ?? 0;
    return h > this.seaLevel;
  }

  _handleMouseMove(e) {
    if (!this.heightMap || !this.visualizer.getMesh() || !this.domElement) return;
    this._updateMouseFromEvent(e);
    if (this._hoverRafId != null) return;
    this._hoverRafId = requestAnimationFrame(() => {
      this._hoverRafId = null;
      this._processHover();
    });
  }

  _processHover() {
    if (!this.heightMap || !this.visualizer.getMesh() || !this.domElement) return;
    const hitProp = this.visualizer.pickPropAt?.(this.mouse) ?? null;
    const existing = hitProp ?? (() => {
      const info = this._getTileAtCursor();
      if (!info) return null;
      return this._getPropAtTile(info.tx, info.ty);
    })();
    if (existing === this._lastHoverProp) return;
    this._lastHoverProp = existing;

    if (!existing) {
      const info = this._getTileAtCursor();
      if (!info) {
        if (this.onPlacementHover) this.onPlacementHover(null, null, false);
        if (this.onPropHover) this.onPropHover(null);
        return;
      }
      const { tx, ty } = info;
      const canPlace = this._canPlaceProp(tx, ty);
      if (this.onPlacementHover) this.onPlacementHover(tx, ty, canPlace);
      if (this.onPropHover) this.onPropHover(null);
    } else {
      if (this.onPlacementHover) this.onPlacementHover(null, null, false);
      if (this.onPropHover) this.onPropHover(existing);
    }
  }

  _handleMouse(e) {
    if (e.type !== 'mousedown' || e.buttons !== 1) return;
    if (!this.heightMap || !this.visualizer.getMesh() || !this.domElement) return;

    this._updateMouseFromEvent(e);
    // Prefer direct prop hit (raycast) over tile-based lookup
    const hitProp = this.visualizer.pickPropAt?.(this.mouse) ?? null;
    const existing = hitProp ?? (() => {
      const info = this._getTileAtCursor();
      if (!info) return null;
      return this._getPropAtTile(info.tx, info.ty);
    })();
    let propsChanged = false;
    if (existing) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.shiftKey) {
        this.props = this.props.filter(p => p !== existing);
        propsChanged = true;
      } else {
        if (this.onPropSelect) this.onPropSelect(existing);
      }
    } else if (!this._selectionOnly) {
      const info = this._getTileAtCursor();
      if (!info) return;
      const { tx, ty } = info;
      const def = getPropType(this.selectedType);
      if (def && this._canPlaceProp(tx, ty)) {
        const defaultScale = def.defaultScale ?? 1;
        this.props.push({
          id: 'p' + Date.now(),
          type: this.selectedType,
          chunkX: tx,
          chunkY: ty,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          offsetZ: 0,
          scale: defaultScale,
        });
        propsChanged = true;
      }
    }
    if (propsChanged) {
      this.visualizer.renderProps(this.props, this.heightMap, this.tileSize, this.tilesX, this.tilesY);
      if (this.onPropsChange) this.onPropsChange(this.getProps());
    }
  }
}
