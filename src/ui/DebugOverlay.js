/**
 * YoHoH — Debug overlay
 *
 * Toggleable on-screen panel showing live game state. Press the backtick (`)
 * key to show/hide. Also exposes a rolling event log for tracing user actions
 * (clicks, state transitions, etc).
 *
 * Pull-model API: Game (or any other caller) calls `setSection(name, lines)`
 * each frame to push key/value pairs grouped by section. Push-model:
 * `log(message)` appends to the bottom log (auto-trimmed).
 *
 * No allocation in setSection/log on the hot path — strings are diffed against
 * the last render and only flushed when changed.
 */

const MAX_LOG_LINES = 20;

export class DebugOverlay {
  constructor() {
    this.overlay = null;
    this.visible = false;
    this._sections = new Map(); // name -> last-rendered HTML string
    this._log = [];
    this._logDirty = true;
    this._sectionsDirty = true;
    this._sectionsRoot = null;
    this._logRoot = null;
    this._keyHandler = null;
  }

  init() {
    if (this.overlay) return;
    this.overlay = document.createElement('div');
    this.overlay.id = 'debug-overlay';
    this.overlay.style.cssText = [
      'position:fixed',
      'top:8px',
      'left:8px',
      'z-index:9999',
      'max-width:min(420px, 60vw)',
      'max-height:90vh',
      'overflow:auto',
      'padding:8px 10px',
      'background:rgba(10,20,30,0.92)',
      'border:1px solid #3a5a7a',
      'border-radius:6px',
      'color:#cfe6ff',
      'font:11px/1.4 ui-monospace, Menlo, Consolas, monospace',
      // pointer-events: auto — allow text selection / button clicks inside the
      // overlay. The text never covers the canvas because it lives in the
      // top-left corner; selection works for copy-paste of state values.
      'pointer-events:auto',
      'user-select:text',
      '-webkit-user-select:text',
      'display:none',
    ].join(';');

    const head = document.createElement('div');
    head.style.cssText = 'color:#ffcc88; margin-bottom:6px; border-bottom:1px solid #3a5a7a; padding-bottom:4px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;';
    const title = document.createElement('b');
    title.textContent = 'DEBUG';
    head.appendChild(title);
    const hint = document.createElement('span');
    hint.textContent = '(` toggle · Shift+L clear · text selectable)';
    hint.style.cssText = 'color:#7a8a9a; font-weight:normal;';
    head.appendChild(hint);
    // Action buttons
    const mkBtn = (label, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'padding:2px 8px; background:#2a4a6a; border:1px solid #3a5a7a; border-radius:3px; color:#e8e6e3; font-family:inherit; font-size:10px; cursor:pointer;';
      b.addEventListener('click', onClick);
      return b;
    };
    head.appendChild(mkBtn('Copy', () => this.copyToClipboard()));
    head.appendChild(mkBtn('Download', () => this.downloadDump()));
    head.appendChild(mkBtn('Clear log', () => { this._log.length = 0; this._logDirty = true; this._flush(); }));
    this.overlay.appendChild(head);

    this._sectionsRoot = document.createElement('div');
    this.overlay.appendChild(this._sectionsRoot);

    const logHead = document.createElement('div');
    logHead.textContent = 'EVENTS';
    logHead.style.cssText = 'color:#ffcc88; margin-top:8px; border-top:1px solid #3a5a7a; padding-top:4px;';
    this.overlay.appendChild(logHead);

    this._logRoot = document.createElement('div');
    this._logRoot.style.cssText = 'white-space:pre-wrap; word-break:break-word;';
    this.overlay.appendChild(this._logRoot);

    document.body.appendChild(this.overlay);

    this._keyHandler = (e) => {
      // Don't hijack keys when user is typing in the overlay's selection / button has focus
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        this.toggle();
      } else if (e.shiftKey && (e.key === 'l' || e.key === 'L') && this.visible) {
        this._log.length = 0;
        this._logDirty = true;
        this._flush();
      } else if (e.shiftKey && (e.key === 'd' || e.key === 'D') && this.visible) {
        this.downloadDump();
      } else if (e.shiftKey && (e.key === 'c' || e.key === 'C') && this.visible) {
        // Shift+C — copy when overlay focused. Don't clobber normal Ctrl+C copy of selected text.
        if (!window.getSelection?.()?.toString?.()) {
          this.copyToClipboard();
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  /** Produce a single string dump of all live sections + the event log. */
  buildDumpText() {
    const lines = [`YoHoH debug dump — ${new Date().toISOString()}`, ''];
    for (const [name, html] of this._sections) {
      lines.push(`── ${name} ──`);
      lines.push(html);
      lines.push('');
    }
    lines.push('── EVENTS ──');
    for (const l of this._log) lines.push(l);
    return lines.join('\n');
  }

  /** Copy the full debug dump to the clipboard. Falls back to a textarea trick. */
  async copyToClipboard() {
    const text = this.buildDumpText();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        this.log('✓ debug dump copied to clipboard');
        return;
      }
    } catch (_) { /* fall through */ }
    // Fallback: temporary textarea + execCommand
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

  /** Trigger a .txt download of the full debug dump. */
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

  show() { this.visible = true; if (this.overlay) this.overlay.style.display = ''; this._flush(); }
  hide() { this.visible = false; if (this.overlay) this.overlay.style.display = 'none'; }
  toggle() { this.visible ? this.hide() : this.show(); }
  isVisible() { return this.visible; }

  /**
   * Push a section of key/value lines (or any pre-formatted text).
   * @param {string} name
   * @param {string|string[]} text
   */
  setSection(name, text) {
    const html = Array.isArray(text) ? text.join('\n') : String(text ?? '');
    if (this._sections.get(name) !== html) {
      this._sections.set(name, html);
      this._sectionsDirty = true;
    }
  }

  /** Append a one-line event to the rolling log. */
  log(message) {
    const t = new Date();
    const ts = `${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}.${String(t.getMilliseconds()).padStart(3, '0')}`;
    this._log.push(`[${ts}] ${message}`);
    if (this._log.length > MAX_LOG_LINES) this._log.shift();
    this._logDirty = true;
  }

  /** Call once per frame from the game loop. No-op when hidden. */
  flush() {
    if (!this.visible) return;
    this._flush();
  }

  _flush() {
    if (!this.overlay) return;
    if (this._sectionsDirty) {
      const parts = [];
      for (const [name, html] of this._sections) {
        // white-space:pre keeps the newlines from the section body intact
        parts.push(`<div style="margin-top:4px; white-space:pre-wrap;"><div style="color:#88cc88">${escapeText(name)}</div>${escapeText(html)}</div>`);
      }
      this._sectionsRoot.innerHTML = parts.join('');
      this._sectionsDirty = false;
    }
    if (this._logDirty) {
      this._logRoot.textContent = this._log.join('\n');
      this._logDirty = false;
    }
  }
}

function escapeText(s) {
  return String(s).replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
}
