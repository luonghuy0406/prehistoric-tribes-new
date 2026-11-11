/**
 * BinaryMapLoader.js
 * Giải mã chính xác 100% file nhị phân RLE bản đồ gốc (map-0.bin .. map-9.bin)
 * sử dụng bảng MAP_RUN_LENGTHS = [4, 4, 2, 2, 2, 2, 3, 0, 43, 6, 3, 0] và kích thước/crop từng màn.
 */
import { CAMPAIGN_LEVELS, MAP_RUN_LENGTHS } from '../data/GameData.js';

export const OCC = {
  EMPTY: 0,
  FOREST: -124,
  WATER: -125,
  BLOCKED: -126,
  SHORE: -127,
  STONE: -129,
  BERRY: -130,
  HERB: -131,
  FISH: -132
};

const SHORE_TILES = new Set([33, 34, 37, 38]);

export function isForestTile(tileVal) {
  return tileVal >= 180 && tileVal <= 231;
}

export function isWaterTile(tileVal) {
  return (tileVal >= 63 && tileVal <= 75) || (tileVal >= 115 && tileVal <= 127) || tileVal === 6 || tileVal === 31 || tileVal === 32 || tileVal === 179;
}

export function isStoneTile(tileVal) {
  return tileVal >= 135 && tileVal <= 157;
}

export function isBlockedTerrainTile(tileVal) {
  return (
    tileVal === 7 || tileVal === 8 ||
    (tileVal >= 29 && tileVal <= 62) ||
    (tileVal >= 158 && tileVal <= 174)
  );
}

export class BinaryMapLoader {
  static async loadMap(url, levelIndex = 0) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Không tải được bản đồ ${url}: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    return BinaryMapLoader.decodeBytes(bytes, levelIndex);
  }

  /**
   * Giải mã mảng byte RLE sang dữ liệu bản đồ chuẩn xác (dùng được cả trên Node test & Browser).
   */
  static decodeBytes(bytes, levelIndex = 0) {
    const levelCfg = CAMPAIGN_LEVELS[levelIndex] || CAMPAIGN_LEVELS[0];
    const [rawWidth, rawHeight] = levelCfg.rawSize;
    const [playWidth, playHeight] = levelCfg.playSize;

    const rawGrid = Array.from({ length: rawHeight }, () => new Uint8Array(rawWidth));

    let r = 10;
    let n = 0;
    let i = 0;
    let t = 0;

    for (let y = 0; y < rawHeight; y++) {
      for (let x = 0; x < rawWidth; x++) {
        if (r >= MAP_RUN_LENGTHS[n]) {
          t = i < bytes.length ? (bytes[i++] & 255) : 0;
          if (t >= 250) {
            r = 0;
            n = t - 250;
            t = (MAP_RUN_LENGTHS[6 + n] || 0) & 255;
          }
        }
        r++;
        rawGrid[y][x] = t;
      }
    }

    const tiles = [];
    const collision = [];
    const forestTiles = [];
    const stoneTiles = [];
    const waterTiles = [];
    const berryBushes = [];
    const herbNodes = [];
    const fishShoals = [];

    for (let y = 0; y < playHeight; y++) {
      tiles[y] = [];
      collision[y] = [];

      for (let x = 0; x < playWidth; x++) {
        let tileVal = rawGrid[y][x];
        if (tileVal <= 8 && tileVal !== 6 && tileVal !== 7 && tileVal !== 8) {
          tileVal = tileVal + ((x * 7 + y * 13) % 3);
        }
        tiles[y][x] = tileVal;

        const isBorder = (x === 0 || x === playWidth - 1 || y === 0 || y === playHeight - 1);
        if (isBorder) {
          collision[y][x] = OCC.BLOCKED;
          continue;
        }

        if (isForestTile(tileVal)) {
          collision[y][x] = OCC.FOREST;
          forestTiles.push({ x, y, tileVal, amount: 45 });
        } else if (tileVal >= 175 && tileVal <= 177) {
          collision[y][x] = OCC.BERRY;
          berryBushes.push({ x, y, tileVal, amount: 25, maxAmount: 25 });
        } else if (tileVal === 178) {
          collision[y][x] = OCC.HERB;
          herbNodes.push({ x, y, tileVal, amount: 20, maxAmount: 20 });
        } else if (tileVal === 179) {
          collision[y][x] = OCC.WATER;
          fishShoals.push({ x, y, tileVal, amount: 30, maxAmount: 30 });
        } else if (isWaterTile(tileVal)) {
          collision[y][x] = OCC.WATER;
          waterTiles.push({ x, y, tileVal });
        } else if (isStoneTile(tileVal)) {
          collision[y][x] = OCC.STONE;
          stoneTiles.push({ x, y, tileVal, amount: 50, maxAmount: 50 });
        } else if (isBlockedTerrainTile(tileVal)) {
          collision[y][x] = OCC.BLOCKED;
        } else {
          collision[y][x] = OCC.EMPTY;
        }
      }
    }

    // Đánh dấu bờ cạn (SHORE) cạnh vùng cá nhảy để chiến binh cầm Lao có thể đứng câu cá
    for (const fish of fishShoals) {
      for (const dx of [-1, 1]) {
        const sx = fish.x + dx;
        if (sx > 0 && sx < playWidth - 1) {
          const tv = tiles[fish.y][sx];
          if (SHORE_TILES.has(tv) || collision[fish.y][sx] === OCC.EMPTY || isBlockedTerrainTile(tv)) {
            if (!isWaterTile(tv)) {
              collision[fish.y][sx] = OCC.EMPTY;
            }
          }
        }
      }
    }

    return {
      name: levelCfg.name,
      vnName: levelCfg.vnName,
      levelIndex,
      width: playWidth,
      height: playHeight,
      rawWidth,
      rawHeight,
      bytesConsumed: i,
      totalBytes: bytes.length,
      tiles,
      collision,
      forestTiles,
      stoneTiles,
      waterTiles,
      berryBushes,
      herbNodes,
      fishShoals
    };
  }
}
