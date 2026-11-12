/**
 * Renderer2D — PixiJS renderer for the remaster. Projection follows the original engine
 * (rectangular grid, 3/4 top-down art): tile (col,row) → pixel (col*22, row*16) in original
 * space, scaled by SCALE for HD (88 x 64 px per tile). See docs/DECISIONS.md D-08.
 *
 * v1 draws placeholder shapes; T25 swaps in HD sprites through the asset manifest.
 */
import { Application, Container, Graphics } from 'pixi.js';
import {
  isEnemyUnit,
  MAX_ANIMALS,
  MAX_BUILDINGS,
  Stat,
  TILE_H,
  TILE_W,
  Tribe,
  UnitId,
  type WorldView,
} from '@pt3d/engine-adapter';
import { AnimalColors, BuildingStyle, Colors, ObjectColors } from './palette.js';
import { Camera } from './camera.js';

export const SCALE = 4;
export const TW = TILE_W * SCALE; // 88
export const TH = TILE_H * SCALE; // 64

const OCC_FOREST = -124;
const OCC_WATER = -125;
const OCC_BLOCKED = -126;
const OCC_SHORE = -127;
const OBJECT_REF_FIRST = -61;
const OBJECT_REF_LAST = -110;
/** Snap instead of interpolating when an entity jumps further than this (px, HD). */
const TELEPORT_PX = TW * 3;

export interface Selection {
  kind: 'unit' | 'building' | 'animal' | 'tile';
  id: number;
  tileX: number;
  tileY: number;
}

interface Drawable {
  depth: number;
  draw: (g: Graphics) => void;
}

export class Renderer2D {
  readonly app = new Application();
  readonly camera: Camera;
  private readonly world = new Container();
  private readonly terrainLayer = new Graphics();
  private readonly entityLayer = new Graphics();
  private readonly overlayLayer = new Graphics();
  private view: WorldView | null = null;
  private terrainSig = '';
  private lastTickAt = 0;
  private tickMs = 120;
  // Interpolation buffers (HD pixel positions) for units [0..100] and animals [101..122].
  private prevX = new Float32Array(UnitId.COUNT + MAX_ANIMALS);
  private prevY = new Float32Array(UnitId.COUNT + MAX_ANIMALS);
  private currX = new Float32Array(UnitId.COUNT + MAX_ANIMALS);
  private currY = new Float32Array(UnitId.COUNT + MAX_ANIMALS);
  private selected: Selection | null = null;
  private hoverTile: { x: number; y: number } | null = null;
  onSelect: ((sel: Selection | null) => void) | null = null;

  private constructor() {
    this.camera = new Camera(this.world);
  }

  static async create(host: HTMLElement): Promise<Renderer2D> {
    const r = new Renderer2D();
    await r.app.init({ resizeTo: host, background: 0x1b140c, antialias: true, autoDensity: true, resolution: window.devicePixelRatio });
    host.appendChild(r.app.canvas);
    r.world.addChild(r.terrainLayer, r.entityLayer, r.overlayLayer);
    r.app.stage.addChild(r.world);
    r.camera.attach(r.app.canvas, () => ({ w: r.app.screen.width, h: r.app.screen.height }));
    r.camera.onClick = (wx, wy) => r.pick(wx, wy);
    r.camera.onHover = (wx, wy) => {
      r.hoverTile = { x: Math.floor(wx / TW), y: Math.floor(wy / TH) };
    };
    r.app.ticker.add(() => r.frame());
    return r;
  }

  setWorld(view: WorldView, tickMs: number): void {
    this.view = view;
    this.tickMs = tickMs;
    this.terrainSig = '';
    this.selected = null;
    this.camera.setBounds(view.mapWidth * TW, view.mapHeight * TH);
    this.captureTick(true);
    const chief = view.tribeStats[Tribe.PLAYER]?.[Stat.CHIEF] ?? 0;
    const focus = chief > 0 && (view.units.hp[chief] ?? 0) > 0 ? chief : this.firstAlive(UnitId.FIRST_VILLAGER, UnitId.LAST_VILLAGER);
    if (focus > 0) this.camera.centerOn(this.currX[focus]!, this.currY[focus]!);
    else this.camera.centerOn((view.mapWidth * TW) / 2, (view.mapHeight * TH) / 2);
  }

