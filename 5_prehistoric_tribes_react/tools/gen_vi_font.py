#!/usr/bin/env python3
"""Adds Vietnamese combining-mark glyphs to the game's bitmap font.

Run from 5_prehistoric_tribes_react/:  python3 tools/gen_vi_font.py
Idempotent: reads the pristine font/tables from tools/orig/ (created on first run).

Layout (see src/engine/ptCore.js, drawGlyph):
  glyph code = row*30 + col; accents are row0 col>=14 and (new) row2 col>=20.
  Edge tables use a stride of 31 entries per row (was 21).
"""
import json, os, shutil, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEET = os.path.join(ROOT, 'public/res/images/sprites/25.png')
DATA = os.path.join(ROOT, 'public/res/data/game-data.json')
ORIG = os.path.join(ROOT, 'tools/orig')
os.makedirs(ORIG, exist_ok=True)
for src, name in ((SHEET, '25.png'), (DATA, 'game-data.json')):
    dst = os.path.join(ORIG, name)
    if not os.path.exists(dst):
        shutil.copy(src, dst)

sheet = Image.open(os.path.join(ORIG, '25.png')).convert('RGBA')
data = json.load(open(os.path.join(ORIG, 'game-data.json')))

COL = {'a': (49, 30, 23, 255), 'e': (245, 244, 0, 255), 'c': (146, 137, 61, 255), 'd': (169, 159, 73, 255)}
STRIDE_OLD, STRIDE_NEW = 21, 31

def u8(v): return v & 255
old_edges = [u8(v) for v in data['tables']['fontGlyphEdges']]
old_num = [u8(v) for v in data['tables']['numberGlyphEdges']]
row_edges = [old_edges[r * STRIDE_OLD:(r + 1) * STRIDE_OLD] for r in range(3)]

def grab(x0, x1, y0=0, h=12):
    return [[sheet.getpixel((x, y0 + y)) for x in range(x0, x1)] for y in range(h)]

def sprite_from_mask(mask):
    """mask: list of strings, '#' = yellow. Adds a dark outline + olive shadow like the stock accents."""
    mh, mw = len(mask), len(mask[0])
    W, H = mw + 3, mh + 3
    g = [['.'] * W for _ in range(H)]
    ys = {(x + 1, y + 1) for y, r in enumerate(mask) for x, c in enumerate(r) if c == '#'}
    for (x, y) in ys:
        g[y][x] = 'e'
    for (x, y) in ys:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            p = (x + dx, y + dy)
            if p not in ys and g[p[1]][p[0]] == '.':
                g[p[1]][p[0]] = 'a'
    for y in range(H):
        for x in range(W):
            if g[y][x] == '.' and x > 0 and y > 0 and g[y - 1][x - 1] in 'ea' and (g[y][x - 1] in 'ea' or g[y - 1][x] in 'ea'):
                g[y][x] = 'd' if y <= 1 else 'c'
    return g

def px(g):  # char grid -> pixel grid
    return [[COL.get(c, (255, 255, 255, 0)) for c in row] for row in g]

def hcat(*grids):
    h = max(len(g) for g in grids)
    out = [[] for _ in range(h)]
    for g in grids:
        w = len(g[0])
        for y in range(h):
            out[y] += g[y] if y < len(g) else [(255, 255, 255, 0)] * w
    return out

def blank(w, h): return [[(255, 255, 255, 0)] * w for _ in range(h)]
def pad_to(g, w, h):
    g = [r[:] for r in g] + [[(255, 255, 255, 0)] * len(g[0]) for _ in range(h - len(g))]
    return [r + [(255, 255, 255, 0)] * (w - len(r)) for r in g]

# stock marks (copied from the original sheet, rows 0..4)
E = row_edges[0]
stock_circ = [r[:] for r in grab(E[19], E[20], 0, 5)]       # circumflex, w7 h5

# new tone masks (2x2) and marks
TONE = {
    'acute': ['.#', '#.'],
    'grave': ['#.', '.#'],
    'hook': ['##', '.#'],
    'tilde': ['.##', '##.'],
}
BREVE = ['#...#', '.###.']
HOOK_ABOVE = TONE['hook']
DOT = ['##', '##']

def tone_sprite(t): return [r[:-1] for r in px(sprite_from_mask(TONE[t]))]
breve_g = px(sprite_from_mask(BREVE))                       # w8 -> trim to 7
breve_g = [r[:7] for r in breve_g]

def top_placed(g, h=12, w=None):
    w = w or len(g[0])
    return pad_to(g, w, h)

glyphs = {}   # (row, col) -> pixel grid (h rows of the band), width implied
off = {}      # (row, col) -> raise offset

