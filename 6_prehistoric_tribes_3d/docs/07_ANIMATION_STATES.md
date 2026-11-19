# 07 — Trạng thái hoạt ảnh của nhân vật trong bản gốc (nghiên cứu từ engine)

Nguồn: `ptCore.js` (enum `W` = animation, `U` = task, `oc` = emote), `game-data.json` (`taskAnimations`, `attackAnimations`, `moodEmotes`, `poseFatigueInterval`…), `sprites.json` (`animationFrameCount`). Đã đối chiếu với dữ liệu sống ở level 7 (tù trưởng id 1: animation 17; dân: 8/15/16/17; dân "vô gia cư" có emote 9).

## 1. Cách engine điều khiển hình dạng một nhân vật
- Mỗi unit có **một mã `animation` (0–161)**, một **`animationFrame`** chạy từ 0 tới `animationFrameCount[animation]-1`, và **`direction` 0–7** (0=E, 1=SE, 2=S, 3=SW, 4=W, 5=NW, 6=N, 7=NE).
- `animation` lưu kiểu byte **có dấu**: mã 128–161 hiện ra là số âm (−128…−95); luôn dùng `animation & 255`.
- **Task → animation:** `taskAnimationStart/taskAnimations/taskAnimationChances` (mỗi task có danh sách animation + xác suất chọn). Tấn công chọn từ `attackAnimations` theo *loại vũ khí* và kỹ năng cận chiến (kỹ năng cao → có đòn mạnh `31–33`). Bên trong công trình dùng `slotEntryAnimations/slotWorkAnimations` (ăn, ngủ, nấu, rèn, DJ…).
- **Tư thế đứng theo trạng thái:** `movementPose % 7 + 8` — đứng tay không (8), cầm đồ/đá (9), lén (12)… Đứng lâu → tiêu hao sức theo `poseFatigueInterval`.
- **"Chán nản"/tâm trạng KHÔNG phải một dáng đi riêng.** Bản gốc thể hiện bằng **bong bóng suy nghĩ (`emote`)** trên đầu, chọn theo chỉ số: 0 đói, 1 tình yêu, 2 mệt, **4–8 tâm trạng theo `happiness` (0–19 = rất buồn … 80–99 = rất vui)**, 9 vô gia cư, 11/12 nhạc. Hết thức ăn/sức luôn ép emote đói/mệt.

## 2. Bảng nhóm hoạt ảnh (mã : số khung)
| Nhóm (`PoseKind` trong renderer) | Mã animation : số khung | Kích hoạt bởi |
|---|---|---|
| **Đi** `walk` | 0:4, 6:4 (trẻ em), 126:6 (đi tìm người yêu) | di chuyển |
| **Chạy** `run` | 7:4 | lệnh chạy (double-click) |
| **Mang đồ** `carry` | 1:4 | đang mang gỗ/đá/thịt/… hoặc cầm đá |
| **Lén** `sneak` | 5:2 | trinh sát đang ẩn |
| **Đứng** `stand` | 8–14:1 (8 tay không, 9 cầm đồ), 19:1, 20:6 | IDLE, chờ |
| **Nhìn quanh / lúng túng** `fidget` | 15:4, 16:8, 17:6, 18:4 | IDLE lâu (tù trưởng hay ở trạng thái này) |
| **Làm việc** `work` | 21:2 (chung: chặt, hái, đào, săn xác…), 53:3 (rèn/xây), 54:3 (sửa) | các task làm việc |
| **Thả hàng** `drop` | 22:14 | giao hàng vào kho |
| **Đánh cận chiến** `attack`/`power` | 23–30 (2–6 khung), **31–33 đòn mạnh** (9/8/6) | `ATTACK_*`, tháp bắn thứ hai |
| **Ném** `throw` | 34:1 (ngắm), 35:6, 36:5, 91–93:11 (tập ném) | `THROW_*`, `THROWING_PRACTICE` |
| **Bị đánh lảo đảo** `stagger` | 42:10 (cũng dùng cho đoạn interlude lúc rảnh) | trúng đòn mạnh |
| **Chết** `die` | 43:9, 44:10 (trẻ em) | hp = 0 (unit bị xoá sau khung cuối) |
| **Nhảy** `dance` | 39:8, 104:16 (disco), 73:42 / 74:52 / 117:30 (DJ) | disco, DJ, tiệc |
| **Ngủ** `sleep` | 40:2, 41:2 | ngủ ngoài trời, trong lều |
| **Ngồi nghỉ** `sit` | 113:12, 114:8, **115:13 (ngồi xuống)**, **116:13 (đứng dậy)** | thợ xây chờ vật liệu (`BUILDER_WAIT`) |
| **Ăn** `eat` | 85:19, 86:19 (ngồi đối diện) | `EAT_MEAL`, nghỉ trong lều |
| **Nấu** `cook` | 81:6, 82:12, 83:12, 84:12 | bếp |
| **Câu cá** `fish` | 141:4 (quăng), 142:10, 143:4, 144:10, 145:6 (cá cắn), 146:6 | `FISH` |
| **Làm phép** `cast` | 46:9, 105:16 (nghi lễ shaman), 140:27 (truyền phép chữa) | `CAST_*`, `WORK_AS_SHAMAN` |
| **Chơi (trẻ em)** `play` | 45:5, 46:9, 47–52 | `CHILD_PLAY`, nhà trẻ |
| **Bị bẫy** `trapped` | 106:22, 107:37, 108:18 | dính bẫy |
| **Nói chuyện** `chat` | 155:10, 156:10 (cầm đồ) | hai người gặp nhau |
| **Giật mình** `alarmed` | 161:6 | báo động |
| Khác (không cần vẽ) | 55–70, 75–80, 87–90, 94–103, 111–112, 118–124 (hoạt ảnh bên trong công trình), 127 (yêu), 147–154 (nhặt/đặt dụng cụ, ẩn/hiện, đưa vật liệu), 157–160 (hôn) | |

