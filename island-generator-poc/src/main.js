/**
 * YoHoH Island Terrain Generator — Standalone POC
 * Procedural island mesh generation using Simplex noise
 */

import { generateIsland } from './IslandGenerator.js';
import { IslandVisualizer } from './IslandVisualizer.js';
import { IslandEditor, ELEVATION_LEVELS } from './IslandEditor.js';
import { IslandBuildingPlacer } from './IslandBuildingPlacer.js';
import { IslandPropPlacer } from './IslandPropPlacer.js';
import { getBuildingType, getEffectiveBuildingSize, getBuildingSizeFromObject, setBuildingDimensionOverride } from './BuildingTypes.js';
import { PROP_TYPES, getPropType } from './PropTypes.js';
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
const propPlacer = new IslandPropPlacer(visualizer);

let currentIsland = null;
let editMode = false;
let buildMode = false;
let placeMode = 'buildings'; // 'buildings' | 'props'
let selectedBuilding = null;
let selectedProp = null;

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
  const pathWidth = Math.max(1, Math.min(5, parseInt(document.getElementById('path-width')?.value, 10) || 1));

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
    pathWidth,
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
  island.config = { ...island.config, pathWidth: config.pathWidth };
  island.props = island.props ?? [];
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
  populateIslandProperties();
  selectedBuilding = null;
  selectedProp = null;
  populateBuildingProperties();
  populatePropProperties();
  syncContourOverlay();
  if (!buildMode) {
    buildingPlacer.disable();
    buildingPlacer.onBuildingsChange = null;
    buildingPlacer.onHeightMapChange = null;
    buildingPlacer.onPlacementHover = null;
    buildingPlacer.onBuildingHover = null;
    buildingPlacer.onBuildingSelect = null;
    propPlacer.disable();
    propPlacer.onPropsChange = null;
    propPlacer.onPlacementHover = null;
    propPlacer.onPropHover = null;
    propPlacer.onPropSelect = null;
  }
  if (!buildMode && (island.buildings?.length ?? 0) > 0) {
    buildingPlacer.setHeightMap(island.heightMap);
    const cfg = island.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((island.heightMap?.length - 1 ?? 0) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;
    buildingPlacer.setTileConfig(ts, tilesX, tilesY);
    buildingPlacer.setSeaLevel(cfg?.seaLevel ?? 0.12);
    buildingPlacer.setBuildings(island.buildings, { shared: true });
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
    buildingPlacer.onBuildingSelect = (building) => {
      selectedBuilding = building;
      populateBuildingProperties();
    };
    buildingPlacer.onPlacementHover = () => visualizer.clearPlacementPreview();
    buildingPlacer.enable(container, { selectionOnly: true });
  }
  if (!buildMode && (island.props?.length ?? 0) > 0) {
    propPlacer.setHeightMap(island.heightMap);
    const cfg = island.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((island.heightMap?.length - 1 ?? 0) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;
    propPlacer.setTileConfig(ts, tilesX, tilesY);
    propPlacer.setSeaLevel(cfg?.seaLevel ?? 0.12);
    propPlacer.setProps(island.props);
    propPlacer.setBuildings(island.buildings ?? []);
    propPlacer.onPropHover = (prop) => {
      const hm = currentIsland?.heightMap;
      const cfg = currentIsland?.config;
      const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
      const tilesX = cfg?.tilesX ?? Math.floor((hm?.length - 1 ?? 0) / ts);
      const tilesY = cfg?.tilesY ?? tilesX;
      if (prop && hm) visualizer.setPropHighlight(prop, hm, ts, tilesX, tilesY);
      else visualizer.clearPropHighlight();
    };
    propPlacer.onPropSelect = (prop) => {
      selectedProp = prop;
      selectedBuilding = null;
      populatePropProperties();
      populateBuildingProperties();
    };
    propPlacer.onPlacementHover = () => visualizer.clearPropPlacementPreview();
    propPlacer.enable(container, { selectionOnly: true });
  }
  if (buildMode) {
    setBuildMode(true);
  }
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
    const seaLevel = currentIsland?.config?.seaLevel ?? 0.12;
    const elevMin = parseFloat(document.getElementById('elev-min')?.value) || 0;
    const elevMax = parseFloat(document.getElementById('elev-max')?.value) ?? 1;
    editor.setElevationClamp(elevMin, elevMax);
    editor.onHeightAtCursor = (h, info) => {
      if (elevationHud) {
        elevationHud.style.display = h != null ? 'block' : 'none';
        if (h != null) {
          const band = h <= seaLevel ? 'Water' : h < 0.2 ? 'Beach' : h < 0.45 ? 'Grass' : h < 0.7 ? 'Rock' : 'Snow';
          const tileStr = info ? ` | Tile: (${info.tx},${info.ty})` : '';
          elevationHud.textContent = `Elev: ${h.toFixed(3)} | ${band}${tileStr}`;
        } else {
          elevationHud.textContent = 'Elev: —';
        }
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
    editor.onAfterBrush = syncContourOverlay;
    editor.onRampPreview = (pointA, pointB) => {
      const gridSize = currentIsland?.heightMap?.length - 1 ?? 0;
      if (pointA && pointB && gridSize > 0) {
        visualizer.setRampPreview(pointA, pointB, gridSize);
      } else {
        visualizer._clearRampPreview?.();
      }
    };
    undoStack = [];
    redoStack = [];
    const currentMode = document.getElementById('brush-mode')?.value || 'raise';
    document.querySelectorAll('.brush-tool-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === currentMode ? 'true' : 'false'));
  } else {
    editor.setCanPaint(null);
    editor.onRampPreview = null;
    editor.disable();
    visualizer.setHoverOverlay(null);
    visualizer._clearRampPreview?.();
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
    placeMode = document.querySelector('input[name="place-mode"]:checked')?.value || 'buildings';
    const cfg = currentIsland?.config;
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    const tilesX = cfg?.tilesX ?? Math.floor((currentIsland?.heightMap?.length - 1 ?? 0) / ts);
    const tilesY = cfg?.tilesY ?? tilesX;

    buildingPlacer.setHeightMap(currentIsland?.heightMap);
    buildingPlacer.setTileConfig(ts, tilesX, tilesY);
    buildingPlacer.setSeaLevel(cfg?.seaLevel ?? 0.12);
    buildingPlacer.setBuildings(currentIsland?.buildings ?? []);
    buildingPlacer.setSelectedType(document.getElementById('building-type')?.value || 'tavern');

    propPlacer.setHeightMap(currentIsland?.heightMap);
    propPlacer.setTileConfig(ts, tilesX, tilesY);
    propPlacer.setSeaLevel(cfg?.seaLevel ?? 0.12);
    propPlacer.setProps(currentIsland?.props ?? []);
    propPlacer.setBuildings(currentIsland?.buildings ?? []);
    propPlacer.setSelectedType(document.querySelector('#prop-palette .prop-palette-btn.selected')?.dataset?.type || 'rock_01');
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
    buildingPlacer.onBuildingSelect = (building) => {
      selectedBuilding = building;
      selectedProp = null;
      populateBuildingProperties();
      populatePropProperties();
    };
    propPlacer.onPropsChange = (props) => {
      currentIsland = { ...currentIsland, props };
      visualizer.renderProps(props, currentIsland?.heightMap ?? [], ts, tilesX, tilesY);
      if (typeof updatePropHud === 'function') updatePropHud();
    };
    propPlacer.onPlacementHover = (tx, ty, isValid) => {
      const hm = currentIsland?.heightMap;
      if (tx != null && ty != null && hm) {
        visualizer.setPropPlacementPreview(tx, ty, propPlacer.selectedType, isValid, hm, ts, tilesX, tilesY);
      } else {
        visualizer.clearPropPlacementPreview();
      }
    };
    propPlacer.onPropHover = (prop) => {
      const hm = currentIsland?.heightMap;
      if (prop && hm) visualizer.setPropHighlight(prop, hm, ts, tilesX, tilesY);
      else visualizer.clearPropHighlight();
    };
    propPlacer.onPropSelect = (prop) => {
      selectedProp = prop;
      selectedBuilding = null;
      populatePropProperties();
      populateBuildingProperties();
    };

    if (placeMode === 'buildings') {
      buildingPlacer.enable(container);
      propPlacer.disable();
    } else {
      propPlacer.enable(container);
      buildingPlacer.disable();
    }
    const showGrid = document.getElementById('show-grid-overlay')?.checked;
    visualizer.setTileGridOverlay(showGrid, tilesX, tilesY, currentIsland?.heightMap?.length - 1 ?? 0);
    syncBuildingPalette(buildingPlacer.selectedType);
    syncBuildingDimensions(buildingPlacer.selectedType);
    syncPropPalette(propPlacer.selectedType);
    const buildingsPanel = document.getElementById('place-buildings-panel');
    const propsPanel = document.getElementById('place-props-panel');
    if (placeMode === 'buildings') {
      if (buildingsPanel) buildingsPanel.style.display = 'block';
      if (propsPanel) propsPanel.style.display = 'none';
    } else {
      if (buildingsPanel) buildingsPanel.style.display = 'none';
      if (propsPanel) propsPanel.style.display = 'block';
    }
    updateBuildingsList();
    populateBuildingProperties();
    populatePropProperties();
  } else {
    buildingPlacer.disable();
    propPlacer.disable();
    buildingPlacer.onBuildingsChange = null;
    buildingPlacer.onHeightMapChange = null;
    buildingPlacer.onPlacementHover = null;
    buildingPlacer.onBuildingHover = null;
    buildingPlacer.onBuildingSelect = null;
    propPlacer.onPropsChange = null;
    propPlacer.onPlacementHover = null;
    propPlacer.onPropHover = null;
    propPlacer.onPropSelect = null;
    visualizer.setTileGridOverlay(false);
    visualizer.clearPlacementPreview();
    visualizer.clearBuildingHighlight();
    visualizer.clearPropPlacementPreview();
    visualizer.clearPropHighlight();
    if (buildModeHud) buildModeHud.style.display = 'none';
    const buildings = currentIsland?.buildings ?? [];
    if (buildings.length > 0) {
      buildingPlacer.setHeightMap(currentIsland.heightMap);
      const cfg = currentIsland.config;
      const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
      const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
      const tilesY = cfg?.tilesY ?? tilesX;
      buildingPlacer.setTileConfig(ts, tilesX, tilesY);
      buildingPlacer.setSeaLevel(cfg?.seaLevel ?? 0.12);
      buildingPlacer.setBuildings(buildings, { shared: true });
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
      buildingPlacer.onBuildingSelect = (building) => {
        selectedBuilding = building;
        populateBuildingProperties();
      };
      buildingPlacer.onPlacementHover = () => visualizer.clearPlacementPreview();
      buildingPlacer.enable(container, { selectionOnly: true });
    } else {
      selectedBuilding = null;
    }
    populateBuildingProperties();
  }
  updateBuildModeHud();
}

function updateBuildModeHud() {
  if (!buildModeHud) return;
  if (!buildMode) return;
  if (placeMode === 'props') {
    const def = getPropType(propPlacer.selectedType);
    const name = def?.name ?? propPlacer.selectedType ?? '—';
    const count = propPlacer.getProps().length;
    buildModeHud.textContent = `Prop: ${name} · ${count} placed`;
  } else {
    const def = getBuildingType(buildingPlacer.selectedType);
    const name = def?.name ?? buildingPlacer.selectedType ?? '—';
    const count = buildingPlacer.getBuildings().length;
    buildModeHud.textContent = `Building: ${name} · ${count} placed`;
  }
  buildModeHud.style.display = 'block';
}

function updatePropHud() {
  updateBuildModeHud();
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

function populateIslandProperties() {
  if (!currentIsland) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = String(val ?? ''); };
  set('island-prop-name', currentIsland.name ?? '');
  set('island-prop-description', currentIsland.description ?? '');
  const traitEl = document.getElementById('island-prop-trait');
  if (traitEl) traitEl.value = currentIsland.dangerous ? 'dangerous' : currentIsland.appealing ? 'appealing' : 'normal';
  set('island-prop-treasure', currentIsland.treasureLevel ?? 0);
  set('island-prop-port', currentIsland.portType ?? 'none');
  set('island-prop-hazard', currentIsland.hazard ?? 'none');
  set('island-prop-faction', currentIsland.faction ?? 'neutral');
  set('island-prop-rumors', currentIsland.rumors ?? '');
}

function applyIslandPropertiesFromUI() {
  if (!currentIsland) return;
  const get = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  currentIsland.name = get('island-prop-name') || '';
  currentIsland.description = get('island-prop-description') || '';
  const trait = get('island-prop-trait');
  currentIsland.dangerous = trait === 'dangerous';
  currentIsland.appealing = trait === 'appealing';
  currentIsland.treasureLevel = parseInt(get('island-prop-treasure'), 10) || 0;
  currentIsland.portType = get('island-prop-port') || 'none';
  currentIsland.hazard = get('island-prop-hazard') || 'none';
  currentIsland.faction = get('island-prop-faction') || 'neutral';
  currentIsland.rumors = get('island-prop-rumors') || '';
}

function hexToCss(hex) {
  const r = ((hex >> 16) & 0xff).toString(16).padStart(2, '0');
  const g = ((hex >> 8) & 0xff).toString(16).padStart(2, '0');
  const b = (hex & 0xff).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function populateBuildingProperties() {
  const emptyEl = document.getElementById('building-properties-empty');
  const contentEl = document.getElementById('building-properties-content');
  const typeEl = document.getElementById('building-prop-type');
  const idEl = document.getElementById('building-prop-id');
  const swatchEl = document.getElementById('building-prop-swatch');
  const posEl = document.getElementById('building-prop-position');
  const widthEl = document.getElementById('building-prop-width');
  const heightEl = document.getElementById('building-prop-height');
  const rotationEl = document.getElementById('building-prop-rotation');
  const cargoEl = document.getElementById('building-prop-cargo');
  const cargoFormulaEl = document.getElementById('building-prop-cargo-formula');
  if (!emptyEl || !contentEl) return;
  if (!selectedBuilding) {
    emptyEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';
  const def = getBuildingType(selectedBuilding.type);
  const bSize = getBuildingSizeFromObject(selectedBuilding);
  const cargo = selectedBuilding.cargoSize ?? bSize.width * bSize.height * 10;
  const rot = selectedBuilding.rotation ?? 0;
  if (typeEl) typeEl.textContent = def?.name ?? selectedBuilding.type ?? '—';
  if (idEl) idEl.textContent = selectedBuilding.id ?? '—';
  if (swatchEl && def) swatchEl.style.backgroundColor = hexToCss(def.color);
  if (posEl) posEl.textContent = `Tile (${selectedBuilding.chunkX}, ${selectedBuilding.chunkY})`;
  if (widthEl) widthEl.value = bSize.width;
  if (heightEl) heightEl.value = bSize.height;
  if (rotationEl) rotationEl.textContent = `${rot}°`;
  if (cargoEl) cargoEl.value = cargo;
  if (cargoFormulaEl) cargoFormulaEl.textContent = `${bSize.width}×${bSize.height} × 10 = ${bSize.width * bSize.height * 10} units`;
}

function populatePropProperties() {
  const emptyEl = document.getElementById('prop-properties-empty');
  const contentEl = document.getElementById('prop-properties-content');
  const typeEl = document.getElementById('prop-prop-type');
  const idEl = document.getElementById('prop-prop-id');
  const swatchEl = document.getElementById('prop-prop-swatch');
  const posEl = document.getElementById('prop-prop-position');
  const rotationEl = document.getElementById('prop-prop-rotation');
  if (!emptyEl || !contentEl) return;
  if (!selectedProp) {
    emptyEl.style.display = 'block';
    contentEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  contentEl.style.display = 'block';
  const def = getPropType(selectedProp.type);
  const rot = selectedProp.rotation ?? 0;
  if (typeEl) typeEl.textContent = def?.name ?? selectedProp.type ?? '—';
  if (idEl) idEl.textContent = selectedProp.id ?? '—';
  if (swatchEl && def) swatchEl.style.backgroundColor = hexToCss(def.color);
  if (posEl) posEl.textContent = `Tile (${selectedProp.chunkX}, ${selectedProp.chunkY})`;
  if (rotationEl) rotationEl.textContent = `${rot}°`;
}

function syncPropPalette(selectedType) {
  document.querySelectorAll('#prop-palette .prop-palette-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.type === selectedType);
  });
}

function migrateBuildingCargoSize(buildings) {
  if (!Array.isArray(buildings)) return buildings;
  return buildings.map((b) => {
    const size = getBuildingSizeFromObject(b);
    const updates = {};
    if (b.width == null || b.height == null) {
      updates.width = size.width;
      updates.height = size.height;
    }
    if (b.cargoSize == null) {
      updates.cargoSize = size.width * size.height * 10;
    }
    return Object.keys(updates).length ? { ...b, ...updates } : b;
  });
}

function syncContourOverlay() {
  const show = document.getElementById('contour-overlay')?.checked;
  const hm = editor.getHeightMap() ?? currentIsland?.heightMap;
  if (hm) visualizer.setContourOverlay(!!show, hm, 0.1);
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
  syncContourOverlay();
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
  syncContourOverlay();
}

function normalizeBuildingsForSave(buildings) {
  if (!Array.isArray(buildings)) return buildings;
  return buildings.map((b) => {
    const size = getBuildingSizeFromObject(b);
    const cargo = b.cargoSize ?? size.width * size.height * 10;
    return {
      ...b,
      width: size.width,
      height: size.height,
      cargoSize: cargo,
    };
  });
}

function saveIsland() {
  if (!currentIsland) return;
  applyIslandPropertiesFromUI();
  const mode = document.getElementById('save-mode')?.value || 'full';
  const rawBuildings = buildMode ? buildingPlacer.getBuildings() : (currentIsland.buildings ?? []);
  const buildings = normalizeBuildingsForSave(rawBuildings);
  const rawProps = buildMode ? propPlacer.getProps() : (currentIsland.props ?? []);
  const island = {
    ...currentIsland,
    heightMap: mode === 'full' ? (editor.getHeightMap() ?? currentIsland.heightMap) : undefined,
    display: {
      heightScale: (parseInt(document.getElementById('height-scale').value, 10) || 100) / 100,
      wireframe: document.getElementById('wireframe').checked,
    },
    buildings: mode === 'full' ? buildings : [],
    props: mode === 'full' ? rawProps : [],
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
  set('path-width', Math.max(1, Math.min(5, config.pathWidth ?? 1)));
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
  fmt('path-width', 'val-path-width');
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
        const config = { ...data.config, pathWidth: data.config?.pathWidth ?? 1 };
        const buildings = migrateBuildingCargoSize(data.buildings ?? []);
        let island;
        if (data.heightMap) {
          island = {
            heightMap: data.heightMap,
            config,
            buildings,
            seed: data.seed,
            name: data.name ?? '',
            description: data.description ?? '',
            dangerous: data.dangerous ?? false,
            appealing: data.appealing ?? false,
            treasureLevel: data.treasureLevel ?? 0,
            portType: data.portType ?? 'none',
            hazard: data.hazard ?? 'none',
            faction: data.faction ?? 'neutral',
            rumors: data.rumors ?? '',
          };
        } else {
          island = generateIsland(getConfig());
          island.buildings = buildings;
          island.props = props;
          island.config = { ...island.config, pathWidth: config.pathWidth };
          island.name = data.name ?? island.name ?? '';
          island.description = data.description ?? island.description ?? '';
          island.dangerous = data.dangerous ?? island.dangerous ?? false;
          island.appealing = data.appealing ?? island.appealing ?? false;
          island.treasureLevel = data.treasureLevel ?? island.treasureLevel ?? 0;
          island.portType = data.portType ?? island.portType ?? 'none';
          island.hazard = data.hazard ?? island.hazard ?? 'none';
          island.faction = data.faction ?? island.faction ?? 'neutral';
          island.rumors = data.rumors ?? island.rumors ?? '';
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
        if (island.props?.length) {
          const ts = island.config?.tileSize ?? island.config?.chunkSize ?? 8;
          const tilesX = Math.floor((island.heightMap?.length - 1 ?? 0) / ts);
          visualizer.renderProps(island.props, island.heightMap, ts, tilesX, tilesX);
        }
        updateStats(island);
        populateIslandProperties();
        selectedBuilding = null;
        populateBuildingProperties();
        document.getElementById('seed').value = island.seed ?? '';
        setEditMode(true);
        syncContourOverlay();
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
    const config = { ...data.config, pathWidth: data.config?.pathWidth ?? 1 };
    const buildings = migrateBuildingCargoSize(data.buildings ?? []);
    let island;
    if (data.heightMap) {
      island = {
        heightMap: data.heightMap,
        config,
        buildings,
        seed: data.seed,
        name: data.name ?? '',
        description: data.description ?? '',
        dangerous: data.dangerous ?? false,
        appealing: data.appealing ?? false,
        treasureLevel: data.treasureLevel ?? 0,
        portType: data.portType ?? 'none',
        hazard: data.hazard ?? 'none',
        faction: data.faction ?? 'neutral',
        rumors: data.rumors ?? '',
      };
    } else {
      island = generateIsland(getConfig());
      island.buildings = buildings;
      island.config = { ...island.config, pathWidth: config.pathWidth };
      island.name = data.name ?? island.name ?? '';
      island.description = data.description ?? island.description ?? '';
      island.dangerous = data.dangerous ?? island.dangerous ?? false;
      island.appealing = data.appealing ?? island.appealing ?? false;
      island.treasureLevel = data.treasureLevel ?? island.treasureLevel ?? 0;
      island.portType = data.portType ?? island.portType ?? 'none';
      island.hazard = data.hazard ?? island.hazard ?? 'none';
      island.faction = data.faction ?? island.faction ?? 'neutral';
      island.rumors = data.rumors ?? island.rumors ?? '';
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
    populateIslandProperties();
    selectedBuilding = null;
    populateBuildingProperties();
    setEditMode(true);
    syncContourOverlay();
    select.value = '';
  } catch (err) {
    alert('Failed to load preset: ' + err.message);
  }
}
document.getElementById('load-preset-btn').addEventListener('click', loadPreset);

['island-prop-name', 'island-prop-description', 'island-prop-trait', 'island-prop-treasure', 'island-prop-port', 'island-prop-hazard', 'island-prop-faction', 'island-prop-rumors'].forEach((id) => {
  document.getElementById(id)?.addEventListener('change', applyIslandPropertiesFromUI);
});

function applyBuildingSizeChange() {
  if (!selectedBuilding || !currentIsland) return;
  const widthEl = document.getElementById('building-prop-width');
  const heightEl = document.getElementById('building-prop-height');
  const cargoEl = document.getElementById('building-prop-cargo');
  if (!widthEl || !heightEl || !cargoEl) return;
  const w = Math.max(1, Math.min(5, parseInt(widthEl.value, 10) || 1));
  const h = Math.max(1, Math.min(5, parseInt(heightEl.value, 10) || 1));
  const cargo = Math.max(10, parseInt(cargoEl.value, 10) || 10);
  const buildings = buildMode ? buildingPlacer.getBuildings() : (currentIsland.buildings ?? []);
  const isValid = buildingPlacer.canPlaceAtFootprint(
    selectedBuilding.chunkX, selectedBuilding.chunkY, w, h, selectedBuilding.type,
    { chunkX: selectedBuilding.chunkX, chunkY: selectedBuilding.chunkY }
  );
  if (!isValid) {
    populateBuildingProperties();
    return;
  }
  const oldW = selectedBuilding.width ?? getBuildingSizeFromObject(selectedBuilding).width;
  const oldH = selectedBuilding.height ?? getBuildingSizeFromObject(selectedBuilding).height;
  selectedBuilding.width = w;
  selectedBuilding.height = h;
  selectedBuilding.cargoSize = cargo;
  if (w > oldW || h > oldH) {
    buildingPlacer.flattenRegion(selectedBuilding.chunkX, selectedBuilding.chunkY, w, h, selectedBuilding.type);
    const hm = buildingPlacer.heightMap;
    if (hm) {
      currentIsland.heightMap = hm.map(row => [...row]);
      editor.setHeightMap(currentIsland.heightMap);
      if (buildingPlacer.onHeightMapChange) buildingPlacer.onHeightMapChange(currentIsland.heightMap);
    }
  }
  const cfg = currentIsland.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
  const tilesY = cfg?.tilesY ?? tilesX;
  if (buildings.length >= 2 && currentIsland.heightMap) {
    const { pathTiles, heightMap } = computePathsBetweenBuildings(
      buildings, currentIsland.heightMap, { ...cfg, tilesX, tilesY }
    );
    currentIsland.heightMap = heightMap;
    currentIsland.pathTiles = [...pathTiles];
    editor.setHeightMap(heightMap);
    buildingPlacer.setHeightMap?.(heightMap);
    visualizer.updateFromHeightMap(heightMap, pathTiles, ts);
  } else {
    visualizer.updateFromHeightMap(currentIsland.heightMap, currentIsland.pathTiles ? new Set(currentIsland.pathTiles) : new Set(), ts);
  }
  visualizer.renderBuildings(buildings, currentIsland.heightMap, ts, tilesX, tilesY);
  if (buildMode && buildingPlacer.onBuildingsChange) buildingPlacer.onBuildingsChange(buildings);
}

document.getElementById('building-prop-width')?.addEventListener('change', applyBuildingSizeChange);
document.getElementById('building-prop-height')?.addEventListener('change', applyBuildingSizeChange);
document.getElementById('building-prop-cargo')?.addEventListener('change', applyBuildingSizeChange);

document.getElementById('building-rotate-btn')?.addEventListener('click', () => {
  if (!selectedBuilding || !currentIsland) return;
  const def = getBuildingType(selectedBuilding.type);
  if (!def) return;
  const rots = [0, 90, 180, 270];
  const idx = rots.indexOf(selectedBuilding.rotation ?? 0);
  selectedBuilding.rotation = rots[(idx + 1) % 4];
  const buildings = buildMode ? buildingPlacer.getBuildings() : (currentIsland.buildings ?? []);
  const cfg = currentIsland.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
  const tilesY = cfg?.tilesY ?? tilesX;
  visualizer.renderBuildings(buildings, currentIsland.heightMap, ts, tilesX, tilesY);
  if (buildMode && buildingPlacer.onBuildingsChange) buildingPlacer.onBuildingsChange(buildings);
});

document.getElementById('building-remove-btn')?.addEventListener('click', () => {
  if (!selectedBuilding || !currentIsland) return;
  const buildings = (currentIsland.buildings ?? []).filter((b) => b !== selectedBuilding);
  currentIsland.buildings = buildings;
  if (buildMode) {
    buildingPlacer.setBuildings(buildings);
  } else {
    buildingPlacer.setBuildings(buildings, { shared: true });
  }
  selectedBuilding = null;
  populateBuildingProperties();
  populatePropProperties();
  const cfg = currentIsland.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
  const tilesY = cfg?.tilesY ?? tilesX;
  if (buildings.length >= 2 && currentIsland.heightMap) {
    const { pathTiles, heightMap } = computePathsBetweenBuildings(
      buildings, currentIsland.heightMap, { ...cfg, tilesX, tilesY }
    );
    currentIsland.heightMap = heightMap;
    currentIsland.pathTiles = [...pathTiles];
    editor.setHeightMap(heightMap);
    visualizer.updateFromHeightMap(heightMap, pathTiles, ts);
  } else {
    currentIsland.pathTiles = [];
    visualizer.updateFromHeightMap(currentIsland.heightMap, new Set(), ts);
  }
  visualizer.renderBuildings(buildings, currentIsland.heightMap, ts, tilesX, tilesY);
  if (buildMode && buildingPlacer.onBuildingsChange) buildingPlacer.onBuildingsChange(buildings);
});

document.getElementById('edit-mode-btn').addEventListener('click', () => {
  setEditMode(!editMode);
});

document.getElementById('build-mode-btn')?.addEventListener('click', () => {
  setBuildMode(!buildMode);
});

document.querySelectorAll('input[name="place-mode"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    placeMode = e.target.value;
    if (buildMode) setBuildMode(true);
    const buildingsPanel = document.getElementById('place-buildings-panel');
    const propsPanel = document.getElementById('place-props-panel');
    if (placeMode === 'buildings') {
      if (buildingsPanel) buildingsPanel.style.display = 'block';
      if (propsPanel) propsPanel.style.display = 'none';
    } else {
      if (buildingsPanel) buildingsPanel.style.display = 'none';
      if (propsPanel) propsPanel.style.display = 'block';
    }
  });
});

document.querySelectorAll('#prop-palette .prop-palette-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    if (!type) return;
    propPlacer.setSelectedType(type);
    syncPropPalette(type);
    updateBuildModeHud();
  });
});

document.getElementById('prop-rotate-btn')?.addEventListener('click', () => {
  if (!selectedProp || !currentIsland) return;
  const rots = [0, 90, 180, 270];
  const idx = rots.indexOf(selectedProp.rotation ?? 0);
  selectedProp.rotation = rots[(idx + 1) % 4];
  const props = buildMode ? propPlacer.getProps() : (currentIsland.props ?? []);
  const cfg = currentIsland.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
  const tilesY = cfg?.tilesY ?? tilesX;
  visualizer.renderProps(props, currentIsland.heightMap, ts, tilesX, tilesY);
  if (buildMode && propPlacer.onPropsChange) propPlacer.onPropsChange(props);
  currentIsland = { ...currentIsland, props };
  populatePropProperties();
});

document.getElementById('prop-remove-btn')?.addEventListener('click', () => {
  if (!selectedProp || !currentIsland) return;
  const props = (currentIsland.props ?? []).filter((p) => p !== selectedProp);
  currentIsland = { ...currentIsland, props };
  if (buildMode) propPlacer.setProps(props);
  selectedProp = null;
  populatePropProperties();
  const cfg = currentIsland.config;
  const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
  const tilesX = cfg?.tilesX ?? Math.floor((currentIsland.heightMap?.length - 1 ?? 0) / ts);
  const tilesY = cfg?.tilesY ?? tilesX;
  visualizer.renderProps(props, currentIsland.heightMap, ts, tilesX, tilesY);
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

document.querySelectorAll('.brush-tool-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (!mode) return;
    document.getElementById('brush-mode').value = mode;
    editor.setBrushMode(mode);
    document.querySelectorAll('.brush-tool-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
  });
});
document.getElementById('brush-mode').addEventListener('change', (e) => {
  const mode = e.target.value;
  editor.setBrushMode(mode);
  document.querySelectorAll('.brush-tool-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
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

document.getElementById('contour-overlay')?.addEventListener('change', () => {
  syncContourOverlay();
});

document.getElementById('elev-min')?.addEventListener('change', () => {
  const min = parseFloat(document.getElementById('elev-min').value) || 0;
  const max = parseFloat(document.getElementById('elev-max').value) ?? 1;
  editor.setElevationClamp(min, max);
});
document.getElementById('elev-max')?.addEventListener('change', () => {
  const min = parseFloat(document.getElementById('elev-min').value) || 0;
  const max = parseFloat(document.getElementById('elev-max').value) ?? 1;
  editor.setElevationClamp(min, max);
});

// Keyboard shortcuts: E=Edit, 1-7=brush tools, Z=undo, Y=redo, B=brush size cycle
document.addEventListener('keydown', (e) => {
  if (document.activeElement?.closest?.('input, textarea, select')) return;
  const key = e.key.toLowerCase();
  if (key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    setEditMode(!editMode);
    return;
  }
  if (editMode) {
    if (key === 'z' && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      undo();
      return;
    }
    if ((key === 'y' || (key === 'z' && e.shiftKey)) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      redo();
      return;
    }
    if (key === 'b' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const sel = document.getElementById('brush-size-tiles');
      if (sel) {
        const vals = ['1', '2', '3', '4', '5'];
        const idx = vals.indexOf(sel.value);
        sel.value = vals[(idx + 1) % vals.length];
        editor.setBrushSizeInTiles(parseInt(sel.value, 10) || 1);
      }
      return;
    }
    if (key === 'Escape') {
      if (editor.rampPointA) {
        e.preventDefault();
        editor.rampPointA = null;
        editor.setBrushMode(editor.brushMode);
        visualizer._clearRampPreview?.();
      }
      return;
    }
    if (key >= '1' && key <= '8') {
      e.preventDefault();
      const modes = ['raise', 'lower', 'flatten', 'absolute', 'set', 'plateau', 'smooth', 'ramp'];
      const mode = modes[parseInt(key, 10) - 1];
      document.getElementById('brush-mode').value = mode;
      editor.setBrushMode(mode);
      document.querySelectorAll('.brush-tool-btn').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
    }
  }
});

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

document.getElementById('path-width')?.addEventListener('change', () => {
  if (!currentIsland) return;
  const pathWidth = Math.max(1, Math.min(5, parseInt(document.getElementById('path-width')?.value, 10) || 1));
  const cfg = { ...currentIsland.config, pathWidth };
  currentIsland.config = cfg;
  if (currentIsland.buildings?.length >= 2) {
    const hm = currentIsland.heightMap.map((row) => [...row]);
    const { pathTiles, heightMap } = computePathsBetweenBuildings(currentIsland.buildings, hm, cfg);
    currentIsland.heightMap = heightMap;
    currentIsland.pathTiles = [...pathTiles];
    editor.setHeightMap(heightMap);
    buildingPlacer.setHeightMap?.(heightMap);
    const ts = cfg?.tileSize ?? cfg?.chunkSize ?? 8;
    visualizer.updateFromHeightMap(heightMap, pathTiles, ts);
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
bindValueDisplay('path-width', 'val-path-width');
bindValueDisplay('brush-target', 'val-brush-target');
bindValueDisplay('brush-strength', 'val-brush-strength', (v) => `${((parseInt(v, 10) || 16) / 40 * 20).toFixed(0)}%`);

run();
