import { Point2D } from './IsometricMath';

export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 2.0; // Default 2x retro pixel scaling
  public viewportWidth: number = 800;
  public viewportHeight: number = 600;

  constructor(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public pan(dx: number, dy: number): void {
    this.x += dx / this.zoom;
    this.y += dy / this.zoom;
  }

  public setZoom(zoom: number): void {
    this.zoom = Math.max(1.0, Math.min(4.0, zoom));
  }

  public zoomAt(delta: number, screenPoint: Point2D): void {
    const prevZoom = this.zoom;
    const newZoom = Math.max(1.0, Math.min(4.0, prevZoom + delta));
    if (newZoom === prevZoom) return;

    // Zoom towards cursor
    const worldBefore = this.screenToWorld(screenPoint.x, screenPoint.y);
    this.zoom = newZoom;
    const worldAfter = this.screenToWorld(screenPoint.x, screenPoint.y);

    this.x -= (worldAfter.x - worldBefore.x);
    this.y -= (worldAfter.y - worldBefore.y);
  }

  public screenToWorld(sx: number, sy: number): Point2D {
    return {
      x: (sx - this.viewportWidth / 2) / this.zoom + this.x,
      y: (sy - this.viewportHeight / 2) / this.zoom + this.y
    };
  }

  public worldToScreen(wx: number, wy: number): Point2D {
    return {
      x: (wx - this.x) * this.zoom + this.viewportWidth / 2,
      y: (wy - this.y) * this.zoom + this.viewportHeight / 2
    };
  }
}
