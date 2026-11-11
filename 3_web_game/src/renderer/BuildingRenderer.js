import { IsometricMath } from '../core/IsometricMath.js';

const BUILDING_SPRITE_MAP = {
  chiefs_hut: 'bld_chiefs_hut',
  hut: 'bld_hut',
  store: 'bld_store',
  kitchen: 'bld_kitchen',
  disco: 'bld_disco',
  armoury: 'bld_armoury',
  tower: 'bld_watchtower',
  nursery: 'bld_nursery',
  sanctuary: 'bld_sanctuary',
  pia_center: 'bld_pia_shrine',
  gym: 'bld_training_center',
  range: 'bld_training_center'
};

const BUILDING_WIDTH_MAP = {
  chiefs_hut: 118,
  hut: 80,
  store: 86,
  kitchen: 88,
  disco: 110,
  armoury: 98,
  tower: 56,
  nursery: 84,
  sanctuary: 108,
  pia_center: 88,
  gym: 114,
  range: 104
};

export class BuildingRenderer {
  constructor(assets = null) {
    this.assets = assets;
    this.animTime = 0;
  }

  update(dt) {
    this.animTime += dt;
  }

  renderBuildings(ctx, buildings, camera) {
    const sorted = [...buildings].sort((a, b) => (a.x + a.y) - (b.x + b.y));
    for (const b of sorted) {
      this.drawBuilding(ctx, b, camera);
    }
  }

  appendRenderables(renderList, buildings, camera) {
    for (const b of buildings) {
      renderList.push({
        sortKey: (b.x + b.width / 2) + (b.y + b.height / 2),
        draw: (ctx) => this.drawBuilding(ctx, b, camera)
      });
    }
  }

  static getSpriteKey(type, level = 1) {
    if (type === 'chiefs_hut' && level >= 2) return 'bld_chiefs_hut_lvl2';
    if (type === 'hut' && level >= 2) return 'bld_bone_hut';
    return BUILDING_SPRITE_MAP[type] || 'bld_hut';
  }

  drawBuilding(ctx, b, camera) {
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const worldPos = IsometricMath.tileToWorld(cx, cy);
    const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);

    const zoom = camera.zoom;
    const sx = screenPos.x;
    const sy = screenPos.y;
    const footprintW = (b.width + b.height) * IsometricMath.HALF_WIDTH * 0.65 * zoom;

    ctx.save();

    // 1. Soft Ambient Ground Shadow
    ctx.beginPath();
    ctx.ellipse(sx, sy + 4 * zoom, footprintW * 0.55, footprintW * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // 2. Under Construction: Scaffolding Sprite + Progress Bar
    if (!b.isCompleted) {
      const scaffoldImg = this.assets ? this.assets.get('bld_scaffolding') : null;
      if (scaffoldImg) {
        const drawW = Math.max(72, b.width * 34) * zoom;
        const drawH = drawW * (scaffoldImg.naturalHeight / scaffoldImg.naturalWidth);
        ctx.drawImage(scaffoldImg, sx - drawW / 2, sy - drawH * 0.8, drawW, drawH);
      }

      const barW = 54 * zoom;
      const barH = 7 * zoom;
      const barY = sy - 58 * zoom;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(sx - barW / 2 - 2, barY - 2, barW + 4, barH + 4);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(sx - barW / 2, barY, barW * (b.progress / 100), barH);

      ctx.font = `bold ${Math.max(10, Math.floor(10 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.fillText(`${b.name}: ${Math.floor(b.progress)}%`, sx, barY - 6 * zoom);

      ctx.restore();
      return;
    }

    // 3. Completed Building Sprite
    const imgKey = BuildingRenderer.getSpriteKey(b.type, b.level);
    const img = this.assets ? this.assets.get(imgKey) : null;
    let labelY = sy - 58 * zoom;

    if (img) {
      const drawW = (BUILDING_WIDTH_MAP[b.type] || 84) * zoom;
      const drawH = drawW * (img.naturalHeight / img.naturalWidth);
      ctx.drawImage(img, sx - drawW / 2, sy - drawH * 0.78, drawW, drawH);

      if (b.type === 'chiefs_hut') {
        const fireImg = this.assets ? this.assets.get('bld_campfire') : null;
        if (fireImg) {
          const fw = 36 * zoom;
          const fh = fw * (fireImg.naturalHeight / fireImg.naturalWidth);
          ctx.drawImage(fireImg, sx + 22 * zoom, sy + 2 * zoom - fh * 0.65, fw, fh);
        }
      }
      labelY = sy - drawH * 0.82 - 4 * zoom;
    }

    // 4. Clean Building Title Pill
    ctx.font = `bold ${Math.max(10, Math.floor(10 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillText(b.name, sx + 1, labelY + 1);
    ctx.fillStyle = '#fde047';
    ctx.fillText(b.name, sx, labelY);

    ctx.restore();
  }

  static drawGhost(ctx, def, tx, ty, camera, canPlace, assets = null) {
    const hw = IsometricMath.HALF_WIDTH;
    const hh = IsometricMath.HALF_HEIGHT;

    ctx.save();
    for (let gy = 0; gy < def.height; gy++) {
      for (let gx = 0; gx < def.width; gx++) {
        const worldPos = IsometricMath.tileToWorld(tx + gx + 0.5, ty + gy + 0.5);
        const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);

        const sx = screenPos.x;
        const sy = screenPos.y;
        const zHw = hw * camera.zoom;
        const zHh = hh * camera.zoom;

        ctx.beginPath();
        ctx.moveTo(sx, sy - zHh);
        ctx.lineTo(sx + zHw, sy);
        ctx.lineTo(sx, sy + zHh);
        ctx.lineTo(sx - zHw, sy);
        ctx.closePath();

        ctx.fillStyle = canPlace ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.45)';
        ctx.fill();
        ctx.strokeStyle = canPlace ? '#4ade80' : '#f87171';
        ctx.lineWidth = 2 * camera.zoom;
        ctx.stroke();
      }
    }

    const centerWorld = IsometricMath.tileToWorld(tx + def.width / 2, ty + def.height / 2);
    const centerScreen = camera.worldToScreen(centerWorld.x, centerWorld.y);

    if (assets) {
      const img = assets.get(BuildingRenderer.getSpriteKey(def.id, 1));
      if (img) {
        ctx.globalAlpha = canPlace ? 0.72 : 0.42;
        const drawW = (BUILDING_WIDTH_MAP[def.id] || 84) * camera.zoom;
        const drawH = drawW * (img.naturalHeight / img.naturalWidth);
        ctx.drawImage(img, centerScreen.x - drawW / 2, centerScreen.y - drawH * 0.78, drawW, drawH);
        ctx.globalAlpha = 1.0;
      }
    }

    ctx.font = `bold ${Math.max(10, Math.floor(11 * camera.zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${def.name} (${def.costWood}W ${def.costStone}S)`, centerScreen.x + 1, centerScreen.y - 58 * camera.zoom + 1);
    ctx.fillStyle = canPlace ? '#fde047' : '#f87171';
    ctx.fillText(`${def.name} (${def.costWood}W ${def.costStone}S)`, centerScreen.x, centerScreen.y - 58 * camera.zoom);

    ctx.restore();
  }
}
