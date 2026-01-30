/**
 * YoHoH — Three.js renderer (orthographic top-down)
 * Phase A: Combat arena, ships, projectiles, cannon arcs, rocks
 */

import * as THREE from 'three';
import { CAMERA, COMBAT, OVERWORLD, OVERWORLD_RENDER, RENDER, SAILING_RENDER, SHIP_GEOMETRY } from './config.js';
import { getCombatRenderConfig, getOverworldRenderConfig, getSailingRenderConfig } from './render/RenderConfig.js';

export class Renderer {
  constructor(container) {
    this.container = container;
    this.lastOverworldZoom = CAMERA.overworldZoom ?? 0.25;
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
    this.overworldGroup = null;
    this.overworldShipMesh = null;
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
    this._createOverworld();
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

    // Rocks
    this.rocksGroup = new THREE.Group();
    this.scene.add(this.rocksGroup);
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

  _createOverworld() {
    this.overworldGroup = new THREE.Group();
    this.overworldGroup.visible = false;
    this.scene.add(this.overworldGroup);

    const shipGeo = new THREE.ConeGeometry(RENDER.overworldShipRadius, RENDER.overworldShipHeight, RENDER.overworldShipSegments);
    const shipMat = new THREE.MeshBasicMaterial({ color: RENDER.shipOverworldColor });
    this.overworldShipMesh = new THREE.Mesh(shipGeo, shipMat);
    this.overworldShipMesh.rotation.x = Math.PI / 2;
    this.overworldShipMesh.position.z = 1;
    this.overworldGroup.add(this.overworldShipMesh);
  }

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

    const shipGeo = new THREE.ConeGeometry(cfg.ship.radius, cfg.ship.height, cfg.ship.segments);
    const shipMat = new THREE.MeshBasicMaterial({ color: cfg.ship.color });
    this.sailingShipMesh = new THREE.Mesh(shipGeo, shipMat);
    this.sailingShipMesh.position.z = 1;
    this.sailingGroup.add(this.sailingShipMesh);

    const destGeo = new THREE.CircleGeometry(cfg.destMarker.radius, RENDER.sailingDestSegments);
    const destMat = new THREE.MeshBasicMaterial({
      color: cfg.destMarker.color,
      transparent: true,
      opacity: cfg.destMarker.opacity,
    });
    this.sailingDestMesh = new THREE.Mesh(destGeo, destMat);
    this.sailingDestMesh.position.z = 0.5;
    this.sailingGroup.add(this.sailingDestMesh);

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

  updateCombat(player, enemies, projectiles, rocks, aimingSide) {
    this._hideNonCombatViews();
    this._setupCombatView();
    this._updateCombatEntities(player, enemies, projectiles, rocks, aimingSide);
  }

  _hideNonCombatViews() {
    this.overworldGroup.visible = false;
    this.sailingGroup.visible = false;
  }

  _setupCombatView() {
    const cfg = getCombatRenderConfig();
    this.waterPlane.visible = true;
    this.waterPlane.scale.set(1, 1, 1);
    this.waterPlane.position.set(0, 0, 0);
    if (this.waterPlane && this._combatWaterMat) this.waterPlane.material = this._combatWaterMat;
    if (this.arenaBorder) this.arenaBorder.visible = true;
    this.camera.zoom = cfg.camera.zoom;
    this.camera.updateProjectionMatrix();
  }

  _updateCombatEntities(player, enemies, projectiles, rocks, aimingSide) {
    const cfg = getCombatRenderConfig();
    if (this.shipMesh && player && !player.dead) {
      this.shipMesh.visible = true;
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
      if (e.dead) continue;
      activeIds.add(e.id);
      const mesh = this._getOrCreateEnemyMesh(e.id);
      mesh.visible = true;
      mesh.position.set(e.x, e.y, 1);
      mesh.rotation.z = -e.rotation;
    }
    for (const [id, mesh] of this.enemyMeshes) {
      if (!activeIds.has(id)) mesh.visible = false;
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

    while (this.rocksGroup.children.length > 0) this.rocksGroup.remove(this.rocksGroup.children[0]);
    for (const r of rocks || []) {
      const geometry = new THREE.CircleGeometry(r.r, cfg.rock.segments);
      const material = new THREE.MeshBasicMaterial({ color: cfg.rock.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(r.x, r.y, 0.5);
      this.rocksGroup.add(mesh);
    }
  }

  updateSailing(sailingShip, shipPosition, travelRoute) {
    this._hideNonSailingViews();
    this._setupSailingView(shipPosition);
    this._updateSailingEntities(sailingShip, shipPosition, travelRoute);
    this._updateSailingCamera(shipPosition);
  }

  _hideNonSailingViews() {
    this.overworldGroup.visible = false;
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

  _updateSailingEntities(sailingShip, shipPosition, travelRoute) {
    const cfg = getSailingRenderConfig();
    const sx = shipPosition.x * cfg.worldScale;
    const sy = shipPosition.y * cfg.worldScale;

    if (sailingShip && this.shipMesh) {
      this.shipMesh.visible = true;
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
    } else {
      this.sailingPathMesh.visible = false;
      this.sailingDestMesh.visible = false;
      if (this.sailingOriginIslandMesh) this.sailingOriginIslandMesh.visible = false;
      if (this.sailingDestIslandMesh) this.sailingDestIslandMesh.visible = false;
    }

    if (this.sailingShipMesh) this.sailingShipMesh.visible = !sailingShip;
  }

  _updateSailingCamera(shipPosition) {
    const cfg = getSailingRenderConfig();
    const sx = shipPosition.x * cfg.worldScale;
    const sy = shipPosition.y * cfg.worldScale;
    this.camera.zoom = cfg.camera.zoom;
    this.camera.position.set(sx, sy, cfg.camera.positionZ);
    this.camera.lookAt(sx, sy, 0);
    this.camera.updateProjectionMatrix();
  }

  updateOverworld(map, shipPosition, currentIsland, displayRoute = null, isSelected = false, pan = { x: 0, y: 0 }, zoomLevel = 1) {
    this._hideNonOverworldViews();
    this._setupOverworldView();
    if (!map) return;
    this._updateOverworldEntities(map, shipPosition, currentIsland, displayRoute, isSelected);
    this._updateOverworldCamera(map, pan, zoomLevel);
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
  }

  _setupOverworldView() {
    this.waterPlane.visible = true;
    if (this.waterPlane && this._combatWaterMat) this.waterPlane.material = this._combatWaterMat;
    this.overworldGroup.visible = true;
    while (this.overworldGroup.children.length > 1) {
      this.overworldGroup.remove(this.overworldGroup.children[1]);
    }
  }

  _updateOverworldEntities(map, shipPosition, currentIsland, displayRoute, isSelected) {
    const cfg = getOverworldRenderConfig();
    const { worldScale, islandRadius, routeWidth } = cfg;

    for (const edge of map.edges) {
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
      const color = isThisSelected ? cfg.route.selectedColor : (isDisplayed ? cfg.route.hoverColor : cfg.route.color);

      if (isThisSelected && cfg.route.outlineWidth > 0) {
        const outlineW = routeWidth * widthMult + cfg.route.outlineWidth * 2;
        const outlineGeo = new THREE.PlaneGeometry(len, outlineW);
        const outlineMat = new THREE.MeshBasicMaterial({ color: cfg.route.outlineColor, side: THREE.DoubleSide });
        const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
        outlineMesh.position.set((ax + bx) / 2, (ay + by) / 2, 0.05);
        outlineMesh.rotation.z = Math.atan2(dy, dx);
        this.overworldGroup.add(outlineMesh);
      }

      const geo = new THREE.PlaneGeometry(len, routeWidth * widthMult);
      const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((ax + bx) / 2, (ay + by) / 2, 0.1);
      mesh.rotation.z = Math.atan2(dy, dx);
      this.overworldGroup.add(mesh);
    }

    for (const node of map.nodes) {
      const isCurrent = node === currentIsland;
      const radiusMult = isCurrent ? cfg.island.currentRadiusMult : 1;
      const r = islandRadius * radiusMult;
      const geo = new THREE.CircleGeometry(r, 20);
      const baseColor = node === map.homeNode ? cfg.island.homeColor : node.dangerous ? cfg.island.dangerColor : node.appealing ? cfg.island.appealColor : cfg.island.defaultColor;
      const color = isCurrent ? cfg.island.currentColor : baseColor;
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(node.position.x * worldScale, node.position.y * worldScale, 0.2);
      this.overworldGroup.add(mesh);

      if (isCurrent && cfg.island.currentRingWidth > 0) {
        const ringGeo = new THREE.RingGeometry(r, r + cfg.island.currentRingWidth, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: cfg.island.currentRingColor, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(node.position.x * worldScale, node.position.y * worldScale, 0.21);
        this.overworldGroup.add(ringMesh);
      }
    }

    this.overworldShipMesh.position.set(shipPosition.x * worldScale, shipPosition.y * worldScale, 1);
    this.overworldShipMesh.visible = true;
  }

  _updateOverworldCamera(map, pan, zoomLevel) {
    const cfg = getOverworldRenderConfig();
    const xs = map.nodes.map(n => n.position.x * cfg.worldScale);
    const ys = map.nodes.map(n => n.position.y * cfg.worldScale);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const rangeX = Math.max(maxX - minX, 100);
    const rangeY = Math.max(maxY - minY, 100);
    const baseCx = (minX + maxX) / 2;
    const baseCy = (minY + maxY) / 2;
    const padding = 1.15;
    const halfW = (this.camera.right - this.camera.left) / 2;
    const halfH = (this.camera.top - this.camera.bottom) / 2;
    const zoomX = halfW / (rangeX * padding / 2);
    const zoomY = halfH / (rangeY * padding / 2);
    const baseZoom = Math.min(zoomX, zoomY, cfg.camera.overworldZoom);
    const zoom = baseZoom * (zoomLevel ?? 1);
    this.lastOverworldZoom = zoom;
    const cx = baseCx + (pan?.x ?? 0);
    const cy = baseCy + (pan?.y ?? 0);
    this.camera.zoom = zoom;
    this.camera.position.set(cx, cy, cfg.camera.positionZ);
    this.camera.lookAt(cx, cy, 0);
    this.camera.updateProjectionMatrix();
  }

  updateShip(x, y, heading) {
    if (this.shipMesh) {
      this.shipMesh.position.x = x;
      this.shipMesh.position.y = y;
      this.shipMesh.rotation.z = heading - Math.PI / 2;
    }
  }

  updateCamera(x, y) {
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = 100;
    this.camera.lookAt(x, y, 0);
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
