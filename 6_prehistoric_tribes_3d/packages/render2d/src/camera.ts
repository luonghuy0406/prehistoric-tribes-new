/** RTS-style camera: drag to pan, wheel/pinch-free zoom around the pointer, WASD/arrow keys. */
import type { Container } from 'pixi.js';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const KEY_PAN_SPEED = 900; // screen px per second
const DRAG_THRESHOLD = 5;

export class Camera {
  x = 0; // world px at screen left
  y = 0; // world px at screen top
  zoom = 0.6;
  onClick: ((wx: number, wy: number) => void) | null = null;
  onHover: ((wx: number, wy: number) => void) | null = null;
  private boundsW = 1;
  private boundsH = 1;
  private screen: () => { w: number; h: number } = () => ({ w: 1, h: 1 });
  private keys = new Set<string>();
  private drag: { sx: number; sy: number; cx: number; cy: number; moved: boolean } | null = null;
  private cleanup: (() => void) | null = null;

  constructor(private readonly target: Container) {}

  attach(el: HTMLCanvasElement, screen: () => { w: number; h: number }): void {
    this.screen = screen;
    const down = (e: PointerEvent): void => {
      el.setPointerCapture(e.pointerId);
      this.drag = { sx: e.clientX, sy: e.clientY, cx: this.x, cy: this.y, moved: false };
    };
    const move = (e: PointerEvent): void => {
      const r = el.getBoundingClientRect();
      const w = this.toWorld(e.clientX - r.left, e.clientY - r.top);
      this.onHover?.(w.x, w.y);
      if (!this.drag) return;
      const dx = e.clientX - this.drag.sx;
      const dy = e.clientY - this.drag.sy;
      if (!this.drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      this.drag.moved = true;
      this.x = this.drag.cx - dx / this.zoom;
      this.y = this.drag.cy - dy / this.zoom;
      this.clamp();
    };
    const up = (e: PointerEvent): void => {
      const d = this.drag;
      this.drag = null;
      if (d && !d.moved) {
        const r = el.getBoundingClientRect();
        const w = this.toWorld(e.clientX - r.left, e.clientY - r.top);
        this.onClick?.(w.x, w.y);
      }
    };
    const wheel = (e: WheelEvent): void => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      this.zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
    };
    const keydown = (e: KeyboardEvent): void => {
      const t = (e.target as HTMLElement | null)?.tagName ?? '';
      if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;
      this.keys.add(e.key.toLowerCase());
    };
    const keyup = (e: KeyboardEvent): void => {
      this.keys.delete(e.key.toLowerCase());
    };
    const blur = (): void => this.keys.clear();
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', blur);
    this.cleanup = () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('wheel', wheel);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', blur);
    };
  }

  detach(): void {
    this.cleanup?.();
    this.cleanup = null;
  }

  setBounds(w: number, h: number): void {
    this.boundsW = w;
    this.boundsH = h;
    this.clamp();
  }

  centerOn(wx: number, wy: number): void {
    const s = this.screen();
    this.x = wx - s.w / 2 / this.zoom;
    this.y = wy - s.h / 2 / this.zoom;
    this.clamp();
    this.apply();
  }

  zoomAt(sx: number, sy: number, factor: number): void {
    const before = this.toWorld(sx, sy);
    this.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor));
    this.x = before.x - sx / this.zoom;
    this.y = before.y - sy / this.zoom;
    this.clamp();
  }

  toWorld(sx: number, sy: number): { x: number; y: number } {
    return { x: this.x + sx / this.zoom, y: this.y + sy / this.zoom };
  }

  visibleWorldRect(): { x: number; y: number; w: number; h: number } {
    const s = this.screen();
    return { x: this.x, y: this.y, w: s.w / this.zoom, h: s.h / this.zoom };
  }

  update(deltaMs: number): void {
    const step = (KEY_PAN_SPEED * deltaMs) / 1000 / this.zoom;
    if (this.keys.has('a') || this.keys.has('arrowleft')) this.x -= step;
    if (this.keys.has('d') || this.keys.has('arrowright')) this.x += step;
    if (this.keys.has('w') || this.keys.has('arrowup')) this.y -= step;
    if (this.keys.has('s') || this.keys.has('arrowdown')) this.y += step;
    this.clamp();
    this.apply();
  }

  private clamp(): void {
    const s = this.screen();
    const vw = s.w / this.zoom;
    const vh = s.h / this.zoom;
    const margin = 200;
    this.x = vw >= this.boundsW ? (this.boundsW - vw) / 2 : Math.min(Math.max(this.x, -margin), this.boundsW - vw + margin);
    this.y = vh >= this.boundsH ? (this.boundsH - vh) / 2 : Math.min(Math.max(this.y, -margin), this.boundsH - vh + margin);
  }

  private apply(): void {
    this.target.scale.set(this.zoom);
    this.target.position.set(-this.x * this.zoom, -this.y * this.zoom);
  }
}
