# 11 — Kiểm tra bản gốc: những trạng thái còn thiếu (làm việc, săn bắt, nguỵ trang…)

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
INTERACTION RULE: draw ONLY the character, plus the hand-held tool/food or the carried bundle named in a pose. NEVER draw anything the character interacts with: no trees, bushes, rocks, ore, animals, carcasses, fish, water, buildings, pots, fire, stakes, nets, tables, ground props, particles, motion lines or shadows. Every action pose must clearly act on an INVISIBLE target at the stated direction and height (the game places the real tree/animal/rock there), so the pose reads as hitting / picking / stabbing / cooking that thing: e.g. chop = a full-body swing aimed at an invisible tree trunk in front of him.
- chop: both hands on an axe raised overhead, leaning back / apex / STRIKE: swinging down hard at an invisible tree trunk at chest height in front of him / impact squash, tugging the axe back
- mine: pickaxe raised high / apex / STRIKE down at an invisible rock on the ground in front of him / impact squash, bracing
- build: hammer raised at the shoulder / STRIKE down on an invisible stake at waist height / impact, bracing / lifting again
- forage: reaching up to pluck from an invisible bush at chest height, a basket on the other arm / plucking / bending to pull invisible low plants / rising with a closed handful
- butcher: kneeling, stone knife raised over an invisible carcass on the ground / cutting downward / standing up, wiping the knife
- cook: leaning over an invisible pot, stirring with a long spoon / tasting from the spoon, delighted / stirring again
- stab: spear held low, ready / THRUST forward at an invisible target, body lunging
- fish: standing at an invisible water edge, spear raised, concentrating / spear thrust down toward the invisible water / pulling the spear up, straining / raising the spear proudly, free fist up
- carry: walking while carrying a heavy bundle of logs on one shoulder (the bundle is part of the pose), slightly bent, 4-frame walk cycle
- chat: talking, one hand gesturing / both hands gesturing, mouth open / nodding, listening
- putdown: crouching, setting the carried bundle of logs down on an invisible ground
- pickup: crouching, lifting a heavy bundle of logs with both arms
- trapped: struggling as if entangled by invisible restraints: arms flailing / pulling and wincing / slumped, sulking
```

## chief  ·  `TK_chief.png`
```
[Attach chr_chief.png + CH2_chief_states.png. GLOBAL STYLE + POSE LEGEND + TASK LEGEND already in this chat.]
Draw the TASK pose sprite sheet: ONE image, 8 columns × 6 rows = 48 equal cells (aspect 4:3, highest resolution), exact match to the attached character:
The tribe Chief: comically fat pot belly, lazy-proud face, big bushy beard, large feather headdress with a bone skull band, tiger-skin cape, bone-tooth necklace, leopard-spotted loincloth, bare feet. Hands: gripping the tool or load of each pose; EXACTLY the attached chief in every cell. No blood, no text. Draw ONLY the character with the simple hand-held tool or carried bundle of each pose (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs); NO trees, rocks, animals, water, pots, nets or any other object the pose interacts with: act on INVISIBLE targets.
Cells, left→right, top→bottom (pose_direction×frames):
R1: chop_E×4 | mine_E×4
R2: build_E×4 | forage_S×4
R3: butcher_E×3 | cook_S×3 | stab_E×2
R4: fish_E×4 | sneak_E×4
R5: hide_S×3 | peek_S×1 | chat_S×3 | putdown_S×1
R6: carry_E×4 | trapped_S×3 | pickup_S×1
```

## villager_m  ·  `TK_villager_m.png`
```
[Attach S01_characters_civil.png row 1 + chr_villager_m.png. GLOBAL STYLE + POSE LEGEND + TASK LEGEND already in this chat.]
Draw the TASK pose sprite sheet: ONE image, 8 columns × 6 rows = 48 equal cells (aspect 4:3, highest resolution), exact match to the attached character:
Adult male caveman villager: stocky, big round head, messy dark hair, short scruffy beard, thick eyebrows, friendly goofy grin, one-shoulder brown fur tunic with rope belt, bare feet with leather wraps. Hands: gripping the tool or load of each pose. No blood, no text. Draw ONLY the character with the simple hand-held tool or carried bundle of each pose (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs); NO trees, rocks, animals, water, pots, nets or any other object the pose interacts with: act on INVISIBLE targets.
Cells, left→right, top→bottom (pose_direction×frames):
R1: chop_E×4 | mine_E×4
R2: build_E×4 | forage_S×4
R3: butcher_E×3 | cook_S×3 | stab_E×2
R4: fish_E×4 | sneak_E×4
R5: hide_S×3 | peek_S×1 | chat_S×3 | putdown_S×1
R6: carry_E×4 | trapped_S×3 | pickup_S×1
```

## villager_f  ·  `TK_villager_f.png`
```
[Attach S01_characters_civil.png row 2. GLOBAL STYLE + POSE LEGEND + TASK LEGEND already in this chat.]
Draw the TASK pose sprite sheet: ONE image, 8 columns × 6 rows = 48 equal cells (aspect 4:3, highest resolution), exact match to the attached character:
Adult cavewoman villager: big round head, voluminous wavy dark hair with a bone clip, cheerful, light-brown spotted fur dress, teeth-bead necklace, bare feet. Hands: gripping the tool or load of each pose. No blood, no text. Draw ONLY the character with the simple hand-held tool or carried bundle of each pose (axe, pickaxe, hammer, basket, stone knife, long spoon, spear, bundle of logs); NO trees, rocks, animals, water, pots, nets or any other object the pose interacts with: act on INVISIBLE targets.
Cells, left→right, top→bottom (pose_direction×frames):
R1: chop_E×4 | mine_E×4
R2: build_E×4 | forage_S×4
R3: butcher_E×3 | cook_S×3 | stab_E×2
R4: fish_E×4 | sneak_E×4
R5: hide_S×3 | peek_S×1 | chat_S×3 | putdown_S×1
R6: carry_E×4 | trapped_S×3 | pickup_S×1
```
