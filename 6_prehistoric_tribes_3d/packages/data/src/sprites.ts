/**
 * Typed access to `res/data/sprites.json` (11 short tables + 25 byte tables).
 * The engine exposes these as `game.spriteShorts[i]` / `game.spriteBytes[i]` in JSON key order.
 */
export interface SpriteData {
  readonly shorts: Readonly<Record<string, readonly number[]>>;
  readonly bytes: Readonly<Record<string, readonly number[]>>;
  /** Tables in engine index order (`spriteShorts[i]`). */
  readonly shortsByIndex: readonly (readonly number[])[];
  /** Tables in engine index order (`spriteBytes[i]`). */
  readonly bytesByIndex: readonly (readonly number[])[];
}

function numberTables(v: unknown, label: string): Record<string, number[]> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new Error(`sprites.json: ${label} must be an object`);
  const out: Record<string, number[]> = {};
  for (const [k, t] of Object.entries(v)) {
    if (!Array.isArray(t) || !t.every((x) => typeof x === 'number')) throw new Error(`sprites.json: ${label}.${k} must be number[]`);
    out[k] = t;
  }
  return out;
}

export function parseSpriteData(json: unknown): SpriteData {
  if (typeof json !== 'object' || json === null) throw new Error('sprites.json: expected an object');
  const rec = json as Record<string, unknown>;
  const shorts = numberTables(rec.shorts, 'shorts');
  const bytes = numberTables(rec.bytes, 'bytes');
  return { shorts, bytes, shortsByIndex: Object.values(shorts), bytesByIndex: Object.values(bytes) };
}
