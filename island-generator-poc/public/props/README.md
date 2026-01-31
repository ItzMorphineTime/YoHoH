# Prop Assets (from 3D_Models/Props)

FBX models from `3D_Models/Props` for island decoration. Copy the folder structure here so the island generator can load them at runtime.

## Expected structure (from 3D_Models/Props)

| Prop type      | Folder          | FBX file          | Fallback        |
|----------------|-----------------|-------------------|-----------------|
| berry_bush_01  | BerryBush_01/   | BerryBush_01.fbx  | Green sphere    |
| oak_tree_01    | OakTree_01/     | OakTree_01.fbx    | Green cone      |
| palm_tree_01   | PalmTree_01/    | PalmTree_01.fbx   | Green cylinder  |
| palm_tree_02   | PalmTree_02/    | PalmTree_02.fbx   | Green cylinder  |
| rock_01        | Rock_01/        | Rock_01.fbx       | Gray sphere     |
| rock_06        | Rock_06/        | Rock_06.fbx       | Dark sphere     |
| sign           | —               | (no model)        | Thin box        |

## Copy command

From the Demo root:

```
cp -r 3D_Models/Props/* public/props/
```

Or on Windows (PowerShell):

```powershell
Copy-Item -Path "..\..\3D_Models\Props\*" -Destination "." -Recurse
```

## Format

- FBX format (Three.js FBXLoader)
- Textures: `*_texture.png`, `*_metallic.png`, `*_normal.png`, `*_roughness.png` (same folder as FBX)
- Scale: Meshes will be scaled to fit 1×1 tile; recommended size ~0.5–1 unit

## Usage

When PropTypes.js defines `fbxPath: '/props/BerryBush_01/BerryBush_01.fbx'`, IslandVisualizer loads the mesh via Three.js FBXLoader. If the file is missing, a placeholder mesh (colored box/sphere/cone/cylinder) is used instead.
