import { IsometricMath } from '../core/IsometricMath.js';

const TILE_SPECS = {
  tile_grass_pebbles: { centerY: 96, diamondH: 188 },
  tile_grass_flowers: { centerY: 120, diamondH: 188 },
  tile_dirt_trail: { centerY: 92, diamondH: 180 },
  tile_water: { centerY: 91, diamondH: 178 }
};

export class TilemapRenderer {
  constructor(map, assets = null) {
    this.map = map;
    this.assets = assets;
    this.animTime = 0;

    this.scenicProps = [];
    this.depletedNodes = new Map(); // "x,y" -> 'stump' | 'stone_depleted'

    this.initScenicProps();
  }

  initScenicProps() {
    if (!this.map) return;

    const candidates = [
      { key: 'signpost', x: 16.5, y: 13.5, scale: 0.72 },
      { key: 'waterfall', x: 3.5, y: 4.5, scale: 1.45 },
      { key: 'pond', x: 5.5, y: 6.5, scale: 1.35 },
      { key: 'log_bridge', x: 6.5, y: 7.5, scale: 1.05 },
      { key: 'bld_fishing_pier', x: 7.5, y: 8.5, scale: 1.1 },
      { key: 'volcano', x: 35.5, y: 3.5, scale: 1.65 },
      { key: 'skeleton', x: 26.5, y: 26.5, scale: 1.15 },
      { key: 'skull', x: 8.5, y: 22.5, scale: 0.85 },
      { key: 'amber', x: 17.5, y: 24.5, scale: 0.75 },
      { key: 'fallen_log', x: 9.5, y: 17.5, scale: 0.95 },
      { key: 'fallen_log', x: 21.5, y: 8.5, scale: 0.95 },
      { key: 'crystal', x: 30.5, y: 19.5, scale: 0.9 },
      { key: 'spike_trap', x: 25.5, y: 20.5, scale: 0.85 }
    ];

    for (const c of candidates) {
      if (c.x >= 1 && c.x < this.map.width - 1 && c.y >= 1 && c.y < this.map.height - 1) {
        this.scenicProps.push(c);
      }
    }

    // Light sparse ferns & glowing fungus outside main settlement
    for (let y = 2; y < this.map.height - 2; y++) {
      for (let x = 2; x < this.map.width - 2; x++) {
        const val = this.map.tiles[y][x];
        if (val >= 170 || val === -126) continue;
        if (x >= 8 && x <= 20 && y >= 7 && y <= 17) continue;

        const hash = (x * 73856093) ^ (y * 19349663);
        const mod = Math.abs(hash) % 41;
        if (mod === 1) {
          this.scenicProps.push({ key: 'fern', x: x + 0.5, y: y + 0.5, scale: 0.72 });
        } else if (mod === 19) {
          this.scenicProps.push({ key: 'fungus', x: x + 0.5, y: y + 0.5, scale: 0.65 });
        }
      }
    }
  }

  clearTile(x, y) {
    if (!this.map) return;
    if (y >= 0 && y < this.map.height && x >= 0 && x < this.map.width) {
      if (this.map.tiles[y][x] >= 170) {
        this.map.tiles[y][x] = 0;
        this.map.collision[y][x] = 0;
      }
    }
  }

  depleteTile(x, y, type) {
    if (!this.map) return;
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if (ty >= 0 && ty < this.map.height && tx >= 0 && tx < this.map.width) {
      this.map.tiles[ty][tx] = 0;
      this.map.collision[ty][tx] = 0;
      this.depletedNodes.set(`${tx},${ty}`, type === 'wood' ? 'tree_stump' : 'stone_depleted');
    }
  }

  getFishingSpot() {
    const pier = this.scenicProps.find((p) => p.key === 'bld_fishing_pier');
    if (pier) return { x: pier.x, y: pier.y };
    const pond = this.scenicProps.find((p) => p.key === 'pond');
    return pond ? { x: pond.x + 1.0, y: pond.y + 1.0 } : null;
  }

