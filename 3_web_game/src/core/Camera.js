export class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.zoom = 2.0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  pan(dx, dy) {
    this.x += dx / this.zoom;
    this.y += dy / this.zoom;
  }

  setZoom(zoom) {
    this.zoom = Math.max(1.0, Math.min(4.0, zoom));
  }

  zoomAt(delta, screenPoint) {
    const prevZoom = this.zoom;
    const newZoom = Math.max(1.0, Math.min(4.0, prevZoom + delta));
    if (newZoom === prevZoom) return;

    const worldBefore = this.screenToWorld(screenPoint.x, screenPoint.y);
    this.zoom = newZoom;
    const worldAfter = this.screenToWorld(screenPoint.x, screenPoint.y);

    this.x -= (worldAfter.x - worldBefore.x);
    this.y -= (worldAfter.y - worldBefore.y);
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.viewportWidth / 2) / this.zoom + this.x,
      y: (sy - this.viewportHeight / 2) / this.zoom + this.y
    };
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.x) * this.zoom + this.viewportWidth / 2,
      y: (wy - this.y) * this.zoom + this.viewportHeight / 2
    };
  }
}
