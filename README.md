# Prehistoric Tribes – Reverse Engineering & Web Remake Repository

Chào mừng bạn đến với kho lưu trữ dự án dịch ngược và tái phát triển game **Prehistoric Tribes** (nguyên bản Java J2ME $240 \times 320$, phát hành bởi THQ Wireless, phát triển bởi Gear Games 2007–2008) thành phiên bản **Modern 2D Web Remake**.

---

## 📁 Cấu trúc Không gian làm việc (Workspace Architecture)

Không gian làm việc đã được tái cấu trúc thành 3 phân vùng rõ ràng, chuyên biệt:

```
revert_engeneering_game/
│
├── 1_reverse_engineering/              # [KHO LƯU TRỮ GỐC & DỊCH NGƯỢC]
│   ├── original_jar/                   # Tệp JAR nguyên bản (Prehistoric_Tribes_...jar)
│   ├── tools/                          # Bộ công cụ dịch ngược (cfr.jar decompiler)
│   ├── extracted/                      # Toàn bộ tệp trích xuất từ JAR (META-INF, class, text, data)
│   ├── decompiled/
│   │   ├── raw/                        # Mã nguồn Java CFR dịch ngược gốc
│   │   └── deobfuscated/               # Mã nguồn Java đã khử trùng lặp biến (--renamedupmembers)
│   └── assets/                         # Đồ họa trích xuất (PNG), 5 bản nhạc MIDI, 10 map binary (.bin)
│
├── 2_documentation/                    # [HỆ THỐNG TÀI LIỆU NGHIÊN CỨU & CHECKLIST]
│   ├── CHECKLIST.md                    # Bản Checklist chi tiết từng Phase & kiến trúc Web
│   ├── plan.md                         # Kế hoạch điều tra dịch ngược ban đầu
│   ├── PREHISTORIC_TRIBES_RESEARCH.md  # Mục lục nghiên cứu tổng thể & Evidence Matrix
│   ├── 01_initial_inspection/          # Báo cáo Phase 1: Giám định JAR & Entry Point
│   ├── 02_assets/                      # Báo cáo Phase 2: Danh mục tài nguyên & Format nhị phân
│   ├── 03_code_analysis/               # Báo cáo Phase 3: Phân tích kiến trúc mã nguồn & Toán Isometric
│   ├── 04_narrative/                   # Báo cáo Phase 4: Cốt truyện bộ tộc Avnotaklu & Kịch bản 10 màn
│   ├── 05_gameplay/                    # Báo cáo Phase 5: Hệ thống kinh tế, dân làng, nhu cầu, chiến đấu
│   └── 06_runtime_validation/          # Báo cáo Phase 6: Đặc tả kỹ thuật bản Web Remake
│
└── 3_web_game/                         # [MÃ NGUỒN GAME WEB MỚI]
    ├── index.html                      # Điểm khởi chạy Canvas và giao diện Web
    ├── package.json                    # Cấu hình dự án (Vite, TypeScript)
    ├── tsconfig.json                   # Cấu hình TypeScript
    ├── vite.config.ts                  # Cấu hình bundler Vite
    ├── public/
    │   └── assets/
    │       ├── images/                 # pi0.png (UI), pi8.png (banner), pi9.png (dân), l0-l3, icon
    │       ├── audio/                  # 5 bản nhạc MIDI gốc (music_0 đến music_4)
    │       ├── maps/                   # 10 tệp nhị phân bản đồ (00_outside.bin đến 09_plot_of_land.bin)
    │       └── data/                   # strings_en.json, descriptions_en.json, campaign_en.json
    └── src/
        ├── main.ts                     # Entry script khởi tạo game
        ├── core/                       # GameLoop, Camera, IsometricMath, EventBus
        ├── simulation/                 # Vòng lặp mô phỏng dân làng, nhu cầu, kinh tế
        ├── renderer/                   # Bộ vẽ bản đồ Isometric, Sprite nhân vật, Y-sorting
        ├── input/                      # Điều khiển chuột hiện đại (Click, Quét chuột, Context)
        └── ui/                         # HUD tài nguyên, Khung hội thoại kịch bản
```

---

## 🚀 Truy cập nhanh tài liệu

- **Xem Checklist tiến độ:** [2_documentation/CHECKLIST.md](file:///Users/huynguyen/Documents/revert_engeneering_game/2_documentation/CHECKLIST.md)
- **Xem Báo cáo nghiên cứu tổng thể:** [2_documentation/PREHISTORIC_TRIBES_RESEARCH.md](file:///Users/huynguyen/Documents/revert_engeneering_game/2_documentation/PREHISTORIC_TRIBES_RESEARCH.md)
- **Mã nguồn game Web:** [3_web_game/](file:///Users/huynguyen/Documents/revert_engeneering_game/3_web_game/)
