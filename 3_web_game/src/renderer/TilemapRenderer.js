import { IsometricMath } from '../core/IsometricMath.js';
import { OCC } from '../loaders/BinaryMapLoader.js';
import { BIOMES } from '../data/GameData.js';

const TILE_SPECS = {
  tile_grass_pebbles: { centerY: 96, diamondH: 188 },
  tile_grass_flowers: { centerY: 120, diamondH: 188 },
  tile_dirt_trail: { centerY: 92, diamondH: 180 },
  tile_water: { centerY: 91, diamondH: 178 }
};

export class TilemapRenderer {
  constructor(map, assets = null, biomeId = 'lush') {
    this.map = map;
    this.assets = assets;
    this.biome = BIOMES[biomeId] || BIOMES.lush;
    this.animTime = 0;

    this.scenicProps = [];
    this.depletedNodes = new Map(); // "x,y" -> 'tree_stump' | 'stone_depleted'

    this.initScenicProps();
  }

  initScenicProps() {
    if (!this.map) return;

    const biomeKey = this.biome?.name || '';
    const isArid = biomeKey.includes('Wastelands') || biomeKey.includes('Desert');

    // Place scenic landmark props around real decoded fish shoals safely
    const fishList = this.map.fishShoals || [];
    for (let i = 0; i < fishList.length; i++) {
      const fish = fishList[i];
      this.scenicProps.push({ key: 'pond', x: fish.x + 0.5, y: fish.y + 0.5, scale: 1.05 });
      if (i === 0 && fish.x + 1 < this.map.width - 1) {
        this.scenicProps.push({ key: 'bld_fishing_pier', x: fish.x + 1.2, y: fish.y + 0.5, scale: 0.95 });
      }
      if (i === 1 && fish.y > 2) {
        this.scenicProps.push({ key: 'waterfall', x: fish.x + 0.5, y: fish.y - 0.6, scale: 1.25 });
      }
    }

    // Place log bridge & volcano/fossils/cliff ridges natively matching each tile's OCC type
    let bridgePlaced = false;
    let volcanoPlaced = false;
    let signpostPlaced = false;

    for (let y = 2; y < this.map.height - 2; y++) {
      for (let x = 2; x < this.map.width - 2; x++) {
        const occ = this.map.collision[y][x];
        const hash = Math.abs((x * 73856093) ^ (y * 19349663));

        if (occ === OCC.BLOCKED) {
          // Draw 3D cliff walls & volcanic hazards on blocked mountain ridge pockets
          if (!volcanoPlaced && isArid && y < this.map.height * 0.45 && (hash % 17 === 0)) {
            this.scenicProps.push({ key: 'volcano', x: x + 0.5, y: y + 0.5, scale: 1.45 });
            volcanoPlaced = true;
          } else if (hash % 5 === 0) {
            this.scenicProps.push({ key: 'wall_cliff', x: x + 0.5, y: y + 0.5, scale: 1.08 });
          } else if (isArid && hash % 19 === 0) {
            this.scenicProps.push({ key: 'lava', x: x + 0.5, y: y + 0.5, scale: 0.9 });
          }
          continue;
        }

        if (occ === OCC.WATER && !bridgePlaced && hash % 29 === 0) {
          this.scenicProps.push({ key: 'log_bridge', x: x + 0.5, y: y + 0.5, scale: 0.95 });
          bridgePlaced = true;
          continue;
        }

        if (occ !== OCC.EMPTY) continue;

        if (!signpostPlaced && hash % 101 === 0) {
          this.scenicProps.push({ key: 'signpost', x: x + 0.5, y: y + 0.5, scale: 0.72 });
          signpostPlaced = true;
          continue;
        }

        const mod = hash % 61;
        if (isArid) {
          if (mod === 2) this.scenicProps.push({ key: 'skull', x: x + 0.5, y: y + 0.5, scale: 0.78 });
          else if (mod === 11) this.scenicProps.push({ key: 'skeleton', x: x + 0.5, y: y + 0.5, scale: 1.05 });
          else if (mod === 23) this.scenicProps.push({ key: 'amber', x: x + 0.5, y: y + 0.5, scale: 0.7 });
          else if (mod === 37) this.scenicProps.push({ key: 'crystal', x: x + 0.5, y: y + 0.5, scale: 0.82 });
        } else {
          if (mod === 1) this.scenicProps.push({ key: 'fern', x: x + 0.5, y: y + 0.5, scale: 0.68 });
          else if (mod === 13) this.scenicProps.push({ key: 'flower_red', x: x + 0.5, y: y + 0.5, scale: 0.62 });
          else if (mod === 23) this.scenicProps.push({ key: 'fungus', x: x + 0.5, y: y + 0.5, scale: 0.58 });
          else if (mod === 41) this.scenicProps.push({ key: 'fallen_log', x: x + 0.5, y: y + 0.5, scale: 0.88 });
        }
      }
    }
  }

