/**
 * YoHoH Procedural Map Generator — Standalone POC
 * Phase 1: Center-out planar graph generation
 */

import { generateMap } from './MapGenerator.js';
import { MapVisualizer } from './MapVisualizer.js';
import { serialize, deserialize } from './MapSerializer.js';
import { removeEdge, addEdge, addNode, removeNode, recomputeAll } from './MapEditor.js';

const container = document.getElementById('canvas-container');
const regenerateBtn = document.getElementById('regenerate');
const statsEl = document.getElementById('stats');

const visualizer = new MapVisualizer(container);
visualizer.init();

let currentMap = null;
let editMode = false;
let addRouteMode = false;
let removeRouteMode = false;
let addNodeMode = false;
let addRouteFirst = null;
let selectedNode = null;

function parseSeed(val) {
  const trimmed = String(val).trim();
  if (!trimmed) return null;
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? null : num;
}

function getConfig() {
  const expansionDistance = Math.max(15, Math.min(50, parseInt(document.getElementById('expansion-distance').value, 10) || 30));
  const minPct = (parseInt(document.getElementById('min-point-distance').value, 10) || 40) / 100;
  const maxPct = (parseInt(document.getElementById('max-edge-length').value, 10) || 150) / 100;
  return {
    numIslands: Math.max(5, Math.min(80, parseInt(document.getElementById('num-islands').value, 10) || 20)),
    expansionDistance,
    minPointDistance: expansionDistance * minPct,
    maxEdgeLength: expansionDistance * maxPct,
    pruneChance: (parseInt(document.getElementById('prune-chance').value, 10) || 0) / 100,
    dangerChance: (parseInt(document.getElementById('danger-chance').value, 10) || 0) / 100,
    appealingChance: (parseInt(document.getElementById('appealing-chance').value, 10) || 0) / 100,
    seed: parseSeed(document.getElementById('seed').value),
  };
}

function updateStats(map) {
  const dangerous = map.nodes.filter(n => n.dangerous).length;
  const appealing = map.nodes.filter(n => n.appealing).length;
  const seedInfo = map.seed != null ? ` Seed: ${map.seed}` : '';
  statsEl.textContent = `${map.nodes.length} islands, ${map.edges.length} routes. ${dangerous} dangerous, ${appealing} appealing.${seedInfo} Home: blue. Ring: green=near, purple=far.`;
}

function run() {
  const seedInput = document.getElementById('seed');
  const hadSeed = String(seedInput.value).trim() !== '';

  const config = getConfig();
  const map = generateMap(config);
  currentMap = map;
  selectedNode = null;
  renderMap();

  if (hadSeed) {
    seedInput.value = map.seed;
  }
}

function getNodeSizeScale() {
  return parseInt(document.getElementById('node-size')?.value ?? 100, 10) || 100;
}
function getEdgeThicknessScale() {
  return parseInt(document.getElementById('edge-thickness')?.value ?? 100, 10) || 100;
}

function renderMap() {
  if (!currentMap) return;
  visualizer.setSelectedNode(selectedNode);
  visualizer.setAppearance(getNodeSizeScale(), getEdgeThicknessScale());
  visualizer.render(currentMap);
  updateStats(currentMap);
}

function loadMap(map) {
  currentMap = map;
  selectedNode = null;
  document.getElementById('seed').value = map.seed ?? '';
  renderMap();
}

function saveMap() {
  if (!currentMap) return;
  const json = serialize(currentMap);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yohoh-map-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function loadMapFromFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const map = deserialize(reader.result);
        loadMap(map);
        setEditMode(true);
      } catch (err) {
        alert('Invalid map file: ' + err.message);
      }
    };
    reader.readAsText(file);
    input.value = '';
  };
  input.click();
}

function setEditMode(enabled) {
  editMode = enabled;
  addRouteMode = false;
  removeRouteMode = false;
  addNodeMode = false;
  addRouteFirst = null;
  if (!enabled) selectedNode = null;
  const editPanel = document.getElementById('edit-panel');
  const editBtn = document.getElementById('edit-mode-btn');
  const addRouteBtn = document.getElementById('add-route-btn');
  const removeRouteBtn = document.getElementById('remove-route-btn');
  if (editPanel) editPanel.style.display = enabled ? 'block' : 'none';
  if (editBtn) {
    editBtn.textContent = enabled ? 'Edit Mode (On)' : 'Edit Mode (Off)';
    editBtn.classList.toggle('active', enabled);
  }
  container.style.cursor = enabled ? 'pointer' : 'default';
  if (addRouteBtn) addRouteBtn.classList.toggle('active', addRouteMode);
  document.getElementById('add-node-btn')?.classList.toggle('active', addNodeMode);
  if (removeRouteBtn) {
    removeRouteBtn.classList.toggle('active', removeRouteMode);
    removeRouteBtn.classList.toggle('danger-mode', removeRouteMode);
  }
  updateSelectedPanel();
}

