await sleep(2000);
const S = {}; const sim = g.simulation;
const kinds = (o) => Object.fromEntries(Object.keys(o).map(k => [k, o[k] == null ? 'null' : ArrayBuffer.isView(o[k]) ? o[k].constructor.name + '[' + o[k].length + ']' : Array.isArray(o[k]) ? 'Array[' + o[k].length + ']' : typeof o[k] === 'object' ? 'obj:' + (o[k].constructor?.name || '') : typeof o[k]]));
const sizes = []; for (let l = 0; l < 10; l++) { g.level = l; sizes.push([g.data.value(g.data.constructor && 0 || 0, 0)]); }
return {
  simKeys: kinds(sim),
  buildings: Object.keys(g.buildings), animals: Object.keys(g.animals), objects: Object.keys(g.objects),
  unitsLen: g.units.hp.length, bLen: g.buildings[Object.keys(g.buildings)[0]].length, aLen: g.animals[Object.keys(g.animals)[0]].length, oLen: g.objects[Object.keys(g.objects)[0]].length,
  tribeStatsShape: [g.tribeStats.length, g.tribeStats[0].length], B: c.enums.B,
};
