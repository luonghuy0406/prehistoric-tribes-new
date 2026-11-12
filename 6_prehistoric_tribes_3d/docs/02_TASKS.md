# 02 — Bảng công việc cho coding agent

**Quy ước:** Status = `TODO | DOING(agent) | REVIEW | DONE | BLOCKED`. Agent nhận task → đổi status + ghi tên vào cột Owner + commit nhỏ. Mỗi task phải đạt hết *Acceptance* mới chuyển REVIEW. Task song song được nếu *Depends* đã DONE.
Tham chiếu nguồn luật chơi: `../2_documentation/05_gameplay/GAMEPLAY_SYSTEMS.md`, dữ liệu: `../5_prehistoric_tribes_react/public/res/`.

## Giai đoạn A — Nền tảng
| ID | Task | Depends | Status | Owner | Acceptance |
|---|---|---|---|---|---|
| T0 | Dọn & baseline: commit trạng thái git hiện tại (3_web_game bị xoá, .gitignore), bỏ `dist/`+`tsbuildinfo` khỏi git; chạy `5_react` (`npm i && npm run dev`) và ghi lại kết quả trong `docs/NOTES.md`; **xác nhận các mục [VERIFY]** ở `00_REVIEW` | – | REVIEW | Claude | Game 5_react chạy; NOTES.md liệt kê: sim/render có tách được không, các hàm `update*` chính, kích thước map |
| T1 | Scaffold monorepo (npm workspaces — máy không có pnpm) + TS strict + Vitest + ESLint; package `data` đọc `game-data.json`, `sprites.json`, `maps/*.bin`, locale → type + parser | T0 | REVIEW | Claude | `pnpm test` xanh; parser map trả `{w,h,terrain[],collision[],nodes[]}` cho cả 10 map, snapshot test; tài liệu format `.bin` trong `docs/MAP_FORMAT.md` |

## ★ Giai đoạn 2D (ƯU TIÊN HIỆN TẠI — D-07)
| ID | Task | Depends | Status | Owner | Acceptance |
|---|---|---|---|---|---|
| T20 | `packages/engine-adapter`: mount ptCore không hiển thị canvas gốc, vào thẳng 1 level (bỏ menu), tự chạy tick 120ms, shim UI (cutscene/menu), xuất `Snapshot` (units/buildings/animals/objects/tribeStats/terrain/occupancy) + `Command` cơ bản | T1 | REVIEW (thiếu `Command` → T23) | Claude | Level 1 chạy 10 phút sim không lỗi; snapshot đọc được từ React |
| T21 | `packages/render2d` (PixiJS): terrain (placeholder màu theo occupancy → sau là tile HD), camera kéo/cuộn/zoom, lưới 88×64 | T1 | REVIEW | Claude |
| T21b | Phân loại tile id → loại địa hình (cỏ/đất/cát/nước sâu/vách đá…) từ đồ hoạ gốc (`compositeFirstClip`/sprite sheet) để tô placeholder đúng và chọn texture HD. Hiện vùng BLOCKED (-126) tô xám chung | T21 | TODO | | Ảnh chụp 12 level đọc được địa hình như bản gốc | Hiển thị đủ 12 level; 60fps |
| T22 | Entity renderer 2D: units/animals/buildings/objects, nội suy giữa tick, sắp xếp chiều sâu theo hàng, thanh máu, chọn | T20,T21 | DOING (bản placeholder đã có trong T21; còn: unit trong nhà, công trình đang xây, fog of war, xác thú) | | Thấy dân đi lại/làm việc khớp engine gốc |
| T23 | Input 2D: click chọn, box-select, chuột phải ra lệnh, đặt công trình (ghost), phím tắt → `Command` vào engine | T22 | TODO | | Chọn dân, ra lệnh, xây Hut được |
| T24 | HUD React mới (thay T10–T13 bản 3D): resource bar, inspector, build menu, roster, alert, minimap, pause/options, dialog cốt truyện | T20 | TODO | | Chơi hết Level 0–1 chỉ bằng HUD mới |
| T25 | Pipeline asset 2D: `assets/hd/manifest.json`, loader sprite sheet, fallback sprite gốc phóng ×4 (nearest) khi thiếu asset HD | T21 | TODO | | Thiếu asset vẫn chạy; thay PNG HD không cần sửa code |
| T26 | Menu/campaign/cutscene/save-load qua engine gốc, nhạc | T24 | TODO | | Chơi xuyên 10 level |

> Các task 3D (T6–T9b) **hoãn** đến khi bản 2D kiểm thử xong.

