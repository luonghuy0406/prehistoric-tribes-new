/**
 * Decoder for `res/maps/map-<chapter>.bin` — a byte-RLE terrain stream (see docs/MAP_FORMAT.md).
 * Ported from ptCore.js `decodeMapTiles` / `placeMapTile` / `markShoresAroundFish` and verified
 * tile-for-tile against oracle dumps of all 12 levels (test/maps.test.ts).
 */
import { at, table, type GameData } from './gameData.js';
import type { JavaRandom } from './javaRandom.js';
import type { SpriteData } from './sprites.js';

/** Level ids (enum `k` in ptCore.js). Levels 7..11 are custom maps. */
export const Level = {
  TUTORIAL: 0,
  OUTSIDE: 1,
  REVENGE: 2,
  ESCAPE: 3,
  WASTELANDS: 4,
  NEW_HOME: 5,
  NEW_HOME_FINALE: 6,
  FIRST_CUSTOM: 7,
} as const;
export const LEVEL_COUNT = 12;

/** Occupancy grid codes (enum `E`). Values -61..-110 encode an object slot: `-61 - slot`. */
export const Occupancy = {
  EMPTY: 0,
  FOREST: -124,
  WATER: -125,
  BLOCKED: -126,
  SHORE: -127,
} as const;
const OBJECT_REF_FIRST = -61;
const OBJECT_REF_LAST = -110;
export const MAX_OBJECTS = 50;

/** Tile id ranges (enum `lf`). */
export const Tile = {
  MAX_VARIANT_BASE: 8,
  FIRST_OBJECT: 175,
  FIRST_FOREST: 180,
  LAST_FOREST: 231,
  TALL_ROCK: 243,
} as const;
/** Water tiles next to which a fish shoal turns the tile into SHORE (const `ff`). */
const SHORE_TILES: readonly number[] = [33, 34, 37, 38];
/** Object kind (enum `Pl`); kinds 1..4 are not named in the engine — TODO(T5): name them. */
export const ObjectKind = { NONE: 0, FISH_SHOAL: 5, CARCASS: 6, BONES: 7 } as const;

const RUN_MARKER = 250;
const RUN_TABLE_TILE_OFFSET = 6; // mapRunLengths = [runLength x6, tileId x6]
const INITIAL_RUN = 10;
const BLOCKED_SPRITE_BIT = 13; // spriteShorts[9] (compositeFirstClip) flag bit
const TERRAIN_KIND_SHIFT = 6; // spriteBytes[16] (compositeClipCount) bits 6..7
const TERRAIN_KIND_WATER = 2;

export interface LevelInfo {
  level: number;
  chapter: number;
  /** Size encoded in the .bin stream. */
  levelWidth: number;
  levelHeight: number;
  /** Playable area (tutorial is cropped to 40x32, NEW_HOME loses 32 columns). */
  mapWidth: number;
  mapHeight: number;
  /** Camera start in tiles (`levelStartPositions`). */
  startX: number;
  startY: number;
}

export function levelInfo(data: GameData, level: number): LevelInfo {
  if (!Number.isInteger(level) || level < 0 || level >= LEVEL_COUNT) throw new RangeError(`level ${level} out of range`);
  const sizes = table(data, 'levelSizes');
  const starts = table(data, 'levelStartPositions');
  const levelWidth = at(sizes, level * 2);
  const levelHeight = at(sizes, level * 2 + 1);
  let mapWidth = levelWidth;
  let mapHeight = levelHeight;
  if (level === Level.TUTORIAL) {
    mapWidth = 40;
    mapHeight = 32;
  } else if (level === Level.NEW_HOME) {
    mapWidth -= 32;
  }
  return {
    level,
    chapter: at(table(data, 'chapterOfLevel'), level),
    levelWidth,
    levelHeight,
    mapWidth,
    mapHeight,
    startX: at(starts, level * 2),
    startY: at(starts, level * 2 + 1),
  };
}

/** Decode the raw RLE stream into base tile ids (0..255), row-major `levelWidth*levelHeight`. */
export function decodeTiles(bin: Uint8Array, data: GameData, width: number, height: number): Uint8Array {
  const runs = table(data, 'mapRunLengths');
  const out = new Uint8Array(width * height);
  let tile = 0;
  let runIndex = 0;
  let runPos = INITIAL_RUN;
  let src = 0;
  for (let i = 0; i < out.length; i++) {
    if (runPos >= at(runs, runIndex)) {
      if (src >= bin.length) throw new Error(`map stream ended early at tile ${i}/${out.length}`);
      tile = bin[src++]! & 255;
      if (tile >= RUN_MARKER) {
        runPos = 0;
        runIndex = tile - RUN_MARKER;
        tile = at(runs, RUN_TABLE_TILE_OFFSET + runIndex) & 255;
      }
    }
    runPos++;
    out[i] = tile;
  }
  return out;
}

