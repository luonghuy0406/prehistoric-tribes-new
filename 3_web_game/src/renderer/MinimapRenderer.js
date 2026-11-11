/**
 * MinimapRenderer.js — Bản đồ thu nhỏ trực quan chuẩn góc nghiêng Isometric.
 * Hỗ trợ hiển thị địa hình, Sương mù chiến tranh (Fog of War), Làng ta, Làng địch, Thú dữ, và Click/Drag để lia Camera.
 */
import { IsometricMath } from '../core/IsometricMath.js';
import { OCC } from '../loaders/BinaryMapLoader.js';

export class MinimapRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.transform = { cx: 100, top: 8, scale: 1.5, mapW: 64, mapH: 48 };
    this.terrainCache = null;
    this.cachedKey = '';
  }

  computeTransform(mapData) {
    if (!this.canvas || !mapData) return this.transform;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const mapW = mapData.width || 64;
    const mapH = mapData.height || 48;

    const spanX = mapW + mapH;
    const spanY = (mapW + mapH) * 0.52;
    const scale = Math.min((cw - 14) / spanX, (ch - 14) / spanY);
    const totalIsoH = (mapW + mapH) * 0.52 * scale;
    const cx = cw * 0.5 + ((mapH - mapW) * 0.5) * scale;
    const top = (ch - totalIsoH) * 0.5;

    this.transform = { cx, top, scale, mapW, mapH };
    return this.transform;
  }

  tileToMinimap(tx, ty) {
    const { cx, top, scale } = this.transform;
    return {
      x: cx + (tx - ty) * scale,
      y: top + (tx + ty) * (scale * 0.52)
    };
  }

  minimapToTile(mx, my) {
    const { cx, top, scale, mapW, mapH } = this.transform;
    const a = (mx - cx) / scale;
    const b = (my - top) / (scale * 0.52);
    const tx = Math.max(0, Math.min(mapW - 1, (a + b) * 0.5));
    const ty = Math.max(0, Math.min(mapH - 1, (b - a) * 0.5));
    return { tx, ty };
  }

  invalidateTerrain() {
    this.cachedKey = '';
    this.terrainCache = null;
  }

  render(state) {
    if (!this.canvas || !this.ctx || !state?.mapData) return;
    const { mapData, buildings, villagers, animals, traps, camera, fogGrid, fogEnabled, diseaseClouds } = state;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.computeTransform(mapData);

    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, cw, ch);

    // 1. Draw Isometric Terrain Pixels (Downsampled cleanly to 2x2 step for crisp 60fps performance)
    const step = mapData.width > 72 || mapData.height > 72 ? 2 : 1;
    const dotSize = Math.max(1.5, this.transform.scale * step * 1.15);

    for (let y = 0; y < mapData.height; y += step) {
      for (let x = 0; x < mapData.width; x += step) {
        const explored = !fogEnabled || !fogGrid || fogGrid[y]?.[x] > 0;
        const visible = !fogEnabled || !fogGrid || fogGrid[y]?.[x] === 2;

        if (!explored) {
          continue;
        }

        const occ = mapData.collision[y][x];
        let color = '#3b5a2f';
        if (occ === OCC.WATER) color = '#1d4ed8';
        else if (occ === OCC.FOREST) color = '#166534';
        else if (occ === OCC.STONE) color = '#94a3b8';
        else if (occ === OCC.BERRY || occ === OCC.HERB) color = '#db2777';
        else if (occ === OCC.BLOCKED) color = '#57534e';

        const p = this.tileToMinimap(x, y);
        ctx.globalAlpha = visible ? 1.0 : 0.45;
        ctx.fillStyle = color;
        ctx.fillRect(p.x - dotSize * 0.5, p.y - dotSize * 0.5, dotSize, dotSize);
      }
    }
    ctx.globalAlpha = 1.0;

    // 2. Disease Clouds
    if (diseaseClouds) {
      for (const c of diseaseClouds) {
        const p = this.tileToMinimap(c.x, c.y);
        ctx.fillStyle = 'rgba(132, 204, 22, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Buildings (Friendly vs Enemy)
    for (const b of buildings) {
      const bx = b.x + b.width * 0.5;
      const by = b.y + b.height * 0.5;
      const tx = Math.floor(bx);
      const ty = Math.floor(by);
      if (fogEnabled && fogGrid && b.owner === 'enemy' && (fogGrid[ty]?.[tx] || 0) === 0) continue;

      const p = this.tileToMinimap(bx, by);
      const sz = Math.max(3, Math.min(7, (b.width + b.height) * 0.75));
      ctx.fillStyle = b.owner === 'enemy' ? '#ef4444' : (b.type === 'chiefs_hut' ? '#facc15' : '#22c55e');
      ctx.fillRect(p.x - sz * 0.5, p.y - sz * 0.5, sz, sz);
      if (b.selected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x - sz * 0.5 - 1, p.y - sz * 0.5 - 1, sz + 2, sz + 2);
      }
    }

    // 4. Revealed Traps
    if (traps) {
      for (const t of traps) {
        if (t.isSprung || (t.owner === 'enemy' && !t.isRevealed)) continue;
        const p = this.tileToMinimap(t.x, t.y);
        ctx.fillStyle = t.owner === 'enemy' ? '#f97316' : '#eab308';
        ctx.fillRect(p.x - 1, p.y - 1, 2.5, 2.5);
      }
    }

    // 5. Animals (only in explored/visible tiles)
    for (const a of animals) {
      if (a.health <= 0) continue;
      const tx = Math.floor(a.x);
      const ty = Math.floor(a.y);
      if (fogEnabled && fogGrid && (fogGrid[ty]?.[tx] || 0) < 2) continue;
      const p = this.tileToMinimap(a.x, a.y);
      ctx.fillStyle = a.type === 'tiger' ? '#fb923c' : '#d6d3d1';
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 2.5, 2.5);
    }

    // 6. Units (Player villagers + visible Enemies)
    for (const v of villagers) {
      if (v.health <= 0) continue;
      const tx = Math.floor(v.x);
      const ty = Math.floor(v.y);
      if (v.isEnemy) {
        if (v.isStealthed) continue;
        if (fogEnabled && fogGrid && (fogGrid[ty]?.[tx] || 0) < 2) continue;
      }
      const p = this.tileToMinimap(v.x, v.y);
      ctx.fillStyle = v.isEnemy ? '#f87171' : v.isChief ? '#fde047' : v.isWarrior ? '#38bdf8' : '#86efac';
      ctx.beginPath();
      ctx.arc(p.x, p.y, v.isChief ? 2.6 : 1.9, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Camera Viewport Box
    if (camera) {
      const topLeftW = camera.screenToWorld(0, 0);
      const bottomRightW = camera.screenToWorld(camera.viewportWidth, camera.viewportHeight);
      const topLeftT = IsometricMath.worldToTile(topLeftW.x, topLeftW.y);
      const topRightW = camera.screenToWorld(camera.viewportWidth, 0);
      const topRightT = IsometricMath.worldToTile(topRightW.x, topRightW.y);
      const botLeftW = camera.screenToWorld(0, camera.viewportHeight);
      const botLeftT = IsometricMath.worldToTile(botLeftW.x, botLeftW.y);
      const botRightT = IsometricMath.worldToTile(bottomRightW.x, bottomRightW.y);

      const p1 = this.tileToMinimap(topLeftT.tx, topLeftT.ty);
      const p2 = this.tileToMinimap(topRightT.tx, topRightT.ty);
      const p3 = this.tileToMinimap(botRightT.tx, botRightT.ty);
      const p4 = this.tileToMinimap(botLeftT.tx, botLeftT.ty);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
}