  clearTile(x, y) {
    if (!this.map) return;
    if (y >= 0 && y < this.map.height && x >= 0 && x < this.map.width) {
      if (this.map.collision[y][x] !== OCC.WATER) {
        this.map.tiles[y][x] = 0;
        this.map.collision[y][x] = OCC.EMPTY;
      }
    }
  }

  depleteTile(x, y, type) {
    if (!this.map) return;
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if (ty >= 0 && ty < this.map.height && tx >= 0 && tx < this.map.width) {
      this.map.tiles[ty][tx] = 0;
      this.map.collision[ty][tx] = OCC.EMPTY;
      this.depletedNodes.set(`${tx},${ty}`, type === 'wood' ? 'tree_stump' : 'stone_depleted');
    }
  }

  getFishingSpot() {
    if (this.map?.fishShoals?.length > 0) {
      const f = this.map.fishShoals[0];
      return { x: Math.max(1, f.x - 0.8), y: f.y + 0.5 };
    }
    const pier = this.scenicProps.find((p) => p.key === 'bld_fishing_pier');
    if (pier) return { x: pier.x, y: pier.y };
    return null;
  }

  isNearFishingLandmark(tx, ty) {
    if (this.map?.fishShoals?.some((f) => Math.hypot(f.x + 0.5 - tx, f.y + 0.5 - ty) < 2.1)) {
      return true;
    }
    return this.scenicProps.some(
      (p) => (p.key === 'bld_fishing_pier' || p.key === 'pond') && Math.hypot(p.x - tx, p.y - ty) < 1.8
    );
  }

  update(dt) {
    this.animTime += dt;
  }

  getTileKey(tileVal, occ, x, y) {
    if (occ === OCC.WATER) return 'tile_water';
    if (tileVal >= 3 && tileVal <= 28) return 'tile_dirt_trail';
    const hash = Math.abs((x * 19 + y * 37) % 5);
    return hash === 0 ? 'tile_grass_flowers' : 'tile_grass_pebbles';
  }

