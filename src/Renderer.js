/**
 * YoHoH — Three.js renderer (orthographic top-down)
 * Phase A: Combat arena, ships, projectiles, cannon arcs, rocks
 */

import * as THREE from 'three';
import { CAMERA, COMBAT, OVERWORLD, OVERWORLD_RENDER, RENDER, SAILING_RENDER, SHIP_GEOMETRY } from './config.js';
import { getCombatRenderConfig, getOverworldRenderConfig, getSailingRenderConfig } from './render/RenderConfig.js';
import { OverworldRenderer } from './render/OverworldRenderer.js'; // Improvements.md §3.1

/** R.3a: Get scale for ship class (combat/sailing — overworld scale lives in OverworldRenderer). */
function getShipClassScale(shipClassId, view) {
  const classes = SHIP_GEOMETRY?.classes ?? {};
  const c = classes[shipClassId] ?? classes.sloop ?? {};
  if (view === 'overworld') return c.overworldScale ?? c.scale ?? 1;
  if (view === 'sailing') return c.sailingScale ?? c.scale ?? 1;
  return c.scale ?? 1;
}

export class Renderer {
  constructor(container) {
    this.container = container;
    // `lastOverworldZoom` is exposed via a getter further down that forwards to
    // OverworldRenderer.getLastZoom(). Until init() constructs the sub-renderer,
    // the getter falls back to CAMERA.overworldZoom.
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.waterPlane = null;
    this.shipMesh = null;
    this.enemyMeshes = new Map();
    this.projectileMeshes = [];
    this.portArcMesh = null;
    this.starboardArcMesh = null;
    this.aimArrowMesh = null;
    this.rocksGroup = null;
    this.arenaBorder = null;
    // Sub-renderers (Improvements.md §3.1) — owned and constructed in init() once
    // the scene and camera exist. The overworld view (group, meshes, pools, camera
    // framing) lives in OverworldRenderer.
    this.overworldRenderer = null;

    this.sailingGroup = null;
    this.sailingShipMesh = null;
    this.sailingPathMesh = null;
    this.sailingDestMesh = null;
    this.sailingOriginIslandMesh = null;
    this.sailingDestIslandMesh = null;
    this._sailingWaterMat = null;
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.OrthographicCamera(
      -width / 2, width / 2,
      height / 2, -height / 2,
      CAMERA.near, CAMERA.far
    );
    this.camera.position.set(0, 0, CAMERA.positionZ);
    this.camera.zoom = CAMERA.zoom;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(RENDER.clearColor);
    const canvasLayer = this.container.querySelector('#game-canvas-layer') || this.container;
    canvasLayer.appendChild(this.renderer.domElement);

    this._createCombatArena();
    this._createShip();
    this._createCannonArcs();
    this._createProjectilePool();
    // Overworld view lives in its own sub-renderer.
    this.overworldRenderer = new OverworldRenderer(this.scene, this.camera);
    this._createSailingView();

    window.addEventListener('resize', () => this.onResize());
  }

  _createCombatArena() {
    const { arenaWidth, arenaHeight } = COMBAT;
    const waterSize = Math.max(arenaWidth * 2, arenaHeight * 2, RENDER.waterPlaneSizeMin ?? 800);
    const geometry = new THREE.PlaneGeometry(waterSize, waterSize);
    const material = new THREE.MeshBasicMaterial({
      color: RENDER.waterColor,
      side: THREE.DoubleSide,
    });
    this.waterPlane = new THREE.Mesh(geometry, material);
    this.waterPlane.position.z = 0;
    this._combatWaterMat = material;
    this.scene.add(this.waterPlane);

    // Arena border (wireframe) — only visible in combat
    const borderGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(arenaWidth * 2, arenaHeight * 2));
    const borderMat = new THREE.LineBasicMaterial({ color: RENDER.arenaBorderColor, linewidth: 2 });
    this.arenaBorder = new THREE.LineSegments(borderGeo, borderMat);
    this.arenaBorder.position.z = RENDER.arenaBorderZ;
    this.scene.add(this.arenaBorder);

