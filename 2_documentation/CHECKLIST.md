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
├── view_sprites.html                    # [MỚI] Bộ sưu tập trực quan 45 sprite sheets gốc
├── public/                              # Static Game Assets
│   └── assets/
│       ├── images/
│       │   ├── original_sprites/        # [MỚI] 45 tệp PNG sprite bóc tách từ pi0, pi8, pi9
│       │   │   ├── pi0_00.png ... pi0_26.png  # Buildings, Flora, Fauna, Tools, UI
│       │   │   ├── pi8_00.png ... pi8_11.png  # Level Terrains (10 màn chiến dịch)
│       │   │   └── pi9_00.png ... pi9_05.png  # Unit Spritesheets (Dân làng 8 hướng)
│       │   ├── portrait_chief.jpg       # Chân dung HD Tộc trưởng (Chief)
│       │   ├── portrait_mumbo.jpg       # Chân dung HD Mumbo
│       │   ├── building_hut.jpg         # Lều tranh tiền sử
│       │   ├── nature_fruit_bush.jpg    # Bụi cây ăn quả
│       │   └── animal_mammoth.jpg       # Voi Ma mút tiền sử
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
│           ├── strings_en.json          # Parsed from 0/s (229 UI strings)
│           ├── descriptions_en.json     # Parsed from 0/t (72 Tooltips)
│           ├── campaign_en.json         # Parsed from 0/d0 (236 Dialogues)
│           └── sprites.json             # [MỚI] 1,810 tọa độ lát cắt sprite giải mã từ pd0
│
└── src/                                 # Source Code Engine & Simulation
    ├── main.js                          # Bootstrap, Game Loop, Input Routing & State
    ├── core/
    │   ├── IsometricMath.js             # Tọa độ chiếu nghiêng 2:1 (44x32 diamond) & 8 hướng
    │   ├── Camera.js                    # Pan, Zoom (1x-4x), World <-> Screen conversions
    │   └── DayNightCycle.js             # Chu kỳ Ngày/Đêm 24h & Ánh sáng đuốc ấm ban đêm
    ├── loaders/
    │   └── BinaryMapLoader.js           # Bộ giải mã RLE tệp bản đồ nhị phân (.bin)
    ├── simulation/
    │   ├── Villager.js                  # Dân làng: Máu, Đói, Mệt, Hạnh phúc, FSM di chuyển & Nhu cầu
    │   ├── Building.js                  # 12 Công trình: Chi phí, Tiến độ thi công, Sức chứa
    │   ├── Animal.js                    # Động vật: Ma mút, Heo rừng, Hổ răng kiếm, AI tuần tra, Máu, Xác thịt
    │   └── ResourceNode.js              # Tài nguyên tái sinh: Bụi dâu quả (Berries), Chu kỳ mọc lại
    └── renderer/
        ├── TilemapRenderer.js           # Đồ họa địa hình 3D gradient, nước gợn sóng, cây rung rinh theo gió
        ├── SpriteRenderer.js            # Vẽ dân làng, cầm công cụ (rìu/búa/giáo/giỏ hàng), bong bóng suy nghĩ
        ├── BuildingRenderer.js          # Vẽ 2.5D Nhà Tộc trưởng (ngà voi + lửa trại), Lều, Kho, Bếp, Vũ trường
        ├── WildlifeRenderer.js          # Vẽ bụi dâu trĩu quả, Ma mút ngà cong, Heo rừng, Hổ kiếm, Xác mổ thịt
        └── ParticleSystem.js            # Vụn gỗ, tia lửa đá, bụi bước chân, khói lửa, chữ số nổi (+5 Food, -15 HP)
