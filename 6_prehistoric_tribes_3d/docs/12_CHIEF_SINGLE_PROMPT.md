# 12 — MỘT prompt duy nhất vẽ toàn bộ trạng thái của TÙ TRƯỞNG (1 ảnh, 100 ô)

Thay `08_` (3 ảnh) và phần tù trưởng của `11_` (ảnh "VIỆC"). Prompt **tự chứa** — không cần dán GLOBAL STYLE hay LEGEND riêng. Sinh bằng `tools/gen_chief_prompt.py`; bảng tên ô cho tool cắt ở `tools/chief_single_sheet_spec.json`.

## Cách dùng
1. Đính kèm `assets/hd/source/characters/chr_chief.png` (hoặc hàng 4 của S01) và `sheets/character/chief/CH2_chief_states.png` làm tham chiếu danh tính.
2. Dán toàn bộ khối dưới đây. Chọn độ phân giải **lớn nhất** (nên ≥ 2048×2048: ô ~205 px; ở 1536² ô ~154 px, nhân vật nhỏ hơn bộ hiện có nhưng vẫn dùng được).
3. Lưu `assets/hd/source/sheets/character/chief/ALL_chief.png`. Nếu model bỏ sót/vẽ sai ô, KHÔNG vẽ lại cả ảnh: gửi *"Keep everything as is. Only redraw rows R? (list the cells) exactly as specified, output the full sheet again."*
4. **Trạng thái trong ảnh (100 ô / 31 tư thế, mỗi tư thế 1–5 khung):** đi bộ 5 hướng; đứng (S/E/N), nhìn quanh, lúng túng; ngồi xuống/nghỉ, ăn, ngủ; buồn, nhảy, reo hò; lảo đảo, chết; đánh cận chiến (E, S), ném, đâm giáo; chặt gỗ, đào đá, xây, hái, mổ thú, nấu, câu cá; đi lén, ẩn nấp, nhô đầu; mang vác, đặt/nhặt hàng; nói chuyện, dính bẫy. (Bản gốc không có cung: tầm xa là **ném** đá/giáo/rìu.)
5. Sau khi có ảnh mình viết tool cắt theo spec (ô đều 10×10, khung/pose như bảng) và thay/bổ sung bộ `chr_chief@*` hiện có; renderer đã sẵn các tên pose này.

## PROMPT
```
[Attach: the approved chief (chr_chief.png) and CH2_chief_states.png as the identity reference.]
Create ONE sprite sheet of the tribe Chief for a comedic Stone-Age village-builder game. Style: hand-painted HD 2D cartoon, clean dark-brown outline (#2B2014), cel shading with 2-3 tones, light from the upper-left, warm earthy palette, family friendly, no blood. No text, no labels, no grid lines, no ground shadows.

CHARACTER (identical in every cell, match the attachment EXACTLY): the Chief, comically fat with a big pot belly, lazy-proud face, big bushy beard, large white-and-dark feather headdress with a bone-skull band, tiger-skin cape, bone-tooth necklace, leopard-spotted loincloth, bare feet.

SHEET: ONE square image, 10 columns × 10 rows = 100 equal cells, highest resolution available. Flat pure chroma green #00FF00 background (no gradient), wide empty gutters, nothing touching or cropped. In every cell the SAME character at the SAME scale, full body, feet (or ground contact) on a common baseline per row. Lying poses (sleep, die) are drawn horizontal on the ground.
Hands: in melee/throw/stab poses closed fists (weapons are drawn separately); in work poses draw only the simple hand-held tool or carried load (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs on the shoulder) in the same style.
INTERACTION RULE: draw ONLY the character, plus the hand-held tool/food or the carried bundle named in a pose. NEVER draw anything the character interacts with: no trees, bushes, rocks, ore, animals, carcasses, fish, water, buildings, pots, fire, stakes, nets, tables, ground props, particles, motion lines or shadows. Every action pose must clearly act on an INVISIBLE target at the stated direction and height (the game places the real tree/animal/rock there), so the pose reads as hitting / picking / stabbing / cooking that thing: e.g. chop = a full-body swing aimed at an invisible tree trunk in front of him.
DIRECTIONS: S = facing the viewer (slight 3/4 front), SE = 3/4 turned toward the viewer's right, E = full side profile facing right, NE = 3/4 back view turned right, N = back to the viewer. Never draw west-facing.

POSES (consecutive cells = consecutive frames; if a pose has fewer frames than beats, use evenly spaced key beats incl. first and last):
- walk: R foot forward contact / passing step down / L foot forward contact / passing step down
- look: glance left / glance right
- stand: relaxed neutral stance, breathing
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
- stab: spear held low, ready / THRUST forward at an invisible target, body lunging
- putdown: crouching, setting the carried bundle of logs down on an invisible ground
- pickup: crouching, lifting a heavy bundle of logs with both arms
- melee: ready, weapon arm cocked / wind-up arm back / apex raised high / STRIKE lunging, arm swinging down / follow-through, off-balance
- trapped: struggling as if entangled by invisible restraints: arms flailing / pulling and wincing / slumped, sulking
- throw: ready / wind-up arm drawn back behind the head / RELEASE arm forward, open hand / follow-through
- chop: both hands on an axe raised overhead, leaning back / apex / STRIKE: swinging down hard at an invisible tree trunk at chest height in front of him / impact squash, tugging the axe back
- mine: pickaxe raised high / apex / STRIKE down at an invisible rock on the ground in front of him / impact squash, bracing
- build: hammer raised at the shoulder / STRIKE down on an invisible stake at waist height / impact, bracing / lifting again
- forage: reaching up to pluck from an invisible bush at chest height, a basket on the other arm / plucking / bending to pull invisible low plants / rising with a closed handful
- butcher: kneeling, stone knife raised over an invisible carcass on the ground / cutting downward / standing up, wiping the knife
- peek: crouched, peeking out cautiously, one hand shading the eyes
- cook: leaning over an invisible pot, stirring with a long spoon / tasting from the spoon, delighted / stirring again
- fish: standing at an invisible water edge, spear raised, concentrating / spear thrust down toward the invisible water / pulling the spear up, straining / raising the spear proudly, free fist up
- sneak: crouched creeping, left foot forward / passing step / right foot forward / passing, head scanning
- hide: crouching, pulling a leafy branch over himself / fully crouched under the leaves, only the eyes visible / rising, brushing leaves off
- carry: walking while carrying a heavy bundle of logs on one shoulder (the bundle is part of the pose), slightly bent, 4-frame walk cycle
- chat: talking, one hand gesturing / both hands gesturing, mouth open / nodding, listening

CELLS, left→right, top→bottom (pose_direction × number of frames):
R1: walk_S×4 | walk_SE×4 | look_S×2
R2: walk_E×4 | walk_NE×4 | stand_S×1 | stand_E×1
R3: walk_N×4 | fidget_S×2 | sit_down_S×2 | sit_rest_S×1 | stand_N×1
R4: eat_S×3 | sleep_S×2 | sad_S×2 | dance_S×2 | cheer_S×1
R5: stagger_S×2 | die_S×4 | stab_E×2 | putdown_S×1 | pickup_S×1
R6: melee_E×5 | melee_S×3 | trapped_S×2
R7: throw_E×4 | chop_E×3 | mine_E×3
R8: build_E×3 | forage_S×3 | butcher_E×3 | peek_S×1
R9: cook_S×2 | fish_E×4 | sneak_E×4
R10: hide_S×3 | carry_E×4 | chat_S×3
```
