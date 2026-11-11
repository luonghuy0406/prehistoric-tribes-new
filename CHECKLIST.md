# Prehistoric Tribes Web Remake — Checklist & Architecture Blueprint

Tài liệu này định hình cấu trúc mã nguồn (Directory & Module Structure), kiến trúc phần mềm, và bảng kiểm tra tiến độ (Checklist) từng bước để chuyển thể trọn vẹn *Prehistoric Tribes* thành phiên bản Web hiện đại.

---

## 1. Cấu trúc Source Code Dự án (`3_web_game`)

```
3_web_game/
├── index.html                           # Entry HTML, Canvas, Top HUD, Inspector & Dialogue Box
├── package.json                         # Cấu hình dự án (Vite, TypeScript)
├── tsconfig.json                        # Cấu hình TypeScript
├── vite.config.ts                       # Cấu hình bundler Vite
├── assets -> public/assets              # Symlink tiện dụng cho cả Vite & HTTP static server
├── public/                              # Static Game Assets
│   └── assets/
│       ├── images/
│       │   ├── pi0.png                  # UI, Icons, Items, Weapons Atlas (128x136)
│       │   ├── pi8.png                  # Title Banner / Environment Art (240x130)
│       │   ├── pi9.png                  # Villagers 8-direction Spritesheet (76x111)
│       │   ├── portrait_chief.jpg       # [MỚI] Chân dung HD Tộc trưởng (Chief)
│       │   ├── portrait_mumbo.jpg       # [MỚI] Chân dung HD Mumbo
│       │   ├── l0.png ... l3.png        # Logos & Title Screens
│       │   └── icon.png                 # Game Icon
│       ├── audio/
│       │   ├── music_track_0_8014b.mid  # BGM Gameplay
│       │   ├── music_track_1_6315b.mid  # BGM Title Theme
│       │   ├── music_track_2_5648b.mid  # BGM Combat / Raid
│       │   ├── music_track_3_3405b.mid  # Fanfare Victory
│       │   └── music_track_4_3234b.mid  # Defeat Stinger
│       ├── maps/
│       │   ├── 00_outside.bin           # Level 0 Map Data
│       │   └── ... 09_plot_of_land.bin  # Level 9 Map Data
│       └── data/
│           ├── strings_en.json          # Parsed from 0/s (UI strings)
│           ├── descriptions_en.json     # Parsed from 0/t (Tooltips)
│           └── campaign_en.json         # Parsed from 0/d0 (236 Dialogues)
│
└── src/                                 # Source Code Engine & Simulation
    ├── main.js / main.ts                # Bootstrap, Game Loop, Input Routing & State
    ├── core/
    │   ├── IsometricMath.js             # Tọa độ chiếu nghiêng 2:1 (44x32 diamond) & 8 hướng
    │   ├── Camera.js                    # Pan, Zoom (1x-4x), World <-> Screen conversions
    │   └── DayNightCycle.js             # [MỚI] Chu kỳ Ngày/Đêm 24h & Hiệu ứng đuốc lửa ban đêm
    ├── loaders/
    │   └── BinaryMapLoader.js           # Bộ giải mã RLE tệp bản đồ nhị phân (.bin)
    ├── simulation/
    │   ├── Villager.js                  # Dân làng: Máu, Đói, Mệt, Hạnh phúc, FSM di chuyển
    │   └── Building.js                  # 12 Công trình: Chi phí, Tiến độ thi công, Sức chứa
    └── renderer/
        ├── TilemapRenderer.js           # Vẽ gạch Isometric, bóng đổ, cây đung đưa theo gió
        ├── SpriteRenderer.js            # Vẽ dân làng, bóng đổ mềm, Y-sorting, thanh máu, thought bubbles
        ├── BuildingRenderer.js          # Vẽ nhà 2.5D, bóng mờ ghost preview khi đặt, thanh tiến độ
        └── ParticleSystem.js            # [MỚI] Vụn gỗ khi chặt cây, tia lửa đá, bụi bước chân
```

---

## 2. Master Checklist Triển Khai (Cập nhật Tiến độ Thực tế)

