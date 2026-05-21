/**
 * YoHoH — Debug overlay (tabbed)
 *
 * Toggleable on-screen panel for developers + interested players. Press the
 * backtick (`) key to show/hide.
 *
 * Logging_Improvements.md §9 "Log UI overhaul" — the panel is now tabbed:
 *   - State    : live key/value sections (Game / Overworld / Ship / Sailing)
 *   - Events   : virtualised Logger event list with filter bar
 *   - Ledger   : transaction ledger (Ledger_Improvements.md)
 *   - Config   : Logger preset / per-sink / per-category controls
 *
 * Backward-compatible API:
 *   - `init()`, `setSection(name, text)`, `log(message)`, `flush()`
 *   - `show()`, `hide()`, `toggle()`, `isVisible()`, `destroy()`
 *   - `copyToClipboard()`, `downloadDump()`, `buildDumpText()`
 *   - `attachLogger(logger)` (from L1)
 *   - `attachLedger(ledger)` (new)
 *
 * Hot-path safety: per-frame `flush()` is gated by `this.visible` and
 * dirty-flagged. Event-list rendering is throttled via requestAnimationFrame.
 */

const MAX_LEGACY_LOG_LINES = 200; // raised from 20 since the Events tab can scroll
const TAB_ORDER = ['state', 'events', 'ledger', 'config'];
const TAB_LABELS = { state: 'State', events: 'Events', ledger: 'Ledger', config: 'Config' };

const LEVEL_TO_NAME = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
const NAME_TO_LEVEL = { silent: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };
const LEVEL_COLOR = {
  error: '#ff6a6a',
  warn:  '#ffcc66',
  info:  '#88ccff',
  debug: '#9adfa6',
  trace: '#888888',
};

export class DebugOverlay {
  constructor() {
    this.overlay = null;
    this.visible = false;

    // Legacy state-section store — survives the rewrite.
    this._sections = new Map();
    this._sectionsDirty = true;

    // Legacy log buffer — used as fallback when no Logger is attached.
    this._log = [];
    this._logDirty = true;

    // Attached subsystems (lazy — overlay works without them).
    this._logger = null;
    this._ledger = null;

    // Tab state.
    this._activeTab = 'state';
    this._tabContents = {};
    this._tabButtons = {};

    // Events tab filter state — persisted across tab switches.
    this._filter = { level: 'trace', categories: new Set(), search: '' };
    this._paused = false;
    this._autoScroll = true;
    this._eventsRafId = null;

    // Ledger tab state.
    this._ledgerFilter = { type: '', category: '', search: '' };
    this._ledgerRafId = null;

    this._keyHandler = null;
  }

  // ─── Init ───────────────────────────────────────────────────────────────
  init() {
    if (this.overlay) return;
    this.overlay = document.createElement('div');
    this.overlay.id = 'debug-overlay';
    this.overlay.style.cssText = [
      'position:fixed',
      'top:8px',
      'left:8px',
      'z-index:9999',
      'width:min(560px, 80vw)',
      'max-height:90vh',
      'display:none',
      'flex-direction:column',
      'background:rgba(10,20,30,0.94)',
      'border:1px solid #3a5a7a',
      'border-radius:6px',
      'color:#cfe6ff',
      'font:11px/1.4 ui-monospace, Menlo, Consolas, monospace',
      'pointer-events:auto',
      'user-select:text',
      '-webkit-user-select:text',
      'box-shadow:0 4px 24px rgba(0,0,0,0.5)',
    ].join(';');

    // Header — title + shared actions.
    const header = document.createElement('div');
    header.style.cssText = 'display:flex; align-items:center; gap:8px; padding:6px 10px; border-bottom:1px solid #233a52; color:#ffcc88; flex-wrap:wrap;';
    const title = document.createElement('b');
    title.textContent = 'DEBUG';
    header.appendChild(title);
    const hint = document.createElement('span');
    hint.textContent = '` toggle';
    hint.style.cssText = 'color:#7a8a9a; font-weight:normal; font-size:10px;';
    header.appendChild(hint);
    header.appendChild(this._mkBtn('Copy', () => this.copyToClipboard()));
    header.appendChild(this._mkBtn('Download', () => this.downloadDump()));
    this.overlay.appendChild(header);

    // Tab bar.
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex; gap:0; border-bottom:1px solid #233a52; background:rgba(20,36,56,0.6);';
    for (const tab of TAB_ORDER) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.tab = tab;
      btn.textContent = TAB_LABELS[tab];
      btn.style.cssText = 'padding:6px 12px; background:transparent; border:0; border-right:1px solid #233a52; color:#cfe6ff; font-family:inherit; font-size:11px; cursor:pointer;';
      btn.addEventListener('click', () => this.setActiveTab(tab));
      tabBar.appendChild(btn);
      this._tabButtons[tab] = btn;
    }
    this.overlay.appendChild(tabBar);

