/**
 * YoHoH — Input handler (keyboard + mouse)
 *
 * Frame state model:
 *   keys / prevKeys     — keyCode → boolean; prev tracked for "just pressed"
 *   mouse.{leftDown, middleDown, leftPrevDown, middlePrevDown}
 *
 * Listeners are bound once at init(); call destroy() to detach (e.g. if the
 * Game ever becomes re-instantiable from a main menu).
 *
 * Per-frame work avoids allocation: we keep two pre-allocated key maps and
 * copy keys into the "prev" one on endFrame() rather than spreading into a
 * fresh object every frame. (Improvements.md §2.3)
 */

export class Input {
  constructor() {
    this.keys = Object.create(null);
    this.prevKeys = Object.create(null);
    this.mouse = {
      x: 0, y: 0,
      leftDown: false, middleDown: false,
      leftPrevDown: false, middlePrevDown: false,
    };
    this._boundHandlers = false;
    this._listeners = []; // { target, event, handler } for clean teardown
  }

  /** Call at end of frame: snapshot current key state into prevKeys without allocating. */
  endFrame() {
    // Clear prevKeys then copy current keys in. Reuses the same object every frame.
    for (const k in this.prevKeys) this.prevKeys[k] = false;
    for (const k in this.keys) this.prevKeys[k] = this.keys[k];
    this.mouse.leftPrevDown = this.mouse.leftDown;
    this.mouse.middlePrevDown = this.mouse.middleDown;
  }

  /** Left mouse button (button 0) just pressed this frame — rising edge. */
  isLeftMouseJustPressed() {
    return this.mouse.leftDown && !this.mouse.leftPrevDown;
  }

  /** Middle button (button 1) just pressed — for pan start. */
  isMiddleMouseJustPressed() {
    return this.mouse.middleDown && !this.mouse.middlePrevDown;
  }

  /** Left button currently down. */
  isLeftMouseDown() { return this.mouse.leftDown; }

  /** Middle button currently down. */
  isMiddleMouseDown() { return this.mouse.middleDown; }

  /** True if key transitioned from up to down this frame (ignores key repeat). */
  isKeyJustPressed(code) {
    return !!this.keys[code] && !this.prevKeys[code];
  }

  init(canvas) {
    if (this._boundHandlers) return;
    this.canvas = canvas;

    const onKeyDown = (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyM'].includes(e.code)) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e) => { this.keys[e.code] = false; };
    const updateMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onMouseDown = (e) => {
      if (e.button === 0) this.mouse.leftDown = true;
      if (e.button === 1) {
        this.mouse.middleDown = true;
        e.preventDefault();
      }
    };
    const onMouseUp = (e) => {
      if (e.button === 0) this.mouse.leftDown = false;
      if (e.button === 1) this.mouse.middleDown = false;
    };
    const onMouseLeave = () => {
      this.mouse.leftDown = false;
      this.mouse.middleDown = false;
    };

    this._bind(window,   'keydown',  onKeyDown);
    this._bind(window,   'keyup',    onKeyUp);
    this._bind(canvas,   'mousemove', updateMouse);
    this._bind(document, 'mousemove', updateMouse);
    this._bind(canvas,   'mousedown', onMouseDown);
    this._bind(canvas,   'mouseup',   onMouseUp);
    this._bind(document, 'mousedown', onMouseDown);
    this._bind(document, 'mouseup',   onMouseUp);
    this._bind(canvas,   'mouseleave', onMouseLeave);

    this._boundHandlers = true;
  }

  /** Detach all listeners. (Improvements.md §2.5) */
  destroy() {
    for (const { target, event, handler } of this._listeners) {
      target.removeEventListener(event, handler);
    }
    this._listeners.length = 0;
    this._boundHandlers = false;
    this.canvas = null;
  }

  _bind(target, event, handler) {
    target.addEventListener(event, handler);
    this._listeners.push({ target, event, handler });
  }

  isKeyDown(code) { return !!this.keys[code]; }

  getMouseNDC() { return { x: this.mouse.x, y: this.mouse.y }; }

  isMouseDown() { return this.mouse.leftDown || this.mouse.middleDown; }
}
