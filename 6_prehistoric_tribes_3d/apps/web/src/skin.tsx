import type { CursorKind, Renderer2D } from '@pt3d/render2d';

/** Where the UI art lives (served from assets/hd/source/ui, see tools/slice_sheets.py). */
const UI = `${import.meta.env.BASE_URL}hd/source/ui`;

export const iconUrl = (name: string): string => `${UI}/icons/${name}.png`;
export const buildingThumbUrl = (type: number): string => `${UI}/buildings/${type}.png`;
export const chromeUrl = (name: string): string => `${UI}/chrome/${name}.png`;

/** Pixel-art icon; decorative (the label is next to it or in a title). */
export function Ic({ name, size = 26, className }: { name: string; size?: number; className?: string }) {
  return <img className={className ? `ic ${className}` : 'ic'} src={iconUrl(name)} width={size} height={size} alt="" draggable={false} />;
}

/** Building thumbnail by building type; falls back to nothing when the art is missing. */
export function BuildingThumb({ type, size = 56 }: { type: number; size?: number }) {
  return <img className="ic bthumb" src={buildingThumbUrl(type)} style={{ maxWidth: size, maxHeight: size }} alt="" draggable={false} onError={(e) => (e.currentTarget.style.display = 'none')} />;
}

interface CursorIndex {
  [kind: string]: { file: string; hotspot: [number, number] };
}

/** Load the cursor art (40 px) and hand the CSS `cursor` values to the renderer; also skin the page default cursor. */
export async function applyCursors(renderer: Renderer2D): Promise<void> {
  try {
    const res = await fetch(`${UI}/cursors/index.json`);
    if (!res.ok) return;
    const idx = (await res.json()) as CursorIndex;
    const css: Partial<Record<CursorKind, string>> = {};
    for (const kind of ['default', 'go', 'attack', 'gather', 'build', 'forbidden'] as const) {
      const c = idx[kind];
      if (c) css[kind] = `url(${UI}/${c.file}) ${c.hotspot[0]} ${c.hotspot[1]}, auto`;
    }
    renderer.cursors = css;
    if (css.default) document.documentElement.style.setProperty('--cursor-default', css.default);
  } catch {
    // no cursor art: keep the system cursor
  }
}