    // Tab contents — one per tab; switched via display:none.
    const contentWrap = document.createElement('div');
    contentWrap.style.cssText = 'flex:1; min-height:0; overflow:hidden; display:flex; flex-direction:column;';
    this.overlay.appendChild(contentWrap);

    // STATE tab — live key/value sections.
    this._tabContents.state = document.createElement('div');
    this._tabContents.state.style.cssText = 'flex:1; overflow:auto; padding:6px 10px; white-space:pre-wrap; word-break:break-word;';
    contentWrap.appendChild(this._tabContents.state);

    // EVENTS tab — filter bar + virtualised list.
    this._tabContents.events = document.createElement('div');
    this._tabContents.events.style.cssText = 'flex:1; display:none; flex-direction:column; min-height:0;';
    contentWrap.appendChild(this._tabContents.events);
    this._buildEventsTab(this._tabContents.events);

    // LEDGER tab — filter bar + table.
    this._tabContents.ledger = document.createElement('div');
    this._tabContents.ledger.style.cssText = 'flex:1; display:none; flex-direction:column; min-height:0;';
    contentWrap.appendChild(this._tabContents.ledger);
    this._buildLedgerTab(this._tabContents.ledger);

    // CONFIG tab — Logger controls.
    this._tabContents.config = document.createElement('div');
    this._tabContents.config.style.cssText = 'flex:1; display:none; overflow:auto; padding:8px 10px;';
    contentWrap.appendChild(this._tabContents.config);
    this._tabContents.config.innerHTML = '<div style="color:#7a8a9a;">Attach a Logger to see controls here.</div>';

    document.body.appendChild(this.overlay);
    this._highlightActiveTab();

