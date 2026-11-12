# e2e — kiểm thử cử chỉ thật (Playwright)

```bash
npm run dev                         # terminal 1 (http://localhost:5180)
npm i --no-save playwright-core@1.55.0   # cần Chromium của Playwright đã cài
node tools/e2e/controls.e2e.mjs /tmp/shots   # in JSON kết quả + ảnh chụp vào thư mục
```
Kỳ vọng: `d_select` có 1 dân, `d_job` = 2 (tiều phu), `d_built`/`m_built` tăng 1, `d_box` ≥ 2, `d_callToArms` = true, `*_errors` rỗng.
