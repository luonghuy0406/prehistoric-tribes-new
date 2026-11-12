import { chromium } from 'playwright-core';
const OUT = process.argv[2];
const browser = await chromium.launch({ headless: true });
const results = {};
async function boot(ctxOpts) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror ' + String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  await page.goto('http://localhost:5180/');
  await page.waitForFunction(() => window.__pt && window.__pt.adapter.tick > 3, null, { timeout: 30000 });
  return { ctx, page, errors };
}
// screen position of a unit / tile under current camera
const unitScreen = (page, id) => page.evaluate((id) => { const { adapter: a, renderer: r } = window.__pt; const v = a.world; const wx = (v.units.x[id]*22 + v.units.offsetX[id])*4 + 44, wy = (v.units.y[id]*16 + v.units.offsetY[id])*4 + 32 - 24; return r.camera.toScreen(wx, wy); }, id);
const tileScreen = (page, tx, ty) => page.evaluate(([tx, ty]) => window.__pt.renderer.camera.toScreen(tx*88 + 44, ty*64 + 32), [tx, ty]);

// ---------------- desktop / mouse ----------------
{
  const { ctx, page, errors } = await boot({ viewport: { width: 1280, height: 800 } });
  await page.evaluate(() => { const { adapter: a, renderer: r } = window.__pt; a.setSpeed(4); r.camera.zoom = 0.8; const v = a.world; r.focusUnit(v.tribeStats[0][17]); });
  await page.waitForTimeout(300);
  // 1) click villager 3
  let p = await unitScreen(page, 3);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(200);
  results.d_select = await page.evaluate(() => window.__pt.adapter.commands.state().selectedUnits);
  results.d_card = await page.locator('.card h3').first().textContent().catch(() => null);
  // 2) right click nearest tree
  const tree = await page.evaluate(() => { const v = window.__pt.adapter.world; const u = 3; let best = null; for (let y = 0; y < v.mapHeight; y++) for (let x = 0; x < v.mapWidth; x++) if (v.occupancy[y][x] === -124) { const d = Math.abs(x - v.units.x[u]) + Math.abs(y - v.units.y[u]); if (!best || d < best.d) best = { x, y, d }; } return best; });
  p = await tileScreen(page, tree.x, tree.y);
  await page.mouse.click(p.x, p.y, { button: 'right' });
  await page.waitForTimeout(4000);
  results.d_job = await page.evaluate(() => ({ job: window.__pt.adapter.world.units.job[3], wood: window.__pt.adapter.world.tribeStats[0][2] }));
  // 3) build a hut via keyboard B + card + click
  await page.keyboard.press('Escape');
  await page.keyboard.press('b');
  await page.waitForTimeout(200);
  results.d_sheet = await page.locator('.build-card').count();
  await page.screenshot({ path: OUT + '/d_build.png' });
  await page.locator('.build-card', { hasText: 'Lều' }).first().click();
  await page.waitForTimeout(200);
  results.d_banner = await page.locator('.banner strong').textContent().catch(() => null);
  const spot = await page.evaluate(() => { const { adapter: a } = window.__pt; const v = a.world; const c = a.commands; const cx = v.units.x[1], cy = v.units.y[1]; for (let r = 2; r < 10; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const p = c.previewAt(cx + dx, cy + dy); if (p && p.valid) return { tx: cx + dx, ty: cy + dy }; } return null; });
  const before = await page.evaluate(() => window.__pt.adapter.world.tribeStats[0][14]);
  p = await tileScreen(page, spot.tx, spot.ty);
  await page.mouse.move(p.x, p.y);
  await page.waitForTimeout(150);
  await page.screenshot({ path: OUT + '/d_ghost.png' });
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(300);
  results.d_built = [before, await page.evaluate(() => window.__pt.adapter.world.tribeStats[0][14])];
  // 4) box select by left-drag around the crowd
  await page.keyboard.press('Escape');
  const a1 = await unitScreen(page, 4); const a2 = await unitScreen(page, 13);
  const xs = [a1.x, a2.x], ys = [a1.y, a2.y];
  await page.mouse.move(Math.min(...xs) - 120, Math.min(...ys) - 120);
  await page.mouse.down();
  await page.mouse.move(Math.max(...xs) + 120, Math.max(...ys) + 120, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  results.d_box = await page.evaluate(() => window.__pt.adapter.commands.state().selectedUnits.length);
  await page.screenshot({ path: OUT + '/d_group.png' });
  // 5) call to arms via C + click
  await page.keyboard.press('c');
  await page.waitForTimeout(100);
  results.d_rallyMode = await page.evaluate(() => window.__pt.adapter.commands.state().placingRally);
  p = await tileScreen(page, spot.tx + 3, spot.ty + 3);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(200);
  results.d_callToArms = await page.evaluate(() => window.__pt.adapter.commands.state().callToArms);
  await page.screenshot({ path: OUT + '/d_rally.png' });
  results.d_errors = errors.slice(0, 5);
  await ctx.close();
}
// ---------------- mobile / touch ----------------
{
  const { ctx, page, errors } = await boot({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  await page.evaluate(() => { const { adapter: a, renderer: r } = window.__pt; r.camera.zoom = 0.7; r.focusUnit(a.world.tribeStats[0][17]); });
  await page.waitForTimeout(300);
  let p = await unitScreen(page, 5);
  await page.touchscreen.tap(p.x, p.y);
  await page.waitForTimeout(250);
  results.m_select = await page.evaluate(() => window.__pt.adapter.commands.state().selectedUnits);
  await page.screenshot({ path: OUT + '/m_select.png' });
  // tap a berry bush / tree to order (tap = context command when selected)
  const tree = await page.evaluate(() => { const v = window.__pt.adapter.world; const u = 5; let best = null; for (let y = 0; y < v.mapHeight; y++) for (let x = 0; x < v.mapWidth; x++) if (v.occupancy[y][x] === -124) { const d = Math.abs(x - v.units.x[u]) + Math.abs(y - v.units.y[u]); if (!best || d < best.d) best = { x, y, d }; } return best; });
  p = await tileScreen(page, tree.x, tree.y);
  await page.touchscreen.tap(p.x, p.y);
  await page.waitForTimeout(300);
  results.m_orderTarget = await page.evaluate(() => [window.__pt.adapter.world.units.targetX[5], window.__pt.adapter.world.units.targetY[5]]);
  results.m_tree = [tree.x, tree.y];
  // build: tap dock Xây, tap card, tap tile (ghost), tap "Xây ở đây"
  await page.locator('.dock-btn', { hasText: 'Huỷ' }).tap().catch(() => {});
  await page.locator('.dock-btn', { hasText: 'Xây' }).first().tap();
  await page.waitForTimeout(200);
  await page.screenshot({ path: OUT + '/m_build.png' });
  await page.locator('.build-card', { hasText: 'Kho' }).first().tap();
  await page.waitForTimeout(200);
  const spot = await page.evaluate(() => { const { adapter: a } = window.__pt; const v = a.world; const c = a.commands; const cx = v.units.x[1], cy = v.units.y[1]; for (let r = 2; r < 10; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const p = c.previewAt(cx + dx, cy + dy); if (p && p.valid) return { tx: cx + dx, ty: cy + dy }; } return null; });
  p = await tileScreen(page, spot.tx, spot.ty);
  await page.touchscreen.tap(p.x, p.y);
  await page.waitForTimeout(250);
  results.m_pending = await page.locator('.banner .action.primary').count();
  await page.screenshot({ path: OUT + '/m_ghost.png' });
  const before = await page.evaluate(() => window.__pt.adapter.world.tribeStats[0][14]);
  await page.locator('.banner .action.primary').tap();
  await page.waitForTimeout(250);
  results.m_built = [before, await page.evaluate(() => window.__pt.adapter.world.tribeStats[0][14])];
  results.m_errors = errors.slice(0, 5);
  await ctx.close();
}
console.log(JSON.stringify(results, null, 1));
await browser.close();
