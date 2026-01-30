/**
 * YoHoH — Input handler (keyboard + mouse)
 */

export class Input {
  constructor() {
    this.keys = {};
    this.prevKeys = {};
    this.mouse = { x: 0, y: 0, down: false, prevDown: false };
    this._boundHandlers = false;
  }

  /** Call at end of frame */
  endFrame() {
    this.prevKeys = { ...this.keys };
    this.mouse.prevDown = this.mouse.down;
  }

  isMouseJustPressed() {
    return this.mouse.down && !this.mouse.prevDown;
  }

  /** True if key transitioned from up to down this frame (ignores key repeat) */
  isKeyJustPressed(code) {
    return !!this.keys[code] && !this.prevKeys[code];
  }

  init(canvas) {
    if (this._boundHandlers) return;
    this.canvas = canvas;

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyM'].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    const updateMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('mousemove', updateMouse);
    document.addEventListener('mousemove', updateMouse);
    canvas.addEventListener('mousedown', () => { this.mouse.down = true; });
    canvas.addEventListener('mouseup', () => { this.mouse.down = false; });
    canvas.addEventListener('mouseleave', () => { this.mouse.down = false; });

    this._boundHandlers = true;
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  getMouseNDC() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  isMouseDown() {
    return this.mouse.down;
  }
}
