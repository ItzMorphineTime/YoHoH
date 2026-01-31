# Island Generator — Rendering Implementation

**Document status:** Implementation Tracker  
**Last updated:** 2026-01-31  
**Purpose:** Track implementation of rendering improvements from ISLAND_GEN_RENDERING.md  

---

## Phases Overview

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Post-processing pipeline (EffectComposer, Bloom, FXAA, Film) | Done |
| **Phase 2** | SSAO pass + graphic/post-process controls | Done |
| **Phase 3** | LOD for props | Pending |
| **Phase 4** | InstancedMesh for props (optional) | Pending |
| **Phase 5** | Water shader improvements | Pending |

---

## Phase 1: Post-Processing Pipeline

### 1.1 Tasks

- [x] Create `PostProcessing.js` module
- [x] EffectComposer + RenderPass + OutputPass
- [x] UnrealBloomPass (toggleable, strength/radius/threshold)
- [x] FXAA via ShaderPass (toggleable)
- [x] FilmPass (toggleable, intensity/grayscale)
- [x] Integrate into IslandVisualizer
- [x] Add UI controls in Display section
- [x] Wire main.js toggles

### 1.2 Pass Order

1. RenderPass — scene to buffer
2. SSAOPass (Phase 2) — AO
3. UnrealBloomPass — bloom
4. ShaderPass(FXAAShader) — antialiasing
5. FilmPass — grain
6. OutputPass — tone mapping, final output

### 1.3 Defaults

| Pass | Default | Notes |
|------|---------|-------|
| Post-processing | Off | Master toggle |
| Bloom | Off | strength=1, radius=0.4, threshold=0.85 |
| FXAA | Off | Smooth edges |
| Film | Off | intensity=0.5, grayscale=false |

---

## Phase 2: SSAO + Graphic/Post-Process Controls (Done)

- [x] Add SSAOPass to PostProcessing.js (0.5× resolution for performance)
- [x] UI: SSAO toggle, kernel radius
- [x] Graphics: Pixel ratio slider (0.5–2)
- [x] Bloom: radius, threshold sliders
- [x] Film: grayscale toggle
- [x] Tone mapping exposure slider

---

## Phase 3: LOD for Props (Planned)

- Use THREE.LOD for distant props
- Per-type LOD: high-detail FBX up close, sphere/cone at distance

---

## Phase 4: InstancedMesh (Planned, Optional)

- Group props by type
- One InstancedMesh per type
- Trade-off: gizmo/selection requires custom handling

---

## Phase 5: Water Shader (Planned)

- THREE.Water or custom shader
- Reflection, distortion, animated normals

---

## File Changes

| File | Changes |
|------|---------|
| `src/PostProcessing.js` | New — EffectComposer, passes, resize |
| `src/IslandVisualizer.js` | Integrate PostProcessing, use composer when enabled |
| `index.html` | Post-processing UI section |
| `main.js` | Wire post-processing toggles |
