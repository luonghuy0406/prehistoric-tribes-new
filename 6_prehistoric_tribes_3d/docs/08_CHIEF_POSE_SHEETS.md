# 08 — Prompt vẽ bộ tư thế của TÙ TRƯỞNG (3 sheet) cho Antigravity/ChatGPT

Bối cảnh & bảng trạng thái: `07_ANIMATION_STATES.md`. Đây là bộ **khung hình thật** thay cho hoạt ảnh "biến dạng bằng code" hiện tại. Cùng khuôn này sẽ tái dùng cho dân nam/nữ/trẻ em/chiến binh sau (đổi nhân vật, giữ bố cục).

## Cách dùng
1. Mỗi sheet: dán **GLOBAL STYLE** trong `06_GEMINI_SHEET_PROMPTS.md` (mục 0) + đính kèm **ảnh tù trưởng đã duyệt** (`assets/hd/source/characters/chr_chief.png`, hàng 4 của S01) và `chr_villager_m.png`. Thêm câu: *"The character must be EXACTLY the attached chief in every cell: same face, beard, feather headdress, tiger-skin cape, belly, proportions, outline and colours."*
2. Nền **#00FF00 phẳng**, mỗi ô cách nhau ≥ 6%, chân cùng một đường nền, không chữ, không bóng đổ, không vẽ lưới.
3. Độ phân giải lớn nhất cho phép (≥ 2048 px cạnh dài nếu được; ảnh 1536×1024 vẫn dùng được, ~200 px/nhân vật).
4. Lưu: `assets/hd/source/sheets/CH1_chief_walk.png`, `CH2_chief_states.png`, `CH3_chief_action.png`. Tôi sẽ viết tool cắt (cùng cách với `slice_sheets.py`) và nối vào renderer.
5. Nếu thiếu/sai ô: gửi *"Keep everything as is. Only redraw cell R?C?: …"*.
6. **Tay không**: vũ khí/dụng cụ do game vẽ riêng; khi cần cầm gậy thì chỉ nắm tay như đang cầm cán.

---

## CH1 — Đi bộ 5 hướng (30 khung)  ·  `CH1_chief_walk.png`
Tỉ lệ 3:2 (ví dụ 1536×1024). Lưới **6 cột × 5 hàng**.

```
[Attach the approved chief + GLOBAL STYLE.] Walk-cycle sprite sheet of the tribe Chief (comically fat,
pot belly, big bushy beard, feather headdress, tiger-skin cape, bare feet), 6 columns = the 6 frames of
ONE seamless walk cycle (left to right: 1 contact with right foot forward, 2 down/passing, 3 up with
left knee raised, 4 contact with left foot forward, 5 down/passing, 6 up with right knee raised),
5 rows = viewing directions (top to bottom): SOUTH (toward the viewer), SOUTH-EAST, EAST (full profile,
facing right), NORTH-EAST, NORTH (back to the viewer). West views are mirrored by code.
Same scale in every cell, full body, feet on one baseline per row, arms swinging naturally opposite
to the legs, belly and cape and feathers swaying slightly with the steps. Empty hands, relaxed
confident waddle. Flat #00FF00 background, wide gutters, 6x5 invisible grid, no text.
```

## CH2 — Trạng thái nghỉ & cảm xúc (35 khung, hướng NAM)  ·  `CH2_chief_states.png`
Tỉ lệ 3:2 hoặc 7:5. Lưới **7 cột × 5 hàng**. Tất cả nhìn về phía người xem (SOUTH, hơi 3/4 trước) trừ khi ghi khác.

