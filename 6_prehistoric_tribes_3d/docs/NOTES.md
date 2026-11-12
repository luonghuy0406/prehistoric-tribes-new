# NOTES — nhật ký làm việc chung (thêm mới ở đầu file)

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
