# 10 — Prompt NGẮN vẽ bộ tư thế cho từng nhân vật (1 ảnh/nhân vật, 64 ô)

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
INTERACTION RULE: draw ONLY the character, plus the hand-held tool/food or the carried bundle named in a pose. NEVER draw anything the character interacts with: no trees, bushes, rocks, ore, animals, carcasses, fish, water, buildings, pots, fire, stakes, nets, tables, ground props, particles, motion lines or shadows. Every action pose must clearly act on an INVISIBLE target at the stated direction and height (the game places the real tree/animal/rock there), so the pose reads as hitting / picking / stabbing / cooking that thing: e.g. chop = a full-body swing aimed at an invisible tree trunk in front of him.
- walk: R foot forward contact / passing step down / L foot forward contact / passing step down
- stand: relaxed neutral stance
- look: glance left / centre / glance right (head and eyes only)
- fidget: hand rising to scratch the head / scratching, puzzled
- sit_down: bending the knees / seated cross-legged on the ground
- sit_rest: seated cross-legged, resting, breathing
- eat: meat chunk raised to the mouth / biting, cheeks full / chewing happily, eyes closed
- sleep: lying flat on the back, body horizontal as seen from the front, snoring, chest low / chest high
- sad: slumped, head hanging, shoulders down / shaking head, sighing (the "gloomy" state)
- dance: goofy dance, hip left arms up / hip right small jump
- cheer: one fist up shouting / both arms up laughing
- stagger: struck: head snapped back, stumbling / regaining balance, dazed
- die: knocked backward / falling tilted / lying flat on the back, cartoon X eyes / same plus a few stars above
- melee: ready, weapon arm cocked / wind-up arm back / apex raised high / STRIKE lunging, arm swinging down / follow-through, off-balance
- throw: ready / wind-up arm drawn back behind the head / RELEASE arm forward, open hand / follow-through
- work: tool raised overhead / apex / STRIKE down, body lunging / impact squash and lifting again
- gather: bending forward reaching down / grabbing plants with both hands / rising with the harvest
- ready: fists up, knees bent, determined glare (bouncing)
- taunt: beating chest with a roar / arms wide laughing menacingly / pointing at the viewer with a sneer / head thrown back howling
- play: jumping arms up laughing / running arms out / spinning arms wide / happy hop giggling
- sit_play: sitting on the ground, hands busy playing with invisible small things / laughing, stacking an invisible tiny tower
- cry: rubbing eyes with fists, tears / wailing mouth wide, big tears
- wave: waving one hand, smiling / waving both hands, bouncing
- jump: crouching to spring / in the air arms up / landing with a squash
- point: pointing at something excitedly / looking back at the viewer, still pointing
- cast: staff raised, crystal glowing / arms wide chanting eyes closed / staff pounded down, foot stamping / arms raised to the sky
- channel: hands outstretched, concentrating / trembling with effort, eyes shut / lowering the hands, relieved
- bless: raising one hand over an invisible patient / palm glowing (no effects drawn), eyes closed
- sneak: crouched creeping, left foot forward / passing step / right foot forward / passing, head scanning
- hide: crouching, pulling a leafy branch over self / fully crouched under the leaves, only eyes visible
- unhide: rising from the crouch, brushing leaves off
- peek: crouched, peeking out cautiously, hand shading the eyes
```

## villager_m — P0  ·  `PS_villager_m.png`
```
[Attach S01_characters_civil.png row 1 + chr_villager_m.png. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Adult male caveman villager: stocky, big round head, messy dark hair, short scruffy beard, thick eyebrows, friendly goofy grin, one-shoulder brown fur tunic with rope belt, bare feet with leather wraps. Hands: fists closed as if gripping an invisible tool handle. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | melee_S×2
R7: melee_E×5 | gather_S×3
R8: throw_E×4 | work_E×4
```

## villager_f — P0  ·  `PS_villager_f.png`
```
[Attach S01_characters_civil.png row 2. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Adult cavewoman villager: big round head, voluminous wavy dark hair with a bone clip, cheerful, light-brown spotted fur dress, teeth-bead necklace, bare feet. Hands: fists closed as if gripping an invisible tool handle. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | melee_S×2
R7: melee_E×5 | gather_S×3
R8: throw_E×4 | work_E×4
```

## child — P0  ·  `PS_child.png`
```
[Attach S01_characters_civil.png row 3. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Cave child about 6 years old: head 1/3 of body height, tiny fur loincloth, messy hair, mischievous smile; whole figure ~65% of an adult height. Hands: empty hands. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | wave_S×2
R7: play_S×4 | sit_play_S×2 | cry_S×2
R8: gather_S×3 | jump_S×3 | point_S×2
```

## warrior — P1  ·  `PS_warrior.png`
```
[Attach S02_characters_roles.png row 1 + chr_villager_m.png. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Tribe warrior: muscular, leather chest strap with bone shoulder pads, red ochre war-paint stripes, determined frown, bare feet. Hands: fists closed as if gripping an invisible club handle. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | taunt_S×2
R7: melee_E×5 | ready_S×1 | throw_S×2
R8: melee_S×4 | throw_E×4
```

## enemy_warrior — P1  ·  `PS_enemy_warrior.png`
```
[Attach S02_characters_roles.png row 4. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Enemy "cannibal" warrior (cartoon villain, family friendly): dark grey-purple furs, white chalk skull face paint, bone in hair topknot, small-bone necklace, menacing grin, bare feet; not any real ethnic group. Hands: fists closed as if gripping an invisible club handle. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | taunt_S×2
R7: melee_E×5 | ready_S×1 | throw_S×2
R8: melee_S×4 | throw_E×4
```

## shaman — P1  ·  `PS_shaman.png`
```
[Attach S02_characters_roles.png row 2. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Shaman: thin old man, long white beard, bird-skull mask on the forehead, robe of leaves and feathers, gnarled staff with a glowing crystal and dangling bones (staff always in one hand except when sitting, sleeping, eating). Hands: free hand open. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | bless_S×2
R7: cast_S×4 | channel_S×3 | ready_S×1
R8: melee_E×3 | melee_S×2 | gather_S×3
```

## scout — P1  ·  `PS_scout.png`
```
[Attach S02_characters_roles.png row 3. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
PIA scout: lean, camouflage of leaves and twigs, green face-paint stripes, leaf headband, sneaky self-important look, bare feet. Hands: fists closed as if gripping an invisible handle. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | hide_S×2
R7: sneak_E×4 | unhide_S×1 | peek_S×1 | throw_S×2
R8: throw_E×4 | melee_E×4
```

## enemy_chief — P2  ·  `PS_enemy_chief.png`
```
[Attach S02_characters_roles.png row 5. GLOBAL STYLE + POSE LEGEND already in this chat.]
Draw the pose sprite sheet: ONE square image, 8×8 grid = 64 equal cells (highest resolution), exact match to the attached character:
Enemy cannibal chief: tall and skinny, huge black-and-red feathered headdress, dark fur cape, white skull face paint, comically evil, bare feet. Hands: fists closed as if gripping an invisible club handle. No blood, no text.
Cells, left→right, top→bottom (pose_direction×frames):
R1: walk_S×4 | walk_SE×4
R2: walk_E×4 | walk_NE×4
R3: walk_N×4 | stand_S×1 | look_S×3
R4: fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | eat_S×3
R5: sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×2
R6: stagger_S×2 | die_S×4 | ready_S×2
R7: melee_E×5 | throw_E×3
R8: melee_S×4 | taunt_S×4
```