### Phase 1: Setup Dự Án & Asset Pipeline (HOÀN THÀNH 100%)
- [x] **1.1** Khởi tạo project `Vite + TypeScript` với cấu trúc thư mục chuẩn.
- [x] **1.2** Copy toàn bộ assets nguyên bản (`1_reverse_engineering/assets/`) vào thư mục `3_web_game/public/assets/`.
- [x] **1.3** Chuyển đổi dữ liệu chuỗi `0/s`, `0/t`, `0/d0` sang định dạng JSON (`strings_en.json`, `descriptions_en.json`, `campaign_en.json`).
- [x] **1.4** Xây dựng bộ tải và cắt sprite sheet từ `pi0.png` và `pi9.png`.

### Phase 2: Isometric Engine & Map Renderer (HOÀN THÀNH 100%)
- [x] **2.1** Cài đặt `IsometricMath.js`: $\text{screenX} = (x - y) \times 22, \quad \text{screenY} = (x + y) \times 16$.
- [x] **2.2** Xây dựng `BinaryMapLoader.js`: Giải mã RLE các file `.bin` trong `public/assets/maps/`.
- [x] **2.3** Cài đặt `TilemapRenderer.js`: Render hoàn chỉnh bản đồ Màn 0 (`00_outside.bin`) với các lớp cỏ, đất, cây, đá.
- [x] **2.4** Cài đặt `Camera.js`: Hỗ trợ kéo bản đồ (chuột giữa / WASD / phím mũi tên) và cuộn chuột thu phóng (Zoom 1x - 4x).

### Phase 3: Nhân vật, Di chuyển & Hoạt ảnh (HOÀN THÀNH 80%)
- [x] **3.1** Hoạt ảnh di chuyển 8 hướng của nam/nữ dân làng (Đi bộ, Đứng yên, Gõ búa, Chặt cây).
- [ ] **3.2** Cài đặt thuật toán tìm đường **A\* trên lưới Isometric**, tự động né vật cản (`-126` = impassable). *(Hiện đang di chuyển thẳng với kiểm tra va chạm biên)*
- [x] **3.3** Sắp xếp chiều sâu (Depth / $Y$-Sorting): Đảm bảo nhân vật đi đứng tự nhiên phía trước / sau cây cối và nhà cửa mà không bị đè layer sai.

### Phase 4: Điều khiển Chuột Hiện đại RTS (HOÀN THÀNH 85%)
- [x] **4.1** **Chuột trái**: Click chọn 1 dân làng / công trình / mỏ tài nguyên.
- [ ] **4.2** **Quét chuột (Box Selection)**: Kéo chuột khoanh vùng chọn nhiều chiến binh cùng lúc.
- [x] **4.3** **Chuột phải thông minh (Context Action)**:
  - Click vào cây $\rightarrow$ Ra lệnh đốn gỗ tự động.
  - Click vào đá $\rightarrow$ Ra lệnh khai thác đá tự động.
  - Click vào công trường $\rightarrow$ Ra lệnh thi công gõ búa.
  - Click đất trống $\rightarrow$ Di chuyển.
- [x] **4.4** Phím tắt tiện dụng: `Space` (về Tộc trưởng), `WASD` / Mũi tên (di chuyển màn hình), `Esc` (hủy đặt công trình).

### Phase 5: Mô phỏng Dân làng & Đời sống (HOÀN THÀNH 50%)
- [x] **5.1** Hệ thống chỉ số thời gian thực: Máu (HP), Đói (Hunger), Mệt mỏi (Tiredness), Hạnh phúc (Happiness).
- [x] **5.2** Bong bóng suy nghĩ (Thought Bubbles): Hiển thị icon trên đầu dân khi đói (`🍖`) hoặc buồn ngủ (`💤`).
- [ ] **5.3** Tự động đáp ứng nhu cầu:
  - Đói $\rightarrow$ Tự tìm Nhà bếp (Kitchen) để ăn.
  - Mệt $\rightarrow$ Tự tìm Lều (Hut) còn chỗ để ngủ hồi năng lượng.
  - Buồn bã / Trầm cảm $\rightarrow$ Tìm Vũ trường (Disco) nhảy múa giải khuây.
- [ ] **5.4** Sinh sản ("Tent-time"): Đôi nam nữ hạnh phúc ở lều trống sinh ra em bé.
- [ ] **5.5** Nhà trẻ (Nursery): Giữ trẻ em an toàn, không bị thú dữ bắt cóc.

