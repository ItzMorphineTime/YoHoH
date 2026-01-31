/**
 * YoHoH Island Terrain Generator — Standalone POC
 * Procedural island mesh generation using Simplex noise
 */

import { generateIsland } from './IslandGenerator.js';
import { IslandVisualizer } from './IslandVisualizer.js';
import { IslandEditor } from './IslandEditor.js';
import { serialize, deserialize } from './IslandSerializer.js';

const container = document.getElementById('canvas-container');
const regenerateBtn = document.getElementById('regenerate');
const statsEl = document.getElementById('stats');

const visualizer = new IslandVisualizer(container);
visualizer.init();
visualizer.animate();

const editor = new IslandEditor(visualizer);

let currentIsland = null;
let editMode = false;

function parseSeed(val) {
  const trimmed = String(val).trim();
  if (!trimmed) return null;
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? null : num;
}

function getConfig() {
  const gridSize = Math.max(16, Math.min(512, parseInt(document.getElementById('grid-size').value, 10) || 128));
  const elevationPct = (parseInt(document.getElementById('elevation-scale').value, 10) || 120) / 100;
  const islandRadiusPct = (parseInt(document.getElementById('island-radius').value, 10) || 70) / 100;
  const coastPct = (parseInt(document.getElementById('coast-falloff').value, 10) || 35) / 10;
  const coastIrregPct = (parseInt(document.getElementById('coast-irregularity').value, 10) || 25) / 100;
  const elongationPct = (parseInt(document.getElementById('elongation').value, 10) || 80) / 100;
  const seaLevelPct = (parseInt(document.getElementById('sea-level').value, 10) || 12) / 100;
  const roughnessPct = (parseInt(document.getElementById('terrain-roughness').value, 10) || 70) / 100;
  const chunkSize = Math.max(0, Math.min(64, parseInt(document.getElementById('chunk-size').value, 10) || 8));
  const flatnessPct = (parseInt(document.getElementById('flatness-strength').value, 10) || 80) / 100;
  const octaves = Math.max(1, Math.min(8, parseInt(document.getElementById('noise-octaves').value, 10) || 5));
  const freqPct = (parseInt(document.getElementById('noise-frequency').value, 10) || 10) / 10;
  const persistPct = (parseInt(document.getElementById('noise-persistence').value, 10) || 75) / 100;
  const lacPct = (parseInt(document.getElementById('noise-lacunarity').value, 10) || 26) / 10;

  return {
    gridSize,
    elevationScale: 1.2 * elevationPct,
    islandRadius: 0.2 + islandRadiusPct * 0.6,
    coastFalloff: coastPct,
    coastIrregularity: coastIrregPct,
    elongation: elongationPct,
    seaLevel: seaLevelPct,
    terrainRoughness: roughnessPct,
    chunkSize,
    flatnessStrength: flatnessPct,
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
  const cs = config?.chunkSize ?? 0;
  const gridSize = rows - 1;
  const chunks = cs > 0 ? Math.ceil(gridSize / cs) ** 2 : 0;
  const chunkInfo = chunks > 0 ? ` ${chunks} chunks` : '';
  statsEl.textContent = `${rows}×${cols} vertices. Min: ${minH.toFixed(2)} Max: ${maxH.toFixed(2)} Avg: ${avg}.${chunkInfo}${seedInfo}`;
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
  if (enabled) {
    editor.setHeightMap(currentIsland?.heightMap);
    editor.enable(container);
    editor.setBrushRadius((parseInt(document.getElementById('brush-radius').value, 10) || 10) / 100);
    editor.setBrushStrength((parseInt(document.getElementById('brush-strength').value, 10) || 8) / 100);
    editor.setBrushMode(document.getElementById('brush-mode').value);
  } else {
    editor.disable();
  }
}

function saveIsland() {
  if (!currentIsland) return;
  const island = {
    ...currentIsland,
    heightMap: editor.getHeightMap() ?? currentIsland.heightMap,
    display: {
      heightScale: (parseInt(document.getElementById('height-scale').value, 10) || 100) / 100,
      wireframe: document.getElementById('wireframe').checked,
    },
    buildings: currentIsland.buildings ?? [],
  };
  const json = serialize(island);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yohoh-island-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Restore UI sliders from config (for load/preset) */
function applyConfigToUI(config, display = {}, seed = null) {
  if (!config) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = String(val); };
  set('grid-size', config.gridSize ?? 128);
  set('elevation-scale', Math.round((config.elevationScale ?? 1.44) / 1.2 * 100));
  set('terrain-roughness', Math.round((config.terrainRoughness ?? 0.7) * 100));
  set('island-radius', Math.round(((config.islandRadius ?? 0.62) - 0.2) / 0.6 * 100));
  set('coast-falloff', Math.round((config.coastFalloff ?? 3.5) * 10));
  set('coast-irregularity', Math.round((config.coastIrregularity ?? 0.25) * 100));
  set('elongation', Math.round((config.elongation ?? 0.8) * 100));
  set('sea-level', Math.round((config.seaLevel ?? 0.12) * 100));
  set('chunk-size', config.chunkSize ?? 8);
  set('flatness-strength', Math.round((config.flatnessStrength ?? 0.8) * 100));
  set('noise-octaves', config.noiseOctaves ?? 5);
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
  fmt('chunk-size', 'val-chunk');
  fmt('flatness-strength', 'val-flatness', (v) => `${v}%`);
  fmt('noise-octaves', 'val-octaves');
  fmt('noise-frequency', 'val-freq', (v) => (parseInt(v, 10) / 10).toFixed(1));
  fmt('noise-persistence', 'val-persist', (v) => (parseInt(v, 10) / 100).toFixed(2));
  fmt('noise-lacunarity', 'val-lac', (v) => (parseInt(v, 10) / 10).toFixed(1));
  fmt('height-scale', 'val-height-scale', (v) => `${v}%`);
  fmt('brush-radius', 'val-brush-radius');
  fmt('brush-strength', 'val-brush-strength');
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
document.getElementById('brush-radius').addEventListener('input', (e) => {
  editor.setBrushRadius(parseInt(e.target.value, 10) / 100);
});
document.getElementById('brush-strength').addEventListener('input', (e) => {
  editor.setBrushStrength(parseInt(e.target.value, 10) / 100);
});

document.getElementById('brush-radius').addEventListener('input', () => {
  if (editMode) editor.setBrushRadius(parseInt(document.getElementById('brush-radius').value, 10) / 100);
});
document.getElementById('brush-strength').addEventListener('input', () => {
  if (editMode) editor.setBrushStrength(parseInt(document.getElementById('brush-strength').value, 10) / 100);
});

document.getElementById('brush-radius').addEventListener('change', () => {
  if (editMode) editor.setBrushRadius(parseInt(document.getElementById('brush-radius').value, 10) / 100);
});

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
bindValueDisplay('chunk-size', 'val-chunk');
bindValueDisplay('flatness-strength', 'val-flatness', (v) => `${v}%`);
bindValueDisplay('noise-octaves', 'val-octaves');
bindValueDisplay('noise-frequency', 'val-freq', (v) => (parseInt(v, 10) / 10).toFixed(1));
bindValueDisplay('noise-persistence', 'val-persist', (v) => (parseInt(v, 10) / 100).toFixed(2));
bindValueDisplay('noise-lacunarity', 'val-lac', (v) => (parseInt(v, 10) / 10).toFixed(1));
bindValueDisplay('height-scale', 'val-height-scale', (v) => `${v}%`);
bindValueDisplay('brush-radius', 'val-brush-radius');
bindValueDisplay('brush-strength', 'val-brush-strength');

run();