function handleNodeClick(node) {
  if (!editMode || !currentMap) return;
  if (addNodeMode) {
    addNodeMode = false;
    document.getElementById('add-node-btn')?.classList.remove('active');
  }
  if (addRouteMode) {
    if (addRouteFirst) {
      if (addRouteFirst.id === node.id) {
        addRouteFirst = null;
        addRouteMode = false;
        document.getElementById('add-route-btn')?.classList.remove('active');
        renderMap();
      } else if (addEdge(currentMap, addRouteFirst, node)) {
        addRouteFirst = null;
        addRouteMode = false;
        document.getElementById('add-route-btn')?.classList.remove('active');
        renderMap();
      } else {
        alert('Cannot add route: would cross existing routes or already connected.');
      }
    } else {
      addRouteFirst = node;
      statsEl.textContent = 'Click second island to add route...';
    }
    return;
  }
  if (selectedNode === node) {
    if (node.dangerous) {
      node.dangerous = false;
      node.appealing = true;
    } else if (node.appealing) {
      node.appealing = false;
    } else {
      node.dangerous = true;
    }
  } else {
    selectedNode = node;
  }
  updateSelectedPanel();
  renderMap();
}

function handleNodeMove(node) {
  if (!editMode || !currentMap) return;
  recomputeAll(currentMap);
  populateNodeProperties();
  renderMap();
}

function handleBackgroundClick(mapPos) {
  if (!editMode) return;
  if (addNodeMode && currentMap && mapPos) {
    const newNode = addNode(currentMap, mapPos);
    selectedNode = newNode;
    addNodeMode = false;
    document.getElementById('add-node-btn')?.classList.remove('active');
    updateSelectedPanel();
    populateNodeProperties();
    renderMap();
    return;
  }
  selectedNode = null;
  addRouteFirst = null;
  addRouteMode = false;
  addNodeMode = false;
  document.getElementById('add-route-btn')?.classList.remove('active');
  document.getElementById('add-node-btn')?.classList.remove('active');
  updateSelectedPanel();
  renderMap();
}

function updateSelectedPanel() {
  const panel = document.getElementById('selected-node-panel');
  if (!panel) return;
  panel.style.display = selectedNode && editMode ? 'block' : 'none';
  if (selectedNode) populateNodeProperties();
}

function populateNodeProperties() {
  if (!selectedNode) return;
  const node = selectedNode;
  const xEl = document.getElementById('node-prop-x');
  const yEl = document.getElementById('node-prop-y');
  if (!xEl || !yEl) return;
  document.getElementById('node-prop-id').textContent = node.id;
  const nameEl = document.getElementById('node-prop-name');
  const descEl = document.getElementById('node-prop-description');
  if (nameEl) nameEl.value = node.name ?? '';
  if (descEl) descEl.value = node.description ?? '';
  xEl.value = node.position.x.toFixed(1);
  yEl.value = node.position.y.toFixed(1);
  document.getElementById('node-prop-trait').value = node.dangerous ? 'dangerous' : node.appealing ? 'appealing' : 'normal';
  const treasureEl = document.getElementById('node-prop-treasure');
  const portEl = document.getElementById('node-prop-port');
  const hazardEl = document.getElementById('node-prop-hazard');
  const factionEl = document.getElementById('node-prop-faction');
  const rumorsEl = document.getElementById('node-prop-rumors');
  if (treasureEl) treasureEl.value = String(node.treasureLevel ?? 0);
  if (portEl) portEl.value = node.portType ?? 'none';
  if (hazardEl) hazardEl.value = node.hazard ?? 'none';
  if (factionEl) factionEl.value = node.faction ?? 'neutral';
  if (rumorsEl) rumorsEl.value = node.rumors ?? '';
  document.getElementById('node-prop-dist').textContent = node.distanceFromHome ?? '—';
  document.getElementById('node-prop-conn').textContent = node.connections?.length ?? 0;
}

function handleEdgeClick(a, b) {
  if (!editMode || !currentMap || addRouteMode || !removeRouteMode) return;
  if (removeEdge(currentMap, a, b)) {
    renderMap();
  } else {
    alert('Cannot remove route: would disconnect the map.');
  }
}

function toggleAddRouteMode() {
  if (!editMode) return;
  addRouteMode = !addRouteMode;
  addRouteFirst = null;
  removeRouteMode = false;
  addNodeMode = false;
  document.getElementById('add-route-btn')?.classList.toggle('active', addRouteMode);
  document.getElementById('remove-route-btn')?.classList.remove('active', 'danger-mode');
  document.getElementById('add-node-btn')?.classList.remove('active');
  if (addRouteMode) {
    statsEl.textContent = 'Click first island, then second to add route.';
  } else {
    renderMap();
  }
}

function toggleAddNodeMode() {
  if (!editMode) return;
  addNodeMode = !addNodeMode;
  addRouteMode = false;
  removeRouteMode = false;
  addRouteFirst = null;
  document.getElementById('add-route-btn')?.classList.remove('active');
  document.getElementById('remove-route-btn')?.classList.remove('active', 'danger-mode');
  document.getElementById('add-node-btn')?.classList.toggle('active', addNodeMode);
  if (addNodeMode) {
    statsEl.textContent = 'Click on canvas to add island.';
  } else {
    renderMap();
  }
}

