# Island Generator — 3D Gizmos & Transform Controls Research

**Document status:** Implemented  
**Last updated:** 2026-01-31  
**Target:** Add gizmo controls to move, rotate, and scale props in the island-generator-poc

---

## 1. Executive Summary

This document researches advanced 3D editing tools and gizmos for axis manipulation (move/rotate/scale), including world vs. local coordinate systems. It recommends using **Three.js TransformControls** as the primary solution and provides a phased implementation plan to add gizmo controls for prop manipulation in the island generator.

---

## 2. Coordinate Systems: World vs. Local Space

### 2.1 Definitions

| Space | Description | Use Case |
|-------|-------------|----------|
| **World space** | Global coordinate system for the scene. X, Y, Z axes are fixed regardless of object orientation. | Aligning objects to the scene (e.g., "up" is always world Y). Moving along cardinal directions. |
| **Local space** | Object's own coordinate system relative to its origin. Axes move and rotate with the object. | Manipulating along object-relative axes (e.g., "forward" of a rotated sign). |

### 2.2 Why It Matters for Gizmos

- **Translate (move):** In world space, dragging X moves along the scene's X axis. In local space, X follows the object's orientation.
- **Rotate:** In world space, rotation happens around world axes. In local space, rotation is around the object's axes.
- **Scale:** In world space, scaling affects size in world units. In local space, scaling follows the object's orientation.

### 2.3 Island Generator Context

- The island mesh has `rotation.x = -Math.PI/2` (PlaneGeometry lies in XZ, Z = height).
- Props are children of the island mesh; their local Z is "up" (height).
- For intuitive prop editing:
  - **World space** is useful for moving props along the terrain (horizontal) and height.
  - **Local space** is useful for rotating props and then moving along their "forward" direction.

---

## 3. 3D Gizmo & Transform Control Options

### 3.1 Three.js TransformControls (Recommended)

**Source:** `three/examples/jsm/controls/TransformControls.js`  
**Docs:** https://threejs.org/docs/#examples/en/controls/TransformControls

| Feature | Support |
|---------|---------|
| **Modes** | `translate`, `rotate`, `scale` |
| **Space** | `"world"` or `"local"` via `control.space` |
| **Axis visibility** | `showX`, `showY`, `showZ` |
| **Snapping** | `translationSnap`, `rotationSnap`, `scaleSnap` |
| **Size** | `size` property for gizmo scale |
| **Events** | `change`, `mouseDown`, `mouseUp`, `objectChange` |
| **Keyboard** | W=translate, E=rotate, R=scale, Q=toggle space, X=toggle snap |

**Pros:**
- Built into Three.js; no extra dependency
- Blender-like interaction (familiar to 3D artists)
- Works with OrbitControls (disables orbit when dragging)
- Supports both world and local space
- Actively maintained

**Cons:**
- Attaches to a single object; need to re-attach when selection changes
- Gizmo is in scene space; may need size tuning for small props

**Basic usage:**
```javascript
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

const transformControl = new TransformControls(camera, renderer.domElement);
transformControl.setMode('translate');
transformControl.setSpace('world');
transformControl.attach(selectedPropMesh);
scene.add(transformControl);

transformControl.addEventListener('objectChange', () => {
  // Sync prop data (chunkX, chunkY, offsetX, offsetY, rotation, scale) from mesh
});
```

### 3.2 Babylon.js Gizmo System

**Source:** https://doc.babylonjs.com/features/featuresDeepDive/mesh/gizmo

- **GizmoManager** coordinates PositionGizmo, RotationGizmo, ScaleGizmo
- **AxisDragGizmo** for per-axis dragging
- **Observables:** `onDragStartObservable`, `onDragEndObservable` for fine-grained events
- **Space:** Local and world orientation options

**Pros:** Rich API, observables for drag events  
**Cons:** Babylon.js is a different engine; would require porting the island generator.

### 3.3 Blender Gizmos (Reference)

**Source:** https://docs.blender.org/manual/en/2.81/scene_layout/object/editing/transform/control/gizmos.html

- Move: 3 arrows (X, Y, Z) + plane handles (XY, XZ, YZ)
- Rotate: 3 rings + trackball
- Scale: 3 axis handles + center box

Three.js TransformControls follows this paradigm closely.

### 3.4 Custom Gizmo Implementation

**Approach:** Build axis arrows/rings with `ArrowHelper`, `Line`, or custom geometry; use `Raycaster` for hit detection and drag logic.

**Pros:** Full control over appearance and behavior  
**Cons:** Significant development effort; TransformControls already exists and is well-tested.

---

## 4. Integration Considerations for Island Generator

### 4.1 Prop Data Model vs. Mesh Transform

Props are stored as:
- `chunkX`, `chunkY` — tile position
- `offsetX`, `offsetY` — fine offset within tile (in tile units)
- `offsetZ` — height offset above terrain (in height units, -0.5 to 0.5)
- `rotation` — degrees (0–360)
- `scale` — multiplier (0.25–100)

