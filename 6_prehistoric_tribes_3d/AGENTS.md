# AGENTS.md — luật cho coding agent (dự án 6_prehistoric_tribes_3d)

## Bối cảnh
Rebuild *Prehistoric Tribes* thành game 3D web với HUD hiện đại. Bản 2D hiện tại: `../5_prehistoric_tribes_react` (chỉ là vỏ React quanh engine minified `ptCore.js`). Tài liệu luật chơi: `../2_documentation/`. Đọc theo thứ tự: `docs/00_REVIEW_CURRENT_REACT.md` → `01_REBUILD_PLAN.md` → `02_TASKS.md` → `03_UI_UX_SPEC.md` → `DECISIONS.md`.

## Quy trình
1. Chọn 1 task `TODO` có Depends đã `DONE` trong `docs/02_TASKS.md`; đặt `DOING(tên-agent)` và commit riêng thay đổi đó.
2. Làm việc trên nhánh `feat/<task-id>-<slug>`; commit nhỏ, message `T4: needs system`.
3. Hoàn thành khi đạt đủ *Acceptance*; chạy `npm run lint && npm test` (và e2e nếu task đụng UI/3D); chuyển `REVIEW`, ghi tóm tắt + cách kiểm chứng vào `docs/NOTES.md`.
4. Không tự `DONE` việc của mình nếu task yêu cầu duyệt (T10, D-01, D-05).

## Bất biến
- `packages/sim` không import `three`, `react`, DOM. Giao tiếp chỉ qua Command → Snapshot/Event.
- Không sửa `5_prehistoric_tribes_react` và không sửa file gốc/JAR; chỉ đọc làm oracle.
- Không hard-code chuỗi hiển thị; không `any` trong package mới (dùng `unknown` + type guard).
- Sim phải deterministic: RNG seed truyền vào, không `Math.random`/`Date.now`.
- Đổi luật so với bản gốc → ghi `DECISIONS.md`.
- Không thêm dependency nặng khi chưa ghi lý do trong PR/commit.

## Song song hoá giữa nhiều agent
Tách theo package để tránh xung đột: Agent-Sim (T2–T5), Agent-3D (T6–T9b), Agent-UI (T10–T13), Agent-Content (T14–T16). Hợp đồng chung duy nhất: `docs/SIM_API.md` (do T3 tạo) — đổi hợp đồng phải thông báo trong `NOTES.md`.

## Lệnh chuẩn
`npm i` · `npm test` · `npm run typecheck` · `npm run lint` (sau này: `npm run dev -w apps/web`, `npm run e2e`).
Nếu `npm i` báo EACCES ở `~/.npm` (cache có file root): dùng `npm i --cache <thư-mục-tạm>`, không dùng sudo.
Dữ liệu gốc đã copy vào `assets/original/res/` (không sửa tay; nguồn: `5_prehistoric_tribes_react/public/res`).
