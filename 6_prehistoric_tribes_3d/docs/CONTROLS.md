# CONTROLS — điều khiển bản 2D (web + mobile)

Mọi lệnh đi qua **chính bộ xử lý input của engine gốc** (`EngineCommands` trong `packages/engine-adapter/src/commands.ts`): một cú chạm đặt con trỏ ảo lên ô rồi chạy `input.handleFireTap()` — giống phím FIRE của bản J2ME. Vì vậy luật (ai được giao việc gì, chi phí, menu ngữ cảnh) giữ nguyên 100%.

## Desktop (chuột + bàn phím)
| Thao tác | Kết quả |
|---|---|
| Click trái vào dân phe mình | Chọn dân |
| Click trái khi đang chọn dân | Ra lệnh theo ngữ cảnh: đi, chặt cây, hái quả, đào đá, săn, tấn công, vào/làm việc ở công trình, xây công trường |
| Double-click | Như trên nhưng dân **chạy** (tương đương bấm FIRE 2 lần ở bản gốc) |
| Click phải | Ra lệnh cho nhóm đang chọn (không đổi lựa chọn); khi đang đặt nhà = huỷ |
| Kéo chuột trái | Chọn vùng (chỉ dân phe mình) |
| Kéo chuột phải/giữa, WASD/mũi tên | Di chuyển bản đồ |
| Cuộn chuột, `+`/`-` | Zoom |
| Click công trình phe mình | Mở thẻ công trình: nâng cấp, sửa, phá (có xác nhận), ra ngoài, phép, đặt chế tạo vũ khí/bẫy (+/−), danh sách người bên trong |
| `B` | Mở/đóng menu xây |
| `C` / `F` | Báo động / Tập hợp → click ô để cắm cờ; bấm lại để tắt |
| `H` | Về làm việc (giải tán) |
| `Space` | Chọn và đưa camera tới tù trưởng |
| `Ctrl/⌘ + A` | Chọn tất cả dân |
| `P` | Tạm dừng / chạy |
| `Esc` | Huỷ đặt nhà → đóng menu → bỏ chọn |

## Mobile (cảm ứng)
| Thao tác | Kết quả |
|---|---|
| Chạm | Chọn / ra lệnh theo ngữ cảnh (như click trái) |
| Chạm đúp | Ra lệnh và cho dân chạy |
| Nhấn giữ (~0.45 s, rung nhẹ) | Ra lệnh cho nhóm đang chọn (như click phải) |
| Kéo 1 ngón | Di chuyển bản đồ |
| Chụm 2 ngón | Zoom + di chuyển |
| Nút **Chọn vùng** trên dock | Bật chế độ kéo-để-chọn-vùng |
| Đặt nhà | Chạm vị trí → bóng ma xanh/đỏ hiện ra → chạm lại hoặc bấm **Xây ở đây** |

## Khác biệt có chủ ý so với bản gốc
- Không còn con trỏ bàn phím; chọn bằng hit-test trên vị trí nội suy (chính xác hơn với dân đang đi).
- Phá công trình cần xác nhận trong thẻ (bản gốc có bước CONFIRMING riêng).
- Mở menu xây sẽ bỏ chọn hiện tại; chạm ra ngoài khi đang mở thẻ công trình sẽ đóng thẻ.
- Engine camera bị ghim (0,0) để con trỏ = toạ độ ô; camera hiển thị do renderer mới quản lý.

## Chưa có (task tiếp theo)
Phím nhóm `Ctrl+1..9`, minimap, cuộn cạnh màn hình, toast cảnh báo (bị tấn công, thiếu tài nguyên…), chọn loại phép bằng giao diện riêng (hiện dùng nút trong thẻ Đền thờ rồi chạm mục tiêu).
