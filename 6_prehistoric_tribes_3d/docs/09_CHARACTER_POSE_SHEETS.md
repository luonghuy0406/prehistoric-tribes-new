> **THAY BẰNG `10_POSE_SHEETS_COMPACT.md`** (prompt ngắn hơn, 64 ô/ảnh, đủ trạng thái như tù trưởng). File này giữ lại để tham khảo.

# 09 — Prompt vẽ tư thế cho TỪNG nhân vật (khuôn chung 8×6)

Bối cảnh: `07_ANIMATION_STATES.md` (trạng thái gốc), `08_CHIEF_POSE_SHEETS.md` (tù trưởng, khuôn riêng 5 hướng). Tài liệu này sinh bằng `tools/gen_pose_prompts.py` (nguồn dữ liệu duy nhất; sửa script rồi chạy lại để prompt và `tools/pose_sheet_specs.json` luôn khớp).

## Khuôn chung (mỗi nhân vật = 1 ảnh)
- Lưới **8 cột × 6 hàng = 48 ô**, tỉ lệ **4:3** (ví dụ 1536×1152; càng lớn càng tốt).
- **Hàng 1–3 giống nhau cho mọi nhân vật:** đi bộ 6 khung theo 3 hướng — NAM (nhìn thẳng), ĐÔNG (nhìn ngang), BẮC (quay lưng) — kèm 1 khung đứng + 1 khung nhìn quanh mỗi hướng. Hướng SE/NE dùng lại khung ĐÔNG (renderer xoay/nghiêng nhẹ); TÂY = lật gương.
- **Hàng 4–6 (24 ô) tuỳ vai trò** (xem bảng từng nhân vật): làm việc / chiến đấu / ngồi–ăn–ngủ / buồn / nhảy / ngã–chết…
- Tay không (hoặc nắm tay như đang cầm cán): vũ khí và dụng cụ do game vẽ riêng.
- Chạy, mang đồ, lén dùng lại khung đi bộ (tăng tốc/nghiêng bằng code); riêng trinh sát có hàng `sneak` riêng.

## Cách dùng
1. Dán **GLOBAL STYLE** (`06_GEMINI_SHEET_PROMPTS.md`, mục 0), đính kèm ảnh tham chiếu ghi ở từng mục, rồi dán prompt.
2. Lưu `assets/hd/source/sheets/PS_<nhân_vật>.png`. Tôi sẽ cắt theo `tools/pose_sheet_specs.json` (cắt theo ô đều + bbox từng ô) và đặt tên `<nhân_vật>@<pose>_<hướng>_<khung>`.
3. Thiếu/sai ô: *"Keep everything as is. Only redraw cell R?C?: …"*.
4. **Thứ tự ưu tiên** (số ảnh = số nhân vật): P0 `villager_m`, `villager_f`, `child` (kinh tế/đời sống) → P1 `warrior`, `enemy_warrior`, `shaman`, `scout` → P2 `enemy_chief`. Tù trưởng dùng 3 sheet ở `08_`. Tổng 8 ảnh + 3 = 11.
5. Mẹo tiết kiệm quota: nếu phải chọn, làm trước `villager_m` + `villager_f` + `enemy_warrior` (đủ để thấy dân làm việc/ngủ/ăn và quân địch đánh/ngã/chết).

---

## villager_m — P0  ·  `PS_villager_m.png`
Ảnh tham chiếu đính kèm: **S01_characters_civil.png row 1 + chr_villager_m.png**.
Tư thế hàng 4–6: work-E×4, gather-S×3, sad-S×1, sit_down-S×2, sit_rest-S×1, eat-S×2, sleep-S×2, dance-S×1, melee-E×3, throw-E×2, stagger-S×1, die-S×2.

