/**
 * Renderer2D — PixiJS renderer for the remaster. Projection follows the original engine
 * (rectangular grid, 3/4 top-down art): tile (col,row) → pixel (col*22, row*16) in original
 * space, scaled by SCALE for HD (88 x 64 px per tile). See docs/DECISIONS.md D-08.
 *
 * Entities with an HD sprite in assets/hd/manifest.json are drawn as sprites; everything else
 * falls back to placeholder shapes, so art can be delivered piece by piece (T25).
 */
import { Application, Container, Graphics, Matrix, Sprite, TilingSprite, type Texture } from 'pixi.js';
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
import { loadHdAssets, type HdSprite } from './hdAssets.js';

export const SCALE = 4;
export const TW = TILE_W * SCALE; // 88
export const TH = TILE_H * SCALE; // 64

const OCC_FOREST = -124;
const OCC_WATER = -125;
const OCC_BLOCKED = -126;
const OCC_SHORE = -127;
const OBJECT_REF_FIRST = -61;
const OBJECT_REF_LAST = -110;
/** Building types >= 12 are construction sites (their payload holds the target building type). */
const FIRST_SITE_TYPE = 12;
/** Snap instead of interpolating when an entity jumps further than this (px, HD). */
const TELEPORT_PX = TW * 3;

/** What the HUD/engine currently has selected — the renderer only draws it. */
export interface SelectionView {
  units: readonly number[];
  building: number;
}

export interface GhostView {
  kind: 'building' | 'rally' | 'unit-target';
  x: number;
  y: number;
  w: number;
  h: number;
  valid: boolean;
}

export interface RenderProviders {
  selection: () => SelectionView;
  /** Placement ghost for the hovered tile (null when not placing). */
  ghost: (tx: number, ty: number) => GhostView | null;
  /** Rally flag position when Call to Arms / Form Up is active. */
  rally: () => { x: number; y: number } | null;
}

interface Marker {
  x: number;
  y: number;
  color: number;
  born: number;
}

interface SpriteSpec {
  tex: Texture;
  x: number;
  y: number;
  sx: number;
  sy: number;
  rot?: number;
  tint?: number;
}

/** Either vector placeholder drawing or an HD sprite; both are depth-sorted together. */
interface Drawable {
  depth: number;
  draw?: (g: Graphics) => void;
  sprite?: SpriteSpec;
}

/** Adult villager on-screen height (HD px); a tile is 88 x 64. */
const UNIT_HEIGHT = 104;
const ENEMY_TINT = 0xb9a4d6;
const CHILD_SCALE = 0.66;
const TREE_HEIGHT = 230;
/** Animal type (animalHp/animalBoldness tables): 0 = boar, 1 = sabre-tooth tiger, 2 = harmless prey (unidentified). */
const ANIMAL_ART: Record<number, { id: string; height: number }> = {
  0: { id: 'ani_boar', height: 74 },
  1: { id: 'ani_tiger', height: 92 },
};
const ENEMY_CHIEF_ID = 51;
/** Engine direction (0=E..7=NE) → [dir5 frame index (S,SE,E,NE,N), mirrored]. */
const DIR_TO_FRAME: readonly [number, boolean][] = [
  [2, false],
  [1, false],
  [0, false],
  [1, true],
  [2, true],
  [3, true],
  [4, false],
  [3, false],
];

export class Renderer2D {
  readonly app = new Application();
  readonly camera: Camera;
  private readonly world = new Container();
  private readonly terrainLayer = new Graphics();
  private readonly entityLayer = new Container();
  private grassLayer: TilingSprite | null = null;
  private hd = new Map<string, HdSprite>();
  private gfxPool: Graphics[] = [];
  private spritePool: Sprite[] = [];
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
  private hover: { x: number; y: number } | null = null;
  private markers: Marker[] = [];
  private selectedUnits = new Set<number>();
  private selectedBuilding = 0;
  providers: RenderProviders = {
    selection: () => ({ units: [], building: 0 }),
    ghost: () => null,
    rally: () => null,
  };

  private constructor() {
    this.camera = new Camera(this.world);
  }

