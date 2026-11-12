# 00 — Review của `5_prehistoric_tribes_react` (hiện trạng)

> Phạm vi: đọc `src/`, `public/res`, `package.json`, tài liệu `2_documentation/`. Các mục **[VERIFY]** đã được kiểm chứng ở T0 (2026-11-12) — xem `NOTES.md`.

## 1. Kiến trúc thực tế
```
React 18 shell (App.tsx, 3 component, app.css ~415 dòng)
   │  poll 125ms (setInterval) đọc state engine
   ▼
useGameEngine.ts ──► ptCore.js  (557 KB, 1 file, ĐÃ MINIFY, copy từ bản build của clone)
                        ├─ sim: game.units / buildings / animals / objects (SoA, 101 unit slot)
                        ├─ render: Canvas2D 240x320 isometric 44x32, drawMapObject, drawComposite...
                        ├─ input, audio (mp3 song0-4), loop 20Hz
                        └─ UI gốc vẽ trên canvas (menu, build menu, minimap, dialog)
public/res: game-data.json (292 bảng), sprites.json, maps/map-0..9.bin (RLE), text/{en,fr,it,de,es}.json, images/ (pixel 2D)
```
**Kết luận chính:** bản React chỉ là *vỏ HUD* bọc quanh engine gốc. Toàn bộ luật chơi + render + menu thật vẫn nằm trong `ptCore.js` không có mã nguồn đọc được. Không thể "đổi sang 3D" bằng cách sửa React.

## 2. Điểm mạnh (giữ lại)
- Tài liệu RE rất đầy đủ: chi phí 12 công trình, vũ khí, công thức damage/score, AI địch, 10 level, cốt truyện (`2_documentation/05_gameplay`, `04_narrative`).
- Dữ liệu tách rời code: `game-data.json`, `maps/*.bin`, locale JSON 5 ngôn ngữ, 5 bài nhạc.
- Engine tách được phần nào nhờ tên thuộc tính còn đọc được (`game.tribeStats`, `units.hp`, `updateNeeds`, `updateVillagers`, `updateSimulation`, `mapWidth/mapHeight`) — **ĐÃ XÁC NHẬN T0**: `updateSimulation()` chạy headless, tất định, khớp loop thật.
- Bridge `EngineController` + `GameSnapshot` (bridgeTypes.ts) là mẫu tốt cho ranh giới sim ↔ UI.

## 3. Vấn đề / rủi ro
| # | Mức | Vấn đề | Hệ quả cho bản 3D |
|---|---|---|---|
| R1 | Cao | `ptCore.js` minified 557KB, sim và render trộn trong cùng object `game` (`drawMapObject`, `drawGameUnderMenu` gọi từ cùng lớp) | T0: tách được bằng cách gọi `game.updateSimulation()`; còn coupling nhỏ (sim đổi `screen`, gọi `contextMenu.build()`, cache `drawFlags/fogState`) |
| R2 | Cao | Menu, build menu, minimap, dialog, nút chọn thực tế vẫn vẽ trong canvas & điều khiển bằng phím J2ME (`tapKey`, `tapShortcut(3)`…); React chỉ gọi lại qua "bấm phím giả" | UI mới cần API lệnh trực tiếp (`placeBuilding(type,x,y)`, `assignJob`…) thay vì giả lập phím |
| R3 | Cao | Không có test nào, không có golden data để so sánh hành vi | Khi viết lại sim dễ sai lệch; cần replay/golden test (T2) |
| R4 | TB | Polling 125ms + chuỗi `sig` thủ công để phát hiện thay đổi, giới hạn villager `id 1..50` cứng | Với 3D cần event/subscribe + state selector, không poll |
| R5 | TB | Chuỗi tiếng Việt hard-code (`'Chiến','Ném','Thám'…`, `'Tay không'`) trong `readTopSkill`, chưa có `vi.json` | Chuyển hết vào i18n |
| R6 | TB | Type `any` ở `game`, `input`, `viewport`, `audio`; `ptCore.d.ts` chỉ khai báo `mountPrehistoricTribes` | Cần type đầy đủ cho sim mới |
| R7 | TB | `dist/`, `tsconfig.tsbuildinfo`, `node_modules` nằm trong thư mục; git status cho thấy `3_web_game/` bị xoá chưa commit, `.gitignore` đổi | Dọn repo, commit baseline trước khi làm tiếp |
| R8 | TB | Tài nguyên đồ hoạ 100% 2D pixel (sprite 240x320, atlas pi0/pi9) và `PrehistoricDinosaurJungle2D...` cũng 2D | **Không có asset 3D nào** → phải có pipeline model (T6) |
| R9 | Thấp | Chưa có save/load (J2ME RMS cũ), chưa có a11y, chưa responsive thật sự (stage cố định 240x320 scale) | Làm trong HUD mới |
| R10 | Thấp | Nhạc mp3 (chuyển từ MIDI) ok; chưa có SFX | Bổ sung SFX |

## 4. Kết luận đánh giá
Hướng đúng: **không mở rộng bản React hiện tại**. Giữ nó làm *oracle tham chiếu* (chạy song song để so kết quả), xây mới dự án `6_prehistoric_tribes_3d` gồm: (1) sim headless TypeScript, (2) renderer 3D, (3) HUD React hiện đại, (4) pipeline asset. Xem `01_REBUILD_PLAN.md`.
