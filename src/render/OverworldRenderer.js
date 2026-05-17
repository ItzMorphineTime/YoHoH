/**
 * YoHoH — Overworld sub-renderer (Improvements.md §3.1)
 *
 * Owns everything needed to render the overworld archipelago view:
 *  - Pooled edge (route) and node (island) meshes built from unit geometries
 *    and scaled/tinted per frame — eliminates the per-frame mesh allocations
 *    that previously leaked GPU resources.
 *  - A single outline mesh for the selected-route highlight, and a single ring
 *    mesh for the current-island indicator.
 *  - The overworld ship marker cone.
 *  - Camera framing logic, with a bounds cache keyed by map identity.
 *
 * The main {@link Renderer} owns the shared `scene`, `camera`, and
 * `waterPlane`, and delegates `updateOverworld(...)` here after toggling
 * shared-mesh visibility.
 */

import * as THREE from 'three';
import { CAMERA, OVERWORLD, RENDER, SHIP_GEOMETRY } from '../config.js';
import { getOverworldRenderConfig } from './RenderConfig.js';
import { getRouteModifiers, getPrimaryModifier } from '../utils/routeModifiers.js';

// Charting_Improvements.md §5.4: fog of war is scoped to the Chart Screen
// (BigMapUI) ONLY. The 3D overworld is the action surface — you set sail from
// here — so it shows the full archipelago without fog. (Design call 2026-05-17.)

/** R.3a: Get scale for ship class in the overworld view. */
function overworldShipScale(shipClassId) {
  const classes = SHIP_GEOMETRY?.classes ?? {};
  const c = classes[shipClassId] ?? classes.sloop ?? {};
  return c.overworldScale ?? c.scale ?? 1;
}

export class OverworldRenderer {
  /**
   * @param {THREE.Scene} scene
   * @param {THREE.OrthographicCamera} camera
   */
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    this.lastZoom = CAMERA.overworldZoom ?? 0.25;

    // Group of all overworld-only meshes. Visibility toggled by the main Renderer.
    this.group = new THREE.Group();
    this.group.visible = false;
    this.scene.add(this.group);

    // Player ship marker (cone) — child of group so visibility propagates.
    const shipGeo = new THREE.ConeGeometry(
      RENDER.overworldShipRadius,
      RENDER.overworldShipHeight,
      RENDER.overworldShipSegments
    );
    const shipMat = new THREE.MeshBasicMaterial({ color: RENDER.shipOverworldColor });
    this.shipMesh = new THREE.Mesh(shipGeo, shipMat);
    this.shipMesh.rotation.x = Math.PI / 2;
    this.shipMesh.position.z = 1;
    this.group.add(this.shipMesh);

    // Mesh pools — Improvements.md §1.1
    this._edgeMeshes = [];
    this._nodeMeshes = [];
    this._outlineMesh = null;
    this._currentRingMesh = null;
    this._currentRingState = { r: 0, w: 0 };
    this._unitPlaneGeo = null;
    this._unitCircleGeo = null;

