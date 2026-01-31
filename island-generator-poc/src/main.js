/**
 * YoHoH Island Terrain Generator — Standalone POC
 * Procedural island mesh generation using Simplex noise
 */

import { generateIsland } from './IslandGenerator.js';
import { IslandVisualizer } from './IslandVisualizer.js';
import { IslandEditor, ELEVATION_LEVELS } from './IslandEditor.js';
import { IslandBuildingPlacer } from './IslandBuildingPlacer.js';
import { getBuildingType, getEffectiveBuildingSize, setBuildingDimensionOverride } from './BuildingTypes.js';
import { serialize, deserialize } from './IslandSerializer.js';
import { computePathsBetweenBuildings } from './IslandPathfinder.js';

const container = document.getElementById('canvas-container');
const regenerateBtn = document.getElementById('regenerate');
const statsEl = document.getElementById('stats');
const elevationHud = document.getElementById('elevation-hud');
const buildModeHud = document.getElementById('build-mode-hud');

const visualizer = new IslandVisualizer(container);
visualizer.init();
visualizer.animate();

const editor = new IslandEditor(visualizer);
const buildingPlacer = new IslandBuildingPlacer(visualizer);

let currentIsland = null;
let editMode = false;
let buildMode = false;

const UNDO_LIMIT = 20;
let undoStack = [];
let redoStack = [];

function parseSeed(val) {
  const trimmed = String(val).trim();
  if (!trimmed) return null;
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? null : num;
}

function getConfig() {
  const tileSize = Math.max(4, Math.min(32, parseInt(document.getElementById('tile-size').value, 10) || 8));
  let gridSize = Math.max(16, Math.min(2048, parseInt(document.getElementById('grid-size').value, 10) || 1080));
  gridSize = Math.floor(gridSize / tileSize) * tileSize || tileSize;
  const elevationPct = (parseInt(document.getElementById('elevation-scale').value, 10) || 80) / 100;
  const islandRadiusPct = (parseInt(document.getElementById('island-radius').value, 10) || 70) / 100;
  const coastPct = (parseInt(document.getElementById('coast-falloff').value, 10) || 35) / 10;
  const coastIrregPct = (parseInt(document.getElementById('coast-irregularity').value, 10) || 25) / 100;
  const elongationPct = (parseInt(document.getElementById('elongation').value, 10) || 80) / 100;
  const seaLevelPct = (parseInt(document.getElementById('sea-level').value, 10) || 12) / 100;
  const roughnessPct = (parseInt(document.getElementById('terrain-roughness').value, 10) || 70) / 100;
  const tileVariationPct = (parseInt(document.getElementById('tile-variation').value, 10) || 0) / 100;
  const octaves = Math.max(1, Math.min(8, parseInt(document.getElementById('noise-octaves').value, 10) || 3));
  const freqPct = (parseInt(document.getElementById('noise-frequency').value, 10) || 10) / 10;
  const persistPct = (parseInt(document.getElementById('noise-persistence').value, 10) || 75) / 100;
  const lacPct = (parseInt(document.getElementById('noise-lacunarity').value, 10) || 26) / 10;

  return {
    gridSize,
    tileSize,
    elevationScale: 1.2 * elevationPct,
    islandRadius: 0.2 + islandRadiusPct * 0.6,
    coastFalloff: coastPct,
    coastIrregularity: coastIrregPct,
    elongation: elongationPct,
    seaLevel: seaLevelPct,
    terrainRoughness: roughnessPct,
    tileVariation: tileVariationPct,
    chunkSize: tileSize,
    noiseOctaves: octaves,
    frequency: freqPct,
    persistence: persistPct,
    lacunarity: lacPct,
    seed: parseSeed(document.getElementById('seed').value),
  };
}

