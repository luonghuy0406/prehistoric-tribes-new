# NOTES — nhật ký làm việc chung (thêm mới ở đầu file)

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