export interface MapObject {
  slot: number;
  kind: number;
  x: number;
  y: number;
  /** Remaining resource amount at level start (`objectStartVariant[kind]`). */
  amount: number;
}

export interface DecodedLevel {
  info: LevelInfo;
  /** Base tile id before the random grass variant (row-major, levelWidth x levelHeight). */
  baseTiles: Uint8Array;
  /** Final tile id as the engine stores it (variant applied, unsigned). */
  tiles: Uint8Array;
  /** Occupancy codes (see `Occupancy`), row-major. */
  occupancy: Int8Array;
  objects: MapObject[];
}

export function isForestTile(tile: number): boolean {
  return tile >= Tile.FIRST_FOREST && tile <= Tile.LAST_FOREST;
}

export function objectSlotFromOccupancy(code: number): number | null {
  return code <= OBJECT_REF_FIRST && code >= OBJECT_REF_LAST ? OBJECT_REF_FIRST - code : null;
}

/**
 * Full level terrain build, identical to the engine's `loadMap()`.
 * `rng` is consumed exactly like the engine (one draw per tile with id <= 8), so passing the
 * engine's RNG state reproduces its terrain bit-for-bit; pass `null` to keep base tiles.
 */
export function buildLevel(
  bin: Uint8Array,
  data: GameData,
  sprites: SpriteData,
  level: number,
  rng: JavaRandom | null,
): DecodedLevel {
  const info = levelInfo(data, level);
  const { levelWidth: W, levelHeight: H } = info;
  const baseTiles = decodeTiles(bin, data, W, H);
  const tiles = new Uint8Array(baseTiles.length);
  const occupancy = new Int8Array(baseTiles.length);
  const objects: MapObject[] = [];
  const blockedFlags = sprites.shortsByIndex[9];
  const kindFlags = sprites.bytesByIndex[16];
  if (!blockedFlags || !kindFlags) throw new Error('sprites.json is missing compositeFirstClip/compositeClipCount');
  const startAmount = table(data, 'objectStartVariant');

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const base = baseTiles[i]!;
      const tile = base <= Tile.MAX_VARIANT_BASE && rng ? base + rng.randomInt(3, 3) : base;
      tiles[i] = tile;
      let occ: number = occupancy[i]!;
      const spriteBlocked = (((at(blockedFlags, tile) & 0xffff) >> BLOCKED_SPRITE_BIT) & 1) === 1;
      if ((tile >= Tile.FIRST_OBJECT || spriteBlocked) && occ !== Occupancy.SHORE) occ = Occupancy.BLOCKED;
      else if (occ === Occupancy.BLOCKED) occ = Occupancy.EMPTY;
      if (level !== Level.ESCAPE) {
        if ((((at(kindFlags, tile) & 0xffff) >> TERRAIN_KIND_SHIFT) & 3) === TERRAIN_KIND_WATER) occ = Occupancy.WATER;
        if (isForestTile(tile)) occ = Occupancy.FOREST;
        else if (tile >= Tile.FIRST_OBJECT && tile < Tile.FIRST_FOREST && objects.length < MAX_OBJECTS) {
          const kind = tile - Tile.FIRST_OBJECT + 1;
          const slot = objects.length;
          objects.push({ slot, kind, x, y, amount: at(startAmount, kind) });
          occ = OBJECT_REF_FIRST - slot;
        }
      }
      if (y === 0 || y === H - 1 || x === W - 1) occ = Occupancy.BLOCKED;
      occupancy[i] = occ;
    }
  }

  // markShoresAroundFish: runs over the cropped playable area only.
  for (let y = 0; y < info.mapHeight; y++) {
    for (let x = 1; x < info.mapWidth - 1; x++) {
      const slot = objectSlotFromOccupancy(occupancy[y * W + x]!);
      if (slot === null || objects[slot]?.kind !== ObjectKind.FISH_SHOAL) continue;
      if (SHORE_TILES.includes(tiles[y * W + x - 1]!)) occupancy[y * W + x - 1] = Occupancy.SHORE;
      if (SHORE_TILES.includes(tiles[y * W + x + 1]!)) occupancy[y * W + x + 1] = Occupancy.SHORE;
    }
  }

  return { info, baseTiles, tiles, occupancy, objects };
}