  /** Call after every simulation tick. */
  onTick(): void {
    this.captureTick(false);
  }

  getSelection(): Selection | null {
    return this.selected;
  }

  destroy(): void {
    this.camera.detach();
    this.app.destroy(true, { children: true });
  }

  // ---------------------------------------------------------------------------

  private firstAlive(from: number, to: number): number {
    const v = this.view;
    if (!v) return 0;
    for (let i = from; i <= to; i++) if ((v.units.hp[i] ?? 0) > 0) return i;
    return 0;
  }

  private captureTick(snap: boolean): void {
    const v = this.view;
    if (!v) return;
    this.prevX.set(this.currX);
    this.prevY.set(this.currY);
    const u = v.units;
    for (let i = 1; i < UnitId.COUNT; i++) {
      this.currX[i] = ((u.x[i] ?? 0) * TILE_W + (u.offsetX[i] ?? 0)) * SCALE + TW / 2;
      this.currY[i] = ((u.y[i] ?? 0) * TILE_H + (u.offsetY[i] ?? 0)) * SCALE + TH / 2;
    }
    const a = v.animals;
    for (let i = 0; i < MAX_ANIMALS; i++) {
      const k = UnitId.COUNT + i;
      this.currX[k] = ((a.x[i] ?? 0) * TILE_W + (a.offsetX[i] ?? 0)) * SCALE + TW / 2;
      this.currY[k] = ((a.y[i] ?? 0) * TILE_H + (a.offsetY[i] ?? 0)) * SCALE + TH / 2;
    }
    if (snap) {
      this.prevX.set(this.currX);
      this.prevY.set(this.currY);
    }
    this.lastTickAt = performance.now();
  }

  private lerp(k: number, alpha: number): [number, number] {
    const px = this.prevX[k]!;
    const py = this.prevY[k]!;
    const cx = this.currX[k]!;
    const cy = this.currY[k]!;
    if (Math.abs(cx - px) > TELEPORT_PX || Math.abs(cy - py) > TELEPORT_PX) return [cx, cy];
    return [px + (cx - px) * alpha, py + (cy - py) * alpha];
  }

  private frame(): void {
    const v = this.view;
    if (!v) return;
    this.camera.update(this.app.ticker.deltaMS);
    this.rebuildTerrainIfChanged(v);
    const alpha = Math.min(1, (performance.now() - this.lastTickAt) / this.tickMs);
    this.drawEntities(v, alpha);
    this.drawOverlay(v);
  }

  /** Terrain only changes when trees are cut / water is filled; rebuild when the class grid changes. */
  private rebuildTerrainIfChanged(v: WorldView): void {
    let h = 2166136261;
    for (let y = 0; y < v.mapHeight; y++) {
      const row = v.occupancy[y];
      if (!row) continue;
      for (let x = 0; x < v.mapWidth; x++) {
        const o = row[x] ?? 0;
        if (o <= OCC_FOREST) h = Math.imul(h ^ (o + y * 7 + x * 13), 16777619);
      }
    }
    const sig = `${v.level}:${v.mapWidth}x${v.mapHeight}:${h >>> 0}`;
    if (sig === this.terrainSig) return;
    this.terrainSig = sig;
    const g = this.terrainLayer;
    g.clear();
    for (let y = 0; y < v.mapHeight; y++) {
      for (let x = 0; x < v.mapWidth; x++) {
        const occ = v.occupancy[y]?.[x] ?? 0;
        const tile = (v.terrain[y]?.[x] ?? 0) & 255;
        let color: number = (x + y) % 2 === 0 ? Colors.grass : Colors.grassAlt;
        if (occ === OCC_WATER) color = (tile & 1) === 0 ? Colors.water : Colors.waterDeep;
        else if (occ === OCC_SHORE) color = Colors.shore;
        else if (occ === OCC_FOREST) color = Colors.forestFloor;
        else if (occ === OCC_BLOCKED) color = tile >= 175 ? Colors.rockDark : Colors.rock;
        g.rect(x * TW, y * TH, TW, TH).fill(color);
      }
    }
  }

