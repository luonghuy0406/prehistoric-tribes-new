import { Villager } from '../simulation/Villager';
import { Camera } from '../core/Camera';
import { IsometricMath } from '../core/IsometricMath';

export class SpriteRenderer {
  private unitAtlas: HTMLImageElement | null = null;

  constructor(unitAtlas?: HTMLImageElement) {
    if (unitAtlas) this.unitAtlas = unitAtlas;
  }

  public renderVillagers(
    ctx: CanvasRenderingContext2D,
    villagers: Villager[],
    selectedVillagerId: number | null,
    camera: Camera
  ): void {
    // Sort villagers by screen Y (isometric depth sorting)
    const sorted = [...villagers].sort((a, b) => (a.x + a.y) - (b.x + b.y));

    for (const v of sorted) {
      const worldPos = IsometricMath.tileToWorld(v.x, v.y);
      const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);

      const isSelected = v.id === selectedVillagerId;
      this.drawVillager(ctx, v, screenPos.x, screenPos.y, camera.zoom, isSelected);
    }
  }

  private drawVillager(
    ctx: CanvasRenderingContext2D,
    v: Villager,
    sx: number,
    sy: number,
    zoom: number,
    isSelected: boolean
  ): void {
    ctx.save();

    // 1. Selection indicator ring
    if (isSelected) {
      ctx.beginPath();
      ctx.ellipse(sx, sy, 14 * zoom, 7 * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#22c55e'; // Bright green selection ring
      ctx.lineWidth = 2 * zoom;
      ctx.stroke();
    }

    // 2. Render Sprite from pi9.png if loaded, else high quality pixel art avatar
    if (this.unitAtlas && this.unitAtlas.complete && this.unitAtlas.naturalWidth > 0) {
      // pi9.png is 76x111
      // Slicing unit frames: frame dimensions approx 19x22
      const frameW = 19;
      const frameH = 22;
      const frameX = (v.animFrame % 4) * frameW;
      const frameY = (v.gender === 'male' ? 0 : 2) * frameH;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        this.unitAtlas,
        frameX, frameY, frameW, frameH,
        sx - (frameW / 2) * zoom,
        sy - frameH * zoom,
        frameW * zoom,
        frameH * zoom
      );
    } else {
      // Fallback procedural retro villager sprite
      const bodyColor = v.isChief ? '#d97706' : v.gender === 'male' ? '#b45309' : '#f59e0b';
      const skinColor = '#fcd34d';

      // Body (pelt clothing)
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(sx, sy - 12 * zoom, 7 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(sx, sy - 20 * zoom, 5 * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Chief hair / crown
      if (v.isChief) {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(sx, sy - 24 * zoom, 3 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Name Tag
    ctx.font = `${Math.max(9, Math.floor(10 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(v.name, sx + 1, sy - 28 * zoom + 1);
    ctx.fillStyle = v.isChief ? '#fef08a' : '#ffffff';
    ctx.fillText(v.name, sx, sy - 28 * zoom);

    // 4. Thought Bubble (if hungry or tired)
    if (v.hunger > 60 || v.tiredness > 60) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx + 12 * zoom, sy - 32 * zoom, 6 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.font = `${Math.floor(8 * zoom)}px sans-serif`;
      ctx.fillText(v.hunger > 60 ? '🍖' : '💤', sx + 12 * zoom, sy - 30 * zoom);
    }

    ctx.restore();
  }
}
