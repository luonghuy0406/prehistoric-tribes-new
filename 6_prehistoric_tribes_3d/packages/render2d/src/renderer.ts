/**
 * Renderer2D — PixiJS renderer for the remaster. Projection follows the original engine
 * (rectangular grid, 3/4 top-down art): tile (col,row) → pixel (col*22, row*16) in original
 * space, scaled by SCALE for HD (88 x 64 px per tile). See docs/DECISIONS.md D-08.
 *
 * Entities with an HD sprite in assets/hd/manifest.json are drawn as sprites; everything else
 * falls back to placeholder shapes, so art can be delivered piece by piece (T25).
 */
import { Application, Container, Graphics, Matrix, Sprite, Texture, TilingSprite } from 'pixi.js';
import {
  Fog,
  fogAt,
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
/** Among BLOCKED tiles, terrain ids up to this are lake water (deep + shoreline); above are cliffs. */
const WATER_TILE_MAX = 60;
const OBJECT_REF_FIRST = -61;
const OBJECT_REF_LAST = -110;
/** Building types >= 12 are construction sites (their payload holds the target building type). */
const FIRST_SITE_TYPE = 12;
/** Snap instead of interpolating when an entity jumps further than this (px, HD). */
const TELEPORT_PX = TW * 3;

/** Context cursors the renderer picks from what is under the pointer and what is selected. */
export type CursorKind = 'default' | 'go' | 'attack' | 'gather' | 'build' | 'forbidden';

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
  /** Horizontal skew (radians) — used for walk/work poses. */
  kx?: number;
  alpha?: number;
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
/**
 * Static map objects (kind = map tile 174 + n; ids 1-4 are inferred from the art list and the job list,
 * 5 = fish shoal has no art yet, 6 = carcass, 7 = bones). `w`/`h` = target on-screen size in HD px;
 * frames are 3 depletion states (full → half → nearly gone).
 */
const OBJECT_ART: Record<number, { id: string; w?: number; h?: number }> = {
  1: { id: 'nat_berrybush', h: 96 },
  2: { id: 'nat_plants', w: TW * 1.15 },
  3: { id: 'nat_rock_quarry', w: TW * 1.5 },
  4: { id: 'nat_bones', w: TW * 1.15 },
  6: { id: 'ani_boar_carcass', w: TW * 1.5 },
  7: { id: 'nat_bones', w: TW * 1.15 },
};
/** Engine job ids (`JOB_NAMES`): swing-type work, bending work, other. */
const SWING_JOBS = new Set([2, 3, 5, 8, 12]);
const BEND_JOBS = new Set([1, 6, 7]);
/** dir5 frame index → name used in the `<char>@walk_<dir>` strips. */
const DIR_NAMES = ['S', 'SE', 'E', 'NE', 'N'] as const;
/** Thought-bubble art per engine `emote` id (see world.ts). `sad` flips the smiley upside down into a frown. */
const EMOTE_ART: Record<number, { id: string; sad?: boolean; tint?: number }> = {
  0: { id: 'emote_hungry' },
  1: { id: 'emote_love' },
  2: { id: 'emote_tired' },
  4: { id: 'emote_mood', sad: true, tint: 0x8a96c8 },
  5: { id: 'emote_mood', sad: true },
  7: { id: 'emote_mood' },
  8: { id: 'emote_mood' },
  9: { id: 'emote_home' },
  11: { id: 'emote_music' },
  12: { id: 'emote_music' },
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
  /** Feathered terrain layers (forest floor, rock, shore, water) blended over the grass. */
  private blendLayers: { tile: TilingSprite; mask: Sprite }[] = [];
  private hd = new Map<string, HdSprite>();
  private gfxPool: Graphics[] = [];
  private spritePool: Sprite[] = [];
  private readonly fogLayer = new Graphics();
  private readonly overlayLayer = new Graphics();
  /** Draw fog of war (the original hides unexplored land; orders into it only walk there). */
  fogEnabled = true;
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
  /** CSS `cursor` value per kind (set by the app from its UI skin); kinds without an entry are left alone. */
  cursors: Partial<Record<CursorKind, string>> = {};
  private cursorKind: CursorKind | null = null;
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
    r.world.addChild(r.terrainLayer, r.entityLayer, r.fogLayer, r.overlayLayer);
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
      if (isEnemyUnit(i) && this.hidden(v, v.units.x[i] ?? 0, v.units.y[i] ?? 0, true)) continue;
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
    this.updateCursor(v);
    this.drawEntities(v, alpha);
    this.drawFog(v);
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
    this.clearBlend();
    // Classes drawn as feathered HD layers (skipped in the flat pass below).
    const blended: { cls: number; ok: (t: number) => boolean }[] = [];
    if (this.grassLayer) {
      // "Blocked" mixes cliffs and deep lakes; terrain ids <= 60 are lake interior/shoreline (6-8 deep,
      // 25-60 edges), >= 135 are cliffs/rocks (read from the Great Lake map, see NOTES).
      const defs: [number, string, (t: number) => boolean, number?][] = [
        [OCC_FOREST, 'ter_forest_floor', () => true],
        [OCC_BLOCKED, 'ter_rock', (t) => t > WATER_TILE_MAX],
        [OCC_SHORE, 'ter_shore', () => true],
        [OCC_WATER, 'ter_water', () => true],
        [OCC_BLOCKED, 'ter_water', (t) => t <= WATER_TILE_MAX, 0xa8c0e0],
      ];
      for (const [occCls, texId, ok, tint] of defs) {
        if (this.buildBlend(v, occCls, texId, ok, tint)) blended.push({ cls: occCls, ok });
      }
    }
    const water = this.terrainFill('ter_water');
    const forest = this.terrainFill('ter_forest_floor');
    for (let y = 0; y < v.mapHeight; y++) {
      for (let x = 0; x < v.mapWidth; x++) {
        const occ = v.occupancy[y]?.[x] ?? 0;
        const tile = (v.terrain[y]?.[x] ?? 0) & 255;
        if (blended.some((b) => b.cls === occ && b.ok(tile))) continue;
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

  private clearBlend(): void {
    for (const b of this.blendLayers) {
      b.tile.destroy();
      b.mask.destroy(true);
    }
    this.blendLayers = [];
  }

  /**
   * Draw one terrain class as a tiling HD texture masked by a feathered per-tile map, so its border
   * blends into the grass instead of showing square tiles. Returns false when the texture is missing
   * or the class is absent.
   */
  private buildBlend(v: WorldView, cls: number, texId: string, ok: (tile: number) => boolean, tint?: number): boolean {
    const art = this.hd.get(texId);
    const tex = art?.frames[0];
    if (!art || !tex) return false;
    const S = 8; // mask pixels per tile
    const w = v.mapWidth * S;
    const h = v.mapHeight * S;
    const a = document.createElement('canvas');
    a.width = w;
    a.height = h;
    const ctx = a.getContext('2d');
    if (!ctx) return false;
    ctx.fillStyle = '#fff';
    let any = false;
    for (let y = 0; y < v.mapHeight; y++) {
      for (let x = 0; x < v.mapWidth; x++) {
        if ((v.occupancy[y]?.[x] ?? 0) === cls && ok((v.terrain[y]?.[x] ?? 0) & 255)) {
          ctx.fillRect(x * S, y * S, S, S);
          any = true;
        }
      }
    }
    if (!any) return false;
    // Feather: repeated down/up-scaling blurs the mask (works everywhere, unlike ctx.filter); then
    // add the mask to itself so the core stays solid and only the border is soft.
    const small = document.createElement('canvas');
    small.width = Math.max(1, w >> 2);
    small.height = Math.max(1, h >> 2);
    const sctx = small.getContext('2d');
    if (!sctx) return false;
    for (let i = 0; i < 2; i++) {
      sctx.clearRect(0, 0, small.width, small.height);
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(a, 0, 0, small.width, small.height);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(small, 0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(a, 0, 0);
    const mask = new Sprite(Texture.from(a));
    mask.width = v.mapWidth * TW;
    mask.height = v.mapHeight * TH;
    const tile = new TilingSprite({ texture: tex, width: v.mapWidth * TW, height: v.mapHeight * TH });
    const sc = (art.worldSize ?? tex.width) / tex.width;
    tile.tileScale.set(sc);
    tile.mask = mask;
    if (tint !== undefined) tile.tint = tint;
    const index = (this.grassLayer ? 1 : 0) + this.blendLayers.length;
    this.world.addChildAt(tile, index);
    this.world.addChild(mask);
    this.blendLayers.push({ tile, mask });
    return true;
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
        if ((occ === OCC_FOREST || occ <= OBJECT_REF_FIRST) && this.hidden(v, x, y, false)) continue;
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
          const spec = this.objectSprite(kind, v.objects.stage[slot] ?? 3);
          if (spec) list.push({ depth: base, sprite: { tex: spec.tex, x: cx, y: base + 4, sx: spec.scale, sy: spec.scale } });
          else list.push({ depth: base, draw: (gg) => drawObject(gg, kind, cx, base) });
        }
      }
    }

    for (let b = 1; b < MAX_BUILDINGS; b++) {
      if ((v.buildings.hp[b] ?? 0) <= 0) continue;
      const bx = v.buildings.x[b] ?? 0;
      const by = v.buildings.y[b] ?? 0;
      const size = footprint(v, b, bx, by);
      if (!inView(bx + size.w, by + size.h) && !inView(bx, by)) continue;
      if (this.hidden(v, bx, by, false) && this.hidden(v, bx + size.w - 1, by + size.h - 1, false)) continue;
      const type = v.buildings.type[b] ?? 0;
      const hpFrac = (v.buildings.hp[b] ?? 0) / Math.max(1, v.buildings.maxHp[b] ?? 1);
      const sel = this.selectedBuilding === b;
      const site = type >= FIRST_SITE_TYPE;
      const depth = (by + size.h) * TH;
      const art = site ? this.siteArt(size.w * size.h, hpFrac) : this.buildingArt(type, v.buildings.level[b] ?? 1);
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
      if (this.hidden(v, v.animals.x[i] ?? 0, v.animals.y[i] ?? 0, true)) continue;
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
      const animRaw = v.units.animation[i] ?? 0;
      const dying = (v.units.hp[i] ?? 0) <= 0 && ((animRaw & 255) === 43 || (animRaw & 255) === 44);
      if ((v.units.hp[i] ?? 0) <= 0 && !dying) continue;
      if ((v.units.x[i] ?? 0) === 0 && (v.units.y[i] ?? 0) === 0) continue;
      const [x, y] = this.lerp(i, alpha);
      if (!inView(x / TW, y / TH)) continue;
      if (isEnemyUnit(i) && this.hidden(v, v.units.x[i] ?? 0, v.units.y[i] ?? 0, true)) continue;
      const child = (v.units.age[i] ?? 20) < 12;
      const hpFrac = (v.units.hp[i] ?? 0) / Math.max(1, v.units.maxHp[i] ?? 1);
      const color = isEnemyUnit(i) ? Colors.enemy : Colors.player;
      const sel = this.selectedUnits.has(i);
      const dir = v.units.direction[i] ?? 2;
      const pick = this.unitArt(i, child, (v.units.gender[i] ?? 0) === 1, i === chief);
      if (pick) {
        const moving = Math.abs(this.currX[i]! - this.prevX[i]!) + Math.abs(this.currY[i]! - this.prevY[i]!) > 0.5;
        const ctx = this.poseContext(v, i, animRaw, moving);
        const lying = ctx.kind === 'sleep' || ctx.kind === 'die';
        if (!lying) list.push({ depth: y - 0.5, draw: (gg) => drawFootRing(gg, x, y, color, sel, child ? CHILD_SCALE : 1) });
        else list.push({ depth: y - 0.5, draw: (gg) => gg.ellipse(x, y + 2, 34, 11).fill({ color: Colors.shadow, alpha: 0.28 }) });
        const framed = i === chief ? this.poseFrame('chr_chief@', ctx, dir, performance.now() + i * 137, v.units.job[i] ?? 0) : null;
        let top: number;
        if (framed) {
          // Real frames carry the motion themselves; only scale (to the standing height) and anchor at the feet.
          const sc = (UNIT_HEIGHT * pick.scale) / framed.ref;
          const col = pick.tint;
          list.push({
            depth: y,
            sprite: { tex: framed.tex, x, y: y + 6, sx: framed.mirror ? -sc : sc, sy: sc, ...(col !== undefined ? { tint: col } : {}) },
          });
          top = y + 6 - framed.h * sc;
        } else {
          top = this.pushDirSprite(list, pick.art, i, x, y, dir, UNIT_HEIGHT * pick.scale, moving, pick.tint, v.units.job[i] ?? 0, ctx);
        }
        const crown = pick.crown;
        if (!dying && (crown || hpFrac < 1)) {
          list.push({
            depth: y + 0.01,
            draw: (gg) => {
              if (crown) drawCrown(gg, x, top - 4);
              if (hpFrac < 1) drawHp(gg, x, top - (crown ? 22 : 10), 40, hpFrac);
            },
          });
        }
        const emote = v.units.emote?.[i] ?? -1;
        if (!dying && emote >= 0 && !lying) this.pushEmote(list, emote, x, top);
      } else {
        list.push({ depth: y, draw: (gg) => drawUnit(gg, x, y, color, child, i === chief, dir, hpFrac, sel) });
      }
    }

    list.sort((a, b) => a.depth - b.depth);
    this.flush(list);
  }

  /** Sprite + scale for a static map object in its depletion state, or null → placeholder. */
  private objectSprite(kind: number, stage: number): { tex: Texture; scale: number } | null {
    const spec = OBJECT_ART[kind];
    const art = spec ? this.hd.get(spec.id) : undefined;
    if (!spec || !art || art.frames.length === 0) return null;
    // engine stage 3/2 = plenty left, 1 = low, 0 = nearly gone
    const f = Math.min(stage >= 2 ? 0 : stage === 1 ? 1 : 2, art.frames.length - 1);
    const size = art.sizes[f] ?? { w: 1, h: 1 };
    const scale = spec.w ? spec.w / size.w : (spec.h ?? 80) / size.h;
    return { tex: art.frames[f]!, scale };
  }

  /** Construction-site art: plot while early, wooden frame later; picked by footprint area. */
  private siteArt(area: number, progress: number): HdSprite | undefined {
    const id = progress < 0.34 ? (area <= 4 ? 'bld_site_s_plot' : 'bld_site_m_plot') : area <= 9 ? 'bld_site_m_frame' : 'bld_site_l_frame';
    return this.hd.get(id) ?? this.hd.get('bld_site_m_frame') ?? this.hd.get('bld_site_m_plot');
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

  /** Push a 5-direction sprite with code-driven "puppet" animation; returns the sprite's top y. */
  private pushDirSprite(list: Drawable[], art: HdSprite, seed: number, x: number, y: number, dir: number, height: number, moving: boolean, tint: number | undefined, job = 0, ctx?: PoseCtx): number {
    const [frame, mirror0] = DIR_TO_FRAME[((dir % 8) + 8) % 8] ?? [0, false];
    const tex = art.frames[frame] ?? art.frames[0]!;
    const maxH = Math.max(...art.sizes.map((s) => s.h));
    const scale = height / maxH;
    const c: PoseCtx = ctx ?? { kind: moving ? 'walk' : 'stand', anim: 0, phase: -1, moving, gloom: 0, hidden: false, act: 'other' };
    const p = poseFor(performance.now() + seed * 137, c, job);
    const mirror = mirror0 !== (p.flip ?? false);
    // Facing of the lunge/stroke follows the screen-space look direction.
    const side = mirror0 ? -1 : 1;
    const col = p.tint !== undefined ? (tint !== undefined ? mulTint(tint, p.tint) : p.tint) : tint;
    list.push({
      depth: y,
      sprite: {
        tex,
        x: x + p.dx * side * scale * 100,
        y: y + 6 - p.dy,
        sx: (mirror ? -scale : scale) * p.sx,
        sy: scale * p.sy,
        rot: p.rot * side,
        kx: p.kx * side,
        ...(col !== undefined ? { tint: col } : {}),
        ...(p.alpha !== undefined ? { alpha: p.alpha } : {}),
      },
    });
    return y + 6 - p.dy - (art.sizes[frame]?.h ?? maxH) * scale;
  }

  /**
   * Frame-by-frame HD art for a character (`<base>@<pose>` anim strips from tools/slice_chief.py), chosen from the
   * pose kind and the engine's own animation progress. Returns null when the strips are missing or the pose has no art,
   * so the caller falls back to the dir5 sprite + code-driven pose.
   */
  private poseFrame(base: string, c: PoseCtx, dir: number, now: number, job: number): { tex: Texture; w: number; h: number; ref: number; mirror: boolean } | null {
    const [fi, mirror] = DIR_TO_FRAME[((dir % 8) + 8) % 8] ?? [0, false];
    const dn = DIR_NAMES[fi] ?? 'S';
    const side = fi === 0 || fi === 4; // facing the viewer / away: profile strips fall back to "no mirror"
    const get = (...names: string[]): HdSprite | undefined => {
      for (const n of names) {
        const a = this.hd.get(`${base}${n}`);
        if (a) return a;
      }
      return undefined;
    };
    const pick = (art: HdSprite | undefined, idx: number, mir = mirror): { tex: Texture; w: number; h: number; ref: number; mirror: boolean } | null => {
      if (!art || art.frames.length === 0) return null;
      const i = ((Math.floor(idx) % art.frames.length) + art.frames.length) % art.frames.length;
      const size = art.sizes[i] ?? { w: 1, h: 1 };
      return { tex: art.frames[i]!, w: size.w, h: size.h, ref: art.ref ?? size.h, mirror: mir };
    };
    /** Frame index from the engine's own progress through the animation (time-based when unknown). */
    const prog = (art: HdSprite | undefined): number => {
      const n = art?.frames.length ?? 1;
      return c.phase >= 0 ? Math.min(n - 1, Math.floor(c.phase * n)) : Math.floor(now / 160);
    };
    /** Strip for this exact facing (`<pose>_<SE>` …) before the generic fallbacks. */
    const dget = (pose: string, ...fallbacks: string[]): HdSprite | undefined => get(`${pose}_${dn}`, ...fallbacks);
    const exact = (pose: string): boolean => this.hd.has(`${base}${pose}_${dn}`);
    const stand = (): ReturnType<typeof pick> => {
      const own = get(`stand_${dn}`);
      if (own) return pick(own, 0);
      return dn === 'S' ? pick(get('look'), 1, false) : pick(get(`walk_${dn}`), 1);
    };
    switch (c.kind) {
      case 'walk':
      case 'run': {
        const ms = c.kind === 'run' ? 70 : 105;
        return pick(get(`walk_${dn}`), now / ms);
      }
      case 'carry': {
        const art = exact('carry') ? dget('carry') : side ? undefined : get('carry_E');
        return pick(art ?? get(`walk_${dn}`), now / 125);
      }
      case 'sneak': {
        const art = exact('sneak') ? dget('sneak') : side ? undefined : get('sneak_E');
        return pick(art ?? get(`walk_${dn}`), now / 150);
      }
      case 'stand':
        if (c.gloom >= 0.5 && dn === 'S') return pick(get('sad'), now / 700, false);
        return stand();
      case 'fidget': {
        if (dn !== 'S') return stand();
        const a = c.anim & 255;
        const art = a === 16 || a === 17 ? get('fidget') : get('look');
        return pick(art, prog(art), false);
      }
      case 'hide': {
        const art = get('hide_S');
        return art ? pick(art, art.frames.length - 2, false) : null; // fully hidden crouch
      }
      case 'unhide': {
        const art = get('hide_S');
        return art ? pick(art, art.frames.length - 1 - prog(art), false) : null;
      }
      case 'sit': {
        const a = c.anim & 255;
        const dn3 = get('sit_down');
        if (a === 115) return pick(dn3, prog(dn3), false);
        if (a === 116) return pick(dn3, (dn3?.frames.length ?? 1) - 1 - prog(dn3), false);
        return pick(get('sit_rest'), now / 900, false);
      }
      case 'eat': {
        // anim 86 = eating on the opposite side of the table: seen in profile when an `eat_E` strip exists
        const prof = (c.anim & 255) === 86 || !side ? get('eat_E') : undefined;
        return prof ? pick(prof, now / 320, mirror) : pick(get('eat'), now / 320, false);
      }
      case 'sleep':
        return pick(get('sleep'), now / 900, false);
      case 'dance':
        return pick(get('dance'), now / 240, false);
      case 'attack':
      case 'power': {
        const art = side ? dget('melee', 'melee_S', 'melee_E') : dget('melee', 'melee_E');
        return pick(art, prog(art), side ? false : mirror);
      }
      case 'throw': {
        const art = dget('throw', 'throw_E');
        return pick(art, prog(art), side ? false : mirror);
      }
      case 'work': {
        const prof = side ? false : mirror;
        const stoop = (): ReturnType<typeof pick> => pick(get('gather_S'), (Math.sin(now / 520) + 1) * 1.49, false);
        switch (c.act) {
          case 'chop': return pick(dget('chop', 'chop_E', 'work_E'), now / 165, prof);
          case 'mine': return pick(dget('mine', 'mine_E', 'work_E'), now / 175, prof);
          case 'build': return pick(dget('build', 'build_E', 'work_E'), now / 190, prof);
          case 'forage': return pick(dget('forage', 'forage_S', 'gather_S'), (Math.sin(now / 520) + 1) * 1.49, exact('forage') ? mirror : false);
          case 'butcher': return pick(dget('butcher', 'butcher_E'), now / 230, prof) ?? stoop();
          case 'gatherLow': return stoop();
          default: return BEND_JOBS.has(job) ? stoop() : pick(get('work_E'), now / 175, prof);
        }
      }
      case 'drop': {
        const art = side ? get('putdown_S', 'gather_S') : get('putdown_E', 'putdown_S', 'gather_S');
        return pick(art, prog(art), side ? false : mirror);
      }
      case 'cook':
        return pick(get('cook_S'), now / 260, false);
      case 'fish': {
        const art = dget('fish', 'fish_E');
        if (!art) return null;
        const a = c.anim & 255; // 141 cast, 142/144 wait, 143 reel, 145/146 catch
        const idx = a === 141 ? 0 : a === 143 ? 1 : a === 142 || a === 144 ? 1 + (Math.floor(now / 500) & 1) : a === 145 || a === 146 ? art.frames.length - 1 : 0;
        return pick(art, idx, side ? false : mirror);
      }
      case 'chat':
        return pick(get('chat_S'), now / 380, false) ?? stand();
      case 'trapped':
        return pick(get('trapped_S'), now / 120, false);
      case 'stagger': {
        const art = !side && get('stagger_E') ? get('stagger_E') : get('stagger');
        return pick(art, prog(art), !side && get('stagger_E') ? mirror : false);
      }
      case 'die': {
        const art = get('die');
        return pick(art, prog(art), false);
      }
      default:
        return stand();
    }
  }

  /** Build the pose context for a unit from engine state (animation id/frame, mood, needs, stealth). */
  private poseContext(v: WorldView, i: number, animRaw: number, moving: boolean): PoseCtx {
    const u = v.units;
    const anim = animRaw & 255;
    let kind = poseKindOf(anim);
    // The engine keeps walk ids while a unit waits a tick; trust real movement for locomotion.
    if (moving && (kind === 'stand' || kind === 'fidget')) kind = (u.cargoType?.[i] ?? 0) > 0 ? 'carry' : 'walk';
    if (!moving && (kind === 'walk' || kind === 'carry' || kind === 'sneak' || kind === 'run')) kind = 'stand';
    const frames = Math.max(1, ANIM_FRAMES[anim] ?? 1);
    const af = u.animationFrame?.[i];
    const phase = af === undefined ? -1 : clamp01(Math.max(0, af) / frames);
    const happy = u.happiness[i] ?? 100;
    const food = u.food[i] ?? 100;
    const energy = u.energy[i] ?? 100;
    const gloom = Math.max(clamp01((28 - happy) / 28), clamp01((14 - food) / 14), clamp01((14 - energy) / 14));
    const hidden = ((u.flags[i] ?? 0) & 2) > 0; // camouflaged (any unit with scouting skill > 3 hides when idle and unseen)
    if (hidden && !moving && (kind === 'stand' || kind === 'fidget')) kind = 'hide';
    if (hidden && moving && kind === 'walk') kind = 'sneak';
    return { kind, anim, phase, moving, gloom, hidden, act: workActOf(u.task[i] ?? 0) };
  }

  /** Thought bubble above a unit (engine `emote`): hunger / tired / love / homeless / music / mood faces. */
  private pushEmote(list: Drawable[], emote: number, x: number, topY: number): void {
    const spec = EMOTE_ART[emote];
    if (!spec) return;
    const art = this.hd.get(spec.id);
    const tex = art?.frames[0];
    if (!tex) return;
    const t = performance.now();
    const by = topY - 30 + Math.sin(t / 420 + emote) * 2.5;
    const R = 22;
    list.push({
      depth: topY + 100000, // always on top of units
      draw: (g) => {
        g.ellipse(x, by, R + 2, R).fill(0xfff6df).stroke({ width: 3, color: Colors.outline });
        g.poly([x - 6, by + R - 2, x + 3, by + R - 2, x - 1, by + R + 9]).fill(0xfff6df).stroke({ width: 2, color: Colors.outline });
        g.rect(x - 4, by + R - 5, 8, 4).fill(0xfff6df);
      },
    });
    const sz = 34;
    const sc = sz / Math.max(tex.width, tex.height);
    list.push({ depth: topY + 100001, sprite: { tex, x, y: by + sz / 2, sx: sc, sy: spec.sad ? -sc : sc, ...(spec.tint !== undefined ? { tint: spec.tint } : {}) } });
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
        sp.skew.x = s.kx ?? 0;
        sp.alpha = s.alpha ?? 1;
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

  private drawFog(v: WorldView): void {
    const g = this.fogLayer;
    g.clear();
    if (!this.fogEnabled) return;
    const vis = this.visibleTileRect();
    for (let y = Math.max(0, vis.y0); y < Math.min(v.mapHeight, vis.y1); y++) {
      for (let x = Math.max(0, vis.x0); x < Math.min(v.mapWidth, vis.x1); x++) {
        const f = fogAt(v, x, y);
        if (f === Fog.VISIBLE) continue;
        g.rect(x * TW, y * TH, TW, TH).fill({ color: 0x0d0904, alpha: f === Fog.UNEXPLORED ? 0.94 : 0.42 });
      }
    }
  }

  /** Pick the pointer cursor: placing → build/forbidden; with a selection → attack (enemy/animal), gather (tree/resource) or go. */
  private updateCursor(v: WorldView): void {
    const h = this.hover;
    if (!h) return;
    const t = this.tileAt(h.x, h.y);
    const ghost = this.providers.ghost(t.x, t.y);
    let kind: CursorKind = 'default';
    if (ghost) {
      kind = ghost.kind === 'building' ? (ghost.valid ? 'build' : 'forbidden') : 'go';
    } else if (this.selectedUnits.size > 0) {
      kind = 'go';
      const unit = this.pickUnit(h.x, h.y);
      if (unit > 0 && isEnemyUnit(unit)) kind = 'attack';
      else if (!this.hidden(v, t.x, t.y, false)) {
        const occ = v.occupancy[t.y]?.[t.x] ?? 0;
        let animal = false;
        for (let i = 0; i < MAX_ANIMALS && !animal; i++) animal = (v.animals.hp[i] ?? 0) > 0 && v.animals.x[i] === t.x && v.animals.y[i] === t.y;
        if (animal) kind = 'attack';
        else if (occ === OCC_FOREST || (occ <= OBJECT_REF_FIRST && occ >= OBJECT_REF_LAST)) kind = 'gather';
      }
    }
    if (kind === this.cursorKind) return;
    const css = this.cursors[kind];
    if (!css) return;
    this.cursorKind = kind;
    this.app.canvas.style.cursor = css;
  }

  /** Is this tile hidden from the player (for hiding enemies/animals/objects)? */
  private hidden(v: WorldView, tx: number, ty: number, needVisible: boolean): boolean {
    if (!this.fogEnabled) return false;
    const f = fogAt(v, tx, ty);
    return needVisible ? f !== Fog.VISIBLE : f === Fog.UNEXPLORED;
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

/** Multiply two 0xRRGGBB tints. */
function mulTint(a: number, b: number): number {
  const r = (((a >> 16) & 255) * ((b >> 16) & 255)) / 255;
  const g = (((a >> 8) & 255) * ((b >> 8) & 255)) / 255;
  const bl = ((a & 255) * (b & 255)) / 255;
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(bl);
}

// --- animation ---------------------------------------------------------------
// The original engine drives every unit with one animation id (`units.animation`, a signed byte: ids
// 128..161 arrive as negatives, so always use `id & 255`). Each id has a frame count and the current
// frame is `units.animationFrame`. docs/07_ANIMATION_STATES.md lists all of them; here they are
// grouped into pose kinds, and each kind gets a code-driven pose until HD frame sheets exist.

/** Frame counts per animation id (sprites.json `animationFrameCount`). */
const ANIM_FRAMES: readonly number[] = [4,4,3,3,4,2,4,4,1,1,1,1,1,1,1,4,8,6,4,1,6,2,14,2,4,6,5,4,5,6,5,9,8,6,1,6,5,5,4,8,2,2,10,9,10,5,9,6,5,9,8,9,5,3,3,4,4,15,17,19,19,9,9,9,9,2,2,11,11,4,4,4,4,42,52,7,9,13,11,9,7,6,12,12,12,19,19,13,13,5,5,11,11,11,11,11,13,13,14,13,8,36,11,13,16,16,22,37,18,27,22,8,10,12,8,13,13,30,11,11,11,11,5,5,28,8,6,4,6,10,4,4,8,6,6,11,4,4,11,6,27,4,10,4,10,6,6,14,7,5,5,39,32,26,5,10,10,9,9,2,4,6];

export type PoseKind =
  | 'stand' | 'fidget' | 'walk' | 'carry' | 'sneak' | 'run'
  | 'work' | 'drop' | 'attack' | 'power' | 'throw' | 'stagger' | 'die'
  | 'dance' | 'sleep' | 'sit' | 'eat' | 'cook' | 'fish' | 'cast' | 'play' | 'trapped' | 'chat' | 'alarmed' | 'hide' | 'unhide';

/** What a worker is doing while in the generic `work` pose (animation 21 is shared by every gather/chop/mine task). */
export type WorkAct = 'chop' | 'mine' | 'build' | 'forage' | 'gatherLow' | 'butcher' | 'other';

/** Engine task id (enum `U`) → work activity. */
function workActOf(task: number): WorkAct {
  switch (task) {
    case 11: return 'chop';
    case 14: return 'mine';
    case 53: case 56: case 76: return 'build'; // FORGE_TRAP, BUILD, REPAIR (hammer, animations 53/54)
    case 10: case 15: return 'forage'; // berries, plants
    case 16: return 'gatherLow'; // bones
    case 12: return 'butcher';
    default: return 'other';
  }
}

/** Animation id (0..161) → pose kind. Ids inside buildings (slot animations 55-70, 75-80, 87-90, 94-103, 111-112, 118-124) fall back to `stand`. */
export function poseKindOf(anim: number): PoseKind {
  const a = anim & 255;
  if (a === 0 || a === 6 || a === 126) return 'walk';
  if (a === 1) return 'carry';
  if (a === 5) return 'sneak';
  if (a === 7) return 'run';
  if (a >= 15 && a <= 18) return 'fidget';
  if (a <= 14 || a === 19 || a === 20) return 'stand';
  if (a === 21 || a === 53 || a === 54) return 'work';
  if (a === 22) return 'drop';
  if (a >= 31 && a <= 33) return 'power';
  if (a >= 23 && a <= 30) return 'attack';
  if (a >= 34 && a <= 38) return 'throw';
  if (a >= 91 && a <= 93) return 'throw';
  if (a === 39 || a === 73 || a === 74 || a === 104 || a === 117) return 'dance';
  if (a === 40 || a === 41) return 'sleep';
  if (a === 42) return 'stagger';
  if (a === 43 || a === 44) return 'die';
  if (a >= 45 && a <= 52) return 'play';
  if (a === 85 || a === 86) return 'eat';
  if (a >= 81 && a <= 84) return 'cook';
  if (a === 46 || a === 105 || a === 140) return 'cast';
  if (a >= 106 && a <= 110) return 'trapped';
  if (a >= 113 && a <= 116) return 'sit';
  if (a >= 141 && a <= 146) return 'fish';
  if (a === 155 || a === 156) return 'chat';
  if (a === 161) return 'alarmed';
  if (a === 149) return 'hide';
  if (a === 150) return 'unhide';
  if (a === 147 || a === 148 || a === 154) return 'drop';
  return 'stand';
}

/** What the pose code needs to know about a unit. */
interface PoseCtx {
  kind: PoseKind;
  anim: number;
  /** 0..1 progress through the current animation (from `animationFrame`), or -1 when unknown. */
  phase: number;
  moving: boolean;
  /** 0..1: how worn-out the unit looks (unhappy / hungry / tired). */
  gloom: number;
  hidden: boolean;
  /** Activity inside the shared `work` animation (from the unit's task). */
  act: WorkAct;
}

interface Pose {
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  rot: number;
  kx: number;
  /** Mirror the sprite (looking the other way). */
  flip?: boolean;
  /** Multiply the sprite colour (hit flash, tired grey). */
  tint?: number;
  alpha?: number;
}

const ease = (t: number): number => 1 - (1 - t) * (1 - t);
const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * Code-driven pose. All motion is rooted at the feet (sprites are anchored bottom-centre).
 * `dx` is a forward lunge in 1/100 sprite-scale px. `now` is ms; `ph` is the original animation
 * progress when the engine reports it (keeps hits in sync with the sim), else a time-based cycle.
 */
function poseFor(now: number, c: PoseCtx, job: number): Pose {
  const P: Pose = { dx: 0, dy: 0, sx: 1, sy: 1, rot: 0, kx: 0 };
  const cyc = (period: number): number => (now % period) / period;
  const ph = c.phase >= 0 ? c.phase : cyc(700);
  const slump = c.gloom;
  switch (c.kind) {
    case 'walk':
    case 'run':
    case 'carry':
    case 'sneak': {
      const run = c.kind === 'run';
      const speed = (run ? 62 : c.kind === 'carry' ? 105 : c.kind === 'sneak' ? 130 : 95) * (1 + slump * 0.45);
      const k = Math.sin(now / speed);
      const hop = (run ? 9 : c.kind === 'sneak' ? 2.5 : 6) * (1 - slump * 0.4);
      P.dy = Math.abs(k) * hop;
      P.rot = k * (run ? 0.07 : 0.05) + (run ? 0.09 : c.kind === 'carry' ? 0.06 : 0) + slump * 0.05;
      P.kx = Math.cos(now / speed) * (run ? 0.07 : 0.04);
      P.sy = 1 + Math.cos((now / speed) * 2) * 0.022 - (c.kind === 'sneak' ? 0.12 : 0) - slump * 0.03;
      P.sx = 1 - Math.cos((now / speed) * 2) * 0.014 + (c.kind === 'sneak' ? 0.05 : 0);
      if (c.kind === 'sneak') P.alpha = 0.7;
      if (run) P.dx = 0.1;
      break;
    }
    case 'fidget': {
      // look around / shuffle: slow sway, turn to look the other way in the second half
      P.kx = Math.sin(ph * Math.PI * 2) * 0.05;
      P.rot = Math.sin(ph * Math.PI * 2) * 0.025;
      P.flip = ph > 0.5 && (c.anim & 255) !== 15;
      P.sy = 1 + Math.sin(now / 650) * 0.012;
      P.dy = (c.anim & 255) === 17 ? Math.max(0, Math.sin(ph * Math.PI * 6)) * 3 : 0;
      break;
    }
    case 'work':
    case 'drop': {
      if (c.kind === 'work' && BEND_JOBS.has(job)) {
        const k = (Math.sin(now / 520) + 1) / 2; // gathering: slow stoop
        P.rot = 0.12 * k;
        P.dx = 0.08 * k;
        P.sy = 1 - 0.07 * k;
        P.sx = 1 + 0.03 * k;
        break;
      }
      const t = c.phase >= 0 && c.kind === 'work' && ANIM_FRAMES[c.anim & 255]! > 2 ? c.phase : cyc(700);
      if (t < 0.55) {
        const k = t / 0.55;
        P.rot = -0.1 * k;
        P.dy = 3 * k;
        P.sy = 1 + 0.03 * k;
      } else if (t < 0.7) {
        const k = (t - 0.55) / 0.15;
        P.rot = -0.1 + 0.3 * ease(k);
        P.dx = 0.2 * ease(k);
        P.dy = 3 - 9 * ease(k);
        P.sy = 1.03 - 0.1 * ease(k);
        P.sx = 1 + 0.06 * ease(k);
      } else {
        const k = (t - 0.7) / 0.3;
        P.rot = 0.2 * (1 - ease(k));
        P.dy = -6 * (1 - ease(k));
        P.sy = 0.93 + 0.07 * ease(k);
        P.sx = 1.06 - 0.06 * ease(k);
      }
      if (c.kind === 'drop') {
        const bend = Math.sin(ph * Math.PI);
        P.rot = 0.14 * bend;
        P.sy = 1 - 0.08 * bend;
      }
      break;
    }
    case 'attack':
    case 'power': {
      const power = c.kind === 'power';
      const t = ph;
      if (t < 0.4) {
        const k = t / 0.4; // wind-up
        P.rot = -(power ? 0.16 : 0.1) * k;
        P.dy = (power ? 6 : 3) * k;
        P.dx = -0.12 * k;
        P.sy = 1 + 0.04 * k;
      } else if (t < 0.6) {
        const k = ease((t - 0.4) / 0.2); // strike / lunge
        P.rot = -(power ? 0.16 : 0.1) + (power ? 0.4 : 0.28) * k;
        P.dx = -0.12 + (power ? 0.7 : 0.45) * k;
        P.dy = (power ? 6 : 3) - (power ? 12 : 8) * k;
        P.sx = 1 + 0.08 * k;
        P.sy = 1.04 - 0.1 * k;
      } else {
        const k = (t - 0.6) / 0.4; // recover
        P.rot = (power ? 0.24 : 0.18) * (1 - ease(k));
        P.dx = (power ? 0.58 : 0.33) * (1 - ease(k));
        P.dy = -4 * (1 - ease(k));
        P.sy = 0.94 + 0.06 * ease(k);
      }
      break;
    }
    case 'throw': {
      const t = ph;
      if (t < 0.5) {
        P.rot = -0.12 * (t / 0.5);
        P.dx = -0.1 * (t / 0.5);
        P.sy = 1 + 0.03 * (t / 0.5);
      } else {
        const k = ease((t - 0.5) / 0.5);
        P.rot = -0.12 + 0.3 * k;
        P.dx = -0.1 + 0.3 * k;
        P.dy = 4 * Math.sin(k * Math.PI);
      }
      break;
    }
    case 'stagger': {
      // Id 42 is the hit reaction but also part of the idle "interlude" choreography, so: a recoil wobble, no flash.
      const k = ph;
      P.kx = Math.sin(k * Math.PI * 7) * 0.08 * (1 - k);
      P.dx = -0.18 * Math.sin(Math.min(1, k * 2) * Math.PI);
      P.rot = -0.12 * (1 - k);
      break;
    }
    case 'die': {
      const k = ease(clamp01(ph * 1.2));
      P.rot = -1.5 * k;
      P.dy = -2 * k;
      P.sy = 1 - 0.1 * k;
      P.alpha = ph > 0.8 ? 1 - (ph - 0.8) * 5 : 1;
      break;
    }
    case 'dance': {
      const dj = c.anim === 73 || c.anim === 74;
      const t = now / (dj ? 190 : 240);
      P.dy = Math.abs(Math.sin(t)) * (dj ? 9 : 7);
      P.rot = Math.sin(t) * (dj ? 0.12 : 0.09);
      P.sx = 1 + Math.sin(t * 2) * 0.035;
      P.sy = 1 - Math.sin(t * 2) * 0.03;
      P.flip = Math.sin(t / 2) > 0.2;
      break;
    }
    case 'sleep': {
      P.rot = -1.45;
      P.dy = -3;
      P.sy = 1 + Math.sin(now / 900) * 0.012;
      break;
    }
    case 'sit': {
      const a = c.anim & 255;
      const down = a === 115 ? clamp01(ph) : a === 116 ? 1 - clamp01(ph) : 1;
      P.sy = 1 - 0.3 * ease(down);
      P.sx = 1 + 0.09 * ease(down);
      P.dy = -2 * down;
      P.rot = Math.sin(now / 1100) * 0.015 * down + slump * 0.06 * down;
      break;
    }
    case 'eat': {
      const bite = Math.abs(Math.sin(now / 260));
      P.sy = 0.84 + bite * 0.02;
      P.sx = 1.06;
      P.rot = 0.04 + bite * 0.05;
      P.dx = 0.05 * bite;
      break;
    }
    case 'cook': {
      const t = now / 220;
      P.kx = Math.sin(t) * 0.05;
      P.dy = Math.abs(Math.sin(t)) * 2.5;
      P.rot = 0.05 + Math.sin(t) * 0.02;
      break;
    }
    case 'fish': {
      const a = c.anim & 255;
      if (a === 145 || a === 146) {
        P.dy = Math.abs(Math.sin(now / 150)) * 10 * (1 - ph * 0.5); // fish caught: hop
        P.rot = Math.sin(now / 150) * 0.06;
      } else {
        const lean = Math.sin(clamp01(ph) * Math.PI);
        P.rot = 0.05 + 0.1 * lean;
        P.dx = 0.1 * lean;
        P.kx = Math.sin(now / 520) * 0.015;
      }
      break;
    }
    case 'hide':
    case 'unhide': {
      const k = c.kind === 'hide' ? (c.phase >= 0 ? ease(clamp01(c.phase)) : 1) : 1 - (c.phase >= 0 ? ease(clamp01(c.phase)) : 1);
      P.sy = 1 - 0.34 * k;
      P.sx = 1 + 0.1 * k;
      P.dy = -2 * k;
      P.alpha = 1 - 0.5 * k;
      break;
    }
    case 'cast': {
      const t = now / 420;
      P.dy = 5 + Math.sin(t) * 2.5;
      P.sy = 1.04;
      P.rot = Math.sin(t / 2) * 0.03;
      break;
    }
    case 'play': {
      const t = now / 200;
      P.dy = Math.abs(Math.sin(t)) * 6;
      P.rot = Math.sin(t) * 0.1;
      break;
    }
    case 'trapped': {
      const t = now / 70;
      P.kx = Math.sin(t) * 0.1;
      P.rot = Math.sin(t * 1.3) * 0.06;
      P.dy = Math.max(0, Math.sin(t * 0.7)) * 2;
      break;
    }
    case 'chat': {
      const t = now / 360;
      P.dy = Math.max(0, Math.sin(t)) * 3;
      P.rot = Math.sin(t / 2) * 0.03;
      break;
    }
    case 'alarmed': {
      const k = clamp01(ph);
      P.dy = 14 * Math.sin(k * Math.PI);
      P.sx = 1 + 0.06 * Math.sin(k * Math.PI);
      P.sy = 1 + 0.05 * Math.sin(k * Math.PI);
      break;
    }
    default: {
      // stand: breathe; fighters / workers standing at their post stay alert
      P.sy = 1 + Math.sin(now / 650) * 0.012;
      if (SWING_JOBS.has(job)) P.rot = Math.sin(now / 900) * 0.01;
      if (slump > 0) {
        // miserable / starving / exhausted: shoulders down, head forward, slow breath
        P.sy = 1 - 0.035 * slump + Math.sin(now / 1100) * 0.01;
        P.rot = 0.045 * slump;
        P.dy = -1 * slump;
      }
      break;
    }
  }
  return P;
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
    // fish shoal: three out-of-phase ripples plus a few fish-shaped dark flecks
    const t = performance.now() / 1400;
    for (let i = 0; i < 3; i++) {
      const k = (t + i / 3) % 1;
      g.ellipse(cx, base - 6, 10 + 30 * k, 4 + 11 * k).stroke({ width: 3, color: 0xffffff, alpha: 0.75 * (1 - k) });
    }
    for (let i = 0; i < 3; i++) {
      const a = t * 2.2 + i * 2.1;
      g.ellipse(cx + Math.cos(a) * 16, base - 6 + Math.sin(a) * 6, 6, 2.5).fill({ color: 0x23506b, alpha: 0.55 });
    }
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