  private visibleTileRect(): { x0: number; y0: number; x1: number; y1: number } {
    const r = this.camera.visibleWorldRect();
    return {
      x0: Math.floor(r.x / TW) - 2,
      y0: Math.floor(r.y / TH) - 2,
      x1: Math.ceil((r.x + r.w) / TW) + 2,
      y1: Math.ceil((r.y + r.h) / TH) + 6, // tall sprites below the screen can reach up into view
    };
  }

  private drawEntities(v: WorldView, alpha: number): void {
    const g = this.entityLayer;
    g.clear();
    const vis = this.visibleTileRect();
    const inView = (tx: number, ty: number): boolean => tx >= vis.x0 && tx <= vis.x1 && ty >= vis.y0 && ty <= vis.y1;
    const list: Drawable[] = [];

    // Trees (forest tiles) and map objects come straight from the occupancy grid.
    for (let y = Math.max(0, vis.y0); y < Math.min(v.mapHeight, vis.y1); y++) {
      const row = v.occupancy[y];
      if (!row) continue;
      for (let x = Math.max(0, vis.x0); x < Math.min(v.mapWidth, vis.x1); x++) {
        const occ = row[x] ?? 0;
        if (occ === OCC_FOREST) {
          const cx = x * TW + TW / 2;
          const base = y * TH + TH * 0.8;
          const s = 0.85 + (((x * 7 + y * 13) % 5) / 20);
          list.push({ depth: base, draw: (gg) => drawTree(gg, cx, base, s) });
        } else if (occ <= OBJECT_REF_FIRST && occ >= OBJECT_REF_LAST) {
          const slot = OBJECT_REF_FIRST - occ;
          const kind = v.objects.type[slot] ?? 0;
          const cx = x * TW + TW / 2;
          const base = y * TH + TH * 0.75;
          list.push({ depth: base, draw: (gg) => drawObject(gg, kind, cx, base) });
        }
      }
    }

    for (let b = 1; b < MAX_BUILDINGS; b++) {
      if ((v.buildings.hp[b] ?? 0) <= 0) continue;
      const bx = v.buildings.x[b] ?? 0;
      const by = v.buildings.y[b] ?? 0;
      const size = footprint(v, b, bx, by);
      if (!inView(bx + size.w, by + size.h) && !inView(bx, by)) continue;
      const type = v.buildings.type[b] ?? 0;
      const hpFrac = (v.buildings.hp[b] ?? 0) / Math.max(1, v.buildings.maxHp[b] ?? 1);
      const sel = this.selected?.kind === 'building' && this.selected.id === b;
      list.push({
        depth: (by + size.h) * TH,
        draw: (gg) => drawBuilding(gg, type, bx * TW, by * TH, size.w * TW, size.h * TH, hpFrac, sel),
      });
    }

    for (let i = 0; i < MAX_ANIMALS; i++) {
      if ((v.animals.hp[i] ?? 0) <= 0) continue;
      const [x, y] = this.lerp(UnitId.COUNT + i, alpha);
      if (!inView(x / TW, y / TH)) continue;
      const type = v.animals.type[i] ?? 0;
      const sel = this.selected?.kind === 'animal' && this.selected.id === i;
      list.push({ depth: y, draw: (gg) => drawAnimal(gg, type, x, y, sel) });
    }

    const chief = v.tribeStats[Tribe.PLAYER]?.[Stat.CHIEF] ?? 0;
    for (let i = 1; i < UnitId.COUNT; i++) {
      if ((v.units.hp[i] ?? 0) <= 0) continue;
      if ((v.units.x[i] ?? 0) === 0 && (v.units.y[i] ?? 0) === 0) continue;
      const [x, y] = this.lerp(i, alpha);
      if (!inView(x / TW, y / TH)) continue;
      const child = (v.units.age[i] ?? 20) < 12;
      const hpFrac = (v.units.hp[i] ?? 0) / Math.max(1, v.units.maxHp[i] ?? 1);
      const color = isEnemyUnit(i) ? Colors.enemy : Colors.player;
      const sel = this.selected?.kind === 'unit' && this.selected.id === i;
      const dir = v.units.direction[i] ?? 2;
      list.push({ depth: y, draw: (gg) => drawUnit(gg, x, y, color, child, i === chief, dir, hpFrac, sel) });
    }

    list.sort((a, b) => a.depth - b.depth);
    for (const d of list) d.draw(g);
  }