  isNearFishingLandmark(tx, ty) {
    return this.scenicProps.some(
      (p) => (p.key === 'bld_fishing_pier' || p.key === 'pond') && Math.hypot(p.x - tx, p.y - ty) < 1.8
    );
  }

  update(dt) {
    this.animTime += dt;
  }

  getTileKey(tileType, x, y) {
    if (tileType === -126) return 'tile_water';
    if (tileType === 3 || (tileType >= 4 && tileType <= 8)) return 'tile_dirt_trail';
    // Deterministic mix of grassy pebbles vs wildflower grass
    const hash = Math.abs((x * 19 + y * 37) % 5);
    return hash === 0 ? 'tile_grass_flowers' : 'tile_grass_pebbles';
  }

  renderBase(ctx, camera, hoveredTile) {
    const hw = IsometricMath.HALF_WIDTH;
    const hh = IsometricMath.HALF_HEIGHT;

    // Strict back-to-front painter's order so 3D tile skirts & flower tufts overlap naturally
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const worldPos = IsometricMath.tileToWorld(x + 0.5, y + 0.5);
        const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);

        if (
          screenPos.x < -hw * 2.5 * camera.zoom ||
          screenPos.x > camera.viewportWidth + hw * 2.5 * camera.zoom ||
          screenPos.y < -hh * 3.5 * camera.zoom ||
          screenPos.y > camera.viewportHeight + hh * 3.5 * camera.zoom
        ) {
          continue;
        }

