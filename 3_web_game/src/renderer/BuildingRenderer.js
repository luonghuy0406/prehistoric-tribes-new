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
  chiefs_hut: 126,
  hut: 82,
  store: 92,
  kitchen: 96,
  disco: 116,
  armoury: 102,
  tower: 58,
  nursery: 94,
  sanctuary: 110,
  pia_center: 94,
  gym: 120,
  range: 124
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

  appendRenderables(renderList, buildings, camera, traps = []) {
    for (const trap of traps) {
      if (trap.isSprung || (trap.owner === 'enemy' && !trap.isRevealed)) continue;
      renderList.push({
        sortKey: trap.x + trap.y + 0.1,
        draw: (ctx) => this.drawTrap(ctx, trap, camera)
      });
    }
    for (const b of buildings) {
      renderList.push({
        sortKey: (b.x + b.width / 2) + (b.y + b.height / 2),
        draw: (ctx) => this.drawBuilding(ctx, b, camera)
      });
    }
  }

  static getSpriteKey(type, level = 1) {
    if (type === 'chiefs_hut' && level >= 2) return 'bld_chiefs_hut_lvl2';
    if (type === 'hut') {
      if (level >= 3) return 'bld_mammoth_shelter';
      if (level >= 2) return 'bld_bone_hut';
    }
    return BUILDING_SPRITE_MAP[type] || 'bld_hut';
  }

  drawTrap(ctx, trap, camera) {
    const worldPos = IsometricMath.tileToWorld(trap.x + 0.5, trap.y + 0.5);
    const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
    const zoom = camera.zoom;
    const sx = screenPos.x;
    const sy = screenPos.y;

    ctx.save();
    const color = trap.owner === 'enemy' ? '#ef4444' : (trap.def?.color || '#eab308');
    ctx.beginPath();
    ctx.ellipse(sx, sy, 14 * zoom, 8 * zoom, 0, 0, Math.PI * 2);
    ctx.fillStyle = trap.isArmed ? 'rgba(15, 23, 42, 0.45)' : 'rgba(250, 204, 21, 0.25)';
    ctx.fill();
    ctx.setLineDash([3 * zoom, 3 * zoom]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6 * zoom;
    ctx.stroke();
    ctx.setLineDash([]);

    const trapImg = this.assets ? this.assets.get('spike_trap') : null;
    if (trapImg && trap.isArmed) {
      const tw = 22 * zoom;
      const th = tw * (trapImg.naturalHeight / trapImg.naturalWidth);
      ctx.drawImage(trapImg, sx - tw / 2, sy - th * 0.75, tw, th);
    }

    ctx.font = `bold ${Math.max(9, Math.floor(9 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(trap.isArmed ? trap.type.replace('_trap', '').toUpperCase() : `Đang đặt ${Math.floor(trap.progress)}%`, sx, sy - 16 * zoom);
    ctx.restore();
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

    // 1. Soft Ambient Ground Shadow & Faction / Selection Ring
    ctx.beginPath();
    ctx.ellipse(sx, sy + 4 * zoom, footprintW * 0.55, footprintW * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    if (b.selected) {
      ctx.beginPath();
      ctx.ellipse(sx, sy + 4 * zoom, footprintW * 0.62, footprintW * 0.32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = b.owner === 'enemy' ? '#ef4444' : '#facc15';
      ctx.lineWidth = 2.4 * zoom;
      ctx.stroke();

      if (b.type === 'tower' && b.isCompleted) {
        const rangeTiles = 7 + b.level * 1.5;
        const rx = rangeTiles * IsometricMath.HALF_WIDTH * 1.45 * zoom;
        const ry = rangeTiles * IsometricMath.HALF_HEIGHT * 1.45 * zoom;
        ctx.beginPath();
        ctx.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.fill();
        ctx.setLineDash([6 * zoom, 4 * zoom]);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 1.5 * zoom;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    } else if (b.owner === 'enemy') {
      ctx.beginPath();
      ctx.ellipse(sx, sy + 4 * zoom, footprintW * 0.57, footprintW * 0.29, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
      ctx.lineWidth = 1.8 * zoom;
      ctx.stroke();
    }

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
      ctx.fillStyle = b.owner === 'enemy' ? '#ef4444' : '#22c55e';
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

      if (b.owner === 'enemy') {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.22)';
        ctx.beginPath();
        ctx.arc(sx, sy - drawH * 0.35, drawW * 0.3, 0, Math.PI * 2);
        ctx.fill();

        if (b.type === 'chiefs_hut' || b.type === 'sanctuary' || b.type === 'tower') {
          const totemImg = this.assets ? this.assets.get('bld_totem') : null;
          if (totemImg) {
            const tw = 24 * zoom;
            const th = tw * (totemImg.naturalHeight / totemImg.naturalWidth);
            ctx.drawImage(totemImg, sx - drawW * 0.45, sy + 2 * zoom - th * 0.8, tw, th);
          }
        }
      }

      if (b.type === 'chiefs_hut' || b.type === 'disco') {
        const fireImg = this.assets ? this.assets.get('bld_campfire') : null;
        if (fireImg) {
          const fw = 36 * zoom;
          const fh = fw * (fireImg.naturalHeight / fireImg.naturalWidth);
          const fx = b.type === 'disco' ? sx : sx + 22 * zoom;
          ctx.drawImage(fireImg, fx, sy + 2 * zoom - fh * 0.65, fw, fh);
        }
      }

      if (b.type === 'nursery' && b.owner === 'player') {
        const cradleImg = this.assets ? this.assets.get('prop_baby_cradle') : null;
        if (cradleImg) {
          const cw = 26 * zoom;
          const ch = cw * (cradleImg.naturalHeight / cradleImg.naturalWidth);
          ctx.drawImage(cradleImg, sx + drawW * 0.28, sy + 3 * zoom - ch * 0.7, cw, ch);
        }
      }

      if (b.type === 'sanctuary') {
        const auraR = (28 + Math.sin(this.animTime * 4) * 3) * zoom;
        ctx.beginPath();
        ctx.ellipse(sx, sy - drawH * 0.45, auraR, auraR * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = b.owner === 'enemy' ? 'rgba(248, 113, 113, 0.45)' : 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 1.6 * zoom;
        ctx.stroke();
      }

      if (b.type === 'range') {
        // Draw archery target emblem to distinguish Throwing Range from Gym
        const tx = sx + drawW * 0.28;
        const ty = sy - 10 * zoom;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(tx, ty, 9 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(tx, ty, 5.5 * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(tx, ty, 2.2 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      labelY = sy - drawH * 0.82 - 4 * zoom;
    }

    // 4. Upgrading / Repairing / Damaged HP Bar
    if (b.state === 'upgrading' || b.state === 'repairing') {
      const barW = 54 * zoom;
      const barH = 6 * zoom;
      const barY = labelY - 12 * zoom;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(sx - barW / 2 - 2, barY - 2, barW + 4, barH + 4);
      ctx.fillStyle = b.state === 'upgrading' ? '#38bdf8' : '#fbbf24';
      ctx.fillRect(sx - barW / 2, barY, barW * (b.progress / 100), barH);
      labelY = barY - 4 * zoom;
    } else if (b.health < b.maxHealth) {
      const barW = 48 * zoom;
      const barH = 5 * zoom;
      const barY = labelY - 10 * zoom;
      const ratio = Math.max(0, b.health / b.maxHealth);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(sx - barW / 2 - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = ratio > 0.5 ? '#22c55e' : (ratio > 0.25 ? '#eab308' : '#ef4444');
      ctx.fillRect(sx - barW / 2, barY, barW * ratio, barH);
      labelY = barY - 4 * zoom;
    }

    // 5. Keeper Needed Warning Badge (Authentic J2ME '!')
    if (b.owner === 'player' && b.def?.keeperRole && !b.keeperId && b.state === 'normal') {
      const pulse = Math.sin(this.animTime * 6) * 2 * zoom;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(sx + footprintW * 0.36, labelY - 8 * zoom + pulse, 8 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.font = `900 ${Math.max(10, Math.floor(11 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('!', sx + footprintW * 0.36, labelY - 4.5 * zoom + pulse);
    }

    if (b.isPrisonHut) {
      ctx.font = `bold ${Math.max(10, Math.floor(11 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fb923c';
      ctx.fillText('LỀU GIAM TÙ BINH', sx, labelY - 13 * zoom);
    }

    // 6. Clean Building Title + Level Pill
    const title = b.level > 1 ? `${b.name} Lv.${b.level}` : b.name;
    ctx.font = `bold ${Math.max(10, Math.floor(10 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(title, sx + 1, labelY + 1);
    ctx.fillStyle = b.owner === 'enemy' ? '#fca5a5' : '#fde047';
    ctx.fillText(title, sx, labelY);

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

    const costLabel = def.costBone > 0
      ? `${def.name} (${def.costWood}W ${def.costStone}S ${def.costBone}B)`
      : `${def.name} (${def.costWood}W ${def.costStone}S)`;
    ctx.font = `bold ${Math.max(10, Math.floor(11 * camera.zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(costLabel, centerScreen.x + 1, centerScreen.y - 58 * camera.zoom + 1);
    ctx.fillStyle = canPlace ? '#fde047' : '#f87171';
    ctx.fillText(costLabel, centerScreen.x, centerScreen.y - 58 * camera.zoom);

    ctx.restore();
  }
}