  private drawOverlay(v: WorldView): void {
    const g = this.overlayLayer;
    g.clear();
    const h = this.hoverTile;
    if (h && h.x >= 0 && h.y >= 0 && h.x < v.mapWidth && h.y < v.mapHeight) {
      g.rect(h.x * TW + 2, h.y * TH + 2, TW - 4, TH - 4).stroke({ width: 2, color: 0xffffff, alpha: 0.35 });
    }
  }

  private pick(wx: number, wy: number): void {
    const v = this.view;
    if (!v) return;
    let best: Selection | null = null;
    let bestD = TW * 0.6;
    for (let i = 1; i < UnitId.COUNT; i++) {
      if ((v.units.hp[i] ?? 0) <= 0) continue;
      const d = Math.hypot(this.currX[i]! - wx, this.currY[i]! - 20 - wy);
      if (d < bestD) {
        bestD = d;
        best = { kind: 'unit', id: i, tileX: v.units.x[i] ?? 0, tileY: v.units.y[i] ?? 0 };
      }
    }
    for (let i = 0; i < MAX_ANIMALS && !best; i++) {
      if ((v.animals.hp[i] ?? 0) <= 0) continue;
      const k = UnitId.COUNT + i;
      if (Math.hypot(this.currX[k]! - wx, this.currY[k]! - 16 - wy) < TW * 0.6) {
        best = { kind: 'animal', id: i, tileX: v.animals.x[i] ?? 0, tileY: v.animals.y[i] ?? 0 };
      }
    }
    const tx = Math.floor(wx / TW);
    const ty = Math.floor(wy / TH);
    if (!best) {
      const occ = v.occupancy[ty]?.[tx] ?? 0;
      if (occ < 0 && occ > OBJECT_REF_FIRST) best = { kind: 'building', id: -occ, tileX: tx, tileY: ty };
      else best = { kind: 'tile', id: occ, tileX: tx, tileY: ty };
    }
    this.selected = best;
    this.onSelect?.(best);
  }
}

// --- footprint ---------------------------------------------------------------

const footprintCache = new Map<string, { w: number; h: number }>();

/** Building size in tiles, measured from the occupancy grid (cells hold -buildingId). */
function footprint(v: WorldView, b: number, bx: number, by: number): { w: number; h: number } {
  const key = `${b}:${bx}:${by}:${v.buildings.type[b]}:${v.buildings.level[b]}`;
  const hit = footprintCache.get(key);
  if (hit) return hit;
  let w = 0;
  while ((v.occupancy[by]?.[bx + w] ?? 0) === -b && w < 8) w++;
  let h = 0;
  while ((v.occupancy[by + h]?.[bx] ?? 0) === -b && h < 8) h++;
  const size = { w: Math.max(1, w), h: Math.max(1, h) };
  if (w > 0 && h > 0) footprintCache.set(key, size);
  return size;
}

// --- placeholder drawing -----------------------------------------------------

function drawTree(g: Graphics, cx: number, base: number, s: number): void {
  g.ellipse(cx, base, 26 * s, 9 * s).fill({ color: Colors.shadow, alpha: 0.2 });
  g.rect(cx - 6 * s, base - 40 * s, 12 * s, 40 * s).fill(Colors.trunk);
  g.circle(cx, base - 70 * s, 34 * s).fill(Colors.treeCanopy).stroke({ width: 3, color: Colors.outline });
  g.circle(cx - 10 * s, base - 80 * s, 14 * s).fill({ color: Colors.treeCanopyLight, alpha: 0.8 });
}

function drawObject(g: Graphics, kind: number, cx: number, base: number): void {
  const color = ObjectColors[kind] ?? 0xffffff;
  g.ellipse(cx, base, 24, 8).fill({ color: Colors.shadow, alpha: 0.2 });
  if (kind === 5) {
    g.ellipse(cx, base - 6, 26, 10).stroke({ width: 3, color: 0xffffff, alpha: 0.7 });
    return;
  }
  g.circle(cx, base - 18, 22).fill(color).stroke({ width: 3, color: Colors.outline });
}