## Giai đoạn B — Sim headless
| ID | Task | Depends | Status | Owner | Acceptance |
|---|---|---|---|---|---|
| T1b | Thêm `vi.json` (dịch đầy đủ từ en: labels, messages, 235 dòng dialogue) + test cùng shape | T1 | TODO | | Test locales xanh với `vi` |
| T2 | **Oracle harness** (mở rộng từ `tools/oracle-probe`): snapshot/restore toàn bộ state + RNG tại 1 tick (không đi qua menu vì RNG menu không ổn định), chạy `updateSimulation()` với chuỗi lệnh cố định, dump state (tribeStats, units, buildings, animals, objects) mỗi 20 tick ra JSON | T0 | TODO | | Chạy 2 lần cùng seed → output giống nhau (hoặc ghi rõ nguồn nondeterminism, vd. Math.random → patch seed); file golden Level 0 (≥2000 tick) |
| T2b | **Oracle Worker adapter**: chạy `ptCore` sim trong Web Worker, shim các lời gọi UI, xuất Snapshot theo `SIM_API.md` — để render 3D (T7–T9) chạy được trước khi sim TS xong | T2 | TODO | | Level 0 chạy trong Worker 30 phút sim không lỗi; snapshot đủ cho renderer |
| T3 | `sim` lõi: world, entity store (units/buildings/animals/objects), tick ~8.3Hz (120ms), command queue, RNG seed, snapshot/event API (`SimApi` trong `docs/SIM_API.md`) | T1 | TODO | | Khởi tạo Level 0 từ data; snapshot đúng vị trí ban đầu so golden tick 0 |
| T4 | Hệ thống sim #1: needs (đói/mệt/vui), gather/deposit, kitchen meal loop, nhà ở, sinh/lớn lên | T2,T3 | TODO | | So golden Level 0: tribeStats trong tolerance ±1 tại tick 500/1000/2000 (hoặc sai khác ghi DECISIONS) |
| T5a | Sim #2: xây/nâng cấp 12 công trình, chi phí, kho, training (gym/range/PIA…) | T4 | TODO | | Unit test theo bảng chi phí GAMEPLAY_SYSTEMS §2 |
| T5b | Sim #3: chiến đấu (melee/ranged, công thức damage, bẫy, shaman spell), Call to Arms/Form Up | T4 | TODO | | Unit test công thức §3-4; replay trận Level 1 khớp oracle |
| T5c | Sim #4: AI địch (sửa chữa, tuần tra, wave tấn công, campPlan), điều kiện thắng/thua, score | T5a,T5b | TODO | | Level 0→3 chơi tự động (bot) không crash 10 phút sim; win/lose đúng |
| T5d | Pathfinding A* trên lưới + tránh va chạm | T3 | TODO | | Benchmark: 50 unit tìm đường < 2ms/tick trung bình |

## Giai đoạn C/D — 3D world & tương tác (HOÃN — D-07)
| ID | Task | Depends | Status | Owner | Acceptance |
|---|---|---|---|---|---|
| T6 | Pipeline asset: `assets/manifest.json` (id sim → GLB/billboard), loader, placeholder primitive cho 12 công trình, dân (nam/nữ/trẻ/chief), động vật (boar, tiger, mammoth, dino), cây, đá, bụi quả, xác thú | T1 | TODO | | Mỗi loại entity có asset (tạm cũng được) + test "không thiếu manifest" |
| T7 | `render3d`: terrain mesh từ map (màu theo loại ô, nước), camera RTS (pan WASD/kéo, xoay Q/E, zoom wheel/pinch, giới hạn biên), ánh sáng, bóng | T1,T6 | TODO | | Level 0 hiển thị đúng bố cục so ảnh chụp bản gốc; 60fps desktop |
| T8 | Entity renderer: InstancedMesh cho cây/đá/vật; Skinned/animation đơn giản cho dân (idle/walk/work); nội suy giữa tick; Y theo terrain | T2b (hoặc T3),T7 | TODO | | Chạy sim (T3) → thấy dân đi lại; 101 unit + 61 building + 22 animal + 50 object ≥ 60fps |
| T9 | Input 3D: raycast chọn unit/building/tile, box-select, chuột phải = lệnh ngữ cảnh, placement ghost công trình (hợp lệ/không), cảm ứng | T7,T8 | TODO | | Test e2e: chọn dân, ra lệnh đi, đặt Hut; ghost đổi màu khi vướng |
| T9b | Minimap + fog/vision, hiệu ứng (xây, thu hoạch, đánh, spell), ngày/đêm | T8 | TODO | | |

## Giai đoạn E — HUD hiện đại
| ID | Task | Depends | Status | Owner | Acceptance |
|---|---|---|---|---|---|
| T10 | Design system + moodboard: token màu/typography/icon theo `03_UI_UX_SPEC.md`; mockup Pencil (.pen) cho 6 màn hình chính (title, HUD, build menu, roster, dialog, pause) | – | TODO | | File mockup + duyệt bởi người dùng trước T11 |
| T11 | `ui`: store Zustand ← snapshot sim; Resource bar, alert, Command bar (Call to Arms, Form Up, Back to Work) | T3,T10 | TODO | | Không còn `setInterval` poll; re-render chỉ khi selector đổi |
| T12 | Inspector (villager/building: bars, kỹ năng, vũ khí), Build menu có chi phí/khoá, Roster, tooltips | T11 | TODO | | Dữ liệu khớp bảng GAMEPLAY_SYSTEMS |
| T13 | Dialog cốt truyện + cutscene (story images 00–11, `d0` text), Title/Menu/Options (ngôn ngữ gồm vi, âm lượng, đồ hoạ), Pause | T11 | TODO | | Chuyển level đúng chuỗi `STORY_AND_CAMPAIGN.md` |

## Giai đoạn F/G
| ID | Task | Depends | Status | Owner | Acceptance |
|---|---|---|---|---|---|
| T14 | 10 level: load, mục tiêu, scripted events, thắng/thua, chuyển chương | T5c,T13 | TODO | | Playthrough bot qua cả 10 level |
| T15 | Save/Load (IndexedDB, version schema), autosave, settings | T3 | TODO | | Save→load tick N→ N+500 trùng chạy liên tục |
| T16 | Audio: nhạc theo trạng thái (menu/play/raid/win/lose), SFX | T11 | TODO | | |
| T17 | Perf/mobile/a11y/PWA, quality presets, CI (lint+test+e2e+screenshot) | M3 | TODO | | Lighthouse perf ≥ 80 mobile mid-tier; CI xanh |

## Quy tắc cập nhật bảng
Chỉ sửa dòng task của mình + thêm task con (`T5a.1`). Quyết định thiết kế đổi luật → ghi `DECISIONS.md`, không sửa lặng lẽ.