## 3. Tù trưởng cụ thể
Tù trưởng là một dân bình thường (id = `tribeStats[PLAYER][CHIEF]`) dùng **cùng bộ animation** nhưng sprite có mũ lông vũ. Người chơi có thể giao việc gì cũng được: đi/chạy, chặt cây, hái quả, săn, đánh, ném, xây, ngủ, ăn, nhảy disco. Khi rảnh nó ở `stand`/`fidget` (nhìn quanh), khi thiếu ăn/ngủ có emote.
Thực tế quan sát ở level 7: animation **17** (fidget 6 khung) ngay từ đầu.

## 4. Đã làm trong renderer (code-driven, `packages/render2d/src/renderer.ts`)
`poseKindOf(animation)` nhóm mã ở trên; `poseFor()` tạo chuyển động quanh chân sprite (nhún, nghiêng, skew, dẹt/giãn, lật gương khi nhìn quanh, nằm xuống khi ngủ/chết, lao tới khi đánh, ngồi xổm khi `sit`…), đồng bộ pha với `animationFrame` của engine (đòn đánh/ném khớp sim). **Chán nản:** `gloom` (hạnh phúc < 28, đói < 14, mệt < 14) làm dáng gù/chậm; bong bóng emote vẽ bằng icon S10 (mặt cười lật ngược = buồn). Unit đang chết vẫn được vẽ tới khung cuối.
**Giới hạn:** chỉ là biến dạng của 1 ảnh đứng → ngồi/ăn/nhảy/ngủ trông "xổm/lăn" chứ chưa có tay chân chuyển động. Phần dưới liệt kê art cần vẽ để thay thế.

## 5. Art cần vẽ cho tù trưởng (khung hình thật)
Xem prompt hoàn chỉnh trong `08_CHIEF_POSE_SHEETS.md` (3 sheet). Quy ước tên file sau khi cắt: `chr_chief@<pose>_<hướng>.png` (hướng `S`, `SE`, `E`, `NE`, `N`; pose một hướng dùng `S`).

| Sheet | Nội dung | Khung |
|---|---|---|
| CH1 | đi bộ 5 hướng × 6 khung (chạy/mang đồ dùng lại + code) | 30 |
| CH2 | đứng/nhìn quanh/ngồi xuống–nghỉ/ăn/ngủ/nhảy/buồn/reo hò/ngã/bị đánh (hướng S) | ~35 |
| CH3 | đánh cận chiến, ném, chặt/đập (hướng E và S) | ~28 |

Sau khi có art, renderer chọn khung theo `PoseKind` + `animationFrame/animationFrameCount` (nội suy sang số khung đã vẽ), không có khung thì rơi về pose code-driven hiện tại.
