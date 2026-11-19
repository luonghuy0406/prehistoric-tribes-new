# NOTES — nhật ký làm việc chung (thêm mới ở đầu file)

---
## 2026-11-19 — Nhập 2 ảnh tù trưởng mới (`1new.webp`, `2new.webp`) (Claude)

Chi tiết `docs/14_CHIEF_NEW_SHEETS_REVIEW.md`. **Ảnh 1:** 100/100 ô nhưng số khung/pose lệch spec và nhiều hàng dính vật thể (gốc cây, đá, cọc, bụi, xác, nồi, nước/cá, lưới) → chỉ nhập pose sạch: `stab_E`, `carry_E` (4), `sneak_E` (4), `hide_S` (3), `peek_S`, `chat_S` (2) bằng `tools/slice_chief_new.py` (cắt theo nội dung thực, lọc mảnh thừa, `ref`=114 px riêng vì ảnh nhỏ ~105 px/nhân vật). **Ảnh 2:** không theo bố cục (không có N/NE/SE thật) → không nhập. Đã xem trong game: mang vác (khúc gỗ trên vai) và ẩn nấp (bụi lá) hiện đúng; nói chuyện/đâm giáo/đi lén chưa quan sát (đều đã nạp, renderer dùng `carry_E`, `sneak_E`, `hide_S`, `chat_S`; `stab_E`/`peek_S` chưa có đường gọi).
**Bài học:** model giữ được bố cục tới ~35–48 ô, trôi ở 100 ô; cần prompt dạng "hàng = hướng, cột = hành động", ≤ 50 ô/ảnh, không vật thể.

---
## 2026-11-19 — Quy tắc "tương tác với vật thể vô hình" trong mọi prompt tư thế (Claude)

Phản hồi: prompt tạo nhân vật phải thể hiện **tương tác** với cây, thú… nhưng **không vẽ các vật đó vào ảnh**. Thêm `INTERACTION_RULE` (trong `tools/gen_pose_prompts.py`) vào: prompt tù trưởng 1 & 2 (`12_`, `13_`), POSE LEGEND (`10_`), TASK LEGEND (`11_`): chỉ vẽ nhân vật + dụng cụ cầm tay/hàng mang (rìu, cuốc, búa, giỏ, dao, muỗng, giáo, bó củi); cấm cây, bụi, đá, quặng, thú, xác, cá, nước, nhà, nồi, lửa, cọc, lưới, bàn, vật nền, hiệu ứng, bóng. Các tư thế viết lại hướng vào **mục tiêu vô hình** có hướng/độ cao rõ (chặt = vung vào thân cây vô hình ngang ngực; đào = vào đá dưới chân; xây = vào cọc ngang hông; hái = bụi ngang ngực; mổ = quỳ trên xác vô hình; nấu = cúi trên nồi vô hình; câu = ngoài mép nước vô hình; bẫy = vật cản vô hình). Mô tả cá cắn câu / lưới / nồi / xác trong prompt cũ đã bỏ.
**Còn phải xem khi có ảnh:** model vẫn có thể "tự thêm" vật thể dù đã cấm; nếu có, nhờ vẽ lại hàng đó kèm câu "remove the <object>, draw only the character".

---
## 2026-11-19 — Prompt thứ 2 cho tù trưởng: các hướng còn thiếu (Claude)

`docs/13_CHIEF_SINGLE_PROMPT_2.md` (`tools/gen_chief_prompt2.py`, spec `tools/chief_single_sheet2_spec.json`): ảnh vuông 10×10 = 100 ô, 19 tư thế **bổ sung hướng** cho ảnh 1: đánh SE/NE/N, ném S/SE/NE/N, đâm S/N, chặt/đào/xây S/N, câu cá S/N, hái E/N, mang vác S/SE/NE/N, đi lén S/N + đứng SE/NE, nhìn quanh E, ngồi nghỉ E, ăn nghiêng, lảo đảo E, nấu E, đặt/nhặt E, mổ S. Làm SAU ảnh 1 và đính kèm ảnh 1 để khớp nét/tỉ lệ. Tổng 2 ảnh = 200 ô, mỗi ảnh vẫn ~205 px/ô ở 2048².
**Renderer:** `poseFrame` giờ tìm strip theo đúng hướng (`<pose>_<SE|NE|S|N|E>`) trước, rồi mới rơi về hướng gần nhất + lật gương (melee, throw, chop/mine/build, forage, butcher, fish, carry, sneak, stand, eat nghiêng cho anim 86, stagger E, putdown/pickup E). Typecheck/lint/test sạch; chưa thử với art thật (chưa có ảnh).

---
## 2026-11-19 — Một prompt duy nhất cho tù trưởng (Claude)

`docs/12_CHIEF_SINGLE_PROMPT.md` (sinh bởi `tools/gen_chief_prompt.py`, spec `tools/chief_single_sheet_spec.json`): prompt tự chứa (~5.200 ký tự), **1 ảnh vuông 10×10 = 100 ô, 31 tư thế** gồm cả bộ nền (đi 5 hướng, nghỉ, cảm xúc, chiến đấu) lẫn bộ "VIỆC" (chặt, đào, xây, hái, mổ, nấu, câu cá, nguỵ trang, mang vác, bẫy). Thay `08_` và phần tù trưởng của `11_`. Rủi ro: 100 ô trong một ảnh → ô ~154–205 px (tuỳ độ phân giải) và model có thể sai/bỏ ô; có sẵn câu sửa từng hàng. Tool cắt cho ảnh này chưa viết (đợi ảnh).

