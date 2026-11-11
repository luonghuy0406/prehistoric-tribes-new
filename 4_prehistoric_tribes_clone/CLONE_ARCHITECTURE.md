# Kiến trúc Bản Clone & Nâng cấp Đồ họa HD `4x` — Prehistoric Tribes (`4_prehistoric_tribes_clone/`)

Bản sao offline 1:1 từ `https://prehistoric-tribes.vercel.app/`, tự chủ hoàn toàn (tài nguyên gốc + bộ tài nguyên nâng cấp HD `4x` cục bộ, không gọi mạng ngoài).

## 1. Cấu trúc tệp & Engine HD `4x`
- [`index.html`](./index.html) & [`assets/index-DT5HQrea.css`](./assets/index-DT5HQrea.css): Giao diện canvas full-viewport (`#screen` đặt `image-rendering: auto;` để trình duyệt lọc mượt khung hình `4x`).
- [`assets/hd-graphics.js`](./assets/hd-graphics.js): Cầu nối đồ họa Canvas2D GPU `HD_SCALE = 4` (tải bất đồng bộ ảnh từ `res/images-hd/`, hỗ trợ `hdFillDevice`, `hdDrawLine`, `hdDrawRegion` đủ 8 phép xoay/lật MIDP `0..7`, `hdCopyArea`, `hdMirrorBgRow`, `hdCopyRowPattern`, `hdCopyRowSlice`, `hdCapturePanelBg`, `hdExtendBottomSlice`, `hdExtendMenuBackground`).
- [`assets/index-BHVz0EiT.js`](./assets/index-BHVz0EiT.js): Engine gốc được nâng cấp chế độ hai bề mặt song song (`pixels` `1x` giữ nguyên logic & sentinel widescreen + bề mặt `hd` `4x` xuất ra màn hình qua `sS`), đồng thời chuẩn hóa `WS.toGame` theo `tn.width()/tn.height()` để click/rê chuột khớp 100% trên canvas `4x` (`2560×1600` trên viewport `1280×800`). Bản gốc sao lưu tại [`assets/index-BHVz0EiT.orig.js`](./assets/index-BHVz0EiT.orig.js) & [`assets/index-DT5HQrea.orig.css`](./assets/index-DT5HQrea.orig.css).
- [`res/images-hd/`](./res/images-hd): Toàn bộ `49` tệp ảnh PNG nâng cấp đúng kích thước `4x` tuyệt đối (`0` sai lệch kích thước):
  - **Vẽ lại bằng AI (`image-generator`) từ ảnh gốc**: Splash tiêu đề (`splash-2.png`), Logo đá `PREHISTORIC TRIBES` (`sprites/18.png`), `res/images-hd/icon.png` (cùng `icons/icon-192.png`, `icons/icon-512.png`), toàn bộ `12/12` tranh cốt truyện (`story/00..11.png`), và `20` chân dung nhân vật người lớn (`sprites/02.png` — tách lưới `5×4`, xóa nền sạch và đóng gói lại chuẩn `484×604`, `0` điểm ảnh lem viền giữa các ô cắt).
  - **Làm mượt bảo toàn biên `Scale2x` (EPX ×2 = `4x`)**: Các sheet có nhiều mảnh nhỏ ghép sát nhau (`sprites/00, 01, 03..17, 19..26.png`, `sprites-alt/00..05.png`, `splash-0..1.png`) nhằm bảo toàn 100% khớp nối tay chân/công trình và do model tạo ảnh chạm hạn mức quota (`429`). Riêng mảnh sương mù biên (`Ti.UNEXPLORED_EDGE`, Clip 11 trong `res/images-hd/sprites/13.png`) được gia cố vùng lõi `22×16` đen đặc để loại bỏ hoàn toàn khe hở giữa các ô sương mù.
- [`res/data/game-data.json`](./res/data/game-data.json), [`res/maps/map-0.bin` .. `map-9.bin`](./res/maps/map-0.bin), [`res/text/{en,fr,it,de,es}.json`](./res/text/en.json), [`music/song0.mp3` .. `song4.mp3`](./music/song0.mp3), [`download/index.html`](./download/index.html), [`registerSW.js`](./registerSW.js).

## 2. Cơ chế kích thước & hiển thị
- Engine tính kích thước viewport thực (`Sr(w, h)`) từ chuẩn tối thiểu `240x320` lên tối đa `1280x1280` (zoom bằng `+`/`-`, cuộn chuột hoặc pinch 2 ngón).
- Các ô isometric dùng bước chuẩn `22×16` nửa ô (`44×32` mỗi ô đầy đủ); bề mặt logic giữ nguyên `1x` cho va chạm/cắt `sprites.json`/sentinel widescreen, đồng thời vẽ song song lên bề mặt `hd` `4x` (`2560×1600` ở viewport `1280×800`).
- Bảng dữ liệu thực thể (`ta`) quản lý đồng thời:
  - Tối đa `101` ô `units` (Dân làng / Chiến binh / Địch / Tù trưởng / Trẻ em).
  - `61` ô `buildings` (12 loại công trình + construction sites + 3 loại bẫy).
  - `22` ô `animals` (Lợn rừng, Hổ răng kiếm, Voi ma mút, Khủng long...).
  - `50` ô `objects` (Tài nguyên, xác thú, điểm hiệu ứng).

## 3. Lộ trình tối ưu từng phần đề xuất (bước tiếp theo)
1. **Tách & làm sạch mã nguồn (`Un-minify & Modularize`)**: Bóc `assets/index-BHVz0EiT.js` thành các ES Module gọn gàng (Renderer, World, AI, UI, Audio) để dễ nâng cấp mà giữ 100% hành vi gốc.
2. **Chuẩn hóa đồ họa HD & Kích thước (`High-Res Renderer + Normalized Scaling`)**: Thay thế bộ cắt pixel 240p bằng bộ HD đã dựng ở `3_web_game/` nhưng giữ đúng tỷ lệ `width/height` theo `sprites.json` và footprint ô isometric `44×32`.
3. **Việt hóa hoàn chỉnh (`res/text/vi.json`)**: Thêm ngôn ngữ Tiếng Việt trực tiếp vào `Ft` & màn hình Options của bản game gốc.
4. **Mở rộng Chiến binh 3★, Trạng thái nhân vật đầy đủ & T-Rex** lên trực tiếp nền engine chuẩn.