function drawBuilding(
  g: Graphics,
  type: number,
  x: number,
  y: number,
  w: number,
  h: number,
  hpFrac: number,
  selected: boolean,
): void {
  const st = BuildingStyle[type] ?? { wall: 0x888888, roof: 0x555555, height: 60 };
  const inset = 8;
  const top = y + inset - st.height;
  g.rect(x + inset, y + h - 10, w - inset * 2, 14).fill({ color: Colors.shadow, alpha: 0.25 });
  // front wall
  g.rect(x + inset, y + h * 0.35, w - inset * 2, h * 0.65 - inset).fill(st.wall).stroke({ width: 3, color: Colors.outline });
  // roof block rising above the footprint
  g.roundRect(x + inset / 2, top + h * 0.35, w - inset, st.height, 14).fill(st.roof).stroke({ width: 3, color: Colors.outline });
  // door
  g.roundRect(x + w / 2 - 12, y + h - inset - 34, 24, 34, 10).fill(Colors.outline);
  if (selected) g.rect(x + 2, y + 2, w - 4, h - 4).stroke({ width: 3, color: Colors.selection });
  if (hpFrac < 1) drawHp(g, x + w / 2, top + h * 0.35 - 12, Math.min(80, w - 16), hpFrac);
}

function drawAnimal(g: Graphics, type: number, x: number, y: number, selected: boolean): void {
  const color = AnimalColors[type % AnimalColors.length] ?? 0x7a4e2a;
  g.ellipse(x, y, 30, 10).fill({ color: Colors.shadow, alpha: 0.25 });
  g.ellipse(x, y - 18, 30, 16).fill(color).stroke({ width: 3, color: Colors.outline });
  g.circle(x + 24, y - 24, 10).fill(color).stroke({ width: 3, color: Colors.outline });
  if (selected) g.ellipse(x, y, 36, 13).stroke({ width: 3, color: Colors.selection });
}

/** Engine direction 0=E,1=SE,2=S,3=SW,4=W,5=NW,6=N,7=NE (y grows south). */
const DIR_DX = [1, 0.7, 0, -0.7, -1, -0.7, 0, 0.7];
const DIR_DY = [0, 0.7, 1, 0.7, 0, -0.7, -1, -0.7];

function drawUnit(
  g: Graphics,
  x: number,
  y: number,
  color: number,
  child: boolean,
  chief: boolean,
  dir: number,
  hpFrac: number,
  selected: boolean,
): void {
  const s = child ? 0.65 : 1;
  if (selected) g.ellipse(x, y, 24 * s, 9 * s).stroke({ width: 3, color: Colors.selection });
  g.ellipse(x, y, 18 * s, 6 * s).fill({ color: Colors.shadow, alpha: 0.3 });
  g.roundRect(x - 11 * s, y - 34 * s, 22 * s, 30 * s, 8 * s).fill(color).stroke({ width: 3, color: Colors.outline });
  g.circle(x, y - 46 * s, 13 * s).fill(0xe0b48a).stroke({ width: 3, color: Colors.outline });
  if (chief) g.rect(x - 14, y - 64, 28, 8).fill(Colors.chief).stroke({ width: 2, color: Colors.outline });
  const d = ((dir % 8) + 8) % 8;
  g.circle(x + (DIR_DX[d] ?? 0) * 8 * s, y - 46 * s + (DIR_DY[d] ?? 0) * 4 * s, 3 * s).fill(Colors.outline);
  if (hpFrac < 1) drawHp(g, x, y - 70 * s, 36, hpFrac);
}

function drawHp(g: Graphics, cx: number, y: number, w: number, frac: number): void {
  g.rect(cx - w / 2, y, w, 6).fill(Colors.outline);
  g.rect(cx - w / 2 + 1, y + 1, (w - 2) * Math.max(0, frac), 4).fill(frac > 0.4 ? Colors.hpGood : Colors.hpBad);
}
