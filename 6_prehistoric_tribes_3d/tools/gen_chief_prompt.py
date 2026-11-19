#!/usr/bin/env python3
"""Sinh MỘT prompt tự chứa vẽ toàn bộ trạng thái của tù trưởng trong 1 ảnh 10x10 (docs/12_CHIEF_SINGLE_PROMPT.md)
+ tools/chief_single_sheet_spec.json (bảng tên ô cho tool cắt). Chạy: python3 tools/gen_chief_prompt.py"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_pose_prompts as g  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

# Mỗi hàng đúng 10 ô, không chia pose qua hàng: (pose, hướng, số khung)
ROWS = [
    [('walk', 'S', 4), ('walk', 'SE', 4), ('look', 'S', 2)],
    [('walk', 'E', 4), ('walk', 'NE', 4), ('stand', 'S', 1), ('stand', 'E', 1)],
    [('walk', 'N', 4), ('fidget', 'S', 2), ('sit_down', 'S', 2), ('sit_rest', 'S', 1), ('stand', 'N', 1)],
    [('eat', 'S', 3), ('sleep', 'S', 2), ('sad', 'S', 2), ('dance', 'S', 2), ('cheer', 'S', 1)],
    [('stagger', 'S', 2), ('die', 'S', 4), ('stab', 'E', 2), ('putdown', 'S', 1), ('pickup', 'S', 1)],
    [('melee', 'E', 5), ('melee', 'S', 3), ('trapped', 'S', 2)],
    [('throw', 'E', 4), ('chop', 'E', 3), ('mine', 'E', 3)],
    [('build', 'E', 3), ('forage', 'S', 3), ('butcher', 'E', 3), ('peek', 'S', 1)],
    [('cook', 'S', 2), ('fish', 'E', 4), ('sneak', 'E', 4)],
    [('hide', 'S', 3), ('carry', 'E', 4), ('chat', 'S', 3)],
]
LOOK3 = 'glance left / glance right'  # 'look' dùng 2 khung ở bản này
HIDE3 = 'crouching, pulling a leafy branch over himself / fully crouched under the leaves, only the eyes visible / rising, brushing leaves off'
OVERRIDE = {'look': LOOK3, 'hide': HIDE3,
            'stand': 'relaxed neutral stance, breathing',
            'fidget': 'hand rising to scratch the head / scratching, puzzled',
            'peek': 'crouched, peeking out cautiously, one hand shading the eyes'}

for i, r in enumerate(ROWS):
    assert sum(n for _, _, n in r) == 10, (i + 1, r)

legend = dict(g.LEGEND)
legend.update(g.TASK_LEGEND)
legend.update(OVERRIDE)
used = []
for r in ROWS:
    for p, _, _ in r:
        if p not in used:
            used.append(p)
pose_lines = '\n'.join(f'- {p}: {legend[p]}' for p in used)
rows_txt = '\n'.join(f'R{i + 1}: ' + ' | '.join(f'{p}_{d}×{n}' for p, d, n in r) for i, r in enumerate(ROWS))

PROMPT = f'''[Attach: the approved chief (chr_chief.png) and CH2_chief_states.png as the identity reference.]
Create ONE sprite sheet of the tribe Chief for a comedic Stone-Age village-builder game. Style: hand-painted HD 2D cartoon, clean dark-brown outline (#2B2014), cel shading with 2-3 tones, light from the upper-left, warm earthy palette, family friendly, no blood. No text, no labels, no grid lines, no ground shadows.

CHARACTER (identical in every cell, match the attachment EXACTLY): the Chief, comically fat with a big pot belly, lazy-proud face, big bushy beard, large white-and-dark feather headdress with a bone-skull band, tiger-skin cape, bone-tooth necklace, leopard-spotted loincloth, bare feet.

SHEET: ONE square image, 10 columns × 10 rows = 100 equal cells, highest resolution available. Flat pure chroma green #00FF00 background (no gradient), wide empty gutters, nothing touching or cropped. In every cell the SAME character at the SAME scale, full body, feet (or ground contact) on a common baseline per row. Lying poses (sleep, die) are drawn horizontal on the ground.
Hands: in melee/throw/stab poses closed fists (weapons are drawn separately); in work poses draw only the simple hand-held tool or carried load (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs on the shoulder) in the same style.
{g.INTERACTION_RULE}
DIRECTIONS: S = facing the viewer (slight 3/4 front), SE = 3/4 turned toward the viewer's right, E = full side profile facing right, NE = 3/4 back view turned right, N = back to the viewer. Never draw west-facing.

POSES (consecutive cells = consecutive frames; if a pose has fewer frames than beats, use evenly spaced key beats incl. first and last):
{pose_lines}

CELLS, left→right, top→bottom (pose_direction × number of frames):
{rows_txt}'''

cells = []
for ri, r in enumerate(ROWS):
    col = 1
    for pose, d, n in r:
        for f in range(n):
            cells.append({'row': ri + 1, 'col': col + f, 'pose': pose, 'dir': d, 'frame': f, 'of': n})
        col += n
assert len(cells) == 100

DOC = f'''# 12 — MỘT prompt duy nhất vẽ toàn bộ trạng thái của TÙ TRƯỞNG (1 ảnh, 100 ô)

Thay `08_` (3 ảnh) và phần tù trưởng của `11_` (ảnh "VIỆC"). Prompt **tự chứa** — không cần dán GLOBAL STYLE hay LEGEND riêng. Sinh bằng `tools/gen_chief_prompt.py`; bảng tên ô cho tool cắt ở `tools/chief_single_sheet_spec.json`.

## Cách dùng
1. Đính kèm `assets/hd/source/characters/chr_chief.png` (hoặc hàng 4 của S01) và `sheets/character/chief/CH2_chief_states.png` làm tham chiếu danh tính.
2. Dán toàn bộ khối dưới đây. Chọn độ phân giải **lớn nhất** (nên ≥ 2048×2048: ô ~205 px; ở 1536² ô ~154 px, nhân vật nhỏ hơn bộ hiện có nhưng vẫn dùng được).
3. Lưu `assets/hd/source/sheets/character/chief/ALL_chief.png`. Nếu model bỏ sót/vẽ sai ô, KHÔNG vẽ lại cả ảnh: gửi *"Keep everything as is. Only redraw rows R? (list the cells) exactly as specified, output the full sheet again."*
4. **Trạng thái trong ảnh (100 ô / 31 tư thế, mỗi tư thế 1–5 khung):** đi bộ 5 hướng; đứng (S/E/N), nhìn quanh, lúng túng; ngồi xuống/nghỉ, ăn, ngủ; buồn, nhảy, reo hò; lảo đảo, chết; đánh cận chiến (E, S), ném, đâm giáo; chặt gỗ, đào đá, xây, hái, mổ thú, nấu, câu cá; đi lén, ẩn nấp, nhô đầu; mang vác, đặt/nhặt hàng; nói chuyện, dính bẫy. (Bản gốc không có cung: tầm xa là **ném** đá/giáo/rìu.)
5. Sau khi có ảnh mình viết tool cắt theo spec (ô đều 10×10, khung/pose như bảng) và thay/bổ sung bộ `chr_chief@*` hiện có; renderer đã sẵn các tên pose này.

## PROMPT
```
{PROMPT}
```
'''
(ROOT / 'docs' / '12_CHIEF_SINGLE_PROMPT.md').write_text(DOC)
(ROOT / 'tools' / 'chief_single_sheet_spec.json').write_text(json.dumps({'file': 'ALL_chief.png', 'cols': 10, 'rows': 10, 'cells': cells}, indent=1) + '\n')
print('ok; prompt chars =', len(PROMPT), '| poses =', len(used), '| cells =', len(cells))