The mesh is positioned in island local space:
- `position`: `(centerX, centerY, terrainH + 0.01 + offsetZ * heightScale)` where `centerX/Y` derive from chunk + offset
- `rotation.z`: `-rot` (radians)
- `scale`: `tileScale * (prop.scale ?? defScale)`

**Challenge:** TransformControls modifies the mesh directly. We must:
1. **On attach:** Create a proxy/dummy object at the prop's world position, or attach to the actual prop mesh.
2. **On objectChange:** Read mesh `position`, `rotation`, `scale` and convert back to `chunkX`, `chunkY`, `offsetX`, `offsetY`, `offsetZ`, `rotation`, `scale` using inverse of the placement math.

### 4.2 OrbitControls Conflict

TransformControls and OrbitControls both listen to pointer events. The standard pattern:
- When the pointer is over the gizmo, TransformControls handles the event and OrbitControls should not rotate.
- Three.js examples typically use `controls.enabled = false` while dragging the transform control.

### 4.3 Prop Mesh Hierarchy

Prop meshes can be `Group` (FBX wrapper) or `Mesh`. TransformControls can attach to any `Object3D`. We should attach to the root prop mesh (the one in `propMeshes`) so the entire prop moves/rotates/scales as a unit.

### 4.4 Terrain Snapping (Optional)

For translate mode, we may want to snap the prop's base to the terrain height when moving. Options:
- Raycast downward from prop position to get terrain height
- Use `translationSnap` for discrete steps
- Custom `objectChange` handler that clamps Y (or Z in island space) to terrain

---

## 5. Implementation Plan

### Phase 1: TransformControls Integration (Core)

**Goal:** Add TransformControls; show gizmo when a prop is selected; support translate mode.

| Task | Description |
|------|-------------|
| 1.1 | Import `TransformControls`; instantiate with camera and renderer.domElement |
| 1.2 | Add TransformControls to scene (or as sibling of island); set `size` for visibility |
| 1.3 | On prop select: find the prop mesh in `propMeshes`, `transformControl.attach(mesh)` |
| 1.4 | On prop deselect: `transformControl.detach()` |
| 1.5 | Disable OrbitControls when pointer is over TransformControls (see Three.js examples) |
| 1.6 | `objectChange` handler: convert mesh position/rotation/scale back to prop data; update `currentIsland.props`; call `renderProps` or update the single prop's mesh |

**Coordinate conversion (objectChange):**
- Mesh `position` (in island space) → `chunkX`, `chunkY`, `offsetX`, `offsetY` (reverse of `centerX`, `centerY` formula)
- Mesh `rotation.z` → `rotation` (degrees)
- Mesh `scale` → `scale` (reverse of `propScale = tileScale * (p.scale ?? defScale)`)

### Phase 2: Rotate & Scale Modes

| Task | Description |
|------|-------------|
| 2.1 | Add UI buttons or keys: W=translate, E=rotate, R=scale |
| 2.2 | `transformControl.setMode('rotate')` / `setMode('scale')` |
| 2.3 | objectChange: handle rotation (Euler) and scale; map to prop.rotation, prop.scale |

### Phase 3: World vs. Local Space Toggle

| Task | Description |
|------|-------------|
| 3.1 | Add UI toggle or key (e.g. Q): World / Local |
| 3.2 | `transformControl.setSpace('world')` / `setSpace('local')` |
| 3.3 | Persist user preference (optional) |

### Phase 4: Polish

| Task | Description |
|------|-------------|
| 4.1 | Terrain height snapping for translate (optional) |
| 4.2 | Translation/rotation snap for grid alignment (optional) |
| 4.3 | Gizmo size adapts to prop scale or camera distance |
| 4.4 | Ensure gizmo is visible (layers, render order) |

---

## 6. Recommended Approach

**Use Three.js TransformControls** as the primary solution:

1. **Low effort:** Already in the project's Three.js dependency
2. **Proven:** Used in official Three.js editor example
3. **Feature-complete:** Translate, rotate, scale; world/local space
4. **Compatible:** Works with OrbitControls with standard disable-on-drag pattern

**Implementation order:**
1. Phase 1 (translate only) — validate coordinate conversion and selection flow
2. Phase 2 (rotate, scale) — extend objectChange logic
3. Phase 3 (space toggle) — single property change
4. Phase 4 (polish) — as needed

---

## 7. References

