export class IsometricMath {
  static TILE_WIDTH = 44;
  static TILE_HEIGHT = 32;
  static HALF_WIDTH = 22;
  static HALF_HEIGHT = 16;

  static tileToWorld(tx, ty) {
    return {
      x: (tx - ty) * this.HALF_WIDTH,
      y: (tx + ty) * this.HALF_HEIGHT
    };
  }

  static worldToTile(wx, wy) {
    const tx = (wx / this.HALF_WIDTH + wy / this.HALF_HEIGHT) / 2;
    const ty = (wy / this.HALF_HEIGHT - wx / this.HALF_WIDTH) / 2;
    return {
      x: Math.floor(tx),
      y: Math.floor(ty)
    };
  }

  static getDirection8(dx, dy) {
    const angle = Math.atan2(dy, dx);
    const octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
    return octant;
  }
}