    this._keyHandler = (e) => this._onKeyDown(e);
    document.addEventListener('keydown', this._keyHandler);
  }

  _mkBtn(label, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText = 'padding:2px 8px; background:#2a4a6a; border:1px solid #3a5a7a; border-radius:3px; color:#e8e6e3; font-family:inherit; font-size:10px; cursor:pointer; margin-left:auto;';
    b.addEventListener('click', onClick);
    return b;
  }

  // ─── Tab switching ──────────────────────────────────────────────────────
  setActiveTab(tab) {
    if (!TAB_ORDER.includes(tab)) return;
    this._activeTab = tab;
    for (const t of TAB_ORDER) {
      this._tabContents[t].style.display = t === tab
        ? (t === 'state' ? 'block' : 'flex')
        : 'none';
    }
    this._highlightActiveTab();
    // Render-on-open for the dynamic tabs.
    if (tab === 'events') this._renderEvents();
    else if (tab === 'ledger') this._renderLedger();
    else if (tab === 'config') this._renderConfig();
  }

  _highlightActiveTab() {
    for (const tab of TAB_ORDER) {
      const btn = this._tabButtons[tab];
      const active = tab === this._activeTab;
      btn.style.background = active ? 'rgba(58, 90, 122, 0.6)' : 'transparent';
      btn.style.color = active ? '#ffd88a' : '#cfe6ff';
      btn.style.borderBottom = active ? '2px solid #ffd88a' : '2px solid transparent';
    }
    this._updateTabCounts();
  }

  _updateTabCounts() {
    if (!this._tabButtons.events) return;
    const evCount = this._logger?.getSink?.('memory')?.count ?? this._log.length;
    const ldCount = this._ledger?.count ?? 0;
    this._tabButtons.events.textContent = `${TAB_LABELS.events}${evCount ? ` (${evCount})` : ''}`;
    this._tabButtons.ledger.textContent = `${TAB_LABELS.ledger}${ldCount ? ` (${ldCount})` : ''}`;
  }

  // ─── Events tab ─────────────────────────────────────────────────────────
  _buildEventsTab(root) {
    // Filter bar
    const bar = document.createElement('div');
    bar.style.cssText = 'display:flex; gap:6px; padding:6px 10px; border-bottom:1px solid #233a52; align-items:center; flex-wrap:wrap;';
    // Level threshold
    const levelSel = document.createElement('select');
    levelSel.title = 'Show events at or above this level';
    levelSel.style.cssText = 'background:#1a2a3a; color:#cfe6ff; border:1px solid #3a5a7a; font-family:inherit; font-size:10px; padding:1px 3px;';
    for (const lvl of ['trace', 'debug', 'info', 'warn', 'error']) {
      const opt = document.createElement('option');
      opt.value = lvl; opt.textContent = `≥ ${lvl}`;
      if (lvl === this._filter.level) opt.selected = true;
      levelSel.appendChild(opt);
    }
    levelSel.addEventListener('change', () => { this._filter.level = levelSel.value; this._renderEvents(); });
    bar.appendChild(this._labelled('Level', levelSel));
    // Search box
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'search…';
    search.style.cssText = 'background:#1a2a3a; color:#cfe6ff; border:1px solid #3a5a7a; font-family:inherit; font-size:10px; padding:1px 4px; width:120px;';
    search.addEventListener('input', () => { this._filter.search = search.value.toLowerCase(); this._renderEvents(); });
    bar.appendChild(this._labelled('Find', search));
    // Pause + auto-scroll
    const pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.textContent = '⏸';
    pauseBtn.title = 'Pause auto-update';
    pauseBtn.style.cssText = 'background:#2a4a6a; color:#cfe6ff; border:1px solid #3a5a7a; border-radius:3px; padding:1px 6px; font-size:10px; cursor:pointer;';
    pauseBtn.addEventListener('click', () => {
      this._paused = !this._paused;
      pauseBtn.textContent = this._paused ? '▶' : '⏸';
      pauseBtn.title = this._paused ? 'Resume auto-update' : 'Pause auto-update';
      if (!this._paused) this._renderEvents();
    });
    bar.appendChild(pauseBtn);
    const scrollBtn = document.createElement('button');
    scrollBtn.type = 'button';
    scrollBtn.textContent = '⬇';
    scrollBtn.title = 'Auto-scroll on';
    scrollBtn.style.cssText = pauseBtn.style.cssText;
    scrollBtn.addEventListener('click', () => {
      this._autoScroll = !this._autoScroll;
      scrollBtn.style.opacity = this._autoScroll ? '1' : '0.45';
      scrollBtn.title = this._autoScroll ? 'Auto-scroll on (click to disable)' : 'Auto-scroll off (click to enable)';
    });
    bar.appendChild(scrollBtn);
    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = pauseBtn.style.cssText;
    clearBtn.addEventListener('click', () => {
      this._log.length = 0; this._logDirty = true;
      const mem = this._logger?.getSink?.('memory');
      if (mem?.clear) mem.clear();
      this._renderEvents();
    });
    bar.appendChild(clearBtn);
    root.appendChild(bar);

    // Category chips row (filled in by _renderEvents based on counts)
    this._eventsCategoryRoot = document.createElement('div');
    this._eventsCategoryRoot.style.cssText = 'display:flex; gap:4px; padding:4px 10px; border-bottom:1px solid #233a52; flex-wrap:wrap; min-height:18px;';
    root.appendChild(this._eventsCategoryRoot);

    // Virtualised list area (using overflow:auto + max height)
    this._eventsListRoot = document.createElement('div');
    this._eventsListRoot.style.cssText = 'flex:1; overflow:auto; padding:4px 10px; min-height:0;';
    root.appendChild(this._eventsListRoot);
  }

  _labelled(label, el) {
    const wrap = document.createElement('label');
    wrap.style.cssText = 'display:inline-flex; align-items:center; gap:3px; color:#7a8a9a;';
    wrap.appendChild(document.createTextNode(label + ':'));
    wrap.appendChild(el);
    return wrap;
  }

  _renderEvents() {
    if (this._activeTab !== 'events' || !this._eventsListRoot) return;
    if (this._paused) return;
    // Source data: prefer the Logger's MemorySink for richness; fall back to
    // the legacy `_log` array when no Logger is attached (tests, etc).
    const mem = this._logger?.getSink?.('memory');
    let entries;
    if (mem?.snapshot) {
      entries = mem.snapshot();
    } else {
      // Adapter — wrap legacy strings as fake entries
      entries = this._log.map((s, i) => ({
        id: i, ts: 0, level: NAME_TO_LEVEL.info, category: 'legacy', msg: s, data: null,
      }));
    }
    // Apply filter
    const minLevel = NAME_TO_LEVEL[this._filter.level] ?? NAME_TO_LEVEL.trace;
    const wantCats = this._filter.categories;
    const search = this._filter.search;
    const counts = {};
    const filtered = [];
    for (const e of entries) {
      counts[e.category] = (counts[e.category] ?? 0) + 1;
      if (e.level > minLevel) continue;
      if (wantCats.size > 0 && !wantCats.has(e.category)) continue;
      if (search && !`${e.msg} ${e.category} ${e.data ? JSON.stringify(e.data) : ''}`.toLowerCase().includes(search)) continue;
      filtered.push(e);
    }
    // Render category chips
    const sortedCats = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    this._eventsCategoryRoot.innerHTML = '';
    for (const [cat, n] of sortedCats) {
      const chip = document.createElement('button');
      chip.type = 'button';
      const on = wantCats.has(cat);
      chip.textContent = `${cat} ${n}`;
      chip.style.cssText = `background:${on ? '#3a5a7a' : '#1a2a3a'}; color:${on ? '#ffd88a' : '#cfe6ff'}; border:1px solid #3a5a7a; border-radius:8px; padding:0 6px; font:10px ui-monospace, monospace; cursor:pointer;`;
      chip.addEventListener('click', () => {
        if (wantCats.has(cat)) wantCats.delete(cat); else wantCats.add(cat);
        this._renderEvents();
      });
      this._eventsCategoryRoot.appendChild(chip);
    }
    if (wantCats.size > 0) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.textContent = 'clear';
      clear.style.cssText = 'background:#4a2a2a; color:#ffaa88; border:1px solid #6a4a4a; border-radius:8px; padding:0 6px; font:10px ui-monospace, monospace; cursor:pointer;';
      clear.addEventListener('click', () => { wantCats.clear(); this._renderEvents(); });
      this._eventsCategoryRoot.appendChild(clear);
    }
    // Build the list — cap to most-recent N for sanity (virtualisation proper is L3).
    const MAX_RENDER = 500;
    const start = Math.max(0, filtered.length - MAX_RENDER);
    const slice = filtered.slice(start);
    const html = slice.map(e => this._eventRowHtml(e)).join('');
    this._eventsListRoot.innerHTML = html;
    if (this._autoScroll) this._eventsListRoot.scrollTop = this._eventsListRoot.scrollHeight;
    this._updateTabCounts();
  }

  _eventRowHtml(e) {
    const lvlName = LEVEL_TO_NAME[e.level] ?? '?';
    const color = LEVEL_COLOR[lvlName] ?? '#888888';
    const t = e.ts ? new Date(e.ts).toISOString().slice(11, 23) : '';
    const dataHtml = e.data
      ? `<details style="margin:2px 0 4px 0;"><summary style="cursor:pointer; color:#7a8a9a;">data</summary><pre style="margin:2px 0 0 0; color:#cfdce6; white-space:pre-wrap;">${esc(JSON.stringify(e.data, null, 2))}</pre></details>`
      : '';
    return `<div style="padding:1px 0; border-bottom:1px solid rgba(35,58,82,0.5);">`
      + `<span style="color:#7a8a9a;">${t}</span> `
      + `<span style="color:${color}; font-weight:700;">${lvlName.toUpperCase().padEnd(5)}</span> `
      + `<span style="color:#ffd88a;">[${esc(e.category)}]</span> `
      + `<span>${esc(e.msg ?? '')}</span>`
      + `${dataHtml}`
      + `</div>`;
  }

  // ─── Ledger tab ─────────────────────────────────────────────────────────
  _buildLedgerTab(root) {
    // Summary strip
    this._ledgerSummary = document.createElement('div');
    this._ledgerSummary.style.cssText = 'padding:6px 10px; border-bottom:1px solid #233a52; color:#ffd88a; background:rgba(20,36,56,0.4);';
    root.appendChild(this._ledgerSummary);
    // Filter bar
    const bar = document.createElement('div');
    bar.style.cssText = 'display:flex; gap:6px; padding:6px 10px; border-bottom:1px solid #233a52; align-items:center; flex-wrap:wrap;';
    const typeSel = document.createElement('select');
    typeSel.style.cssText = 'background:#1a2a3a; color:#cfe6ff; border:1px solid #3a5a7a; font-family:inherit; font-size:10px;';
    typeSel.innerHTML = '<option value="">(all types)</option>'
      + ['gold_change', 'infamy_change', 'cargo_change', 'crew_change', 'ship_state_change', 'upgrade_purchased']
        .map(t => `<option value="${t}">${t}</option>`).join('');
    typeSel.addEventListener('change', () => { this._ledgerFilter.type = typeSel.value; this._renderLedger(); });
    bar.appendChild(this._labelled('Type', typeSel));
    const catSel = document.createElement('select');
    catSel.style.cssText = typeSel.style.cssText;
    catSel.innerHTML = '<option value="">(all cats)</option>'
      + ['port', 'sailing', 'voyage', 'combat', 'crew', 'ship', 'system']
        .map(c => `<option value="${c}">${c}</option>`).join('');
    catSel.addEventListener('change', () => { this._ledgerFilter.category = catSel.value; this._renderLedger(); });
    bar.appendChild(this._labelled('Cat', catSel));
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'search…';
    search.style.cssText = 'background:#1a2a3a; color:#cfe6ff; border:1px solid #3a5a7a; font-family:inherit; font-size:10px; padding:1px 4px; width:120px;';
    search.addEventListener('input', () => { this._ledgerFilter.search = search.value; this._renderLedger(); });
    bar.appendChild(this._labelled('Find', search));
    bar.appendChild(this._mkBtn('CSV', () => this._exportLedger('csv')));
    bar.appendChild(this._mkBtn('JSON', () => this._exportLedger('json')));
    root.appendChild(bar);
    // Table area
    this._ledgerListRoot = document.createElement('div');
    this._ledgerListRoot.style.cssText = 'flex:1; overflow:auto; padding:0 10px; min-height:0;';
    root.appendChild(this._ledgerListRoot);
  }

  _renderLedger() {
    if (this._activeTab !== 'ledger' || !this._ledgerListRoot) return;
    if (!this._ledger) {
      this._ledgerListRoot.innerHTML = '<div style="color:#7a8a9a; padding:8px 0;">No Ledger attached.</div>';
      this._ledgerSummary.textContent = '';
      return;
    }
    const q = {};
    if (this._ledgerFilter.type) q.types = [this._ledgerFilter.type];
    if (this._ledgerFilter.category) q.categories = [this._ledgerFilter.category];
    if (this._ledgerFilter.search) q.search = this._ledgerFilter.search;
    const entries = this._ledger.query(q);
    const summary = this._ledger.summary(q);
    this._ledgerSummary.textContent = `${entries.length} entries · gold +${summary.goldGained} / -${summary.goldSpent} = ${summary.goldNet >= 0 ? '+' : ''}${summary.goldNet}`;
    // Table — show newest first for the player's instinctive "what just happened?"
    const rows = entries.slice().reverse().slice(0, 500).map(e => {
      const t = new Date(e.ts).toISOString().slice(11, 19);
      const deltaColor = e.delta > 0 ? '#9adfa6' : e.delta < 0 ? '#ff9a9a' : '#cfe6ff';
      const deltaStr = e.delta > 0 ? `+${e.delta}` : `${e.delta}`;
      const ctx = e.context ? esc(JSON.stringify(e.context)) : '';
      return `<div style="display:grid; grid-template-columns:60px 100px 60px 50px 50px 1fr; gap:4px; padding:2px 0; border-bottom:1px solid rgba(35,58,82,0.5); font:10px ui-monospace, monospace;">`
        + `<span style="color:#7a8a9a;">${t}</span>`
        + `<span style="color:#ffd88a;">${esc(e.source)}</span>`
        + `<span style="color:#aacc88;">${esc(e.category)}</span>`
        + `<span style="color:${deltaColor}; text-align:right;">${deltaStr}</span>`
        + `<span style="text-align:right;">${e.balance}</span>`
        + `<span style="color:#cfdce6; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${ctx}">${ctx}</span>`
        + `</div>`;
    }).join('');
    const header = `<div style="display:grid; grid-template-columns:60px 100px 60px 50px 50px 1fr; gap:4px; padding:4px 0; border-bottom:1px solid #3a5a7a; font:10px ui-monospace, monospace; color:#88cc88; position:sticky; top:0; background:rgba(10,20,30,0.94);">`
      + `<span>time</span><span>source</span><span>cat</span><span style="text-align:right;">Δ</span><span style="text-align:right;">bal</span><span>context</span>`
      + `</div>`;
    this._ledgerListRoot.innerHTML = header + rows;
    this._updateTabCounts();
  }

  _exportLedger(format) {
    if (!this._ledger) return;
    const q = {};
    if (this._ledgerFilter.type) q.types = [this._ledgerFilter.type];
    if (this._ledgerFilter.category) q.categories = [this._ledgerFilter.category];
    if (this._ledgerFilter.search) q.search = this._ledgerFilter.search;
    const text = format === 'csv' ? this._ledger.exportCsv(q) : this._ledger.exportJson(q);
    const blob = new Blob([text], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:T.]/g, '-').replace(/Z$/, '');
    a.href = url;
    a.download = `yohoh-ledger-${stamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.log(`✓ ledger exported (${format})`);
  }

  // ─── Config tab ─────────────────────────────────────────────────────────
  _renderConfig() {
    const root = this._tabContents.config;
    if (!root || !this._logger) return;
    const desc = this._logger.describe();
    const LEVELS = ['silent', 'error', 'warn', 'info', 'debug', 'trace'];
    let html = `<div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-bottom:8px;">`
      + `<span style="color:#ffcc88;">PRESET</span>`;
    for (const p of ['silent', 'production', 'developer', 'verbose']) {
      const active = desc.preset === p;
      html += `<button type="button" data-log-preset="${p}" style="padding:2px 8px; background:${active ? '#3a5a7a' : '#1a2a3a'}; border:1px solid #3a5a7a; border-radius:2px; color:#cfe6ff; font-family:inherit; font-size:11px; cursor:pointer;">${p}</button>`;
    }
    html += `</div>`;
    html += `<div style="margin-bottom:8px; color:#7a8a9a; font-size:10px;">Shift+1..5 = err/warn/info/debug/trace · master switch across all sinks</div>`;
    html += `<div style="margin-bottom:8px;"><b>SINKS</b></div>`;
    html += `<div style="display:flex; flex-direction:column; gap:4px; margin-bottom:8px;">`;
    for (const s of desc.sinks) {
      html += `<label style="display:flex; align-items:center; gap:6px;"><span style="width:90px; color:#aacc88;">${s.name}</span><select data-log-sink="${s.name}" style="background:#1a2a3a; color:#cfe6ff; border:1px solid #3a5a7a; font-family:inherit; font-size:11px; padding:1px 3px;">`;
      for (const L of LEVELS) html += `<option value="${L}"${L === s.level ? ' selected' : ''}>${L}</option>`;
      html += `</select></label>`;
    }
    html += `</div>`;
    const counts = Object.entries(desc.counts ?? {}).sort((a, b) => b[1] - a[1]);
    if (counts.length > 0) {
      html += `<div style="margin-bottom:8px;"><b>CATEGORIES</b> <span style="color:#7a8a9a; font-size:10px;">click to set per-category override</span></div>`;
      html += `<div style="display:flex; gap:8px; flex-wrap:wrap;">`;
      for (const [cat, n] of counts) {
        const override = desc.categoryOverrides?.[cat];
        const overrideStr = override ? ` <span style="color:#ffcc88">[${override}]</span>` : '';
        html += `<span title="click to set"><a href="#" data-log-cat="${cat}" style="color:#cfe6ff; text-decoration:none;">${cat}</a> <span style="color:#7a8a9a;">${n}</span>${overrideStr}</span>`;
      }
      html += `</div>`;
    }
    root.innerHTML = html;
    // Wire interactions
    root.querySelectorAll('[data-log-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._logger.setPreset(btn.dataset.logPreset);
        this.log(`(log) preset → ${btn.dataset.logPreset}`);
      });
    });
    root.querySelectorAll('[data-log-sink]').forEach(sel => {
      sel.addEventListener('change', () => {
        this._logger.setSinkLevel(sel.dataset.logSink, sel.value);
        this.log(`(log) ${sel.dataset.logSink} → ${sel.value}`);
      });
    });
    root.querySelectorAll('[data-log-cat]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = a.dataset.logCat;
        const cur = desc.categoryOverrides?.[cat];
        const next = prompt(`Category "${cat}" log level (silent/error/warn/info/debug/trace, blank to clear):`, cur ?? '');
        if (next === null) return;
        if (next === '') {
          delete this._logger._categoryOverrides[cat];
          this._logger._recompute();
          this._logger._notify();
        } else {
          this._logger.setLevel(cat, next);
        }
        this.log(`(log) ${cat} override → ${next || '(cleared)'}`);
      });
    });
  }

  // ─── Attach Logger / Ledger ─────────────────────────────────────────────
  attachLogger(logger) {
    if (!logger) return;
    this._logger = logger;
    if (typeof logger.onChange === 'function') {
      logger.onChange(() => {
        if (this._activeTab === 'config') this._renderConfig();
        this._scheduleEventsRefresh();
      });
    }
    if (this._activeTab === 'config') this._renderConfig();
  }

  attachLedger(ledger) {
    if (!ledger) return;
    this._ledger = ledger;
    if (typeof ledger.onChange === 'function') {
      ledger.onChange(() => this._scheduleLedgerRefresh());
    }
    if (this._activeTab === 'ledger') this._renderLedger();
  }

  _scheduleEventsRefresh() {
    if (this._activeTab !== 'events' || this._paused) return;
    if (this._eventsRafId != null) return;
    this._eventsRafId = requestAnimationFrame(() => {
      this._eventsRafId = null;
      this._renderEvents();
    });
  }

  _scheduleLedgerRefresh() {
    if (this._ledgerRafId != null) return;
    this._ledgerRafId = requestAnimationFrame(() => {
      this._ledgerRafId = null;
      this._updateTabCounts();
      if (this._activeTab === 'ledger') this._renderLedger();
    });
  }

  // ─── Keyboard ───────────────────────────────────────────────────────────
  _onKeyDown(e) {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      this.toggle();
      return;
    }
    if (!this.visible) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.shiftKey && (e.key === 'l' || e.key === 'L')) {
      this._log.length = 0; this._logDirty = true; this._renderState();
    } else if (e.shiftKey && (e.key === 'd' || e.key === 'D')) {
      this.downloadDump();
    } else if (e.shiftKey && (e.key === 'c' || e.key === 'C')) {
      if (!window.getSelection?.()?.toString?.()) { this.copyToClipboard(); e.preventDefault(); }
    } else if (e.shiftKey && this._logger && e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      const levels = ['error', 'warn', 'info', 'debug', 'trace'];
      this._logger.setLevel('*', levels[Number(e.key) - 1]);
      this.log(`(log) all sinks → ${levels[Number(e.key) - 1]}`);
    } else if (!e.shiftKey && (e.key === 'Tab')) {
      // Tab cycles overlay tabs when overlay is visible
      e.preventDefault();
      const cur = TAB_ORDER.indexOf(this._activeTab);
      this.setActiveTab(TAB_ORDER[(cur + 1) % TAB_ORDER.length]);
    }
  }

  // ─── Visibility ─────────────────────────────────────────────────────────
  show() {
    this.visible = true;
    if (this.overlay) this.overlay.style.display = 'flex';
    this._renderState();
    if (this._activeTab === 'events') this._renderEvents();
    else if (this._activeTab === 'ledger') this._renderLedger();
    else if (this._activeTab === 'config') this._renderConfig();
  }
  hide() {
    this.visible = false;
    if (this.overlay) this.overlay.style.display = 'none';
  }
  toggle() { this.visible ? this.hide() : this.show(); }
  isVisible() { return this.visible; }

  // ─── State tab (backward-compatible) ────────────────────────────────────
  setSection(name, text) {
    const html = Array.isArray(text) ? text.join('\n') : String(text ?? '');
    if (this._sections.get(name) !== html) {
      this._sections.set(name, html);
      this._sectionsDirty = true;
    }
  }

  log(message) {
    const t = new Date();
    const ts = `${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}.${String(t.getMilliseconds()).padStart(3, '0')}`;
    this._log.push(`[${ts}] ${message}`);
    if (this._log.length > MAX_LEGACY_LOG_LINES) this._log.shift();
    this._logDirty = true;
    this._scheduleEventsRefresh();
  }

  /** Per-frame from the game loop. No-op when hidden. */
  flush() {
    if (!this.visible) return;
    if (this._sectionsDirty && this._activeTab === 'state') this._renderState();
    // Events / Ledger refresh themselves via Logger / Ledger onChange.
    this._updateTabCounts();
  }

  _renderState() {
    if (!this._tabContents.state) return;
    const parts = [];
    for (const [name, html] of this._sections) {
      parts.push(`<div style="margin-top:4px;"><div style="color:#88cc88;">${esc(name)}</div>${esc(html)}</div>`);
    }
    if (parts.length === 0) parts.push('<div style="color:#7a8a9a;">(no sections yet)</div>');
    // Also include a fallback events tail at the bottom when on State tab and
    // no Events tab is open — preserves the old behaviour of "open backtick,
    // see recent activity" so existing muscle memory still works.
    parts.push(`<div style="color:#88cc88; margin-top:8px;">recent log</div>`);
    parts.push(`<div style="color:#cfdce6; white-space:pre-wrap;">${esc(this._log.slice(-10).join('\n'))}</div>`);
    this._tabContents.state.innerHTML = parts.join('');
    this._sectionsDirty = false;
  }

  // ─── Dump / Copy / Download ─────────────────────────────────────────────
  buildDumpText() {
    const lines = [`YoHoH debug dump — ${new Date().toISOString()}`, ''];
    for (const [name, html] of this._sections) {
      lines.push(`── ${name} ──`);
      lines.push(html);
      lines.push('');
    }
    lines.push('── EVENTS ──');
    if (this._logger) {
      const mem = this._logger.getSink?.('memory');
      const snap = mem?.snapshot?.() ?? [];
      for (const e of snap) {
        const t = e.ts ? new Date(e.ts).toISOString() : '';
        const lvl = (LEVEL_TO_NAME[e.level] ?? '?').toUpperCase();
        lines.push(`${t} ${lvl} [${e.category}] ${e.msg}${e.data ? ' ' + JSON.stringify(e.data) : ''}`);
      }
    } else {
      for (const l of this._log) lines.push(l);
    }
    if (this._ledger) {
      lines.push('');
      lines.push('── LEDGER (current session) ──');
      const ledgerEntries = this._ledger.query({ limit: 200 });
      for (const e of ledgerEntries) {
        const t = new Date(e.ts).toISOString();
        lines.push(`${t} ${e.type}/${e.source} Δ${e.delta >= 0 ? '+' : ''}${e.delta} bal=${e.balance}${e.context ? ' ' + JSON.stringify(e.context) : ''}`);
      }
    }
    return lines.join('\n');
  }

  async copyToClipboard() {
    const text = this.buildDumpText();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        this.log('✓ debug dump copied to clipboard');
        return;
      }
    } catch (_) {}
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); this.log('✓ debug dump copied (fallback)'); }
    catch (err) { this.log('✗ copy failed: ' + (err?.message ?? err)); }
    document.body.removeChild(ta);
  }

  downloadDump() {
    const text = this.buildDumpText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:T.]/g, '-').replace(/Z$/, '');
    a.href = url;
    a.download = `yohoh-debug-${stamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.log('✓ debug dump downloaded');
  }

  destroy() {
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    this._keyHandler = null;
    if (this.overlay?.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    this.overlay = null;
  }
}

function esc(s) {
  return String(s).replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
}
