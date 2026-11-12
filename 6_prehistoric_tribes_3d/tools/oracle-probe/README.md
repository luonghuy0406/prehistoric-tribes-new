# oracle-probe — thăm dò engine gốc `ptCore.js` (T0)

Script Playwright thay `src/main.tsx` của `5_prehistoric_tribes_react` bằng module tối giản, mount engine và gán `window.__ctrl`, rồi chạy đoạn JS truyền vào với các biến `c` (controller), `g` (game), `sleep`, `info`.

```bash
# terminal 1
cd ../../../5_prehistoric_tribes_react && npx vite --port 5199 --strictPort
# terminal 2 (cần playwright-core@1.55.0 + browser đã cài trong ~/Library/Caches/ms-playwright)
npm i playwright-core@1.55.0
node probe.mjs inspect          # liệt kê enums + field của game
node probe.mjs meta.js          # cấu trúc SoA units/buildings/animals/objects, tribeStats
node probe.mjs compare-live.js  # vào Level 0, pause, chạy loop thật 53 tick, in hash từng field
node probe.mjs compare-cam.js   # như trên nhưng dời camera 1 ô
```
Đây là bản thăm dò, T2 sẽ biến nó thành harness oracle thật (seed, chuỗi lệnh, dump golden JSON).
