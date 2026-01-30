/**
 * YoHoH — Three.js renderer (orthographic top-down)
 * Phase A: Combat arena, ships, projectiles, cannon arcs, rocks
 */

import * as THREE from 'three';
import { WORLD, CAMERA, COMBAT } from './config.js';

export class Renderer {
  constructor(container) {
    this.container = container;
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
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.OrthographicCamera(
      -width / 2, width / 2,
      height / 2, -height / 2,
      CAMERA.near, CAMERA.far
    );
    this.camera.position.set(0, 0, 100);
    this.camera.zoom = CAMERA.zoom;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a1628);
    this.container.appendChild(this.renderer.domElement);

    this._createCombatArena();
    this._createShip();
    this._createCannonArcs();
    this._createProjectilePool();

    window.addEventListener('resize', () => this.onResize());
  }

  _createCombatArena() {
    const { arenaWidth, arenaHeight } = COMBAT;
    const geometry = new THREE.PlaneGeometry(arenaWidth * 2, arenaHeight * 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x1e3a5f,
      side: THREE.DoubleSide,
    });
    this.waterPlane = new THREE.Mesh(geometry, material);
    this.waterPlane.position.z = 0;
    this.scene.add(this.waterPlane);

    // Arena border (wireframe)
    const borderGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(arenaWidth * 2, arenaHeight * 2));
    const borderMat = new THREE.LineBasicMaterial({ color: 0x4a6fa5, linewidth: 2 });
    this.arenaBorder = new THREE.LineSegments(borderGeo, borderMat);
    this.arenaBorder.position.z = 0.5;
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
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 1.5, bevelEnabled: false });
    const hullMat = new THREE.MeshBasicMaterial({ color: 0x5c4033 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.z = 0.75;
    shipGroup.add(hull);

    // Mast
    const mastGeo = new THREE.BoxGeometry(0.8, 10, 0.8);
    const mastMat = new THREE.MeshBasicMaterial({ color: 0x3d2817 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 2, 2);
    shipGroup.add(mast);

    // Sails (rectangular)
    const sailGeo = new THREE.PlaneGeometry(6, 8);
    const sailMat = new THREE.MeshBasicMaterial({ color: 0xe8dcc8, side: THREE.DoubleSide });
    const sail = new THREE.Mesh(sailGeo, sailMat);
    sail.position.set(0, 2, 6);
    shipGroup.add(sail);

    this.shipMesh = shipGroup;
    this.shipMesh.position.set(0, 0, 1);
    this.shipMesh.rotation.z = 0;
    this.scene.add(this.shipMesh);

    // Aim arrow as child of ship — inherits ship rotation, only needs port/starboard offset
    const coneGeo = new THREE.ConeGeometry(6, COMBAT.cannonRange * 0.6, 8);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.7,
    });
    this.aimArrowMesh = new THREE.Mesh(coneGeo, coneMat);
    this.aimArrowMesh.position.z = -0.7;
    this.aimArrowMesh.visible = false;
    this.shipMesh.add(this.aimArrowMesh);
  }

  _createCannonArcs() {
    const arcGeo = this._createArcGeometry(COMBAT.cannonRange, COMBAT.cannonArcDeg);
    const portMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const starboardMat = new THREE.MeshBasicMaterial({
      color: 0x00cc66,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    this.portArcMesh = new THREE.Mesh(arcGeo, portMat);
    this.starboardArcMesh = new THREE.Mesh(arcGeo, starboardMat);
    this.portArcMesh.position.z = 0.2;
    this.starboardArcMesh.position.z = 0.2;
    this.scene.add(this.portArcMesh);
    this.scene.add(this.starboardArcMesh);
  }

  _createArcGeometry(radius, arcDeg) {
    const segments = 16;
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
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 1.2, bevelEnabled: false });
    const hullMat = new THREE.MeshBasicMaterial({ color: 0x8b0000 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.z = 0.6;
    group.add(hull);
    const mastGeo = new THREE.BoxGeometry(0.6, 8, 0.6);
    const mastMat = new THREE.MeshBasicMaterial({ color: 0x4a2511 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 1.5, 1.5);
    group.add(mast);
    const sailGeo = new THREE.PlaneGeometry(4, 6);
    const sailMat = new THREE.MeshBasicMaterial({ color: 0x8b4513, side: THREE.DoubleSide });
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
      const geometry = new THREE.ConeGeometry(2, 6, 6);
      const material = new THREE.MeshBasicMaterial({ color: 0x444444 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = 2;
      this.scene.add(mesh);
      this.projectileMeshes.push(mesh);
    }
    return this.projectileMeshes[i];
  }

  updateCombat(player, enemies, projectiles, rocks, aimingSide) {
    // Player ship — forward = (sin r, cos r), bow points +Y when r=0, so rotation.z = -r
    if (this.shipMesh && player && !player.dead) {
      this.shipMesh.visible = true;
      this.shipMesh.position.x = player.x;
      this.shipMesh.position.y = player.y;
      this.shipMesh.rotation.z = -player.rotation;

      // Cannon arcs (follow player). Arc geometry center = +Y; port center = π + rotation, starboard = -rotation
      this.portArcMesh.visible = true;
      this.starboardArcMesh.visible = true;
      this.portArcMesh.position.set(player.x, player.y, 0.2);
      this.starboardArcMesh.position.set(player.x, player.y, 0.2);
      const portCenter = Math.PI - player.rotation;
      const starboardCenter = -player.rotation;
      this.portArcMesh.rotation.z = portCenter - Math.PI / 2;
      this.starboardArcMesh.rotation.z = starboardCenter - Math.PI / 2;

      // Aim arrow — child of ship, so inherits ship rotation. Only set local offset for port/starboard.
      // Ship forward = +Y. Port = left = -X (CCW +90°); starboard = right = +X (CW -90°)
      if (aimingSide) {
        this.aimArrowMesh.visible = true;
        this.aimArrowMesh.rotation.z = aimingSide === 'port' ? Math.PI / 2 : -Math.PI / 2;
        this.aimArrowMesh.material.color.setHex(aimingSide === 'port' ? 0xff6600 : 0x00cc66);
      } else {
        this.aimArrowMesh.visible = false;
      }
    } else {
      this.shipMesh.visible = false;
      this.portArcMesh.visible = false;
      this.starboardArcMesh.visible = false;
      this.aimArrowMesh.visible = false;
    }

    // Enemies
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

    // Projectiles
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

    // Rocks
    while (this.rocksGroup.children.length > 0) {
      this.rocksGroup.remove(this.rocksGroup.children[0]);
    }
    for (const r of rocks || []) {
      const geometry = new THREE.CircleGeometry(r.r, 12);
      const material = new THREE.MeshBasicMaterial({ color: 0x4a3728 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(r.x, r.y, 0.5);
      this.rocksGroup.add(mesh);
    }
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
