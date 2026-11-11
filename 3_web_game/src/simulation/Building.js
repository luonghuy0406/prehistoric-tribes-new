export const BUILDING_DEFS = {
  store: { id: 'store', name: 'Store', costWood: 30, costStone: 10, width: 2, height: 2, color: '#78350f', roofColor: '#92400e' },
  hut: { id: 'hut', name: 'Hut', costWood: 20, costStone: 10, width: 2, height: 2, color: '#a16207', roofColor: '#ca8a04' },
  kitchen: { id: 'kitchen', name: 'Kitchen', costWood: 25, costStone: 15, width: 2, height: 2, color: '#b91c1c', roofColor: '#dc2626' },
  armoury: { id: 'armoury', name: 'Armoury', costWood: 40, costStone: 30, width: 3, height: 2, color: '#475569', roofColor: '#64748b' },
  gym: { id: 'gym', name: 'Training Ground', costWood: 35, costStone: 25, width: 3, height: 3, color: '#1e3a8a', roofColor: '#2563eb' },
  range: { id: 'range', name: 'Range', costWood: 30, costStone: 20, width: 3, height: 2, color: '#166534', roofColor: '#22c55e' },
  disco: { id: 'disco', name: 'Disco', costWood: 50, costStone: 20, width: 3, height: 3, color: '#86198f', roofColor: '#d946ef' },
  sanctuary: { id: 'sanctuary', name: 'Sanctuary', costWood: 40, costStone: 40, width: 3, height: 3, color: '#581c87', roofColor: '#9333ea' },
  pia_center: { id: 'pia_center', name: 'PIA Centre', costWood: 45, costStone: 25, width: 2, height: 2, color: '#0f172a', roofColor: '#334155' },
  nursery: { id: 'nursery', name: 'Nursery', costWood: 30, costStone: 15, width: 2, height: 2, color: '#c2410c', roofColor: '#ea580c' },
  tower: { id: 'tower', name: 'Watchtower', costWood: 25, costStone: 35, width: 1, height: 1, color: '#3f3f46', roofColor: '#71717a' },
  chiefs_hut: { id: 'chiefs_hut', name: "Chief's Hut", costWood: 0, costStone: 0, width: 3, height: 3, color: '#b45309', roofColor: '#f59e0b' }
};

export class Building {
  constructor(id, type, x, y, isCompleted = false) {
    this.id = id;
    this.type = type;
    this.def = BUILDING_DEFS[type] || BUILDING_DEFS.hut;
    this.name = this.def.name;
    this.x = x;
    this.y = y;
    this.width = this.def.width;
    this.height = this.def.height;
    this.progress = isCompleted ? 100 : 0;
    this.isCompleted = isCompleted;
    this.health = 100;
    this.maxHealth = 100;
    this.level = 1;
    this.occupants = [];
  }

  build(workAmount) {
    if (this.isCompleted) return;
    this.progress = Math.min(100, this.progress + workAmount);
    if (this.progress >= 100) {
      this.isCompleted = true;
    }
  }
}
