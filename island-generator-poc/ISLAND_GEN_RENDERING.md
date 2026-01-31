# Island Generator — Rendering & Post-Processing Research

**Document status:** Research Reference  
**Last updated:** 2026-01-31  
**Purpose:** Document rendering optimization techniques, post-processing options, and implementation guidance for the island-generator-poc  

**Tech stack:** Three.js r160, WebGLRenderer, Vite  

---

## Table of Contents

1. [Rendering Optimization Techniques](#1-rendering-optimization-techniques)
2. [Post-Processing Techniques & Controls](#2-post-processing-techniques--controls)
3. [Water & Ocean Rendering](#3-water--ocean-rendering)
4. [Implementation Recommendations](#4-implementation-recommendations)

---

## 1. Rendering Optimization Techniques

### 1.1 Current State (IslandVisualizer.js)

| Aspect | Current | Notes |
|--------|---------|-------|
| **Renderer** | WebGLRenderer, `powerPreference: 'high-performance'` | ✓ Good |
| **Pixel ratio** | `Math.min(devicePixelRatio, 2)` | ✓ Caps cost on HiDPI |
| **Shadows** | BasicShadowMap, 512×512, tightened frustum | ✓ Optimized |
| **Terrain** | PlaneGeometry + vertex colors, MeshLambertMaterial | Single mesh |
| **Props** | Individual meshes per prop (FBX clones) | Draw-call heavy |
| **Buildings** | BoxGeometry per building | Moderate |
| **Water** | Flat PlaneGeometry, MeshLambertMaterial | Basic |

---

### 1.2 Level of Detail (LOD) ✓ Implemented

**Purpose:** Reduce geometry complexity for distant objects to improve FPS.

**Three.js API:** `THREE.LOD`

```javascript
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);      // 0–1.2 units (close)
lod.addLevel(mediumDetailMesh, 1.2);  // 1.2–2.5 units (mid)
lod.addLevel(lowDetailMesh, 2.5);     // 2.5+ units (far)
```

**Parameters:**
- **Distance thresholds** — When to switch levels (camera distance)
- **Hysteresis** — Prevents flickering at boundaries (built-in)
- **autoUpdate** — Default true; LOD updates each frame

**Island generator implementation:**
- **Props (trees, rocks):** Each prop uses `THREE.LOD` with three levels:
  - **Level 0 (0–1.2):** Full FBX mesh (or placeholder if not loaded)
  - **Level 1 (1.2–2.5):** Medium placeholder — sphere/cone/cylinder with 6×4 segments
  - **Level 2 (2.5+):** Low placeholder — sphere/cone with 4×3 segments
- **PropMeshLoader:** `getLODPropClone(type)` returns LOD; `createLODPlaceholder(def, 'medium'|'low')` builds low-poly stand-ins per prop shape (sphere, cone, cylinder, box, signpost)
- **Placement preview & highlight:** Still use full-detail mesh (single prop, user close)
- **Terrain:** Single mesh; LOD less relevant unless chunking
- **Buildings:** Simple boxes; LOD optional

**References:** [Three.js LOD](https://threejs.org/docs/#api/en/objects/LOD), [webgl_batch_lod_bvh](https://threejs.org/examples/webgl_batch_lod_bvh.html)

---

### 1.3 InstancedMesh for Props

**Purpose:** Render many instances of the same geometry with one draw call.

**Current:** Each prop is a separate mesh → N props = N draw calls.

**InstancedMesh:**
- One geometry, one material, one draw call for all instances
- Per-instance transform via `setMatrixAt(i, matrix)`
- `instanceMatrix.needsUpdate = true` after changes

**Caveats:**
- **Frustum culling:** InstancedMesh culls as a whole; off-screen instances still cost GPU work. For large prop counts, consider chunking or manual culling.
- **Per-prop variation:** Same geometry only; scale/rotation/position vary. For different prop types (tree vs rock), use one InstancedMesh per type.
- **Gizmo/selection:** Individual instance selection requires raycasting against instances (`Raycaster` with `InstancedMesh`); more complex than per-mesh.

**Island generator fit:**
- Group props by type (OakTree, PalmTree, Rock, etc.)
- One `InstancedMesh` per prop type
- Trade-off: Gizmo/TransformControls attach to single objects; InstancedMesh requires custom handling for per-instance transforms

**References:** [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh), [webgl_instancing_performance](https://threejs.org/examples/webgl_instancing_performance.html), [VR InstancedMesh optimization](https://www.vrmeup.com/devlog/devlog_10_threejs_instancedmesh_performance_optimizations.html)

---

### 1.4 Geometry Merging & BatchedMesh

**Purpose:** Reduce draw calls by merging static geometry.

**BufferGeometryUtils.mergeGeometries:**
- Combine multiple geometries into one
- Single material; no per-object variation
- Good for static terrain details (e.g. rocks as merged boxes)

**BatchedMesh (Three.js r152+):**
- Multiple geometries, multiple materials, single draw call
- Better for varied content (different colors/materials)
- Requires `BatchedMesh.addGeometry()` and `BatchedMesh.setMatrixAt()`

**Island generator fit:**
- **Buildings:** Merge all building boxes into one geometry if same material
- **Props:** InstancedMesh preferred over merge (per-instance transform)

---

### 1.5 Frustum Culling

**Purpose:** Skip rendering objects outside the camera view.

**Built-in:** WebGLRenderer frustum-culls `Object3D` by default. `InstancedMesh` is culled as a single object (all or nothing).

**Custom culling:** For InstancedMesh with many off-screen instances, implement chunk-based or per-instance culling to avoid GPU work on invisible instances.

---

### 1.6 Shadow Map Optimization

**Current:** BasicShadowMap, 512×512, tight frustum (left/right/top/bottom ±1.2).

**Options:**
| Type | Quality | Cost |
|------|---------|------|
| BasicShadowMap | Lowest | Fastest |
| PCFShadowMap | Softer edges | Medium |
| PCFSoftShadowMap | Softer | Higher |
| VSMShadowMap | Different algorithm | Varies |

**Recommendation:** Keep BasicShadowMap for POC; optional PCF for quality if FPS allows.

---

### 1.7 Terrain Shader Enhancements

**Vertex colors (current):** Elevation-based coloring; no textures.

**Improvements:**
- **Normal mapping:** Add surface detail without extra geometry. Requires recalculating normals after vertex displacement; use `computeVertexNormals()` (already done).
- **Texture splatting:** Blend multiple textures (grass, rock, sand) by height/slope. Requires custom shader or `MeshStandardMaterial` with texture arrays.
- **Triplanar mapping:** Project textures from X/Y/Z to avoid stretching on slopes.

---

### 1.8 Asset Compression

- **Draco:** Geometry compression (smaller files, faster load)
- **KTX2/Basis:** Texture compression (GPU-friendly formats)

**Use case:** When loading external terrain/prop assets; less relevant for procedural geometry.

---

### 1.9 General Best Practices

- **Dispose:** Call `geometry.dispose()`, `material.dispose()`, `texture.dispose()` when removing objects
- **Reuse:** Reuse geometries and materials where possible
- **Draw calls:** Aim for &lt;100 draw calls per frame on low-end devices
- **Buffer updates:** Minimize `needsUpdate = true` on buffers; batch updates

---

## 2. Post-Processing Techniques & Controls

### 2.1 EffectComposer Setup

**Core pipeline:** Render scene → apply passes → output to screen.

**Imports (Three.js r160):**
```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
```

**Basic setup:**
```javascript
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// ... add effect passes ...
composer.addPass(new OutputPass());

// In animation loop: replace renderer.render() with:
composer.render();
```

**Resize:**
```javascript
composer.setSize(width, height);
composer.setPixelRatio(renderer.getPixelRatio());
```

**Note:** EffectComposer uses `HalfFloatType` render targets by default. Ensure `renderer.toneMapping` and `renderer.toneMappingExposure` are set if using HDR-like effects (e.g. bloom).

---

### 2.2 Bloom (UnrealBloomPass)

**Purpose:** Glow on bright areas (sun, emissive materials, water highlights).

**Import:**
```javascript
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
```

**Constructor:** `new UnrealBloomPass(resolution, strength, radius, threshold)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `resolution` | Vector2 | (256,256) | Resolution for bloom buffer; lower = faster |
| `strength` | number | 1 | Bloom intensity |
| `radius` | number | — | Blur radius (0–1); larger = wider glow |
| `threshold` | number | — | Luminance threshold; only brighter pixels bloom |

**Example:**
```javascript
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
const bloomPass = new UnrealBloomPass(resolution, 1.5, 0.4, 0.85);
bloomPass.enabled = true;
composer.addPass(bloomPass);
```

**GUI controls:**
```javascript
// dat.GUI or similar
gui.add(bloomPass, 'strength', 0, 3).name('Bloom Strength');
gui.add(bloomPass, 'radius', 0, 1).name('Bloom Radius');
gui.add(bloomPass, 'threshold', 0, 1).name('Bloom Threshold');
// On resize:
bloomPass.resolution.set(width, height);
```

**Island fit:** Subtle bloom on water reflections and sky/sun; keep threshold high to avoid washing out terrain.

---

### 2.3 Ambient Occlusion (SSAO / GTAO)

**Purpose:** Darken crevices and contact points for depth and realism.

#### SSAOPass

**Import:**
```javascript
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
```

**Constructor:** `new SSAOPass(scene, camera, width, height, kernelSize)`

| Property | Default | Description |
|----------|--------|-------------|
| `kernelRadius` | 8 | AO sample radius |
| `minDistance` | 0.005 | Min depth difference for AO |
| `maxDistance` | 0.1 | Max depth difference |
| `output` | 0 | 0=Default, 1=SSAO only, 2=Blur only, 3=Depth |

**Output enum:** `SSAOPass.OUTPUT.Default`, `.SSAO`, `.Blur`, `.Depth`

**GUI controls:**
```javascript
gui.add(ssaoPass, 'kernelRadius', 1, 32).name('Kernel Radius');
gui.add(ssaoPass, 'minDistance', 0.001, 0.01).name('Min Distance');
gui.add(ssaoPass, 'maxDistance', 0.05, 0.2).name('Max Distance');
gui.add(ssaoPass, 'output', { Default: 0, SSAO: 1, Blur: 2, Depth: 3 }).name('Output');
```

#### GTAOPass

**Import:**
```javascript
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
```

**Quality:** Better AO quality, higher cost. Parameters include `aoParameters` and `pdParameters` (Poisson denoise).

**Trade-off:** SSAO = faster, GTAO = better quality. For island POC, SSAO is a good balance.

---

### 2.4 Antialiasing (FXAA / SMAA)

**Purpose:** Smooth jagged edges without MSAA (cheaper).

#### FXAA (ShaderPass + FXAAShader)

**Import:**
```javascript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
```

**Setup:**
```javascript
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.set(
  1 / (width * pixelRatio),
  1 / (height * pixelRatio)
);
composer.addPass(fxaaPass);
```

**Resize:** Update `resolution` uniform when window resizes.

#### SMAAPass

**Import:**
```javascript
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
```

**Setup:** `composer.addPass(new SMAAPass(width * pixelRatio, height * pixelRatio));`

**Trade-off:** SMAA often better quality; FXAA faster. Use last in chain (before OutputPass).

---

### 2.5 Film Pass (Scanlines / Grain)

**Purpose:** Film grain, scanlines, optional grayscale.

**Import:**
```javascript
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
```

**Constructor:** `new FilmPass(intensity, grayscale)`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `intensity` | 0.5 | Effect strength (0=none, 1=full) |
| `grayscale` | false | B&W output |

**Uniforms:** `material.uniforms.intensity`, `material.uniforms.grayscale`

**GUI:**
```javascript
gui.add(filmPass.uniforms.intensity, 'value', 0, 1).name('Film Intensity');
gui.add(filmPass.uniforms.grayscale, 'value').name('Grayscale');
```

---

### 2.6 Other Built-in Passes

| Pass | Purpose |
|------|---------|
| `BokehPass` | Depth-of-field blur |
| `OutlinePass` | Outline selected objects |
| `SSRPass` | Screen-space reflections |
| `TAARenderPass` | Temporal antialiasing |
| `RenderPixelatedPass` | Pixel art style |
| `LUTPass` | Color grading via LUT texture |
| `GlitchPass` | Glitch effect |
| `DotScreenPass` | Halftone/dot pattern |

---

### 2.7 Pass Ordering

**Recommended order:**
1. `RenderPass` — scene to buffer
2. `SSAOPass` / `GTAOPass` — AO (needs depth/normals)
3. `UnrealBloomPass` — bloom
4. `ShaderPass(FXAAShader)` / `SMAAPass` — antialiasing
5. `FilmPass` (optional) — grain
6. `OutputPass` — tone mapping, final output

**Note:** SSAO + FXAA can conflict (e.g. black screen) if not configured correctly. Ensure SSAO writes to a buffer that FXAA reads; `renderToScreen` only on the last pass.

---

### 2.8 Custom ShaderPass

**Purpose:** Custom effects via GLSL.

```javascript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const CustomShader = {
  uniforms: { tDiffuse: { value: null }, myParam: { value: 1.0 } },
  vertexShader: `...`,
  fragmentShader: `...`
};
const customPass = new ShaderPass(CustomShader);
composer.addPass(customPass);
// Control: customPass.material.uniforms.myParam.value = 0.5;
```

---

### 2.9 Performance Considerations

- **Resolution:** Lower resolution for SSAO/bloom buffers (e.g. 0.5×) to save cost
- **Toggle:** Allow disabling expensive passes (SSAO, bloom) for low-end devices
- **HalfFloatType:** Default for composer; ensure GPU supports it

---

## 3. Water & Ocean Rendering

### 3.1 Current State (Implemented)

Custom procedural water shader (`WaterShader.js`): animated waves, Fresnel rim, sun specular. Lightweight alternative to THREE.Water (no planar reflection). Controls in Settings: Graphics modal — Show water, Shader toggle, Color, Wave scale, Wave height.

### 3.2 THREE.Water (Addon)

**Import:**
```javascript
import { Water } from 'three/examples/jsm/objects/Water.js';
```

**Features:**
- Planar reflection (render scene to texture, sample on water)
- Distortion, normal mapping
- `waterColor`, `sunColor`, `sunDirection`, `alpha`, `distortionScale`

**Config:**
- `textureWidth` / `textureHeight` — reflection resolution (e.g. 512)
- `waterNormals` — normal map for wave detail

**Note:** For `WebGPURenderer`, use `WaterMesh` instead.

### 3.3 Custom Water Shaders

- **Refraction:** Render scene to render target, sample with distortion in fragment shader
- **Fresnel:** Blend reflection/refraction by view angle
- **Animated normals:** Scroll normal map for wave motion

### 3.4 Island Fit

- **POC:** Simple animated normal or distortion on current water plane
- **Full:** THREE.Water for reflection; or custom shader for stylized look

---

## 4. Implementation Recommendations

### 4.1 Quick Wins (Low Effort)

| Change | Impact |
|-------|--------|
| Add EffectComposer + RenderPass + OutputPass | Enables post-processing |
| UnrealBloomPass (low strength, high threshold) | Subtle glow |
| FilmPass (low intensity) | Optional film look |
| FXAA or SMAA | Smoother edges |

### 4.2 Medium Effort

| Change | Impact |
|-------|--------|
| SSAOPass | Better depth, more realistic terrain |
| LOD for props | FPS gain with many props |
| InstancedMesh per prop type | Fewer draw calls |

### 4.3 Higher Effort

| Change | Impact |
|-------|--------|
| THREE.Water or custom water shader | Realistic water |
| Normal mapping / texture splatting on terrain | Richer terrain |
| GTAOPass | Higher-quality AO |

### 4.4 Post-Processing UI (Implemented)

**Settings: Graphics** — A dedicated 🎨 button (bottom-left, next to ⚙ Settings) opens a modal with collapsible sections:

```
Settings: Graphics (modal)
├── Display (collapsible)
│   ├── Height scale [50–200%]
│   ├── Wireframe [ ]
│   ├── Shadows [ ]
│   └── Elevation legend (Beach, Grass, Rock, Snow)
├── Graphics (collapsible)
│   └── Pixel ratio [0.5–2]
├── Water (collapsible)
│   ├── Show water [ ]
│   ├── Shader [ ] (animated waves, Fresnel, specular)
│   ├── Color [color picker]
│   ├── Wave scale [2–20]
│   └── Wave height [0–0.01]
└── Post-processing (collapsible)
    ├── Enable [ ]
    ├── Bloom [ ]  Strength [ ]  Radius [ ]  Threshold [ ]
    ├── SSAO [ ]  Radius [ ]
    ├── FXAA [ ]
    ├── Film [ ]  Intensity [ ]  Grayscale [ ]
    └── Tone exposure [ ]
```

**Implementation:** `#settings-graphics-btn` opens `#settings-graphics-modal`; Escape closes. Collapsible sections use `.collapsible-control` / `.collapsible-header` / `.collapsible-content`.

### 4.5 File Structure (Implemented)

```
src/
  IslandVisualizer.js     — Integrates PostProcessing; WaterShader; composer.render() when enabled
  PostProcessing.js       — EffectComposer, RenderPass, SSAOPass, UnrealBloomPass,
                            ShaderPass(FXAAShader), FilmPass, OutputPass; resize, dispose
  WaterShader.js          — Procedural water: animated waves, Fresnel, specular; createWaterMaterial, updateWaterTime
  main.js                 — Wire Settings: Graphics modal controls to PostProcessing, Water
index.html               — Settings: Graphics modal (#settings-graphics-modal) with
                            collapsible Display, Graphics, Water, Post-processing sections
```

---

### 4.6 Implementation Tracker

See [ISLAND_GEN_RENDERING_IMPLEMENTATION.md](ISLAND_GEN_RENDERING_IMPLEMENTATION.md) for phase status: Phase 1 (post-processing pipeline), Phase 2 (SSAO, Settings: Graphics modal), Phase 3 (LOD for props), and Phase 5 (water shader) complete; Phase 4 (InstancedMesh) pending.

---

## References

- [Three.js Post Processing Manual](https://threejs.org/manual/en/post-processing.html)
- [EffectComposer](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer)
- [UnrealBloomPass](https://threejs.org/docs/#examples/en/postprocessing/UnrealBloomPass)
- [SSAOPass](https://threejs.org/docs/#examples/en/postprocessing/SSAOPass)
- [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
- [LOD](https://threejs.org/docs/#api/en/objects/LOD)
- [Water](https://threejs.org/docs/#examples/en/objects/Water)
- [100 Three.js Performance Tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
