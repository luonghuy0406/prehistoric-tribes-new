export interface MapData {
  name: string;
  width: number;
  height: number;
  tiles: number[][];      // Terrain sprite index
  collision: number[][];  // 0 = passable, -126 = solid/blocked
}

export class BinaryMapLoader {
  /**
   * Load and parse binary map data block (.bin) extracted from /ma
   */
  public static async loadMap(url: string, levelIndex: number = 0): Promise<MapData> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Standard map dimensions reverse-engineered from f.java:
    // Level 0 is 40x32, other levels vary between 32 and 64
    let width = 40;
    let height = 32;

    if (levelIndex === 0) {
      width = 40;
      height = 32;
    } else {
      // Default to 48x48 if unspecified
      width = 48;
      height = 48;
    }

    const tiles: number[][] = [];
    const collision: number[][] = [];

    let byteOffset = 0;
    let runCount = 0;
    let currentTile = 0;

    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      collision[y] = [];

      for (let x = 0; x < width; x++) {
        if (runCount <= 0 && byteOffset < bytes.length) {
          const rawByte = bytes[byteOffset++];
          if (rawByte >= 250) {
            // RLE run marker
            runCount = rawByte - 248;
            currentTile = byteOffset < bytes.length ? bytes[byteOffset++] : 0;
          } else {
            currentTile = rawByte;
            runCount = 1;
          }
        }

        runCount--;
        // Variety randomization for base ground tiles (indices 0..8)
        let tileVal = currentTile;
        if (tileVal <= 8) {
          tileVal = (tileVal + ((x * 7 + y * 13) % 4)) % 9;
        }

        tiles[y][x] = tileVal;

        // Border tiles and special obstacle indices are marked solid
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1 || tileVal >= 170) {
          collision[y][x] = -126; // Impassable
        } else {
          collision[y][x] = 0;    // Passable
        }
      }
    }

    return {
      name: `Level ${levelIndex}`,
      width,
      height,
      tiles,
      collision
    };
  }
}