        const tileType = this.map.tiles[y][x];
        const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;
        this.drawBaseTile(ctx, screenPos.x, screenPos.y, camera.zoom, tileType, isHovered, x, y);
      }
    }
  }

  drawBaseTile(ctx, sx, sy, zoom, tileType, isHovered, x, y) {
    const hw = IsometricMath.HALF_WIDTH * zoom;
    const hh = IsometricMath.HALF_HEIGHT * zoom;

    const tileKey = this.getTileKey(tileType, x, y);
    const img = this.assets ? this.assets.get(tileKey) : null;
    const spec = TILE_SPECS[tileKey];

    if (img && spec) {
      // Slight 3% bleed eliminates anti-aliasing seam hairlines between isometric diamond tiles
      const scaleX = (IsometricMath.TILE_WIDTH * zoom * 1.035) / img.naturalWidth;
      const scaleY = (IsometricMath.TILE_HEIGHT * zoom * 1.035) / spec.diamondH;

      const drawW = img.naturalWidth * scaleX;
      const drawH = img.naturalHeight * scaleY;
      const drawX = sx - drawW / 2;
      const drawY = sy - spec.centerY * scaleY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      if (isHovered) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx, sy - hh);
        ctx.lineTo(sx + hw, sy);
        ctx.lineTo(sx, sy + hh);
        ctx.lineTo(sx - hw, sy);
        ctx.closePath();
        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = Math.max(1.5, 1.5 * zoom);
        ctx.stroke();
        ctx.restore();
      }
      return;
    }

    // Fallback plain diamond if sprite missing
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sx, sy - hh);
    ctx.lineTo(sx + hw, sy);
    ctx.lineTo(sx, sy + hh);
    ctx.lineTo(sx - hw, sy);
    ctx.closePath();
    ctx.fillStyle = isHovered ? '#eab308' : tileType === -126 ? '#1e40af' : '#55872d';
    ctx.fill();
    ctx.restore();
  }

  appendRenderables(renderList, camera) {
    const hw = IsometricMath.HALF_WIDTH;
    const hh = IsometricMath.HALF_HEIGHT;

    // 1. Scenic Jungle Props & Landmarks
    for (const prop of this.scenicProps) {
      const worldPos = IsometricMath.tileToWorld(prop.x, prop.y);
      const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
      if (
        screenPos.x < -120 * camera.zoom ||
        screenPos.x > camera.viewportWidth + 120 * camera.zoom ||
        screenPos.y < -120 * camera.zoom ||
        screenPos.y > camera.viewportHeight + 120 * camera.zoom
      ) {
        continue;
      }

      renderList.push({
        sortKey: prop.x + prop.y,
        draw: (ctx) => this.drawPropSprite(ctx, prop.key, screenPos.x, screenPos.y, camera.zoom, prop.scale)
      });
    }

    // 2. Depleted Stumps & Broken Stones
    for (const [keyCoord, propKey] of this.depletedNodes.entries()) {
      const [xs, ys] = keyCoord.split(',');
      const tx = Number(xs) + 0.5;
      const ty = Number(ys) + 0.5;
      const worldPos = IsometricMath.tileToWorld(tx, ty);
      const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
      renderList.push({
        sortKey: tx + ty,
        draw: (ctx) => this.drawPropSprite(ctx, propKey, screenPos.x, screenPos.y, camera.zoom, 0.88)
      });
    }

    // 3. Standing Trees & Quarry Boulders
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const tileType = this.map.tiles[y][x];
        if (tileType < 170) continue;

        const worldPos = IsometricMath.tileToWorld(x + 0.5, y + 0.5);
        const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);

        if (
          screenPos.x < -hw * 4 * camera.zoom ||
          screenPos.x > camera.viewportWidth + hw * 4 * camera.zoom ||
          screenPos.y < -hh * 4 * camera.zoom ||
          screenPos.y > camera.viewportHeight + hh * 4 * camera.zoom
        ) {
          continue;
        }

        renderList.push({
          sortKey: x + y + 1.0,
          draw: (ctx) => {
            if (tileType >= 175) {
              this.drawPrehistoricTree(ctx, screenPos.x, screenPos.y, camera.zoom, x, y);
            } else {
              this.drawQuarryBoulder(ctx, screenPos.x, screenPos.y, camera.zoom, x, y);
            }
          }
        });
      }
    }
  }

  drawPropSprite(ctx, key, sx, sy, zoom, scale = 1.0) {
    const img = this.assets ? this.assets.get(key) : null;
    if (!img) return;

    const targetW = 48 * scale * zoom;
    const targetH = targetW * (img.naturalHeight / img.naturalWidth);
    ctx.drawImage(img, sx - targetW / 2, sy - targetH * 0.85, targetW, targetH);
  }

  drawPrehistoricTree(ctx, sx, sy, zoom, x, y) {
    const treeKey = ((x * 5 + y * 3) % 3 === 0) ? 'tree_palm' : 'tree_conifer';
    const img = this.assets ? this.assets.get(treeKey) : null;

    ctx.save();
    const swayAngle = Math.sin(this.animTime * 1.8 + x * 0.7 + y * 0.4) * 0.025;

    if (img) {
      ctx.beginPath();
      ctx.ellipse(sx, sy + 2 * zoom, 16 * zoom, 8 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fill();

      const scaleBoost = 0.92 + ((x * 7 + y) % 3) * 0.08;
      const drawH = 66 * scaleBoost * zoom;
      const drawW = drawH * (img.naturalWidth / img.naturalHeight);

      ctx.translate(sx, sy);
      ctx.rotate(swayAngle);
      ctx.drawImage(img, -drawW / 2, -drawH * 0.92, drawW, drawH);
    }
    ctx.restore();
  }

  drawQuarryBoulder(ctx, sx, sy, zoom, x, y) {
    const isCrystal = (x + y * 7) % 5 === 0;
    const img = this.assets ? this.assets.get(isCrystal ? 'crystal' : 'stone_boulder') : null;

    ctx.save();
    if (img) {
      ctx.beginPath();
      ctx.ellipse(sx, sy + 2 * zoom, 14 * zoom, 7 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();

      const drawW = 42 * zoom;
      const drawH = drawW * (img.naturalHeight / img.naturalWidth);
      ctx.drawImage(img, sx - drawW / 2, sy - drawH * 0.88, drawW, drawH);
    }
    ctx.restore();
  }
}
