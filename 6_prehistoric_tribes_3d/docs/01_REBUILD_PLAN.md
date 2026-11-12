# 01 — Kế hoạch rebuild 3D + UI hiện đại

## 1. Mục tiêu & phi mục tiêu
**Mục tiêu:** cùng luật chơi/cốt truyện/10 level như bản gốc (đã RE), nhưng camera 3D (góc nhìn RTS nghiêng, xoay/zoom), mô hình low-poly, ánh sáng ngày/đêm, HUD hiện đại, chạy trên desktop + mobile browser.
**Phi mục tiêu (v1):** multiplayer, level editor, sửa luật chơi. (Cân bằng lại chỉ khi có quyết định ghi trong `DECISIONS.md`.)

## 2. Stack đề xuất
| Lớp | Chọn | Lý do |
|---|---|---|
| Build | Vite + TypeScript strict, npm workspaces (đổi từ pnpm ở T1) | Đang dùng Vite; workspace tách package |
| Sim | `packages/sim` — TS thuần, **không import DOM/three/react** | Headless, test được, chạy được trong Web Worker |
| 3D | three.js + `@react-three/fiber` + drei (hoặc three thuần nếu cần perf) | Hệ sinh thái lớn, GLB, instancing |
| HUD | React 18 + Zustand + Tailwind/CSS vars (hoặc Radix UI) | Store nhận snapshot từ sim |
| Pathfinding | A* trên lưới (từ sim), lưu ý thay thế line-stepping gốc | Đã nêu trong spec Phase 6 |
| Audio | Howler/WebAudio, mp3 sẵn + SFX mới | |
| Test | Vitest (sim, golden), Playwright (e2e + screenshot) | |
| i18n | i18next, nạp `res/text/*.json` + thêm `vi.json` | |

## 3. Cấu trúc thư mục mục tiêu
```
6_prehistoric_tribes_3d/
  AGENTS.md                 # luật cho coding agent
  docs/ (00..05, DECISIONS.md)
  packages/
    sim/        # luật chơi headless  (T2–T5)
    data/       # loader game-data.json, maps, locale → type an toàn (T1)
    render3d/   # three/R3F: terrain, entity, camera, picking (T6–T9)
    ui/         # HUD React hiện đại (T10–T13)
    assets/     # pipeline model/texture, manifest (T6)
  apps/web/     # ghép tất cả, Vite app
  tools/        # script RE: export oracle replay từ bản 5_react
  oracle/       # bản 5_prehistoric_tribes_react chạy để lấy golden data
```

## 4. Ranh giới kiến trúc (bất biến)
1. `sim` chỉ nhận **Command** (`PlaceBuilding`, `SelectUnit`, `CallToArms`, `Pause`…) và phát ra **Snapshot + Event** (sinh con, tấn công, xây xong…). Render/UI không ghi trực tiếp vào state sim.
2. Toạ độ sim là tile `(x,y)` nguyên + offset thập phân; renderer đổi sang world `(x, h, z)` bằng 1 hàm duy nhất `tileToWorld`. Chiều cao `h` do renderer/terrain quyết định, không ảnh hưởng sim.
3. Sim chạy cố định ~8.3 Hz (120 ms/tick như bản gốc, đã đo ở T0; chế độ nhanh 50 ms), render 60fps nội suy giữa 2 tick.
4. Mọi chuỗi hiển thị qua i18n key, không hard-code.

## 5. Các việc phải làm (tổng quan)
| Giai đoạn | Nội dung | Rủi ro chính |
|---|---|---|
| A. Nền tảng | Dọn repo, scaffold monorepo, chạy oracle, type hoá data | Dữ liệu `.bin` chưa có parser TS |
| B. Sim headless | Trích/viết lại từ `ptCore.js` + tài liệu; golden test so oracle | **Lớn nhất**: engine minified, AI địch phức tạp |
| C. 3D world | Terrain từ map RLE, camera, model/billboard tạm, picking | Thiếu asset 3D |
| D. Tương tác | Chọn/lệnh/placement công trình bằng chuột-chạm, minimap | Pick 3D ↔ tile |
| E. HUD hiện đại | Resource bar, inspector, build menu, roster, dialog cốt truyện, menu | Thiết kế UI chưa có |
| F. Nội dung | 10 level, cutscene, win/lose, save/load, audio | Cân bằng, kiểm thử dài |
| G. Hoàn thiện | Perf, mobile, a11y, PWA | |

### Chiến lược giảm rủi ro cho B (quan trọng)
- **Không viết sim từ đầu theo tài liệu thuần.** Làm 2 nấc: (1) wrap oracle → xuất replay (state mỗi N tick theo seed + chuỗi lệnh) → (2) viết sim TS, chạy cùng lệnh, so sánh từng hệ thống (needs, gather, build, combat, AI). Tolerance cấu hình được; sai khác có chủ ý ghi vào `DECISIONS.md`.
- **T0 đã xác nhận sim tách được + tất định** (xem `NOTES.md`). Vì vậy đề xuất làm **song song**: (a) bản 3D chạy trên oracle trong Worker để có M2 sớm, (b) sim TS viết dần thay thế qua golden test.
- Phương án dự phòng (giờ thành *bước đệm chính thức*) — chạy oracle `ptCore` trong Worker làm sim tạm, render 3D đọc `game.units/buildings/animals/objects` (đã có trong bridge) để có bản 3D chơi được sớm; thay dần bằng sim TS. (Ghi rõ là tạm.)

### Chiến lược asset 3D (quyết định cần người dùng chọn — xem `DECISIONS.md` D-01)
- **P1 (nhanh):** low-poly tự dựng bằng primitive/Blender script + palette màu, instanced. 
- **P2:** model CC0 (Kenney, Quaternius) + chỉnh sửa. 
- **P3 (2.5D tạm):** billboard sprite gốc trong thế giới 3D (dùng ngay, giữ phong cách gốc).
Đề xuất: P3 để có vertical slice ở M2, rồi P1/P2 thay dần theo `assets/manifest.json`.

## 6. Mốc (milestone)
- **M0** Repo sạch + scaffold + oracle chạy được (T0–T1)
- **M1** Sim headless chạy Level 0 qua golden test (T2–T5)
- **M2** Vertical slice 3D: Level 0, di chuyển camera, thấy dân/công trình/động vật, chọn & ra lệnh cơ bản (T6–T9)
- **M3** HUD mới đầy đủ + xây dựng + chiến đấu (T10–T13)
- **M4** 10 level + cốt truyện + save/load (T14–T15)
- **M5** Perf/mobile/a11y/PWA + release (T16–T17)