  /** `hdBaseUrl`: folder holding manifest.json (e.g. './hd/'); missing assets fall back to placeholders. */
  static async create(host: HTMLElement, hdBaseUrl?: string): Promise<Renderer2D> {
    const r = new Renderer2D();
    await r.app.init({ resizeTo: host, background: 0x1b140c, antialias: true, autoDensity: true, resolution: window.devicePixelRatio });
    if (hdBaseUrl) r.hd = await loadHdAssets(hdBaseUrl);
    host.appendChild(r.app.canvas);
    r.world.addChild(r.terrainLayer, r.entityLayer, r.overlayLayer);
    r.app.stage.addChild(r.world);
    r.camera.attach(r.app.canvas, () => ({ w: r.app.screen.width, h: r.app.screen.height }));
    r.camera.handlers.hover = (wx, wy) => {
      r.hover = { x: wx, y: wy };
    };
    r.app.ticker.add(() => r.frame());
    return r;
  }

  /** Asset ids that loaded successfully (for diagnostics / HUD). */
  get hdAssetIds(): string[] {
    return [...this.hd.keys()];
  }

  setWorld(view: WorldView, tickMs: number): void {
    this.view = view;
    this.setupGrass(view);
    this.tickMs = tickMs;
    this.terrainSig = '';
    this.markers = [];
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

  /** Move the hover/ghost to a world point (touch has no hover, so taps call this). */
  setHover(wx: number, wy: number): void {
    this.hover = { x: wx, y: wy };
  }

  /** Tile under a world point. */
  tileAt(wx: number, wy: number): { x: number; y: number } {
    return { x: Math.floor(wx / TW), y: Math.floor(wy / TH) };
  }

  /** World centre of a tile. */
  tileCenter(tx: number, ty: number): { x: number; y: number } {
    return { x: tx * TW + TW / 2, y: ty * TH + TH / 2 };
  }

  /** Unit (villager or enemy) drawn under a world point, using interpolated positions; 0 if none. */
  pickUnit(wx: number, wy: number): number {
    const v = this.view;
    if (!v) return 0;
    let best = 0;
    let bestD = TW * 0.55;
    for (let i = 1; i < UnitId.COUNT; i++) {
      if ((v.units.hp[i] ?? 0) <= 0) continue;
      if ((v.units.x[i] ?? 0) === 0 && (v.units.y[i] ?? 0) === 0) continue;
      const d = Math.hypot(this.currX[i]! - wx, this.currY[i]! - 24 - wy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  /** Short-lived ring where an order / placement happened. */
  flash(tx: number, ty: number, color: number = Colors.selection): void {
    const c = this.tileCenter(tx, ty);
    this.markers.push({ x: c.x, y: c.y + TH * 0.2, color, born: performance.now() });
  }

  focusUnit(id: number): void {
    if (!this.view || id <= 0) return;
    this.camera.centerOn(this.currX[id]!, this.currY[id]!);
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
    const sel = this.providers.selection();
    this.selectedUnits = new Set(sel.units);
    this.selectedBuilding = sel.building;
    this.drawEntities(v, alpha);
    this.drawOverlay(v);
  }

  private setupGrass(v: WorldView): void {
    const grass = this.hd.get('ter_grass');
    this.grassLayer?.destroy();
    this.grassLayer = null;
    if (!grass?.frames[0]) return;
    const tex = grass.frames[0];
    const t = new TilingSprite({ texture: tex, width: v.mapWidth * TW, height: v.mapHeight * TH });
    const s = (grass.worldSize ?? tex.width) / tex.width;
    t.tileScale.set(s);
    this.world.addChildAt(t, 0);
    this.grassLayer = t;
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
    const water = this.terrainFill('ter_water');
    const forest = this.terrainFill('ter_forest_floor');
    for (let y = 0; y < v.mapHeight; y++) {
      for (let x = 0; x < v.mapWidth; x++) {
        const occ = v.occupancy[y]?.[x] ?? 0;
        const tile = (v.terrain[y]?.[x] ?? 0) & 255;
        let color: number = (x + y) % 2 === 0 ? Colors.grass : Colors.grassAlt;
        let alpha = 1;
        if (occ === OCC_WATER) color = (tile & 1) === 0 ? Colors.water : Colors.waterDeep;
        else if (occ === OCC_SHORE) color = Colors.shore;
        else if (occ === OCC_FOREST) {
          color = Colors.forestFloor;
          if (this.grassLayer) alpha = 0.45; // darken the grass texture under trees
        } else if (occ === OCC_BLOCKED) color = tile >= 175 ? Colors.rockDark : Colors.rock;
        else if (this.grassLayer) continue; // plain grass: the HD texture shows through
        const textured = occ === OCC_WATER ? water : occ === OCC_FOREST ? forest : null;
        if (textured) g.rect(x * TW, y * TH, TW, TH).fill(textured);
        else g.rect(x * TW, y * TH, TW, TH).fill({ color, alpha });
      }
    }
  }

  /** World-space repeating texture fill for a terrain class, if that HD texture exists. */
  private terrainFill(id: string): { texture: Texture; textureSpace: 'global'; matrix: Matrix } | null {
    const art = this.hd.get(id);
    const tex = art?.frames[0];
    if (!art || !tex) return null;
    const sc = (art.worldSize ?? tex.width) / tex.width;
    return { texture: tex, textureSpace: 'global', matrix: new Matrix().scale(sc, sc) };
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
          const hash = (x * 7 + y * 13) % 5;
          const s = 0.85 + hash / 20;
          const treeArt = this.hd.get(((x * 31 + y * 17) & 3) === 0 ? 'nat_tree_conifer' : 'nat_tree_broadleaf') ?? this.hd.get('nat_tree_broadleaf');
          if (treeArt && treeArt.frames.length > 0) {
            const f = (x * 3 + y * 5) % treeArt.frames.length;
            const sc = (TREE_HEIGHT * s) / (treeArt.sizes[f]?.h ?? 1);
            const flip = (x + y) % 2 === 0 ? -1 : 1;
            list.push({ depth: base, sprite: { tex: treeArt.frames[f]!, x: cx, y: base + 6, sx: sc * flip, sy: sc } });
          } else {
            list.push({ depth: base, draw: (gg) => drawTree(gg, cx, base, s) });
          }
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
      const sel = this.selectedBuilding === b;
      const site = type >= FIRST_SITE_TYPE;
      const depth = (by + size.h) * TH;
      const art = site ? undefined : this.buildingArt(type, v.buildings.level[b] ?? 1);
      if (art) {
        const fw = art.sizes[0]?.w ?? 1;
        const scale = (size.w * TW * 1.04) / fw;
        const enemy = b > 30; // building slots 31..60 belong to the enemy tribe
        list.push({
          depth,
          sprite: { tex: art.frames[0]!, x: (bx + size.w / 2) * TW, y: (by + size.h) * TH - 6, sx: scale, sy: scale, ...(enemy ? { tint: ENEMY_TINT } : {}) },
        });
        const topY = (by + size.h) * TH - 6 - (art.sizes[0]?.h ?? 0) * scale;
        list.push({ depth: depth + 0.01, draw: (gg) => drawBuildingMarks(gg, bx * TW, by * TH, size.w * TW, size.h * TH, topY, hpFrac, sel) });
      } else {
        list.push({
          depth,
          draw: site
            ? (gg) => drawSite(gg, bx * TW, by * TH, size.w * TW, size.h * TH, hpFrac, sel)
            : (gg) => drawBuilding(gg, type, bx * TW, by * TH, size.w * TW, size.h * TH, hpFrac, sel),
        });
      }
    }

    for (let i = 0; i < MAX_ANIMALS; i++) {
      if ((v.animals.hp[i] ?? 0) <= 0) continue;
      const [x, y] = this.lerp(UnitId.COUNT + i, alpha);
      if (!inView(x / TW, y / TH)) continue;
      const type = v.animals.type[i] ?? 0;
      const spec = ANIMAL_ART[type];
      const art = spec ? this.hd.get(spec.id) : undefined;
      if (art && spec) {
        const k = UnitId.COUNT + i;
        const moving = Math.abs(this.currX[k]! - this.prevX[k]!) + Math.abs(this.currY[k]! - this.prevY[k]!) > 0.5;
        this.pushDirSprite(list, art, 1000 + i, x, y, v.animals.direction[i] ?? 2, spec.height, moving, undefined);
      } else {
        list.push({ depth: y, draw: (gg) => drawAnimal(gg, type, x, y, false) });
      }
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
      const sel = this.selectedUnits.has(i);
      const dir = v.units.direction[i] ?? 2;
      const pick = this.unitArt(i, child, (v.units.gender[i] ?? 0) === 1, i === chief);
      if (pick) {
        const moving = Math.abs(this.currX[i]! - this.prevX[i]!) + Math.abs(this.currY[i]! - this.prevY[i]!) > 0.5;
        list.push({ depth: y - 0.5, draw: (gg) => drawFootRing(gg, x, y, color, sel, child ? CHILD_SCALE : 1) });
        const top = this.pushDirSprite(list, pick.art, i, x, y, dir, UNIT_HEIGHT * pick.scale, moving, pick.tint);
        const crown = pick.crown;
        if (crown || hpFrac < 1) {
          list.push({
            depth: y + 0.01,
            draw: (gg) => {
              if (crown) drawCrown(gg, x, top - 4);
              if (hpFrac < 1) drawHp(gg, x, top - (crown ? 22 : 10), 40, hpFrac);
            },
          });
        }
      } else {
        list.push({ depth: y, draw: (gg) => drawUnit(gg, x, y, color, child, i === chief, dir, hpFrac, sel) });
      }
    }

    list.sort((a, b) => a.depth - b.depth);
    this.flush(list);
  }

  private buildingArt(type: number, level: number): HdSprite | undefined {
    const ids = ['bld_armoury', 'bld_gym', 'bld_hut', 'bld_chief_hut', 'bld_kitchen', 'bld_range', 'bld_store', 'bld_disco', 'bld_sanctuary', 'bld_pia', 'bld_nursery', 'bld_tower'];
    const base = ids[type];
    if (!base) return undefined;
    for (let l = level; l >= 1; l--) {
      const hit = this.hd.get(`${base}_l${l}`);
      if (hit) return hit;
    }
    return this.hd.get(base);
  }

  /**
   * Which HD art a unit uses. Specific art wins; otherwise fall back to the closest existing art
   * (enemy → tinted villager art, chief → villager + crown). Returns null → vector placeholder.
   */
  private unitArt(id: number, child: boolean, female: boolean, chief: boolean): { art: HdSprite; scale: number; tint?: number; crown: boolean } | null {
    const enemy = isEnemyUnit(id);
    const scale = child ? CHILD_SCALE : chief || id === ENEMY_CHIEF_ID ? 1.12 : 1;
    const own = (k: string): HdSprite | undefined => this.hd.get(k);
    const base = child ? own('chr_child') : female ? own('chr_villager_f') : own('chr_villager_m');
    if (enemy) {
      const specific = id === ENEMY_CHIEF_ID ? (own('chr_enemy_chief') ?? own('chr_enemy_m')) : child ? undefined : female ? own('chr_enemy_f') : own('chr_enemy_m');
      if (specific) return { art: specific, scale, crown: false };
      return base ? { art: base, scale, tint: ENEMY_TINT, crown: false } : null;
    }
    if (chief) {
      const c = own('chr_chief');
      if (c) return { art: c, scale, crown: false };
      return base ? { art: base, scale, crown: true } : null;
    }
    return base ? { art: base, scale, crown: false } : null;
  }

  /** Push a 5-direction sprite with "puppet" animation; returns the sprite's top y. */
  private pushDirSprite(list: Drawable[], art: HdSprite, seed: number, x: number, y: number, dir: number, height: number, moving: boolean, tint: number | undefined): number {
    const [frame, mirror] = DIR_TO_FRAME[((dir % 8) + 8) % 8] ?? [0, false];
    const tex = art.frames[frame] ?? art.frames[0]!;
    const maxH = Math.max(...art.sizes.map((s) => s.h));
    const scale = height / maxH;
    const now = performance.now() + seed * 137;
    // Until frame-by-frame sheets exist: bob + sway when walking, breathe when idle.
    const bob = moving ? Math.abs(Math.sin(now / 95)) * 5 : 0;
    const rot = moving ? Math.sin(now / 95) * 0.05 : 0;
    const breathe = moving ? 1 : 1 + Math.sin(now / 650) * 0.012;
    list.push({
      depth: y,
      sprite: { tex, x, y: y + 6 - bob, sx: mirror ? -scale : scale, sy: scale * breathe, rot, ...(tint !== undefined ? { tint } : {}) },
    });
    return y + 6 - bob - (art.sizes[frame]?.h ?? maxH) * scale;
  }

  /** Emit drawables in depth order, batching consecutive vector items into pooled Graphics. */
  private flush(list: Drawable[]): void {
    const layer = this.entityLayer;
    layer.removeChildren();
    let gi = 0;
    let si = 0;
    let current: Graphics | null = null;
    for (const d of list) {
      if (d.sprite) {
        current = null;
        let sp = this.spritePool[si];
        if (!sp) {
          sp = new Sprite();
          sp.anchor.set(0.5, 1);
          this.spritePool.push(sp);
        }
        si++;
        const s = d.sprite;
        sp.texture = s.tex;
        sp.position.set(s.x, s.y);
        sp.scale.set(s.sx, s.sy);
        sp.rotation = s.rot ?? 0;
        sp.tint = s.tint ?? 0xffffff;
        layer.addChild(sp);
      } else if (d.draw) {
        if (!current) {
          current = this.gfxPool[gi] ?? null;
          if (!current) {
            current = new Graphics();
            this.gfxPool.push(current);
          }
          gi++;
          current.clear();
          layer.addChild(current);
        }
        d.draw(current);
      }
    }
  }

  private drawOverlay(v: WorldView): void {
    const g = this.overlayLayer;
    g.clear();
    const now = performance.now();

    // Rally flag (Call to Arms / Form Up).
    const rally = this.providers.rally();
    if (rally) {
      const c = this.tileCenter(rally.x, rally.y);
      g.rect(c.x - 3, c.y - 90, 6, 90).fill(Colors.outline);
      const wave = Math.sin(now / 180) * 6;
      g.poly([c.x + 3, c.y - 90, c.x + 50, c.y - 78 + wave, c.x + 3, c.y - 62]).fill(0xd94141).stroke({ width: 2, color: Colors.outline });
    }

    // Hover tile / placement ghost.
    const h = this.hover ? this.tileAt(this.hover.x, this.hover.y) : null;
    if (h && h.x >= 0 && h.y >= 0 && h.x < v.mapWidth && h.y < v.mapHeight) {
      const ghost = this.providers.ghost(h.x, h.y);
      if (ghost) {
        const color = ghost.valid ? 0x58c75a : 0xd94141;
        g.rect(ghost.x * TW, ghost.y * TH, ghost.w * TW, ghost.h * TH).fill({ color, alpha: 0.28 }).stroke({ width: 3, color, alpha: 0.9 });
      } else {
        g.rect(h.x * TW + 2, h.y * TH + 2, TW - 4, TH - 4).stroke({ width: 2, color: 0xffffff, alpha: 0.35 });
      }
    }

    // Order markers: shrinking rings for 600 ms.
    this.markers = this.markers.filter((m) => now - m.born < 600);
    for (const m of this.markers) {
      const t = (now - m.born) / 600;
      g.ellipse(m.x, m.y, 40 * (1 - t) + 8, 15 * (1 - t) + 3).stroke({ width: 4, color: m.color, alpha: 1 - t });
    }

    // Drag-box.
    const box = this.camera.boxDraft;
    if (box) g.rect(box.x, box.y, box.w, box.h).fill({ color: 0xfff3a0, alpha: 0.12 }).stroke({ width: 2 / this.camera.zoom, color: 0xfff3a0 });
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

function drawFootRing(g: Graphics, x: number, y: number, team: number, selected: boolean, k = 1): void {
  g.ellipse(x, y + 2, 26 * k, 9 * k).fill({ color: Colors.shadow, alpha: 0.28 });
  g.ellipse(x, y + 2, 24 * k, 8 * k).stroke({ width: selected ? 4 : 2, color: selected ? Colors.selection : team, alpha: selected ? 1 : 0.8 });
}

function drawCrown(g: Graphics, x: number, y: number): void {
  g.poly([x - 16, y, x - 16, y - 14, x - 8, y - 6, x, y - 18, x + 8, y - 6, x + 16, y - 14, x + 16, y]).fill(Colors.chief).stroke({ width: 2, color: Colors.outline });
}

function drawBuildingMarks(g: Graphics, x: number, y: number, w: number, h: number, topY: number, hpFrac: number, selected: boolean): void {
  if (selected) g.rect(x + 2, y + 2, w - 4, h - 4).stroke({ width: 3, color: Colors.selection });
  if (hpFrac < 1) drawHp(g, x + w / 2, topY - 10, Math.min(80, w - 16), hpFrac);
}

function drawSite(g: Graphics, x: number, y: number, w: number, h: number, progress: number, selected: boolean): void {
  const inset = 8;
  g.rect(x + inset, y + inset, w - inset * 2, h - inset * 2).fill({ color: 0x8a6a45, alpha: 0.55 }).stroke({ width: 3, color: Colors.outline });
  // scaffold poles rising with build progress
  const poleH = 20 + 90 * progress;
  for (const px of [x + inset + 6, x + w - inset - 6]) {
    for (const py of [y + h * 0.45, y + h - inset - 4]) g.rect(px - 3, py - poleH, 6, poleH).fill(0x6b4423);
  }
  g.rect(x + inset, y + h * 0.45 - poleH, w - inset * 2, 6).fill(0x6b4423);
  g.rect(x + inset, y + h - inset - 4 - poleH, w - inset * 2, 6).fill(0x6b4423);
  if (selected) g.rect(x + 2, y + 2, w - 4, h - 4).stroke({ width: 3, color: Colors.selection });
  drawHp(g, x + w / 2, y + h * 0.45 - poleH - 14, Math.min(80, w - 16), progress);
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
