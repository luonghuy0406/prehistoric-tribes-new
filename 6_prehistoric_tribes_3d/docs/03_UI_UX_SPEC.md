# 03 — Đặc tả UI/UX hiện đại (dựa trên bản gốc)

## Nguyên tắc
Giữ **nhận diện gốc** (màu giấy da, nâu đất, cam lửa `#f2b33d`, chủ đề bộ lạc) nhưng hiện đại hoá: glassmorphism nhẹ + viền đá/gỗ, icon vector (dựng lại từ atlas `pi0`), font hiển thị có chất thô sơ (vd. một font display) + font sans đọc tốt cho số liệu. Dark mặc định, tương phản AA.

## Bố cục HUD (desktop)
- **Trên:** Resource bar — Food, Meals, Wood, Stones, Bones, Dân/Chỗ ở; tên level; nút Pause/Menu. Cảnh báo (alert) dạng toast có nút "nhảy tới".
- **Trái dưới:** Inspector (chân dung 3D thu nhỏ, tên, tuổi, thanh HP/Food/Energy/Happiness, 2 skill cao nhất, vũ khí; với công trình: cấp, HP, sức chứa, nút nâng cấp).
- **Giữa dưới:** Command bar — Build (B), Call to Arms (C), Form Up, Back to Work, Chief (Space), Roster (V).
- **Phải dưới:** Minimap xoay theo camera + hiện alert.
- **Overlay:** Build menu dạng lưới thẻ 12 công trình (icon, chi phí W/S/B, kích thước, khoá/mở theo level, preview 3D khi hover); Roster dạng bảng sắp xếp/lọc; Dialog cốt truyện dạng visual-novel với ảnh story 00–11.
- **Mobile:** thanh tài nguyên gọn, nút hành động nổi theo ngón cái, bottom-sheet cho inspector/build, pinch-zoom + 2 ngón xoay.

## Điều khiển
Chuột trái chọn/kéo box; phải ra lệnh; WASD/mũi tên + chuột giữa kéo; Q/E xoay; wheel zoom; Ctrl+1-9 nhóm; `Esc` đóng. Mọi phím cấu hình được.

## Màn hình cần mockup (T10)
Title · Chọn level/campaign · HUD đang chơi · Build menu · Roster+Inspector · Dialog cốt truyện · Pause/Options (ngôn ngữ en/fr/it/de/es/vi) · Win/Lose + điểm (`(Born*15+Built*25+Razed*60+Killed*40+Gathered)/10`).

## Hiệu năng & a11y
Preset đồ hoạ Low/Med/High; tôn trọng `prefers-reduced-motion`; điều khiển bàn phím cho HUD; nhãn ARIA; cỡ chữ chỉnh được.
