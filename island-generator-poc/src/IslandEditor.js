/**
 * Island map editor — tile-based elevation editing
 * Brush snaps to tile grid; size in tiles (1×1, 2×2, 3×3) for building placement
 */

import * as THREE from 'three';

/** Elevation band heights (0–1) for level presets */
export const ELEVATION_LEVELS = {
  sea: 0.12,
  beach: 0.2,
  grass: 0.35,
  rock: 0.55,
  snow: 0.75,
};

export class IslandEditor {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isEditing = false;
    this.brushMode = 'raise';
    this.brushSizeInTiles = 1; // 1, 2, or 3
    this.brushStrength = 0.02;
    this.brushTargetHeight = 0.35;
    this.heightMap = null;
    this.gridSize = 0;
    this.tileSize = 8;
    this.tilesX = 0;
    this.tilesY = 0;
    this.seaLevel = 0.12;
    this._boundHandleMouse = this._handleMouse.bind(this);
    this.onHeightAtCursor = null;
    this.onBeforeBrush = null;
    this.onHoverTile = null; // callback({ t0x, t0y, t1x, t1y, x0, y0, x1, y1 }) or null
    this.applyOnClickOnly = false; // true = apply only on mousedown, not while dragging
    this.canPaint = null; // () => boolean; when set, brush only applies if true (e.g. when Space not held)
  }

  setHeightMap(heightMap) {
    this.heightMap = heightMap ? heightMap.map(row => [...row]) : null;
    this.gridSize = this.heightMap ? this.heightMap.length - 1 : 0;
  }

  setTileConfig(tileSize, tilesX, tilesY) {
    this.tileSize = tileSize || 8;
    this.tilesX = tilesX || Math.floor(this.gridSize / this.tileSize);
    this.tilesY = tilesY || Math.floor(this.gridSize / this.tileSize);
  }

  getHeightMap() {
    return this.heightMap;
  }

  setBrushSizeInTiles(size) {
    this.brushSizeInTiles = Math.max(1, Math.min(5, size));
  }

  setBrushStrength(strength) {
    this.brushStrength = Math.max(0.001, Math.min(0.2, strength));
  }

  setBrushMode(mode) {
    this.brushMode = mode;
  }

  setBrushTargetHeight(height) {
    this.brushTargetHeight = Math.max(0, Math.min(1, height));
  }

  setSeaLevel(level) {
    this.seaLevel = level;
  }

  setApplyOnClickOnly(enabled) {
    this.applyOnClickOnly = !!enabled;
  }

  setCanPaint(fn) {
    this.canPaint = typeof fn === 'function' ? fn : null;
  }

  enable(domElement) {
    this.domElement = domElement;
    domElement.addEventListener('mousedown', this._boundHandleMouse);
    domElement.addEventListener('mousemove', this._boundHandleMouse);
    domElement.addEventListener('mouseup', this._boundHandleMouse);
    domElement.addEventListener('mouseleave', this._boundHandleMouse);
    this.isEditing = true;
  }

  disable() {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this._boundHandleMouse);
      this.domElement.removeEventListener('mousemove', this._boundHandleMouse);
      this.domElement.removeEventListener('mouseup', this._boundHandleMouse);
      this.domElement.removeEventListener('mouseleave', this._boundHandleMouse);
    }
    this.isEditing = false;
    if (this.onHeightAtCursor) this.onHeightAtCursor(null);
    if (this.onHoverTile) this.onHoverTile(null);
  }

  _handleMouse(e) {
    if (!this.heightMap || !this.visualizer.getMesh()) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (e.type === 'mouseup' || e.type === 'mouseleave') {
      if (e.type === 'mouseleave') {
        if (this.onHeightAtCursor) this.onHeightAtCursor(null);
        if (this.onHoverTile) this.onHoverTile(null);
      }
      return;
    }

    if (e.type === 'mousemove') {
      const info = this._getTileAtCursor();
      const h = info ? this.heightMap[info.gy][info.gx] : null;
      if (this.onHeightAtCursor) this.onHeightAtCursor(h);
      if (this.onHoverTile && info) {
        const size = this.brushSizeInTiles;
        const ts = this.tileSize;
        const half = Math.floor(size / 2);
        const t0x = Math.max(0, info.tx - half);
        const t0y = Math.max(0, info.ty - half);
        const t1x = Math.min(this.tilesX, info.tx - half + size);
        const t1y = Math.min(this.tilesY, info.ty - half + size);
        const x0 = t0x * ts;
        const y0 = t0y * ts;
        const x1 = Math.min(this.gridSize + 1, t1x * ts + 1);
        const y1 = Math.min(this.gridSize + 1, t1y * ts + 1);
        this.onHoverTile({ t0x, t0y, t1x, t1y, x0, y0, x1, y1 });
      } else if (this.onHoverTile) {
        this.onHoverTile(null);
      }
      if (e.buttons === 1 && !this.applyOnClickOnly && (!this.canPaint || this.canPaint())) this._applyBrush(false);
      return;
    }

    if (e.type === 'mousedown' && e.buttons === 1 && (!this.canPaint || this.canPaint())) {
      this._applyBrush(true);
    }
  }

  _getTileAtCursor() {
    const mesh = this.visualizer.getMesh();
    if (!mesh || !this.heightMap) return null;

    this.raycaster.setFromCamera(this.mouse, this.visualizer.getCamera());
    this.raycaster.layers.set(0); // Only hit terrain (overlay is on layer 1)
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
    const gx = Math.min(this.gridSize, Math.max(0, Math.round(u * this.gridSize)));
    const gy = Math.min(this.gridSize, Math.max(0, Math.round(v * this.gridSize)));

    return { tx, ty, gx, gy };
  }

  _getHeightAtCursor() {
    const info = this._getTileAtCursor();
    if (!info) return null;
    return this.heightMap[info.gy][info.gx];
  }

  _applyBrush(isStrokeStart = false) {
    const mesh = this.visualizer.getMesh();
    if (!mesh || !this.heightMap) return;

    const info = this._getTileAtCursor();
    if (!info) return;

    const { tx, ty } = info;
    const size = this.brushSizeInTiles;
    const ts = this.tileSize;
    const half = Math.floor(size / 2);

    const t0x = Math.max(0, tx - half);
    const t0y = Math.max(0, ty - half);
    const t1x = Math.min(this.tilesX, tx - half + size);
    const t1y = Math.min(this.tilesY, ty - half + size);

    const x0 = t0x * ts;
    const y0 = t0y * ts;
    const x1 = Math.min(this.gridSize + 1, t1x * ts + 1);
    const y1 = Math.min(this.gridSize + 1, t1y * ts + 1);

    // Plateau: use height at cursor (click point), not center of brush
    const plateauTarget = this.brushMode === 'plateau'
      ? this.heightMap[info.gy][info.gx]
      : null;

    if (isStrokeStart && this.onBeforeBrush) this.onBeforeBrush();

    let modified = false;

    if (this.brushMode === 'smooth') {
      // Smooth: Laplacian-style — average with neighbors (only land vertices)
      const temp = this.heightMap.map(row => [...row]);
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          if (y > this.gridSize || x > this.gridSize) continue;
          let sum = 0, count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx, ny = y + dy;
              if (nx >= 0 && nx <= this.gridSize && ny >= 0 && ny <= this.gridSize) {
                sum += this.heightMap[ny][nx];
                count++;
              }
            }
          }
          const avg = count > 0 ? sum / count : this.heightMap[y][x];
          const blend = this.brushStrength * 5;
          temp[y][x] = Math.max(0, Math.min(2, this.heightMap[y][x] + (avg - this.heightMap[y][x]) * blend));
          modified = true;
        }
      }
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          if (y <= this.gridSize && x <= this.gridSize) this.heightMap[y][x] = temp[y][x];
        }
      }
    } else {
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          if (y > this.gridSize || x > this.gridSize) continue;

          let newH = this.heightMap[y][x];
          if (this.brushMode === 'raise') {
            newH = Math.min(2, newH + this.brushStrength);
          } else if (this.brushMode === 'lower') {
            newH = Math.max(0, newH - this.brushStrength);
          } else if (this.brushMode === 'flatten') {
            newH = newH + (this.brushTargetHeight - newH) * this.brushStrength * 5;
          } else if (this.brushMode === 'absolute') {
            newH = newH + (this.brushTargetHeight - newH) * this.brushStrength * 10;
            newH = Math.max(0, Math.min(2, newH));
          } else if (this.brushMode === 'set') {
            newH = this.brushTargetHeight;
          } else if (this.brushMode === 'plateau' && plateauTarget != null) {
            newH = newH + (plateauTarget - newH) * this.brushStrength * 8;
            newH = Math.max(0, Math.min(2, newH));
          }
          this.heightMap[y][x] = newH;
          modified = true;
        }
      }
    }

    if (modified) {
      this.visualizer.updateFromHeightMap(this.heightMap);
    }
  }
}
