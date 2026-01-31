# Prop Assets (from 3D_Models/Props)

FBX models from `3D_Models/Props` for island decoration. **Copied automatically** by `npm run copy-props` (runs before dev/build).

## Structure

| Prop type      | Folder          | FBX file          |
|----------------|-----------------|-------------------|
| berry_bush_01  | BerryBush_01/   | BerryBush_01.fbx  |
| oak_tree_01    | OakTree_01/     | OakTree_01.fbx    |
| palm_tree_01   | PalmTree_01/    | PalmTree_01.fbx   |
| palm_tree_02   | PalmTree_02/    | PalmTree_02.fbx   |
| rock_01        | Rock_01/        | Rock_01.fbx       |
| rock_06        | Rock_06/        | Rock_06.fbx       |
| sign           | —               | (placeholder)     |

## Manual copy (if needed)

From island-generator-poc root: `npm run copy-props`

## Format

- FBX format (Three.js FBXLoader)
- Textures: `*_texture.png`, `*_metallic.png`, `*_normal.png`, `*_roughness.png` (same folder as FBX)
- Scale: Meshes will be scaled to fit 1×1 tile; recommended size ~0.5–1 unit

## Usage

When PropTypes.js defines `fbxPath: '/props/BerryBush_01/BerryBush_01.fbx'`, IslandVisualizer loads the mesh via Three.js FBXLoader. If the file is missing, a placeholder mesh (colored box/sphere/cone/cylinder) is used instead.