- [Three.js TransformControls](https://threejs.org/docs/#examples/en/controls/TransformControls)
- [Three.js TransformControls Example](https://threejs.org/examples/misc_controls_transform.html)
- [Three.js TransformControls Source](https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js)
- [Babylon.js Gizmos](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gizmo)
- [Unity Gizmos Matrix (world/local)](https://docs.unity3d.com/ScriptReference/Gizmos-matrix.html)
- [Local vs. World Space (Unity)](https://jon-jenkins.medium.com/local-space-vs-world-space-for-3d-objects-in-unity-3a966754b5a2)

---

## 8. Implementation Status

**Status:** Implemented (2026-01-31)

### Phase 1: TransformControls Integration (Core) — Done

| Task | Status |
|------|--------|
| 1.1 Import TransformControls; instantiate with camera and renderer.domElement | Done |
| 1.2 Add TransformControls to scene when attached; set `size` (0.8) for visibility | Done — gizmo added only when prop selected; removed when detached |
| 1.3 On prop select: find mesh in `propMeshes`, `transformControl.attach(mesh)` | Done via `setPropGizmoAttached()` |
| 1.4 On prop deselect: `transformControl.detach()` | Done via `detachPropGizmo()` |
| 1.5 Disable OrbitControls when dragging (`dragging-changed` event) | Done |
| 1.6 objectChange handler: convert mesh → prop data; update prop; callback | Done in `_onGizmoObjectChange()` |

### Phase 2: Rotate & Scale Modes — Done

| Task | Status |
|------|--------|
| 2.1 UI buttons and keys: W=translate, E=rotate, R=scale | Done |
| 2.2 `setMode('rotate')` / `setMode('scale')` | Done via `setGizmoMode()` |
| 2.3 objectChange: handle rotation and scale; map to prop.rotation, prop.scale | Done |

### Phase 3: World vs. Local Space Toggle — Done

| Task | Status |
|------|--------|
| 3.1 UI toggle (Q key): World / Local | Done |
| 3.2 `setSpace('world')` / `setSpace('local')` | Done via `setGizmoSpace()` |

### Phase 4: Polish — Done

| Task | Status |
|------|--------|
| 4.1 Terrain height snapping for translate | Done — Z snaps to terrain at new tile |
| 4.2 Translation/rotation snap for grid alignment | Done — Snap button (X key); translationSnap = 1/tiles, rotationSnap = 15°, scaleSnap = 0.1 |
| 4.3 Gizmo size adapts to prop scale or camera distance | Done — Size scales with camera distance in animate loop |
| 4.4 Ensure gizmo is visible (layers, render order) | Done — `transformControls.layers.enableAll()` |

### Key Files

- **IslandVisualizer.js** — `TransformControls`, `getPropMeshForProp()`, `setPropGizmoAttached()`, `detachPropGizmo()`, `setGizmoMode()`, `setGizmoSpace()`, `setGizmoSnap()`, `isGizmoSnapEnabled()`, `_applyGizmoSnap()`, `_onGizmoObjectChange()`, gizmo size adapts in `animate()`
- **main.js** — `syncPropGizmo()`, `setOnPropTransformChange()`, gizmo UI handlers, W/E/R/Q/X keyboard shortcuts
- **index.html** — Gizmo toolbar (Move, Rotate, Scale, World/Local, Snap) in Selected Prop panel

### Usage (when a prop is selected)

| Key | Action |
|-----|--------|
| W | Move (translate) mode |
| E | Rotate mode |
| R | Scale mode |
| Q | Toggle World / Local space |
| X | Toggle Snap to grid (translation = 1 tile, rotation = 15°, scale = 0.1) |
| Escape | Deselect prop |

### Prop Selection (Build Mode Off) — Performance

When build mode is off, prop selection is optimized for responsiveness:

- **No unnecessary re-renders:** `renderProps` and `onPropsChange` are only called when props are actually added or removed, not on simple select/deselect.
- **Throttled hover:** Mousemove hover logic runs at most once per frame via `requestAnimationFrame`.
- **Highlight caching:** `setPropHighlight` skips recreation when the same prop is already highlighted.
- **Raycaster reuse:** `pickPropAt` reuses a single raycaster instance instead of allocating per call.
- **Prop-only raycast:** `pickPropAt` raycasts against `propMeshes` directly (not the island mesh), so terrain never occludes tall props like trees.
- **Escape to deselect:** Press Escape to deselect the current prop (avoids conflicting with OrbitControls on click).
- **Mouse coordinate mapping:** Uses the renderer canvas rect (not the container) for NDC conversion, matching Three.js OrbitControls/TransformControls for accurate raycast alignment.

### Gizmo — FPS Optimizations

- **Remove from scene when detached:** TransformControls is removed from the scene when no prop is selected, reducing per-frame work (raycasting, event handling) when idle.
- **Size update throttled:** Gizmo size adapts to camera distance every 10 frames (not every frame), and only when an object is attached.

### Gizmo — Accurate Mouse Offsets During Drag

- **Immediate render on objectChange:** When the gizmo fires `objectChange` during drag, we call `renderer.render()` immediately so the prop position (including terrain Z snap) updates without waiting for the next animation frame. This keeps the visual feedback aligned with the mouse.