function toggleRemoveRouteMode() {
  if (!editMode) return;
  removeRouteMode = !removeRouteMode;
  addRouteMode = false;
  addNodeMode = false;
  addRouteFirst = null;
  document.getElementById('add-route-btn')?.classList.remove('active');
  document.getElementById('add-node-btn')?.classList.remove('active');
  const removeRouteBtn = document.getElementById('remove-route-btn');
  if (removeRouteBtn) {
    removeRouteBtn.classList.toggle('active', removeRouteMode);
    removeRouteBtn.classList.toggle('danger-mode', removeRouteMode);
  }
  if (removeRouteMode) {
    statsEl.textContent = 'Click routes to remove them.';
  } else {
    renderMap();
  }
}

visualizer.setEditCallbacks(handleNodeClick, handleEdgeClick, handleNodeMove, handleBackgroundClick, () => editMode ? 'pointer' : 'default');

// Bind value displays to inputs
function bindValueDisplay(id, displayId, formatter = v => v) {
  const input = document.getElementById(id);
  const display = document.getElementById(displayId);
  const update = () => { display.textContent = formatter(input.value); };
  input.addEventListener('input', update);
  input.addEventListener('change', update);
  update();
}

bindValueDisplay('num-islands', 'val-islands');
bindValueDisplay('expansion-distance', 'val-expansion');
bindValueDisplay('min-point-distance', 'val-min-dist', v => `${v}%`);
bindValueDisplay('max-edge-length', 'val-max-edge', v => `${v}%`);
bindValueDisplay('prune-chance', 'val-prune', v => `${v}%`);
bindValueDisplay('danger-chance', 'val-danger', v => `${v}%`);
bindValueDisplay('appealing-chance', 'val-appealing', v => `${v}%`);

regenerateBtn.addEventListener('click', run);

document.getElementById('randomize').addEventListener('click', () => {
  document.getElementById('seed').value = '';
  setEditMode(false);
  run();
});

document.getElementById('save-btn').addEventListener('click', saveMap);
document.getElementById('load-btn').addEventListener('click', loadMapFromFile);

document.getElementById('edit-mode-btn').addEventListener('click', () => {
  setEditMode(!editMode);
  if (editMode && currentMap) renderMap();
});

document.getElementById('add-route-btn').addEventListener('click', toggleAddRouteMode);
document.getElementById('add-node-btn').addEventListener('click', toggleAddNodeMode);
document.getElementById('remove-route-btn').addEventListener('click', toggleRemoveRouteMode);
document.getElementById('set-home-btn').addEventListener('click', () => {
  if (!currentMap || !selectedNode) return;
  currentMap.homeNode = selectedNode;
  recomputeAll(currentMap);
  populateNodeProperties();
  renderMap();
});

document.getElementById('delete-node-btn').addEventListener('click', () => {
  if (!currentMap || !selectedNode) return;
  const node = selectedNode;
  if (currentMap.nodes.length <= 1) {
    alert('Cannot delete the last island.');
    return;
  }
  removeNode(currentMap, node);
  selectedNode = null;
  updateSelectedPanel();
  renderMap();
});

document.getElementById('node-prop-x').addEventListener('change', (e) => {
  if (!selectedNode) return;
  const v = parseFloat(e.target.value);
  if (!isNaN(v)) {
    selectedNode.position.x = v;
    recomputeAll(currentMap);
    renderMap();
  }
});
document.getElementById('node-prop-y').addEventListener('change', (e) => {
  if (!selectedNode) return;
  const v = parseFloat(e.target.value);
  if (!isNaN(v)) {
    selectedNode.position.y = v;
    recomputeAll(currentMap);
    renderMap();
  }
});
document.getElementById('node-prop-trait').addEventListener('change', (e) => {
  if (!selectedNode) return;
  const v = e.target.value;
  selectedNode.dangerous = v === 'dangerous';
  selectedNode.appealing = v === 'appealing';
  renderMap();
});
document.getElementById('node-prop-name').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.name = e.target.value;
});
document.getElementById('node-prop-description').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.description = e.target.value;
});
document.getElementById('node-prop-treasure').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.treasureLevel = parseInt(e.target.value, 10) || 0;
});
document.getElementById('node-prop-port').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.portType = e.target.value;
});
document.getElementById('node-prop-hazard').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.hazard = e.target.value;
});
document.getElementById('node-prop-faction').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.faction = e.target.value;
});
document.getElementById('node-prop-rumors').addEventListener('change', (e) => {
  if (!selectedNode) return;
  selectedNode.rumors = e.target.value;
});

bindValueDisplay('node-size', 'val-node-size', v => `${v}%`);
bindValueDisplay('edge-thickness', 'val-edge-thickness', v => `${v}%`);

document.getElementById('node-size')?.addEventListener('input', renderMap);
document.getElementById('edge-thickness')?.addEventListener('input', renderMap);

// Initial run
run();
