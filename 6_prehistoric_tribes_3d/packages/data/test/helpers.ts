import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseGameData, parseSpriteData, type GameData, type SpriteData } from '../src/index.js';

export const RES_DIR = fileURLToPath(new URL('../../../assets/original/res/', import.meta.url));

export function readJson(rel: string): unknown {
  return JSON.parse(readFileSync(RES_DIR + rel, 'utf8'));
}

export function readBin(rel: string): Uint8Array {
  return new Uint8Array(readFileSync(RES_DIR + rel));
}

export function loadGameData(): GameData {
  return parseGameData(readJson('data/game-data.json'));
}

export function loadSprites(): SpriteData {
  return parseSpriteData(readJson('data/sprites.json'));
}
