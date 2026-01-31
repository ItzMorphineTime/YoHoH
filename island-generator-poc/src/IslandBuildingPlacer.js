/**
 * Island building placer — place, remove, rotate buildings on tile grid
 * Validates land (height > sea level) and no overlap
 */

import * as THREE from 'three';
import { BUILDING_TYPES, getBuildingType, getEffectiveBuildingSize } from './BuildingTypes.js';

export class IslandBuildingPlacer {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.buildings = [];
    this.heightMap = null;
    this.gridSize = 0;
    this.tileSize = 8;
    this.tilesX = 0;
    this.tilesY = 0;
    this.seaLevel = 0.12;
    this.selectedType = 'tavern';
    this.isPlacing = false;
    this.domElement = null;
    this._boundHandleMouse = this._handleMouse.bind(this);
    this.onBuildingsChange = null;
    this.onHeightMapChange = null; // (newHeightMap) => void — called after flattening terrain
    this.onPlacementHover = null;   // (tx, ty, isValid) => void — hover over empty tile
    this.onBuildingHover = null;   // (building | null) => void — hover over building
    this._boundHandleMouseMove = this._handleMouseMove.bind(this);
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

  setBuildings(buildings) {
    this.buildings = Array.isArray(buildings) ? buildings.map(b => ({ ...b })) : [];
  }

  getBuildings() {
    return this.buildings.map(b => ({ ...b }));
  }

  setSelectedType(type) {
    if (BUILDING_TYPES[type]) this.selectedType = type;
  }

  enable(domElement) {
    this.domElement = domElement;
    domElement.addEventListener('mousedown', this._boundHandleMouse);
    domElement.addEventListener('mousemove', this._boundHandleMouseMove);
    this.isPlacing = true;
  }

  disable() {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this._boundHandleMouse);
      this.domElement.removeEventListener('mousemove', this._boundHandleMouseMove);
    }
    this.isPlacing = false;
    if (this.onPlacementHover) this.onPlacementHover(null, null, false);
    if (this.onBuildingHover) this.onBuildingHover(null);
  }

  _updateMouseFromEvent(e) {
    if (!this.domElement) return;
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _handleMouseMove(e) {
    if (!this.heightMap || !this.visualizer.getMesh() || !this.domElement) return;
    this._updateMouseFromEvent(e);

    const info = this._getTileAtCursor();
    if (!info) {
      if (this.onPlacementHover) this.onPlacementHover(null, null, false);
      if (this.onBuildingHover) this.onBuildingHover(null);
      return;
    }

    const { tx, ty } = info;
    const existing = this._getBuildingAtTile(tx, ty);
    if (existing) {
      if (this.onPlacementHover) this.onPlacementHover(null, null, false);
      if (this.onBuildingHover) this.onBuildingHover(existing);
    } else {
      const canPlace = this._canPlace(this.selectedType, tx, ty);
      if (this.onPlacementHover) this.onPlacementHover(tx, ty, canPlace);
      if (this.onBuildingHover) this.onBuildingHover(null);
    }
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

  _getBuildingAtTile(tx, ty) {
    for (const b of this.buildings) {
      const size = getEffectiveBuildingSize(b.type);
      const w = size.width;
      const h = size.height;
      if (tx >= b.chunkX && tx < b.chunkX + w && ty >= b.chunkY && ty < b.chunkY + h) {
        return b;
      }
    }
    return null;
  }

  /**
   * Flatten terrain under building footprint to average height.
   * Modifies this.heightMap in place and calls onHeightMapChange with a copy.
   */
  _flattenUnderBuilding(type, chunkX, chunkY) {
    const def = getBuildingType(type);
    if (!def || !this.heightMap) return;
    const size = getEffectiveBuildingSize(type);
    const w = size.width;
    const h = size.height;
    const ts = this.tileSize;
    const gridSize = this.heightMap.length - 1;
    const x0 = Math.max(0, chunkX * ts);
    const y0 = Math.max(0, chunkY * ts);
    const x1 = Math.min(gridSize, (chunkX + w) * ts);
    const y1 = Math.min(gridSize, (chunkY + h) * ts);

    let sum = 0;
    let count = 0;
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const val = this.heightMap[gy]?.[gx] ?? 0;
        sum += val;
        count++;
      }
    }
    if (count === 0) return;
    const avg = sum / count;

    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        if (this.heightMap[gy]) this.heightMap[gy][gx] = avg;
      }
    }
    if (this.onHeightMapChange) {
      this.onHeightMapChange(this.heightMap.map(row => [...row]));
    }
  }

  _canPlace(type, chunkX, chunkY) {
    const def = getBuildingType(type);
    if (!def) return false;
    const size = getEffectiveBuildingSize(type);
    const w = size.width;
    const h = size.height;
    if (chunkX + w > this.tilesX || chunkY + h > this.tilesY || chunkX < 0 || chunkY < 0) return false;

    const ts = this.tileSize;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const gx = Math.min(this.gridSize, (chunkX + dx) * ts);
        const gy = Math.min(this.gridSize, (chunkY + dy) * ts);
        const hVal = this.heightMap[gy]?.[gx] ?? 0;
        if (hVal <= this.seaLevel) return false;
      }
    }

    for (const b of this.buildings) {
      const bSize = getEffectiveBuildingSize(b.type);
      const bx1 = b.chunkX + bSize.width;
      const by1 = b.chunkY + bSize.height;
      if (chunkX < bx1 && chunkX + w > b.chunkX && chunkY < by1 && chunkY + h > b.chunkY) return false;
    }
    return true;
  }

  _handleMouse(e) {
    if (e.type !== 'mousedown' || e.buttons !== 1) return;
    if (!this.heightMap || !this.visualizer.getMesh() || !this.domElement) return;

    this._updateMouseFromEvent(e);
    const info = this._getTileAtCursor();
    if (!info) return;

    const { tx, ty } = info;
    const existing = this._getBuildingAtTile(tx, ty);
    if (existing) {
      if (e.shiftKey) {
        this.buildings = this.buildings.filter(b => b !== existing);
      } else {
        const def = getBuildingType(existing.type);
        if (def) {
          const rots = [0, 90, 180, 270];
          const idx = rots.indexOf(existing.rotation ?? 0);
          existing.rotation = rots[(idx + 1) % 4];
        }
      }
    } else {
      const def = getBuildingType(this.selectedType);
      if (def && this._canPlace(this.selectedType, tx, ty)) {
        this._flattenUnderBuilding(this.selectedType, tx, ty);
        const id = 'b' + Date.now();
        this.buildings.push({ id, type: this.selectedType, chunkX: tx, chunkY: ty, rotation: 0 });
      }
    }
    this.visualizer.renderBuildings(this.buildings, this.heightMap, this.tileSize, this.tilesX, this.tilesY);
    if (this.onBuildingsChange) this.onBuildingsChange(this.getBuildings());
  }
}
