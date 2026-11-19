#!/usr/bin/env python3
"""Cắt các sprite sheet Gemini (docs/06_GEMINI_SHEET_PROMPTS.md) thành file đúng ID cho renderer.

Cách dùng (cần Pillow:  pip install pillow):
  python3 tools/slice_sheets.py                 # xử lý mọi sheet có trong assets/hd/source/sheets/
  python3 tools/slice_sheets.py S01 S03         # chỉ các sheet chỉ định
  python3 tools/slice_sheets.py S01 --dry-run   # chỉ phát hiện + ghi ảnh debug, không ghi asset
  python3 tools/slice_sheets.py --force         # cho phép ghi đè file asset đã có (mặc định KHÔNG, để bảo vệ ảnh mẫu đã duyệt)

Kết quả:
  assets/hd/source/<nhóm>/<ID>.png   (giữ nguyên nền xanh: loader runtime tự tách nền, như 3 ảnh mẫu)
  assets/hd/manifest.json            (thêm mục `optional`, không sửa mục đã có)
  assets/hd/source/ui/*.png          (UI: đã tách nền sẵn thành PNG trong suốt) + ui/index.json
  assets/hd/source/sheets/_debug/    (ảnh vẽ khung phát hiện được — xem khi số ô không khớp)
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
HD = ROOT / 'assets' / 'hd'
SHEETS = HD / 'source' / 'sheets'

# ---------------------------------------------------------------------------------------------
# Spec: mỗi sheet = danh sách HÀNG; mỗi hàng = danh sách (id, số ô, kind). Các ô của một hàng được
# gán theo thứ tự trái → phải. kind: dir5 / strip (gộp N ô thành 1 file) / building / sprite (1 ô).
# ---------------------------------------------------------------------------------------------
Row = list  # list[tuple[str, int, str]]

SPECS: dict[str, dict] = {
    'S01': {
        'file': 'S01_characters_civil.png', 'group': 'characters',
        'rows': [[('chr_villager_m', 5, 'dir5')], [('chr_villager_f', 5, 'dir5')], [('chr_child', 5, 'dir5')], [('chr_chief', 5, 'dir5')]],
    },
    'S02': {
        'file': 'S02_characters_roles.png', 'group': 'characters',
        'rows': [[('chr_warrior', 5, 'dir5')], [('chr_shaman', 5, 'dir5')], [('chr_scout', 5, 'dir5')],
                 [('chr_enemy_m', 5, 'dir5')], [('chr_enemy_chief', 5, 'dir5')], [('chr_jafar', 5, 'dir5')]],
    },
    'S03': {
        'file': 'S03_buildings_core.png', 'group': 'buildings',
        'rows': [[('bld_hut_l1', 1, 'building'), ('bld_hut_l2', 1, 'building'), ('bld_chief_hut', 1, 'building')],
                 [('bld_store', 1, 'building'), ('bld_kitchen_l1', 1, 'building'), ('bld_armoury_l1', 1, 'building')]],
    },
    'S04': {
        'file': 'S04_buildings_special.png', 'group': 'buildings',
        'rows': [[('bld_gym_l1', 1, 'building'), ('bld_range_l1', 1, 'building'), ('bld_disco_l1', 1, 'building'), ('bld_sanctuary_l1', 1, 'building')],
                 [('bld_pia_l1', 1, 'building'), ('bld_nursery_l1', 1, 'building'), ('bld_tower_l1', 1, 'building'), ('bld_campfire', 1, 'sprite')]],
    },
    'S05': {
        'file': 'S05_buildings_upgrades.png', 'group': 'buildings',
        'rows': [[(i, 1, 'building') for i in ('bld_kitchen_l2', 'bld_armoury_l2', 'bld_gym_l2', 'bld_range_l2', 'bld_disco_l2')],
                 [(i, 1, 'building') for i in ('bld_sanctuary_l2', 'bld_pia_l2', 'bld_nursery_l2', 'bld_tower_l2', 'bld_hut_l3')],
                 [(i, 1, 'sprite') for i in ('bld_site_s_plot', 'bld_site_m_frame', 'bld_site_l_rubble', 'bld_site_m_plot', 'bld_site_l_frame')]],
    },
    'S06': {
        'file': 'S06_nature.png', 'group': 'nature',
        'rows': [[('nat_tree_broadleaf', 4, 'strip'), ('nat_stump', 1, 'sprite'), ('nat_felled', 1, 'sprite')],
                 [('nat_tree_conifer', 4, 'strip'), ('nat_boulder_a', 1, 'sprite'), ('nat_boulder_b', 1, 'sprite')],
                 [('nat_tree_jungle', 3, 'strip'), ('nat_tree_acacia', 1, 'sprite'), ('nat_tree_dead', 1, 'sprite'), ('nat_shrub', 1, 'sprite')],
                 [('nat_berrybush', 3, 'strip'), ('nat_plants', 3, 'strip')],
                 [('nat_rock_quarry', 3, 'strip'), ('nat_bones', 3, 'strip')],
                 [('nat_rock_pillar', 1, 'sprite'), ('nat_cactus', 2, 'strip'), ('nat_reeds', 2, 'strip'), ('nat_love_nest', 1, 'sprite')]],
    },
    'S07': {
        'file': 'S07_animals.png', 'group': 'animals',
        'rows': [[('ani_boar', 5, 'dir5')], [('ani_tiger', 5, 'dir5')],
                 [('ani_boar_carcass', 3, 'strip'), ('ani_tiger_carcass', 1, 'sprite'), ('ani_mammoth', 1, 'sprite')]],
    },
}

TERRAIN = {
    'file': 'S08_terrain.png', 'group': 'terrain', 'cols': 3, 'rows': 3,
    'ids': ['ter_grass', 'ter_grass_dry', 'ter_dirt', 'ter_forest_floor', 'ter_sand', 'ter_wasteland', 'ter_rock', 'ter_shore', 'ter_water'],
}

ICONS = {
    'file': 'S10_icons_items.png', 'cols': 8, 'rows': 6,
    'ids': [
        'res_food', 'res_wood', 'res_stone', 'res_bone', 'stat_population', 'stat_space', 'stat_happiness', 'stat_hp',
        'skill_melee', 'skill_throw', 'skill_scout', 'skill_harvest', 'skill_build', 'skill_smith', 'skill_cook', 'skill_witch',
        'skill_dj', 'skill_heal', 'stat_hunger', 'stat_tired', 'stat_speed', 'job_guard', 'job_idle', 'stat_cargo',
        'item_club', 'item_stone', 'item_spear', 'item_axe', 'item_mace', 'item_tomahawk', 'item_trap_net', 'item_trap_spring',
        'cargo_logs', 'cargo_stone', 'cargo_meat', 'cargo_berries', 'cargo_plants', 'cargo_fish', 'cargo_bones', 'cargo_meal',
        'cmd_build', 'cmd_call_to_arms', 'cmd_form_up', 'cmd_upgrade', 'cmd_repair', 'cmd_demolish', 'item_trap_pit', 'prop_rally_flag',
    ],
}

# Ngưỡng nền xanh chroma (nền thực tế không thuần #00FF00: khoảng (3,255,6)…(40,226,30)).
BG_G_MIN, BG_RB_MAX = 190, 100
REDUCE = 6          # phát hiện ô trên ảnh thu nhỏ 1/6 cho nhanh
GAP_PX = 3          # khe hở (ở ảnh thu nhỏ) được coi là cùng một vật thể (dụng cụ, cành rời…)
MARGIN = 12         # lề (px, ảnh gốc) khi cắt


def object_mask(im: Image.Image) -> Image.Image:
    """'L' mask: 255 = vật thể (không phải nền xanh)."""
    r, g, b = im.convert('RGB').split()
    bg = ImageChops.darker(ImageChops.darker(r.point(lambda v: 255 if v < BG_RB_MAX else 0), b.point(lambda v: 255 if v < BG_RB_MAX else 0)),
                           g.point(lambda v: 255 if v > BG_G_MIN else 0))
    return ImageChops.invert(bg)


def components(mask: Image.Image, min_area_frac: float = 0.0004, gap: int = GAP_PX) -> list[tuple[int, int, int, int]]:
    """Bounding boxes (ảnh gốc) của các vùng vật thể rời nhau."""
    small = mask.reduce(REDUCE).point(lambda v: 255 if v > 40 else 0)
    k = gap * 2 + 1
    grown = small.filter(ImageFilter.MaxFilter(k if k % 2 == 1 else k + 1))
    w, h = grown.size
    px = grown.load()
    seen = bytearray(w * h)
    boxes: list[tuple[int, int, int, int]] = []
    min_area = max(4, int(w * h * min_area_frac))
    for sy in range(h):
        for sx in range(w):
            if px[sx, sy] == 0 or seen[sy * w + sx]:
                continue
            q = deque([(sx, sy)])
            seen[sy * w + sx] = 1
            x0 = x1 = sx
            y0 = y1 = sy
            area = 0
            while q:
                x, y = q.popleft()
                area += 1
                x0, x1, y0, y1 = min(x0, x), max(x1, x), min(y0, y), max(y1, y)
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny] and not seen[ny * w + nx]:
                        seen[ny * w + nx] = 1
                        q.append((nx, ny))
            if area < min_area:
                continue
            # tinh chỉnh bbox trên ảnh gốc (không bị nở bởi MaxFilter)
            pad = gap * REDUCE
            box = (max(0, x0 * REDUCE - pad), max(0, y0 * REDUCE - pad), min(mask.width, (x1 + 1) * REDUCE + pad), min(mask.height, (y1 + 1) * REDUCE + pad))
            tight = mask.crop(box).getbbox()
            if tight:
                boxes.append((box[0] + tight[0], box[1] + tight[1], box[0] + tight[2], box[1] + tight[3]))
    return boxes


def profile(mask: Image.Image, axis: str, box: tuple[int, int, int, int] | None = None) -> list[float]:
    """Số pixel vật thể (0..255 trung bình) theo từng hàng ('y') hoặc cột ('x') của vùng `box`."""
    m = mask.crop(box) if box else mask
    return list((m.resize((1, m.height), Image.Resampling.BOX) if axis == "y" else m.resize((m.width, 1), Image.Resampling.BOX)).tobytes())


def valley_cuts(prof: list[float], k: int) -> list[int]:
    """k-1 vị trí cắt: tâm của các khoảng nền xanh rộng nhất (không cần trống tuyệt đối); bổ sung bằng điểm thấp nhất nếu thiếu."""
    n = len(prof)
    if k <= 1 or n == 0:
        return []
    thr = 3.0 + 0.01 * max(prof)
    cands: list[tuple[float, int]] = []
    i = 0
    while i < n:
        if prof[i] <= thr:
            j = i
            while j < n and prof[j] <= thr:
                j += 1
            if i > 0 and j < n:  # bỏ lề ngoài cùng
                cands.append((float(j - i), (i + j) // 2))
            i = j
        else:
            i += 1
    chosen: list[int] = []
    min_sep = max(2, n // (k * 4))

    def take(items: list[tuple[float, int]]) -> None:
        for _, c in sorted(items, key=lambda t: -t[0]):
            if len(chosen) >= k - 1:
                return
            if all(abs(c - o) >= min_sep for o in chosen):
                chosen.append(c)

    take(cands)
    if len(chosen) < k - 1:  # không đủ khoảng trống: dùng điểm thấp nhất (ảnh bị dính nhau)
        w = max(1, n // 200)
        smooth = [sum(prof[max(0, t - w):t + w + 1]) / len(prof[max(0, t - w):t + w + 1]) for t in range(n)]
        take([(-smooth[t], t) for t in range(1, n - 1) if smooth[t] <= smooth[t - 1] and smooth[t] <= smooth[t + 1]])
    return sorted(chosen)


def segments(lo: int, hi: int, cuts: list[int]) -> list[tuple[int, int]]:
    pts = [lo] + [lo + c for c in cuts] + [hi]
    return [(pts[i], pts[i + 1]) for i in range(len(pts) - 1)]


def tight(mask: Image.Image, box: tuple[int, int, int, int]) -> tuple[int, int, int, int] | None:
    bb = mask.crop(box).getbbox()
    return None if bb is None else (box[0] + bb[0], box[1] + bb[1], box[0] + bb[2], box[1] + bb[3])


def layout_sheet(mask: Image.Image, rows_spec: list) -> list[list[tuple[int, int, int, int]]]:
    """Với mỗi hàng của spec trả về bbox của từng mục (id). Dựa trên số hàng/số ô kỳ vọng, không dựa trên khe hở tuyệt đối."""
    w, h = mask.size
    row_cuts = valley_cuts(profile(mask, 'y'), len(rows_spec))
    out: list[list[tuple[int, int, int, int]]] = []
    for (y0, y1), row_spec in zip(segments(0, h, row_cuts), rows_spec):
        band = tight(mask, (0, y0, w, y1))
        if band is None:
            out.append([])
            continue
        if len(row_spec) == 1:  # nhân vật 5 hướng / dải: cả hàng là một ảnh (loader tự tách theo cột)
            out.append([band])
            continue
        n_items = sum(n for _, n, _ in row_spec)
        col_cuts = valley_cuts(profile(mask, 'x', (0, band[1], w, band[3])), n_items)
        items = [tight(mask, (x0, band[1], x1, band[3])) for x0, x1 in segments(0, w, col_cuts)]
        boxes, i = [], 0
        for _, n, _ in row_spec:
            chunk = [b for b in items[i:i + n] if b is not None]
            i += n
            boxes.append(union(chunk) if chunk else band)
        out.append(boxes)
    return out


def row_groups(boxes: list[tuple[int, int, int, int]], nrows: int) -> list[list[tuple[int, int, int, int]]] | None:
    """Gom vật thể thành `nrows` hàng bằng cách cắt ở các khoảng nhảy lớn nhất của đường chân (đáy)."""
    if len(boxes) < nrows:
        return None
    by_base = sorted(boxes, key=lambda b: b[3])
    if nrows == 1:
        return [sorted(by_base, key=lambda b: b[0])]
    gaps = sorted(range(1, len(by_base)), key=lambda i: by_base[i][3] - by_base[i - 1][3], reverse=True)[:nrows - 1]
    cuts = [0] + sorted(gaps) + [len(by_base)]
    return [sorted(by_base[cuts[i]:cuts[i + 1]], key=lambda b: b[0]) for i in range(nrows)]


def split_row(row_boxes: list[tuple[int, int, int, int]], row_spec: list, size: tuple[int, int]) -> list[tuple[int, int, int, int]] | None:
    """Trả về bbox cho từng mục (id) của hàng, hoặc None nếu không suy ra được."""
    needed = sum(n for _, n, _ in row_spec)
    if not row_boxes:
        return None
    if len(row_boxes) == needed:
        out, i = [], 0
        for _, n, _ in row_spec:
            out.append(union(row_boxes[i:i + n]))
            i += n
        return out
    if len(row_spec) == 1:  # vd. 5 hướng bị dính nhau: cả hàng là một ảnh, loader sẽ tách theo cột
        return [union(row_boxes)]
    # nhiều mục nhưng số ô không khớp: chia hàng theo tỉ lệ số khung của mỗi mục
    u = union(row_boxes)
    total, acc, out = needed, 0, []
    for _, n, _ in row_spec:
        x0 = u[0] + (u[2] - u[0]) * acc // total
        acc += n
        out.append((x0, u[1], u[0] + (u[2] - u[0]) * acc // total, u[3]))
    return out


def grid_fallback(size: tuple[int, int], cols: int, rows: int) -> list[list[tuple[int, int, int, int]]]:
    w, h = size
    return [[(int(c * w / cols), int(r * h / rows), int((c + 1) * w / cols), int((r + 1) * h / rows)) for c in range(cols)] for r in range(rows)]


def union(bs: list[tuple[int, int, int, int]]) -> tuple[int, int, int, int]:
    return (min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs))


def padded(box: tuple[int, int, int, int], size: tuple[int, int]) -> tuple[int, int, int, int]:
    return (max(0, box[0] - MARGIN), max(0, box[1] - MARGIN), min(size[0], box[2] + MARGIN), min(size[1], box[3] + MARGIN))


def debug_overlay(im: Image.Image, boxes: list[tuple[int, int, int, int]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    dbg = im.convert('RGB').copy()
    d = ImageDraw.Draw(dbg)
    lw = max(2, im.width // 600)
    for i, b in enumerate(boxes):
        d.rectangle(b, outline=(255, 0, 255), width=lw)
        d.text((b[0] + 4, b[1] + 4), str(i), fill=(255, 255, 0))
    scale = min(1.0, 1600 / max(dbg.size))
    dbg.resize((int(dbg.width * scale), int(dbg.height * scale))).save(path)


def make_seamless(tile: Image.Image) -> Image.Image:
    """Làm ô texture lát liền mạch: trộn ảnh với bản dịch nửa ô bằng mặt nạ sin² (tâm = ảnh gốc, mép = bản dịch)."""
    n = min(tile.size)
    tile = tile.crop((0, 0, n, n)).convert('RGB')
    ramp = Image.new('L', (n, 1))
    ramp.putdata([int(255 * math.sin(math.pi * (i + 0.5) / n) ** 2) for i in range(n)])
    mx = ramp.resize((n, n))
    my = ramp.transpose(Image.Transpose.ROTATE_90).resize((n, n))
    mask = ImageChops.multiply(mx, my)
    return Image.composite(tile, ImageChops.offset(tile, n // 2, n // 2), mask)


def key_out(im: Image.Image) -> Image.Image:
    """Tách nền xanh thành PNG trong suốt (UI): flood-fill từ mép (g - max(r,b) > 110, g > 195), cộng các "túi" nền thuần bị bao kín
    (tâm khung, vòng tròn: g>215, r,b<70) — giữ nguyên màu xanh của chính vật thể (ngọc, thanh máu) — rồi làm mềm viền + khử ám xanh."""
    rgb = im.convert('RGB')
    w, h = rgb.size
    px = rgb.load()
    bg = bytearray(w * h)

    def is_bg(x: int, y: int) -> bool:
        # backdrop is a bright, nearly pure green (~(3,250,18)); object greens (leaves, gems) are darker
        r, g, b = px[x, y]
        return g > 195 and g - max(r, b) > 110

    stack: list[tuple[int, int]] = []

    def push(x: int, y: int) -> None:
        if not bg[y * w + x] and is_bg(x, y):
            bg[y * w + x] = 1
            stack.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)
    def flood() -> None:
        while stack:
            x, y = stack.pop()
            if x > 0:
                push(x - 1, y)
            if x < w - 1:
                push(x + 1, y)
            if y > 0:
                push(x, y - 1)
            if y < h - 1:
                push(x, y + 1)

    flood()
    # enclosed pure-backdrop pockets (frame centres): seed from very pure pixels, then grow through the soft edge
    for y in range(h):
        for x in range(w):
            if not bg[y * w + x]:
                r, g, b = px[x, y]
                if g > 215 and r < 70 and b < 70:
                    bg[y * w + x] = 1
                    stack.append((x, y))
    flood()
    out = Image.new('RGBA', (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if bg[y * w + x]:
                op[x, y] = (r, g, b, 0)
                continue
            near = (x > 0 and bg[y * w + x - 1]) or (x < w - 1 and bg[y * w + x + 1]) or (y > 0 and bg[(y - 1) * w + x]) or (y < h - 1 and bg[(y + 1) * w + x])
            if near and g > 130 and g - max(r, b) > 40:
                # antialiased fringe next to the backdrop: fade out by how close it is to the backdrop green, de-spill
                op[x, y] = (r, min(g, max(r, b) + 30), b, int(255 * max(0.0, min(1.0, 1 - (g - 130) / 90))))
            else:
                op[x, y] = (r, g, b, 255)
    return out


def load_manifest() -> dict:
    p = HD / 'manifest.json'
    return json.loads(p.read_text()) if p.exists() else {'version': 1, 'assets': {}}


def save_manifest(m: dict) -> None:
    (HD / 'manifest.json').write_text(json.dumps(m, indent=2) + '\n')


def process_sprite_sheet(code: str, spec: dict, args: argparse.Namespace, manifest: dict) -> None:
    path = args.src / spec['file']
    if not path.exists():
        print(f'[{code}] bỏ qua: chưa có {path.name}')
        return
    im = Image.open(path).convert('RGB')
    mask = object_mask(im)
    layout = layout_sheet(mask, spec['rows'])
    boxes = [b for row in layout for b in row]
    debug_overlay(im, boxes, SHEETS / '_debug' / f'{code}.png')
    out_dir = HD / 'source' / spec['group']
    made = 0
    for row_spec, item_boxes in zip(spec['rows'], layout):
        if not item_boxes:
            print(f'  hàng {[i for i, _, _ in row_spec]}: không có vật thể → bỏ qua')
            continue
        for (asset_id, n, kind), box in zip(row_spec, item_boxes):
            crop = im.crop(padded(box, im.size))
            dest = out_dir / f'{asset_id}.png'
            existed = dest.exists()
            if args.dry_run:
                print(f'  {asset_id}: {crop.size} {"(đã có, sẽ bỏ qua)" if existed and not args.force else ""}')
                continue
            if existed and not args.force:
                print(f'  giữ nguyên {dest.relative_to(ROOT)} (dùng --force để ghi đè)')
            else:
                out_dir.mkdir(parents=True, exist_ok=True)
                crop.save(dest)
                made += 1
            entry = {'src': f'source/{spec["group"]}/{asset_id}.png', 'kind': kind, 'optional': True}
            if kind in ('dir5', 'strip'):
                entry['frames'] = n
            manifest['assets'].setdefault(asset_id, entry)
    print(f'[{code}] {len(boxes)} mục, ghi {made} file' + (' (dry-run)' if args.dry_run else ''))


def process_terrain(args: argparse.Namespace, manifest: dict) -> None:
    path = args.src / TERRAIN['file']
    if not path.exists():
        print('[S08] bỏ qua: chưa có', path.name)
        return
    im = Image.open(path).convert('RGB')
    cells = grid_fallback(im.size, TERRAIN['cols'], TERRAIN['rows'])
    out_dir = HD / 'source' / TERRAIN['group']
    made = 0
    for idx, asset_id in enumerate(TERRAIN['ids']):
        box = cells[idx // TERRAIN['cols']][idx % TERRAIN['cols']]
        # cắt bớt 1.5% mép mỗi ô để loại viền/đường kẻ model có thể vẽ
        inset = int(0.015 * (box[2] - box[0]))
        tile = make_seamless(im.crop((box[0] + inset, box[1] + inset, box[2] - inset, box[3] - inset)))
        dest = out_dir / f'{asset_id}.png'
        if args.dry_run:
            print(f'  {asset_id}: {tile.size}')
            continue
        if dest.exists() and not args.force:
            print(f'  giữ nguyên {dest.relative_to(ROOT)}')
        else:
            out_dir.mkdir(parents=True, exist_ok=True)
            tile.save(dest)
            made += 1
        manifest['assets'].setdefault(asset_id, {'src': f'source/terrain/{asset_id}.png', 'kind': 'texture', 'key': False, 'worldSize': 704, 'optional': True})
    print(f'[S08] ghi {made} texture' + (' (dry-run)' if args.dry_run else ''))


def process_icons(args: argparse.Namespace) -> None:
    path = args.src / ICONS['file']
    if not path.exists():
        print('[S10] bỏ qua: chưa có', path.name)
        return
    im = Image.open(path).convert('RGB')
    cells = grid_fallback(im.size, ICONS['cols'], ICONS['rows'])
    out_dir = HD / 'source' / 'ui' / 'icons'
    index: dict[str, str] = {}
    dbg: list[tuple[int, int, int, int]] = []
    made = 0
    for idx, name in enumerate(ICONS['ids']):
        cell = cells[idx // ICONS['cols']][idx % ICONS['cols']]
        sub = im.crop(cell)
        bb = object_mask(sub).getbbox()
        if not bb:
            continue
        box = padded((cell[0] + bb[0], cell[1] + bb[1], cell[0] + bb[2], cell[1] + bb[3]), im.size)
        dbg.append(box)
        index[name] = f'icons/{name}.png'
        if args.dry_run:
            continue
        out_dir.mkdir(parents=True, exist_ok=True)
        icon = key_out(im.crop(box))
        icon.thumbnail((128, 128), Image.Resampling.LANCZOS)  # shown at 24-56 px; 128 keeps HiDPI sharp and the file small
        icon.save(out_dir / f'{name}.png', optimize=True)
        made += 1
    debug_overlay(im, dbg, SHEETS / '_debug' / 'S10.png')
    if not args.dry_run:
        (HD / 'source' / 'ui' / 'index.json').write_text(json.dumps(index, indent=2) + '\n')
    print(f'[S10] ghi {made} icon (PNG trong suốt) vào assets/hd/source/ui/icons/' + (' (dry-run)' if args.dry_run else ''))


UI_CHROME_NAMES = [
    'panel_menu', 'plank_title', 'panel_stone',
    'btn_small_normal', 'btn_small_hover', 'btn_small_pressed',
    'btn_wide_normal', 'btn_wide_hover', 'btn_wide_pressed',
    'btn_round_normal', 'btn_round_hover', 'btn_round_pressed',
    'btn_square_normal', 'btn_square_hover', 'btn_square_pressed',
    'bar_frame', 'bars_stack', 'bubble_hide', 'tooltip_bone', 'corner_ornaments',
    'frame_round', 'frame_square', 'select_ring',
    'cursor_default', 'cursor_go', 'cursor_attack', 'cursor_gather', 'cursor_build', 'cursor_forbidden',
]


def save_cursor(name: str, piece: Image.Image) -> None:
    """40 px CSS-cursor copy + hotspot (arrows: the opaque pixel nearest the top-left; others: centre)."""
    cur = piece.copy()
    cur.thumbnail((40, 40), Image.Resampling.LANCZOS)
    out = HD / 'source' / 'ui' / 'cursors'
    out.mkdir(parents=True, exist_ok=True)
    cur.save(out / f'{name}.png', optimize=True)
    alpha = cur.getchannel('A')
    if name in ('cursor_default', 'cursor_go'):
        px = alpha.load()
        best = min(((x + y, x, y) for y in range(cur.height) for x in range(cur.width) if px[x, y] > 128), default=(0, 0, 0))
        hot = [best[1], best[2]]
    elif name == 'cursor_gather':
        hot = [cur.width // 2, 4]
    else:
        hot = [cur.width // 2, cur.height // 2]
    idx_path = out / 'index.json'
    idx = json.loads(idx_path.read_text()) if idx_path.exists() else {}
    idx[name.removeprefix('cursor_')] = {'file': f'cursors/{name}.png', 'hotspot': hot, 'size': list(cur.size)}
    idx_path.write_text(json.dumps(idx, indent=2) + '\n')


def process_ui_chrome(args: argparse.Namespace) -> None:
    """S09: 30 thành phần rời (khoảng cách hẹp → gap=0). Đặt tên theo thứ tự dải/ x; 2 mảnh hoa văn góc gộp làm một;
    `bars_stack` (3 thanh xếp dọc) được cắt thành bar_green / bar_orange / bar_blue."""
    path = args.src / 'S09_ui_chrome.png'
    if not path.exists():
        print('[S09] bỏ qua: chưa có', path.name)
        return
    im = Image.open(path).convert('RGB')
    boxes = components(object_mask(im), min_area_frac=0.0002, gap=0)

    def band(b: tuple[int, int, int, int]) -> int:
        cy = (b[1] + b[3]) / 2 / im.height  # 0..1 — dải theo bố cục S09 (5 hàng)
        return 0 if cy < 0.26 else 1 if cy < 0.40 else 2 if cy < 0.57 else 3 if cy < 0.80 else 4

    boxes = sorted(boxes, key=lambda b: (band(b), b[0], b[1]))
    debug_overlay(im, boxes, SHEETS / '_debug' / 'S09.png')
    if len(boxes) != 30:
        print(f'[S09] CẢNH BÁO: tìm thấy {len(boxes)} thành phần, kỳ vọng 30 → không ghi (xem _debug/S09.png).')
        return
    merged = {**{i: b for i, b in enumerate(boxes)}}
    merged[19] = union([boxes[19], boxes[20]])
    ordered = [merged[i] for i in range(30) if i != 20]
    out_dir = HD / 'source' / 'ui' / 'chrome'
    index: dict[str, str] = {}
    made = 0
    pad = 6

    def save(name: str, box: tuple[int, int, int, int]) -> None:
        nonlocal made
        index[name] = f'chrome/{name}.png'
        if args.dry_run:
            return
        out_dir.mkdir(parents=True, exist_ok=True)
        piece = key_out(im.crop((max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad))))
        piece.save(out_dir / f'{name}.png')
        made += 1
        if name.startswith('cursor_'):
            save_cursor(name, piece)

    for name, box in zip(UI_CHROME_NAMES, ordered):
        if name == 'bars_stack':
            third = (box[3] - box[1]) / 3
            for k, colour in enumerate(('bar_green', 'bar_orange', 'bar_blue')):
                save(colour, (box[0], int(box[1] + k * third) + 3, box[2], int(box[1] + (k + 1) * third) - 3))
            continue
        save(name, box)
    if not args.dry_run:
        (out_dir / 'index.json').write_text(json.dumps(index, indent=2) + '\n')
    print(f'[S09] {len(index)} thành phần UI → assets/hd/source/ui/chrome/*.png (PNG trong suốt)' + (' (dry-run)' if args.dry_run else ''))



BUILDING_THUMBS = ['bld_armoury_l1', 'bld_gym_l1', 'bld_hut_l1', 'bld_chief_hut', 'bld_kitchen_l1', 'bld_range_l1', 'bld_store', 'bld_disco_l1', 'bld_sanctuary_l1', 'bld_pia_l1', 'bld_nursery_l1', 'bld_tower_l1']


def make_building_thumbs(args: argparse.Namespace) -> None:
    """Transparent 160 px thumbnails of the buildings for the HUD (index = building type) → source/ui/buildings/<type>.png."""
    out = HD / 'source' / 'ui' / 'buildings'
    made = 0
    for t, asset in enumerate(BUILDING_THUMBS):
        src = HD / 'source' / 'buildings' / f'{asset}.png'
        if not src.exists():
            continue
        im = Image.open(src).convert('RGB')
        im.thumbnail((320, 320), Image.Resampling.LANCZOS)
        keyed = key_out(im)
        bb = keyed.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        if bb:
            keyed = keyed.crop(bb)
        keyed.thumbnail((160, 160), Image.Resampling.LANCZOS)
        if not args.dry_run:
            out.mkdir(parents=True, exist_ok=True)
            keyed.save(out / f'{t}.png', optimize=True)
            made += 1
    print(f'[thumbs] {made} ảnh công trình cho HUD → assets/hd/source/ui/buildings/<loại>.png')


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('sheets', nargs='*', help='S01..S10, THUMBS (mặc định: tất cả)')
    ap.add_argument('--src', type=Path, default=SHEETS, help='thư mục chứa sheet (mặc định assets/hd/source/sheets)')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--out', type=Path, default=None, help='thư mục gốc hd/ để ghi (mặc định assets/hd; dùng khi thử nghiệm)')
    args = ap.parse_args()
    if args.out is not None:
        globals()['HD'] = args.out
        globals()['SHEETS'] = args.out / 'source' / 'sheets'
    want = {s.upper() for s in args.sheets} or {'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10', 'THUMBS'}
    manifest = load_manifest()
    for code, spec in SPECS.items():
        if code in want:
            process_sprite_sheet(code, spec, args, manifest)
    if 'S08' in want:
        process_terrain(args, manifest)
    if 'S09' in want:
        process_ui_chrome(args)
    if 'S10' in want:
        process_icons(args)
    if 'THUMBS' in want or {'S03', 'S04'} & want:
        make_building_thumbs(args)
    if not args.dry_run:
        save_manifest(manifest)
    return 0


if __name__ == '__main__':
    sys.exit(main())
