#!/usr/bin/env python3
"""Cắt 3 sheet tư thế của TÙ TRƯỞNG (docs/08_CHIEF_POSE_SHEETS.md) thành chuỗi khung đã tách nền.

  python3 tools/slice_chief.py            # cắt + ghi assets/hd/source/characters/chief/*.png + manifest
  python3 tools/slice_chief.py --dry-run  # chỉ in số ô phát hiện + ảnh debug

Đầu vào (mặc định assets/hd/source/sheets/character/chief/): H1_chief_walk.png (hoặc CH1_...), CH2_chief_states.png,
CH3_chief_action.png (định dạng thực có thể là WEBP, Pillow tự nhận).
Đầu ra: mỗi (pose, hướng) một dải ngang N khung CÙNG KÍCH THƯỚC, nền trong suốt, chân chạm đáy, thân căn giữa →
renderer chỉ cần neo (giữa, đáy). Các sheet được quy về cùng tỉ lệ (theo bề rộng đầu) để không "phình/co" khi đổi tư thế.
"""
from __future__ import annotations

import argparse
import json
import statistics
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import slice_sheets as sl  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
HD = ROOT / 'assets' / 'hd'
SRC = HD / 'source' / 'sheets' / 'character' / 'chief'
OUT = HD / 'source' / 'characters' / 'chief'
CHAR = 'chr_chief'
STAND_REF = ('walk_S', 1)  # khung dùng để đo chiều cao đứng chuẩn

# (sheet candidates, cols, rows, [(pose, [(row, col), ...]), ...]) — row/col tính từ 1
DIRS = ['S', 'SE', 'E', 'NE', 'N']
SHEETS = [
    (['CH1_chief_walk.png', 'H1_chief_walk.png'], 6, 5, [(f'walk_{d}', [(r + 1, c + 1) for c in range(6)]) for r, d in enumerate(DIRS)]),
    (['CH2_chief_states.png'], 7, 5, [
        ('look', [(1, c) for c in range(1, 5)]),
        ('fidget', [(1, c) for c in range(5, 8)]),
        ('sit_down', [(2, 1), (2, 2), (2, 3)]),
        ('sit_rest', [(2, 4), (2, 5)]),
        ('eat', [(2, 6), (2, 7), (3, 1), (3, 2)]),
        ('sleep', [(3, 3), (3, 4)]),
        ('sad', [(3, 5), (3, 6), (3, 7)]),
        ('dance', [(4, c) for c in range(1, 5)]),
        ('cheer', [(4, c) for c in range(5, 8)]),
        ('stagger', [(5, c) for c in range(1, 4)]),
        ('die', [(5, c) for c in range(4, 8)]),
    ]),
    (['CH3_chief_action.png'], 7, 4, [
        ('melee_E', [(1, c) for c in range(1, 8)]),
        ('melee_S', [(2, c) for c in range(1, 8)]),
        ('throw_E', [(3, c) for c in range(1, 8)]),
        ('work_E', [(4, c) for c in range(1, 5)]),
        ('gather_S', [(4, c) for c in range(5, 8)]),
    ]),
]


def find_sheet(names: list[str]) -> Path | None:
    for n in names:
        if (SRC / n).exists():
            return SRC / n
    return None


def grid_cells(im: Image.Image, cols: int, rows: int) -> list[list[tuple[int, int, int, int]]]:
    """Tight boxes (rows x cols) found by valley cuts (rows, then columns inside each row band)."""
    mask = sl.object_mask(im)
    spec = [[('c', 1, 's')] * cols for _ in range(rows)]
    # layout_sheet merges a single-entry row into one box, so ask for `cols` separate items per row
    w, h = mask.size
    row_cuts = sl.valley_cuts(sl.profile(mask, 'y'), rows)
    out = []
    for (y0, y1) in sl.segments(0, h, row_cuts):
        band = sl.tight(mask, (0, y0, w, y1))
        if band is None:
            out.append([])
            continue
        col_cuts = sl.valley_cuts(sl.profile(mask, 'x', (0, band[1], w, band[3])), cols)
        items = []
        for x0, x1 in sl.segments(0, w, col_cuts):
            # keep the segment's full vertical band so frames of one row share a ground line
            tb = sl.tight(mask, (x0, band[1], x1, band[3]))
            items.append(tb)
        out.append(items)
    return out


def keyed_crop(im: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    pad = 6
    c = im.crop((max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad)))
    k = sl.key_out(c)
    bb = k.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    return k.crop(bb) if bb else k


def head_width(frame: Image.Image) -> int:
    a = frame.getchannel('A').point(lambda v: 255 if v > 24 else 0)
    top = a.crop((0, 0, a.width, max(1, int(a.height * 0.2)))).getbbox()
    return (top[2] - top[0]) if top else a.width


