#!/usr/bin/env python3
"""Sinh docs/10_POSE_SHEETS_COMPACT.md (prompt NGẮN vẽ bộ tư thế từng nhân vật, 1 ảnh/nhân vật) và
tools/pose_sheet_specs.json (bảng tên ô cho tool cắt). Một nguồn dữ liệu → prompt và bảng cắt luôn khớp.
Chạy:  python3 tools/gen_pose_prompts.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

INTERACTION_RULE = (
    'INTERACTION RULE: draw ONLY the character, plus the hand-held tool/food or the carried bundle named in a pose. '
    'NEVER draw anything the character interacts with: no trees, bushes, rocks, ore, animals, carcasses, fish, water, buildings, '
    'pots, fire, stakes, nets, tables, ground props, particles, motion lines or shadows. Every action pose must clearly act on an '
    'INVISIBLE target at the stated direction and height (the game places the real tree/animal/rock there), so the pose reads as '
    'hitting / picking / stabbing / cooking that thing: e.g. chop = a full-body swing aimed at an invisible tree trunk in front of him.'
)

# Từ vựng tư thế dùng CHUNG (dán một lần mỗi phiên): pose -> danh sách "nhịp" ở số khung tối đa.
LEGEND = {
    'walk': 'R foot forward contact / passing step down / L foot forward contact / passing step down',
    'stand': 'relaxed neutral stance',
    'look': 'glance left / centre / glance right (head and eyes only)',
    'fidget': 'hand rising to scratch the head / scratching, puzzled',
    'sit_down': 'bending the knees / seated cross-legged on the ground',
    'sit_rest': 'seated cross-legged, resting, breathing',
    'eat': 'meat chunk raised to the mouth / biting, cheeks full / chewing happily, eyes closed',
    'sleep': 'lying flat on the back, body horizontal as seen from the front, snoring, chest low / chest high',
    'sad': 'slumped, head hanging, shoulders down / shaking head, sighing (the "gloomy" state)',
    'dance': 'goofy dance, hip left arms up / hip right small jump',
    'cheer': 'one fist up shouting / both arms up laughing',
    'stagger': 'struck: head snapped back, stumbling / regaining balance, dazed',
    'die': 'knocked backward / falling tilted / lying flat on the back, cartoon X eyes / same plus a few stars above',
    'melee': 'ready, weapon arm cocked / wind-up arm back / apex raised high / STRIKE lunging, arm swinging down / follow-through, off-balance',
    'throw': 'ready / wind-up arm drawn back behind the head / RELEASE arm forward, open hand / follow-through',
    'work': 'tool raised overhead / apex / STRIKE down, body lunging / impact squash and lifting again',
    'gather': 'bending forward reaching down / grabbing plants with both hands / rising with the harvest',
    'ready': 'fists up, knees bent, determined glare (bouncing)',
    'taunt': 'beating chest with a roar / arms wide laughing menacingly / pointing at the viewer with a sneer / head thrown back howling',
    'play': 'jumping arms up laughing / running arms out / spinning arms wide / happy hop giggling',
    'sit_play': 'sitting on the ground, hands busy playing with invisible small things / laughing, stacking an invisible tiny tower',
    'cry': 'rubbing eyes with fists, tears / wailing mouth wide, big tears',
    'wave': 'waving one hand, smiling / waving both hands, bouncing',
    'jump': 'crouching to spring / in the air arms up / landing with a squash',
    'point': 'pointing at something excitedly / looking back at the viewer, still pointing',
    'cast': 'staff raised, crystal glowing / arms wide chanting eyes closed / staff pounded down, foot stamping / arms raised to the sky',
    'channel': 'hands outstretched, concentrating / trembling with effort, eyes shut / lowering the hands, relieved',
    'bless': 'raising one hand over an invisible patient / palm glowing (no effects drawn), eyes closed',
    'sneak': 'crouched creeping, left foot forward / passing step / right foot forward / passing, head scanning',
    'hide': 'crouching, pulling a leafy branch over self / fully crouched under the leaves, only eyes visible',
    'unhide': 'rising from the crouch, brushing leaves off',
    'peek': 'crouched, peeking out cautiously, hand shading the eyes',
}

# 46 ô chung (hàng 1-5 + 6 ô đầu hàng 6) — GIỐNG NHAU cho mọi nhân vật
BASE = [
    [('walk', 'S', 4), ('walk', 'SE', 4)],
    [('walk', 'E', 4), ('walk', 'NE', 4)],
    [('walk', 'N', 4), ('stand', 'S', 1), ('look', 'S', 3)],
    [('fidget', 'S', 2), ('sit_down', 'S', 2), ('sit_rest', 'S', 1), ('eat', 'S', 3)],
    [('sleep', 'S', 2), ('sad', 'S', 2), ('dance', 'S', 2), ('cheer', 'S', 2)],
    [('stagger', 'S', 2), ('die', 'S', 4)],  # + 2 ô đầu của khối riêng
]
# Khối riêng 18 ô = 2 (cuối hàng 6) + 8 (hàng 7) + 8 (hàng 8); mỗi phần KHÔNG chia đôi qua hàng
CHARACTERS = {
    'villager_m': ('P0', 'S01_characters_civil.png row 1 + chr_villager_m.png',
                   'Adult male caveman villager: stocky, big round head, messy dark hair, short scruffy beard, thick eyebrows, friendly goofy grin, one-shoulder brown fur tunic with rope belt, bare feet with leather wraps',
                   'fists closed as if gripping an invisible tool handle',
                   [[('melee', 'S', 2)], [('melee', 'E', 5), ('gather', 'S', 3)], [('throw', 'E', 4), ('work', 'E', 4)]]),
    'villager_f': ('P0', 'S01_characters_civil.png row 2',
                   'Adult cavewoman villager: big round head, voluminous wavy dark hair with a bone clip, cheerful, light-brown spotted fur dress, teeth-bead necklace, bare feet',
                   'fists closed as if gripping an invisible tool handle',
                   [[('melee', 'S', 2)], [('melee', 'E', 5), ('gather', 'S', 3)], [('throw', 'E', 4), ('work', 'E', 4)]]),
    'child': ('P0', 'S01_characters_civil.png row 3',
              'Cave child about 6 years old: head 1/3 of body height, tiny fur loincloth, messy hair, mischievous smile; whole figure ~65% of an adult height',
              'empty hands',
              [[('wave', 'S', 2)], [('play', 'S', 4), ('sit_play', 'S', 2), ('cry', 'S', 2)], [('gather', 'S', 3), ('jump', 'S', 3), ('point', 'S', 2)]]),
    'warrior': ('P1', 'S02_characters_roles.png row 1 + chr_villager_m.png',
                'Tribe warrior: muscular, leather chest strap with bone shoulder pads, red ochre war-paint stripes, determined frown, bare feet',
                'fists closed as if gripping an invisible club handle',
                [[('taunt', 'S', 2)], [('melee', 'E', 5), ('ready', 'S', 1), ('throw', 'S', 2)], [('melee', 'S', 4), ('throw', 'E', 4)]]),
    'enemy_warrior': ('P1', 'S02_characters_roles.png row 4',
                      'Enemy "cannibal" warrior (cartoon villain, family friendly): dark grey-purple furs, white chalk skull face paint, bone in hair topknot, small-bone necklace, menacing grin, bare feet; not any real ethnic group',
                      'fists closed as if gripping an invisible club handle',
                      [[('taunt', 'S', 2)], [('melee', 'E', 5), ('ready', 'S', 1), ('throw', 'S', 2)], [('melee', 'S', 4), ('throw', 'E', 4)]]),
    'shaman': ('P1', 'S02_characters_roles.png row 2',
               'Shaman: thin old man, long white beard, bird-skull mask on the forehead, robe of leaves and feathers, gnarled staff with a glowing crystal and dangling bones (staff always in one hand except when sitting, sleeping, eating)',
               'free hand open',
               [[('bless', 'S', 2)], [('cast', 'S', 4), ('channel', 'S', 3), ('ready', 'S', 1)], [('melee', 'E', 3), ('melee', 'S', 2), ('gather', 'S', 3)]]),
    'scout': ('P1', 'S02_characters_roles.png row 3',
              'PIA scout: lean, camouflage of leaves and twigs, green face-paint stripes, leaf headband, sneaky self-important look, bare feet',
              'fists closed as if gripping an invisible handle',
              [[('hide', 'S', 2)], [('sneak', 'E', 4), ('unhide', 'S', 1), ('peek', 'S', 1), ('throw', 'S', 2)], [('throw', 'E', 4), ('melee', 'E', 4)]]),
    'enemy_chief': ('P2', 'S02_characters_roles.png row 5',
                    'Enemy cannibal chief: tall and skinny, huge black-and-red feathered headdress, dark fur cape, white skull face paint, comically evil, bare feet',
                    'fists closed as if gripping an invisible club handle',
                    [[('ready', 'S', 2)], [('melee', 'E', 5), ('throw', 'E', 3)], [('melee', 'S', 4), ('taunt', 'S', 4)]]),
}
COLS = 8

RESEARCH = '''# 11 — Kiểm tra bản gốc: những trạng thái còn thiếu (làm việc, săn bắt, nguỵ trang…)

Nguồn: `ptCore.js` (`U` task, `W` animation, `updateScoutHiding`, `movementPose`), `game-data.json` (`taskAnimations`, `attackAnimations`, `weaponTaskOffset`), `sprites.json` (`animationFrameCount`). Trả lời lại phản hồi "tù trưởng chưa đủ trạng thái".

## Những điều bản gốc thực sự làm (đã đối chiếu mã)
1. **Mọi việc lao động dùng CHUNG một animation 21 (2 khung):** chặt gỗ, hái quả, hái rau, đào đá, nhặt xương, mổ thú, lấy/đưa vật liệu… Bản gốc phân biệt bằng **dụng cụ/hàng trên tay** (ghép sprite), không bằng dáng người. → Ở bản HD phải vẽ **dáng riêng + dụng cụ trên tay** cho từng việc, và renderer phải chọn theo **task** (đã làm: `workActOf(task)`).
2. **Xây/rèn bẫy = animation 53 (3 khung, đập búa), sửa = 54, nấu = 81/82 (6/12 khung), câu cá = 141–146 (4–10 khung: quăng, chờ, giật, cá cắn), ăn = 85/86 (19 khung), đưa hàng = 22 (14 khung).**
3. **Chiến đấu theo vũ khí** (`attackAnimationsStart`): chùy/rìu đá/chuỳ xương = **cận chiến** (23–33, đòn mạnh 31–33 khi kỹ năng cao); đá/giáo/rìu ném = **ném** (35 đá, 36 giáo & rìu ném). `weaponTaskOffset` đánh dấu vũ khí ném (1, 2, 5). Săn thú cũng dùng đúng bộ này (cận chiến hoặc ném giáo). **Bản gốc KHÔNG có cung/bắn tên:** "tầm xa" = ném đá/giáo/rìu (và tháp canh ném đá).
4. **Nguỵ trang:** *bất kỳ unit nào có kỹ năng trinh sát > 3* (`scoutingSkill > 3`), khi đứng yên 2 chu kỳ liên tiếp mà không bị địch nhìn thấy, chơi **HIDE (149)** rồi gắn cờ `HIDDEN`; đi khi đang ẩn = **SNEAK (5)**; bị phát hiện hoặc có lệnh → **UNHIDE (150)**. (Tù trưởng có trinh sát 3 nên chưa ẩn được cho đến khi luyện thêm.)
5. Khác: dính bẫy 106–108, nói chuyện 155/156, nhặt/đặt dụng cụ 147/148, tập ném 91–93, DJ 73/74, nhảy disco 104. Các hoạt ảnh **bên trong công trình** và yêu/hôn không hiển thị ngoài trời → không cần vẽ.

## Bảng trạng thái ↔ bộ khung (tù trưởng)
| Hành động | Task / animation | Bộ khung đã có | Còn thiếu → sheet "VIỆC" |
|---|---|---|---|
| Đi, chạy, đứng, nhìn quanh, ngồi, ăn, ngủ, nhảy, buồn, ngã, chết | 0/7/8/15–18/113–116/85/40/39/42/43 | ✅ `walk_*`, `look`, `fidget`, `sit_*`, `eat`, `sleep`, `dance`, `sad`, `stagger`, `die` | — |
| Đánh cận chiến (chùy, rìu, chuỳ) | task 0/1/3/4, anim 23–33 | ✅ `melee_E/S` | — |
| Ném đá/giáo/rìu, tập ném, săn bằng giáo | task 5/7/9, anim 35/36/91–93 | ✅ `throw_E` | `stab_E` (đâm giáo ở cự ly gần) |
| Chặt gỗ | task 11 (anim 21) | ⚠ dùng chung `work_E` | **`chop_E`** |
| Đào đá | task 14 | ⚠ `work_E` | **`mine_E`** |
| Xây, sửa, rèn bẫy | task 56/76/53 (anim 53/54) | ⚠ `work_E` | **`build_E`** |
| Hái quả/rau | task 10/15 | ⚠ `gather_S` (cúi thấp) | **`forage_S`** (với lên bụi quả + cúi) |
| Nhặt xương | task 16 | ✅ `gather_S` | — |
| Mổ thú | task 12 | ⚠ `gather_S` | **`butcher_E`** |
| Câu cá | task 13, anim 141–146 | ❌ chưa có | **`fish_E`** |
| Nấu ăn | task 54/66, anim 81–84 | ❌ | **`cook_S`** |
| Mang vác (gỗ/đá/thịt) | anim 1 (CARRY) | ⚠ khung đi + code | **`carry_E`** |
| Đặt/nhặt hàng | anim 22/147/148 | ⚠ `gather_S` | **`putdown_S`, `pickup_S`** |
| Nguỵ trang: đi lén, ẩn, nhô đầu | anim 5/149/150, cờ HIDDEN | ❌ (code tạm: thấp + mờ) | **`sneak_E`, `hide_S`, `peek_S`** |
| Nói chuyện | anim 155/156 | ❌ | **`chat_S`** |
| Dính bẫy | anim 106–108 | ❌ | **`trapped_S`** |

## Đã sửa trong renderer (không cần chờ art)
- Nhận diện việc theo **task** (`workActOf`) thay vì chỉ theo job: chặt/đào/xây/hái/mổ chọn đúng bộ khung nếu có, không có thì dùng bộ chung.
- Thêm trạng thái **nguỵ trang** (`hide`/`unhide`, cờ `HIDDEN` → ẩn khi đứng yên, đi lén khi di chuyển) với hoạt ảnh code tạm (thu thấp + mờ).
- `poseKindOf` nhận 147/148/154 (nhặt/đặt) và 149/150; số khung mỗi pose lấy từ **độ dài dải khung thực** (không còn hằng 3/4/7), nên các bộ 3 hay 4 khung đều đúng.
- Chưa quan sát trong ván thật: hide/unhide (cần unit trinh sát ≥ 4 đứng yên ngoài tầm nhìn địch).

'''
SHORT = {'S': 'S', 'SE': 'SE', 'E': 'E', 'NE': 'NE', 'N': 'N'}


def layout(role_rows):
    """Return list of rows; each row = list of (pose, dir, n). Rows 6..8 = base tail + role blocks."""
    rows = [list(r) for r in BASE]
    rows[5] = rows[5] + role_rows[0]
    rows += [list(r) for r in role_rows[1:]]
    for i, r in enumerate(rows):
        assert sum(n for _, _, n in r) == COLS, (i + 1, r)
    return rows


def cells_of(rows):
    out = []
    for ri, r in enumerate(rows):
        col = 1
        for pose, d, n in r:
            for f in range(n):
                out.append({'row': ri + 1, 'col': col + f, 'pose': pose, 'dir': d, 'frame': f, 'of': n})
            col += n
    return out


def row_text(rows):
    lines = []
    for i, r in enumerate(rows):
        lines.append(f'R{i + 1}: ' + ' | '.join(f'{p}_{d}×{n}' if p not in ('stand', 'walk') or True else '' for p, d, n in r))
    return '\n'.join(lines)


# ---------------------------------------------------------------------------------------------------------------
# Sheet "VIỆC" (task poses): các trạng thái làm việc/nguỵ trang mà bản gốc có nhưng bộ chung chưa phân biệt
# ---------------------------------------------------------------------------------------------------------------
TASK_LEGEND = {
    'chop': 'both hands on an axe raised overhead, leaning back / apex / STRIKE: swinging down hard at an invisible tree trunk at chest height in front of him / impact squash, tugging the axe back',
    'mine': 'pickaxe raised high / apex / STRIKE down at an invisible rock on the ground in front of him / impact squash, bracing',
    'build': 'hammer raised at the shoulder / STRIKE down on an invisible stake at waist height / impact, bracing / lifting again',
    'forage': 'reaching up to pluck from an invisible bush at chest height, a basket on the other arm / plucking / bending to pull invisible low plants / rising with a closed handful',
    'butcher': 'kneeling, stone knife raised over an invisible carcass on the ground / cutting downward / standing up, wiping the knife',
    'cook': 'leaning over an invisible pot, stirring with a long spoon / tasting from the spoon, delighted / stirring again',
    'stab': 'spear held low, ready / THRUST forward at an invisible target, body lunging',
    'fish': 'standing at an invisible water edge, spear raised, concentrating / spear thrust down toward the invisible water / pulling the spear up, straining / raising the spear proudly, free fist up',
    'carry': 'walking while carrying a heavy bundle of logs on one shoulder (the bundle is part of the pose), slightly bent, 4-frame walk cycle',
    'chat': 'talking, one hand gesturing / both hands gesturing, mouth open / nodding, listening',
    'putdown': 'crouching, setting the carried bundle of logs down on an invisible ground',
    'pickup': 'crouching, lifting a heavy bundle of logs with both arms',
    'trapped': 'struggling as if entangled by invisible restraints: arms flailing / pulling and wincing / slumped, sulking',
}
TASK_ROWS = [
    [('chop', 'E', 4), ('mine', 'E', 4)],
    [('build', 'E', 4), ('forage', 'S', 4)],
    [('butcher', 'E', 3), ('cook', 'S', 3), ('stab', 'E', 2)],
    [('fish', 'E', 4), ('sneak', 'E', 4)],
    [('hide', 'S', 3), ('peek', 'S', 1), ('chat', 'S', 3), ('putdown', 'S', 1)],
    [('carry', 'E', 4), ('trapped', 'S', 3), ('pickup', 'S', 1)],
]
TASK_CHARS = {
    'chief': ('chr_chief.png + CH2_chief_states.png',
              'The tribe Chief: comically fat pot belly, lazy-proud face, big bushy beard, large feather headdress with a bone skull band, tiger-skin cape, bone-tooth necklace, leopard-spotted loincloth, bare feet',
              'gripping the tool or load of each pose; EXACTLY the attached chief in every cell'),
    'villager_m': ('S01_characters_civil.png row 1 + chr_villager_m.png',
                   'Adult male caveman villager: stocky, big round head, messy dark hair, short scruffy beard, thick eyebrows, friendly goofy grin, one-shoulder brown fur tunic with rope belt, bare feet with leather wraps',
                   'gripping the tool or load of each pose'),
    'villager_f': ('S01_characters_civil.png row 2',
                   'Adult cavewoman villager: big round head, voluminous wavy dark hair with a bone clip, cheerful, light-brown spotted fur dress, teeth-bead necklace, bare feet',
                   'gripping the tool or load of each pose'),
}


def task_docs() -> tuple[str, dict]:
    specs, blocks = {}, []
    for name, (attach, ident, hands) in TASK_CHARS.items():
        for i, r in enumerate(TASK_ROWS):
            assert sum(n for _, _, n in r) == 8, (i, r)
        cells = cells_of(TASK_ROWS)
        assert len(cells) == 48
        specs[name] = {'file': f'TK_{name}.png', 'cols': 8, 'rows': 6, 'cells': cells}
        rows = '\n'.join('R%d: ' % (i + 1) + ' | '.join(f'{p}_{d}×{n}' for p, d, n in r) for i, r in enumerate(TASK_ROWS))
        blocks.append(f'## {name}  ·  `TK_{name}.png`\n```\n[Attach {attach}. GLOBAL STYLE + POSE LEGEND + TASK LEGEND already in this chat.]\n'
                      f'Draw the TASK pose sprite sheet: ONE image, 8 columns × 6 rows = 48 equal cells (aspect 4:3, highest resolution), exact match to the attached character:\n'
                      f'{ident}. Hands: {hands}. No blood, no text. Draw ONLY the character with the simple hand-held tool or carried bundle of each pose (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs); NO trees, rocks, animals, water, pots, nets or any other object the pose interacts with: act on INVISIBLE targets.\n'
                      f'Cells, left→right, top→bottom (pose_direction×frames):\n{rows}\n```\n')
    legend = '\n'.join(f'- {k}: {v}' for k, v in TASK_LEGEND.items())
    return legend, specs, blocks


def main():
    specs, blocks = {}, []
    for name, (prio, attach, ident, hands, role) in CHARACTERS.items():
        rows = layout(role)
        cells = cells_of(rows)
        assert len(cells) == 64
        specs[name] = {'file': f'PS_{name}.png', 'cols': 8, 'rows': 8, 'cells': cells}
        prompt = (f'[Attach {attach}. GLOBAL STYLE + POSE LEGEND already in this chat.]\n'
                  f'Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:\n'
                  f'{ident}. Hands: {hands}. No blood, no text.\n'
                  f'Cells, left→right, top→bottom (pose_direction×frames):\n{row_text(rows)}')
        blocks.append(f'## {name} — {prio}  ·  `PS_{name}.png`\n```\n{prompt}\n```\n')
    legend = '\n'.join(f'- {k}: {v}' for k, v in LEGEND.items())
    doc = f'''# 10 — Prompt NGẮN vẽ bộ tư thế cho từng nhân vật (1 ảnh/nhân vật, 64 ô)

Thay `09_` (dài hơn, 48 ô). Số trạng thái **bằng tù trưởng** (đi bộ 5 hướng + nhìn quanh, ngồi, ăn, ngủ, buồn, nhảy, reo, lảo đảo, chết, đánh, ném, làm việc, hái…), nhưng mỗi trạng thái ít khung hơn (đi bộ 4 khung thay vì 6…) để gói vào **một ảnh vuông 8×8** (ô ~190 px ở 1536², ~250 px ở 2048²). Tiết kiệm token: phần dùng chung (GLOBAL STYLE + LEGEND) dán **một lần ở đầu phiên**; mỗi nhân vật chỉ dán prompt ~800 ký tự.

## Cách dùng
1. Đầu phiên (một lần): dán **GLOBAL STYLE** (`06_GEMINI_SHEET_PROMPTS.md`, mục 0) rồi dán **POSE LEGEND** dưới đây.
2. Với mỗi nhân vật: đính kèm ảnh tham chiếu ghi trong ngoặc `[Attach …]` và dán prompt của nhân vật đó. Làm các nhân vật trong CÙNG phiên để giữ phong cách.
3. Lưu `assets/hd/source/sheets/PS_<nhân_vật>.png`; mình cắt bằng `tools/pose_sheet_specs.json` (ô đều 8×8). Thiếu/sai ô: *"Keep everything. Only redraw cell R?C?: …"*.
4. Ưu tiên: P0 `villager_m`, `villager_f`, `child` → P1 `warrior`, `enemy_warrior`, `shaman`, `scout` → P2 `enemy_chief`. Làm trước `villager_m` + `enemy_warrior` nếu hết quota.
5. Bố cục: hàng 1–5 và 6 ô đầu hàng 6 GIỐNG HỆT nhau cho mọi nhân vật (46 ô chung); 18 ô còn lại (cuối hàng 6, hàng 7, hàng 8) là khối riêng theo vai trò.

## POSE LEGEND (dán một lần)
```
POSE LEGEND for the pose sprite sheets. Each cell = one frame of the named pose; frames of a pose are consecutive cells and
follow the listed beats in order (if fewer frames than beats are asked, pick evenly spaced key beats incl. first and last).
Directions: S = facing the viewer (slight 3/4 front), SE = 3/4 turned toward the viewer's right, E = full side profile facing
right, NE = 3/4 back view turned right, N = back to the viewer. West views are mirrored by code (never draw them).
Every cell: the SAME character at the SAME scale, full body, feet (or ground contact) on a common baseline per row, empty
flat #00FF00 gutters, nothing touching or cropped, no ground shadow, no grid lines, no labels. Weapons/tools are drawn
separately (hands only grip). Lying poses (sleep, die) are drawn horizontal on the ground.
{INTERACTION_RULE}
{legend}
```

''' + '\n'.join(blocks)
    (ROOT / 'docs' / '10_POSE_SHEETS_COMPACT.md').write_text(doc)
    (ROOT / 'tools' / 'pose_sheet_specs.json').write_text(json.dumps(specs, indent=1) + '\n')
    print('ok', {k: len(v['cells']) for k, v in specs.items()})
    print('prompt chars:', {n: len(b) for n, b in zip(specs, blocks)})

    legend_t, specs_t, blocks_t = task_docs()
    specs_all = json.loads((ROOT / 'tools' / 'pose_sheet_specs.json').read_text())
    (ROOT / 'tools' / 'task_pose_specs.json').write_text(json.dumps(specs_t, indent=1) + '\n')
    doc11 = RESEARCH + f'''
## Sheet "VIỆC" bổ sung (TASK POSES): 48 ô / nhân vật, 1 ảnh

Chỉ làm cho **tù trưởng, dân nam, dân nữ** (những ai được giao việc lao động). Chiến binh/địch/shaman/trinh sát/trẻ em đã có đủ trạng thái đặc thù trong `10_`.
Dụng cụ (rìu, cuốc, búa, giáo, dao, muỗng, nồi, bó củi) **được vẽ cầm trên tay** trong sheet này, đơn giản, cùng phong cách.

### Cách dùng
1. Cùng phiên đã dán GLOBAL STYLE (`06_`, mục 0) + POSE LEGEND (`10_`): dán thêm **TASK LEGEND** dưới đây (một lần).
2. Đính kèm ảnh tham chiếu ghi trong `[Attach …]`, dán prompt của nhân vật.
3. Lưu `assets/hd/source/sheets/TK_<nhân_vật>.png`; ô cắt theo `tools/task_pose_specs.json` (lưới 8×6). Tên chuỗi khung sau khi cắt: `<char>@chop_E`, `@mine_E`, `@build_E`, `@forage_S`, `@butcher_E`, `@cook_S`, `@stab_E`, `@fish_E`, `@sneak_E`, `@hide_S`, `@peek_S`, `@chat_S`, `@putdown_S`, `@carry_E`, `@trapped_S`, `@pickup_S` — renderer **đã sẵn sàng** chọn các tên này (xem `poseFrame`), thiếu thì rơi về `work_E/gather_S` hoặc hoạt ảnh code.

### TASK LEGEND (dán một lần)
```
TASK LEGEND (same rules as the POSE LEGEND; hand-held tools ARE drawn in the hands):
{INTERACTION_RULE}
{legend_t}
```

''' + '\n'.join(blocks_t)
    (ROOT / 'docs' / '11_TASK_POSES.md').write_text(doc11)
    print('task docs ok', {k: len(v['cells']) for k, v in specs_t.items()})


if __name__ == '__main__':
    main()
