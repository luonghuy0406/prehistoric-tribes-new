# 14 — Đánh giá 2 ảnh tù trưởng mới (`1new.webp`, `2new.webp`)

Kiểm tra bằng mắt từng ô (gắn nhãn theo spec lên ảnh). Cả hai ảnh 1254×1254, lưới 10×10, **ô 125 px, nhân vật cao ~105 px** (các sheet cũ H1/CH2/CH3 cao ~200 px → độ nét thấp hơn; vẫn đủ khi vẽ ~116 px trong game, mờ khi zoom sát).
**Bảng metadata JSON bạn dán KHÔNG khớp nội dung ảnh** (số khung mỗi pose lệch), nên mình cắt theo nội dung thực.

## Ảnh 1 (`1new.webp`) — dùng được một phần
Phát hiện đủ 100/100 ô. Số khung thực khác spec:
| Hàng | Thực tế |
|---|---|
| R3 | `walk_N` chỉ 3 khung (c1–3); fidget c4–5; sit_down c6–7; **sit_rest 2 khung (c8–9)**; stand_N c10 |
| R6 | `melee_E` 4 khung (c1–4) — vung **đá buộc dây (kiểu ná)**, không giống đánh cận chiến; `melee_S` 3 khung (c5–7) toàn dáng **ngồi xổm giống nhau**, không có đòn; `trapped` 3 khung (c8–10) |
| R7 | `throw_E` 5 khung (c1–5); chop 2 khung; mine 3 khung |
| R10 | `carry_E` c5–c8 (4 khung; c4 là tư thế khác), `chat_S` 2 khung (c9–10) |

**Dính vật thể (vi phạm quy tắc "chỉ vẽ nhân vật") — KHÔNG nhập:** chặt gỗ (vẽ gốc cây), đào đá (đống đá), xây (cọc có ngọn nến), hái (bụi quả), mổ thú (xác thú), nấu (nồi), câu cá (nước + cá), dính bẫy (lưới), nhặt hàng (tảng đá).
**Yếu:** đánh cận chiến (xem trên), `putdown` (đứng thẳng, không cúi), `look` (tay che mắt).
**Đã nhập (sạch):** `stab_E` (2), `carry_E` (4), `sneak_E` (4), `hide_S` (3, bụi lá che người), `peek_S` (1), `chat_S` (2) bằng `tools/slice_chief_new.py` (có lọc mảnh thừa của ô bên cạnh). Các tư thế còn lại giữ bộ H1/CH2/CH3 cũ (nét hơn, sạch vật thể).

## Ảnh 2 (`2new.webp`) — không dùng được
Không theo bố cục: **không có hướng quay lưng (N) hay chéo (NE/SE) thật**; hầu hết ô là dáng nhìn thẳng/ngồi xổm lặp lại (nhiều ô ngồi ăn thịt), `melee_*` thực chất là đứng đưa tay/giơ nắm đấm, `throw_*`/`chop_*` thực chất là giơ rìu/búa/giáo, hàng 5–10 gần như toàn ngồi cầm giỏ/thịt/nồi. Một số ô dính nồi, cá. → Không thể gán đúng pose/hướng; không nhập gì.

## Vì sao và nên làm gì tiếp
Một ảnh 100 ô (đặc biệt có yêu cầu hướng) vượt khả năng giữ bố cục của model; càng nhiều ô càng trôi và tự thêm vật thể. Đề xuất (mình viết prompt khi bạn đồng ý):
1. **Mỗi hàng = một hướng, mỗi cột = một hành động** (ví dụ 9 cột × 5 hàng: melee×4 | throw×3 | stab×2 cho 5 hướng S/SE/E/NE/N) — dễ kiểm và dễ sửa từng hàng.
2. Mỗi ảnh ≤ 45–50 ô, quy tắc "KHÔNG vẽ vật thể" đặt cả đầu lẫn cuối prompt, kèm câu kiểm tra: *"the background must contain nothing but flat green"*.
3. Làm lại riêng các tư thế đang thiếu/hỏng: **chặt gỗ, đào đá, xây, hái, mổ, nấu, câu cá, bẫy, đánh cận chiến** (không vật thể) và các hướng N/NE/SE của đánh/ném.