```
[Attach the approved chief + GLOBAL STYLE.] Pose sprite sheet of the tribe Chief, 7 columns x 5 rows,
every cell the same character at the same scale, facing the viewer (slight three-quarter front), feet
(or contact point) on a common baseline, empty hands, comedic lazy-but-proud personality.
Row 1 (idle): c1-c4 LOOKING AROUND: looks to his left, back to centre, looks to his right, back to
centre (head and eyes turn, body barely moves). c5-c7 FIDGET: scratches his head with one hand (3 frames:
hand rises, scratching, lowers) with a puzzled look.
Row 2 (sitting): c1-c3 SITTING DOWN: standing -> bending knees -> sitting on the ground, legs crossed.
c4-c5 SITTING AT REST: sitting cross-legged, breathing, one frame with belly rise and one with belly fall.
c6-c7 EATING (seated): holds a chunk of roast meat to his mouth, then bites with cheeks full.
Row 3: c1-c2 EATING continued: chewing happily with eyes closed, then wiping his mouth on his arm.
c3-c4 SLEEPING: lying on his back on the ground, drawn as seen from the front camera (body horizontal),
mouth open snoring, arms on belly; two frames with belly rising and falling.
c5-c7 SAD / GLOOMY IDLE (the "depressed" state): standing slumped, shoulders down, head hanging, big sigh
(frame 1 head down, frame 2 chest empties, frame 3 shakes head), feathers drooping.
Row 4: c1-c4 DANCING (disco): goofy hip-swinging dance, arms up, knees bent, belly jiggling, 4 distinct
beats of a loop (left hip, centre, right hip, jump). c5-c7 CHEERING / COMMANDING: raises one fist and
shouts, then both arms up, then points forward with a stern face (the chief giving orders).
Row 5: c1-c3 HIT / STAGGER: struck from the front: head snaps back, stumbles backward, regains balance
(cartoon, no blood). c4-c7 DYING: knocked backward, falls onto his back, lies flat with cartoon X eyes,
then a final frame with a tiny bone-shaped halo or stars above (4 frames, no blood).
Flat #00FF00 background, wide gutters, 7x5 invisible grid, no text.
```

## CH3 — Chiến đấu & lao động (28 khung, hướng ĐÔNG và NAM)  ·  `CH3_chief_action.png`
Tỉ lệ 3:2 hoặc 7:4. Lưới **7 cột × 4 hàng**. Hàng EAST = nhìn ngang (profile) hướng sang phải; hàng SOUTH = nhìn thẳng về người xem.

```
[Attach the approved chief + GLOBAL STYLE.] Action sprite sheet of the tribe Chief, 7 columns x 4 rows,
same character, scale and baseline in all cells, fists closed as if gripping an invisible handle (tools and
weapons are drawn separately), strong cartoon anticipation / impact / follow-through.
Row 1 (EAST profile facing right) MELEE SWING: c1 ready stance, c2 wind-up (club arm back, weight on
back foot), c3 apex raised high, c4 STRIKE (body lunges forward, arm swinging down), c5 impact frame
(squashed, wide stance), c6 follow-through, c7 recovery to ready.
Row 2 (SOUTH, facing the viewer) MELEE SWING: the same 7 beats as row 1 but seen from the front
(a downward overhead chop toward the viewer-left).
Row 3 (EAST profile) THROW: c1 ready, c2 wind-up (arm drawn back behind the head, body leans back),
c3 stretch, c4 RELEASE (arm forward, open hand), c5 follow-through (step forward), c6 balance, c7 return to ready.
Row 4 WORK SWING for chopping / mining / hammering: c1-c4 EAST profile: raises the tool overhead,
strikes down, impact, lifts again (4 frames loop). c5-c7 SOUTH view: stoops forward and reaches down
as if picking berries / plants (3 frames: bend, grab, rise).
Flat #00FF00 background, wide gutters, 7x4 invisible grid, no text.
```

## Cách renderer dùng (sẽ làm khi có ảnh)
- Tên sau khi cắt: `chr_chief@walk_<S|SE|E|NE|N>`, `chr_chief@look`, `@fidget`, `@sit_down`, `@sit_rest`, `@eat`, `@sleep`, `@sad`, `@dance`, `@cheer`, `@stagger`, `@die`, `@melee_E|S`, `@throw_E`, `@work_E`, `@gather_S` (chuỗi khung của một tư thế).
- `PoseKind` → pose + khung: `walk/run/carry` → walk (chạy = tua nhanh, mang đồ = cùng khung + code nghiêng), `stand` → khung 1 của walk hoặc `look`, `fidget` → `look/fidget`, `sit` (113–116) → `sit_down/sit_rest`, `eat` → `eat`, `sleep` → `sleep`, `dance` → `dance`, `attack/power` → `melee_*`, `throw` → `throw_E`, `work` → `work_E` (cúi → `gather_S`), `stagger` → `stagger`, `die` → `die`, `gloom` ≥ 0.5 khi đứng → `sad`.
- Chọn khung theo `animationFrame / animationFrameCount` của engine (nội suy sang số khung đã vẽ); hướng nhìn lấy gần nhất rồi lật gương; thiếu pose/khung → rơi về hoạt ảnh code-driven.
