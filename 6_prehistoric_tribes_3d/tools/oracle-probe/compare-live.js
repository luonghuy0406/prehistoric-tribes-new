const VARIANT='live';
await sleep(2500);
const O = c.enums.O;
let last = 0; for (let i = 0; i < 60000 && !(g.gameState === 1 && g.screen === 28); i++) { if (performance.now() - last > 350) { c.tapKey(O.FIRE); last = performance.now(); } await sleep(2); }
if (!(g.gameState === 1)) return { fail: info() };
c.loop.pause();
const groups = ['units','buildings','animals','objects'];
let res0;
function hashState() {
  let h = 2166136261 >>> 0; const mix = (v) => { h = Math.imul(h ^ (v & 0xffffffff), 16777619) >>> 0; };
  for (const gname of groups) { const o = g[gname]; for (const k of Object.keys(o).sort()) { const a = o[k]; if (a && a.length !== undefined) for (let i = 0; i < a.length; i++) mix(a[i] | 0); } }
  for (const row of g.tribeStats) for (const v of row) mix(v | 0);
  const walk = (a) => { for (let i = 0; i < a.length; i++) { const v = a[i]; if (v && v.length !== undefined) walk(v); else mix(v | 0); } }; for (const a of [g.terrain, g.occupancy]) if (a) walk(a);
  mix(g.gameTick); mix(g.random.high); mix(g.random.low);
  return h.toString(16);
}

const start = { tick: g.gameTick, hash: hashState(), rng: [g.random.high, g.random.low] };
const N = 53, target = start.tick + N;
if (VARIANT === 'sim') { while (g.gameTick < target) g.updateSimulation(); }
else { const t0=performance.now(); if (VARIANT === 'cam') { g.cameraX += 44; g.cameraY += 32; } c.loop.resume(); while (g.gameTick < target && performance.now()-t0 < 40000) await sleep(2); c.loop.pause(); }
const fh = {}; const hz = (a) => { let h = 7; const w = (x) => { for (let i = 0; i < x.length; i++) { const y = x[i]; if (y && y.length !== undefined) w(y); else h = Math.imul(h ^ (y|0), 16777619) >>> 0; } }; w(a); return h; };
for (const gname of groups) for (const k of Object.keys(g[gname])) fh[gname+'.'+k] = hz(g[gname][k]);
for (const k of ['tribeStats','terrain','occupancy','fogBits']) fh[k] = hz(g[k]);
fh.rng = g.random.high + ':' + g.random.low; fh.cursor = [g.cursorX, g.cursorY].join(','); fh.hovered = g.hoveredUnit;
return { fh, VARIANT, start, end: { tick: g.gameTick, hash: hashState(), state: g.gameState, screen: g.screen } };