---
## 2026-11-19 — Kiểm tra lại bản gốc: trạng thái lao động/săn/nguỵ trang còn thiếu (Claude)

Phản hồi: tù trưởng chưa đủ trạng thái (xây, săn, thu gom, chặt gỗ, làm đá, chiến đấu, bắn cung, nguỵ trang). `docs/11_TASK_POSES.md` ghi kết quả đối chiếu mã: **mọi việc lao động dùng chung animation 21 (2 khung)** (khác nhau ở dụng cụ trên tay); xây/rèn = 53, sửa = 54, nấu = 81–84, câu cá = 141–146, mang = 1, đưa hàng = 22; **không có cung** — tầm xa = ném đá/giáo/rìu (`weaponTaskOffset` 1,2,5); **nguỵ trang = mọi unit có `scoutingSkill > 3`**, đứng yên 2 chu kỳ không bị thấy → HIDE 149 + cờ HIDDEN, đi lén = SNEAK 5, UNHIDE 150.
**Renderer:** `workActOf(task)` → chọn bộ khung theo việc (`chop_E`, `mine_E`, `build_E`, `forage_S`, `butcher_E`, fallback `work_E`/`gather_S`); thêm `hide/unhide` (cờ HIDDEN → ẩn khi đứng yên, sneak khi di chuyển) + hoạt ảnh code tạm; `cook`, `fish`, `chat`, `trapped`, `carry_E`, `sneak_E`, `putdown_S` có chỗ cắm (thiếu khung → rơi về code); số khung mỗi pose lấy từ độ dài dải thực. Xác nhận bằng ván thật: giao tù trưởng chặt cây → task 11 + anim 21 → act `chop`.
**Art:** sheet "VIỆC" 48 ô (tù trưởng, dân nam, dân nữ): prompt ngắn trong `11_`, bảng ô `tools/task_pose_specs.json`, sinh bởi `tools/gen_pose_prompts.py`. Tool cắt khung tổng quát (cho `PS_*`/`TK_*`) vẫn chưa viết — đợi ảnh.

---
## 2026-11-19 — Prompt tư thế rút gọn cho mọi nhân vật (Claude)

`docs/10_POSE_SHEETS_COMPACT.md` (thay `09_`), sinh bằng `tools/gen_pose_prompts.py` + `tools/pose_sheet_specs.json`. **Mỗi nhân vật 1 ảnh vuông 8×8 = 64 ô, đủ 21 trạng thái như tù trưởng** (đi bộ 5 hướng × 4 khung, đứng, nhìn quanh, fidget, ngồi xuống/nghỉ, ăn, ngủ, buồn, nhảy, reo, lảo đảo, chết, + khối riêng 18 ô theo vai trò: dân = đánh/ném/làm việc/hái; chiến binh/địch = đánh E+S, ném E+S, sẵn sàng, khiêu khích; trẻ em = chơi/ngồi chơi/khóc/hái/nhảy/chỉ/vẫy; shaman = làm phép/truyền phép/ban phước/đánh bằng gậy/hái thuốc; trinh sát = lén/ẩn/nhô đầu/ném/đánh). 46 ô đầu giống hệt cho mọi nhân vật.
**Tiết kiệm token:** phần chung (GLOBAL STYLE + POSE LEGEND ~3k ký tự) dán một lần đầu phiên; prompt từng nhân vật ~800–900 ký tự (trước ~4.500).
**Khi tích hợp:** tổng quát hoá `slice_chief.py` theo `pose_sheet_specs.json` (ô đều 8×8, số khung/pose khác chiều tù trưởng) và sửa `poseFrame` dùng `art.frames.length` thay vì các hằng số 3/4/7 hiện hard-code cho tù trưởng; chọn art theo vai trò (vũ khí + job → warrior, shaman, scout; còn lại villager theo giới/tuổi).

---
## 2026-11-19 — Nhập bộ tư thế tù trưởng (Claude)

