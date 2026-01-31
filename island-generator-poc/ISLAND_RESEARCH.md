# Island Generator — Research & UX Plan

**Document status:** Research & Design Reference  
**Last updated:** 2026-01-31  
**Purpose:** Plan an amazing Edit mode and Prop placement GUI/UX for the island-generator-poc  

---

## Table of Contents

1. [Research Summary](#1-research-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Edit Mode — Vision & Plan](#3-edit-mode--vision--plan)
4. [Prop Placement — Vision & Plan](#4-prop-placement--vision--plan)
5. [Unified Mode Model](#5-unified-mode-model)
6. [Visual Design & Theme](#6-visual-design--theme)
7. [Implementation Phases](#7-implementation-phases)

---

## 1. Research Summary

### 1.1 Industry UX Principles (Game Editors)

| Principle | Implication |
|-----------|-------------|
| **Enjoyable** | Tools should delight creators; users feel empowered by flexibility |
| **Familiar** | Match patterns from tools users know (Unity, Roblox, Cities: Skylines) |
| **Fast** | Rapid iteration; minimal friction between intent and result |
| **Reusable** | Optional components; replaceable workflows |
| **Scalable** | Support large islands without hard limits |
| **Dynamic** | Responsive feedback; real-time preview |

### 1.2 Terrain Editor Patterns

- **Brush-based sculpting** — Customizable brush shapes, sizes, opacity; painting metaphor
- **Visual feedback** — Cursor shape matches tool; hover preview; elevation readout
- **Layer support** — Terrain height, texture, details (trees, rocks, grass) as separate layers
- **Overlay windows** — Context-aware tools; minimal modal interruption
- **Undo/Redo** — Essential for experimentation; stack-based history

### 1.3 Prop/Detail Placement (Unity, Cities: Skylines)

| Feature | Unity Terrain | Cities: Skylines | Island POC Target |
|---------|---------------|------------------|-------------------|
| **Selection** | Thumbnail grid or list | Asset browser | Visual palette (icons) |
| **Paint vs. Place** | Paint = scatter; Place = single | Single placement | Single placement (1×1) |
| **Remove** | Shift+click to erase | Delete tool | Shift+click or Eraser mode |
| **Multi-select** | Paint multiple types at once | — | Optional: paint mode for props |
| **Preview** | Ghost at cursor | Ghost at cursor | Ghost at cursor ✓ |
| **Density** | Target density slider | — | N/A (single-tile props) |

### 1.4 Key Takeaways

1. **Edit and Prop modes should feel like painting** — Brush metaphor; drag to apply; Shift to erase.
2. **Visual palette > dropdown** — Icons/thumbnails for quick recognition; tooltips for names.
3. **Contextual panels** — Show properties only when relevant (selected object, active tool).
4. **Keyboard shortcuts** — Power users expect 1–9 for tools, B for brush, E for erase.
5. **HUD feedback** — Elevation, tile coords, mode indicator; always visible, non-intrusive.

---

## 2. Current State Analysis

### 2.1 Edit Mode (Implemented)

| Aspect | Current | Gap |
|--------|---------|-----|
| **Layout** | Map Editor section, collapsed by default | Buried; not prominent |
| **Brush tools** | 7 modes (raise, lower, flatten, absolute, set, plateau, smooth) | Good coverage |
| **Level presets** | 5 buttons (Sea, Beach, Grass, Rock, Snow) | ✓ |
| **Brush size** | 1×1–5×5 tiles | ✓ |
| **Apply mode** | Click vs. Drag | ✓ |
| **Undo/Redo** | Height map stack | ✓ |
| **Elevation HUD** | Shows height under cursor | ✓ |
| **Ramp tool** | — | Missing |
| **Contour overlay** | — | Missing |
| **Min/Max clamp** | — | Missing |
| **Visual hierarchy** | Edit panel feels secondary to Terrain/Buildings | Needs elevation |

### 2.2 Build Mode (Implemented)

| Aspect | Current | Gap |
|--------|---------|-----|
| **Layout** | Buildings section, palette + properties | Good |
| **Palette** | 8 colored squares (building types) | Could add icons |
| **Placement** | Click to place; ghost preview; red invalid overlay | ✓ |
| **Selection** | Click building → properties panel | ✓ |
| **Path width** | Slider 1–5 | ✓ |

### 2.3 Prop Mode (Not Implemented)

- Props (Rock, Palm Tree, Tree, Bush, Sign) defined in ISLAND_GENERATOR.md
- No UI, no placement logic, no rendering
- Phase H in roadmap

---

## 3. Edit Mode — Vision & Plan

### 3.1 Design Goals

1. **Edit mode feels like a first-class tool** — Not buried; easy to discover and switch to.
2. **Terrain sculpting is intuitive** — Brush preview, instant feedback, clear mode indicators.
3. **Power users can work fast** — Shortcuts, keyboard-driven workflow.
4. **Nautical/blocky theme** — Chart-paper feel; compass/anchor accents.

### 3.2 Proposed Edit Mode UX

#### 3.2.1 Layout & Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ YoHoH Island Generator                                   │
├─────────────────────────────────────────────────────────┤
│ TERRAIN (generation sliders)                             │
│ TILES | NOISE | DISPLAY | RANDOMNESS                     │
├─────────────────────────────────────────────────────────┤
│ EDIT MODE [Toggle]  ← Primary action; always visible     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Level presets: [Sea][Beach][Grass][Rock][Snow]       │ │
│ │ Brush: [↑Raise][↓Lower][≡Flatten][▣Abs][▣Set]       │ │
│ │       [▭Plateau][∿Smooth]  ← Icon row, compact      │ │
│ │ Target: [____0.35____]  Size: [1×1▼]  Strength: ▬▬▬ │ │
│ │ Apply: [Drag ▼]  [↶ Undo] [↷ Redo]                   │ │
│ │ [ ] Contour overlay  [ ] Ramp tool (A→B)            │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### 3.2.2 Brush Tool Bar (Compact Icon Row)

| Tool | Icon | Shortcut | Description |
|------|------|----------|-------------|
| Raise | ↑ | 1 | Add height |
| Lower | ↓ | 2 | Subtract height |
| Flatten | ≡ | 3 | Blend toward target |
| Absolute | ▣ | 4 | Gradual toward target |
| Set | ▣! | 5 | Instant set to target |
| Plateau | ▭ | 6 | Flatten to clicked height |
| Smooth | ∿ | 7 | Laplacian blend |
| Ramp | ↗ | 8 | Click A, click B — slope |

- **Visual:** Horizontal row of icon buttons; selected tool highlighted (accent border).
- **Tooltip:** Full name + shortcut on hover.
- **Keyboard:** 1–8 to switch tools when Edit mode active.

#### 3.2.3 Level Presets (Quick Target)

- Keep current 5 buttons (Sea, Beach, Grass, Rock, Snow).
- **Enhancement:** Click preset → set brush target AND optionally apply Set mode for one-click terrain painting.
- **Optional:** "Apply preset" vs "Set target only" — two-click vs one-click workflow.

#### 3.2.4 Ramp Tool (New)

- **Flow:** Select Ramp tool → click tile A → click tile B.
- **Result:** Smooth linear slope from A height to B height along path (A* or straight line).
- **Visual:** Line preview from A to cursor; elevation gradient preview.
- **Cancel:** Right-click or Esc to abort.

#### 3.2.5 Contour Overlay (New)

- **Toggle:** Checkbox "Contour overlay" in Edit panel.
- **Effect:** Draw contour lines at fixed intervals (e.g. every 0.1 height) on terrain.
- **Style:** Thin lines, semi-transparent; doesn't obscure terrain colors.
- **Use:** Visualize elevation; plan ramps and flat zones.

#### 3.2.6 Min/Max Elevation Clamp (New)

- **Sliders:** Min elevation (e.g. 0.1), Max elevation (e.g. 0.9).
- **Effect:** All brush operations clamp result to [min, max].
- **Use:** Prevent accidental water-level breaches; cap peaks.

#### 3.2.7 Elevation HUD Enhancements

- **Current:** "Elev: 0.35"
- **Proposed:** "Elev: 0.35 | Tile: (12, 8) | Band: Grass"
- **Optional:** Small elevation band color swatch next to value.

#### 3.2.8 Edit Mode Keyboard Shortcuts

| Key | Action |
|-----|--------|
| E | Toggle Edit mode |
| 1–8 | Select brush tool |
| B | Brush size cycle (1→2→3→4→5→1) |
| Z | Undo |
| Y / Ctrl+Shift+Z | Redo |
| Esc | Cancel ramp tool / deselect |

---

## 4. Prop Placement — Vision & Plan

### 4.1 Design Goals

1. **Props feel natural to place** — Like decorating a diorama; drag to place, Shift to remove.
2. **Visual palette** — Icons or simple 3D previews per prop type; no dropdown.
3. **Props enhance atmosphere** — Rocks, palms, trees, bushes, signs; pirate island vibe.
4. **Non-destructive** — Props sit on terrain; no flattening; can overlap (bush + rock).

### 4.2 Prop Types (from ISLAND_GENERATOR.md)

| Prop | Size | Theme | Placement |
|------|------|-------|-----------|
| Rock | 1×1 | Coastal boulders, inland outcrops | Land only |
| Palm Tree | 1×1 | Beach, shoreline | Land only |
| Tree | 1×1 | Forest, shade | Land only |
| Bush | 1×1 | Path edges, building surrounds | Land only |
| Sign | 1×1 | Wayfinding, lore, labels | Land only |

### 4.3 Proposed Prop Mode UX

#### 4.3.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│ PROP MODE [Toggle]  ← In same section as Build Mode     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Select prop                                        │ │
│ │ [🪨][🌴][🌲][🌿][📜]  ← Icon palette (5 props)     │ │
│ │  Rock  Palm  Tree Bush Sign                        │ │
│ │                                                    │ │
│ │ [ ] Allow overlap (bush + rock on same tile)       │ │
│ │ [ ] Snap rotation to 45°                          │ │
│ │                                                    │ │
│ │ Placed: 12 props                                   │ │
│ │ [Eraser mode] — Shift+click to remove              │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### 4.3.2 Prop Palette

- **Style:** Row of 5 icon buttons (or simple 3D thumbnails if assets exist).
- **Selection:** Click to select; selected prop highlighted.
- **Placement:** Click tile to place; ghost preview at cursor.
- **Rotation:** Optional — click to place with current rotation; or rotate after placement.
- **Density:** Single placement per click (no scatter); matches building placement UX.

#### 4.3.3 Prop Placement Rules

- **Land only** — Height > sea level.
- **No terrain flattening** — Props sit on existing terrain.
- **Overlap:** TBD — allow multiple props per tile (bush + rock) or exclusive.
- **Buildings:** Props cannot be placed on building footprint; can be adjacent.

#### 4.3.4 Prop Mode Interactions

| Input | Action |
|-------|--------|
| Left click (tile) | Place selected prop |
| Left click (prop) | Select prop (properties panel) |
| Shift + Left click (prop) | Remove prop |
| Right drag | Orbit camera |
| Scroll | Zoom |
| R | Rotate selected prop 90° (if prop selected) |

#### 4.3.5 Prop Properties Panel (When Selected)

- Type, Position (tile), Rotation
- "Rotate" and "Remove" buttons
- Optional: Sign text/lore field for Sign prop

#### 4.3.6 Prop Mode vs. Build Mode

- **Mutually exclusive** — Can't place buildings and props simultaneously.
- **Shared layout** — Both in right panel; toggle between "Build Mode" and "Prop Mode".
- **Alternative:** Unified "Place" mode with tabs: [Buildings] [Props]. User picks category, then type.

### 4.4 Prop Rendering (Placeholder Meshes)

| Prop | Placeholder | Future |
|------|-------------|--------|
| Rock | Brown/gray box or sphere | Boulder mesh |
| Palm Tree | Green cylinder + small sphere (fronds) | Palm model |
| Tree | Green cone + brown cylinder | Tree model |
| Bush | Green sphere (small) | Bush model |
| Sign | Thin box + small rectangle | Signpost + placard |

### 4.5 Prop Data Model

```js
{
  "props": [
    { "id": "p1", "type": "rock", "chunkX": 5, "chunkY": 4, "rotation": 0 },
    { "id": "p2", "type": "palm_tree", "chunkX": 3, "chunkY": 7, "rotation": 45 },
    { "id": "p3", "type": "sign", "chunkX": 7, "chunkY": 4, "rotation": 0, "text": "To Tavern" }
  ]
}
```

- **Save/Load:** Include `props` in island JSON; migrate old saves (empty array).

---

## 5. Unified Mode Model

### 5.1 Mode States

| Mode | Primary Action | Secondary | Mutually Exclusive With |
|------|----------------|-----------|-------------------------|
| **View** | Orbit, pan, zoom | — | — |
| **Edit** | Paint terrain | Ramp, contour | — |
| **Build** | Place buildings | Select, rotate, remove | Prop |
| **Prop** | Place props | Select, rotate, remove | Build |

### 5.2 Mode Switching UX

- **Edit Mode** and **Build/Prop Mode** can be active together conceptually: Edit modifies terrain; Build/Prop places objects. But Build and Prop are mutually exclusive.
- **Proposed:** Three toggles — Edit Mode, Build Mode, Prop Mode. Edit can be on while Build or Prop is on (user can sculpt then place). Build and Prop are radio: one or the other or neither.
- **Simpler:** Edit and "Place" (Build or Prop). Place has sub-tabs: Buildings | Props.

### 5.3 Recommended Structure

```
Right Panel:
├── Save / Load / Island Properties / Presets
├── PLACE MODE [Toggle]
│   ├── [Buildings] [Props]  ← Tabs
│   ├── (Building palette OR Prop palette)
│   └── Properties panel (when object selected)
├── EDIT MODE [Toggle]
│   └── (Brush tools, level presets, undo/redo)
└── Map Editor (legacy label?) — merge into Edit
```

- **Place Mode** = Build + Prop in one section; tabs to switch.
- **Edit Mode** = Terrain sculpting; independent toggle.

---

## 6. Visual Design & Theme

### 6.1 Nautical / Blocky Theme (Existing)

- Sharp corners, thick borders, chart-paper background
- Teal/blue accents (`--block-accent: #0ea5e9`)
- Monospace/condensed typography
- CSS variables already defined

### 6.2 Enhancements for Edit & Prop

| Element | Enhancement |
|---------|--------------|
| **Tool buttons** | Icon + label on first row; icon-only compact row option |
| **Level presets** | Color-coded (Sea=blue, Beach=tan, Grass=green, Rock=gray, Snow=white) — already done |
| **Prop palette** | Emoji or SVG icons; tooltip with name |
| **Mode toggles** | Clear active state (filled vs outline); optional mode indicator in HUD |
| **HUD** | Bottom-center; semi-transparent; elevation + tile + band |
| **Contour lines** | Subtle; match theme (teal or cream) |

### 6.3 Accessibility

- **Keyboard:** All tools reachable via shortcuts; focus management when switching modes
- **Screen reader:** ARIA labels on palette buttons; live region for HUD updates
- **Color:** Ensure sufficient contrast; don't rely on color alone for tool state

---

## 7. Implementation Phases

### Phase 1: Edit Mode Polish (Low Effort)

- [x] Brush tool bar as compact icon row (refactor existing)
- [x] Keyboard shortcuts (1–8, E, Z, Y, B)
- [x] Elevation HUD enhancement (tile coords, band name)
- [x] Min/Max elevation clamp sliders

### Phase 2: Edit Mode New Tools (Medium Effort)

- [ ] Ramp tool (click A, click B)
- [ ] Contour overlay toggle
- [ ] "Apply preset" vs "Set target" for level presets

### Phase 3: Prop Mode Foundation (Medium Effort)

- [ ] PropTypes.js (Rock, Palm, Tree, Bush, Sign)
- [ ] Prop data model; save/load in IslandSerializer
- [ ] IslandPropPlacer.js (mirror IslandBuildingPlacer pattern)
- [ ] Prop rendering in IslandVisualizer (placeholder meshes)

### Phase 4: Prop Mode UI (Medium Effort)

- [ ] Place Mode with [Buildings] [Props] tabs
- [ ] Prop palette (5 icons)
- [ ] Placement preview; validation (land only)
- [ ] Prop properties panel (select, rotate, remove)

### Phase 5: Prop Mode Polish (Low Effort)

- [ ] Prop selection, hover highlight
- [ ] Eraser mode or Shift+click to remove
- [ ] Optional: Sign text field for lore
- [ ] Optional: Prop overlap toggle (multiple per tile)

### Phase 6: Unified UX Pass (Low Effort)

- [ ] Consolidate Edit panel layout per this plan
- [ ] Mode indicator in HUD
- [ ] Tooltips with shortcuts
- [ ] Documentation update (ISLAND_GENERATOR.md)

---

## References

- [Unity Terrain — Paint Details](https://docs.unity3d.com/Packages/com.unity.terrain-tools@5.0/manual/paint-details.html)
- [Unity Terrain — Trees](https://docs.unity3d.com/6000.3/Documentation/Manual/terrain-Trees.html)
- [Don't Fear the Hammer: UX in Editors](https://www.gamedeveloper.com/design/don-t-fear-the-hammer-the-importance-of-ux-in-editors-tools)
- [O3DE Terrain Developer Guide](https://docs.o3de.org/docs/user-guide/visualization/environments/terrain/terrain-developer-guide/introduction)
- ISLAND_GENERATOR.md — Current implementation reference
