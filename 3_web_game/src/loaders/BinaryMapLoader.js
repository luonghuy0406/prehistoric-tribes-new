export class BinaryMapLoader {
  static async loadMap(url, levelIndex = 0) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let width = 40;
    let height = 32;

    if (levelIndex === 0) {
      width = 40;
      height = 32;
    } else {
      width = 48;
      height = 48;
    }

    const tiles = [];
    const collision = [];

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
            runCount = rawByte - 248;
            currentTile = byteOffset < bytes.length ? bytes[byteOffset++] : 0;
          } else {
            currentTile = rawByte;
            runCount = 1;
          }
        }

        runCount--;
        let tileVal = currentTile;
        if (tileVal <= 8) {
          tileVal = (tileVal + ((x * 7 + y * 13) % 4)) % 9;
        }

        tiles[y][x] = tileVal;

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