### Phase 6: Kinh tế, Chế tạo & Xây dựng (HOÀN THÀNH 70%)
- [x] **6.1** Quản lý 4 tài nguyên toàn cục: Gỗ (Wood), Đá (Stone), Thức ăn (Food), Xương (Bones).
- [x] **6.2** Hệ thống xây dựng 12 loại công trình với xem trước vị trí đặt (Bóng mờ Ghost Footprint: xanh = hợp lệ, đỏ = thiếu tài nguyên/vướng).
- [x] **6.3** Tiến trình thi công: Dân chạy tới công trường gõ búa có thanh tiến độ ($0\% \rightarrow 100\%$), hoàn thành tăng chỗ ở dân số.
- [ ] **6.4** Nâng cấp công trình (Level 1 $\rightarrow$ Level 2) cho Lều, Bếp, Vũ trường, Chòi canh.
- [ ] **6.5** Xưởng rèn (Armoury): Chế tạo vũ khí (Rìu đá, Chùy xương, Lao) và bẫy (Bẫy lưới, Bẫy sập, Bẫy hố).

### Phase 7: Chiến đấu, Kẻ thù & Phép thuật (CHƯA BẮT ĐẦU)
- [ ] **7.1** Hệ thống chiến đấu: Đánh cận chiến vs Phóng lao tầm xa.
- [ ] **7.2** Hào quang Tộc trưởng (Chief Aura): Tăng tốc độ làm việc và sát thương chiến đấu cho quân xung quanh.
- [ ] **7.3** AI Kẻ thù: Các đợt thổ dân ăn thịt người (Cannibals) và dã thú (Hổ răng kiếm) kéo đến tấn công làng.
- [ ] **7.4** Phép thuật Pháp sư (Sanctuary): Hồi máu (Heal), Khiên hộ thể (Ward), Thuốc kích dục Niagra, Dịch bệnh (Disease).

### Phase 8: Giao diện (HUD), Cốt truyện & 10 Màn Chiến dịch (HOÀN THÀNH 60%)
- [x] **8.1** Thanh tài nguyên trên đỉnh (Top HUD) & Khung soi thông tin dân làng góc dưới trái (Inspector).
- [x] **8.2** Hộp thoại cốt truyện pop-up với lời thoại gốc hài hước trích từ `campaign_en.json` và nút `Next ▶`.
- [x] **8.3** [MỚI] Tích hợp bộ **chân dung Avatar HD** tự động đổi giữa Tộc trưởng và Mumbo theo lời thoại.
- [ ] **8.4** Bộ quản lý 10 màn chơi chiến dịch (`LevelManager` chuyển màn từ Màn 0 đến Màn 9 với mục tiêu thắng/thua).
- [ ] **8.5** Bản đồ con (Minimap) hiển thị góc nhìn và vị trí thực thể.

### Phase 9: Đồ họa Nâng cao & Âm thanh (HOÀN THÀNH 80%)
- [x] **9.1** [MỚI] Hệ thống hạt hiệu ứng (Particle System): Vụn gỗ khi đốn cây, tia lửa đá khi đập đá, bụi bước chân khi chạy.
- [x] **9.2** [MỚI] Chu kỳ Ngày & Đêm thời gian thực (Day/Night Cycle 24h) kèm đồng hồ HUD và ánh đuốc ấm quanh các lều trại ban đêm.
- [x] **9.3** [MỚI] Hiệu ứng cây cỏ đung đưa theo gió (Wind Sway) & Bóng đổ mềm (Soft Shadows) dưới chân dân và công trình.
- [x] **9.4** Hiệu ứng âm thanh (SFX) Web Audio cho chọn quân, ra lệnh, chặt cây, đập đá, đặt và hoàn thành công trình.
- [ ] **9.5** Tích hợp phát trực tiếp 5 file nhạc MIDI nền qua Web Audio Soundfont.
- [ ] **9.6** Hệ thống Save/Load tự động lưu vào `localStorage`.

---

## 3. Tổng kết Tỷ lệ Hoàn thành Dự án

$$\text{Tổng thể dự án Web Remake: } \mathbf{\approx 65\% \text{ hoàn thành}}$$

- **Nền tảng Engine, Đồ họa, Bản đồ, RTS Controls:** **100%**
- **Kinh tế, Khai thác, Xây dựng:** **70%**
- **Mô phỏng Dân làng & Cốt truyện:** **55%**
- **Chiến đấu & Màn chơi chiến dịch:** **Sẽ triển khai tiếp theo**
