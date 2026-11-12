import { describe, expect, it } from 'vitest';
import {
  at,
  JavaRandom,
  LABEL_GROUPS,
  LOCALE_CODES,
  nestedTable,
  parseGameData,
  parseLocale,
  table,
} from '../src/index.js';
import { loadGameData, loadSprites, readJson } from './helpers.js';

describe('JavaRandom', () => {
  it('matches java.util.Random(42).nextInt() reference values', () => {
    // Reference: new java.util.Random(42).nextInt() x3
    const r = new JavaRandom(42);
    expect([r.nextInt(), r.nextInt(), r.nextInt()]).toEqual([-1170105035, 234785527, -1360544799]);
  });

  it('is deterministic from a captured state', () => {
    const a = new JavaRandom(1);
    a.nextInt();
    const b = JavaRandom.fromState(a.getState());
    expect([a.randomInt(0x7fff, 100), a.nextInt()]).toEqual([b.randomInt(0x7fff, 100), b.nextInt()]);
  });
});

describe('game-data.json', () => {
  const data = loadGameData();

  it('has 288 tables and 4 short tables', () => {
    expect(Object.keys(data.tables)).toHaveLength(288);
    expect(Object.keys(data.shortTables)).toHaveLength(4);
  });

  it('exposes flat and nested tables by name', () => {
    expect(at(table(data, 'chapterOfLevel'), 11)).toBe(9);
    expect(nestedTable(data, 'levelEntities')).toHaveLength(12);
    expect(() => table(data, 'levelEntities')).toThrow(/nested/);
    expect(() => table(data, 'nope')).toThrow(/unknown/);
  });

  it('rejects malformed input', () => {
    expect(() => parseGameData({ tables: { a: ['x'] }, shortTables: {} })).toThrow();
  });
});

describe('sprites.json', () => {
  it('has 11 short and 25 byte tables in engine order', () => {
    const s = loadSprites();
    expect(s.shortsByIndex).toHaveLength(11);
    expect(s.bytesByIndex).toHaveLength(25);
    expect(s.shortsByIndex[9]).toBe(s.shorts.compositeFirstClip);
  });
});

describe('locales', () => {
  for (const code of LOCALE_CODES) {
    it(`${code}.json parses with the same shape as en.json`, () => {
      const en = parseLocale(readJson('text/en.json'));
      const loc = parseLocale(readJson(`text/${code}.json`));
      for (const g of LABEL_GROUPS) expect(loc.labels[g].length).toBe(en.labels[g].length);
      expect(loc.dialogue.length).toBe(en.dialogue.length);
    });
  }
});