**Input:** `sheets/character/chief/{H1_chief_walk,CH2_chief_states,CH3_chief_action}.png` (WEBP trá hình đuôi .png; sheet đi bộ tên `H1_`, 1236×1272, 6×5). Cả ba đúng lưới/đúng tư thế như `08_`.
**Tool:** `tools/slice_chief.py` — dò ô bằng thung lũng biểu đồ chiếu (30/35/28 ô, đã xem ảnh debug), tách nền từng khung (`key_out`), quy các sheet về cùng chiều cao đứng (H1 làm chuẩn; CH2 theo khung nhìn thẳng; CH3 dùng hệ số CH2), neo thân (trọng tâm thân) giữa + chân chạm đáy, ghi 21 dải khung cùng kích thước vào `assets/hd/source/characters/chief/<pose>.png` + manifest `chr_chief@<pose>` (kind `anim`, `ref` = 212 px chiều cao đứng) + `poses.json`.
**Loader:** `hdAssets.ts` kind `anim` — cắt đều theo `frames`, không trim (giữ neo), không tách nền lại.
**Renderer:** `poseFrame('chr_chief@', ctx, dir, now, job)` chọn khung theo `PoseKind` + `animationFrame/animationFrameCount`: đi/chạy/mang/lén → `walk_<hướng>` (5 hướng, tốc độ theo loại); đứng → khung trung tính (`look` #2 khi nhìn thẳng, khung đi khi nhìn ngang), gù (`gloom` ≥ 0.5) → `sad`; nhìn quanh → `look`/`fidget`; ngồi 113–116 → `sit_down`/`sit_rest`; ăn, ngủ, nhảy; đánh → `melee_E/S`; ném → `throw_E`; làm việc → `work_E` (hái → `gather_S`); thả hàng → `gather_S`; lảo đảo; chết. Pose chưa có khung (nấu, câu cá, phép, bẫy, nói chuyện…) → rơi về sprite dir5 + chuyển động code. `unitArt` chỉ có tù trưởng dùng đường khung; villager chưa.
**Đã xem trong game (level 7):** đi bộ ra xa rồi đứng nghiêng bằng khung HD; ép trạng thái `eat/dance/sleep/die/power` trên tù trưởng: đều đúng khung, đúng tỉ lệ. **Chưa quan sát** trong ván thật: đánh/ném/làm việc/ngồi (cần giao chiến, công trường), và hướng NE/SE khi đi chéo.
**Ghi chú art:** áo choàng ở hàng "nhìn thẳng" của sheet đi bộ không có (khác các sheet kia) — thấy được khi chuyển S↔SE lúc đi; nếu khó chịu thì nhờ vẽ lại hàng S của H1.

---
## 2026-11-19 — Prompt tư thế cho từng nhân vật (Claude)

`docs/09_CHARACTER_POSE_SHEETS.md` + `tools/pose_sheet_specs.json`, sinh bằng `tools/gen_pose_prompts.py` (một nguồn dữ liệu → prompt và bảng tên ô luôn khớp). Khuôn chung **8×6 = 48 ô/nhân vật**: hàng 1–3 = đi bộ 6 khung × 3 hướng (S/E/N; SE/NE dùng E, W lật gương) + đứng + nhìn quanh; hàng 4–6 = 24 ô theo vai trò (dân: làm việc/hái/ngồi/ăn/ngủ/nhảy/đánh/ném/ngã/chết; trẻ em: chơi/khóc/ngồi chơi/ngã/chết; chiến binh và địch: đánh E+S, ném, khiêu khích, ngã; shaman: làm phép/truyền phép; trinh sát: lén/ẩn/nhô đầu…). 8 ảnh: villager_m, villager_f, child (P0), warrior, enemy_warrior, shaman, scout (P1), enemy_chief (P2); tù trưởng giữ 3 sheet riêng ở `08_`. Chưa có ảnh nên **chưa viết tool cắt/loader khung hình** (sẽ làm theo `pose_sheet_specs.json` khi có ảnh).
**Quyết định cần làm ở renderer khi có art:** chọn `warrior` cho unit có vũ khí + job cận chiến/ném/lính gác (hiện `unitArt` chưa dùng `chr_warrior/shaman/scout`).

---
## 2026-11-19 — Nghiên cứu trạng thái hoạt ảnh gốc + hệ thống tư thế (Claude)

**Nghiên cứu:** `docs/07_ANIMATION_STATES.md` — engine dùng một mã `animation` 0–161 (byte có dấu → luôn `& 255`) + `animationFrame`; task→animation qua `taskAnimations`, đánh theo `attackAnimations` (vũ khí/kỹ năng), trong công trình qua `slot*Animations`. Có đủ: đi/chạy/mang/lén, đứng + nhìn quanh (15–18), ngồi (113–116), ăn (85/86), ngủ (40), nhảy (39/104/DJ), đánh (23–33), ném (35/36), lảo đảo (42), chết (43/44), câu cá (141–146), nấu, làm phép, bị bẫy… **"Chán nản" là bong bóng `emote` (4–8 theo `happiness`), không phải dáng riêng.** Id 42 (stagger) cũng dùng cho đoạn interlude lúc rảnh.
**Renderer:** `poseKindOf()` + `poseFor()` + `poseContext()` (đồng bộ pha với `animationFrame`, `gloom` khi hạnh phúc/đói/mệt thấp), nằm xuống khi ngủ/chết (unit hp=0 vẫn vẽ tới hết animation chết), ngồi xổm, lao tới khi đánh, bong bóng emote bằng icon S10 (`emote_*` trong manifest; mặt cười lật ngược = buồn). `world.ts` thêm trường tuỳ chọn `animationFrame/emote/cargoType`. Đã xem trên level 7: tù trưởng, bong bóng "vô gia cư", ngủ/chết nằm (ép bằng console). **Chưa quan sát được** ở lượt chơi thật: tư thế đánh/ném/ăn/nhảy (cần giao chiến/lều/disco) — mới kiểm bằng ép tư thế và typecheck.
**Art cho tù trưởng:** `docs/08_CHIEF_POSE_SHEETS.md` — 3 sheet (đi 5 hướng×6 khung; trạng thái nghỉ/cảm xúc 35 khung; chiến đấu/lao động 28 khung). Tool cắt + loader khung hình sẽ viết khi có ảnh.

---
## 2026-11-19 — Skin HUD bằng bộ UI S09/S10 (Claude)

**Làm:** `apps/web/src/skin.tsx` (helper `Ic`, `BuildingThumb`, `applyCursors`) + `skin.css` (nạp sau `styles.css`, ghi đè). Gỗ = hành động/tài nguyên (`btn_small/wide`, `plank_title` làm dock + banner, 9-slice bằng `border-image`), đá = thẻ chọn (`panel_stone`, thanh `bar_frame` + fill màu, khung avatar `frame_round`), giấy da = menu level + menu xây (`panel_menu`), nút tròn đá cho ×1/⏸/☰. Icon S10 thay emoji ở thanh tài nguyên, dock, thanh chỉ số, chi phí. Thẻ công trình trong menu xây dùng ảnh công trình HD thật (`slice_sheets.py THUMBS` → `ui/buildings/<loại>.png`, 160 px trong suốt).
**Con trỏ:** `Renderer2D.cursors` + `updateCursor()` chọn theo ngữ cảnh: đặt nhà hợp lệ → búa, sai → cấm; có dân được chọn → "đi", trỏ vào địch/thú → dùi cui chéo, cây/tài nguyên → bàn tay; mặc định mũi tên xương. Ảnh 40 px + hotspot trong `ui/cursors/index.json` (do tool sinh). Trình duyệt không chụp được con trỏ CSS nên **chưa nhìn thấy tận mắt** — chỉ kiểm tra qua code/typecheck.
**Đã xem bằng mắt (desktop 1470×741):** thanh tài nguyên, dock, thẻ dân (bar + icon), menu xây (thẻ + ảnh công trình + chi phí). **Chưa kiểm:** bố cục điện thoại (không đổi được viewport của cửa sổ thử), thẻ công trình/nhóm, banner đặt nhà, menu level.
**Tối ưu:** icon thu về 128 px (1.0 MB cho 48 icon, trước 3.5 MB). **Còn lại:** `apps/web/dist` 71 MB vì `publicDir` chép cả `hd/source/sheets` (ảnh nguồn) → nên loại thư mục `sheets/` và `source/<nhóm>` ảnh chưa cắt khi build; font vẫn là font hệ thống (chưa có font chữ hợp phong cách, cần font hỗ trợ tiếng Việt).

---
## 2026-11-19 — Nhập S10 (48 icon, vẽ bằng ChatGPT) (Claude)

**File:** người dùng tạo bằng ChatGPT, lưu `sheets/Prehistoric Tribal Game Icon Sprite Sheet.webp` (1536×1024, nền xanh thuần). Đã chuyển sang `S10_icons_items.png` (bản webp giữ nguyên) và cắt: `python3 tools/slice_sheets.py S10` → 48 PNG trong suốt ở `assets/hd/source/ui/icons/` + `ui/index.json` (tên: `res_*`, `stat_*`, `skill_*`, `job_*`, `item_*`, `cargo_*`, `cmd_*`, `prop_rally_flag`).
**Kiểm tra:** lưới 8×6 đúng thứ tự spec; từng ô khớp (thịt, gỗ, đá, xương, dân số, nhà, mặt cười, tim… tới cờ tập hợp). Cắt theo ô đều + bbox từng ô; ảnh icon 125–193 px (hiển thị 32–64 px nên dư).
**Lỗi đã sửa trong `key_out`:** viền lá xanh đậm của icon `skill_heal` bị flood-fill coi là nền (vì "xanh hơn nền"). Nay chỉ coi là nền khi pixel sáng và gần xanh thuần (`g>195`, `g−max(r,b)>110`); viền mềm theo độ sáng. Đã kiểm lại S09 (con trỏ xanh, thanh máu xanh) vẫn đúng.
**Lưu ý:** `item_trap_net` có lưới xanh lục là màu của chính icon. Icon đã đủ để dán skin HUD cùng bộ UI S09 (bước tiếp theo).

---
## 2026-11-19 — Nhập S09 (bộ UI) (Claude)

**Cắt S09:** `python3 tools/slice_sheets.py S09` → 31 PNG trong suốt ở `assets/hd/source/ui/chrome/` (+ `index.json`): `panel_menu`, `plank_title`, `panel_stone`; nút `btn_{small,wide,round,square}_{normal,hover,pressed}`; `bar_frame`, `bar_green/orange/blue`; `bubble_hide`, `tooltip_bone`, `corner_ornaments`; `frame_round`, `frame_square`, `select_ring`; con trỏ `cursor_{default,go,attack,gather,build,forbidden}`. Gợi ý từ agent vẽ: S09 phải tách với khoảng gộp `gap=0` (30 thành phần) — đã thêm tham số `gap` cho `components()`.
**Sửa `key_out` (UI):** trước đây loại mọi pixel xanh → mất thân xanh của con trỏ "đi" và thanh máu. Nay flood-fill từ mép + lấp "túi nền" thuần (tâm khung) rồi lan qua viền mềm; màu xanh của chính vật thể được giữ. Đã kiểm bằng mắt trên nền tím.
**Xác nhận object kind (agent vẽ, đối chiếu `ptCore.js`):** 1 = bụi quả (nghề 1/tác vụ hái quả), 2 = rau (nghề 6), 3 = mỏ đá (nghề 5), 4 = xương (nghề 7), 5 = cá, 6 = xác thú, 7 = bộ xương → khớp mapping `OBJECT_ART` đã dùng; không còn là suy luận.
**Chưa có:** S10 (48 icon) — chờ quota. HUD React chưa dùng bộ UI này (hiện CSS phẳng); nên dán skin cùng lúc với icon.

---
## 2026-11-19 — Render art HD: tài nguyên, công trường, địa hình mềm, hoạt ảnh (Claude)

**Tài nguyên (`renderer.ts`, `OBJECT_ART`):** object kind 1=bụi quả, 2=rau, 3=đá, 4=xương, 6=xác thú (art lợn), 7=xương; mỗi loại 3 khung theo `objects.stage` (engine: 3/2 = còn nhiều → khung 0, 1 → khung 1, 0 → khung 2; ngưỡng `objectStageThresholds [2,4,7,10]/10`). Mapping 1–4 đã được đối chiếu với engine gốc (xem mục S09 bên dưới) và kiểm bằng mắt ở level 7. Kind 5 (cá) chưa có art → hiệu ứng gợn nước vẽ bằng code.
**Công trường:** `bld_site_s_plot/m_plot` (đầu), `m_frame/l_frame` (khi tiến độ ≥ 34%), chọn theo diện tích; thay `drawSite`. Đã thấy nền đất HD khi đặt Lều; khung gỗ chưa quan sát trực tiếp (chưa chờ đủ tiến độ).
**Địa hình mềm:** rừng/đá/bờ/nước vẽ thành TilingSprite HD có `mask` = bản đồ tile làm mờ (thu nhỏ/phóng to hai lần + cộng chồng để lõi đặc, mép mềm) → hết ô vuông lộ. Cần lớp cỏ HD (`ter_grass`); thiếu texture nào thì rơi về tô phẳng cũ.
**Phát hiện quan trọng — "BLOCKED" gồm cả hồ sâu và vách đá:** trong ô BLOCKED, terrain id ≤ 60 là nước (6–8 sâu, 25–60 bờ), ≥ 135 là vách/đá (Great Lake). Dùng `WATER_TILE_MAX = 60` → hồ hiện thành nước HD thay vì đá xám. Các id 61–134 và vài tile ≤60 lẻ ở level khác chưa phân loại (T21b còn mở).
**Hoạt ảnh bằng code (`pose()`):** đi (nhảy + nghiêng + skew + dẹt/giãn), việc vung (tiều phu 2, đồ tể 3, thợ đá 5, thợ rèn 8, thợ xây 12: lấy đà → đập → hồi), việc cúi (hái quả 1, hái rau 6, nhặt xương 7), DJ nhảy (10), câu cá/nấu ăn lắc nhẹ, mặc định thở. Dựa trên `units.job` + cờ đang di chuyển. Chưa có hoạt ảnh đánh/ném (engine `animation` chưa giải mã) và chưa quan sát được tận mắt thợ đốn cây (bị cây che).
**Kiểm tra:** typecheck/lint/test sạch; chụp màn hình level 7 (rừng, đá, hồ, bụi quả, công trường). 0 lỗi console.

---
## 2026-11-19 — Nhập 8/10 sheet Gemini vào game (Claude)

**Kết quả:** S01–S08 (S09/S10 UI chờ quota) đã cắt bằng `tools/slice_sheets.py` → 72 asset trong `assets/hd/manifest.json` (ảnh mẫu đã duyệt `chr_villager_m`, `bld_hut_l1`, `ter_grass` được giữ nguyên). Chạy `npm run dev`: dân nam/nữ/trẻ, tù trưởng (headdress), lều tù trưởng, kho, cây lá rộng/lá kim, cỏ HD hiển thị đúng.
**Đổi cách cắt:** Gemini xếp ô sát nhau, không chừa khe xanh đều (và ảnh nhỏ: 1024–1376 px) → tool cắt theo "thung lũng" của biểu đồ chiếu, dựa trên số hàng/ô kỳ vọng thay vì tìm vùng rời. Đã duyệt bằng mắt ảnh debug cho cả 7 sheet sprite: khung khớp.
**Sửa loader (`hdAssets.ts`):** thêm bước loại "túi nền" xanh bị vật thể bao kín (giữa thân/cành, dưới mái) mà flood-fill từ mép không tới (`KEY_POCKET = 100`).
**Còn thấy:** (1) ô nền rừng (`ter_forest_floor`) là hình vuông tối cắt thẳng vào cỏ → cần mép chuyển tiếp/blend; (2) renderer chưa dùng: `nat_berrybush/plants/rock_quarry/bones/stump/felled/boulder…`, `bld_site_*`, xác thú, `ani_mammoth`, công trình cấp 2/3 và các công trình mới ngoài danh sách `buildingArt`; (3) độ phân giải sprite ~200–300 px/công trình, đủ cho zoom thường nhưng sẽ mềm khi zoom sát.

---
## 2026-11-19 — Gom art thành 10 sheet + tool cắt sheet (Claude)

**Quyết định (người dùng):** nâng cấp đồ hoạ 2D trên renderer PixiJS của thư mục này (không làm trên `5_` engine gốc, vì bản đó vẽ sprite 240×320 theo bảng composite). Art tạo bằng Antigravity/Gemini nhưng quota ít → gom 10 sprite sheet: `docs/06_GEMINI_SHEET_PROMPTS.md` (thay `05_` cho lượt tới; `05_` vẫn là tham chiếu ảnh mẫu/camera).
**Tool:** `tools/slice_sheets.py` (Pillow): phát hiện vật thể trên nền chroma xanh (ảnh thu nhỏ 1/6, gộp khe hở nhỏ), gom theo hàng bằng đường chân, cắt `assets/hd/source/<nhóm>/<ID>.png`, thêm mục `optional` vào `manifest.json`; S08 làm texture liền mạch; S09/S10 tách nền thành PNG trong suốt. Không ghi đè file có sẵn trừ khi `--force`. Có `--dry-run` + ảnh debug `sheets/_debug/`.
**Đã kiểm chứng:** ảnh giả 4×5 nhân vật + 2×3 công trình → đúng 20/6 vật thể; ghép ảnh mẫu `chr_villager_m` thật thành 4 hàng → tách đúng 4 hàng dù nhân vật đứng sát nhau (loader tách tiếp theo cột). Chưa chạy trên sheet Gemini thật (chưa có ảnh).
**Việc mở cho khi có ảnh:** renderer chưa dùng `nat_berrybush`, `nat_rock_quarry`, `nat_bones`, `ter_*` khác ngoài grass/water/forest/dirt, công trường (`bld_site_*`), xác thú, icon/khung UI; cần map object kind (T21b) trước.

---
## 2026-11-12 — Nối sẵn asset cho lượt Gemini tiếp theo (Claude)

`assets/hd/manifest.json` đã khai sẵn (cờ `optional`, thiếu file thì bỏ qua im lặng): `chr_villager_f`, `chr_child`, `chr_chief`, `chr_enemy_m/f`, `chr_enemy_chief`, `ani_boar`, `ani_tiger`, `nat_tree_broadleaf`, `nat_tree_conifer` (kind `strip`, 4 biến thể), `bld_chief_hut`, `bld_store`, `bld_kitchen_l1`, `bld_armoury_l1`, `bld_hut_l2`, `bld_tower_l1`, `ter_water`, `ter_forest_floor`, `ter_dirt`.
→ **Gemini chỉ cần lưu PNG đúng tên vào `assets/hd/source/<characters|animals|nature|buildings|terrain>/`** là game tự dùng, không cần sửa code.

**Quy tắc chọn art cho unit:** riêng > dùng chung. Địch không có art riêng → dùng art dân phe mình tô `#B9A4D6`; tù trưởng không có `chr_chief` → art dân nam + vương miện; trẻ em = 66% kích thước. Nước/nền rừng: tô texture lặp theo toạ độ thế giới (`textureSpace: 'global'`).
**Đã kiểm tra:** chép tạm ảnh có sẵn thành `chr_villager_f`, `nat_tree_broadleaf`, `ter_water` → cả 3 nhánh hiển thị đúng, 0 lỗi; đã xoá file giả.

**Loại động vật (bảng `animalHp/animalBoldness/animalBiteDamage`):** 0 = lợn rừng (HP 30, cắn 2), 1 = hổ răng kiếm (HP 50, hung dữ 100, cắn 4), 2 = con mồi vô hại chưa nhận dạng (HP 20, không cắn) → vẫn hình tạm.
**Chưa xác định:** object kind 1–4 tương ứng bụi quả / rau / đá / ? — thử giao việc tự động cho kết quả lẫn (task cũ còn dính); cần thử lại sạch ở T21b trước khi map `nat_berrybush`, `nat_rock_quarry`. Tile nào là "đất" để dùng `ter_dirt` cũng thuộc T21b.

---
## 2026-11-12 — T25 v1: đưa 3 ảnh Gemini đầu tiên vào game (Claude)

**Asset:** `chr_villager_m` (1376×768, 5 hướng), `bld_hut_l1` (896×1200), `ter_grass` (1024²) — đã duyệt làm ảnh mẫu phong cách (xem mục "Ảnh mẫu đã duyệt" trong `05_GEMINI_2D_ASSET_PROMPTS.md`). `nat_tree_broadleaf` chưa có (Gemini hết quota).
**Pipeline (runtime, `packages/render2d/src/hdAssets.ts`):** manifest `assets/hd/manifest.json` → tải PNG → tách nền bằng flood-fill từ mép ảnh với ngưỡng độ xanh `g - max(r,b) > 70` (nền thực tế không thuần #00FF00) → làm mềm + khử ám xanh viền 1px → cắt sát nội dung → tách nhân vật theo cột trống. Thiếu asset → hình tạm.
**Renderer:** lớp thực thể trộn sprite + vector theo chiều sâu (pool Graphics/Sprite). Dân nam trưởng thành dùng sprite (hướng 0..7 → 5 khung + lật gương), hoạt ảnh "con rối" (nhún/lắc khi đi, thở khi đứng) chờ sprite sheet thật; vòng chân màu phe; tù trưởng vương miện; phe địch tô `#B9A4D6`. Lều dùng sprite (cấp 2 tạm dùng cấp 1). Cỏ = TilingSprite dưới lớp địa hình.
**Đã xác minh:** slot công trình 1–30 phe mình, 31–60 phe địch (`freeBuildingSlot`). E2E điều khiển chạy lại xanh; 0 lỗi console.
**Đổi đường dẫn:** Vite phục vụ cả `assets/` → engine gốc ở `./original/`, đồ hoạ mới ở `./hd/`.
**Còn:** dân nữ/trẻ em/động vật/cây vẫn là hình tạm; ảnh nguồn PNG 1.3–1.9 MB/ảnh → cần bước build nén (webp + atlas) trước khi phát hành.

---
## 2026-11-12 — T23 điều khiển web/mobile + HUD mới (Claude) → REVIEW

**Cách làm:** `EngineCommands` lái chính input gốc (`handleFireTap`, `orderSelectionTo`, `contextMenu.executeContextCommand`, `selection.finishBoxSelection`) với con trỏ ảo đặt vào ô được chạm → giữ nguyên luật. Bảng điều khiển: `docs/CONTROLS.md`.
**Kiểm thử e2e (Playwright, cử chỉ thật):**
- Desktop 1280×800: click chọn dân "Mumbo" → chuột phải vào cây → job = tiều phu; `B` → 11 thẻ công trình → Lều → click → số công trình 2→3; kéo chọn vùng → 12 dân; `C` + click → báo động bật, cờ hiện.
- Mobile 390×844 (touch): chạm chọn dân → chạm cây → mục tiêu đúng (83,41); Xây → Kho → chạm vị trí → "Xây ở đây" → công trình 2→3.
- Kiểm chứng thêm bằng API: thợ xây được giao khi chạm công trường; Hut trừ dần 15 gỗ + 5 đá, HP 5→20/25 — đúng luật gốc (tài nguyên trừ khi thợ mang vật liệu, không trừ lúc đặt).
- 0 lỗi console; typecheck/lint/test sạch.

**Phát hiện kỹ thuật:**
- `placementValid` chỉ được tính trong lúc engine **vẽ** (`updatePlacement`) → adapter tự tính bằng `construction.canPlaceBuilding` (cần ô đã khám phá).
- `placementType` của công trình là **mã công trường 12–19** (dùng chung theo kích thước); loại công trình thật lấy từ `contextItems[contextCursor]` lúc đặt và lưu vào `buildings.payload`.
- `buildingStats` xếp theo hàng: `value(stat*26 + type)`; hàng 4/5 kích thước, 10/11/12 chi phí gỗ/đá/xương, 13/14 chi phí nâng cấp; vũ khí ở cột 12–17, bẫy 20–22.
- Mã lệnh ngữ cảnh `y`: 10 BUILD … 29 UNLOAD (nhãn = `labels.commands[id-10]`); 0–8 là vật phẩm; âm = dân trong công trình.
- Dân phải được giao việc; công trường cần ra lệnh cho dân tới xây (giống bản gốc).

**Giả định cần xác minh:** thanh No/Sức/Vui trong thẻ dân đang lấy thang 0–100.

---
## 2026-11-12 — Chuyển sang 2D trước (D-07) + T20/T21 bản chạy được (Claude)

**Chạy thử:** `npm i --cache <tmp>` (nếu ~/.npm lỗi quyền) → `npm run dev` → http://localhost:5180 (mặc định level 7 "Custom: Great Lake"; chọn level ở thanh trên).
**Đã kiểm chứng bằng Playwright (Chromium headless, 1280×800):** engine gốc load, vào thẳng level 7, sim chạy 25 tick/3 s (đúng 120 ms/tick), renderer vẽ đủ terrain/cây/object/công trình/dân/địch/động vật, click chọn tù trưởng → inspector đúng (HP 55/55, ô 85,45), không lỗi console. `npm test` 48/48, typecheck 4 package, lint, build sạch.

**Phát hiện quan trọng — phép chiếu gốc (sửa tài liệu cũ):** engine KHÔNG dùng iso kim cương 44×32 như `2_documentation` ghi. Màn hình: `x = (col - cameraX) * 22`, `y = row * 16`, unit cộng `offsetX/Y` (px). Đây là lưới chữ nhật, hình vẽ phối cảnh 3/4. Vẽ theo hàng trên→dưới, cột phải→trái. → D-08: HD ×4 = 88×64 px/ô.
**Mã hoá occupancy (bổ sung MAP_FORMAT):** `-b` = công trình id b (neo góc trên-trái, phủ W×H ô); `-61..-110` object; `-111..-123` bẫy; `-124..-127` rừng/nước/chặn/bờ.
**Hướng (direction):** 0=E,1=SE,2=S,3=SW,4=W,5=NW,6=N,7=NE (`directionDeltas`). Sprite chỉ cần 5 hướng S,SE,E,NE,N rồi lật gương.
**Vào thẳng level:** `game.level=L; game.levels.start(L); gameState=1; screen=28`. Level 1 không có dân phe mình (campaign mang dân từ tutorial sang) → kiểm thử nên dùng level 0 hoặc 7–11.
**Dân không tự làm việc** khi chưa được giao việc (đúng game gốc) → cần T23 (ra lệnh) mới thấy kinh tế chạy.
**Engine gốc tự vẽ canvas ẩn khi resize** → adapter vô hiệu `game.requestPaint`.

**Còn mở:**
- `tribeStats[16]` (LIVING_SPACE) = 1 ở level 7 dù có nhà → xác minh ý nghĩa ở T24.
- Vùng xám = BLOCKED chung (hồ sâu? vách đá?) → T21b.
- Cutscene/story đang bị shim (ép về gameplay) → T26.
- Bundle web 933KB (ptCore 557KB) — chấp nhận cho bản thử.

---
## 2026-11-12 — T1: monorepo + package `@pt3d/data` (Claude) → REVIEW

**Kết quả:** `npm test` 48/48 xanh, `npm run typecheck` và `npm run lint` sạch.
- `packages/data/src/javaRandom.ts`: port bit-exact `java.util.Random` (khớp giá trị tham chiếu Java `new Random(42)` và trạng thái RNG của engine).
- `gameData.ts`: đọc theo **tên bảng** (không theo slot `S` của engine vì một số bảng chiếm nhiều slot, vd. `levelEntities` 12 slot).
- `sprites.ts`, `locale.ts`: parser có kiểm tra kiểu cho `sprites.json` và 5 locale.
- `maps.ts`: giải nén RLE + dựng occupancy/object/bờ cá. **Khớp từng bit với engine cho 12 level** (terrain, occupancy, object, trạng thái RNG sau khi load). Đặc tả: `docs/MAP_FORMAT.md`.
- Đã kiểm tra test có tác dụng: cố tình sửa sai RNG thì 12 test fail, sai danh sách ô bờ thì 11 test fail.
- Fixture: `packages/data/test/fixtures/oracle-maps.json` (408KB), tạo bằng `tools/oracle-probe/dump-maps.js`.
- Dữ liệu gốc copy vào `assets/original/res/`.

**Thay đổi so với kế hoạch:** dùng npm workspaces thay pnpm (máy không có pnpm); `vi.json` tách thành task T1b.
**Phát hiện mới:** load map **tiêu thụ RNG** (1 lần/ô cỏ id ≤ 8) → sim TS phải gọi đúng thứ tự này để giữ tất định với oracle.
**Môi trường:** cache `~/.npm` có file thuộc root → `npm i` lỗi EACCES; đã dùng `--cache` tạm, không sửa quyền máy.

---
## 2026-11-12 — T0: baseline + thăm dò engine `ptCore.js` (Claude)

**Git:** commit `297e990` — `.gitignore` chung (`node_modules/`, `dist/`, `*.tsbuildinfo`, `.DS_Store`), bỏ `5_prehistoric_tribes_react/dist` + `tsbuildinfo` khỏi index, thêm thư mục `6_prehistoric_tribes_3d/`.
**Build bản 5:** `npm run build` OK (cảnh báo chunk > 500KB, không lỗi).
**Công cụ:** `tools/oracle-probe/` (Playwright headless, mount engine, expose `window.__ctrl`). Mọi số liệu dưới đây đo bằng công cụ này, không có lỗi console.

### Kết luận chính: sim TÁCH ĐƯỢC và TẤT ĐỊNH
| Kiểm tra | Kết quả |
|---|---|
| Gọi `game.updateSimulation()` trực tiếp, không render | Chạy bình thường; 600 tick ≈ 12–26 ms (vs 120 ms/tick khi chơi) |
| Cùng state đầu → chạy sim 2 lần | Hash giống hệt |
| Sim thuần vs loop thật (render + input) cùng state đầu, tick 20→73 | **Hash giống hệt** (`c4580603`) |
| Dời camera 1 ô rồi chạy loop thật | Chỉ khác `buildings.drawFlags`, `buildings.fogState` (cache hiển thị); RNG, units, stats, terrain giống |
| State lúc vào gameplay giữa các phiên | **Không ổn định** (4/5 lần giống). RNG bị tiêu thụ trong menu/render theo số frame thực tế |

### Sự thật kỹ thuật (thay thế giả định trong tài liệu cũ)
- **Tốc độ tick = ~8.3 Hz** (`normalFrameDelay = 120 ms`), *không phải 20 Hz*. Chế độ nhanh `fastFrameRate` → 50 ms. 1 frame = 1 tick sim.
- `updateSimulation()` = `buildingActivity.updateBuildings()` → `updateVillagers()` → `animalBehaviour.updateAnimals()` → `environment.updateObjectsAndEvents()` → `gameTick++` → decay bẫy → `contextMenu.build()` (UI!) → `advanceEndGameTimer()`.
- **RNG:** class `cn` = port `java.util.Random` (48-bit LCG), `game.random`, seed cố định `1`; `randomInt(mask, n) = (nextInt() & mask) % n`. Không dùng `Math.random`/`Date.now`. 68 lời gọi `randomInt`, **có lời gọi từ render** (`drawFloater` — số nổi, hiển thị điểm có jitter) → nguồn lệch RNG khi đổi render.
- **Map Level 0 (tutorial):** 40×32. Các level khác lấy từ bảng `LEVEL_SIZES` (`data.value(S.LEVEL_SIZES, level*2)`).
- **Entity store (SoA, mảng thường hoặc typed):**
  - `units` 101 slot, 84 field: x, y, offsetX/Y, hp, maxHp, food, energy, happiness, age, gender, 9 skill, job/task/animation, cargo*, projectile*, weapon, partner, infection…
  - `buildings` 61 slot: x, y, hp, maxHp, state, vision, type, occupant, drawFlags, queueLength, firstUnit, flags, level, fogState, payload, assignedBuilders
  - `animals` 22 slot: x, y, offsetX/Y, hunter, herd, direction, hp, type, animation…, prey, targetX/Y, path*
  - `objects` 50 slot: x, y, type, variant, stage
  - `tribeStats[2][26]` (PLAYER/ENEMY): MEALS, FOOD, WOOD, STONES, BONES, 6 loại vũ khí, POPULATION, MALES, FEMALES, BUILDINGS, LIVING_SPACE, CHIEF, BREEDING_TIMER, BORN, BUILT, DESTROYED, KILLED, GATHERED, SCORE, STORED_WEAPONS
  - grid: `terrain`, `occupancy`, `fogBits` (mảng 2 chiều)
- **`game.simulation`** có module con: `world, pathfinder, visibility, enemyCamp, story, workshops, animalBehaviour, buildingActivity, environment, targeting…` + state AI địch (`raidState, nextRaidTick, raidRoute, campIntruder, enemyRanks…`) + story (`storyStage, storyObjective, objectiveProgress`).
- **Coupling sim → UI:** sim tự đổi `game.gameState/screen` (mục tiêu tutorial → cutscene `screen 17`), gọi `contextMenu.build()`, ghi cache render vào mảng sim (`drawFlags`, `fogState`). Camera ra ngoài map làm crash `updateHoveredUnit`.
- `game` là god-object (~300 field) trộn input, menu, camera, render, sim.

### Hệ quả cho kế hoạch
1. **Phương án "oracle trong Worker" khả thi cao**: có thể chạy `updateSimulation()` headless, đọc SoA trực tiếp để render 3D ngay (M2 sớm) — chỉ cần chặn các lời gọi UI (`contextMenu`, đổi `screen`) bằng shim.
2. **Golden test (T2) khả thi**: chụp toàn bộ state + RNG (`random.high/low`) tại 1 tick làm điểm bắt đầu, sau đó chạy sim thuần → tất định. Không dựa vào việc đi qua menu (không ổn định).
3. Sim TS mới phải: tách cache render (`drawFlags`, `fogState`) khỏi state sim; RNG render dùng instance riêng.
4. Tài liệu cũ ghi 20 Hz → đã sửa thành 8.3 Hz trong `01_REBUILD_PLAN.md`.

### Việc còn mở (chuyển sang T2/T3)
- Hàm `save/loadGame` có sẵn (`loadFromSlot`, localStorage) — kiểm tra xem dùng làm snapshot/restore chuẩn được không (gọn hơn tự copy mảng).
- Lập danh sách đầy đủ field ngoài SoA cần chụp (state trong `simulation.*`).
- Kiểm tra `fogState` có ảnh hưởng gameplay địch không.
