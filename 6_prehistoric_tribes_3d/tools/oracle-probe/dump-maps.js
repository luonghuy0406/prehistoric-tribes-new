await sleep(2000);
const owner = Object.keys(g).find(k => g[k] && typeof g[k].loadMap === 'function');
const L = g[owner]; const out = { owner, levels: [] };
for (let lv = 0; lv < 12; lv++) {
  g.level = lv; L.resetWorld();
  const rng = [g.random.high, g.random.low];
  L.loadMap();
  const W = g.levelWidth, H = g.levelHeight;
  const ter = [], occ = [];
  for (let y = 0; y < H; y++) { ter.push(Array.from(g.terrain[y].slice(0, W))); occ.push(Array.from(g.occupancy[y].slice(0, W))); }
  out.levels.push({ level: lv, levelWidth: W, levelHeight: H, mapWidth: g.mapWidth, mapHeight: g.mapHeight, rngBefore: rng, rngAfter: [g.random.high, g.random.low], terrain: ter.map(r => r.join(',')), occupancy: occ.map(r => r.join(',')),
    objects: Array.from({ length: 50 }, (_, i) => [g.objects.type[i], g.objects.x[i], g.objects.y[i], g.objects.variant[i], g.objects.stage[i]]).filter(o => o[0] !== 0) });
}
return out;
