/**
 * Island building placer — place, remove, rotate buildings on tile grid
 * Validates land (height > sea level) and no overlap
 */

import * as THREE from 'three';
import { BUILDING_TYPES, getBuildingType, getEffectiveBuildingSize, getBuildingSizeFromObject, canPlaceOverWater } from './BuildingTypes.js';
import { isPlacementConnected } from './IslandPathfinder.js';

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
    this.onPlacementHover = null;   // (tx, ty, isValid, isConnected) => void — hover over empty tile
    this.onConnectivityWarning = null; // () => void — called when placing isolated building
    this.connectivityCheckEnabled = true; // Phase G: optional validation toggle
    this.onBuildingHover = null;   // (building | null) => void — hover over building
    this.onBuildingSelect = null;  // (building | null) => void — click to select building
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

  /** @param {Object[]} buildings @param {{ shared?: boolean }} [opts] shared = use same refs (for selection-only mode) */
  setBuildings(buildings, opts = {}) {
    this.buildings = Array.isArray(buildings)
      ? (opts.shared ? buildings : buildings.map(b => ({ ...b })))
      : [];
  }

  getBuildings() {
    return this.buildings.map(b => ({ ...b }));
  }

  /**
   * Phase G: Get set of viable tile keys "tx,ty" where selected building can be placed.
   * Used for building zone hints overlay.
   * @returns {Set<string>}
   */
  getViableTiles() {
    const out = new Set();
    if (!this.heightMap || !this.tilesX || !this.tilesY) return out;
    const type = this.selectedType;
    for (let ty = 0; ty < this.tilesY; ty++) {
      for (let tx = 0; tx < this.tilesX; tx++) {
        if (this._canPlace(type, tx, ty)) out.add(`${tx},${ty}`);
      }
    }
    return out;
  }

  setSelectedType(type) {
    if (BUILDING_TYPES[type]) this.selectedType = type;
  }

  /** @param {HTMLElement} domElement @param {{ selectionOnly?: boolean }} [opts] */
  enable(domElement, opts = {}) {
    this.domElement = domElement;
    this._selectionOnly = !!opts.selectionOnly;
    domElement.addEventListener('mousedown', this._boundHandleMouse);
    domElement.addEventListener('mousemove', this._boundHandleMouseMove);
    this.isPlacing = !this._selectionOnly;
  }

  disable() {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this._boundHandleMouse);
      this.domElement.removeEventListener('mousemove', this._boundHandleMouseMove);
    }
    this.isPlacing = false;
    this._selectionOnly = false;
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
      if (!this._selectionOnly) {
        const canPlace = this._canPlace(this.selectedType, tx, ty);
        let isConnected = true;
        if (canPlace && this.connectivityCheckEnabled && this.buildings.length > 0) {
          const cfg = {
            tileSize: this.tileSize,
            tilesX: this.tilesX,
            tilesY: this.tilesY,
            seaLevel: this.seaLevel,
          };
          isConnected = isPlacementConnected(this.selectedType, tx, ty, this.buildings, this.heightMap, cfg);
        }
        if (this.onPlacementHover) this.onPlacementHover(tx, ty, canPlace, isConnected);
      } else if (this.onPlacementHover) {
        this.onPlacementHover(null, null, false, true);
      }
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
   * Flatten terrain under a region (chunkX, chunkY, width, height).
   * Modifies this.heightMap in place and calls onHeightMapChange with a copy.
   * @param {number} chunkX @param {number} chunkY @param {number} w @param {number} h @param {string} type
   */
  flattenRegion(chunkX, chunkY, w, h, type) {
    const def = getBuildingType(type);
    if (!def || !this.heightMap) return;
    const ts = this.tileSize;
    const gridSize = this.heightMap.length - 1;
    const x0 = Math.max(0, chunkX * ts);
    const y0 = Math.max(0, chunkY * ts);
    const x1 = Math.min(gridSize, (chunkX + w) * ts);
    const y1 = Math.min(gridSize, (chunkY + h) * ts);

    let sum = 0;
    let landCount = 0;
    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        const val = this.heightMap[gy]?.[gx] ?? 0;
        if (val > this.seaLevel) {
          sum += val;
          landCount++;
        }
      }
    }
    const avg = landCount > 0 ? sum / landCount : this.seaLevel + 0.02;
    const dockHeight = this.seaLevel + 0.02;

    for (let gy = y0; gy <= y1; gy++) {
      for (let gx = x0; gx <= x1; gx++) {
        if (!this.heightMap[gy]) continue;
        const val = this.heightMap[gy][gx] ?? 0;
        if (canPlaceOverWater(type) && val <= this.seaLevel) {
          this.heightMap[gy][gx] = dockHeight;
        } else {
          this.heightMap[gy][gx] = avg;
        }
      }
    }
    if (this.onHeightMapChange) {
      this.onHeightMapChange(this.heightMap.map(row => [...row]));
    }
  }

  /**
   * Flatten terrain under building footprint using type default size.
   */
  _flattenUnderBuilding(type, chunkX, chunkY) {
    const size = getEffectiveBuildingSize(type);
    this.flattenRegion(chunkX, chunkY, size.width, size.height, type);
  }

  /**
   * Check if a footprint (chunkX, chunkY, width, height) is valid: no overlap with other buildings, on land.
   * @param {number} chunkX @param {number} chunkY @param {number} w @param {number} h @param {string} type
   * @param {{ chunkX: number, chunkY: number }} excludeBuilding Building to exclude from overlap check (for editing)
   */
  canPlaceAtFootprint(chunkX, chunkY, w, h, type, excludeBuilding = null) {
    const overWater = canPlaceOverWater(type);
    if (!overWater && (chunkX + w > this.tilesX || chunkY + h > this.tilesY || chunkX < 0 || chunkY < 0)) return false;
    const ts = this.tileSize;
    let landTiles = 0;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const tx = chunkX + dx;
        const ty = chunkY + dy;
        if (tx < 0 || tx >= this.tilesX || ty < 0 || ty >= this.tilesY) continue;
        const gx = Math.min(this.gridSize, tx * ts);
        const gy = Math.min(this.gridSize, ty * ts);
        const hVal = this.heightMap[gy]?.[gx] ?? 0;
        if (hVal > this.seaLevel) landTiles++;
        else if (!overWater) return false;
      }
    }
    if (landTiles === 0) return false;
    if (overWater && (chunkX + w <= 0 || chunkY + h <= 0 || chunkX >= this.tilesX || chunkY >= this.tilesY)) return false;
    for (const b of this.buildings) {
      if (excludeBuilding && b.chunkX === excludeBuilding.chunkX && b.chunkY === excludeBuilding.chunkY) continue;
      const bSize = getBuildingSizeFromObject(b);
      const bx1 = b.chunkX + bSize.width;
      const by1 = b.chunkY + bSize.height;
      if (chunkX < bx1 && chunkX + w > b.chunkX && chunkY < by1 && chunkY + h > b.chunkY) return false;
    }
    return true;
  }

  _canPlace(type, chunkX, chunkY) {
    const def = getBuildingType(type);
    if (!def) return false;
    const size = getEffectiveBuildingSize(type);
    const w = size.width;
    const h = size.height;
    const overWater = canPlaceOverWater(type);
    if (!overWater && (chunkX + w > this.tilesX || chunkY + h > this.tilesY || chunkX < 0 || chunkY < 0)) return false;

    const ts = this.tileSize;
    let landTiles = 0;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const tx = chunkX + dx;
        const ty = chunkY + dy;
        if (tx < 0 || tx >= this.tilesX || ty < 0 || ty >= this.tilesY) continue;
        const gx = Math.min(this.gridSize, tx * ts);
        const gy = Math.min(this.gridSize, ty * ts);
        const hVal = this.heightMap[gy]?.[gx] ?? 0;
        if (hVal > this.seaLevel) landTiles++;
        else if (!overWater) return false;
      }
    }
    if (landTiles === 0) return false;
    if (overWater && (chunkX + w <= 0 || chunkY + h <= 0 || chunkX >= this.tilesX || chunkY >= this.tilesY)) return false;

    for (const b of this.buildings) {
      const bSize = getBuildingSizeFromObject(b);
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
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (this._selectionOnly) {
        if (this.onBuildingSelect) this.onBuildingSelect(existing);
      } else if (e.shiftKey) {
        this.buildings = this.buildings.filter(b => b !== existing);
      } else {
        const def = getBuildingType(existing.type);
        if (def) {
          const rots = [0, 90, 180, 270];
          const idx = rots.indexOf(existing.rotation ?? 0);
          existing.rotation = rots[(idx + 1) % 4];
        }
        if (this.onBuildingSelect) this.onBuildingSelect(existing);
      }
    } else {
      if (!this._selectionOnly) {
        const def = getBuildingType(this.selectedType);
        if (def && this._canPlace(this.selectedType, tx, ty)) {
          if (this.connectivityCheckEnabled && this.buildings.length > 0) {
            const cfg = { tileSize: this.tileSize, tilesX: this.tilesX, tilesY: this.tilesY, seaLevel: this.seaLevel };
            if (!isPlacementConnected(this.selectedType, tx, ty, this.buildings, this.heightMap, cfg)) {
              if (this.onConnectivityWarning) this.onConnectivityWarning();
            }
          }
          this._flattenUnderBuilding(this.selectedType, tx, ty);
          const size = getEffectiveBuildingSize(this.selectedType);
          const cargoSize = size.width * size.height * 10;
          this.buildings.push({
            id: 'b' + Date.now(),
            type: this.selectedType,
            chunkX: tx,
            chunkY: ty,
            rotation: 0,
            width: size.width,
            height: size.height,
            cargoSize,
          });
        }
      }
    }
    if (!this._selectionOnly) {
      this.visualizer.renderBuildings(this.buildings, this.heightMap, this.tileSize, this.tilesX, this.tilesY);
      if (this.onBuildingsChange) this.onBuildingsChange(this.getBuildings());
    }
  }
}