```

---

## 2. Master Checklist Triển Khai (Cập nhật Tiến độ Thực tế)

### Phase 1: Setup Dự Án & Asset Pipeline (HOÀN THÀNH 100%)
- [x] **1.1** Khởi tạo project với cấu trúc thư mục chuẩn ES6 Modules & TypeScript.
- [x] **1.2** Copy toàn bộ assets nguyên bản (`1_reverse_engineering/assets/`) vào `3_web_game/public/assets/`.
- [x] **1.3** Chuyển đổi dữ liệu chuỗi `0/s`, `0/t`, `0/d0` sang định dạng JSON (`strings_en.json`, `descriptions_en.json`, `campaign_en.json`).
- [x] **1.4** Giải mã toàn bộ định dạng đóng gói nối dài (45 ảnh PNG gốc từ `pi0`, `pi8`, `pi9` + 1,810 tọa độ `pd0` vào `sprites.json`).
- [x] **1.5** [MỚI] Hoàn thiện bộ đồ họa 2D Flat-Cartoon HD đồng bộ (`AssetManager.js`):
  - Tích hợp 24 props gói `PrehistoricDinosaurJungle2DMegaPropsPack_Sample_v1.0` vào `sample_pack/`.
  - Tách nền RGBA trong suốt toàn bộ 72+ sprites vào `sprites_hd/`: 4 hướng nhân vật (Front + Back + Work/Attack), 12 công trình làng & nâng cấp, 3 loài thú săn (Front + Back + Attack), 4 ô gạch Isometric 3D (Cỏ sỏi, Cỏ hoa, Đường đất, Nước), trạng thái cạn kiệt (bụi trụi quả, gốc cây cụt, đá vỡ, xác thịt) & bộ UI Kit đá/gỗ.

### Phase 2: Isometric Engine & Map Renderer (HOÀN THÀNH 100%)
- [x] **2.1** Cài đặt `IsometricMath.js`: $\text{screenX} = (x - y) \times 22, \quad \text{screenY} = (x + y) \times 16$.
- [x] **2.2** Xây dựng `BinaryMapLoader.js`: Giải mã RLE các file `.bin` trong `public/assets/maps/`.
- [x] **2.3** Cài đặt `TilemapRenderer.js`:
  - Render 4 khối địa hình Isometric 3D vẽ tay (`tile_iso_grass_pebbles`, `tile_iso_grass_flowers`, `tile_iso_dirt_trail`, `tile_iso_water`) xếp lớp back-to-front khớp pixel.
  - Rừng thông/cọ đung đưa trong gió (`Wind Sway`), mỏ đá tảng & cụm tinh thể.
  - Biến đổi địa hình thực tế: Cây chặt hết hóa **Gốc cây cụt (`node_tree_stump`)**, đá đào hết hóa **Đá vụn (`node_stone_depleted`)**, kèm cảnh quan thác nước, hồ sen, cầu gỗ, núi lửa, hóa thạch.
- [x] **2.4** Cài đặt `Camera.js`: Hỗ trợ kéo bản đồ (chuột giữa / WASD / phím mũi tên) và cuộn chuột thu phóng (Zoom 1x - 4x).

### Phase 3: Nhân vật, Hoạt ảnh 8 Hướng, Chiến binh & Chiến đấu (HOÀN THÀNH 100%)
- [x] **3.1** Hệ thống **135 sprite nhân vật HD** trải đều trên **6 vai trò nhân vật** (Dân Nam, Dân Nữ, **Chiến binh thăng hạng**, Tộc trưởng, Trẻ em, Quân Ăn thịt người):
  - **Đủ 8 hướng Isometric thực thụ**: Chính Nam (`south`), Chính Bắc (`north`), Chéo trước SE/SW (`diag_front` + `flipX`), Chéo sau NE/NW (`diag_back` + `flipX`), kèm tư thế làm việc/khuân vác xoay lưng (`back_chop`, `back_mine`, `back_hunt`, `back_fight`, `back_carry`, `back_play`, `north_combat`).
  - **Nhân vật Chiến binh (`isWarrior`) & Trung tâm Đào tạo (`Training Ground` / `gym`)**: Dân thường tập luyện càng lâu tại Trung tâm Đào tạo sẽ thăng hạng **1★ $\rightarrow$ 2★ $\rightarrow$ 3★ (tối đa 3 sao)** hiển thị trên đầu; sở hữu 28 sprite chiến binh riêng + đường đạn bay (`proj_javelin`, `proj_arrow`), 3 kỹ năng đặc thù: **Phi lao** (`javelin`), **Bắn cung** (`bow`), và **Trinh sát ẩn thân bằng cây cỏ** (`stealth` với 4 góc ngụy trang lá cây + sát thương đánh lén `Ambush Crit`).
  - **Đầy đủ hành động chuyên biệt**: `idle`, `walking` (nhiều nhịp bước), `chopping`, `mining`, `foraging`, `carrying`, `fishing`, `praying`, `crafting`, `tending`, `training`, `hunting`, `fighting`, `throw`, `bow`, `stealth`, `command`, `rallying`, `building`, `eating`, `sleeping`, `relaxing`, `cheer`, `hurt`, `defeated`, `playing`, `breeding`, `hungry`, `tired`.
- [x] **3.2** Hiển thị giỏ hàng & icon tài nguyên mang vác, bong bóng suy nghĩ (icon Thịt khi đói, `Zzz` khi ngủ/mệt).
- [ ] **3.3** Cài đặt thuật toán tìm đường **A\* trên lưới Isometric**, tự động né chướng ngại vật phức tạp.
- [x] **3.4** Sắp xếp chiều sâu thống nhất (Unified $Y$-Sorting) giữa cây, đá, công trình, bụi quả, thú, quân địch và dân làng.

### Phase 4: Điều khiển Chuột Hiện đại RTS (HOÀN THÀNH 100%)
- [x] **4.1** **Chuột trái**: Click chọn 1 dân làng, giữ `Shift` để chọn thêm, hoặc click chọn Công trình (`Building Inspector` xem HP, cấp độ, thợ phụ trách, rèn vũ khí/bẫy, niệm phép).
- [x] **4.2** **Quét chuột (Box Selection) & Đội hình `[7]` / `[9]`**: Kéo chuột khoanh khung xanh chọn nhiều quân cùng lúc; bấm `Shift+7` / `Shift+9` (hoặc nút trên HUD) lưu tổ đội, bấm `7`/`9` để chọn & nhảy camera; `[G]` Form Up, `[C]` Call to Arms.
- [x] **4.3** **Chuột phải thông minh (Context Action)**:
  - Click vào cây $\rightarrow$ Ra lệnh đốn gỗ tự động.
  - Click vào tảng đá (`OCC.STONE`) $\rightarrow$ Ra lệnh khai thác đá tự động.
  - Click vào bụi dâu / thảo mộc $\rightarrow$ Ra lệnh hái quả tự động.
  - Click vào Hồ sen / Bến câu (`Pond` / `Fishing Pier`) $\rightarrow$ Ra lệnh câu cá (`fishing`) và tự vận chuyển về kho.
  - Click vào động vật / Quân địch / Nhà địch $\rightarrow$ Ra lệnh săn bắn, giao chiến hoặc công phá công trình (kể cả phá Lều Giam giải cứu ở màn *Escape*).
  - Click vào công trình $\rightarrow$ Xây dựng/nâng cấp/sửa chữa (nếu đang thi công) hoặc Ăn (`kitchen`), Ngủ (`hut`), Khiêu vũ (`disco`), Cầu nguyện (`sanctuary`), Rèn (`armoury`), Trông trẻ (`nursery`), Gác tháp (`tower`), Huấn luyện (`gym`/`range`/`pia_center`).
  - Click đất trống $\rightarrow$ Di chuyển đội hình 8 hướng mượt mà.
- [x] **4.4** Phím tắt & Tiện ích: `Space` (về Tộc trưởng), `WASD`/Mũi tên (cuộn map), `V` (Danh sách dân làng), `M` (Nhạc nền), `1` (Nhảy tới cảnh báo), `F` (Ẩn thân), `Esc`/`P` (Pause/Menu), cùng mã cheat `87391 + 1/3/7/9`.

### Phase 5: Động vật, Cây trái & Săn bắn (HOÀN THÀNH 85%)
- [x] **5.1** Hệ sinh thái động vật hoang dã tiền sử (`Animal.js` & `WildlifeRenderer.js`):
  - **Voi Ma mút (Woolly Mammoth)**: Thân hình đồ sộ lông rậm rạp, đôi ngà cong vuốt bằng ngà voi, vòi đung đưa, bước chân nặng nề, 160 HP, rơi 120 Thịt và 40 Xương.
  - **Heo rừng (Wild Boar)**: Lông bờm nhọn hoắt, ngà trắng cong, di chuyển đánh hơi củ rễ, 40 HP, rơi 35 Thịt và 10 Xương.
  - **Hổ răng kiếm (Sabertooth Tiger)**: Cơ bắp vàng sọc hổ, đôi răng kiếm dài nhọn hoắt, rình mồi hung dữ, 70 HP, rơi 50 Thịt và 25 Xương.
- [x] **5.2** Cơ chế chiến đấu & Xẻ thịt:
  - Dân làng tiếp cận đâm giáo, gây sát thương, hiện chữ số mất máu màu đỏ (`-16 HP`), tóe tia lửa đá.
  - Thú chết ngã xuống biến thành **Xác thịt & Xương sườn (`🥩 Carcass`)**.
  - Dân làng xẻ thịt mang về kho, tích lũy tài nguyên Thức ăn (Food) và Xương (Bones).
- [x] **5.3** Bụi cây ăn quả (Berry Bushes):
  - Bụi dâu sum suê trĩu quả mọng đỏ/tím có điểm sáng phản chiếu.
  - Dân làng đến hái từng đợt `+5 Berries`, khi cạn kiệt sẽ hiện thanh tiến độ mọc lại (`Regrowing...`) sau 45 giây.

### Phase 6: Kinh tế Vòng lặp & Xây dựng (HOÀN THÀNH 85%)
- [x] **6.1** Quản lý 4 tài nguyên toàn cục: Gỗ (Wood), Đá (Stone), Thức ăn (Food), Xương (Bones) kèm tiêu hao lương thực theo thời gian.
- [x] **6.2** Hệ thống xây dựng 2.5D sắc nét:
  - **Nhà Tộc trưởng (`chiefs_hut`)**: Đại lều da bò mộng, vòm cổng bằng ngà voi ma mút, lửa trại bập bùng trước cửa, cờ đỏ tộc trưởng tung bay.
  - **Lều ở (`hut`)**: Mái rơm hình nón đan dây thừng, tường trát đất sét nung, cửa phát ánh đuốc ấm, $+4$ chỗ ở dân số.
  - **Nhà kho (`store`)**: Nền sàn gỗ dựng trên cọc cao chống ẩm, mái che lợp tranh, thùng gỗ, rổ dâu và đá chất đống.
  - **Nhà bếp (`kitchen`)**: Bếp lò đá xếp, lửa đỏ rực rỡ, thịt heo quay xiên que đang xèo xèo bốc khói, nồi đất hầm canh.
  - **Vũ trường (`disco`)**: Vòng tròn khiêu vũ bằng đá, 4 cột vật tổ Tiki đốt đuốc sáng rực, đống lửa hồng bùng cháy.
- [x] **6.3** Xem trước vị trí đặt (Ghost Preview): Lưới gạch Isometric xanh khi hợp lệ, đỏ khi vướng công trình hoặc thiếu tài nguyên.
- [x] **6.4** Thi công công trình: Dàn giáo gỗ, thanh giằng dây thừng, thanh tiến độ $0\% \rightarrow 100\%$ và vụn gỗ bắn ra khi gõ búa.
- [x] **6.5** **Vòng lặp vận chuyển tự động (Carrier Loop)**: Khi đầy tải (15 đơn vị), dân tự động chạy về Nhà kho hoặc Nhà Tộc trưởng gần nhất để nạp, hiện chữ số nổi `+15 Deposited!`, sau đó **tự động quay lại đúng mỏ/cây vừa làm** để tiếp tục làm việc mà không cần bấm lại!

### Phase 7: Đời sống, Sinh sản, Trẻ em & Kỹ năng (HOÀN THÀNH 90%)
- [x] **7.1** Hệ thống 4 chỉ số sinh tồn: Máu (HP), Đói (Hunger), Mệt mỏi (Tiredness), Hạnh phúc (Happiness).
- [x] **7.2** Tự động & Ra lệnh trực tiếp nhu cầu sinh hoạt + hành động đặc thù (qua chuột phải hoặc bảng `Inspector`):
  - **Ăn (`eating`)**: Đói $> 78\%$ hoặc chuột phải Nhà Bếp / nút `Eat` $\rightarrow$ Ngồi ăn thịt/quả, xóa đói về $0\%$.
  - **Ngủ (`sleeping`)**: Mệt $> 84\%$ hoặc chuột phải Lều / nút `Sleep` $\rightarrow$ Nằm ngủ trên thảm da thú, hồi năng lượng và máu.
  - **Thư giãn (`relaxing`)**: Hạnh phúc giảm hoặc chuột phải Vũ trường (Disco) / nút `Dance` $\rightarrow$ Nhảy múa ăn mừng hồi 100% Hạnh phúc.
  - **Câu cá (`fishing`), Cầu nguyện (`praying`), Rèn vũ khí (`crafting`), Trông trẻ (`tending`), Ra lệnh (`command`)**: Thao tác qua chuột phải vào địa danh/công trình tương ứng hoặc nút nhanh trên `Inspector`, có vòng lặp vận chuyển cá về kho và hiệu ứng ăn mừng/trúng đòn (`cheer` / `hurt`).
- [x] **7.3** **Sinh sản ("Tent-time") & Nhân vật Trẻ em (`isChild`)**:
  - Đôi nam nữ đủ điều kiện + còn chỗ lều tự động (hoặc bấm nút `Tent-time`) vào Lều sinh em bé (hiện cũi em bé + trái tim) với tên tiền sử trích từ `NameDatabase.js` (`strings_en.json`).
  - Trẻ em có ngoại hình & animation riêng (`idle`, `walk`, `back_walk`, `play`, `eat`, `sleep`, `relax`), chơi quanh Nhà trẻ (`Nursery`), hiện thanh `%` lớn lên và **trưởng thành thành dân làng chính thức** ở $100\%$.
- [x] **7.4** **Hiệu triệu chiến đấu (`Call to Arms` [C]) & Hào quang Tộc trưởng**: Tộc trưởng thổi tù và (`rallying`), tăng $+25\%$ tốc độ & sát thương cho dân xung quanh, huy động toàn làng đánh quân Ăn thịt người.
- [x] **7.5** Hệ thống XP & Kỹ năng chuyên biệt (`Woodcutting`, `Mining`, `Foraging`, `Hunting`, `Building`, `Combat`) tăng cấp theo thực chiến.

### Phase 8: Giao diện (HUD), Cốt truyện & Màn chơi (HOÀN THÀNH 100%)
- [x] **8.1** Thanh tài nguyên Top HUD hiển thị tên Màn chơi, Mục tiêu, `Food (+Meals)`, `Wood`, `Stone`, `Bones`, `Pop / MaxLivingSpace`, đồng hồ Ngày/Đêm và các nút `Fog`, `Music`, `Dân [V]`, `Pause`.
- [x] **8.2** Thanh Build Dock đầy đủ **11 công trình xây dựng** (`Hut`, `Store`, `Kitchen`, `Armoury`, `Gym`, `Range`, `Sanctuary`, `PIA`, `Disco`, `Nursery`, `Tower`) theo đúng thông số gốc + nâng cấp Lv1–Lv3, sửa chữa, phá bỏ.
- [x] **8.3** Đầy đủ các màn hình & trạng thái (`OverlayManager.js`): Main Menu, Chọn Chương (0–6), Custom Maps (1–5), Tùy Chọn (`Easy`/`Hard`, Music, Fog), Codex Hướng Dẫn, About, Pause/Save/Load, Cutscene Cốt truyện, Bầu Tù Trưởng Kế Vị khi Chief tử trận, Danh sách Dân làng `[V]` và Bảng Điểm Results chuẩn gốc.
- [x] **8.4** Quản lý toàn bộ **12 màn chơi chuẩn RLE** từ 10 file nhị phân `00_outside.bin .. 09_plot_of_land.bin` (`BinaryMapLoader.js` dùng `MAP_RUN_LENGTHS`, crop chuẩn *Tutorial 40×32* và *A New Home 64×96*, kèm AI địch `AISystems.js` đánh raid theo độ khó Easy/Hard).
- [x] **8.5** Bản đồ thu nhỏ Isometric tương tác (`MinimapRenderer.js` click/drag cuộn camera) kết hợp Sương mù chiến tranh (Fog of War 3 trạng thái) & Cảnh báo nhảy nhanh `[1]`.

### Phase 9: Đồ họa Nâng cao, Phép Thuật, Bẫy & Âm thanh (HOÀN THÀNH 98%)
- [x] **9.1** Hệ thống hạt hiệu ứng cao cấp (`ParticleSystem.js`):
  - Vụn gỗ, tia lửa đá, bụi bước chân, vòng hào quang Giáp hộ mệnh (`Defence`), vầng Dịch bệnh 3×3 (`Disease`), Bẫy lưới/lò xo/hố chông (`Trap`) và **Chữ số nổi** chiến đấu/tài nguyên.
- [x] **9.2** Chu kỳ Ngày & Đêm 24h (`DayNightCycle.js`) + Ánh sáng đuốc lửa công trình + Tint sinh thái từng vùng (`Lush`, `Jungle`, `Wastelands`, `Desert`).
- [x] **9.3** Hệ thống Âm thanh & Nhạc nền MIDI Web Audio (`SoundEngine.js` + `MidiPlayer.js`): Giải mã trực tiếp **5 bản nhạc `.mid` gốc** (`music_track_0_8014b.mid`..`music_track_4_3234b.mid`) cho các trạng thái `Menu / Calm / Alert & Combat / Victory / Defeat` kèm hiệu ứng SFX đa âm sắc.
- [x] **9.4** Chức năng Save / Load vào `localStorage` (`SaveManager.js`) cho cả Campaign, Custom Game, Điểm kỷ lục và Cài đặt hệ thống.

---

## 3. Tổng kết Tỷ lệ Hoàn thành Dự án

$$\text{Tổng thể dự án Web Remake (Sau làm mới theo bản dịch ngược): } \mathbf{\approx 98\% \text{ hoàn thành}}$$

- **Reverse Engineering Đặc tả & Dữ liệu gốc (`GameData.js` 12 màn, 12 nhà, 9 vũ khí/bẫy, 4 phép):** **100%**
- **Asset Pipeline, 208 tài nguyên HD & 135 Sprite Nhân vật (8 hướng + Chiến binh 3★ + PIA Scout):** **100%**
- **Engine Isometric, Giải mã RLE Map (12/12 màn), Fog of War, Minimap & Ngày/Đêm:** **99%**
- **Xây dựng (Lv1–Lv3), Kinh tế `Food → Meals`, Săn bắn, Bẫy, Phép Shaman & AI Địch (`Easy`/`Hard`):** **98%**
- **Hệ thống Giao diện, Cutscene, Bầu Chief, Squad/Box-Select & Save/Load (`localStorage`):** **100%**