```
[Attach: the approved reference S01_characters_civil.png row 1 + chr_villager_m.png. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Adult male caveman villager: stocky, big round head, messy dark hair, short scruffy beard, thick eyebrows, friendly goofy grin, one-shoulder brown fur tunic with a rope belt, bare feet with leather wraps.
Hands: closed fists as if gripping an invisible tool/club handle (tools and weapons are drawn separately). Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 WORK (EAST; 4 frames): frame 1: raises the tool overhead, leaning back; frame 2: apex of the swing, tool high above the head; frame 3: STRIKE: body lunges forward, tool swinging down; frame 4: impact squash, then starting to lift the tool again | c5-c7 GATHER (facing the viewer; 3 frames): frame 1: bends forward from the hips, reaching down; frame 2: both hands grabbing plants/berries, torso low; frame 3: rises with the harvest held to the chest | c8 SAD (facing the viewer; 1 frame): frame 1: SAD / GLOOMY: slumped, shoulders down, head hanging, long sigh.
Row 5: c1-c2 SIT DOWN (facing the viewer; 2 frames): frame 1: bending the knees, one hand on a thigh; frame 2: sitting cross-legged on the ground | c3 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c4-c5 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c6-c7 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on his back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c8 DANCE (facing the viewer; 1 frame): frame 1: goofy dance pose: arms up, hip swung to the left, one knee raised.
Row 6: c1-c3 MELEE (EAST; 3 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down, mouth shouting; frame 3: recovery: returning to the ready stance | c4-c5 THROW (EAST; 2 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward | c6 STAGGER (facing the viewer; 1 frame): frame 1: HIT: struck from the front, head snapped back, stumbling backward | c7-c8 DIE (facing the viewer; 2 frames): frame 1: knocked backward, falling, arms flailing; frame 2: lying flat on the back, cartoon X eyes, limp (no blood).

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## villager_f — P0  ·  `PS_villager_f.png`
Ảnh tham chiếu đính kèm: **S01_characters_civil.png row 2**.
Tư thế hàng 4–6: work-E×4, gather-S×3, sad-S×1, sit_down-S×2, sit_rest-S×1, eat-S×2, sleep-S×2, dance-S×1, melee-E×3, throw-E×2, stagger-S×1, die-S×2.

```
[Attach: the approved reference S01_characters_civil.png row 2. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Adult cavewoman villager: big round head, voluminous wavy dark hair with a bone clip, cheerful, light-brown spotted fur dress, necklace of teeth beads, bare feet.
Hands: closed fists as if gripping an invisible tool/club handle (tools and weapons are drawn separately). Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 WORK (EAST; 4 frames): frame 1: raises the tool overhead, leaning back; frame 2: apex of the swing, tool high above the head; frame 3: STRIKE: body lunges forward, tool swinging down; frame 4: impact squash, then starting to lift the tool again | c5-c7 GATHER (facing the viewer; 3 frames): frame 1: bends forward from the hips, reaching down; frame 2: both hands grabbing plants/berries, torso low; frame 3: rises with the harvest held to the chest | c8 SAD (facing the viewer; 1 frame): frame 1: SAD / GLOOMY: slumped, shoulders down, head hanging, long sigh.
Row 5: c1-c2 SIT DOWN (facing the viewer; 2 frames): frame 1: bending the knees, one hand on a thigh; frame 2: sitting cross-legged on the ground | c3 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c4-c5 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c6-c7 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on her back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c8 DANCE (facing the viewer; 1 frame): frame 1: goofy dance pose: arms up, hip swung to the left, one knee raised.
Row 6: c1-c3 MELEE (EAST; 3 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down, mouth shouting; frame 3: recovery: returning to the ready stance | c4-c5 THROW (EAST; 2 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward | c6 STAGGER (facing the viewer; 1 frame): frame 1: HIT: struck from the front, head snapped back, stumbling backward | c7-c8 DIE (facing the viewer; 2 frames): frame 1: knocked backward, falling, arms flailing; frame 2: lying flat on the back, cartoon X eyes, limp (no blood).

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## child — P0  ·  `PS_child.png`
Ảnh tham chiếu đính kèm: **S01_characters_civil.png row 3**.
Tư thế hàng 4–6: play-S×4, sit_play-S×2, cry-S×2, sit_down-S×2, sit_rest-S×1, eat-S×2, sleep-S×2, sad-S×1, stagger-S×2, die-S×4, cheer-S×2.

```
[Attach: the approved reference S01_characters_civil.png row 3. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Cave child about 6 years old: head about 1/3 of the body height, tiny fur loincloth, messy hair, mischievous smile. The whole figure is about 65% of an adult height.
Hands: empty hands. Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 PLAY (facing the viewer; 4 frames): frame 1: jumping with arms up, laughing; frame 2: running playfully, arms out like a plane; frame 3: spinning around, arms wide; frame 4: happy hop, one leg lifted, giggling | c5-c6 SIT PLAY (facing the viewer; 2 frames): frame 1: sitting on the ground playing with small stones; frame 2: sitting, laughing and stacking a tiny stone tower | c7-c8 CRY (facing the viewer; 2 frames): frame 1: rubbing the eyes with the fists, crying with tears; frame 2: wailing, mouth wide open, big tears streaming.
Row 5: c1-c2 SIT DOWN (facing the viewer; 2 frames): frame 1: bending the knees, one hand on a thigh; frame 2: sitting cross-legged on the ground | c3 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c4-c5 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c6-c7 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on their back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c8 SAD (facing the viewer; 1 frame): frame 1: SAD / GLOOMY: slumped, shoulders down, head hanging, long sigh.
Row 6: c1-c2 STAGGER (facing the viewer; 2 frames): frame 1: HIT: struck from the front, head snapped back, stumbling backward; frame 2: regaining balance, dazed with swirling eyes | c3-c6 DIE (facing the viewer; 4 frames): frame 1: hit and knocked backward, arms flailing; frame 2: falling through the air, body tilted; frame 3: lying flat on the back, cartoon X eyes (no blood); frame 4: final frame: same lying pose with a few little stars above | c7-c8 CHEER (facing the viewer; 2 frames): frame 1: cheering: both arms up, mouth open; frame 2: cheering: jumping with arms up.

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## warrior — P1  ·  `PS_warrior.png`
Ảnh tham chiếu đính kèm: **S02_characters_roles.png row 1 + chr_villager_m.png**.
Tư thế hàng 4–6: melee-E×4, melee-S×3, ready-S×1, throw-E×3, throw-S×2, stagger-S×1, die-S×2, taunt-S×2, sit_down-S×1, sit_rest-S×1, eat-S×1, sleep-S×2, dance-S×1.

```
[Attach: the approved reference S02_characters_roles.png row 1 + chr_villager_m.png. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Tribe warrior: muscular, leather chest strap with bone shoulder pads, red ochre war-paint stripes, determined frown, bare feet.
Hands: closed fists as if gripping an invisible club handle (weapons are drawn separately). Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 MELEE (EAST; 4 frames): frame 1: ready stance, club arm cocked; frame 2: wind-up apex, arm raised high behind the shoulder; frame 3: STRIKE: body lunges forward, arm swinging down (impact squash); frame 4: follow-through: arm low in front, off-balance | c5-c7 MELEE (facing the viewer; 3 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down, mouth shouting; frame 3: recovery: returning to the ready stance | c8 READY (facing the viewer; 1 frame): frame 1: READY STANCE: fists up, knees bent, determined glare.
Row 5: c1-c3 THROW (EAST; 3 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward; frame 3: follow-through: arm down across the body, off-balance | c4-c5 THROW (facing the viewer; 2 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward | c6 STAGGER (facing the viewer; 1 frame): frame 1: HIT: struck from the front, head snapped back, stumbling backward | c7-c8 DIE (facing the viewer; 2 frames): frame 1: knocked backward, falling, arms flailing; frame 2: lying flat on the back, cartoon X eyes, limp (no blood).
Row 6: c1-c2 TAUNT (facing the viewer; 2 frames): frame 1: TAUNT: beats his chest with a roar; frame 2: TAUNT: arms wide, head thrown back, laughing menacingly | c3 SIT DOWN (facing the viewer; 1 frame): frame 1: SITTING: cross-legged on the ground | c4 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c5 EAT (facing the viewer; 1 frame): frame 1: seated, biting a chunk of roast meat, cheeks full | c6-c7 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on his back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c8 DANCE (facing the viewer; 1 frame): frame 1: goofy dance pose: arms up, hip swung to the left, one knee raised.

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## enemy_warrior — P1  ·  `PS_enemy_warrior.png`
Ảnh tham chiếu đính kèm: **S02_characters_roles.png row 4**.
Tư thế hàng 4–6: melee-E×4, melee-S×3, taunt-S×1, throw-E×3, throw-S×2, stagger-S×1, die-S×2, sit_rest-S×1, eat-S×2, sleep-S×2, dance-S×3.

```
[Attach: the approved reference S02_characters_roles.png row 4. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Enemy "cannibal" tribe warrior (cartoon villain, family friendly): dark grey-purple furs, white chalk skull-like face paint, bone in a hair topknot, necklace of small bones, funny menacing grin, bare feet. Must not resemble any real ethnic group.
Hands: closed fists as if gripping an invisible club handle (weapons are drawn separately). Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 MELEE (EAST; 4 frames): frame 1: ready stance, club arm cocked; frame 2: wind-up apex, arm raised high behind the shoulder; frame 3: STRIKE: body lunges forward, arm swinging down (impact squash); frame 4: follow-through: arm low in front, off-balance | c5-c7 MELEE (facing the viewer; 3 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down, mouth shouting; frame 3: recovery: returning to the ready stance | c8 TAUNT (facing the viewer; 1 frame): frame 1: TAUNT: beats his chest with a roar, arms wide.
Row 5: c1-c3 THROW (EAST; 3 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward; frame 3: follow-through: arm down across the body, off-balance | c4-c5 THROW (facing the viewer; 2 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward | c6 STAGGER (facing the viewer; 1 frame): frame 1: HIT: struck from the front, head snapped back, stumbling backward | c7-c8 DIE (facing the viewer; 2 frames): frame 1: knocked backward, falling, arms flailing; frame 2: lying flat on the back, cartoon X eyes, limp (no blood).
Row 6: c1 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c2-c3 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c4-c5 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on his back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c6-c8 DANCE (facing the viewer; 3 frames): frame 1: dance beat 1: hip left, arms up; frame 2: dance beat 2: knees bent, arms swinging; frame 3: dance beat 3: hip right, small jump.

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## shaman — P1  ·  `PS_shaman.png`
Ảnh tham chiếu đính kèm: **S02_characters_roles.png row 2**.
Tư thế hàng 4–6: cast-S×4, channel-S×3, sad-S×1, sit_down-S×2, sit_rest-S×1, eat-S×2, sleep-S×2, dance-S×3, melee-E×2, stagger-S×2, die-S×2.

```
[Attach: the approved reference S02_characters_roles.png row 2. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Shaman: thin old man, long white beard, bird-skull mask pushed up on the forehead, robe of leaves and feathers, gnarled staff topped with a glowing crystal and dangling bones (he always holds the staff in one hand except while sitting, sleeping or eating).
Hands: the free hand open, the other holding the staff. Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 CAST (facing the viewer; 4 frames): frame 1: raises the staff, crystal glowing (no extra effects drawn); frame 2: arms wide, eyes closed, chanting; frame 3: pounds the staff down, one foot stamping; frame 4: arms raised to the sky, head back | c5-c7 CHANNEL (facing the viewer; 3 frames): frame 1: hands outstretched forward, concentrating, brows furrowed; frame 2: hands trembling with effort, eyes squeezed shut; frame 3: finishes, lowers the hands with a relieved smile | c8 SAD (facing the viewer; 1 frame): frame 1: SAD / GLOOMY: slumped, shoulders down, head hanging, long sigh.
Row 5: c1-c2 SIT DOWN (facing the viewer; 2 frames): frame 1: bending the knees, one hand on a thigh; frame 2: sitting cross-legged on the ground | c3 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c4-c5 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c6-c7 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on his back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c8 DANCE (facing the viewer; 1 frame): frame 1: goofy dance pose: arms up, hip swung to the left, one knee raised.
Row 6: c1-c2 MELEE (EAST; 2 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down | c3-c4 STAGGER (facing the viewer; 2 frames): frame 1: HIT: struck from the front, head snapped back, stumbling backward; frame 2: regaining balance, dazed with swirling eyes | c5-c6 DIE (facing the viewer; 2 frames): frame 1: knocked backward, falling, arms flailing; frame 2: lying flat on the back, cartoon X eyes, limp (no blood) | c7-c8 DANCE (facing the viewer; 2 frames): frame 1: dance beat 1: hip left, arms up; frame 2: dance beat 2: hip right, small jump.

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## scout — P1  ·  `PS_scout.png`
Ảnh tham chiếu đính kèm: **S02_characters_roles.png row 3**.
Tư thế hàng 4–6: sneak-E×4, hide-S×2, unhide-S×1, peek-S×1, throw-E×3, throw-S×2, stagger-S×1, die-S×2, melee-E×2, sit_down-S×1, sit_rest-S×1, eat-S×2, sleep-S×2.

```
[Attach: the approved reference S02_characters_roles.png row 3. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: PIA scout (Prehistoric Intelligence Agency): lean, camouflage of leaves and twigs, green face-paint stripes, leaf headband, sneaky self-important look, bare feet.
Hands: closed fists as if gripping an invisible handle (weapons are drawn separately). Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c4 SNEAK (EAST; 4 frames): frame 1: crouched low creeping, left foot forward; frame 2: crouched, weight shifting, passing step; frame 3: crouched creeping, right foot forward; frame 4: crouched, passing step, head turned scanning | c5-c6 HIDE (facing the viewer; 2 frames): frame 1: crouching low, pulling a leafy branch over himself; frame 2: fully crouched under the leafy cover, only head and eyes visible | c7 UNHIDE (facing the viewer; 1 frame): frame 1: rising from the crouch, brushing leaves off, looking around | c8 PEEK (facing the viewer; 1 frame): frame 1: crouched, peeking out cautiously, one hand shading the eyes.
Row 5: c1-c3 THROW (EAST; 3 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward; frame 3: follow-through: arm down across the body, off-balance | c4-c5 THROW (facing the viewer; 2 frames): frame 1: wind-up: throwing arm drawn back behind the head, leaning back; frame 2: RELEASE: arm forward with open hand, stepping forward | c6 STAGGER (facing the viewer; 1 frame): frame 1: HIT: struck from the front, head snapped back, stumbling backward | c7-c8 DIE (facing the viewer; 2 frames): frame 1: knocked backward, falling, arms flailing; frame 2: lying flat on the back, cartoon X eyes, limp (no blood).
Row 6: c1-c2 MELEE (EAST; 2 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down | c3 SIT DOWN (facing the viewer; 1 frame): frame 1: SITTING: cross-legged on the ground | c4 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c5-c6 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c7-c8 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on his back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher.

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## enemy_chief — P2  ·  `PS_enemy_chief.png`
Ảnh tham chiếu đính kèm: **S02_characters_roles.png row 5**.
Tư thế hàng 4–6: melee-E×3, melee-S×2, taunt-S×3, stagger-S×2, die-S×4, ready-S×2, sit_rest-S×1, eat-S×2, sleep-S×2, dance-S×3.

```
[Attach: the approved reference S02_characters_roles.png row 5. Paste GLOBAL STYLE first.] Match the style, outline thickness, lighting, colours, face, costume and proportions of the attached character EXACTLY.

Character: Enemy cannibal chief: tall and skinny, huge black-and-red feathered headdress, dark fur cape, white skull face paint, comically evil, bare feet.
Hands: closed fists as if gripping an invisible club handle (weapons are drawn separately). Family friendly cartoon, no blood, no text.

Draw ONE character pose sprite sheet: 8 columns x 6 rows = 48 cells on an invisible strict grid, all cells the SAME size, the SAME character at the SAME scale in every cell, full body, feet (or the body's contact point with the ground) on one common baseline per row, generous empty #00FF00 gutters between cells (nothing touching or cropped). Read order: left to right, then top to bottom. West-facing views are mirrored by code, do not draw them.

Row 1 (WALK-SOUTH, facing the viewer (SOUTH, slight three-quarter front)): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 2 (WALK-EAST, EAST: full side profile facing right): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 3 (WALK-NORTH, NORTH: back to the viewer): c1-c6 the 6 frames of ONE seamless walk cycle (1 contact: right foot forward; 2 down: passing step; 3 up: left knee raised; 4 contact: left foot forward; 5 down: passing step; 6 up: right knee raised), arms swinging opposite to the legs; c7 idle STANDING, relaxed, breathing; c8 idle LOOKING AROUND: head and eyes turned to glance to the side (body still).
Row 4: c1-c3 MELEE (EAST; 3 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down, mouth shouting; frame 3: recovery: returning to the ready stance | c4-c5 MELEE (facing the viewer; 2 frames): frame 1: wind-up: weapon arm drawn back, weight on the back foot; frame 2: STRIKE: lunging forward, arm swinging down | c6-c8 TAUNT (facing the viewer; 3 frames): frame 1: TAUNT: beats his chest with a roar; frame 2: TAUNT: arms wide, head thrown back, laughing menacingly; frame 3: TAUNT: points at the viewer with a sneer.
Row 5: c1-c2 STAGGER (facing the viewer; 2 frames): frame 1: HIT: struck from the front, head snapped back, stumbling backward; frame 2: regaining balance, dazed with swirling eyes | c3-c6 DIE (facing the viewer; 4 frames): frame 1: hit and knocked backward, arms flailing; frame 2: falling through the air, body tilted; frame 3: lying flat on the back, cartoon X eyes (no blood); frame 4: final frame: same lying pose with a few little stars above | c7-c8 READY (facing the viewer; 2 frames): frame 1: READY STANCE: fists up, knees bent, glaring; frame 2: READY STANCE variant: fists lower, bouncing on his toes.
Row 6: c1 SIT REST (facing the viewer; 1 frame): frame 1: sitting cross-legged, resting, relaxed, hands on knees | c2-c3 EAT (facing the viewer; 2 frames): frame 1: seated, holds a chunk of roast meat up to the mouth; frame 2: seated, biting it, cheeks full, eyes closed, happy | c4-c5 SLEEP (facing the viewer; 2 frames): frame 1: lying flat on his back on the ground (body horizontal, seen from the front camera), eyes closed; frame 2: same lying pose, mouth open snoring, chest slightly higher | c6-c8 DANCE (facing the viewer; 3 frames): frame 1: dance beat 1: hip left, arms up; frame 2: dance beat 2: knees bent, arms swinging; frame 3: dance beat 3: hip right, small jump.

Flat pure #00FF00 background everywhere, no gradient, no ground shadow, no grid lines, no labels, no text.
```

---

## Renderer sẽ dùng thế nào (khi có ảnh)
`PoseKind` (`07_`) → tên pose: `stand/fidget` → `stand`/`look`, `walk/run/carry` → `walk_<hướng>`, `work` → `work` (hoặc `gather` nếu job hái), `attack/power` → `melee`, `throw` → `throw`, `sit` → `sit_down`/`sit_rest`, `eat`, `sleep`, `dance`, `stagger`, `die`, `cast`/`channel` (shaman), `sneak`/`hide`/`unhide`/`peek` (trinh sát), `play`/`cry` (trẻ em); `gloom` ≥ 0.5 khi đứng → `sad`. Chọn khung theo `animationFrame / animationFrameCount`; hướng nhìn gần nhất (SE/NE → E) rồi lật gương; thiếu pose → rơi về hoạt ảnh code-driven.
Quy tắc chọn art: unit có vũ khí và job cận chiến/ném/lính gác → `warrior` (hoặc `enemy_warrior`); job shaman → `shaman`; job trinh sát → `scout`; còn lại → villager theo giới tính/tuổi.
