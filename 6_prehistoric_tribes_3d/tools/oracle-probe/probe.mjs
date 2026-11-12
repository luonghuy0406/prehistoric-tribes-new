// Probe: mount ptCore headless-ish, expose controller, inspect sim/render coupling.
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://localhost:5199';
const MAIN = `
import { mountPrehistoricTribes } from '/src/engine/ptCore.js';
const app = document.getElementById('root');
app.innerHTML = '<main id="app"><div id="stage"><canvas id="screen" width="240" height="320"></canvas></div></main>';
const noop = () => {};
window.__ctrl = await mountPrehistoricTribes({
  appEl: document.getElementById('app'),
  stageEl: document.getElementById('stage'),
  canvasEl: document.getElementById('screen'),
  baseUrl: './',
  overlayHandlers: { showLoading: noop, showStatus: noop, hide: noop, notice: noop, showError: (t,e)=>console.error('ENGINE', t, e) },
});
window.__ready = true;
`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 480, height: 640 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.route('**/src/main.tsx', (r) => r.fulfill({ contentType: 'application/javascript', body: MAIN }));
await page.goto(BASE);
await page.waitForFunction(() => window.__ready, null, { timeout: 30000 });

import fs from 'node:fs';
const step = process.argv[2] === 'inspect' ? 'inspect' : fs.readFileSync(process.argv[2], 'utf8');
const out = await page.evaluate(async (step) => {
  const c = window.__ctrl; const g = c.game;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const info = () => ({ gameState: g.gameState, screen: g.screen, level: g.level, tick: g.gameTick, cursor: g.menuCursor });
  if (step === 'inspect') {
    await sleep(3000);
    return {
      info: info(),
      enumsO: c.enums.O, enumsZ: c.enums.z, ui: c.enums.ui,
      gameKeys: Object.keys(g).slice(0, 400),
      simKeys: g.simulation ? Object.keys(g.simulation) : null,
      loopKeys: Object.keys(c.loop || {}),
      frameDelay: g.normalFrameDelay,
    };
  }
  const fn = new Function('c','g','sleep','info', 'return (async()=>{' + step + '})()');
  return await fn(c, g, sleep, info);
}, step);
console.log(JSON.stringify({ out, errors }, null, 1));
await browser.close();
