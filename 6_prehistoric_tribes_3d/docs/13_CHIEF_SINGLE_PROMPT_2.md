# 13 — Prompt thứ 2 cho TÙ TRƯỞNG: các hướng còn thiếu (1 ảnh, 100 ô)

Bổ sung cho `12_CHIEF_SINGLE_PROMPT.md` (ảnh 1 = mọi trạng thái, ít hướng). Ảnh 2 vẽ **thêm các hướng nhìn** của các hành động quan trọng để tù trưởng quay đúng về phía mục tiêu: đánh SE/NE/N, ném S/SE/NE/N, đâm giáo S/N, chặt/đào/xây/câu cá/hái ở hướng nhìn thẳng và quay lưng, mang vác S/SE/NE/N, đi lén S/N, cộng vài ô nghiêng (đứng SE/NE, nhìn quanh E, ngồi nghỉ E, ăn nghiêng, lảo đảo E, nấu E, đặt/nhặt hàng E). Sinh bằng `tools/gen_chief_prompt2.py`; bảng tên ô: `tools/chief_single_sheet2_spec.json`.

## Cách dùng
1. **Làm ảnh 1 trước**, rồi mở cùng phiên/cùng cuộc hội thoại và đính kèm: `chr_chief.png` + **ảnh 1 (`ALL_chief.png`)** làm tham chiếu (giữ nhân vật, nét vẽ và tỉ lệ khớp nhau).
2. Dán toàn bộ khối dưới đây, chọn độ phân giải lớn nhất (≥ 2048²).
3. Lưu `assets/hd/source/sheets/character/chief/ALL_chief_2.png`. Sai/thiếu ô: *"Keep everything as is. Only redraw row R? exactly as specified, output the full sheet again."*
4. Khi cắt, mình ghép với ảnh 1: pose có đúng hướng dùng khung riêng (`melee_SE`, `carry_N`…), thiếu hướng thì dùng hướng gần nhất + lật gương (renderer sẽ tìm `<pose>_<hướng>` trước).

## PROMPT
```
[Attach: the approved chief (chr_chief.png) AND the first chief sheet ALL_chief.png — this is its companion sheet: same character, same drawing style, same scale, same lighting.]
Create ONE sprite sheet of the tribe Chief for a comedic Stone-Age village-builder game: hand-painted HD 2D cartoon, clean dark-brown outline (#2B2014), cel shading with 2-3 tones, light from the upper-left, warm earthy palette, family friendly, no blood. No text, no labels, no grid lines, no ground shadows.

CHARACTER (identical in every cell, match the attachments EXACTLY): the Chief, comically fat with a big pot belly, lazy-proud face, big bushy beard, large white-and-dark feather headdress with a bone-skull band, tiger-skin cape, bone-tooth necklace, leopard-spotted loincloth, bare feet.

SHEET: ONE square image, 10 columns × 10 rows = 100 equal cells, highest resolution available. Flat pure chroma green #00FF00 background (no gradient), wide empty gutters, nothing touching or cropped. In every cell the SAME character at the SAME scale as in the first sheet, full body, feet (or ground contact) on a common baseline per row.
Hands: in melee/throw/stab poses closed fists (weapons are drawn separately); in work poses draw only the simple hand-held tool or carried load (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs on the shoulder) in the same style.
INTERACTION RULE: draw ONLY the character, plus the hand-held tool/food or the carried bundle named in a pose. NEVER draw anything the character interacts with: no trees, bushes, rocks, ore, animals, carcasses, fish, water, buildings, pots, fire, stakes, nets, tables, ground props, particles, motion lines or shadows. Every action pose must clearly act on an INVISIBLE target at the stated direction and height (the game places the real tree/animal/rock there), so the pose reads as hitting / picking / stabbing / cooking that thing: e.g. chop = a full-body swing aimed at an invisible tree trunk in front of him.
DIRECTIONS: S = facing the viewer (slight 3/4 front; the action happens toward the viewer), SE = 3/4 turned toward the viewer's right, E = full side profile facing right, NE = 3/4 back view turned right, N = back to the viewer (we see his back and cape; the action happens away from the viewer). Never draw west-facing.

POSES (consecutive cells = consecutive frames; if a pose has fewer frames than beats, use evenly spaced key beats incl. first and last):
- melee: ready, weapon arm cocked / wind-up arm back / apex raised high / STRIKE lunging, arm swinging down / follow-through, off-balance
- stand: relaxed neutral stance, breathing
- throw: ready / wind-up arm drawn back behind the head / RELEASE arm forward, open hand / follow-through
- stab: spear held low, ready / THRUST forward at an invisible target, body lunging
- putdown: crouching, setting the carried bundle of logs down on an invisible ground
- pickup: crouching, lifting a heavy bundle of logs with both arms
- chop: both hands on an axe raised overhead, leaning back / apex / STRIKE: swinging down hard at an invisible tree trunk at chest height in front of him / impact squash, tugging the axe back
- look: glance toward the viewer-right side / glance back (head and eyes only, side profile)
- mine: pickaxe raised high / apex / STRIKE down at an invisible rock on the ground in front of him / impact squash, bracing
- build: hammer raised at the shoulder / STRIKE down on an invisible stake at waist height / impact, bracing / lifting again
- butcher: kneeling, stone knife raised over an invisible carcass on the ground / cutting downward / standing up, wiping the knife
- forage: reaching up to pluck from an invisible bush at chest height, a basket on the other arm / plucking / bending to pull invisible low plants / rising with a closed handful
- fish: standing at an invisible water edge, spear raised, concentrating / spear thrust down toward the invisible water / pulling the spear up, straining / raising the spear proudly, free fist up
- sit_rest: seated cross-legged in side profile, resting, breathing
- carry: walking while carrying a heavy bundle of logs on one shoulder, slightly bent, 4-frame walk cycle
- cook: leaning over an invisible pot, stirring with a long spoon / tasting from the spoon, delighted / stirring again
- stagger: struck from behind-the-viewer side in profile: head snapped back, stumbling / regaining balance, dazed
- sneak: crouched creeping, left foot forward / passing step / right foot forward (head scanning)
- eat: seated in side profile, meat chunk raised to the mouth / biting, cheeks full / chewing happily, eyes closed / swallowing and licking the lips

CELLS, left→right, top→bottom (pose_direction × number of frames):
R1: melee_SE×4 | melee_NE×4 | stand_SE×1 | stand_NE×1
R2: melee_N×4 | throw_S×3 | stab_S×2 | putdown_E×1
R3: throw_SE×3 | throw_NE×3 | throw_N×3 | pickup_E×1
R4: stab_N×2 | chop_S×3 | chop_N×3 | look_E×2
R5: mine_S×3 | mine_N×3 | build_S×4
R6: build_N×4 | butcher_S×3 | forage_E×3
R7: forage_N×3 | fish_S×3 | fish_N×3 | sit_rest_E×1
R8: carry_S×4 | carry_SE×4 | cook_E×2
R9: carry_NE×4 | carry_N×4 | stagger_E×2
R10: sneak_S×3 | sneak_N×3 | eat_E×4
```
