#!/usr/bin/env python3
"""Cắt ảnh tù trưởng 10x10 (1new.webp) theo NỘI DUNG THỰC (đã duyệt bằng mắt, KHÔNG theo bảng spec vì model lệch số khung)
và chỉ nhập các tư thế SẠCH (không dính vật thể như gốc cây/đá/nước/lưới).

  python3 tools/slice_chief_new.py [--dry-run]

Đầu ra: assets/hd/source/characters/chief/<pose>.png (dải khung cùng kích thước) + manifest `chr_chief@<pose>`.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import slice_chief as sc  # noqa: E402
import slice_sheets as sl  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = sl.HD / 'source' / 'sheets' / 'character' / 'chief' / '1new.webp'
OUT = sc.OUT
COLS = ROWS = 10

# Nội dung thực của 1new.webp (hàng, cột) — chỉ các tư thế được nhập (xem docs/14_CHIEF_NEW_SHEETS_REVIEW.md)
USE = {
    'stab_E': [(5, 7), (5, 8)],
    'carry_E': [(10, 5), (10, 6), (10, 7), (10, 8)],  # (10,4) là tư thế khác (tay ôm đầu, đầy lá)
    'sneak_E': [(9, 7), (9, 8), (9, 9), (9, 10)],
    'hide_S': [(10, 1), (10, 2), (10, 3)],
    'peek_S': [(8, 10)],
    'chat_S': [(10, 9), (10, 10)],
}
STAND_REF = (2, 9)  # stand_S: chiều cao đứng chuẩn của ảnh này


def drop_strays(f: Image.Image) -> Image.Image:
    """Giữ thành phần liền lớn nhất (+ mảnh lớn ≥ 4%): bỏ mảnh vật thể/giáo của ô bên cạnh lọt vào khung."""
    a = f.getchannel('A')
    w, h = f.size
    px = a.load()
    seen = bytearray(w * h)
    comps = []
    for y0 in range(h):
        for x0 in range(w):
            if px[x0, y0] <= 24 or seen[y0 * w + x0]:
                continue
            stack = [(x0, y0)]
            seen[y0 * w + x0] = 1
            pts = []
            while stack:
                x, y = stack.pop()
                pts.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1), (x + 1, y + 1), (x - 1, y - 1), (x + 1, y - 1), (x - 1, y + 1)):
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny] > 24 and not seen[ny * w + nx]:
                        seen[ny * w + nx] = 1
                        stack.append((nx, ny))
            comps.append(pts)
    if len(comps) <= 1:
        return f
    big = max(len(c) for c in comps)
    keep = Image.new('L', f.size, 0)
    kp = keep.load()
    for c in comps:
        if len(c) >= 0.04 * big:
            for x, y in c:
                kp[x, y] = 255
    # soften: keep original alpha where the kept mask (grown by 2px) allows
    from PIL import ImageFilter
    mask = keep.filter(ImageFilter.MaxFilter(5))
    out = f.copy()
    out.putalpha(Image.composite(a, Image.new('L', f.size, 0), mask))
    bb = out.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    return out.crop(bb) if bb else out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()
    im = Image.open(SRC).convert('RGB')
    cells = sc.grid_cells(im, COLS, ROWS)
    n = sum(1 for r in cells for c in r if c)
    print(f'{SRC.name} {im.size}: {n}/100 ô')
    sl.debug_overlay(im, [c for r in cells for c in r if c], sl.SHEETS / '_debug' / 'chief_new1.png')
    if args.dry_run:
        return 0
    stand = sc.keyed_crop(im, cells[STAND_REF[0] - 1][STAND_REF[1] - 1])
    ref_h = stand.height
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = sl.load_manifest()
    for pose, idxs in USE.items():
        frames = [drop_strays(sc.keyed_crop(im, cells[r - 1][c - 1])) for r, c in idxs]
        anchors = [sc.anchor_x(f) for f in frames]
        half = max(max(a, f.width - a) for a, f in zip(anchors, frames))
        W = int(2 * half) + 4
        H = max(f.height for f in frames) + 4
        strip = Image.new('RGBA', (W * len(frames), H), (0, 0, 0, 0))
        for i, (f, a) in enumerate(zip(frames, anchors)):
            strip.alpha_composite(f, (i * W + int(W / 2 - a), H - 2 - f.height))
        strip.save(OUT / f'{pose}.png', optimize=True)
        manifest['assets'][f'{sc.CHAR}@{pose}'] = {
            'src': f'source/characters/chief/{pose}.png', 'kind': 'anim', 'key': False, 'optional': True,
            'frames': len(frames), 'ref': ref_h,
        }
        print(f'  {pose}: {len(frames)} khung, {W}x{H}')
    sl.save_manifest(manifest)
    print(f'chiều cao đứng chuẩn của ảnh mới = {ref_h}px (ref của các dải mới)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
