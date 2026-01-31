/**
 * Island map editor — brush-based elevation editing
 * Raycasts onto terrain mesh, modifies height map within brush radius
 */

import * as THREE from 'three';

export class IslandEditor {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isEditing = false;
    this.brushMode = 'raise'; // 'raise' | 'lower' | 'flatten'
    this.brushRadius = 0.05;
    this.brushStrength = 0.02;
    this.heightMap = null;
    this.gridSize = 0;
    this._boundHandleMouse = this._handleMouse.bind(this);
  }

  /**
   * Set the height map to edit (2D array)
   */
  setHeightMap(heightMap) {
    this.heightMap = heightMap ? heightMap.map(row => [...row]) : null;
    this.gridSize = this.heightMap ? this.heightMap.length - 1 : 0;
  }

  getHeightMap() {
    return this.heightMap;
  }

  setBrushRadius(radius) {
    this.brushRadius = Math.max(0.01, Math.min(0.3, radius));
  }

  setBrushStrength(strength) {
    this.brushStrength = Math.max(0.001, Math.min(0.2, strength));
  }

  setBrushMode(mode) {
    this.brushMode = mode;
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
  }

  _handleMouse(e) {
    if (!this.heightMap || !this.visualizer.getMesh()) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (e.type === 'mouseup' || e.type === 'mouseleave') {
      return;
    }

    if (e.type === 'mousedown' || (e.type === 'mousemove' && e.buttons === 1)) {
      this._applyBrush();
    }
  }

  _applyBrush() {
    const mesh = this.visualizer.getMesh();
    if (!mesh || !this.heightMap) return;

    this.raycaster.setFromCamera(this.mouse, this.visualizer.getCamera());
    const intersects = this.raycaster.intersectObject(mesh);

    if (intersects.length === 0) return;

    const hit = intersects[0];
    const point = hit.point.clone();
    mesh.worldToLocal(point);

    // PlaneGeometry: x,y in [-0.5,0.5]; mesh rotated -90 on X so plane lies in XZ
    const u = (point.x + 0.5);
    const v = (point.y + 0.5);

    if (u < 0 || u > 1 || v < 0 || v > 1) return;

    const gridSize = this.gridSize;
    const size = 1;
    const cellSize = size / gridSize;

    const centerX = u * gridSize;
    const centerY = v * gridSize;
    const radiusCells = this.brushRadius / cellSize;

    let modified = false;
    for (let dy = -Math.ceil(radiusCells); dy <= Math.ceil(radiusCells); dy++) {
      for (let dx = -Math.ceil(radiusCells); dx <= Math.ceil(radiusCells); dx++) {
        const gx = Math.round(centerX + dx);
        const gy = Math.round(centerY + dy);
        if (gx < 0 || gx > gridSize || gy < 0 || gy > gridSize) continue;

        const dist = Math.sqrt(dx * dx + dy * dy) / radiusCells;
        if (dist > 1) continue;

        const falloff = 1 - dist * dist;
        const amount = this.brushStrength * falloff;

        let newH = this.heightMap[gy][gx];
        if (this.brushMode === 'raise') {
          newH = Math.min(2, newH + amount);
        } else if (this.brushMode === 'lower') {
          newH = Math.max(0, newH - amount);
        } else if (this.brushMode === 'flatten') {
          newH = newH + (0.2 - newH) * amount * 5;
        }
        this.heightMap[gy][gx] = newH;
        modified = true;
      }
    }

    if (modified) {
      this.visualizer.updateFromHeightMap(this.heightMap);
    }
  }
}
