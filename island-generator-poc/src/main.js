/**
 * YoHoH Island Terrain Generator — Standalone POC
 * Procedural island mesh generation using Simplex noise
 */

import { generateIsland } from './IslandGenerator.js';
import { IslandVisualizer } from './IslandVisualizer.js';
import { IslandEditor, ELEVATION_LEVELS } from './IslandEditor.js';
import { serialize, deserialize } from './IslandSerializer.js';

const container = document.getElementById('canvas-container');
const regenerateBtn = document.getElementById('regenerate');
const statsEl = document.getElementById('stats');
const elevationHud = document.getElementById('elevation-hud');

const visualizer = new IslandVisualizer(container);
visualizer.init();
visualizer.animate();

const editor = new IslandEditor(visualizer);

let currentIsland = null;
let editMode = false;

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
  visualizer.render(island);

  if (hadSeed) {
    seedInput.value = island.seed;
  }
  updateStats(island);
}

function setEditMode(enabled) {
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
  visualizer.updateFromHeightMap(prev);
}

function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(editor.getHeightMap().map(row => [...row]));
  const next = redoStack.pop();
  editor.setHeightMap(next);
  visualizer.updateFromHeightMap(next);
}

function saveIsland() {
  if (!currentIsland) return;
  const mode = document.getElementById('save-mode')?.value || 'full';
  const island = {
    ...currentIsland,
    heightMap: mode === 'full' ? (editor.getHeightMap() ?? currentIsland.heightMap) : undefined,
    display: {
      heightScale: (parseInt(document.getElementById('height-scale').value, 10) || 100) / 100,
      wireframe: document.getElementById('wireframe').checked,
    },
    buildings: mode === 'full' ? (currentIsland.buildings ?? []) : [],
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
        editor.setHeightMap(island.heightMap);
        visualizer.setConfig({ heightScale: (data.display?.heightScale ?? 0.5), wireframe: !!data.display?.wireframe });
        visualizer.render(island);
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
    editor.setHeightMap(island.heightMap);
    visualizer.setConfig({ heightScale: data.display?.heightScale ?? 0.5, wireframe: !!data.display?.wireframe });
    visualizer.render(island);
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
    visualizer.updateFromHeightMap(editor.getHeightMap() ?? currentIsland.heightMap);
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
