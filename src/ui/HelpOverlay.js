/**
 * YoHoH — Help overlay
 *
 * Press `?` (Shift+/) or `H` to toggle a panel listing every keyboard binding,
 * grouped by game phase. Esc closes. Click outside or use the X button.
 *
 * The overlay is static markup — no per-frame work. Cheap to keep mounted.
 * (Sailing_Improvements.md #28 / Port_Improvements / general UX polish)
 */

export class HelpOverlay {
  constructor() {
    this.overlay = null;
    this.visible = false;
    this._keyHandler = null;
  }

  init() {
    if (this.overlay) return;
    this.overlay = document.createElement('div');
    this.overlay.id = 'help-overlay';
    this.overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:200',
      'display:none', 'align-items:center', 'justify-content:center',
      'background:rgba(5,12,24,0.65)', 'padding:24px',
      'pointer-events:auto',
    ].join(';');
    this.overlay.innerHTML = `
      <div style="background:rgba(10,28,48,0.98); border:1px solid #3a5a7a; border-radius:8px; padding:20px 24px; max-width:min(620px,92vw); max-height:84vh; overflow:auto; color:#e8e6e3; font:13px/1.5 'Segoe UI', system-ui, sans-serif; box-shadow:0 8px 32px rgba(0,0,0,0.6);">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; border-bottom:1px solid #233a52; padding-bottom:8px;">
          <h2 style="margin:0; font-size:18px; color:#e8d8a0; flex:1;">Keyboard &amp; mouse</h2>
          <button type="button" id="help-close" style="width:28px; height:28px; padding:0; background:rgba(74,58,58,0.7); border:1px solid #6a4a4a; border-radius:4px; color:#e8c0c0; cursor:pointer; font-size:14px;">✕</button>
        </div>

        ${this._section('Anywhere', [
          ['K', 'Open / close the Crew overlay'],
          ['?', 'This help'],
          ['` (backtick)', 'Toggle debug overlay'],
          ['Esc', 'Close the current overlay'],
        ])}

        ${this._section('Overworld (docked)', [
          ['Mouse · click route', 'Select a route from your island'],
          ['Mouse · click Start Sailing', 'Begin the voyage'],
          ['Mouse · drag', 'Pan the map'],
          ['Mouse wheel', 'Zoom the map'],
          ['M', 'Open Chart Screen'],
          ['Ctrl+S / Ctrl+O', 'Save / load map'],
        ])}

        ${this._section('Sailing', [
          ['W', 'Throttle (hold)'],
          ['S', 'Brake (no reverse)'],
          ['A / D', 'Turn port / starboard'],
          ['F', 'Dock at destination (when in approach zone)'],
          ['H', 'Snap heading to destination (one-shot)'],
          ['Shift + H', 'Toggle autopilot (auto-steer + 70% throttle)'],
          ['M', 'Open Chart Screen (pauses voyage)'],
          ['K', 'Manage crew mid-voyage'],
          ['Esc', 'Open chart / use Cancel Voyage button'],
        ])}

        ${this._section('Combat', [
          ['W / S / A / D', 'Sail / brake / turn'],
          ['Q', 'Aim port broadside (1st press) → fire (2nd press)'],
          ['E', 'Aim starboard broadside (1st press) → fire (2nd press)'],
          ['R', 'Restart combat (after victory / defeat)'],
          ['Esc', 'Return to overworld (after victory / defeat)'],
        ])}

        ${this._section('Port', [
          ['Mouse · click tabs', 'Tavern · Shipwright · Market'],
          ['Mouse · click Manage Crew', 'Open crew overlay for station assignments'],
          ['Esc · twice (within 1.5s)', 'Leave port (the first Esc primes the button)'],
        ])}

        ${this._section('Debug overlay', [
          ['` (backtick)', 'Toggle overlay'],
          ['Shift+L', 'Clear event log'],
          ['Shift+D', 'Download dump as .txt'],
          ['Shift+C', 'Copy dump to clipboard (no selection)'],
        ])}

        <p style="color:#7a8a9a; font-size:11px; margin:12px 0 0; font-style:italic;">Press <kbd style="padding:1px 5px; background:rgba(20,36,56,0.95); border:1px solid #3a5a7a; border-radius:3px; color:#e8e6e3; font-family:inherit; font-size:11px;">?</kbd> any time to bring this back.</p>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.overlay.querySelector('#help-close')?.addEventListener('click', () => this.hide());
    this.overlay.addEventListener('click', (e) => {
      // Click outside the inner panel closes
      if (e.target === this.overlay) this.hide();
    });

    this._keyHandler = (e) => {
      // Ignore when typing in inputs
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.visible) {
        e.preventDefault();
        this.hide();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  destroy() {
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
    if (this.overlay?.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    this.overlay = null;
  }

  show() { this.visible = true; if (this.overlay) this.overlay.style.display = 'flex'; }
  hide() { this.visible = false; if (this.overlay) this.overlay.style.display = 'none'; }
  toggle() { this.visible ? this.hide() : this.show(); }
  isVisible() { return this.visible; }

  _section(title, rows) {
    const items = rows.map(([key, desc]) =>
      `<div style="display:grid; grid-template-columns:minmax(120px, 1fr) 2fr; gap:12px; padding:3px 0;">
        <kbd style="background:rgba(20,36,56,0.95); border:1px solid #3a5a7a; border-radius:3px; padding:1px 7px; color:#e8e6e3; font:11px/1.4 ui-monospace, Menlo, Consolas, monospace; align-self:start;">${key}</kbd>
        <span style="color:#cfdce6;">${desc}</span>
      </div>`
    ).join('');
    return `<div style="margin-top:12px;">
      <h3 style="margin:0 0 4px; font-size:12px; color:#ffcc88; letter-spacing:0.08em; text-transform:uppercase;">${title}</h3>
      ${items}
    </div>`;
  }
}
