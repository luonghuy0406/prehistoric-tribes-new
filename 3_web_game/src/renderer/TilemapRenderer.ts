import { MapData } from '../loaders/BinaryMapLoader';
import { Camera } from '../core/Camera';
import { IsometricMath, Point2D } from '../core/IsometricMath';

export class TilemapRenderer {
  private map: MapData;
  private atlasImage: HTMLImageElement | null = null;

  constructor(map: MapData, atlasImage?: HTMLImageElement) {
    this.map = map;
    if (atlasImage) this.atlasImage = atlasImage;
  }

  public render(ctx: CanvasRenderingContext2D, camera: Camera, hoveredTile: Point2D | null): void {
    const hw = IsometricMath.HALF_WIDTH;
    const hh = IsometricMath.HALF_HEIGHT;

    // Determine visible tile range based on camera viewport
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const worldPos = IsometricMath.tileToWorld(x, y);
        const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);

        // Quick viewport bounding box culling
        if (
          screenPos.x < -hw * camera.zoom ||
          screenPos.x > camera.viewportWidth + hw * camera.zoom ||
          screenPos.y < -hh * camera.zoom ||
          screenPos.y > camera.viewportHeight + hh * camera.zoom
        ) {
          continue;
        }

        const tileType = this.map.tiles[y][x];
        const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;

        this.drawDiamondTile(ctx, screenPos.x, screenPos.y, camera.zoom, tileType, isHovered);
      }
    }
  }

  private drawDiamondTile(
    ctx: CanvasRenderingContext2D,
    sx: number,
    sy: number,
    zoom: number,
    tileType: number,
    isHovered: boolean
  ): void {
    const hw = IsometricMath.HALF_WIDTH * zoom;
    const hh = IsometricMath.HALF_HEIGHT * zoom;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy - hh);
    ctx.lineTo(sx + hw, sy);
    ctx.lineTo(sx, sy + hh);
    ctx.lineTo(sx - hw, sy);
    ctx.closePath();

    // Palette colors matching Prehistoric Tribes terrain
    let fillColor = '#5c8a32'; // Default lush grass
    let strokeColor = '#4b7527';

    if (tileType === 0) {
      fillColor = '#689d38'; // Light grass
    } else if (tileType === 1) {
      fillColor = '#55822e'; // Medium grass
    } else if (tileType === 2) {
      fillColor = '#476e25'; // Dark grass
    } else if (tileType === 3) {
      fillColor = '#8d7547'; // Dirt path
      strokeColor = '#77623a';
    } else if (tileType >= 4 && tileType <= 8) {
      fillColor = '#9e8553'; // Dry soil / sand
      strokeColor = '#856f43';
    } else if (tileType >= 170) {
      fillColor = '#757575'; // Stone deposit
      strokeColor = '#505050';
    }

    if (isHovered) {
      fillColor = '#e6d057'; // Highlight gold
      strokeColor = '#ffffff';
    }

    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    // Render tree / rock icon if node tile
    if (tileType >= 175 && tileType <= 179) {
      ctx.fillStyle = '#2d5a1e';
      ctx.beginPath();
      ctx.arc(sx, sy - 6 * zoom, 8 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#61401b';
      ctx.fillRect(sx - 2 * zoom, sy - 2 * zoom, 4 * zoom, 8 * zoom);
    }

    ctx.restore();
  }
}
