#!/usr/bin/env python3
"""Prompt thứ 2 cho tù trưởng: các HƯỚNG còn thiếu của prompt 1 (docs/13_CHIEF_SINGLE_PROMPT_2.md)
+ tools/chief_single_sheet2_spec.json. Chạy: python3 tools/gen_chief_prompt2.py"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_chief_prompt as one  # noqa: E402  (cũng sinh lại doc 12; vô hại)

ROOT = Path(__file__).resolve().parent.parent

ROWS = [
    [('melee', 'SE', 4), ('melee', 'NE', 4), ('stand', 'SE', 1), ('stand', 'NE', 1)],
    [('melee', 'N', 4), ('throw', 'S', 3), ('stab', 'S', 2), ('putdown', 'E', 1)],
    [('throw', 'SE', 3), ('throw', 'NE', 3), ('throw', 'N', 3), ('pickup', 'E', 1)],
    [('stab', 'N', 2), ('chop', 'S', 3), ('chop', 'N', 3), ('look', 'E', 2)],
    [('mine', 'S', 3), ('mine', 'N', 3), ('build', 'S', 4)],
    [('build', 'N', 4), ('butcher', 'S', 3), ('forage', 'E', 3)],
    [('forage', 'N', 3), ('fish', 'S', 3), ('fish', 'N', 3), ('sit_rest', 'E', 1)],
    [('carry', 'S', 4), ('carry', 'SE', 4), ('cook', 'E', 2)],
    [('carry', 'NE', 4), ('carry', 'N', 4), ('stagger', 'E', 2)],
    [('sneak', 'S', 3), ('sneak', 'N', 3), ('eat', 'E', 4)],
]
for i, r in enumerate(ROWS):
    assert sum(n for _, _, n in r) == 10, (i + 1, r)

legend = dict(one.legend)
legend.update({
    'look': 'glance toward the viewer-right side / glance back (head and eyes only, side profile)',
    'carry': 'walking while carrying a heavy bundle of logs on one shoulder, slightly bent, 4-frame walk cycle',
    'sneak': 'crouched creeping, left foot forward / passing step / right foot forward (head scanning)',
    'eat': 'seated in side profile, meat chunk raised to the mouth / biting, cheeks full / chewing happily, eyes closed / swallowing and licking the lips',
    'sit_rest': 'seated cross-legged in side profile, resting, breathing',
    'stagger': 'struck from behind-the-viewer side in profile: head snapped back, stumbling / regaining balance, dazed',
})
used = []
for r in ROWS:
    for p, _, _ in r:
        if p not in used:
            used.append(p)
pose_lines = '\n'.join(f'- {p}: {legend[p]}' for p in used)
rows_txt = '\n'.join(f'R{i + 1}: ' + ' | '.join(f'{p}_{d}×{n}' for p, d, n in r) for i, r in enumerate(ROWS))

PROMPT = f'''[Attach: the approved chief (chr_chief.png) AND the first chief sheet ALL_chief.png — this is its companion sheet: same character, same drawing style, same scale, same lighting.]
Create ONE sprite sheet of the tribe Chief for a comedic Stone-Age village-builder game: hand-painted HD 2D cartoon, clean dark-brown outline (#2B2014), cel shading with 2-3 tones, light from the upper-left, warm earthy palette, family friendly, no blood. No text, no labels, no grid lines, no ground shadows.

CHARACTER (identical in every cell, match the attachments EXACTLY): the Chief, comically fat with a big pot belly, lazy-proud face, big bushy beard, large white-and-dark feather headdress with a bone-skull band, tiger-skin cape, bone-tooth necklace, leopard-spotted loincloth, bare feet.

SHEET: ONE square image, 10 columns × 10 rows = 100 equal cells, highest resolution available. Flat pure chroma green #00FF00 background (no gradient), wide empty gutters, nothing touching or cropped. In every cell the SAME character at the SAME scale as in the first sheet, full body, feet (or ground contact) on a common baseline per row.
Hands: in melee/throw/stab poses closed fists (weapons are drawn separately); in work poses draw only the simple hand-held tool or carried load (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs on the shoulder) in the same style.
{one.g.INTERACTION_RULE}
DIRECTIONS: S = facing the viewer (slight 3/4 front; the action happens toward the viewer), SE = 3/4 turned toward the viewer's right, E = full side profile facing right, NE = 3/4 back view turned right, N = back to the viewer (we see his back and cape; the action happens away from the viewer). Never draw west-facing.

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

DOC = f'''# 13 — Prompt thứ 2 cho TÙ TRƯỞNG: các hướng còn thiếu (1 ảnh, 100 ô)

Bổ sung cho `12_CHIEF_SINGLE_PROMPT.md` (ảnh 1 = mọi trạng thái, ít hướng). Ảnh 2 vẽ **thêm các hướng nhìn** của các hành động quan trọng để tù trưởng quay đúng về phía mục tiêu: đánh SE/NE/N, ném S/SE/NE/N, đâm giáo S/N, chặt/đào/xây/câu cá/hái ở hướng nhìn thẳng và quay lưng, mang vác S/SE/NE/N, đi lén S/N, cộng vài ô nghiêng (đứng SE/NE, nhìn quanh E, ngồi nghỉ E, ăn nghiêng, lảo đảo E, nấu E, đặt/nhặt hàng E). Sinh bằng `tools/gen_chief_prompt2.py`; bảng tên ô: `tools/chief_single_sheet2_spec.json`.

## Cách dùng
1. **Làm ảnh 1 trước**, rồi mở cùng phiên/cùng cuộc hội thoại và đính kèm: `chr_chief.png` + **ảnh 1 (`ALL_chief.png`)** làm tham chiếu (giữ nhân vật, nét vẽ và tỉ lệ khớp nhau).
2. Dán toàn bộ khối dưới đây, chọn độ phân giải lớn nhất (≥ 2048²).
3. Lưu `assets/hd/source/sheets/character/chief/ALL_chief_2.png`. Sai/thiếu ô: *"Keep everything as is. Only redraw row R? exactly as specified, output the full sheet again."*
4. Khi cắt, mình ghép với ảnh 1: pose có đúng hướng dùng khung riêng (`melee_SE`, `carry_N`…), thiếu hướng thì dùng hướng gần nhất + lật gương (renderer sẽ tìm `<pose>_<hướng>` trước).

## PROMPT
```
{PROMPT}
```
'''
(ROOT / 'docs' / '13_CHIEF_SINGLE_PROMPT_2.md').write_text(DOC)
(ROOT / 'tools' / 'chief_single_sheet2_spec.json').write_text(json.dumps({'file': 'ALL_chief_2.png', 'cols': 10, 'rows': 10, 'cells': cells}, indent=1) + '\n')
print('ok; prompt chars =', len(PROMPT), '| poses =', len(used), '| cells =', len(cells))
