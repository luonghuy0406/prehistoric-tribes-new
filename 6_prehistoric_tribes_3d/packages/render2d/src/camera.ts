/**
 * Camera + gesture input for mouse and touch.
 *
 * Mouse:  left click = tap · left drag = box select · right click = order · right/middle drag = pan
 *         double click = tap with "run" · wheel = zoom · WASD/arrows = pan
 * Touch:  tap = tap · one-finger drag = pan · long press = order · double tap = tap with "run"
 *         two-finger pinch = zoom + pan · `boxMode` (toggled from the HUD) turns a drag into a box
 */
import type { Container } from 'pixi.js';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const KEY_PAN_SPEED = 900; // screen px per second
const DRAG_THRESHOLD_MOUSE = 6;
const DRAG_THRESHOLD_TOUCH = 12;
const LONG_PRESS_MS = 450;
const DOUBLE_TAP_MS = 320;

export interface WorldRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GestureHandlers {
  tap?: (wx: number, wy: number, opts: { double: boolean; touch: boolean }) => void;
  order?: (wx: number, wy: number, opts: { double: boolean; touch: boolean }) => void;
  box?: (rect: WorldRect) => void;
  hover?: (wx: number, wy: number) => void;
}

interface Ptr {
  id: number;
  type: string;
  button: number;
  sx: number;
  sy: number;
  x: number;
  y: number;
  t0: number;
  moved: boolean;
  action: 'pending' | 'pan' | 'box' | 'pinch' | 'done';
}

export class Camera {
  x = 0; // world px at screen left
  y = 0; // world px at screen top
  zoom = 0.6;
  /** When true, a touch drag draws a selection box instead of panning (HUD toggle). */
  boxMode = false;
  handlers: GestureHandlers = {};
  /** Selection box being dragged (world coords) — drawn by the renderer. */
  boxDraft: WorldRect | null = null;
  private boundsW = 1;
  private boundsH = 1;
  private screen: () => { w: number; h: number } = () => ({ w: 1, h: 1 });
  private keys = new Set<string>();
  private ptrs = new Map<number, Ptr>();
  private camStart = { x: 0, y: 0, zoom: 1, dist: 1, cx: 0, cy: 0 };
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private lastTap = { t: 0, x: 0, y: 0 };
  private cleanup: (() => void) | null = null;
  private el: HTMLCanvasElement | null = null;

  constructor(private readonly target: Container) {}

