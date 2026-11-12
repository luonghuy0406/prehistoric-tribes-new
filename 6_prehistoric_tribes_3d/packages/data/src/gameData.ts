/**
 * Typed access to `res/data/game-data.json` (288 named byte tables + 4 short tables).
 *
 * The original engine addresses tables by a numeric slot index (enum `S` in ptCore.js) into one
 * flat Int8Array. Some tables occupy several consecutive slots (e.g. `levelEntities` = one slot per
 * level), so slot numbers do NOT equal JSON key order. Always address tables by name here.
 */
export type ByteTable = readonly number[];

export interface GameData {
  readonly tables: Readonly<Record<string, ByteTable | readonly ByteTable[]>>;
  readonly shortTables: Readonly<Record<string, ByteTable>>;
}

function isNumberArray(v: unknown): v is number[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'number');
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function parseGameData(json: unknown): GameData {
  if (!isRecord(json) || !isRecord(json.tables) || !isRecord(json.shortTables)) {
    throw new Error('game-data.json: expected { tables, shortTables } objects');
  }
  const tables: Record<string, ByteTable | ByteTable[]> = {};
  for (const [name, value] of Object.entries(json.tables)) {
    if (isNumberArray(value)) tables[name] = value;
    else if (Array.isArray(value) && value.every(isNumberArray)) tables[name] = value;
    else throw new Error(`game-data.json: table "${name}" is not a number[] or number[][]`);
  }
  const shortTables: Record<string, ByteTable> = {};
  for (const [name, value] of Object.entries(json.shortTables)) {
    if (!isNumberArray(value)) throw new Error(`game-data.json: short table "${name}" is not a number[]`);
    shortTables[name] = value;
  }
  return { tables, shortTables };
}

/** A flat (single-slot) table by name. Throws if missing or nested. */
export function table(data: GameData, name: string): ByteTable {
  const t = data.tables[name];
  if (t === undefined) throw new Error(`game-data: unknown table "${name}"`);
  if (t.length > 0 && Array.isArray(t[0])) throw new Error(`game-data: table "${name}" is nested; use nestedTable()`);
  return t as ByteTable;
}

/** A multi-slot table (one sub-table per index, e.g. per level). */
export function nestedTable(data: GameData, name: string): readonly ByteTable[] {
  const t = data.tables[name];
  if (t === undefined) throw new Error(`game-data: unknown table "${name}"`);
  if (t.length > 0 && !Array.isArray(t[0])) throw new Error(`game-data: table "${name}" is flat; use table()`);
  return t as readonly ByteTable[];
}

/** Read a value; out-of-range reads throw instead of silently yielding undefined. */
export function at(t: ByteTable, index: number): number {
  const v = t[index];
  if (v === undefined) throw new RangeError(`table index ${index} out of range (length ${t.length})`);
  return v;
}