    // Rocks — pool built lazily by _syncRocks() once per combat (Improvements.md §1.2)
    this.rocksGroup = new THREE.Group();
    this.scene.add(this.rocksGroup);
    this._currentRocks = null; // identity reference to the active rocks array
  }

  /**
   * Build (or rebuild) the rocks mesh pool to match the given rocks array.
   * Disposes prior geometry/material to avoid GPU leaks. Called only when the
   * rock set changes (typically once per combat). (Improvements.md §1.2)
   */
  _syncRocks(rocks) {
    if (rocks === this._currentRocks) return;
    const cfg = getCombatRenderConfig();
    while (this.rocksGroup.children.length > 0) {
      const mesh = this.rocksGroup.children[0];
      this.rocksGroup.remove(mesh);
      mesh.geometry?.dispose?.();
      mesh.material?.dispose?.();
    }
    for (const r of rocks || []) {
      const geometry = new THREE.CircleGeometry(r.r, cfg.rock.segments);
      const material = new THREE.MeshBasicMaterial({ color: cfg.rock.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(r.x, r.y, 0.5);
      this.rocksGroup.add(mesh);
    }
    this._currentRocks = rocks ?? null;
  }

  _createShip() {
    // Ship silhouette: hull (pointed bow) + mast + sails
    const shipGroup = new THREE.Group();

    // Hull — tapered shape (bow at +Y)
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-4, -6);
    hullShape.lineTo(-3, 6);
    hullShape.lineTo(0, 7);
    hullShape.lineTo(3, 6);
    hullShape.lineTo(4, -6);
    hullShape.lineTo(-4, -6);
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: SHIP_GEOMETRY.hull.depth, bevelEnabled: false });
    const hullMat = new THREE.MeshBasicMaterial({ color: RENDER.shipHullColor });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.z = 0.75;
    shipGroup.add(hull);

    // Mast
    const mastGeo = new THREE.BoxGeometry(SHIP_GEOMETRY.mast.width, SHIP_GEOMETRY.mast.height, SHIP_GEOMETRY.mast.depth);
    const mastMat = new THREE.MeshBasicMaterial({ color: RENDER.shipMastColor });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 2, 2);
    shipGroup.add(mast);

    // Sails (rectangular)
    const sailGeo = new THREE.PlaneGeometry(SHIP_GEOMETRY.sail.width, SHIP_GEOMETRY.sail.height);
    const sailMat = new THREE.MeshBasicMaterial({ color: RENDER.shipSailColor, side: THREE.DoubleSide });
    const sail = new THREE.Mesh(sailGeo, sailMat);
    sail.position.set(0, 2, 6);
    shipGroup.add(sail);

    this.shipMesh = shipGroup;
    this.shipMesh.position.set(0, 0, 1);
    this.shipMesh.rotation.z = 0;
    this.scene.add(this.shipMesh);

    // Aim arrow as child of ship — inherits ship rotation, only needs port/starboard offset
    const coneGeo = new THREE.ConeGeometry(RENDER.aimArrowSize, COMBAT.cannonRange * RENDER.aimArrowLengthMult, 8);
    const coneMat = new THREE.MeshBasicMaterial({
      color: RENDER.aimArrowColor,
      transparent: true,
      opacity: RENDER.aimArrowOpacity,
    });
    this.aimArrowMesh = new THREE.Mesh(coneGeo, coneMat);
    this.aimArrowMesh.position.z = -0.7;
    this.aimArrowMesh.visible = false;
    this.shipMesh.add(this.aimArrowMesh);
  }

  _createCannonArcs() {
    const arcGeo = this._createArcGeometry(COMBAT.cannonRange, COMBAT.cannonArcDeg);
    const portMat = new THREE.MeshBasicMaterial({
      color: RENDER.portArcColor,
      transparent: true,
      opacity: RENDER.cannonArcOpacity,
      side: THREE.DoubleSide,
    });
    const starboardMat = new THREE.MeshBasicMaterial({
      color: RENDER.starboardArcColor,
      transparent: true,
      opacity: RENDER.cannonArcOpacity,
      side: THREE.DoubleSide,
    });
    this.portArcMesh = new THREE.Mesh(arcGeo, portMat);
    this.starboardArcMesh = new THREE.Mesh(arcGeo, starboardMat);
    this.portArcMesh.position.z = RENDER.cannonArcZ;
    this.starboardArcMesh.position.z = RENDER.cannonArcZ;
    this.scene.add(this.portArcMesh);
    this.scene.add(this.starboardArcMesh);
  }

  _createArcGeometry(radius, arcDeg) {
    const segments = RENDER.cannonArcSegments;
    const startAngle = -arcDeg / 2 * (Math.PI / 180);
    const endAngle = arcDeg / 2 * (Math.PI / 180);
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    for (let i = 0; i <= segments; i++) {
      const a = startAngle + (endAngle - startAngle) * (i / segments);
      shape.lineTo(Math.sin(a) * radius, Math.cos(a) * radius);
    }
    shape.lineTo(0, 0);
    return new THREE.ShapeGeometry(shape);
  }

  _createProjectilePool() {
    this.projectileMeshes = [];
  }

  // _createOverworld() removed — overworld view lives in OverworldRenderer
  // (Improvements.md §3.1). Backwards-compat getters below preserve any
  // external/internal references to `overworldGroup` / `lastOverworldZoom`.

  /** @deprecated Use `overworldRenderer.group`. Kept for compat with hide helpers. */
  get overworldGroup() { return this.overworldRenderer?.group ?? null; }
  /** @deprecated Use `overworldRenderer.getLastZoom()`. */
  get lastOverworldZoom() { return this.overworldRenderer?.getLastZoom?.() ?? (CAMERA.overworldZoom ?? 0.25); }

  _createSailingWaterMaterial() {
    if (this._sailingWaterMat) return this._sailingWaterMat;
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, '#2a4a6a');
    gradient.addColorStop(0.5, '#1e3a5f');
    gradient.addColorStop(1, '#0f2840');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    this._sailingWaterMat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
    });
    return this._sailingWaterMat;
  }

  _createSailingView() {
    const cfg = getSailingRenderConfig();
    this.sailingGroup = new THREE.Group();
    this.sailingGroup.visible = false;
    this.scene.add(this.sailingGroup);

    const pathGeo = new THREE.PlaneGeometry(cfg.pathRefLength, cfg.corridorWidthWorld);
    const pathMat = new THREE.MeshBasicMaterial({
      color: cfg.corridor.color,
      transparent: true,
      opacity: cfg.corridor.opacity,
      side: THREE.DoubleSide,
    });
    this.sailingPathMesh = new THREE.Mesh(pathGeo, pathMat);
    this.sailingPathMesh.position.z = 0;
    this.sailingGroup.add(this.sailingPathMesh);

    // S.5 Corridor feedback: subtle edge markers at corridor bounds
    const edgeWidth = cfg.corridor.edgeWidth ?? 2;
    const edgeGeo = new THREE.PlaneGeometry(cfg.pathRefLength, edgeWidth);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: cfg.corridor.edgeColor ?? cfg.corridor.color,
      transparent: true,
      opacity: cfg.corridor.edgeOpacity ?? 0.5,
      side: THREE.DoubleSide,
    });
    const edgeLeft = new THREE.Mesh(edgeGeo.clone(), edgeMat.clone());
    edgeLeft.position.y = -cfg.corridorWidthWorld / 2 - edgeWidth / 2;
    edgeLeft.position.z = 0.01;
    this.sailingPathMesh.add(edgeLeft);
    const edgeRight = new THREE.Mesh(edgeGeo.clone(), edgeMat.clone());
    edgeRight.position.y = cfg.corridorWidthWorld / 2 + edgeWidth / 2;
    edgeRight.position.z = 0.01;
    this.sailingPathMesh.add(edgeRight);

    const shipGeo = new THREE.ConeGeometry(cfg.ship.radius, cfg.ship.height, cfg.ship.segments);
    const shipMat = new THREE.MeshBasicMaterial({ color: cfg.ship.color });
    this.sailingShipMesh = new THREE.Mesh(shipGeo, shipMat);
    this.sailingShipMesh.position.z = 1;
    this.sailingGroup.add(this.sailingShipMesh);

    // S.3 Wake / trail: foam trail behind ship when moving
    const wake = cfg.wake ?? {};
    const wakeLen = wake.lengthMax ?? 40;
    const wakeW = wake.width ?? 12;
    const wakeGeo = new THREE.PlaneGeometry(wakeLen, wakeW);
    const wakeMat = new THREE.MeshBasicMaterial({
      color: wake.color ?? 0x5a8aba,
      transparent: true,
      opacity: wake.opacity ?? 0.4,
      side: THREE.DoubleSide,
    });
    this.sailingWakeMesh = new THREE.Mesh(wakeGeo, wakeMat);
    this.sailingWakeMesh.position.z = 0.15;
    this.sailingGroup.add(this.sailingWakeMesh);

    const destGeo = new THREE.CircleGeometry(cfg.destMarker.radius, RENDER.sailingDestSegments);
    const destMat = new THREE.MeshBasicMaterial({
      color: cfg.destMarker.color,
      transparent: true,
      opacity: cfg.destMarker.opacity,
    });
    this.sailingDestMesh = new THREE.Mesh(destGeo, destMat);
    this.sailingDestMesh.position.z = 0.5;
    this.sailingGroup.add(this.sailingDestMesh);

    // Sailing_Improvements.md #25: pulsing approach-zone ring around the
    // destination island. Shown when ship is in the last ~15% of the corridor
    // ("F to dock" prompt). Hidden otherwise. Uses a separate RingGeometry so
    // we can pulse opacity / scale per frame.
    const approachInner = cfg.destMarker.radius * 1.5;
    const approachOuter = cfg.destMarker.radius * 1.9;
    const approachGeo = new THREE.RingGeometry(approachInner, approachOuter, 32);
    const approachMat = new THREE.MeshBasicMaterial({
      color: 0xaacc88,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    this.sailingApproachRingMesh = new THREE.Mesh(approachGeo, approachMat);
    this.sailingApproachRingMesh.position.z = 0.45;
    this.sailingApproachRingMesh.visible = false;
    this.sailingGroup.add(this.sailingApproachRingMesh);

    // Sailing_Improvements.md §4.2: corridor sub-events — pooled small circles
    // synced per frame in _updateSailingEntities. Pool grows lazily; never shrinks
    // because the max events per voyage is small (default 3).
    this._sailingEventMeshes = []; // each: { mesh, material }
    this._sailingEventUnitGeo = new THREE.CircleGeometry(1, 16);

    const islandGeo = new THREE.CircleGeometry(cfg.islandRadius, 24);
    const islandOpacity = cfg.destMarker.opacity * 0.7;
    const originMat = new THREE.MeshBasicMaterial({
      color: cfg.destMarker.color,
      transparent: true,
      opacity: islandOpacity,
    });
    this.sailingOriginIslandMesh = new THREE.Mesh(islandGeo.clone(), originMat);
    this.sailingOriginIslandMesh.position.z = 0.1;
    this.sailingGroup.add(this.sailingOriginIslandMesh);
    const destIslandMat = new THREE.MeshBasicMaterial({
      color: cfg.destMarker.color,
      transparent: true,
      opacity: islandOpacity,
    });
    this.sailingDestIslandMesh = new THREE.Mesh(islandGeo.clone(), destIslandMat);
    this.sailingDestIslandMesh.position.z = 0.1;
    this.sailingGroup.add(this.sailingDestIslandMesh);
  }

  /**
   * Battle_Improvements.md §2.6: pooled combat FX (muzzle flash, water splash,
   * hit spark). Lazily grown; each pool entry is a small circle mesh re-tinted
   * + re-scaled per FX type, animated by `fx.age / fx.lifetime`.
   */
  _ensureCombatFxPool(n) {
    if (!this._combatFxMeshes) this._combatFxMeshes = [];
    if (!this._combatFxUnitGeo) {
      // 16-segment unit circle — cheap, looks smooth at small sizes
      this._combatFxUnitGeo = new THREE.CircleGeometry(1, 16);
    }
    while (this._combatFxMeshes.length < n) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(this._combatFxUnitGeo, mat);
      mesh.visible = false;
      mesh.position.z = 3;
      this.scene.add(mesh);
      this._combatFxMeshes.push(mesh);
    }
  }

  _updateCombatEffects(effects) {
    const list = Array.isArray(effects) ? effects : [];
    this._ensureCombatFxPool(list.length);
    for (let i = 0; i < list.length; i++) {
      const fx = list[i];
      const mesh = this._combatFxMeshes[i];
      mesh.visible = true;
      const t = fx.lifetime > 0 ? fx.age / fx.lifetime : 1;
      const fade = Math.max(0, 1 - t);
      mesh.position.set(fx.x, fx.y, 3);
      if (fx.type === 'muzzle') {
        // Bright orange disc, briefly large, fades fast.
        const r = 2.8 + t * 1.8;
        mesh.scale.set(r, r, 1);
        mesh.material.color.setHex(0xffcc66);
        mesh.material.opacity = fade;
      } else if (fx.type === 'hit') {
        // Red spark — expands a bit, fades.
        const r = 3 + t * 5;
        mesh.scale.set(r, r, 1);
        mesh.material.color.setHex(0xff6644);
        mesh.material.opacity = fade * 0.95;
      } else {
        // splash — light blue ring, expands slowly, fades to nothing.
        const r = 2 + t * 6;
        mesh.scale.set(r, r, 1);
        mesh.material.color.setHex(0x88ccff);
        mesh.material.opacity = fade * 0.7;
      }
    }
    // Hide unused pool slots
    for (let i = list.length; i < this._combatFxMeshes.length; i++) {
      this._combatFxMeshes[i].visible = false;
    }
  }

  /**
   * Battle_Improvements.md §2.1: pooled HP bar (background + foreground) drawn
   * just above each enemy ship, always axis-aligned (separate Map so the ship's
   * rotation doesn't carry into the bar). Returns `{ group, bg, fg }`.
   */
  _getOrCreateEnemyHpBar(id) {
    if (!this._enemyHpBars) this._enemyHpBars = new Map();
    if (this._enemyHpBars.has(id)) return this._enemyHpBars.get(id);
    const group = new THREE.Group();
    // Background — full bar width
    const bgGeo = new THREE.PlaneGeometry(1, 1);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x402020, transparent: true, opacity: 0.85 });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    group.add(bg);
    // Foreground — scales by hp%; left-anchored so it shrinks from the right
    const fgGeo = new THREE.PlaneGeometry(1, 1);
    const fgMat = new THREE.MeshBasicMaterial({ color: 0x6bca6b, transparent: true, opacity: 0.95 });
    const fg = new THREE.Mesh(fgGeo, fgMat);
    fg.position.z = 0.01; // sit just above bg
    group.add(fg);
    this.scene.add(group);
    const entry = { group, bg, fg };
    this._enemyHpBars.set(id, entry);
    return entry;
  }

  /** Position + size the HP bar above an enemy. Hides on dead ships. */
  _updateEnemyHpBar(enemy) {
    const { group, bg, fg } = this._getOrCreateEnemyHpBar(enemy.id);
    if (enemy.dead) {
      group.visible = false;
      return;
    }
    group.visible = true;
    const width = 14;       // world units
    const height = 1.5;
    const yOffset = 9;      // above the ship (ships are ~6 units tall)
    group.position.set(enemy.x, enemy.y + yOffset, 5);
    bg.scale.set(width, height, 1);
    bg.position.set(0, 0, 0);
    const hpFrac = Math.max(0, Math.min(1, (enemy.hull ?? 0) / (enemy.hullMax ?? 1)));
    fg.scale.set(width * hpFrac, height, 1);
    // Anchor foreground to the LEFT edge of the bg (shrinks from right):
    //   bg centered at 0 spans [-width/2, +width/2]
    //   fg centered at -width/2 + (width*hpFrac)/2 spans [-width/2, -width/2 + width*hpFrac]
    fg.position.set(-width / 2 + (width * hpFrac) / 2, 0, 0.01);
    // Colour: green → yellow → red as HP drops
    fg.material.color.setHex(hpFrac > 0.66 ? 0x6bca6b : hpFrac > 0.33 ? 0xddbb44 : 0xd86a6a);
  }

  _getOrCreateEnemyMesh(id) {
    if (this.enemyMeshes.has(id)) return this.enemyMeshes.get(id);
    const group = new THREE.Group();
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-3, -5);
    hullShape.lineTo(-2.5, 5);
    hullShape.lineTo(0, 6);
    hullShape.lineTo(2.5, 5);
    hullShape.lineTo(3, -5);
    hullShape.lineTo(-3, -5);
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: SHIP_GEOMETRY.enemyHull.depth, bevelEnabled: false });
    const hullMat = new THREE.MeshBasicMaterial({ color: RENDER.enemyHullColor });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.z = 0.6;
    group.add(hull);
    const mastGeo = new THREE.BoxGeometry(SHIP_GEOMETRY.enemyMast.width, SHIP_GEOMETRY.enemyMast.height, SHIP_GEOMETRY.enemyMast.depth);
    const mastMat = new THREE.MeshBasicMaterial({ color: RENDER.enemyMastColor });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 1.5, 1.5);
    group.add(mast);
    const sailGeo = new THREE.PlaneGeometry(SHIP_GEOMETRY.enemySail.width, SHIP_GEOMETRY.enemySail.height);
    const sailMat = new THREE.MeshBasicMaterial({ color: RENDER.enemySailColor, side: THREE.DoubleSide });
    const sail = new THREE.Mesh(sailGeo, sailMat);
    sail.position.set(0, 1.5, 4);
    group.add(sail);
    group.position.z = 1;
    this.scene.add(group);
    this.enemyMeshes.set(id, group);
    return group;
  }

  _getOrCreateProjectileMesh(i) {
    while (this.projectileMeshes.length <= i) {
      const geometry = new THREE.ConeGeometry(SHIP_GEOMETRY.projectileRadius, SHIP_GEOMETRY.projectileHeight, SHIP_GEOMETRY.projectileSegments);
      const material = new THREE.MeshBasicMaterial({ color: RENDER.projectileColor });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = 2;
      this.scene.add(mesh);
      this.projectileMeshes.push(mesh);
    }
    return this.projectileMeshes[i];
  }

  updateCombat(player, enemies, projectiles, rocks, aimingSide, effects = null) {
    this._hideNonCombatViews();
    this._setupCombatView();
    this._updateCombatEntities(player, enemies, projectiles, rocks, aimingSide);
    // Battle_Improvements.md §2.6: render short-lived FX (muzzle / splash / hit)
    this._updateCombatEffects(effects);
  }

  _hideNonCombatViews() {
    this.overworldRenderer?.setVisible(false);
    this.sailingGroup.visible = false;
  }

  _setupCombatView() {
    const cfg = getCombatRenderConfig();
    this.waterPlane.visible = true;
    this.waterPlane.scale.set(1, 1, 1);
    this.waterPlane.position.set(0, 0, 0);
    if (this.waterPlane && this._combatWaterMat) this.waterPlane.material = this._combatWaterMat;
    if (this.arenaBorder) this.arenaBorder.visible = true;
    if (this.rocksGroup) this.rocksGroup.visible = true; // hidden by other view setups
    this.camera.zoom = cfg.camera.zoom;
    this.camera.updateProjectionMatrix();
  }

  _updateCombatEntities(player, enemies, projectiles, rocks, aimingSide) {
    const cfg = getCombatRenderConfig();
    if (this.shipMesh && player && !player.dead) {
      this.shipMesh.visible = true;
      const scale = getShipClassScale(player.shipClassId ?? 'sloop', 'combat');
      this.shipMesh.scale.set(scale, scale, scale);
      this.shipMesh.position.x = player.x;
      this.shipMesh.position.y = player.y;
      this.shipMesh.rotation.z = -player.rotation;

      this.portArcMesh.visible = true;
      this.starboardArcMesh.visible = true;
      this.portArcMesh.position.set(player.x, player.y, cfg.cannon.z);
      this.starboardArcMesh.position.set(player.x, player.y, cfg.cannon.z);
      const portCenter = Math.PI - player.rotation;
      const starboardCenter = -player.rotation;
      this.portArcMesh.rotation.z = portCenter - Math.PI / 2;
      this.starboardArcMesh.rotation.z = starboardCenter - Math.PI / 2;

      // Battle_Improvements.md §2.4: cannon arc opacity reflects reload state.
      //   ready      → full opacity, normal hue
      //   reloading  → dimmed (interp from 0.15 at cd=cooldown to baseOpacity at cd=0)
      //   < 0.3s     → flash red tint to signal "almost ready"
      const baseOpacity = RENDER.cannonArcOpacity ?? 0.25;
      const portReadyFrac  = 1 - Math.min(1, (player.portCooldown    || 0) / (player.cannonCooldown || 1));
      const starboardReadyFrac = 1 - Math.min(1, (player.starboardCooldown || 0) / (player.cannonCooldown || 1));
      this.portArcMesh.material.opacity      = 0.10 + baseOpacity * portReadyFrac;
      this.starboardArcMesh.material.opacity = 0.10 + baseOpacity * starboardReadyFrac;
      // Tint logic — almost-ready (last 0.3s) flashes the "alert" hue, ready/loading use the base hue.
      const portAlmost      = (player.portCooldown    || 0) > 0 && (player.portCooldown    || 0) < 0.3;
      const starboardAlmost = (player.starboardCooldown || 0) > 0 && (player.starboardCooldown || 0) < 0.3;
      this.portArcMesh.material.color.setHex(portAlmost ? 0xff8844 : RENDER.portArcColor);
      this.starboardArcMesh.material.color.setHex(starboardAlmost ? 0xff8844 : RENDER.starboardArcColor);

      if (aimingSide) {
        this.aimArrowMesh.visible = true;
        const offset = 10;
        this.aimArrowMesh.position.x = aimingSide === 'port' ? -offset : offset;
        this.aimArrowMesh.position.y = 4;
        this.aimArrowMesh.rotation.z = aimingSide === 'port' ? Math.PI / 2 : -Math.PI / 2;
        this.aimArrowMesh.material.color.setHex(aimingSide === 'port' ? cfg.cannon.portColor : cfg.cannon.starboardColor);
      } else {
        this.aimArrowMesh.visible = false;
        this.aimArrowMesh.position.x = 0;
        this.aimArrowMesh.position.y = 0;
      }
    } else {
      this.shipMesh.visible = false;
      this.portArcMesh.visible = false;
      this.starboardArcMesh.visible = false;
      this.aimArrowMesh.visible = false;
    }

    const activeIds = new Set();
    for (const e of enemies || []) {
      if (e.dead) {
        // Battle_Improvements.md §2.1: hide HP bar on death (the ship mesh
        // already hides via the activeIds set below).
        this._updateEnemyHpBar(e);
        continue;
      }
      activeIds.add(e.id);
      const mesh = this._getOrCreateEnemyMesh(e.id);
      mesh.visible = true;
      mesh.position.set(e.x, e.y, 1);
      mesh.rotation.z = -e.rotation;
      // Battle_Improvements.md §2.1: enemy HP bar above the ship
      this._updateEnemyHpBar(e);
    }
    for (const [id, mesh] of this.enemyMeshes) {
      if (!activeIds.has(id)) {
        mesh.visible = false;
        const bar = this._enemyHpBars?.get(id);
        if (bar) bar.group.visible = false;
      }
    }

    for (let i = 0; i < (projectiles?.length ?? 0); i++) {
      const p = projectiles[i];
      const mesh = this._getOrCreateProjectileMesh(i);
      mesh.visible = true;
      mesh.position.set(p.x, p.y, 2);
      mesh.rotation.z = -p.rotation;
    }
    for (let i = projectiles?.length ?? 0; i < this.projectileMeshes.length; i++) {
      this.projectileMeshes[i].visible = false;
    }

    // Rocks: build once per combat; reuse meshes across frames. (Improvements.md §1.2)
    this._syncRocks(rocks);
  }

  updateSailing(sailingShip, shipPosition, travelRoute, voyageInfo = null, corridorEvents = null) {
    this._hideNonSailingViews();
    this._setupSailingView(shipPosition);
    this._updateSailingEntities(sailingShip, shipPosition, travelRoute, voyageInfo);
    this._updateCorridorEvents(corridorEvents);
    this._updateSailingCamera(shipPosition, sailingShip); // §2.6: pass ship for speed-aware zoom
  }

  /** Sailing_Improvements.md §4.2: render pooled circle markers for active events. */
  _updateCorridorEvents(events) {
    const cfg = getSailingRenderConfig();
    const list = events ?? [];
    // Grow pool as needed
    while (this._sailingEventMeshes.length < list.length) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(this._sailingEventUnitGeo, material);
      mesh.position.z = 0.6;
      mesh.visible = false;
      this.sailingGroup.add(mesh);
      this._sailingEventMeshes.push({ mesh, material });
    }
    const eventRadiusGraph = 1.5; // graph units → world units below
    const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 600;
    for (let i = 0; i < this._sailingEventMeshes.length; i++) {
      const { mesh, material } = this._sailingEventMeshes[i];
      const evt = list[i];
      if (!evt || evt.triggered) {
        mesh.visible = false;
        continue;
      }
      const color = (evt._color != null) ? evt._color : this._eventColor(evt.type);
      evt._color = color;
      material.color.setHex(color);
      const scalePulse = 1 + 0.15 * Math.sin(t + i);
      const scaleWorld = eventRadiusGraph * cfg.worldScale * scalePulse;
      mesh.scale.set(scaleWorld, scaleWorld, 1);
      mesh.position.set(evt.x * cfg.worldScale, evt.y * cfg.worldScale, 0.6);
      mesh.visible = true;
    }
  }

  _eventColor(type) {
    switch (type) {
      case 'flotsam':   return 0xffcc44;
      case 'debris':    return 0x8a6a4a;
      case 'whirlpool': return 0x4a7c9a;
      case 'friendly':  return 0xaacc88;
      default:          return 0xcccccc;
    }
  }

  _hideNonSailingViews() {
    this.overworldRenderer?.setVisible(false);
    if (this.arenaBorder) this.arenaBorder.visible = false;
    if (this.portArcMesh) this.portArcMesh.visible = false;
    if (this.starboardArcMesh) this.starboardArcMesh.visible = false;
    if (this.aimArrowMesh) this.aimArrowMesh.visible = false;
    if (this.rocksGroup) this.rocksGroup.visible = false;
    for (const [, m] of this.enemyMeshes) m.visible = false;
    for (const m of this.projectileMeshes) m.visible = false;
  }

  _setupSailingView(shipPosition) {
    const cfg = getSailingRenderConfig();
    this.waterPlane.visible = true;
    this.waterPlane.scale.set(cfg.water.planeScale, cfg.water.planeScale, 1);
    this.waterPlane.position.set(shipPosition.x * cfg.worldScale, shipPosition.y * cfg.worldScale, 0);
    if (cfg.water.gradient && this.waterPlane && this._combatWaterMat) {
      this.waterPlane.material = this._createSailingWaterMaterial();
    }
    this.sailingGroup.visible = true;
  }

  _updateSailingEntities(sailingShip, shipPosition, travelRoute, voyageInfo = null) {
    const cfg = getSailingRenderConfig();
    const sx = shipPosition.x * cfg.worldScale;
    const sy = shipPosition.y * cfg.worldScale;

    if (sailingShip && this.shipMesh) {
      this.shipMesh.visible = true;
      const scale = getShipClassScale(sailingShip.shipClassId ?? 'sloop', 'sailing');
      this.shipMesh.scale.set(scale, scale, scale);
      this.shipMesh.position.set(sx, sy, 1);
      this.shipMesh.rotation.z = -sailingShip.rotation;
    } else if (this.sailingShipMesh) {
      this.sailingShipMesh.visible = true;
      this.sailingShipMesh.position.set(sx, sy, 1);
      if (travelRoute) {
        const { a, b } = travelRoute;
        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;
        this.sailingShipMesh.rotation.z = -Math.atan2(dy, dx);
      }
    }

    if (travelRoute) {
      const { a, b } = travelRoute;
      const ax = a.position.x * cfg.worldScale;
      const ay = a.position.y * cfg.worldScale;
      const bx = b.position.x * cfg.worldScale;
      const by = b.position.y * cfg.worldScale;
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.sqrt(dx * dx + dy * dy);
      this.sailingPathMesh.position.set((ax + bx) / 2, (ay + by) / 2, 0);
      this.sailingPathMesh.rotation.z = Math.atan2(dy, dx);
      this.sailingPathMesh.scale.set(len / cfg.pathRefLength, 1, 1);
      this.sailingPathMesh.visible = true;

      this.sailingDestMesh.position.set(bx, by, 0.5);
      this.sailingDestMesh.visible = true;

      if (this.sailingOriginIslandMesh) {
        this.sailingOriginIslandMesh.position.set(ax, ay, 0.1);
        this.sailingOriginIslandMesh.visible = true;
      }
      if (this.sailingDestIslandMesh) {
        this.sailingDestIslandMesh.position.set(bx, by, 0.1);
        this.sailingDestIslandMesh.visible = true;
      }

      // Sailing_Improvements.md #25: pulsing approach ring around the destination
      // island. Visible when voyage progress >= approachFraction (default 0.85).
      if (this.sailingApproachRingMesh) {
        const progress = voyageInfo?.progress ?? 0;
        const showRing = progress >= 0.85;
        this.sailingApproachRingMesh.visible = showRing;
        if (showRing) {
          this.sailingApproachRingMesh.position.set(bx, by, 0.45);
          // Pulse opacity 0.4 ↔ 0.8 over ~1s using performance.now
          const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 500;
          const pulse = 0.6 + 0.2 * Math.sin(t);
          this.sailingApproachRingMesh.material.opacity = pulse;
          // Slight scale pulse too
          const scale = 1 + 0.05 * Math.sin(t);
          this.sailingApproachRingMesh.scale.set(scale, scale, 1);
        }
      }
    } else {
      this.sailingPathMesh.visible = false;
      this.sailingDestMesh.visible = false;
      if (this.sailingOriginIslandMesh) this.sailingOriginIslandMesh.visible = false;
      if (this.sailingDestIslandMesh) this.sailingDestIslandMesh.visible = false;
      if (this.sailingApproachRingMesh) this.sailingApproachRingMesh.visible = false;
    }

    if (this.sailingShipMesh) this.sailingShipMesh.visible = !sailingShip;

    // S.3 Wake / trail: show behind ship when moving
    // Sailing_Improvements.md §2.9: threshold is now a fraction of effective max
    // so the wake appears reliably even when sails/crew/bilge cut speed.
    if (this.sailingWakeMesh) {
      if (!sailingShip) {
        this.sailingWakeMesh.visible = false;
      } else {
      const wake = cfg.wake ?? {};
      // Backwards-compat: treat numbers ≥ 1 as "use as absolute"; otherwise as a fraction.
      const rawThreshold = wake.speedThreshold ?? 0.1;
      const speed = sailingShip.speed ?? 0;
      const maxSpeed = sailingShip?.effectiveMaxSpeed ?? sailingShip?.maxSpeed ?? 0.1;
      const speedFactorAbs = maxSpeed > 0 ? Math.abs(speed) / maxSpeed : 0;
      const passesThreshold = rawThreshold < 1
        ? speedFactorAbs > rawThreshold       // fraction of effective max
        : Math.abs(speed) > rawThreshold;     // legacy absolute number
      if (passesThreshold && maxSpeed > 0) {
        const speedFactor = Math.min(1, Math.abs(speed) / maxSpeed);
        const wakeLenMax = wake.lengthMax ?? 40;
        const actualLen = speedFactor * wakeLenMax;
        const r = sailingShip?.rotation ?? Math.atan2(
          travelRoute ? travelRoute.b.position.y - travelRoute.a.position.y : 0,
          travelRoute ? travelRoute.b.position.x - travelRoute.a.position.x : 1
        );
        const backX = -Math.sin(r) * (actualLen / 2);
        const backY = -Math.cos(r) * (actualLen / 2);
        this.sailingWakeMesh.position.set(sx + backX, sy + backY, 0.15);
        this.sailingWakeMesh.rotation.z = Math.atan2(-Math.cos(r), -Math.sin(r));
        this.sailingWakeMesh.scale.set(speedFactor, 1, 1);
        this.sailingWakeMesh.visible = true;
      } else {
        this.sailingWakeMesh.visible = false;
      }
      }
    }
  }

  _updateSailingCamera(shipPosition, sailingShip = null) {
    const cfg = getSailingRenderConfig();
    const targetX = shipPosition.x * cfg.worldScale;
    const targetY = shipPosition.y * cfg.worldScale;
    const lerp = cfg.camera.smoothingLerp ?? 0.12;
    if (lerp > 0 && lerp < 1) {
      const prevX = this._sailingCameraX ?? targetX;
      const prevY = this._sailingCameraY ?? targetY;
      this._sailingCameraX = prevX + (targetX - prevX) * lerp;
      this._sailingCameraY = prevY + (targetY - prevY) * lerp;
    } else {
      this._sailingCameraX = targetX;
      this._sailingCameraY = targetY;
    }
    const sx = this._sailingCameraX;
    const sy = this._sailingCameraY;
    // Sailing_Improvements.md §2.6: speed-relative zoom — pull out up to ~15% at top speed.
    const baseZoom = cfg.camera.zoom;
    let targetZoom = baseZoom;
    if (sailingShip) {
      const maxSpeed = sailingShip.effectiveMaxSpeed ?? sailingShip.maxSpeed ?? 0;
      if (maxSpeed > 0) {
        const speedFactor = Math.min(1, Math.abs(sailingShip.speed ?? 0) / maxSpeed);
        targetZoom = baseZoom * (1 - 0.15 * speedFactor); // up to 15% wider FoV at top speed
      }
    }
    const prevZoom = this._sailingCameraZoom ?? baseZoom;
    const zoomLerp = 0.08;
    this._sailingCameraZoom = prevZoom + (targetZoom - prevZoom) * zoomLerp;
    this.camera.zoom = this._sailingCameraZoom;
    this.camera.position.set(sx, sy, cfg.camera.positionZ);
    this.camera.lookAt(sx, sy, 0);
    this.camera.updateProjectionMatrix();
  }

  /**
   * Render the overworld view. Delegates entity/camera work to
   * {@link OverworldRenderer}; this method just toggles shared-mesh visibility
   * and the water-plane material. (Improvements.md §3.1)
   */
  updateOverworld(map, shipPosition, currentIsland, displayRoute = null, isSelected = false, pan = { x: 0, y: 0 }, zoomLevel = 1, shipClassId = 'sloop') {
    this._hideNonOverworldViews();
    this._setupOverworldView();
    this.overworldRenderer.update(map, shipPosition, currentIsland, displayRoute, isSelected, pan, zoomLevel, shipClassId);
  }

  _hideNonOverworldViews() {
    this.sailingGroup.visible = false;
    if (this.arenaBorder) this.arenaBorder.visible = false;
    if (this.shipMesh) this.shipMesh.visible = false;
    if (this.portArcMesh) this.portArcMesh.visible = false;
    if (this.starboardArcMesh) this.starboardArcMesh.visible = false;
    if (this.aimArrowMesh) this.aimArrowMesh.visible = false;
    if (this.rocksGroup) this.rocksGroup.visible = false;
    for (const [, m] of this.enemyMeshes) m.visible = false;
    for (const m of this.projectileMeshes) m.visible = false;
    // Battle_Improvements.md §2.1: hide enemy HP bars when leaving combat
    if (this._enemyHpBars) for (const [, b] of this._enemyHpBars) b.group.visible = false;
    // Battle_Improvements.md §2.6: hide combat FX
    if (this._combatFxMeshes) for (const m of this._combatFxMeshes) m.visible = false;
  }

  _setupOverworldView() {
    this.waterPlane.visible = true;
    if (this.waterPlane && this._combatWaterMat) this.waterPlane.material = this._combatWaterMat;
    this.overworldRenderer.setVisible(true);
  }

  updateShip(x, y, heading) {
    if (this.shipMesh) {
      this.shipMesh.position.x = x;
      this.shipMesh.position.y = y;
      this.shipMesh.rotation.z = heading - Math.PI / 2;
    }
  }

  updateCamera(x, y) {
    // Battle_Improvements.md §2.7: apply an additive shake offset so combat
    // hits register kinesthetically. Shake decays over time; magnitude shrinks
    // proportionally to `_shakeTimeLeft / _shakeDuration`.
    let shakeX = 0;
    let shakeY = 0;
    if (this._shakeTimeLeft > 0) {
      const t = Math.max(0, this._shakeTimeLeft);
      const decay = this._shakeDuration > 0 ? t / this._shakeDuration : 0;
      const amp = (this._shakeAmplitude ?? 0) * decay;
      shakeX = (Math.random() * 2 - 1) * amp;
      shakeY = (Math.random() * 2 - 1) * amp;
    }
    this.camera.position.x = x + shakeX;
    this.camera.position.y = y + shakeY;
    this.camera.position.z = 100;
    this.camera.lookAt(x + shakeX, y + shakeY, 0);
  }

  /**
   * Battle_Improvements.md §2.7: trigger a camera shake. Call once on a hit;
   * decay is automatic via `tickShake(dt)`.
   * @param {number} amplitude  world-units of max jitter (e.g. 1.5 for a
   *                            cannon hit, 4 for a critical).
   * @param {number} duration   seconds (e.g. 0.25).
   */
  triggerShake(amplitude = 1.5, duration = 0.25) {
    // If already shaking, keep the bigger amplitude / longer remaining time so
    // overlapping hits feel additive instead of overriding each other to 0.
    this._shakeAmplitude = Math.max(this._shakeAmplitude ?? 0, amplitude);
    this._shakeDuration = Math.max(this._shakeDuration ?? 0, duration);
    this._shakeTimeLeft = Math.max(this._shakeTimeLeft ?? 0, duration);
  }

  /** Decay the shake timer. Call from the game loop every frame. */
  tickShake(dt) {
    if ((this._shakeTimeLeft ?? 0) > 0) {
      this._shakeTimeLeft -= dt;
      if (this._shakeTimeLeft <= 0) {
        this._shakeTimeLeft = 0;
        this._shakeAmplitude = 0;
        this._shakeDuration = 0;
      }
    }
  }

  /** Convert NDC (-1..1) to world XY for orthographic camera (accounts for zoom) */
  ndcToWorld(ndcX, ndcY) {
    const halfW = (this.camera.right - this.camera.left) / 2;
    const halfH = (this.camera.top - this.camera.bottom) / 2;
    const zoom = this.camera.zoom || 1;
    return {
      x: this.camera.position.x + ndcX * halfW / zoom,
      y: this.camera.position.y - ndcY * halfH / zoom,
    };
  }

  /**
   * Convert NDC to world XY for overworld hit testing.
   * Uses current camera position/zoom (set by updateOverworld) so hit test
   * matches displayed map. Returns world coords (Three.js units); Game divides
   * by worldScale for graph coords.
   */
  ndcToWorldOverworld(ndcX, ndcY, _shipPosition) {
    const zoom = this.camera.zoom || CAMERA.overworldZoom;
    const halfW = (this.camera.right - this.camera.left) / 2;
    const halfH = (this.camera.top - this.camera.bottom) / 2;
    const cx = this.camera.position.x;
    const cy = this.camera.position.y;
    return {
      x: cx + ndcX * halfW / zoom,
      y: cy + ndcY * halfH / zoom,
    };
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.left = -width / 2;
    this.camera.right = width / 2;
    this.camera.top = height / 2;
    this.camera.bottom = -height / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
