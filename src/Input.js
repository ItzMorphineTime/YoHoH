/**
 * YoHoH — Input handler (keyboard + mouse)
 */

export class Input {
  constructor() {
    this.keys = {};
    this.prevKeys = {};
    this.mouse = {
      x: 0, y: 0,
      leftDown: false, middleDown: false,
      leftPrevDown: false, middlePrevDown: false,
    };
    this._boundHandlers = false;
  }

  /** Call at end of frame */
  endFrame() {
    this.prevKeys = { ...this.keys };
    this.mouse.leftPrevDown = this.mouse.leftDown;
    this.mouse.middlePrevDown = this.mouse.middleDown;
  }

  isMouseJustPressed() {
    return this.mouse.leftDown && !this.mouse.leftPrevDown;
  }

  /** Left button (0) just pressed — for route selection */
  isLeftMouseJustPressed() {
    return this.mouse.leftDown && !this.mouse.leftPrevDown;
  }

  /** Middle button (1) just pressed — for pan start */
  isMiddleMouseJustPressed() {
    return this.mouse.middleDown && !this.mouse.middlePrevDown;
  }

  /** Left button down */
  isLeftMouseDown() {
    return this.mouse.leftDown;
  }

  /** Middle button down */
  isMiddleMouseDown() {
    return this.mouse.middleDown;
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
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', () => {
      this.mouse.leftDown = false;
      this.mouse.middleDown = false;
    });

    this._boundHandlers = true;
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  getMouseNDC() {
    return { x: this.mouse.x, y: this.mouse.y };
  }

  isMouseDown() {
    return this.mouse.leftDown || this.mouse.middleDown;
  }
}
