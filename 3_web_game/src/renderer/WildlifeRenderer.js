import { IsometricMath } from '../core/IsometricMath.js';

export class WildlifeRenderer {
  constructor(assets = null) {
    this.assets = assets;
    this.animTime = 0;
  }

  update(dt) {
    this.animTime += dt;
  }

  appendRenderables(renderList, nodes, animals, camera) {
    for (const node of nodes) {
      if (node.type === 'berry_bush') {
        const worldPos = IsometricMath.tileToWorld(node.x, node.y);
        const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
        renderList.push({
          sortKey: node.x + node.y,
          draw: (ctx) => this.drawBerryBush(ctx, node, screenPos.x, screenPos.y, camera.zoom)
        });
      }
    }

    for (const a of animals) {
      const worldPos = IsometricMath.tileToWorld(a.x, a.y);
      const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
      renderList.push({
        sortKey: a.x + a.y,
        draw: (ctx) => this.drawAnimal(ctx, a, screenPos.x, screenPos.y, camera.zoom)
      });
    }
  }

  drawBerryBush(ctx, node, sx, sy, zoom) {
    ctx.save();

    // Soft Drop Shadow
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * zoom, 16 * zoom, 8 * zoom, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    const fullImg = this.assets ? this.assets.get('berry_bush') : null;
    const depletedImg = this.assets ? this.assets.get('berry_bush_depleted') : null;

    if (!node.isDepleted && node.amount > 0 && fullImg) {
      const drawW = 46 * zoom;
      const drawH = drawW * (fullImg.naturalHeight / fullImg.naturalWidth);
      ctx.drawImage(fullImg, sx - drawW / 2, sy - drawH * 0.85, drawW, drawH);
    } else if (depletedImg) {
      const drawW = 44 * zoom;
      const drawH = drawW * (depletedImg.naturalHeight / depletedImg.naturalWidth);
      ctx.drawImage(depletedImg, sx - drawW / 2, sy - drawH * 0.85, drawW, drawH);
    }

    ctx.font = `bold ${Math.max(9, Math.floor(9.5 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';

    if (!node.isDepleted) {
      const labelY = sy - 36 * zoom;
      ctx.fillStyle = '#000000';
      ctx.fillText(`Berries (${node.amount})`, sx + 1, labelY + 1);
      ctx.fillStyle = '#fde047';
      ctx.fillText(`Berries (${node.amount})`, sx, labelY);
    } else {
      const labelY = sy - 32 * zoom;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Regrowing...`, sx, labelY);

      const barW = 28 * zoom;
      const barH = 3.5 * zoom;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sx - barW / 2, labelY + 3 * zoom, barW, barH);
      ctx.fillStyle = '#34d399';
      const pct = Math.min(1, (node.maxRegrowthTime - node.regrowthTimer) / node.maxRegrowthTime);
      ctx.fillRect(sx - barW / 2, labelY + 3 * zoom, barW * pct, barH);
    }

    ctx.restore();
  }

  getAnimalSpriteKey(a) {
    const baseMap = {
      mammoth: 'animal_mammoth',
      tiger: 'animal_sabertooth',
      boar: 'animal_boar',
      trex: 'animal_trex',
      triceratops: 'animal_triceratops',
      brontosaurus: 'animal_brontosaurus'
    };
    const base = baseMap[a.type] || 'animal_boar';

    if (a.type === 'mammoth' || a.type === 'tiger' || a.type === 'boar') {
      if (a.isAttacking && this.assets && this.assets.get(`${base}_attack`)) {
        return `${base}_attack`;
      }
      if (a.facingBack && this.assets && this.assets.get(`${base}_back`)) {
        return `${base}_back`;
      }
    }
    return base;
  }

  drawAnimal(ctx, a, sx, sy, zoom) {
    ctx.save();

    const sizeFactor = a.type === 'brontosaurus' ? 1.55 : a.type === 'mammoth' || a.type === 'triceratops' ? 1.25 : 0.9;
    const shadowR = 18 * sizeFactor * zoom;

    // 1. Soft Ground Shadow
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * zoom, shadowR, shadowR * 0.44, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.fill();

    // 2. Harvestable Slain Carcass
    if (a.isDead) {
      const carcassImg = this.assets ? this.assets.get('animal_carcass') : null;
      if (carcassImg) {
        const cw = 48 * zoom;
        const ch = cw * (carcassImg.naturalHeight / carcassImg.naturalWidth);
        ctx.drawImage(carcassImg, sx - cw / 2, sy - ch * 0.82, cw, ch);
      }

      ctx.font = `bold ${Math.max(9, Math.floor(10 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText(`Carcass (${a.foodYield} Food)`, sx + 1, sy + 14 * zoom + 1);
      ctx.fillStyle = '#fde047';
      ctx.fillText(`Carcass (${a.foodYield} Food)`, sx, sy + 14 * zoom);

      ctx.restore();
      return;
    }

    // 3. Alive Animal PNG Sprite with 4-direction & attack animation
    const imgKey = this.getAnimalSpriteKey(a);
    const img = this.assets ? this.assets.get(imgKey) : null;

    const widthMap = {
      mammoth: 62,
      tiger: 48,
      boar: 40,
      trex: 64,
      triceratops: 58,
      brontosaurus: 74
    };
    const drawW = (widthMap[a.type] || 42) * zoom;
    const bob = a.isMoving ? Math.abs(Math.sin(this.animTime * 8 + a.id)) * 2.5 * zoom : 0;
    const tilt = a.isMoving ? Math.sin(this.animTime * 8 + a.id) * 0.04 : 0;

    let labelY = sy - 38 * zoom;

    if (img) {
      const drawH = drawW * (img.naturalHeight / img.naturalWidth);
      ctx.save();
      ctx.translate(sx, sy - bob);
      if (a.flipX) ctx.scale(-1, 1);
      ctx.rotate(tilt);
      ctx.drawImage(img, -drawW / 2, -drawH * 0.88, drawW, drawH);
      ctx.restore();
      labelY = sy - drawH * 0.92 - 4 * zoom;
    }

    // 4. Animal Name Tag & HP Bar
    ctx.font = `bold ${Math.max(9, Math.floor(9.5 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(a.name, sx + 1, labelY + 1);
    ctx.fillStyle = a.type === 'mammoth' ? '#fde047' : a.type === 'tiger' ? '#fb923c' : '#ffffff';
    ctx.fillText(a.name, sx, labelY);

    if (a.health < a.maxHealth) {
      const barW = 34 * zoom;
      const barH = 4 * zoom;
      const barY = labelY - 7 * zoom;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sx - barW / 2 - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(sx - barW / 2, barY, barW * (a.health / a.maxHealth), barH);
    }

    ctx.restore();
  }
}