  attach(el: HTMLCanvasElement, screen: () => { w: number; h: number }): void {
    this.el = el;
    this.screen = screen;
    el.style.touchAction = 'none';
    const local = (e: PointerEvent | WheelEvent): { x: number; y: number } => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent): void => {
      el.setPointerCapture(e.pointerId);
      const p = local(e);
      const ptr: Ptr = { id: e.pointerId, type: e.pointerType, button: e.button, sx: p.x, sy: p.y, x: p.x, y: p.y, t0: performance.now(), moved: false, action: 'pending' };
      this.ptrs.set(e.pointerId, ptr);
      if (this.ptrs.size === 2) this.beginPinch();
      else if (e.pointerType === 'touch') this.armLongPress(ptr);
    };
    const move = (e: PointerEvent): void => {
      const p = local(e);
      const w = this.toWorld(p.x, p.y);
      this.handlers.hover?.(w.x, w.y);
      const ptr = this.ptrs.get(e.pointerId);
      if (!ptr) return;
      ptr.x = p.x;
      ptr.y = p.y;
      if (ptr.action === 'pinch') {
        this.updatePinch();
        return;
      }
      if (ptr.action === 'done') return;
      const threshold = ptr.type === 'touch' ? DRAG_THRESHOLD_TOUCH : DRAG_THRESHOLD_MOUSE;
      if (!ptr.moved && Math.hypot(p.x - ptr.sx, p.y - ptr.sy) < threshold) return;
      if (!ptr.moved) {
        ptr.moved = true;
        this.clearLongPress();
        const isBox = ptr.type === 'touch' ? this.boxMode : ptr.button === 0;
        ptr.action = isBox ? 'box' : 'pan';
        this.camStart.x = this.x;
        this.camStart.y = this.y;
      }
      if (ptr.action === 'pan') {
        this.x = this.camStart.x - (p.x - ptr.sx) / this.zoom;
        this.y = this.camStart.y - (p.y - ptr.sy) / this.zoom;
        this.clamp();
      } else if (ptr.action === 'box') {
        const a = this.toWorld(ptr.sx, ptr.sy);
        const b = this.toWorld(p.x, p.y);
        this.boxDraft = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
      }
    };
    const up = (e: PointerEvent): void => {
      const ptr = this.ptrs.get(e.pointerId);
      this.ptrs.delete(e.pointerId);
      this.clearLongPress();
      if (!ptr) return;
      if (ptr.action === 'pinch') {
        // Remaining finger must not turn into a tap/pan.
        for (const other of this.ptrs.values()) other.action = 'done';
        return;
      }
      if (ptr.action === 'box') {
        if (this.boxDraft) this.handlers.box?.(this.boxDraft);
        this.boxDraft = null;
        return;
      }
      if (ptr.action !== 'pending') return;
      const w = this.toWorld(ptr.x, ptr.y);
      const touch = ptr.type === 'touch';
      const now = performance.now();
      const double = now - this.lastTap.t < DOUBLE_TAP_MS && Math.hypot(ptr.x - this.lastTap.x, ptr.y - this.lastTap.y) < 30;
      this.lastTap = { t: double ? 0 : now, x: ptr.x, y: ptr.y };
      if (!touch && ptr.button === 2) this.handlers.order?.(w.x, w.y, { double, touch });
      else if (!touch && ptr.button === 1) return;
      else this.handlers.tap?.(w.x, w.y, { double, touch });
    };
    const cancel = (e: PointerEvent): void => {
      this.ptrs.delete(e.pointerId);
      this.clearLongPress();
      this.boxDraft = null;
    };
    const wheel = (e: WheelEvent): void => {
      e.preventDefault();
      const p = local(e);
      this.zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015));
    };
    const context = (e: Event): void => e.preventDefault();
    const keydown = (e: KeyboardEvent): void => {
      const t = (e.target as HTMLElement | null)?.tagName ?? '';
      if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA' || e.ctrlKey || e.metaKey) return;
      this.keys.add(e.key.toLowerCase());
    };
    const keyup = (e: KeyboardEvent): void => {
      this.keys.delete(e.key.toLowerCase());
    };
    const blur = (): void => this.keys.clear();
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('contextmenu', context);
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', blur);
    this.cleanup = () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', cancel);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('contextmenu', context);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', blur);
    };
  }

  detach(): void {
    this.cleanup?.();
    this.cleanup = null;
    this.clearLongPress();
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

  zoomBy(factor: number): void {
    const s = this.screen();
    this.zoomAt(s.w / 2, s.h / 2, factor);
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

  toScreen(wx: number, wy: number): { x: number; y: number } {
    return { x: (wx - this.x) * this.zoom, y: (wy - this.y) * this.zoom };
  }

  visibleWorldRect(): WorldRect {
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

  // ---- touch helpers --------------------------------------------------------------------

  private armLongPress(ptr: Ptr): void {
    this.clearLongPress();
    this.longPressTimer = setTimeout(() => {
      if (ptr.action !== 'pending' || ptr.moved || this.boxMode) return;
      ptr.action = 'done';
      const w = this.toWorld(ptr.x, ptr.y);
      navigator.vibrate?.(15);
      this.handlers.order?.(w.x, w.y, { double: false, touch: true });
    }, LONG_PRESS_MS);
  }

  private clearLongPress(): void {
    if (this.longPressTimer !== null) clearTimeout(this.longPressTimer);
    this.longPressTimer = null;
  }

  private beginPinch(): void {
    this.clearLongPress();
    this.boxDraft = null;
    const [a, b] = [...this.ptrs.values()];
    if (!a || !b) return;
    a.action = 'pinch';
    b.action = 'pinch';
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    this.camStart = { x: this.x, y: this.y, zoom: this.zoom, dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), cx, cy };
  }

  private updatePinch(): void {
    const [a, b] = [...this.ptrs.values()];
    if (!a || !b) return;
    const s = this.camStart;
    const dist = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const anchorX = s.x + s.cx / s.zoom;
    const anchorY = s.y + s.cy / s.zoom;
    this.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (s.zoom * dist) / s.dist));
    this.x = anchorX - cx / this.zoom;
    this.y = anchorY - cy / this.zoom;
    this.clamp();
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