# ---- row 0
glyphs[(0, 20)] = top_placed(breve_g);                   off[(0, 20)] = 4
glyphs[(0, 21)] = top_placed(px(sprite_from_mask(HOOK_ABOVE))[:4], 12, 5); off[(0, 21)] = 4
dot_g = px(sprite_from_mask(DOT))[:4]
g = blank(5, 12)
for y in range(len(dot_g)):
    for x in range(min(5, len(dot_g[0]))):
        g[8 + y][x] = dot_g[y][x]
glyphs[(0, 22)] = g;                                      off[(0, 22)] = -3
# horn: yellow bump at the right edge of the letter (w11 so it sits on the glyph's right side)
horn = blank(11, 12)
for (x, y, c) in ((9, 2, 'e'), (9, 3, 'e'), (9, 1, 'a'), (10, 2, 'a'), (10, 3, 'a'), (9, 4, 'a'), (10, 1, 'd'), (10, 4, 'c')):
    horn[y][x] = COL[c]
glyphs[(0, 23)] = horn;                                   off[(0, 23)] = 0
# stroke for đ: dark crossbar through the stem of D
stroke = blank(9, 12)
for x in range(0, 7):
    stroke[5][x] = COL['a']
glyphs[(0, 24)] = stroke;                                 off[(0, 24)] = 0

def combo(base_g, tone, extra=0):
    t = tone_sprite(tone)
    return hcat(top_placed(base_g, 12), top_placed(t, 12))

circ_g = stock_circ
for i, t in enumerate(('acute', 'grave', 'hook', 'tilde')):
    glyphs[(0, 25 + i)] = combo(circ_g, t);               off[(0, 25 + i)] = 5
for i, t in enumerate(('acute', 'grave', 'hook', 'tilde')):
    glyphs[(2, 20 + i)] = [r for r in pad_to(combo(breve_g, t), len(combo(breve_g, t)[0]), 14)]
    off[(2, 20 + i)] = 4

# ---- assemble sheet + edges
new_edges = [list(e) for e in row_edges]
for r in range(3):
    new_edges[r] = new_edges[r] + [new_edges[r][-1]] * (STRIDE_NEW - len(new_edges[r]))

W_SHEET = 256
out = Image.new('RGBA', (W_SHEET, sheet.height), (0, 0, 0, 0))
out.paste(sheet, (0, 0))
tops = [0, 12, 25]
heights = [12, 13, 14]
for r in (0, 2):
    x = row_edges[r][-1]
    for c in range(20, 30):
        new_edges[r][c] = x
        g = glyphs.get((r, c))
        if g is not None:
            w = len(g[0])
            for yy in range(min(len(g), heights[r])):
                for xx in range(w):
                    if g[yy][xx][3]:
                        out.putpixel((x + xx, tops[r] + yy), g[yy][xx])
            x += w
        new_edges[r][c + 1] = x
    # entries after the last slot stay at the final x
    for c in range(30, STRIDE_NEW):
        new_edges[r][c] = x
assert max(max(r) for r in new_edges) <= 255, new_edges
out.save(SHEET)

def sgn(v): return v - 256 if v > 127 else v
flat = [sgn(v) for r in new_edges for v in r]
data['tables']['fontGlyphEdges'] = flat
# number font: same stride
num_rows = [old_num[r * STRIDE_OLD:(r + 1) * STRIDE_OLD] for r in range(3)]
num_flat = []
for r in num_rows:
    r = r + [r[-1]] * (STRIDE_NEW - len(r))
    num_flat += [sgn(v) for v in r]
data['tables']['numberGlyphEdges'] = num_flat

# accent offsets: index = col-14 (row 0) / col-4 (row 2)
acc = list(data['tables']['accentOffsets'])
acc += [0] * (20 - len(acc))
for (r, c), v in off.items():
    acc[(c - 14) if r == 0 else (c - 4)] = v
data['tables']['accentOffsets'] = acc

# overlay characters (must be <128 and unused by text): see xa() in ptCore.js
OVERLAY = {  # char -> glyph code
    '"': 20, '%': 21, '(': 22, ')': 23, '{': 24,
    '\x11': 25, '\x12': 26, '\x13': 27, '\x14': 28,
    '\x15': 80, '\x16': 81, '\x1d': 82, '\x1e': 83,
}
cg = data['tables']['characterGlyphs']
for ch, code in OVERLAY.items():
    cg[ord(ch)] = code
data['tables']['characterGlyphs'] = cg
json.dump(data, open(DATA, 'w'), separators=(',', ':'))
print('ok; sheet', out.size, 'edges row0 end', new_edges[0][29], new_edges[0][30], 'row2 end', new_edges[2][23])
