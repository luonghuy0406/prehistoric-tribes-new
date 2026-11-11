/**
 * Isometric 2:1 Projection Mathematics
 * Reverse-engineered from Prehistoric Tribes (f.java):
 * Tile Width = 44px, Tile Height = 32px
 * Half-steps: dx = 22px, dy = 16px
 */

export interface Point2D {
  x: number;
  y: number;
}

export class IsometricMath {
  public static readonly TILE_WIDTH = 44;
  public static readonly TILE_HEIGHT = 32;
  public static readonly HALF_WIDTH = 22;
  public static readonly HALF_HEIGHT = 16;

  /**
   * Convert grid tile coordinates (tx, ty) to isometric screen world coordinates.
   */
  public static tileToWorld(tx: number, ty: number): Point2D {
    return {
      x: (tx - ty) * this.HALF_WIDTH,
      y: (tx + ty) * this.HALF_HEIGHT
    };
  }

  /**
   * Convert screen world coordinates (wx, wy) back to grid tile coordinates.
   */
  public static worldToTile(wx: number, wy: number): Point2D {
    const tx = (wx / this.HALF_WIDTH + wy / this.HALF_HEIGHT) / 2;
    const ty = (wy / this.HALF_HEIGHT - wx / this.HALF_WIDTH) / 2;
    return {
      x: Math.floor(tx),
      y: Math.floor(ty)
    };
  }

  /**
   * Calculate 8-direction facing index (0 to 7) from vector delta.
   * 0: South, 1: South-West, 2: West, 3: North-West,
   * 4: North, 5: North-East, 6: East, 7: South-East
   */
  public static getDirection8(dx: number, dy: number): number {
    const angle = Math.atan2(dy, dx); // radians -PI to PI
    // Normalize to 0 .. 8 segments
    let octant = Math.round((8 * angle) / (2 * Math.PI) + 8) % 8;
    return octant;
  }
}