  renderBase(ctx, camera, hoveredTile, fogGrid = null, fogEnabled = false, diseaseClouds = []) {
    const hw = IsometricMath.HALF_WIDTH;
    const hh = IsometricMath.HALF_HEIGHT;

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

        const fogState = !fogEnabled || !fogGrid ? 2 : (fogGrid[y]?.[x] ?? 0);
        const tileType = this.map.tiles[y][x];
        const occ = this.map.collision[y][x];
        const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;
        this.drawBaseTile(ctx, screenPos.x, screenPos.y, camera.zoom, tileType, occ, isHovered, x, y, fogState);
      }
    }

    // Draw Disease Miasma Clouds (3x3 areas)
    if (diseaseClouds && diseaseClouds.length > 0) {
      const zHw = hw * camera.zoom;
      const zHh = hh * camera.zoom;
      for (const cloud of diseaseClouds) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const worldPos = IsometricMath.tileToWorld(cloud.x + dx + 0.5, cloud.y + dy + 0.5);
            const sp = camera.worldToScreen(worldPos.x, worldPos.y);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(sp.x, sp.y - zHh);
            ctx.lineTo(sp.x + zHw, sp.y);
            ctx.lineTo(sp.x, sp.y + zHh);
            ctx.lineTo(sp.x - zHw, sp.y);
            ctx.closePath();
            const pulse = 0.25 + Math.sin(this.animTime * 5 + dx + dy) * 0.1;
            ctx.fillStyle = `rgba(132, 204, 22, ${pulse})`;
            ctx.fill();
            ctx.restore();
          }
        }
      }
    }
  }

  drawBaseTile(ctx, sx, sy, zoom, tileType, occ, isHovered, x, y, fogState = 2) {
    const hw = IsometricMath.HALF_WIDTH * zoom;
    const hh = IsometricMath.HALF_HEIGHT * zoom;

    if (fogState === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx, sy - hh);
      ctx.lineTo(sx + hw, sy);
      ctx.lineTo(sx, sy + hh);
      ctx.lineTo(sx - hw, sy);
      ctx.closePath();
      ctx.fillStyle = '#090b0f';
      ctx.fill();
      ctx.restore();
      return;
    }

    const tileKey = this.getTileKey(tileType, occ, x, y);
    const img = this.assets ? this.assets.get(tileKey) : null;
    const spec = TILE_SPECS[tileKey];

    if (img && spec) {
      const scaleX = (IsometricMath.TILE_WIDTH * zoom * 1.035) / img.naturalWidth;
      const scaleY = (IsometricMath.TILE_HEIGHT * zoom * 1.035) / spec.diamondH;
      const drawW = img.naturalWidth * scaleX;
      const drawH = img.naturalHeight * scaleY;
      ctx.drawImage(img, sx - drawW / 2, sy - spec.centerY * scaleY, drawW, drawH);
      if (occ === OCC.WATER) {
        const wave = Math.sin(this.animTime * 2.8 + x * 0.9 + y * 0.7);
        if (wave > 0.2) {
          ctx.save();
          ctx.strokeStyle = `rgba(186, 230, 253, ${(wave - 0.2) * 0.42})`;
          ctx.lineWidth = Math.max(1, zoom);
          ctx.beginPath();
          ctx.moveTo(sx - 7 * zoom, sy);
          ctx.quadraticCurveTo(sx, sy - 2.2 * zoom, sx + 7 * zoom, sy);
          ctx.stroke();
          ctx.restore();
        }
      }
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx, sy - hh);
      ctx.lineTo(sx + hw, sy);
      ctx.lineTo(sx, sy + hh);
      ctx.lineTo(sx - hw, sy);
      ctx.closePath();
      ctx.fillStyle = occ === OCC.WATER ? '#1e40af' : this.biome.grassDark;
      ctx.fill();
      ctx.restore();
    }

    if (this.biome.tint && occ !== OCC.WATER) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx, sy - hh);
      ctx.lineTo(sx + hw, sy);
      ctx.lineTo(sx, sy + hh);
      ctx.lineTo(sx - hw, sy);
      ctx.closePath();
      ctx.fillStyle = this.biome.tint;
      ctx.fill();
      ctx.restore();
    }

    if (fogState === 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sx, sy - hh);
      ctx.lineTo(sx + hw, sy);
      ctx.lineTo(sx, sy + hh);
      ctx.lineTo(sx - hw, sy);
      ctx.closePath();
      ctx.fillStyle = 'rgba(10, 14, 18, 0.48)';
      ctx.fill();
      ctx.restore();
    }

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
  }

  appendRenderables(renderList, camera, fogGrid = null, fogEnabled = false) {
    const hw = IsometricMath.HALF_WIDTH;
    const hh = IsometricMath.HALF_HEIGHT;

    for (const prop of this.scenicProps) {
      const tx = Math.floor(prop.x);
      const ty = Math.floor(prop.y);
      if (fogEnabled && fogGrid && (fogGrid[ty]?.[tx] || 0) === 0) continue;

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

    for (const [keyCoord, propKey] of this.depletedNodes.entries()) {
      const [xs, ys] = keyCoord.split(',');
      const tx = Number(xs);
      const ty = Number(ys);
      if (fogEnabled && fogGrid && (fogGrid[ty]?.[tx] || 0) === 0) continue;

      const worldPos = IsometricMath.tileToWorld(tx + 0.5, ty + 0.5);
      const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
      renderList.push({
        sortKey: tx + ty + 1.0,
        draw: (ctx) => this.drawPropSprite(ctx, propKey, screenPos.x, screenPos.y, camera.zoom, 0.88)
      });
    }

    // Standing Trees (OCC.FOREST), Quarry Boulders (OCC.STONE) & Steep Cliffs
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (fogEnabled && fogGrid && (fogGrid[y]?.[x] || 0) === 0) continue;

        const occ = this.map.collision[y][x];
        if (occ !== OCC.FOREST && occ !== OCC.STONE) continue;

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
            if (occ === OCC.FOREST) {
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
