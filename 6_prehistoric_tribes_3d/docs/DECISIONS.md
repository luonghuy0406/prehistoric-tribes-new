# DECISIONS — nhật ký quyết định (agent chỉ thêm, không xoá)

| ID | Câu hỏi | Trạng thái | Quyết định / ghi chú |
|---|---|---|---|
| D-01 | Nguồn asset 3D | **ĐÃ CHỐT (2026-11-12, người dùng)** | Gemini tạo ảnh tham chiếu/texture/UI theo `04_GEMINI_ASSET_PROMPTS.md` → image-to-3D → `.glb`. Thiếu asset thì fallback billboard sprite gốc. |
| D-02 | three thuần hay React Three Fiber | Đề xuất R3F | |
| D-03 | Sim: viết lại TS (đề xuất) hay chạy oracle ptCore trong Worker lâu dài | Đề xuất viết lại, dùng oracle làm dự phòng | |
| D-04 | Có đổi cân bằng gameplay so với gốc không | Mặc định KHÔNG (v1) | |
| D-05 | Phong cách đồ hoạ | Đề xuất (chờ xác nhận) | Stylized cartoon, hand-painted texture, low-poly game-ready (theo GLOBAL STYLE trong `04_GEMINI_ASSET_PROMPTS.md`) |
| D-06 | Camera: cố định góc iso như gốc hay xoay tự do | Đề xuất xoay tự do + nút reset góc iso | |
| D-07 | Làm 3D ngay hay 2D trước | **ĐÃ CHỐT (2026-11-12, người dùng)** | **2D HD trước** để kiểm thử (chi phí 3D quá cao). 3D (T6–T9b, `04_GEMINI_ASSET_PROMPTS.md`) hoãn lại. |
| D-08 | Phép chiếu 2D | Đề xuất (Claude) | Giữ đúng lưới gốc: **lưới chữ nhật, góc nhìn nghiêng 3/4 từ trên xuống** (engine: `x = col*22`, `y = row*16`, không phải iso kim cương). Đồ hoạ HD phóng ×4 → **88×64 px/ô**. |
| D-09 | Sim cho bản 2D | Đề xuất (Claude) | Chạy sim engine gốc (`ptCore`) qua adapter, renderer PixiJS + HUD React mới đọc state. Sim TS (T3–T5) làm sau. |
