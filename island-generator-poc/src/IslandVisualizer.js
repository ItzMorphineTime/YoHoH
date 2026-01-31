/**
 * Island terrain mesh visualizer — Three.js 3D renderer
 * Converts height map to deformed PlaneGeometry with elevation-based vertex colors
 */

import * as THREE from 'three';
import { MOUSE } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** Vertex colors by elevation band (hex) */
const ELEVATION_COLORS = {
  water: 0x3b82f6,
  beach: 0xfef3c7,
  grass: 0x4a7c59,
  rock: 0x6b7280,
  snow: 0xf0f9ff,
};

function heightToColor(height, seaLevel) {
  if (height <= seaLevel) return ELEVATION_COLORS.water;
  const h = (height - seaLevel) / (1.2 - seaLevel);
  if (h < 0.12) return ELEVATION_COLORS.beach;
  if (h < 0.4) return ELEVATION_COLORS.grass;
  if (h < 0.7) return ELEVATION_COLORS.rock;
  return ELEVATION_COLORS.snow;
}

function hexToRgb(hex) {
  return [
    ((hex >> 16) & 0xff) / 255,
    ((hex >> 8) & 0xff) / 255,
    (hex & 0xff) / 255,
  ];
}

export class IslandVisualizer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.islandMesh = null;
    this.waterMesh = null;
    this.hoverOverlayMesh = null;
    this._inputMode = 'view';
    this._spaceHeld = false;
    this.ambientLight = null;
    this.directionalLight = null;
    this.config = {
      waterColor: 0x2563eb,
      wireframe: false,
      showWater: true,
      heightScale: 1,
      useVertexColors: true,
      seaLevel: 0.12,
    };
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    this.camera.position.set(1.5, 1.2, 1.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 8;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    this.directionalLight.position.set(2, 4, 2);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(this.directionalLight);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Build island mesh from height map with elevation-based vertex colors
   * @param {{ heightMap: number[][], config: Object }} island
   */
  render(island) {
    if (!island?.heightMap) return;

    if (this.hoverOverlayMesh) {
      if (this.islandMesh) this.islandMesh.remove(this.hoverOverlayMesh);
      this.hoverOverlayMesh.geometry.dispose();
      this.hoverOverlayMesh.material.dispose();
      this.hoverOverlayMesh = null;
    }
    if (this.islandMesh) {
      this.scene.remove(this.islandMesh);
      this.islandMesh.geometry.dispose();
      this.islandMesh.material.dispose();
    }
    if (this.waterMesh) {
      this.scene.remove(this.waterMesh);
      this.waterMesh.geometry.dispose();
      this.waterMesh.material.dispose();
    }

    const { heightMap, config } = island;
    const gridSize = config?.gridSize ?? heightMap.length - 1;
    const seaLevel = config?.seaLevel ?? this.config.seaLevel;
    this.config.seaLevel = seaLevel;

    const size = 1;
    const segments = gridSize;

    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geometry.attributes.position;
    const vertexCount = positions.count;

    const colors = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      const x = Math.floor(i % (segments + 1));
      const y = Math.floor(i / (segments + 1));
      const h = heightMap[y]?.[x] ?? 0;
      positions.setZ(i, h * this.config.heightScale);

      const color = heightToColor(h, seaLevel);
      const [r, g, b] = hexToRgb(color);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial({
      vertexColors: this.config.useVertexColors,
      flatShading: false,
      wireframe: this.config.wireframe,
    });

    this.islandMesh = new THREE.Mesh(geometry, material);
    this.islandMesh.rotation.x = -Math.PI / 2;
    this.islandMesh.receiveShadow = true;
    this.islandMesh.castShadow = true;
    this.scene.add(this.islandMesh);

    if (this.config.showWater) {
      const waterGeometry = new THREE.PlaneGeometry(size * 1.5, size * 1.5, 1, 1);
      const waterMaterial = new THREE.MeshLambertMaterial({
        color: this.config.waterColor,
        transparent: true,
        opacity: 0.75,
      });
      this.waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
      this.waterMesh.rotation.x = -Math.PI / 2;
      this.waterMesh.position.y = -0.02;
      this.scene.add(this.waterMesh);
    }
  }

  /**
   * Show or hide hover overlay for edit-mode brush preview.
   * Region: { x0, y0, x1, y1 } in grid coords, or null to hide.
   * Overlay follows terrain elevation for accurate placement.
   */
  setHoverOverlay(region, heightMap) {
    if (this.hoverOverlayMesh) {
      this.islandMesh?.remove(this.hoverOverlayMesh);
      this.hoverOverlayMesh.geometry.dispose();
      this.hoverOverlayMesh.material.dispose();
      this.hoverOverlayMesh = null;
    }
    if (!region || !heightMap || !this.islandMesh) return;

    const { x0, y0, x1, y1 } = region;
    const gridSize = heightMap.length - 1;
    const w = Math.max(1, x1 - x0);
    const h = Math.max(1, y1 - y0);
    const segX = Math.min(w, gridSize);
    const segY = Math.min(h, gridSize);
    const normW = (x1 - x0) / gridSize;
    const normH = (y1 - y0) / gridSize;

    const geometry = new THREE.PlaneGeometry(normW, normH, segX, segY);
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const gx = Math.min(gridSize, x0 + (i % (segX + 1)));
      const gy = Math.min(gridSize, y0 + Math.floor(i / (segX + 1)));
      const ht = heightMap[gy]?.[gx] ?? 0;
      positions.setZ(i, ht * this.config.heightScale + 0.012);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.5,
      depthTest: true,
      depthWrite: false,
    });

    this.hoverOverlayMesh = new THREE.Mesh(geometry, material);
    this.hoverOverlayMesh.layers.set(1); // Exclude from raycaster (terrain is layer 0)
    const centerX = (x0 + x1) / (2 * gridSize) - 0.5;
    const centerY = (y0 + y1) / (2 * gridSize) - 0.5;
    this.hoverOverlayMesh.position.set(centerX, centerY, 0);
    this.islandMesh.add(this.hoverOverlayMesh);
  }

  /**
   * Update mesh vertices and colors from modified height map (for editor)
   */
  updateFromHeightMap(heightMap) {
    if (!this.islandMesh || !heightMap) return;
    const positions = this.islandMesh.geometry.attributes.position;
    const colors = this.islandMesh.geometry.attributes.color;
    const gridSize = Math.sqrt(positions.count) - 1;
    const seaLevel = this.config.seaLevel;

    for (let i = 0; i < positions.count; i++) {
      const x = Math.floor(i % (gridSize + 1));
      const y = Math.floor(i / (gridSize + 1));
      const h = heightMap[y]?.[x] ?? 0;
      positions.setZ(i, h * this.config.heightScale);

      const color = heightToColor(h, seaLevel);
      const [r, g, b] = hexToRgb(color);
      colors.setXYZ(i, r, g, b);
    }
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    this.islandMesh.geometry.computeVertexNormals();
  }

  setConfig(config) {
    Object.assign(this.config, config);
  }

  getMesh() {
    return this.islandMesh;
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getControls() {
    return this.controls;
  }

  /**
   * Set input mode: 'view' (default) or 'edit'.
   * View: Left=orbit, Right=pan, Middle=zoom.
   * Edit: Left=paint, Right=orbit, Middle=zoom. Hold Space + Left to orbit.
   */
  setInputMode(mode) {
    if (!this.controls) return;
    this._inputMode = mode;
    this._spaceHeld = false;
    this._removeSpaceListeners();
    if (mode === 'edit') {
      this._applyEditMouseButtons();
      this._spaceKeyDown = (e) => {
        if (e.code === 'Space' && !e.repeat && !document.activeElement?.closest?.('input, textarea, select')) {
          e.preventDefault();
          this._spaceHeld = true;
          this._applyEditMouseButtons();
        }
      };
      this._spaceKeyUp = (e) => {
        if (e.code === 'Space' && !e.repeat && this._spaceHeld) {
          e.preventDefault();
          this._spaceHeld = false;
          this._applyEditMouseButtons();
        }
      };
      window.addEventListener('keydown', this._spaceKeyDown);
      window.addEventListener('keyup', this._spaceKeyUp);
    } else {
      this.controls.mouseButtons.LEFT = MOUSE.ROTATE;
      this.controls.mouseButtons.MIDDLE = MOUSE.DOLLY;
      this.controls.mouseButtons.RIGHT = MOUSE.PAN;
    }
  }

  _applyEditMouseButtons() {
    if (!this.controls) return;
    if (this._spaceHeld) {
      this.controls.mouseButtons.LEFT = MOUSE.ROTATE;
      this.controls.mouseButtons.RIGHT = MOUSE.PAN;
    } else {
      this.controls.mouseButtons.LEFT = null;
      this.controls.mouseButtons.RIGHT = MOUSE.ROTATE;
    }
    this.controls.mouseButtons.MIDDLE = MOUSE.DOLLY;
  }

  isSpaceHeld() {
    return this._spaceHeld === true;
  }

  _removeSpaceListeners() {
    if (this._spaceKeyDown) {
      window.removeEventListener('keydown', this._spaceKeyDown);
      window.removeEventListener('keyup', this._spaceKeyUp);
      this._spaceKeyDown = null;
      this._spaceKeyUp = null;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls?.update();
    this.renderer?.render(this.scene, this.camera);
  }
}
