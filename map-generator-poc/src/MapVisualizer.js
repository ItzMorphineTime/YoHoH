/**
 * Three.js visualizer for procedural archipelago map
 * Nodes = islands (circles), edges = routes (lines)
 */

import * as THREE from 'three';

export class MapVisualizer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.meshes = [];
    this.nodeMeshes = [];
    this.edgeMeshes = [];
    this.gizmoMeshes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
    this.intersectPoint = new THREE.Vector3();
    this.onNodeClick = null;
    this.onEdgeClick = null;
    this.onNodeMove = null;
    this.onBackgroundClick = null;
    this.currentMap = null;
    this.selectedNode = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._scale = 1;
    this._dragging = null;
    this._pendingClick = null;
    this._pendingEdgeClick = null;
    this._pendingBackgroundClick = null;
    this._clickThreshold = 6;
    this._hoveredGizmoAxis = null; // 'x' | 'y' | null
    this._panning = null;
    this._userPanX = 0;
    this._userPanY = 0;
    this._userZoom = 1;
    this.mapGroup = new THREE.Group();
    this.nodeSizeScale = 100;
    this.edgeThicknessScale = 100;
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.OrthographicCamera(
      -width / 2, width / 2,
      height / 2, -height / 2,
      0.1, 1000
    );
    this.camera.position.z = 100;
    this.camera.zoom = 0.8;
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a1628);
    this.container.appendChild(this.renderer.domElement);
    this.scene.add(this.mapGroup);

    window.addEventListener('resize', () => this.onResize());
    const canvas = this.renderer.domElement;
    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    canvas.addEventListener('mouseleave', (e) => {
      this._panning = null;
      this._hoveredGizmoAxis = null;
      this.container.style.cursor = this.getCursor ? this.getCursor() : 'default';
      this.onMouseUp(e);
      if (this.selectedNode && this.currentMap) this.render(this.currentMap);
    });
  }

  setEditCallbacks(onNodeClick, onEdgeClick, onNodeMove, onBackgroundClick, getCursor) {
    this.onNodeClick = onNodeClick;
    this.onEdgeClick = onEdgeClick;
    this.onNodeMove = onNodeMove;
    this.onBackgroundClick = onBackgroundClick;
    this.getCursor = getCursor ?? (() => 'pointer');
  }

  setSelectedNode(node) {
    this.selectedNode = node;
  }

  setAppearance(nodeSizeScale = 1, edgeThicknessScale = 1) {
    this.nodeSizeScale = nodeSizeScale;
    this.edgeThicknessScale = edgeThicknessScale;
  }

  /** Get map coordinates from mouse using raycast + plane intersection */
  getMouseMapPos(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.raycaster.ray.intersectPlane(this.plane, this.intersectPoint);
    return {
      x: this.intersectPoint.x / this._scale + this._offsetX,
      y: this.intersectPoint.y / this._scale + this._offsetY,
    };
  }

  getHitTarget(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const clickables = [...this.gizmoMeshes, ...this.nodeMeshes, ...this.edgeMeshes];
    const intersects = this.raycaster.intersectObjects(clickables);
    return intersects.length > 0 ? intersects[0] : null;
  }

  onMouseDown(event) {
    if (event.button === 1) {
      this._panning = { startX: event.clientX, startY: event.clientY, startPanX: this._userPanX, startPanY: this._userPanY };
      this.container.style.cursor = 'grabbing';
      event.preventDefault();
      return;
    }
    if (event.button !== 0) return;
    const hit = this.getHitTarget(event);
    if (!hit) {
      this._pendingBackgroundClick = {
        startX: event.clientX,
        startY: event.clientY,
        mapPos: this.getMouseMapPos(event),
      };
      return;
    }
    const ud = hit.object.userData;
    if (ud.type === 'gizmo-axis' && ud.axis && ud.node) {
      this._dragging = {
        node: ud.node,
        axis: ud.axis,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
    } else if ((ud.type === 'node' || ud.type === 'gizmo') && ud.node) {
      this._pendingClick = {
        node: ud.node,
        startX: event.clientX,
        startY: event.clientY,
      };
    } else if (ud.type === 'edge' && ud.a && ud.b) {
      this._pendingEdgeClick = {
        a: ud.a,
        b: ud.b,
        startX: event.clientX,
        startY: event.clientY,
      };
    }
  }

  onMouseMove(event) {
    if (this._pendingBackgroundClick) {
      const dx = event.clientX - this._pendingBackgroundClick.startX;
      const dy = event.clientY - this._pendingBackgroundClick.startY;
      if (Math.abs(dx) > this._clickThreshold || Math.abs(dy) > this._clickThreshold) {
        this._pendingBackgroundClick = null;
      }
    }
    if (this._panning) {
      this._userPanX = this._panning.startPanX + (event.clientX - this._panning.startX);
      this._userPanY = this._panning.startPanY - (event.clientY - this._panning.startY);
      this.mapGroup.position.set(this._userPanX, this._userPanY, 0);
      this.renderer.render(this.scene, this.camera);
      return;
    }
    if (this._pendingClick) {
      const dx = event.clientX - this._pendingClick.startX;
      const dy = event.clientY - this._pendingClick.startY;
      if (Math.abs(dx) > this._clickThreshold || Math.abs(dy) > this._clickThreshold) {
        this._pendingClick = null;
      }
    }
    if (this._pendingEdgeClick) {
      const dx = event.clientX - this._pendingEdgeClick.startX;
      const dy = event.clientY - this._pendingEdgeClick.startY;
      if (Math.abs(dx) > this._clickThreshold || Math.abs(dy) > this._clickThreshold) {
        this._pendingEdgeClick = null;
      }
    }
    if (!this._dragging && this.selectedNode && this.gizmoMeshes.length > 0) {
      const hit = this.getHitTarget(event);
      const prev = this._hoveredGizmoAxis;
      this._hoveredGizmoAxis = hit?.object?.userData?.type === 'gizmo-axis' ? hit.object.userData.axis : null;
      if (prev !== this._hoveredGizmoAxis && this.currentMap) {
        this.render(this.currentMap);
      }
      if (this._hoveredGizmoAxis === 'x') this.container.style.cursor = 'ew-resize';
      else if (this._hoveredGizmoAxis === 'y') this.container.style.cursor = 'ns-resize';
      else if (this.getCursor) this.container.style.cursor = this.getCursor();
    }
    if (this._dragging) {
      const dx = event.clientX - this._dragging.startX;
      const dy = event.clientY - this._dragging.startY;
      if (!this._dragging.moved && (Math.abs(dx) > this._clickThreshold || Math.abs(dy) > this._clickThreshold)) {
        this._dragging.moved = true;
        this.container.style.cursor = this._dragging.axis === 'x' ? 'ew-resize' : this._dragging.axis === 'y' ? 'ns-resize' : 'grabbing';
      }
      if (this._dragging.moved && this.onNodeMove) {
        const mapPos = this.getMouseMapPos(event);
        if (this._dragging.axis === 'x') {
          this._dragging.node.position.x = mapPos.x;
        } else if (this._dragging.axis === 'y') {
          this._dragging.node.position.y = mapPos.y;
        } else {
          this._dragging.node.position.x = mapPos.x;
          this._dragging.node.position.y = mapPos.y;
        }
        this.onNodeMove(this._dragging.node);
      }
    }
  }

  onMouseUp(event) {
    if (event?.button === 1) {
      this._panning = null;
      this.container.style.cursor = this.getCursor ? this.getCursor() : 'default';
      return;
    }
    if (this._dragging) {
      this._dragging = null;
      this.container.style.cursor = this.getCursor ? this.getCursor() : 'default';
    }
    if (this._pendingClick && this.onNodeClick) {
      this.onNodeClick(this._pendingClick.node);
      this._pendingClick = null;
    }
    if (this._pendingEdgeClick && this.onEdgeClick) {
      this.onEdgeClick(this._pendingEdgeClick.a, this._pendingEdgeClick.b);
      this._pendingEdgeClick = null;
    }
    if (this._pendingBackgroundClick && this.onBackgroundClick) {
      this.onBackgroundClick(this._pendingBackgroundClick.mapPos);
      this._pendingBackgroundClick = null;
    }
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

  clear() {
    [...this.meshes, ...this.gizmoMeshes].forEach(m => {
      this.mapGroup.remove(m);
      if (m.geometry) m.geometry.dispose();
      if (m.material) m.material.dispose();
    });
    this.meshes = [];
    this.nodeMeshes = [];
    this.edgeMeshes = [];
    this.gizmoMeshes = [];
  }

  onWheel(event) {
    event.preventDefault();
    const delta = -event.deltaY * 0.001;
    this._userZoom = Math.max(0.3, Math.min(4, this._userZoom * (1 + delta)));
    this.mapGroup.scale.set(this._userZoom, this._userZoom, 1);
    this.renderer.render(this.scene, this.camera);
  }

  render(map) {
    this.clear();
    this.currentMap = map;

    const { nodes, edges, homeNode } = map;

    const positions = nodes.map(n => n.position);
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));
    const pad = 80;
    const scale = Math.min(
      (this.container.clientWidth - pad) / (maxX - minX || 1),
      (this.container.clientHeight - pad) / (maxY - minY || 1)
    );
    const offsetX = (minX + maxX) / 2;
    const offsetY = (minY + maxY) / 2;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this._scale = scale;

    function toScreen(p) {
      return [(p.x - offsetX) * scale, (p.y - offsetY) * scale];
    }

    const baseRadius = 8;
    const homeRadius = 14;
    const nodeRadius = (isHome) => (isHome ? homeRadius : baseRadius) * (this.nodeSizeScale / 100);
    const edgeWidth = Math.max(1, 2 * (this.edgeThicknessScale / 100));

    for (const { a, b } of edges) {
      const [x1, y1] = toScreen(a.position);
      const [x2, y2] = toScreen(b.position);
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y1, 0),
        new THREE.Vector3(x2, y2, 0),
      ]);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x5a9fd4, linewidth: edgeWidth }));
      line.userData = { type: 'edge', a, b };
      this.mapGroup.add(line);
      this.meshes.push(line);
      this.edgeMeshes.push(line);
    }

    const maxDist = Math.max(...nodes.map(n => n.distanceFromHome), 1);
    for (const node of nodes) {
      const [x, y] = toScreen(node.position);
      const isHome = node === homeNode;
      const radius = nodeRadius(isHome);

      const geometry = new THREE.CircleGeometry(radius, 24);
      const color = isHome
        ? 0x7eb8da
        : node.dangerous
          ? 0xc45c5c
          : node.appealing
            ? 0x5cb85c
            : 0x6b7b8a;
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
      const circle = new THREE.Mesh(geometry, material);
      circle.position.set(x, y, 1);
      circle.userData = { type: 'node', node };
      this.mapGroup.add(circle);
      this.meshes.push(circle);
      this.nodeMeshes.push(circle);

      if (!isHome && node.distanceFromHome > 0) {
        const ringGeometry = new THREE.RingGeometry(radius, radius + 3, 24);
        const t = node.distanceFromHome / maxDist;
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.6 - t * 0.4, 0.6, 0.5),
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(x, y, 0.5);
        ring.userData = { type: 'node', node };
        this.mapGroup.add(ring);
        this.meshes.push(ring);
        this.nodeMeshes.push(ring);
      }
    }

    if (this.selectedNode) {
      const [gx, gy] = toScreen(this.selectedNode.position);
      const nodeRad = nodeRadius(this.selectedNode === homeNode);
      const gizmoRadius = nodeRad + 10;
      const offset = gizmoRadius + 6;
      const axisLen = 24;
      const handleWidth = 8;
      const baseOpacity = 0.45;
      const hoverOpacity = 1;

      const centerGeom = new THREE.CircleGeometry(gizmoRadius * 0.4, 16);
      const centerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
      });
      const center = new THREE.Mesh(centerGeom, centerMat);
      center.position.set(gx, gy, 2);
      center.userData = { type: 'gizmo', node: this.selectedNode };
      this.mapGroup.add(center);
      this.gizmoMeshes.push(center);

      const ringGeom = new THREE.RingGeometry(gizmoRadius, gizmoRadius + 3, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x6b7280,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(gx, gy, 2);
      ring.userData = { type: 'gizmo', node: this.selectedNode };
      this.mapGroup.add(ring);
      this.gizmoMeshes.push(ring);

      const xOpacity = this._hoveredGizmoAxis === 'x' ? hoverOpacity : baseOpacity;
      const xHandleGeom = new THREE.BoxGeometry(axisLen, handleWidth, 2);
      const xHandle = new THREE.Mesh(
        xHandleGeom,
        new THREE.MeshBasicMaterial({
          color: 0xe74c3c,
          transparent: true,
          opacity: xOpacity,
        })
      );
      xHandle.position.set(gx + offset + axisLen / 2, gy, 2);
      xHandle.userData = { type: 'gizmo-axis', axis: 'x', node: this.selectedNode };
      this.mapGroup.add(xHandle);
      this.gizmoMeshes.push(xHandle);

      const yOpacity = this._hoveredGizmoAxis === 'y' ? hoverOpacity : baseOpacity;
      const yHandleGeom = new THREE.BoxGeometry(handleWidth, axisLen, 2);
      const yHandle = new THREE.Mesh(
        yHandleGeom,
        new THREE.MeshBasicMaterial({
          color: 0x2ecc71,
          transparent: true,
          opacity: yOpacity,
        })
      );
      yHandle.position.set(gx, gy + offset + axisLen / 2, 2);
      yHandle.userData = { type: 'gizmo-axis', axis: 'y', node: this.selectedNode };
      this.mapGroup.add(yHandle);
      this.gizmoMeshes.push(yHandle);
    }

    this.mapGroup.position.set(this._userPanX, this._userPanY, 0);
    this.mapGroup.scale.set(this._userZoom, this._userZoom, 1);
    this.renderer.render(this.scene, this.camera);
  }
}
