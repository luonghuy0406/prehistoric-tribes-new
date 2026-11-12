import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildLevel, decodeTiles, JavaRandom, LEVEL_COUNT, levelInfo, Tile } from '../src/index.js';
import { loadGameData, loadSprites, readBin } from './helpers.js';

interface OracleLevel {
  level: number;
  levelWidth: number;
  levelHeight: number;
  mapWidth: number;
  mapHeight: number;
  rngBefore: [number, number];
  rngAfter: [number, number];
  terrain: string[];
  occupancy: string[];
  objects: [number, number, number, number, number][];
}

const oracle = JSON.parse(readFileSync(new URL('./fixtures/oracle-maps.json', import.meta.url), 'utf8')) as {
  levels: OracleLevel[];
};
const data = loadGameData();
const sprites = loadSprites();
const rows = (lines: string[]): number[] => lines.flatMap((l) => l.split(',').map(Number));

describe('map decoding vs original engine (oracle)', () => {
  it('covers all 12 levels', () => {
    expect(oracle.levels).toHaveLength(LEVEL_COUNT);
  });

  for (const o of oracle.levels) {
    describe(`level ${o.level}`, () => {
      const info = levelInfo(data, o.level);
      const bin = readBin(`maps/map-${info.chapter}.bin`);

      it('has the same sizes', () => {
        expect([info.levelWidth, info.levelHeight, info.mapWidth, info.mapHeight]).toEqual([
          o.levelWidth,
          o.levelHeight,
          o.mapWidth,
          o.mapHeight,
        ]);
      });

      it('base tiles match (ignoring the random grass variant)', () => {
        const base = decodeTiles(bin, data, info.levelWidth, info.levelHeight);
        const engine = rows(o.terrain).map((v) => v & 255);
        let mismatches = 0;
        engine.forEach((t, i) => {
          const b = base[i]!;
          const ok = b <= Tile.MAX_VARIANT_BASE ? t >= b && t <= b + 2 : t === b;
          if (!ok) mismatches++;
        });
        expect(mismatches).toBe(0);
      });

      it('reproduces terrain, occupancy, objects and RNG bit-for-bit from the engine RNG state', () => {
        const rng = JavaRandom.fromState({ high: o.rngBefore[0], low: o.rngBefore[1] });
        const lv = buildLevel(bin, data, sprites, o.level, rng);
        expect(Array.from(lv.tiles)).toEqual(rows(o.terrain).map((v) => v & 255));
        expect(Array.from(lv.occupancy)).toEqual(rows(o.occupancy));
        expect(lv.objects.map((x) => [x.kind, x.x, x.y, x.amount, 0])).toEqual(o.objects);
        expect([rng.high, rng.low]).toEqual(o.rngAfter);
      });
    });
  }
});
