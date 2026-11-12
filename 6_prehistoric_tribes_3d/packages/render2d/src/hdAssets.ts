/**
 * HD asset loader (T25, runtime v1).
 *
 * Gemini delivers PNGs on a chroma-green background that is NOT pure #00FF00 (compression noise
 * and darker corners, e.g. (3,255,6)…(40,226,30)). We therefore key by flood-filling "greenish"
 * pixels connected to the image border — green details inside the object survive — then soften and
 * de-spill the 1-px fringe, trim to the content box, and (for character strips) split the figures
 * by empty columns. Everything runs once at load; an offline build step (atlas + webp) can replace
 * it later without touching the renderer.
 */
import { Texture } from 'pixi.js';

export type AssetKind = 'dir5' | 'building' | 'texture' | 'sprite';

export interface ManifestEntry {
  src: string;
  kind: AssetKind;
  /** Chroma-key the green background (default true except for textures). */
  key?: boolean;
  /** dir5: expected figure count (5). */
  frames?: number;
  /** texture: world pixels covered by one repeat of the image. */
  worldSize?: number;
}

export interface Manifest {
  version: number;
  assets: Record<string, ManifestEntry>;
}

export interface HdSprite {
  /** One texture per frame/direction (dir5: S, SE, E, NE, N). */
  frames: Texture[];
  /** Content size of each frame in source pixels. */
  sizes: { w: number; h: number }[];
  /** For textures: world pixels per repeat. */
  worldSize?: number;
}

/** A pixel counts as background when green dominates red and blue by this much. */
const KEY_STRONG = 70;
/** Fringe pixels with green dominance above this get softened alpha + de-spill. */
const KEY_SOFT = 25;

export async function loadManifest(baseUrl: string): Promise<Manifest | null> {
  try {
    const res = await fetch(`${baseUrl}manifest.json`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return (await res.json()) as Manifest;
  } catch {
    return null;
  }
}

export async function loadHdAssets(baseUrl: string): Promise<Map<string, HdSprite>> {
  const out = new Map<string, HdSprite>();
  const manifest = await loadManifest(baseUrl);
  if (!manifest) return out;
  await Promise.all(
    Object.entries(manifest.assets).map(async ([id, entry]) => {
      try {
        out.set(id, await loadEntry(baseUrl, entry));
      } catch (e) {
        console.warn(`[hd] ${id}: ${String(e)} — falling back to placeholder`);
      }
    }),
  );
  return out;
}

async function loadEntry(baseUrl: string, entry: ManifestEntry): Promise<HdSprite> {
  const img = new Image();
  img.decoding = 'async';
  img.src = `${baseUrl}${entry.src}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas unavailable');
  ctx.drawImage(img, 0, 0);

  if (entry.kind === 'texture') {
    const tex = Texture.from(canvas);
    tex.source.addressMode = 'repeat';
    return { frames: [tex], sizes: [{ w: canvas.width, h: canvas.height }], ...(entry.worldSize ? { worldSize: entry.worldSize } : {}) };
  }

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (entry.key !== false) chromaKey(data);
  ctx.putImageData(data, 0, 0);

  const boxes = entry.kind === 'dir5' ? splitColumns(data, entry.frames ?? 5) : [contentBox(data, 0, data.width)];
  const frames: Texture[] = [];
  const sizes: { w: number; h: number }[] = [];
  for (const b of boxes) {
    const c = document.createElement('canvas');
    c.width = b.w;
    c.height = b.h;
    c.getContext('2d')?.drawImage(canvas, b.x, b.y, b.w, b.h, 0, 0, b.w, b.h);
    frames.push(Texture.from(c));
    sizes.push({ w: b.w, h: b.h });
  }
  return { frames, sizes };
}

function greenDominance(d: Uint8ClampedArray, i: number): number {
  return d[i + 1]! - Math.max(d[i]!, d[i + 2]!);
}

/** Flood-fill background from the border, then soften/de-spill the fringe. */
export function chromaKey(img: ImageData): void {
  const { width: w, height: h, data: d } = img;
  const bg = new Uint8Array(w * h);
  const stack: number[] = [];
  const push = (p: number): void => {
    if (bg[p] === 0 && greenDominance(d, p * 4) > KEY_STRONG) {
      bg[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length > 0) {
    const p = stack.pop()!;
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    if (bg[p] === 1) {
      d[i + 3] = 0;
      continue;
    }
    const x = p % w;
    const nearBg = (x > 0 && bg[p - 1] === 1) || (x < w - 1 && bg[p + 1] === 1) || (p >= w && bg[p - w] === 1) || (p < w * (h - 1) && bg[p + w] === 1);
    if (!nearBg) continue;
    const dom = greenDominance(d, i);
    if (dom > KEY_SOFT) {
      d[i + 3] = Math.round(255 * Math.max(0, Math.min(1, (KEY_STRONG - dom) / (KEY_STRONG - KEY_SOFT))));
      d[i + 1] = Math.max(d[i]!, d[i + 2]!); // de-spill
    }
  }
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function columnHasContent(img: ImageData, x: number): boolean {
  const { width: w, height: h, data: d } = img;
  for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3]! > 24) return true;
  return false;
}

function contentBox(img: ImageData, x0: number, x1: number): Box {
  const { width: w, height: h, data: d } = img;
  let minX = x1;
  let maxX = x0 - 1;
  let minY = h;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = x0; x < x1; x++) {
      if (d[(y * w + x) * 4 + 3]! > 24) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) return { x: x0, y: 0, w: Math.max(1, x1 - x0), h };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Split a strip of figures by fully transparent column runs; falls back to equal slices. */
function splitColumns(img: ImageData, expected: number): Box[] {
  const runs: [number, number][] = [];
  let start = -1;
  for (let x = 0; x < img.width; x++) {
    const has = columnHasContent(img, x);
    if (has && start < 0) start = x;
    if (!has && start >= 0) {
      runs.push([start, x]);
      start = -1;
    }
  }
  if (start >= 0) runs.push([start, img.width]);
  // Merge tiny gaps (e.g. between a leg and an arm) until we have the expected count.
  while (runs.length > expected) {
    let best = 1;
    let bestGap = Infinity;
    for (let i = 1; i < runs.length; i++) {
      const gap = runs[i]![0] - runs[i - 1]![1];
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    runs[best - 1] = [runs[best - 1]![0], runs[best]![1]];
    runs.splice(best, 1);
  }
  if (runs.length !== expected) {
    const step = img.width / expected;
    return Array.from({ length: expected }, (_, i) => contentBox(img, Math.floor(i * step), Math.floor((i + 1) * step)));
  }
  return runs.map(([a, b]) => contentBox(img, a, b));
}