def anchor_x(frame: Image.Image) -> float:
    """Torso centroid (stable while arms/legs swing); lying poses use the bbox centre."""
    w, h = frame.size
    if w > 1.1 * h:
        return w / 2
    a = frame.getchannel('A').point(lambda v: 255 if v > 24 else 0)
    band = a.crop((0, int(h * 0.35), w, int(h * 0.7)))
    col = list(band.resize((w, 1), Image.Resampling.BOX).tobytes())
    tot = sum(col)
    return (sum(i * v for i, v in enumerate(col)) / tot + 0.5) if tot else w / 2


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()
    raw: dict[str, list[Image.Image]] = {}
    sheet_scale: dict[int, float] = {}
    head_by_sheet: dict[int, list[int]] = {}
    sheet_frames: dict[int, dict[str, list[Image.Image]]] = {}
    for si, (names, cols, rows, poses) in enumerate(SHEETS):
        path = find_sheet(names)
        if path is None:
            print(f'bỏ qua: thiếu {names[0]} trong {SRC}')
            continue
        im = Image.open(path).convert('RGB')
        cells = grid_cells(im, cols, rows)
        n_found = sum(1 for r in cells for c in r if c)
        print(f'[{path.name}] {im.size}: {n_found}/{cols * rows} ô')
        sl.debug_overlay(im, [c for r in cells for c in r if c], sl.SHEETS / '_debug' / f'chief_{si}.png')
        if args.dry_run:
            continue
        frames: dict[str, list[Image.Image]] = {}
        heads: list[int] = []
        for pose, idxs in poses:
            lst = []
            for (r, c) in idxs:
                box = cells[r - 1][c - 1] if r - 1 < len(cells) and c - 1 < len(cells[r - 1]) else None
                if box is None:
                    raise SystemExit(f'thiếu ô {pose} r{r}c{c}')
                f = keyed_crop(im, box)
                lst.append(f)
                heads.append(head_width(f))
            frames[pose] = lst
        sheet_frames[si] = frames
        head_by_sheet[si] = heads
    if args.dry_run or not sheet_frames:
        return 0
    # Scale sheets to a common standing height: H1 is the reference (walk_S frame 2); CH2 is matched through its
    # neutral front-facing frame (look #2); CH3 was generated at the same canvas size/scale as CH2, so it reuses CH2's factor.
    ref_stand = sheet_frames[0]['walk_S'][STAND_REF[1]].height
    sheet_scale[0] = 1.0
    if 1 in sheet_frames:
        sheet_scale[1] = ref_stand / sheet_frames[1]['look'][1].height
    if 2 in sheet_frames:
        sheet_scale[2] = sheet_scale.get(1, 1.0)
    print('tỉ lệ chuẩn hoá theo sheet:', {k: round(v, 3) for k, v in sheet_scale.items()})
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = sl.load_manifest()
    pose_info = {}
    ref_h = None
    for si, frames in sheet_frames.items():
        for pose, lst in frames.items():
            k = sheet_scale[si]
            scaled = [f.resize((max(1, round(f.width * k)), max(1, round(f.height * k))), Image.Resampling.LANCZOS) for f in lst]
            if pose == STAND_REF[0]:
                ref_h = scaled[STAND_REF[1]].height
            anchors = [anchor_x(f) for f in scaled]
            half = max(max(a, f.width - a) for a, f in zip(anchors, scaled))
            W = int(2 * half) + 4
            H = max(f.height for f in scaled) + 4
            strip = Image.new('RGBA', (W * len(scaled), H), (0, 0, 0, 0))
            for i, (f, a) in enumerate(zip(scaled, anchors)):
                strip.alpha_composite(f, (i * W + int(W / 2 - a), H - 2 - f.height))
            strip.save(OUT / f'{pose}.png', optimize=True)
            pose_info[pose] = {'frames': len(scaled), 'frameWidth': W, 'height': H}
    ref_h = ref_h or 200
    for pose, info in pose_info.items():
        manifest['assets'][f'{CHAR}@{pose}'] = {
            'src': f'source/characters/chief/{pose}.png', 'kind': 'anim', 'key': False, 'optional': True,
            'frames': info['frames'], 'ref': ref_h,
        }
    sl.save_manifest(manifest)
    (OUT / 'poses.json').write_text(json.dumps({'refHeight': ref_h, 'poses': pose_info}, indent=1) + '\n')
    print(f'ghi {len(pose_info)} chuỗi khung vào {OUT.relative_to(ROOT)}; chiều cao đứng chuẩn = {ref_h}px')
    return 0


if __name__ == '__main__':
    sys.exit(main())