function updateStats(island) {
  if (!island) return;
  const { heightMap, config, seed } = island;
  const rows = heightMap.length;
  const cols = heightMap[0]?.length ?? 0;
  let minH = Infinity, maxH = -Infinity, sum = 0, count = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const h = heightMap[y][x];
      if (h > 0) { minH = Math.min(minH, h); maxH = Math.max(maxH, h); sum += h; count++; }
    }
  }
  const avg = count ? (sum / count).toFixed(3) : '—';
  const seedInfo = seed != null ? ` Seed: ${seed}` : '';
  const ts = config?.tileSize ?? config?.chunkSize ?? 8;
  const gridSize = rows - 1;
  const tiles = ts > 0 ? Math.floor(gridSize / ts) ** 2 : 0;
  const tileInfo = tiles > 0 ? ` ${tiles} tiles` : '';
  statsEl.textContent = `${rows}×${cols} vertices. Min: ${minH.toFixed(2)} Max: ${maxH.toFixed(2)} Avg: ${avg}.${tileInfo}${seedInfo}`;
}

function run() {
  const seedInput = document.getElementById('seed');
  const hadSeed = String(seedInput.value).trim() !== '';

  const config = getConfig();
  const island = generateIsland(config);
  currentIsland = island;
  editor.setHeightMap(island.heightMap);

  visualizer.setConfig({
    heightScale: (parseInt(document.getElementById('height-scale').value, 10) || 100) / 100,
    wireframe: document.getElementById('wireframe').checked,
    showWater: true,
  });
  if (island.buildings?.length >= 2) {
    const { pathTiles, heightMap } = computePathsBetweenBuildings(
      island.buildings, island.heightMap, island.config
    );
    island.heightMap = heightMap;
    island.pathTiles = [...pathTiles];
  } else {
    island.pathTiles = [];
  }
  visualizer.render(island);
  if (island.buildings?.length) {
    const cfg = island.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = Math.floor((island.heightMap.length - 1) / ts);
    const tilesY = tilesX;
    visualizer.renderBuildings(island.buildings, island.heightMap, ts, tilesX, tilesY);
  }
  const showGrid = document.getElementById('show-grid-overlay')?.checked;
  if (showGrid && island?.heightMap) {
    const cfg = island.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((island.heightMap.length - 1) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;
    visualizer.setTileGridOverlay(true, tilesX, tilesY, island.heightMap.length - 1);
  }

  if (hadSeed) {
    seedInput.value = island.seed;
  }
  updateStats(island);
}

function setEditMode(enabled) {
  if (enabled && buildMode) setBuildMode(false);
  editMode = enabled;
  const editPanel = document.getElementById('edit-panel');
  const editBtn = document.getElementById('edit-mode-btn');
  if (editPanel) editPanel.style.display = enabled ? 'block' : 'none';
  if (editBtn) {
    editBtn.textContent = enabled ? 'Edit Mode (On)' : 'Edit Mode (Off)';
    editBtn.classList.toggle('active', enabled);
  }
  visualizer.setInputMode(enabled ? 'edit' : 'view');
  const inputHint = document.getElementById('input-hint');
  if (inputHint) inputHint.textContent = enabled ? 'Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom' : 'Left=orbit · Right=pan · Scroll=zoom';
  if (enabled) {
    editor.setHeightMap(currentIsland?.heightMap);
    const cfg = currentIsland?.config;
    editor.setTileConfig(cfg?.tileSize ?? cfg?.chunkSize ?? 8, cfg?.tilesX, cfg?.tilesY);
    editor.enable(container);
    editor.setBrushSizeInTiles(parseInt(document.getElementById('brush-size-tiles')?.value, 10) || 1);
    editor.setBrushStrength(((parseInt(document.getElementById('brush-strength').value, 10) || 16) / 40) * 0.2);
    editor.setBrushMode(document.getElementById('brush-mode').value);
    editor.setApplyOnClickOnly(document.getElementById('brush-apply-mode')?.value === 'click');
    editor.setCanPaint(() => !visualizer.isSpaceHeld());
    editor.setBrushTargetHeight(parseFloat(document.getElementById('brush-target').value) || 0.35);
    editor.setSeaLevel(currentIsland?.config?.seaLevel ?? 0.12);
    editor.onHeightAtCursor = (h) => {
      if (elevationHud) {
        elevationHud.style.display = h != null ? 'block' : 'none';
        elevationHud.textContent = h != null ? `Elev: ${h.toFixed(3)}` : 'Elev: —';
      }
    };
    editor.onHoverTile = (region) => {
      if (region) {
        const hm = editor.getHeightMap();
        if (hm) {
          visualizer.setHoverOverlay({ x0: region.x0, y0: region.y0, x1: region.x1, y1: region.y1 }, hm);
        } else {
          visualizer.setHoverOverlay(null);
        }
      } else {
        visualizer.setHoverOverlay(null);
      }
    };
    editor.onBeforeBrush = pushUndo;
    undoStack = [];
    redoStack = [];
  } else {
    editor.setCanPaint(null);
    editor.disable();
    visualizer.setHoverOverlay(null);
    if (elevationHud) elevationHud.style.display = 'none';
  }
}

function setBuildMode(enabled) {
  if (enabled && editMode) setEditMode(false);
  buildMode = enabled;
  const buildPanel = document.getElementById('build-panel');
  const buildBtn = document.getElementById('build-mode-btn');
  if (buildPanel) buildPanel.style.display = enabled ? 'block' : 'none';
  if (buildBtn) {
    buildBtn.textContent = enabled ? 'Build Mode (On)' : 'Build Mode (Off)';
    buildBtn.classList.toggle('active', enabled);
  }
  visualizer.setInputMode(enabled ? 'edit' : (editMode ? 'edit' : 'view'));
  const inputHint = document.getElementById('input-hint');
  if (inputHint) inputHint.textContent = enabled ? 'Left=place · Right=orbit · Shift+Left=remove · Scroll=zoom' : (editMode ? 'Left=paint · Right=orbit · Space+Left=orbit · Scroll=zoom' : 'Left=orbit · Right=pan · Scroll=zoom');
  if (enabled) {
    buildingPlacer.setHeightMap(currentIsland?.heightMap);
    const cfg = currentIsland?.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((currentIsland?.heightMap?.length - 1 ?? 0) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;
    buildingPlacer.setTileConfig(ts, tilesX, tilesY);
    buildingPlacer.setSeaLevel(cfg?.seaLevel ?? 0.12);
    buildingPlacer.setBuildings(currentIsland?.buildings ?? []);
    buildingPlacer.setSelectedType(document.getElementById('building-type')?.value || 'tavern');
    buildingPlacer.onBuildingsChange = (buildings) => {
      currentIsland = { ...currentIsland, buildings };
      const cfg = currentIsland?.config;
      const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
      const tilesX = cfg?.tilesX ?? Math.floor((currentIsland?.heightMap?.length - 1 ?? 0) / ts);
      const tilesY = cfg?.tilesY ?? tilesX;
      if (buildings.length >= 2 && currentIsland?.heightMap) {
        const { pathTiles, heightMap } = computePathsBetweenBuildings(
          buildings, currentIsland.heightMap, { ...cfg, tilesX, tilesY }
        );
        currentIsland = { ...currentIsland, heightMap, pathTiles: [...pathTiles] };
        buildingPlacer.setHeightMap(heightMap);
        editor.setHeightMap(heightMap);
        visualizer.updateFromHeightMap(heightMap, pathTiles, ts);
      } else {
        currentIsland = { ...currentIsland, pathTiles: [] };
        visualizer.updateFromHeightMap(currentIsland.heightMap, new Set(), ts);
      }
      updateBuildModeHud();
      updateBuildingsList();
    };
    buildingPlacer.onHeightMapChange = (newHeightMap) => {
      currentIsland = { ...currentIsland, heightMap: newHeightMap };
      editor.setHeightMap(newHeightMap);
      const cfg = currentIsland?.config;
      const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
      const pathTiles = currentIsland?.pathTiles ? new Set(currentIsland.pathTiles) : new Set();
      visualizer.updateFromHeightMap(newHeightMap, pathTiles, ts);
    };
    buildingPlacer.onPlacementHover = (tx, ty, isValid) => {
      const hm = currentIsland?.heightMap;
      const cfg = currentIsland?.config;
      const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
      const tilesX = cfg?.tilesX ?? Math.floor((hm?.length - 1 ?? 0) / ts);
      const tilesY = cfg?.tilesY ?? tilesX;
      if (tx != null && ty != null && hm) {
        visualizer.setPlacementPreview(tx, ty, buildingPlacer.selectedType, isValid, hm, ts, tilesX, tilesY);
      } else {
        visualizer.clearPlacementPreview();
      }
    };
    buildingPlacer.onBuildingHover = (building) => {
      const hm = currentIsland?.heightMap;
      const cfg = currentIsland?.config;
      const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
      const tilesX = cfg?.tilesX ?? Math.floor((hm?.length - 1 ?? 0) / ts);
      const tilesY = cfg?.tilesY ?? tilesX;
      if (building && hm) {
        visualizer.setBuildingHighlight(building, hm, ts, tilesX, tilesY);
      } else {
        visualizer.clearBuildingHighlight();
      }
    };
    buildingPlacer.enable(container);
    const showGrid = document.getElementById('show-grid-overlay')?.checked;
    visualizer.setTileGridOverlay(showGrid, tilesX, tilesY, currentIsland?.heightMap?.length - 1 ?? 0);
    syncBuildingPalette(buildingPlacer.selectedType);
    syncBuildingDimensions(buildingPlacer.selectedType);
    updateBuildingsList();
  } else {
    buildingPlacer.disable();
    buildingPlacer.onBuildingsChange = null;
    buildingPlacer.onHeightMapChange = null;
    buildingPlacer.onPlacementHover = null;
    buildingPlacer.onBuildingHover = null;
    visualizer.setTileGridOverlay(false);
    visualizer.clearPlacementPreview();
    visualizer.clearBuildingHighlight();
    if (buildModeHud) buildModeHud.style.display = 'none';
  }
  updateBuildModeHud();
}

function updateBuildModeHud() {
  if (!buildModeHud) return;
  if (!buildMode) return;
  const def = getBuildingType(buildingPlacer.selectedType);
  const name = def?.name ?? buildingPlacer.selectedType ?? '—';
  const count = buildingPlacer.getBuildings().length;
  buildModeHud.textContent = `Building: ${name} · ${count} placed`;
  buildModeHud.style.display = 'block';
}

function updateBuildingsList() {
  const listEl = document.getElementById('buildings-list');
  const itemsEl = document.getElementById('buildings-list-items');
  if (!listEl || !itemsEl) return;
  const buildings = buildingPlacer?.getBuildings() ?? currentIsland?.buildings ?? [];
  if (buildings.length === 0) {
    listEl.style.display = 'none';
    return;
  }
  listEl.style.display = 'block';
  const title = listEl.querySelector('.control-section-title');
  if (title) title.textContent = `Placed (${buildings.length})`;
  itemsEl.innerHTML = buildings.map((b, i) => {
    const def = getBuildingType(b.type);
    const name = def?.name ?? b.type;
    return `${i + 1}. ${name} @ (${b.chunkX},${b.chunkY})`;
  }).join('<br>');
}

function pushUndo() {
  const hm = editor.getHeightMap();
  if (!hm) return;
  undoStack.push(hm.map(row => [...row]));
  if (undoStack.length > UNDO_LIMIT) undoStack.shift();
  redoStack = [];
}

function undo() {
  if (undoStack.length === 0) return;
  redoStack.push(editor.getHeightMap().map(row => [...row]));
  const prev = undoStack.pop();
  editor.setHeightMap(prev);
  const cfg = currentIsland?.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const pathTiles = currentIsland?.pathTiles ? new Set(currentIsland.pathTiles) : new Set();
  visualizer.updateFromHeightMap(prev, pathTiles, ts);
}

function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(editor.getHeightMap().map(row => [...row]));
  const next = redoStack.pop();
  editor.setHeightMap(next);
  const cfg = currentIsland?.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const pathTiles = currentIsland?.pathTiles ? new Set(currentIsland.pathTiles) : new Set();
  visualizer.updateFromHeightMap(next, pathTiles, ts);
}

function saveIsland() {
  if (!currentIsland) return;
  const mode = document.getElementById('save-mode')?.value || 'full';
  const buildings = buildMode ? buildingPlacer.getBuildings() : (currentIsland.buildings ?? []);
  const island = {
    ...currentIsland,
    heightMap: mode === 'full' ? (editor.getHeightMap() ?? currentIsland.heightMap) : undefined,
    display: {
      heightScale: (parseInt(document.getElementById('height-scale').value, 10) || 100) / 100,
      wireframe: document.getElementById('wireframe').checked,
    },
    buildings: mode === 'full' ? buildings : [],
  };
  const json = serialize(island);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = mode === 'config' ? `yohoh-config-${Date.now()}.json` : `yohoh-island-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Restore UI sliders from config (for load/preset) */
function applyConfigToUI(config, display = {}, seed = null) {
  if (!config) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = String(val); };
  set('grid-size', config.gridSize ?? 1080);
  set('elevation-scale', Math.round((config.elevationScale ?? 0.96) / 1.2 * 100));
  set('terrain-roughness', Math.round((config.terrainRoughness ?? 0.7) * 100));
  set('island-radius', Math.round(((config.islandRadius ?? 0.62) - 0.2) / 0.6 * 100));
  set('coast-falloff', Math.round((config.coastFalloff ?? 3.5) * 10));
  set('coast-irregularity', Math.round((config.coastIrregularity ?? 0.25) * 100));
  set('elongation', Math.round((config.elongation ?? 0.8) * 100));
  set('sea-level', Math.round((config.seaLevel ?? 0.12) * 100));
  set('tile-size', config.tileSize ?? config.chunkSize ?? 16);
  set('tile-variation', Math.round((config.tileVariation ?? 0) * 100));
  set('noise-octaves', config.noiseOctaves ?? 3);
  set('noise-frequency', Math.round((config.frequency ?? 1.0) * 10));
  set('noise-persistence', Math.round((config.persistence ?? 0.75) * 100));
  set('noise-lacunarity', Math.round((config.lacunarity ?? 2.6) * 10));
  set('height-scale', Math.round((display.heightScale ?? 0.5) * 100));
  const wireframe = document.getElementById('wireframe');
  if (wireframe) wireframe.checked = !!display.wireframe;
  const seedEl = document.getElementById('seed');
  if (seedEl) seedEl.value = seed != null ? String(seed) : '';
  refreshValueDisplays();
}

function refreshValueDisplays() {
  const fmt = (id, displayId, formatter = (v) => v) => {
    const input = document.getElementById(id);
    const display = document.getElementById(displayId);
    if (input && display) display.textContent = formatter(input.value);
  };
  fmt('grid-size', 'val-grid');
  fmt('elevation-scale', 'val-elevation', (v) => `${v}%`);
  fmt('terrain-roughness', 'val-roughness', (v) => `${v}%`);
  fmt('island-radius', 'val-radius', (v) => `${v}%`);
  fmt('coast-falloff', 'val-coast', (v) => (parseInt(v, 10) / 10).toFixed(1));
  fmt('coast-irregularity', 'val-coast-irreg', (v) => `${v}%`);
  fmt('elongation', 'val-elongation', (v) => `${v}%`);
  fmt('sea-level', 'val-sea', (v) => (parseInt(v, 10) / 100).toFixed(2));
  fmt('tile-size', 'val-tile');
  fmt('tile-variation', 'val-tile-var', (v) => `${v}%`);
  fmt('noise-octaves', 'val-octaves');
  fmt('noise-frequency', 'val-freq', (v) => (parseInt(v, 10) / 10).toFixed(1));
  fmt('noise-persistence', 'val-persist', (v) => (parseInt(v, 10) / 100).toFixed(2));
  fmt('noise-lacunarity', 'val-lac', (v) => (parseInt(v, 10) / 10).toFixed(1));
  fmt('height-scale', 'val-height-scale', (v) => `${v}%`);
  fmt('brush-target', 'val-brush-target');
  fmt('brush-strength', 'val-brush-strength', (v) => `${((parseInt(v, 10) || 16) / 40 * 20).toFixed(0)}%`);
}

function loadIslandFromFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = deserialize(reader.result);
        applyConfigToUI(data.config, data.display, data.seed);
        let island;
        if (data.heightMap) {
          island = { heightMap: data.heightMap, config: data.config, buildings: data.buildings, seed: data.seed };
        } else {
          island = generateIsland(getConfig());
          island.buildings = data.buildings ?? [];
        }
        currentIsland = island;
        if (island.buildings?.length >= 2) {
          const { pathTiles, heightMap } = computePathsBetweenBuildings(
            island.buildings, island.heightMap, island.config
          );
          island.heightMap = heightMap;
          island.pathTiles = [...pathTiles];
        } else {
          island.pathTiles = [];
        }
        editor.setHeightMap(island.heightMap);
        visualizer.setConfig({ heightScale: (data.display?.heightScale ?? 0.5), wireframe: !!data.display?.wireframe });
        visualizer.render(island);
        if (island.buildings?.length) {
          const ts = island.config?.tileSize ?? island.config?.chunkSize ?? 8;
          const tilesX = Math.floor((island.heightMap?.length - 1 ?? 0) / ts);
          visualizer.renderBuildings(island.buildings, island.heightMap, ts, tilesX, tilesX);
        }
        updateStats(island);
        document.getElementById('seed').value = island.seed ?? '';
        setEditMode(true);
      } catch (err) {
        alert('Invalid island file: ' + err.message);
      }
    };
    reader.readAsText(file);
    input.value = '';
  };
  input.click();
}

function bindValueDisplay(id, displayId, formatter = (v) => v) {
  const input = document.getElementById(id);
  const display = document.getElementById(displayId);
  if (!input || !display) return;
  const update = () => { display.textContent = formatter(input.value); };
  input.addEventListener('input', update);
  input.addEventListener('change', update);
  update();
}

// Settings modal
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const settingsCloseBtn = document.getElementById('settings-close-btn');

function openSettings() {
  if (settingsModal) settingsModal.classList.add('open');
}
function closeSettings() {
  if (settingsModal) settingsModal.classList.remove('open');
}

settingsBtn?.addEventListener('click', openSettings);
settingsCloseBtn?.addEventListener('click', closeSettings);
settingsModal?.addEventListener('click', (e) => {
  if (e.target === settingsModal) closeSettings();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && settingsModal?.classList.contains('open')) closeSettings();
});

regenerateBtn.addEventListener('click', run);

document.getElementById('randomize').addEventListener('click', () => {
  document.getElementById('seed').value = '';
  setEditMode(false);
  run();
});

document.getElementById('save-btn').addEventListener('click', saveIsland);
document.getElementById('load-btn').addEventListener('click', loadIslandFromFile);

async function loadPreset() {
  const select = document.getElementById('preset-select');
  const url = select?.value;
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const data = deserialize(await res.text());
    applyConfigToUI(data.config, data.display, data.seed);
    let island;
    if (data.heightMap) {
      island = { heightMap: data.heightMap, config: data.config, buildings: data.buildings ?? [], seed: data.seed };
    } else {
      island = generateIsland(getConfig());
      island.buildings = data.buildings ?? [];
    }
    currentIsland = island;
    if (island.buildings?.length >= 2) {
      const { pathTiles, heightMap } = computePathsBetweenBuildings(
        island.buildings, island.heightMap, island.config
      );
      island.heightMap = heightMap;
      island.pathTiles = [...pathTiles];
    } else {
      island.pathTiles = [];
    }
    editor.setHeightMap(island.heightMap);
    visualizer.setConfig({ heightScale: data.display?.heightScale ?? 0.5, wireframe: !!data.display?.wireframe });
    visualizer.render(island);
    if (island.buildings?.length) {
      const ts = island.config?.tileSize ?? island.config?.chunkSize ?? 8;
      const tilesX = Math.floor((island.heightMap?.length - 1 ?? 0) / ts);
      visualizer.renderBuildings(island.buildings, island.heightMap, ts, tilesX, tilesX);
    }
    updateStats(island);
    setEditMode(true);
    select.value = '';
  } catch (err) {
    alert('Failed to load preset: ' + err.message);
  }
}
document.getElementById('load-preset-btn').addEventListener('click', loadPreset);

document.getElementById('edit-mode-btn').addEventListener('click', () => {
  setEditMode(!editMode);
});

document.getElementById('build-mode-btn')?.addEventListener('click', () => {
  setBuildMode(!buildMode);
});

document.getElementById('building-type')?.addEventListener('change', (e) => {
  buildingPlacer.setSelectedType(e.target.value);
  syncBuildingPalette(e.target.value);
  syncBuildingDimensions(e.target.value);
  updateBuildModeHud();
});

document.querySelectorAll('#building-palette .building-palette-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    if (!type) return;
    buildingPlacer.setSelectedType(type);
    const select = document.getElementById('building-type');
    if (select) select.value = type;
    syncBuildingPalette(type);
    syncBuildingDimensions(type);
    updateBuildModeHud();
  });
});

function syncBuildingDimensions(type) {
  const size = getEffectiveBuildingSize(type);
  const wEl = document.getElementById('building-width');
  const hEl = document.getElementById('building-height');
  if (wEl) wEl.value = size.width;
  if (hEl) hEl.value = size.height;
}

document.getElementById('building-width')?.addEventListener('change', (e) => {
  const type = buildingPlacer?.selectedType;
  if (!type) return;
  const w = Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 1));
  setBuildingDimensionOverride(type, w, undefined);
  if (currentIsland && buildMode) {
    const cfg = currentIsland.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;
    visualizer.renderBuildings(buildingPlacer.getBuildings(), currentIsland.heightMap, ts, tilesX, tilesY);
  }
});

document.getElementById('building-height')?.addEventListener('change', (e) => {
  const type = buildingPlacer?.selectedType;
  if (!type) return;
  const h = Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 1));
  setBuildingDimensionOverride(type, undefined, h);
  if (currentIsland && buildMode) {
    const cfg = currentIsland.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;
    visualizer.renderBuildings(buildingPlacer.getBuildings(), currentIsland.heightMap, ts, tilesX, tilesY);
  }
});

function syncBuildingPalette(selectedType) {
  document.querySelectorAll('#building-palette .building-palette-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.type === selectedType);
  });
}

document.getElementById('show-grid-overlay')?.addEventListener('change', (e) => {
  if (!currentIsland) return;
  const cfg = currentIsland.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
  const tilesY = cfg?.tilesY ?? tilesX;
  visualizer.setTileGridOverlay(e.target.checked, tilesX, tilesY, currentIsland.heightMap?.length - 1 ?? 0);
});

document.getElementById('brush-mode').addEventListener('change', (e) => {
  editor.setBrushMode(e.target.value);
});
document.getElementById('brush-target').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  if (!isNaN(v)) editor.setBrushTargetHeight(v);
});
document.getElementById('brush-target').addEventListener('change', (e) => {
  const v = parseFloat(e.target.value);
  if (!isNaN(v)) editor.setBrushTargetHeight(v);
});
document.getElementById('brush-size-tiles')?.addEventListener('change', (e) => {
  editor.setBrushSizeInTiles(parseInt(e.target.value, 10) || 1);
});
document.getElementById('brush-apply-mode')?.addEventListener('change', (e) => {
  editor.setApplyOnClickOnly(e.target.value === 'click');
});
document.getElementById('brush-strength').addEventListener('input', (e) => {
  const v = parseInt(e.target.value, 10) || 16;
  editor.setBrushStrength((v / 40) * 0.2);
});

document.querySelectorAll('.level-preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;
    const h = ELEVATION_LEVELS[level];
    if (h != null) {
      const targetEl = document.getElementById('brush-target');
      if (targetEl) {
        targetEl.value = h.toFixed(2);
        editor.setBrushTargetHeight(h);
        refreshValueDisplays();
      }
    }
  });
});

document.getElementById('undo-btn').addEventListener('click', undo);
document.getElementById('redo-btn').addEventListener('click', redo);

document.getElementById('height-scale').addEventListener('input', () => {
  const scale = (parseInt(document.getElementById('height-scale').value, 10) || 100) / 100;
  visualizer.setConfig({ heightScale: scale });
  if (currentIsland) {
    const cfg = currentIsland?.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const pathTiles = currentIsland?.pathTiles ? new Set(currentIsland.pathTiles) : new Set();
    visualizer.updateFromHeightMap(editor.getHeightMap() ?? currentIsland.heightMap, pathTiles, ts);
  }
});

document.getElementById('wireframe').addEventListener('change', (e) => {
  visualizer.setConfig({ wireframe: e.target.checked });
  if (currentIsland) {
    const mesh = visualizer.getMesh();
    if (mesh) mesh.material.wireframe = e.target.checked;
  }
});

bindValueDisplay('grid-size', 'val-grid');
bindValueDisplay('elevation-scale', 'val-elevation', (v) => `${v}%`);
bindValueDisplay('terrain-roughness', 'val-roughness', (v) => `${v}%`);
bindValueDisplay('island-radius', 'val-radius', (v) => `${v}%`);
bindValueDisplay('coast-falloff', 'val-coast', (v) => (parseInt(v, 10) / 10).toFixed(1));
bindValueDisplay('coast-irregularity', 'val-coast-irreg', (v) => `${v}%`);
bindValueDisplay('elongation', 'val-elongation', (v) => `${v}%`);
bindValueDisplay('sea-level', 'val-sea', (v) => (parseInt(v, 10) / 100).toFixed(2));
bindValueDisplay('tile-size', 'val-tile');
bindValueDisplay('tile-variation', 'val-tile-var', (v) => `${v}%`);
bindValueDisplay('noise-octaves', 'val-octaves');
bindValueDisplay('noise-frequency', 'val-freq', (v) => (parseInt(v, 10) / 10).toFixed(1));
bindValueDisplay('noise-persistence', 'val-persist', (v) => (parseInt(v, 10) / 100).toFixed(2));
bindValueDisplay('noise-lacunarity', 'val-lac', (v) => (parseInt(v, 10) / 10).toFixed(1));
bindValueDisplay('height-scale', 'val-height-scale', (v) => `${v}%`);
bindValueDisplay('brush-target', 'val-brush-target');
bindValueDisplay('brush-strength', 'val-brush-strength', (v) => `${((parseInt(v, 10) || 16) / 40 * 20).toFixed(0)}%`);

run();
