# Kiến trúc Bản Clone Nguyên Bản 1:1 — Prehistoric Tribes (`4_prehistoric_tribes_clone/`)

Bản sao offline 1:1 từ `https://prehistoric-tribes.vercel.app/`, tự chủ hoàn toàn (không gọi mạng ngoài), khôi phục đúng engine, giao diện canvas và đồ họa pixel nguyên bản.

## 1. Cấu trúc tệp & Engine Nguyên Bản
- [`index.html`](./index.html) & [`assets/index-DT5HQrea.css`](./assets/index-DT5HQrea.css): Giao diện canvas full-viewport sử dụng `image-rendering: pixelated; image-rendering: crisp-edges;` đúng nguyên bản [`assets/index-DT5HQrea.orig.css`](./assets/index-DT5HQrea.orig.css).
- [`assets/index-BHVz0EiT.js`](./assets/index-BHVz0EiT.js): Khôi phục hoàn toàn giống [`assets/index-BHVz0EiT.orig.js`](./assets/index-BHVz0EiT.orig.js) (không dùng bridge HD hay UI custom ngoài), vẽ trực tiếp bề mặt `1x` pixel bằng tài nguyên gốc trong [`res/images/`](./res/images).
- [`res/data/game-data.json`](./res/data/game-data.json), [`res/data/sprites.json`](./res/data/sprites.json), [`res/maps/map-0.bin` .. `map-9.bin`](./res/maps/map-0.bin), [`res/text/{en,fr,it,de,es}.json`](./res/text/en.json), [`music/song0.mp3` .. `song4.mp3`](./music/song0.mp3), [`download/index.html`](./download/index.html), [`registerSW.js`](./registerSW.js).

## 2. Cơ chế kích thước & hiển thị
- Engine tính kích thước viewport thực (`Sr(w, h)`) từ chuẩn tối thiểu `240x320` lên tối đa `1280x1280` (zoom bằng `+`/`-`, cuộn chuột hoặc pinch 2 ngón).
- Các ô isometric dùng bước chuẩn `22×16` nửa ô (`44×32` mỗi ô đầy đủ), giữ nguyên `100%` cơ chế va chạm, cắt `sprites.json`, HUD cổ điển và luồng màn hình gốc.
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