    // Camera bounds cache — Improvements.md §3.2
    this._mapBoundsCache = null;
  }

  /** Toggle visibility of the overworld view. */
  setVisible(visible) {
    this.group.visible = !!visible;
  }

  /**
   * Full per-frame update: entities + camera framing.
   * @param {Object} map
   * @param {{x:number,y:number}} shipPosition
   * @param {Object} currentIsland
   * @param {Object|null} displayRoute
   * @param {boolean} isSelected
   * @param {{x:number,y:number}} pan
   * @param {number} zoomLevel
   * @param {string} shipClassId
   */
  update(map, shipPosition, currentIsland, displayRoute, isSelected, pan, zoomLevel, shipClassId = 'sloop') {
    if (!map) return;
    this._updateEntities(map, shipPosition, currentIsland, displayRoute, isSelected, shipClassId);
    this._updateCamera(map, pan, zoomLevel);
  }

  /** Public read of the last computed zoom (used by ndcToWorldOverworld). */
  getLastZoom() { return this.lastZoom; }

  // ─── Mesh pool helpers ────────────────────────────────────────────────────

  _ensureUnitGeos() {
    if (!this._unitPlaneGeo) this._unitPlaneGeo = new THREE.PlaneGeometry(1, 1);
    if (!this._unitCircleGeo) this._unitCircleGeo = new THREE.CircleGeometry(1, 20);
  }

  _ensureEdgePool(count) {
    this._ensureUnitGeos();
    while (this._edgeMeshes.length < count) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(this._unitPlaneGeo, mat);
      mesh.visible = false;
      this.group.add(mesh);
      this._edgeMeshes.push(mesh);
    }
    while (this._edgeMeshes.length > count) {
      const mesh = this._edgeMeshes.pop();
      this.group.remove(mesh);
      mesh.material?.dispose?.();
      // shared unit geometry — do not dispose
    }
  }

  _ensureNodePool(count) {
    this._ensureUnitGeos();
    while (this._nodeMeshes.length < count) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(this._unitCircleGeo, mat);
      mesh.visible = false;
      this.group.add(mesh);
      this._nodeMeshes.push(mesh);
    }
    while (this._nodeMeshes.length > count) {
      const mesh = this._nodeMeshes.pop();
      this.group.remove(mesh);
      mesh.material?.dispose?.();
    }
  }

  // ─── Entity update ────────────────────────────────────────────────────────

  _updateEntities(map, shipPosition, currentIsland, displayRoute, isSelected, shipClassId) {
    const cfg = getOverworldRenderConfig();
    const { worldScale, islandRadius, routeWidth } = cfg;

    // Edges — scale + tint pooled unit-plane meshes
    this._ensureEdgePool(map.edges.length);
    let selectedEdgeInfo = null;
    for (let i = 0; i < map.edges.length; i++) {
      const edge = map.edges[i];
      const mesh = this._edgeMeshes[i];
      const { a, b } = edge;
      const ax = a.position.x * worldScale;
      const ay = a.position.y * worldScale;
      const bx = b.position.x * worldScale;
      const by = b.position.y * worldScale;
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.sqrt(dx * dx + dy * dy);
      const isDisplayed = displayRoute && (
        (edge.a === displayRoute.a && edge.b === displayRoute.b) ||
        (edge.a === displayRoute.b && edge.b === displayRoute.a)
      );
      const isThisSelected = isSelected && isDisplayed;
      const widthMult = isThisSelected ? cfg.route.selectedWidthMult : (isDisplayed ? cfg.route.hoverWidthMult : 1);
      let color = isThisSelected ? cfg.route.selectedColor : (isDisplayed ? cfg.route.hoverColor : cfg.route.color);
      if (!isThisSelected && !isDisplayed) {
        const mods = getRouteModifiers(edge);
        const primary = getPrimaryModifier(mods);
        if (primary === 'stormy') color = cfg.route.stormyColor ?? cfg.route.color;
        else if (primary === 'patrolled') color = cfg.route.patrolledColor ?? cfg.route.color;
        else if (primary === 'shoals') color = cfg.route.shoalsColor ?? cfg.route.color;
      }

      mesh.visible = true;
      mesh.position.set((ax + bx) / 2, (ay + by) / 2, 0.1);
      mesh.rotation.z = Math.atan2(dy, dx);
      mesh.scale.set(len, routeWidth * widthMult, 1);
      mesh.material.color.setHex(color);

      if (isThisSelected) {
        selectedEdgeInfo = {
          cx: (ax + bx) / 2,
          cy: (ay + by) / 2,
          rot: Math.atan2(dy, dx),
          len,
          width: routeWidth * widthMult,
        };
      }
    }

    // Selected-route outline — single pooled mesh
    if (selectedEdgeInfo && cfg.route.outlineWidth > 0) {
      this._ensureUnitGeos();
      if (!this._outlineMesh) {
        const mat = new THREE.MeshBasicMaterial({ color: cfg.route.outlineColor, side: THREE.DoubleSide });
        this._outlineMesh = new THREE.Mesh(this._unitPlaneGeo, mat);
        this.group.add(this._outlineMesh);
      }
      const outlineW = selectedEdgeInfo.width + cfg.route.outlineWidth * 2;
      this._outlineMesh.material.color.setHex(cfg.route.outlineColor);
      this._outlineMesh.position.set(selectedEdgeInfo.cx, selectedEdgeInfo.cy, 0.05);
      this._outlineMesh.rotation.z = selectedEdgeInfo.rot;
      this._outlineMesh.scale.set(selectedEdgeInfo.len, outlineW, 1);
      this._outlineMesh.visible = true;
    } else if (this._outlineMesh) {
      this._outlineMesh.visible = false;
    }

    // Nodes (islands) — scale + tint pooled unit-circle meshes
    this._ensureNodePool(map.nodes.length);
    let currentNodeInfo = null;
    for (let i = 0; i < map.nodes.length; i++) {
      const node = map.nodes[i];
      const mesh = this._nodeMeshes[i];
      const isCurrent = node === currentIsland;
      const radiusMult = isCurrent ? cfg.island.currentRadiusMult : 1;
      const r = islandRadius * radiusMult;
      const baseColor = node === map.homeNode
        ? cfg.island.homeColor
        : node.dangerous ? cfg.island.dangerColor
        : node.appealing ? cfg.island.appealColor
        : cfg.island.defaultColor;
      const color = isCurrent ? cfg.island.currentColor : baseColor;
      const nx = node.position.x * worldScale;
      const ny = node.position.y * worldScale;
      mesh.visible = true;
      mesh.position.set(nx, ny, 0.2);
      mesh.scale.set(r, r, 1);
      mesh.material.color.setHex(color);
      if (isCurrent) currentNodeInfo = { x: nx, y: ny, r };
    }

    // Current-island ring — single pooled RingGeometry rebuilt only on radius change
    if (currentNodeInfo && cfg.island.currentRingWidth > 0) {
      const r = currentNodeInfo.r;
      const w = cfg.island.currentRingWidth;
      if (!this._currentRingMesh || this._currentRingState.r !== r || this._currentRingState.w !== w) {
        if (this._currentRingMesh) {
          this.group.remove(this._currentRingMesh);
          this._currentRingMesh.geometry?.dispose?.();
          this._currentRingMesh.material?.dispose?.();
        }
        const ringGeo = new THREE.RingGeometry(r, r + w, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: cfg.island.currentRingColor, side: THREE.DoubleSide });
        this._currentRingMesh = new THREE.Mesh(ringGeo, ringMat);
        this.group.add(this._currentRingMesh);
        this._currentRingState = { r, w };
      }
      this._currentRingMesh.material.color.setHex(cfg.island.currentRingColor);
      this._currentRingMesh.position.set(currentNodeInfo.x, currentNodeInfo.y, 0.21);
      this._currentRingMesh.visible = true;
    } else if (this._currentRingMesh) {
      this._currentRingMesh.visible = false;
    }

    // Player ship marker
    this.shipMesh.position.set(shipPosition.x * worldScale, shipPosition.y * worldScale, 1);
    const s = overworldShipScale(shipClassId);
    this.shipMesh.scale.set(s, s, s);
    this.shipMesh.visible = true;
  }

  // ─── Camera framing ───────────────────────────────────────────────────────

  /** Compute (and cache) map-extent bounds in world units. */
  _getMapBounds(map) {
    const cfg = getOverworldRenderConfig();
    if (this._mapBoundsCache && this._mapBoundsCache.map === map && this._mapBoundsCache.worldScale === cfg.worldScale) {
      return this._mapBoundsCache;
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of map.nodes) {
      const x = n.position.x * cfg.worldScale;
      const y = n.position.y * cfg.worldScale;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (!isFinite(minX)) { minX = 0; maxX = 0; minY = 0; maxY = 0; }
    const rangeX = Math.max(maxX - minX, 100);
    const rangeY = Math.max(maxY - minY, 100);
    this._mapBoundsCache = {
      map,
      worldScale: cfg.worldScale,
      minX, maxX, minY, maxY,
      rangeX, rangeY,
      baseCx: (minX + maxX) / 2,
      baseCy: (minY + maxY) / 2,
    };
    return this._mapBoundsCache;
  }

  _updateCamera(map, pan, zoomLevel) {
    const cfg = getOverworldRenderConfig();
    const b = this._getMapBounds(map);
    const padding = 1.15;
    const halfW = (this.camera.right - this.camera.left) / 2;
    const halfH = (this.camera.top - this.camera.bottom) / 2;
    const zoomX = halfW / (b.rangeX * padding / 2);
    const zoomY = halfH / (b.rangeY * padding / 2);
    const baseZoom = Math.min(zoomX, zoomY, cfg.camera.overworldZoom);
    const zoom = baseZoom * (zoomLevel ?? 1);
    this.lastZoom = zoom;
    const cx = b.baseCx + (pan?.x ?? 0);
    const cy = b.baseCy + (pan?.y ?? 0);
    this.camera.zoom = zoom;
    this.camera.position.set(cx, cy, cfg.camera.positionZ);
    this.camera.lookAt(cx, cy, 0);
    this.camera.updateProjectionMatrix();
  }
}
