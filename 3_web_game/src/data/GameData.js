/**
 * GameData.js — Dữ liệu gốc hoàn chỉnh được dịch ngược từ Prehistoric Tribes (THQ / Gear Games 2008).
 * Bao gồm: 12 màn chơi (Tutorial + 6 màn Campaign + 5 bản đồ Custom), thông số 12 công trình (Lv1-Lv3),
 * công thức vũ khí/bẫy Armoury, 4 phép Sanctuary, bảng sát thương cận chiến, AI địch, và toàn bộ hội thoại cốt truyện.
 */

export const MAP_RUN_LENGTHS = [4, 4, 2, 2, 2, 2, 3, 0, 43, 6, 3, 0];

export const MELEE_DAMAGE_BY_SKILL = [1, 1, 1, 2, 2, 3, 3, 4, 6, 8];

export const VILLAGE_NAMES = {
  male: [
    'Jumbo', 'Juju', 'Mumbo', 'Freaky', 'Ludo', 'Konan', 'Rumbo', 'Milo', 'Kipp', 'Errrbo',
    'Gumbo', 'Edwood', 'Arnni', 'Erk', 'Daymo', 'Bookah', 'Erbby', 'Ukkko', 'Ukmol', 'Pard',
    'Rayvon', 'Narik', 'Derger', 'Rychi', 'Mylo', 'Rilo', 'Babon', 'Harpo', 'Seppo', 'Chico',
    'Taran', 'Tone', 'Derp', 'Tupik', 'Makka', 'Gooon', 'Dooon', 'Tooon', 'Deano', 'Fred',
    'Barney', 'Siggy', 'Gizzz', 'Smoki', 'Noggin', 'Rryyan', 'Jimbly', 'Brooce', 'Ernest', 'Addam',
    'Bibby', 'Dave', 'Rowie', 'Fuzzy', 'Furlog', 'Cral', 'Jonno', 'Beehag', 'Hazza', 'Kazza'
  ],
  female: [
    'Tazza', 'Loula', 'Treena', 'Dorris', 'Ethel', 'Tessa', 'Nora', 'Flora', 'Fauna', 'Mila',
    'Daisi', 'Myrtle', 'Margo', 'Audrey', 'Irene', 'Hurdy', 'Gurdy', 'Murli', 'Mousi', 'Irma',
    'Urna', 'Purga', 'Grami', 'Urrki', 'Lavka', 'Manka', 'Banka', 'Bunki', 'Gretel', 'Spiki',
    'Arida', 'Ronda', 'Mayka', 'Vanni', 'Buffi', 'Aromi', 'Mitte', 'Ritte', 'Banne', 'Polka',
    'Dolka', 'Korka', 'Zorka', 'Palka', 'Milka', 'Aarka', 'Uurka', 'Erikka', 'Kikka', 'Umka',
    'Arka', 'Jarka', 'Bulka', 'Klura', 'Onaka', 'Bilma', 'Zuyka', 'Alika', 'Ubika', 'Nana'
  ]
};

export const BUILD_MENU_ORDER = [
  'hut', 'store', 'kitchen', 'armoury', 'gym', 'range', 'sanctuary', 'pia_center', 'disco', 'nursery', 'tower'
];

export const BUILDING_DEFS_AUTH = {
  armoury: {
    id: 'armoury',
    name: 'Armoury',
    vnName: 'Xưởng Vũ Khí',
    costWood: 20, costStone: 10, costBone: 0,
    upgradeWood: 10, upgradeStone: 5, upgradeBone: 0,
    width: 3, height: 2,
    maxHpLevels: [40, 55, 70],
    capacityLevels: [1, 1, 1],
    happinessLevels: [-1, 0, 1],
    keeperRole: 'armourer',
    maxLevelDefault: 3,
    color: '#475569', roofColor: '#64748b',
    description: 'Thợ rèn (Armourer) chế tạo vũ khí & bẫy phòng thủ tại đây.'
  },
  gym: {
    id: 'gym',
    name: 'Training Ground',
    vnName: 'Bãi Tập Cận Chiến',
    costWood: 40, costStone: 30, costBone: 0,
    upgradeWood: 15, upgradeStone: 15, upgradeBone: 0,
    width: 5, height: 4,
    maxHpLevels: [70, 100, 100],
    capacityLevels: [2, 4, 4],
    happinessLevels: [0, 0, 0],
    keeperRole: null,
    maxLevelDefault: 2,
    color: '#1e3a8a', roofColor: '#2563eb',
    description: 'Chiến binh cầm vũ khí cận chiến tập luyện Melee Skill, Max HP & Tốc độ.'
  },
  hut: {
    id: 'hut',
    name: 'Hut',
    vnName: 'Lều Trú Ẩn',
    costWood: 15, costStone: 5, costBone: 0,
    upgradeWood: 5, upgradeStone: 10, upgradeBone: 0,
    width: 2, height: 2,
    maxHpLevels: [25, 40, 40],
    capacityLevels: [4, 4, 4],
    happinessLevels: [0, 2, 2],
    keeperRole: null,
    maxLevelDefault: 2,
    livingSpace: 4,
    color: '#a16207', roofColor: '#ca8a04',
    description: 'Cung cấp +4 chỗ ở, nơi dân nghỉ ngơi hồi thể lực & hẹn hò sinh con.'
  },
  chiefs_hut: {
    id: 'chiefs_hut',
    name: "Chief's Hut",
    vnName: 'Nhà Tù Trưởng',
    costWood: 30, costStone: 20, costBone: 0,
    upgradeWood: 50, upgradeStone: 50, upgradeBone: 0,
    width: 4, height: 4,
    maxHpLevels: [120, 120, 120],
    capacityLevels: [2, 2, 2],
    happinessLevels: [0, 0, 0],
    keeperRole: null,
    maxLevelDefault: 1,
    livingSpace: 1,
    color: '#b45309', roofColor: '#f59e0b',
    description: 'Trung tâm bộ lạc nơi Tù trưởng sinh sống & các bô lão họp bàn.'
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    vnName: 'Nhà Bếp',
    costWood: 30, costStone: 20, costBone: 0,
    upgradeWood: 10, upgradeStone: 20, upgradeBone: 0,
    width: 4, height: 3,
    maxHpLevels: [60, 80, 80],
    capacityLevels: [5, 7, 7],
    happinessLevels: [0, 2, 2],
    keeperRole: 'cook',
    maxLevelDefault: 2,
    color: '#b91c1c', roofColor: '#dc2626',
    description: 'Đầu bếp (Cook) chế biến Food thành Meals; dân đói sẽ vào đây dùng bữa.'
  },
  range: {
    id: 'range',
    name: 'Throwing Range',
    vnName: 'Trường Bắn / Phóng Lao',
    costWood: 40, costStone: 30, costBone: 0,
    upgradeWood: 15, upgradeStone: 15, upgradeBone: 0,
    width: 6, height: 4,
    maxHpLevels: [70, 100, 100],
    capacityLevels: [2, 4, 4],
    happinessLevels: [0, 0, 0],
    keeperRole: null,
    maxLevelDefault: 2,
    color: '#166534', roofColor: '#22c55e',
    description: 'Chiến binh cầm vũ khí tầm xa luyện Throwing Skill, Tầm nhìn & Max HP.'
  },
  store: {
    id: 'store',
    name: 'Store',
    vnName: 'Kho Bộ Lạc',
    costWood: 25, costStone: 20, costBone: 0,
    upgradeWood: 18, upgradeStone: 18, upgradeBone: 0,
    width: 3, height: 3,
    maxHpLevels: [50, 70, 70],
    capacityLevels: [0, 0, 0],
    happinessLevels: [0, 0, 0],
    keeperRole: null,
    maxLevelDefault: 1,
    color: '#78350f', roofColor: '#92400e',
    description: 'Chứa toàn bộ tài nguyên (Food, Wood, Stone, Bone) & vũ khí đã rèn.'
  },
  disco: {
    id: 'disco',
    name: 'Disco',
    vnName: 'Sàn Nhảy Bộ Lạc',
    costWood: 30, costStone: 25, costBone: 0,
    upgradeWood: 10, upgradeStone: 25, upgradeBone: 0,
    width: 5, height: 4,
    maxHpLevels: [90, 110, 110],
    capacityLevels: [5, 7, 7],
    happinessLevels: [2, 3, 3],
    keeperRole: 'dj',
    maxLevelDefault: 2,
    color: '#86198f', roofColor: '#d946ef',
    description: 'Cần 1 DJ chơi nhạc để dân vào nhảy múa, xua tan trầm cảm (+Happiness).'
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'Sanctuary',
    vnName: 'Đền Thờ Shaman',
    costWood: 0, costStone: 20, costBone: 10,
    upgradeWood: 10, upgradeStone: 0, upgradeBone: 10,
    width: 3, height: 3,
    maxHpLevels: [50, 60, 60],
    capacityLevels: [2, 2, 2],
    happinessLevels: [0, 1, 1],
    keeperRole: 'shaman',
    maxLevelDefault: 2,
    color: '#581c87', roofColor: '#9333ea',
    description: 'Pháp sư Shaman hồi máu & niệm 4 phép: Healing, Defence, Love Potion, Disease.'
  },
  pia_center: {
    id: 'pia_center',
    name: 'PIA Centre',
    vnName: 'Trung Tâm Tình Báo PIA',
    costWood: 30, costStone: 15, costBone: 0,
    upgradeWood: 10, upgradeStone: 15, upgradeBone: 0,
    width: 4, height: 4,
    maxHpLevels: [60, 80, 80],
    capacityLevels: [2, 3, 3],
    happinessLevels: [0, 0, 0],
    keeperRole: null,
    maxLevelDefault: 2,
    color: '#0f172a', roofColor: '#334155',
    description: 'Huấn luyện Trinh sát (Scouting): tăng tầm nhìn xa, ẩn thân bụi cỏ & dò bẫy địch.'
  },
  nursery: {
    id: 'nursery',
    name: 'Nursery',
    vnName: 'Nhà Trẻ',
    costWood: 20, costStone: 10, costBone: 0,
    upgradeWood: 10, upgradeStone: 5, upgradeBone: 0,
    width: 4, height: 4,
    maxHpLevels: [40, 50, 50],
    capacityLevels: [5, 5, 5],
    happinessLevels: [0, 0, 0],
    keeperRole: null,
    maxLevelDefault: 1,
    color: '#c2410c', roofColor: '#ea580c',
    description: 'Giữ trẻ em (<12 tuổi) chơi an toàn, tránh bị thú dữ ăn thịt hay địch bắt cóc.'
  },
  tower: {
    id: 'tower',
    name: 'Watchtower',
    vnName: 'Tháp Canh',
    costWood: 10, costStone: 10, costBone: 0,
    upgradeWood: 10, upgradeStone: 10, upgradeBone: 0,
    width: 1, height: 1,
    maxHpLevels: [50, 70, 70],
    capacityLevels: [2, 2, 2],
    happinessLevels: [0, 1, 1],
    keeperRole: null,
    maxLevelDefault: 2,
    color: '#3f3f46', roofColor: '#71717a',
    description: 'Lính gác tầm xa (+View Radius) tự động bắn tên/lao/đá bảo vệ làng.'
  }
};

export const WEAPON_DEFS = {
  none:      { id: 'none', name: 'Tay Không', type: 'none', damage: 0, range: 1, speed: 0, minArmouryLv: 0, cost: { wood: 0, stone: 0, bone: 0 } },
  club:      { id: 'club', name: 'Club (Chùy Gỗ)', type: 'melee', damage: 1, range: 1.5, speed: 0, minArmouryLv: 1, cost: { wood: 5, stone: 0, bone: 0 } },
  stone:     { id: 'stone', name: 'Stones (Đá Ném)', type: 'ranged', damage: 1, range: 6, speed: 25, batch: 5, minArmouryLv: 1, cost: { wood: 0, stone: 5, bone: 0 } },
  spear:     { id: 'spear', name: 'Spear (Lao)', type: 'ranged', damage: 2, range: 7, speed: 30, minArmouryLv: 1, cost: { wood: 5, stone: 2, bone: 0 }, canFish: true },
  stone_axe: { id: 'stone_axe', name: 'Stone Axe (Rìu Đá)', type: 'melee', damage: 3, range: 1.5, speed: 0, minArmouryLv: 2, cost: { wood: 4, stone: 4, bone: 0 } },
  bone_mace: { id: 'bone_mace', name: 'Bone Mace (Chùy Xương)', type: 'melee', damage: 5, range: 1.6, speed: 0, minArmouryLv: 2, cost: { wood: 5, stone: 0, bone: 3 } },
  tomahawk:  { id: 'tomahawk', name: 'Tomahawk (Rìu Bay)', type: 'ranged', damage: 3, range: 7.5, speed: 40, minArmouryLv: 3, cost: { wood: 4, stone: 0, bone: 4 } }
};

export const TRAP_DEFS = {
  net_trap:    { id: 'net_trap', name: 'Net Trap (Bẫy Lưới)', damage: 10, stunSec: 4, minArmouryLv: 1, cost: { wood: 10, stone: 0, bone: 0 }, color: '#eab308' },
  spring_trap: { id: 'spring_trap', name: 'Spring Trap (Bẫy Lò Xo)', damage: 20, stunSec: 2, minArmouryLv: 2, cost: { wood: 10, stone: 5, bone: 0 }, color: '#f97316' },
  pit_trap:    { id: 'pit_trap', name: 'Pit Trap (Hố Chông)', damage: 30, stunSec: 3, minArmouryLv: 3, cost: { wood: 5, stone: 10, bone: 0 }, color: '#dc2626' }
};

export const SPELL_DEFS = {
  healing:     { id: 'healing', name: 'Healing', vnName: 'Trị Thương & Giải Độc', minSanctuaryLv: 1, targetMode: 'ally', color: '#22c55e', desc: 'Hồi phục toàn bộ HP và giải trừ Dịch bệnh cho 1 thành viên.' },
  defence:     { id: 'defence', name: 'Defence', vnName: 'Khiên Hộ Mệnh', minSanctuaryLv: 1, targetMode: 'ally', duration: 25, color: '#38bdf8', desc: 'Giảm 50% sát thương nhận vào trong 25 giây.' },
  love_potion: { id: 'love_potion', name: 'Love Potion', vnName: 'Thuốc Tình Yêu Niagra', minSanctuaryLv: 2, targetMode: 'ally', color: '#ec4899', desc: 'Đưa Happiness lên 99 tức thì & thúc đẩy đôi lứa sinh con.' },
  disease:     { id: 'disease', name: 'Disease', vnName: 'Mây Dịch Bệnh', minSanctuaryLv: 2, targetMode: 'ground', radius: 1.5, duration: 22, color: '#84cc16', desc: 'Tạo vùng 3×3 độc hại gây lây nhiễm rút máu (cẩn thận lây phe ta!).' }
};

export const BIOMES = {
  lush: { name: 'Lush Valley', grassDark: '#263820', grassLight: '#2f4528', tint: null },
  jungle: { name: 'Dense Jungle', grassDark: '#1f331c', grassLight: '#284023', tint: null },
  wastelands: { name: 'Arid Wastelands', grassDark: '#5b4b2a', grassLight: '#6b5832', tint: 'rgba(180, 120, 40, 0.14)' },
  desert: { name: 'Desert Pass', grassDark: '#6e5732', grassLight: '#7c643b', tint: 'rgba(200, 140, 50, 0.18)' }
};

export const CAMPAIGN_LEVELS = [
  {
    id: 0, name: 'Tutorial (Valley)', vnName: 'Màn 0: Rời Hang Băng (Hướng Dẫn)',
    isCustom: false, chapter: 0, mapFile: '00_outside.bin',
    rawSize: [64, 48], playSize: [40, 32], startPos: [15, 5],
    biome: 'lush', endCondition: 'cutscene',
    startingResources: { food: 40, meals: 5, wood: 40, stone: 25, bone: 0, clubs: 2, stones: 0, spears: 1, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 200, wood: 200, stone: 200, bone: 200 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 1, armoury: 1, gym: 1, range: 1, sanctuary: 1, pia_center: 1, disco: 1, nursery: 1, tower: 1 },
    herds: [{ x: 27, y: 11, radius: 6, interval: 45, max: 2, pool: ['boar', 'mammoth', 'boar'] }],
    aiConfig: { raidInterval: 140, raidSize: [2, 3], popCap: [0, 0], axesSec: -1, heavySec: -1, campCenter: [24, 28], campPlan: [] },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 6, y: 11, level: 1 }
    ],
    initialVillagers: [
      { owner: 'player', x: 4, y: 11, age: 35, isChief: true, gender: 'male', name: 'Chief', bldSkill: 3 },
      { owner: 'player', x: 3, y: 8, age: 20, gender: 'male', name: 'Mumbo', bldSkill: 4 },
      { owner: 'player', x: 5, y: 9, age: 25, gender: 'male', name: 'Jumbo', bldSkill: 2 },
      { owner: 'player', x: 5, y: 8, age: 17, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 6, y: 8, age: 22, gender: 'male', name: 'Konan', bldSkill: 5 },
      { owner: 'player', x: 3, y: 9, age: 27, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 4, y: 8, age: 17, gender: 'female', name: 'Nora' },
      { owner: 'player', x: 4, y: 9, age: 22, gender: 'male', name: 'Rumbo' },
      { owner: 'player', x: 6, y: 9, age: 15, gender: 'female', name: 'Daisi' }
    ],
    initialAnimals: [],
    introCutscene: 0,
    objectiveText: 'Xây Store, Kitchen, Hut, Armoury & Bãi tập để đẩy lùi đợt đột kích ăn thịt người!'
  },
  {
    id: 1, name: 'Outside', vnName: 'Màn 1: Thế Giới Bên Ngoài',
    isCustom: false, chapter: 0, mapFile: '00_outside.bin',
    rawSize: [64, 48], playSize: [64, 48], startPos: [15, 5],
    biome: 'lush', endCondition: 'conquest',
    startingResources: { food: 50, meals: 10, wood: 45, stone: 35, bone: 0, clubs: 2, stones: 0, spears: 2, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 400, wood: 400, stone: 400, bone: 400 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 1, armoury: 1, gym: 1, range: 1, sanctuary: 1, pia_center: 1, disco: 1, nursery: 1, tower: 1 },
    herds: [{ x: 27, y: 11, radius: 7, interval: 40, max: 3, pool: ['boar', 'mammoth', 'tiger'] }],
    aiConfig: { raidInterval: 80, raidSize: [2, 4], popCap: [14, 19], axesSec: -1, heavySec: -1, campCenter: [44, 36], trapLimit: 2 },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 6, y: 11, level: 1 },
      { owner: 'player', type: 'store', x: 10, y: 10, level: 1 },
      { owner: 'enemy', type: 'kitchen', x: 51, y: 29, level: 1 },
      { owner: 'enemy', type: 'gym', x: 40, y: 25, level: 1 },
      { owner: 'enemy', type: 'armoury', x: 50, y: 14, level: 2 },
      { owner: 'enemy', type: 'range', x: 48, y: 37, level: 1 },
      { owner: 'enemy', type: 'hut', x: 37, y: 20, level: 2 },
      { owner: 'enemy', type: 'hut', x: 37, y: 15, level: 2 },
      { owner: 'enemy', type: 'hut', x: 40, y: 8, level: 1 },
      { owner: 'enemy', type: 'hut', x: 47, y: 8, level: 1 },
      { owner: 'enemy', type: 'hut', x: 59, y: 31, level: 2 },
      { owner: 'enemy', type: 'hut', x: 59, y: 33, level: 2 },
      { owner: 'enemy', type: 'store', x: 51, y: 21, level: 1 },
      { owner: 'enemy', type: 'nursery', x: 43, y: 4, level: 1 },
      { owner: 'enemy', type: 'tower', x: 40, y: 32, level: 1 },
      { owner: 'enemy', type: 'tower', x: 40, y: 40, level: 1 }
    ],
    initialVillagers: [
      { owner: 'player', x: 4, y: 11, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 4, y: 9, age: 22, gender: 'male', name: 'Mumbo', bldSkill: 4, weapon: 'club' },
      { owner: 'player', x: 5, y: 9, age: 25, gender: 'male', name: 'Jumbo', weapon: 'spear' },
      { owner: 'player', x: 5, y: 8, age: 18, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 6, y: 8, age: 21, gender: 'male', name: 'Konan', weapon: 'club' },
      { owner: 'player', x: 3, y: 9, age: 27, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 4, y: 8, age: 19, gender: 'female', name: 'Nora' },
      { owner: 'player', x: 6, y: 9, age: 20, gender: 'male', name: 'Rumbo', weapon: 'spear' },
      { owner: 'enemy', x: 42, y: 31, age: 18, gender: 'male', role: 'guard', weapon: 'club' },
      { owner: 'enemy', x: 43, y: 31, age: 24, gender: 'male', role: 'guard', weapon: 'club' },
      { owner: 'enemy', x: 43, y: 32, age: 17, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 47, y: 31, age: 18, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 46, y: 32, age: 27, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 42, y: 35, age: 20, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 43, y: 36, age: 22, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 46, y: 35, age: 25, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 47, y: 35, age: 19, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 52, y: 22, age: 22, gender: 'female' },
      { owner: 'enemy', x: 54, y: 23, age: 24, gender: 'female' }
    ],
    initialAnimals: [],
    introCutscene: 2,
    objectiveText: 'Xây dựng lực lượng chiến binh và san phẳng căn cứ bộ lạc Ăn Thịt Người phía Đông Nam!'
  },
  {
    id: 2, name: 'Revenge', vnName: 'Màn 2: Cuộc Báo Thù',
    isCustom: false, chapter: 1, mapFile: '01_revenge.bin',
    rawSize: [64, 80], playSize: [64, 80], startPos: [8, 69],
    biome: 'jungle', endCondition: 'revenge',
    startingResources: { food: 40, meals: 8, wood: 35, stone: 30, bone: 10, clubs: 2, stones: 0, spears: 2, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 600, wood: 600, stone: 600, bone: 600 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 2, gym: 2, range: 2, sanctuary: 1, pia_center: 1, disco: 1, nursery: 1, tower: 1 },
    herds: [
      { x: 51, y: 71, radius: 8, interval: 35, max: 3, pool: ['boar', 'tiger', 'mammoth'] },
      { x: 16, y: 34, radius: 8, interval: 35, max: 3, pool: ['boar', 'tiger', 'triceratops'] },
      { x: 38, y: 57, radius: 8, interval: 35, max: 3, pool: ['boar', 'tiger'] }
    ],
    aiConfig: { raidInterval: 65, raidSize: [2, 5], popCap: [18, 26], axesSec: 180, heavySec: -1, campCenter: [52, 20], trapLimit: 4 },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 10, y: 73, level: 1 },
      { owner: 'player', type: 'store', x: 10, y: 62, level: 1 },
      { owner: 'player', type: 'armoury', x: 16, y: 61, level: 1 },
      { owner: 'player', type: 'kitchen', x: 12, y: 68, level: 1 },
      { owner: 'player', type: 'hut', x: 3, y: 68, level: 1 },
      { owner: 'player', type: 'hut', x: 16, y: 73, level: 1 },
      { owner: 'player', type: 'hut', x: 19, y: 73, level: 1 },
      { owner: 'enemy', type: 'store', x: 58, y: 9, level: 1 },
      { owner: 'enemy', type: 'gym', x: 52, y: 7, level: 2 },
      { owner: 'enemy', type: 'range', x: 44, y: 6, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 53, y: 3, level: 2 },
      { owner: 'enemy', type: 'kitchen', x: 56, y: 14, level: 2 },
      { owner: 'enemy', type: 'nursery', x: 50, y: 13, level: 1 },
      { owner: 'enemy', type: 'tower', x: 41, y: 14, level: 2 },
      { owner: 'enemy', type: 'tower', x: 44, y: 20, level: 2 },
      { owner: 'enemy', type: 'tower', x: 50, y: 22, level: 2 },
      { owner: 'enemy', type: 'tower', x: 57, y: 23, level: 2 },
      { owner: 'enemy', type: 'hut', x: 46, y: 2, level: 2 },
      { owner: 'enemy', type: 'hut', x: 50, y: 2, level: 2 },
      { owner: 'enemy', type: 'hut', x: 61, y: 5, level: 2 },
      { owner: 'enemy', type: 'hut', x: 41, y: 8, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 8, y: 71, age: 36, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 6, y: 68, age: 19, gender: 'male', name: 'Mumbo', weapon: 'club' },
      { owner: 'player', x: 8, y: 69, age: 25, gender: 'male', name: 'Shaman', role: 'shaman' },
      { owner: 'player', x: 8, y: 68, age: 17, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 9, y: 68, age: 22, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 10, y: 68, age: 27, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 6, y: 69, age: 18, gender: 'male', name: 'Ludo', weapon: 'spear' },
      { owner: 'player', x: 7, y: 69, age: 22, gender: 'female', name: 'Nora' },
      { owner: 'player', x: 9, y: 69, age: 27, gender: 'female', name: 'Daisi' },
      { owner: 'player', x: 7, y: 68, age: 18, gender: 'male', name: 'Erk', weapon: 'club' },
      { owner: 'player', x: 10, y: 69, age: 18, gender: 'female', name: 'Ethel' },
      { owner: 'enemy', x: 60, y: 8, age: 18, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 61, y: 8, age: 24, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 57, y: 10, age: 19, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 54, y: 5, age: 27, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 42, y: 14, age: 18, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 45, y: 20, age: 20, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 51, y: 22, age: 18, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 58, y: 23, age: 22, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 42, y: 16, age: 24, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 47, y: 21, age: 17, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 51, y: 23, age: 18, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 55, y: 24, age: 27, gender: 'male', weapon: 'club' }
    ],
    initialAnimals: [],
    introCutscene: 32,
    objectiveText: 'Xây Watchtower, PIA Centre, Sanctuary & bẫy để bảo vệ làng và đánh bại trại địch phía Bắc!'
  },
  {
    id: 3, name: 'Escape', vnName: 'Màn 3: Cuộc Giải Cứu (Hành Động Lén Lút)',
    isCustom: false, chapter: 2, mapFile: '02_escape.bin',
    rawSize: [64, 64], playSize: [64, 64], startPos: [39, 61],
    biome: 'jungle', endCondition: 'rescue',
    startingResources: { food: 0, meals: 0, wood: 0, stone: 0, bone: 0, clubs: 0, stones: 0, spears: 0, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 0, wood: 0, stone: 0, bone: 0 },
    maxBuildingLevels: { hut: 1, store: 1, kitchen: 1, armoury: 1, gym: 1, range: 1, sanctuary: 1, pia_center: 1, disco: 1, nursery: 1, tower: 1 },
    herds: [],
    aiConfig: { raidInterval: 9999, raidSize: [0, 0], popCap: [0, 0], axesSec: -1, heavySec: -1, campCenter: [58, 17], isStealthMission: true },
    initialBuildings: [
      { owner: 'enemy', type: 'hut', x: 60, y: 28, level: 1, isPrisonHut: true },
      { owner: 'enemy', type: 'hut', x: 61, y: 13, level: 1 },
      { owner: 'enemy', type: 'hut', x: 54, y: 25, level: 1 },
      { owner: 'enemy', type: 'hut', x: 57, y: 27, level: 1 },
      { owner: 'enemy', type: 'tower', x: 57, y: 11, level: 1 }
    ],
    initialVillagers: [
      { owner: 'player', x: 41, y: 54, age: 50, isChief: true, gender: 'male', name: 'Chief', weapon: 'stone_axe', meleeSkill: 6 },
      { owner: 'player', x: 42, y: 54, age: 22, gender: 'male', name: 'Mumbo', weapon: 'club', meleeSkill: 4 },
      { owner: 'player', x: 43, y: 54, age: 25, gender: 'male', name: 'Scout PIA', role: 'pia_scout', isWarrior: true, warriorStars: 2, warriorMode: 'scout', weapon: 'spear', scoutingSkill: 7, viewRadius: 8 },
      { owner: 'enemy', x: 58, y: 16, age: 18, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 59, y: 16, age: 20, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 60, y: 16, age: 19, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 57, y: 19, age: 21, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 58, y: 20, age: 22, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 60, y: 20, age: 20, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 61, y: 19, age: 24, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 57, y: 22, age: 18, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 60, y: 23, age: 19, gender: 'male', weapon: 'club' },
      { owner: 'enemy', x: 59, y: 28, age: 35, gender: 'male', role: 'guard', weapon: 'stone_axe' }
    ],
    initialAnimals: [
      { type: 'tiger', x: 25, y: 3 }, { type: 'tiger', x: 24, y: 6 }, { type: 'tiger', x: 23, y: 5 },
      { type: 'tiger', x: 22, y: 2 }, { type: 'tiger', x: 25, y: 5 }, { type: 'tiger', x: 21, y: 3 },
      { type: 'tiger', x: 26, y: 4 }, { type: 'tiger', x: 8, y: 16 }, { type: 'tiger', x: 12, y: 2 },
      { type: 'boar', x: 38, y: 26 }, { type: 'mammoth', x: 17, y: 7 }
    ],
    introCutscene: 39,
    objectiveText: 'Dùng Trinh sát PIA dẫn bầy hổ vào trại Ăn Thịt Người (đông bắc), phá Lều Giam (60, 28) cứu phụ nữ & trẻ em!'
  },
  {
    id: 4, name: 'Wastelands', vnName: 'Màn 4: Vùng Đất Hoang (Lời Tiên Tri)',
    isCustom: false, chapter: 3, mapFile: '03_wastelands.bin',
    rawSize: [64, 96], playSize: [64, 96], startPos: [24, 86],
    biome: 'wastelands', endCondition: 'conquest', chiefMustSurvive: true,
    startingResources: { food: 40, meals: 5, wood: 35, stone: 30, bone: 10, clubs: 2, stones: 0, spears: 2, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 800, wood: 800, stone: 800, bone: 800 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 54, y: 59, radius: 5, interval: 25, max: 4, pool: ['tiger', 'trex', 'triceratops'] },
      { x: 30, y: 65, radius: 6, interval: 30, max: 3, pool: ['boar', 'tiger', 'mammoth'] }
    ],
    aiConfig: { raidInterval: 60, raidSize: [3, 6], popCap: [24, 30], axesSec: 120, heavySec: 260, campCenter: [47, 27], trapLimit: 6, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 12, y: 82, level: 1 },
      { owner: 'player', type: 'store', x: 18, y: 83, level: 1 },
      { owner: 'enemy', type: 'store', x: 51, y: 5, level: 1 },
      { owner: 'enemy', type: 'gym', x: 30, y: 7, level: 2 },
      { owner: 'enemy', type: 'gym', x: 40, y: 17, level: 2 },
      { owner: 'enemy', type: 'range', x: 41, y: 10, level: 2 },
      { owner: 'enemy', type: 'range', x: 31, y: 14, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 46, y: 5, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 50, y: 11, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 53, y: 26, level: 2 },
      { owner: 'enemy', type: 'pia_center', x: 24, y: 14, level: 2 },
      { owner: 'enemy', type: 'disco', x: 17, y: 18, level: 2 },
      { owner: 'enemy', type: 'tower', x: 34, y: 29, level: 2 },
      { owner: 'enemy', type: 'tower', x: 39, y: 30, level: 2 },
      { owner: 'enemy', x: 43, y: 33, level: 2, type: 'tower' },
      { owner: 'enemy', type: 'nursery', x: 8, y: 13, level: 1 },
      { owner: 'enemy', type: 'hut', x: 43, y: 3, level: 2 },
      { owner: 'enemy', type: 'hut', x: 57, y: 9, level: 2 },
      { owner: 'enemy', type: 'hut', x: 26, y: 3, level: 1 },
      { owner: 'enemy', type: 'hut', x: 15, y: 24, level: 1 }
    ],
    initialVillagers: [
      { owner: 'player', x: 24, y: 86, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'stone_axe' },
      { owner: 'player', x: 24, y: 87, age: 23, gender: 'male', name: 'Mumbo', weapon: 'club' },
      { owner: 'player', x: 25, y: 86, age: 26, gender: 'male', name: 'Shaman', role: 'shaman' },
      { owner: 'player', x: 21, y: 85, age: 18, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 23, y: 84, age: 21, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 24, y: 85, age: 19, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 25, y: 85, age: 22, gender: 'male', name: 'Rumbo', weapon: 'club' },
      { owner: 'player', x: 26, y: 84, age: 17, gender: 'female', name: 'Nora' },
      { owner: 'player', x: 22, y: 88, age: 24, gender: 'male', name: 'Ludo', weapon: 'spear' },
      { owner: 'player', x: 23, y: 88, age: 20, gender: 'female', name: 'Daisi' },
      { owner: 'player', x: 26, y: 88, age: 22, gender: 'female', name: 'Ethel' },
      { owner: 'player', x: 27, y: 87, age: 18, gender: 'male', name: 'Erk' },
      { owner: 'enemy', x: 59, y: 9, age: 20, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 56, y: 7, age: 24, gender: 'male', weapon: 'tomahawk' },
      { owner: 'enemy', x: 55, y: 9, age: 19, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 57, y: 5, age: 22, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 35, y: 29, age: 24, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 40, y: 30, age: 19, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 44, y: 33, age: 22, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 31, y: 21, age: 25, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 32, y: 22, age: 22, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 41, y: 32, age: 20, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 43, y: 30, age: 21, gender: 'male', weapon: 'spear' }
    ],
    initialAnimals: [],
    introCutscene: 49,
    objectiveText: 'Bảo vệ Tù trưởng khỏi lời nguyền sa mạc, phá vỡ ổ phục kích của Jafar & tiêu diệt tộc Barbarian phía Bắc!'
  },
  {
    id: 5, name: 'A New Home', vnName: 'Màn 5: Vùng Đất Hứa (Thung Lũng Mới)',
    isCustom: false, chapter: 4, mapFile: '04_a_new_home.bin',
    rawSize: [96, 96], playSize: [64, 96], startPos: [10, 87],
    biome: 'lush', endCondition: 'cutscene',
    startingResources: { food: 45, meals: 10, wood: 40, stone: 35, bone: 15, clubs: 2, stones: 0, spears: 2, stone_axes: 1, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 900, wood: 900, stone: 900, bone: 900 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 6, y: 19, radius: 5, interval: 35, max: 3, pool: ['boar', 'tiger', 'mammoth'] },
      { x: 56, y: 89, radius: 5, interval: 35, max: 3, pool: ['boar', 'tiger', 'brontosaurus'] }
    ],
    aiConfig: { raidInterval: 55, raidSize: [3, 7], popCap: [28, 34], axesSec: 90, heavySec: 200, campCenter: [35, 27], trapLimit: 8, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 9, y: 85, level: 1 },
      { owner: 'player', type: 'store', x: 15, y: 78, level: 1 },
      { owner: 'player', type: 'hut', x: 3, y: 88, level: 1 },
      { owner: 'player', type: 'hut', x: 4, y: 91, level: 1 },
      { owner: 'player', type: 'hut', x: 7, y: 92, level: 1 },
      { owner: 'enemy', type: 'store', x: 44, y: 7, level: 1 },
      { owner: 'enemy', type: 'gym', x: 50, y: 8, level: 2 },
      { owner: 'enemy', type: 'gym', x: 55, y: 18, level: 2 },
      { owner: 'enemy', type: 'range', x: 47, y: 14, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 49, y: 4, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 40, y: 13, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 22, y: 17, level: 2 },
      { owner: 'enemy', type: 'pia_center', x: 37, y: 19, level: 2 },
      { owner: 'enemy', type: 'disco', x: 28, y: 19, level: 2 },
      { owner: 'enemy', type: 'tower', x: 22, y: 27, level: 2 },
      { owner: 'enemy', type: 'tower', x: 29, y: 31, level: 2 },
      { owner: 'enemy', type: 'tower', x: 37, y: 31, level: 2 },
      { owner: 'enemy', type: 'tower', x: 43, y: 32, level: 2 },
      { owner: 'enemy', type: 'tower', x: 53, y: 33, level: 2 },
      { owner: 'enemy', type: 'hut', x: 39, y: 7, level: 2 },
      { owner: 'enemy', type: 'hut', x: 43, y: 18, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 8, y: 84, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'stone_axe' },
      { owner: 'player', x: 5, y: 81, age: 23, gender: 'male', name: 'Mumbo', weapon: 'club' },
      { owner: 'player', x: 8, y: 82, age: 24, gender: 'male', name: 'Shaman', role: 'shaman' },
      { owner: 'player', x: 7, y: 81, age: 18, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 8, y: 81, age: 21, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 9, y: 81, age: 19, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 10, y: 81, age: 22, gender: 'male', name: 'Rumbo', weapon: 'club' },
      { owner: 'player', x: 5, y: 82, age: 18, gender: 'female', name: 'Nora' },
      { owner: 'player', x: 6, y: 82, age: 24, gender: 'male', name: 'Ludo', weapon: 'spear' },
      { owner: 'player', x: 6, y: 81, age: 20, gender: 'female', name: 'Daisi' },
      { owner: 'player', x: 7, y: 82, age: 22, gender: 'female', name: 'Ethel' },
      { owner: 'player', x: 9, y: 82, age: 18, gender: 'male', name: 'Erk', role: 'pia_scout' },
      { owner: 'enemy', x: 42, y: 6, age: 20, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 43, y: 10, age: 24, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 47, y: 5, age: 19, gender: 'male', weapon: 'tomahawk' },
      { owner: 'enemy', x: 45, y: 12, age: 27, gender: 'male', weapon: 'spear' },
      { owner: 'enemy', x: 23, y: 27, age: 22, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 30, y: 31, age: 24, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 38, y: 31, age: 20, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 44, y: 32, age: 21, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 37, y: 26, age: 26, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 38, y: 26, age: 23, gender: 'male', weapon: 'stone_axe' }
    ],
    initialAnimals: [],
    introCutscene: 55,
    objectiveText: 'Dọn sạch pháo đài phía Bắc để mở đường sang thung lũng phía Đông!'
  },
  {
    id: 6, name: 'A New Home (Finale)', vnName: 'Màn 6: Trận Chiến Cuối Cùng',
    isCustom: false, chapter: 4, mapFile: '04_a_new_home.bin',
    rawSize: [96, 96], playSize: [96, 96], startPos: [10, 87],
    biome: 'lush', endCondition: 'conquest',
    startingResources: { food: 70, meals: 20, wood: 70, stone: 60, bone: 30, clubs: 3, stones: 0, spears: 3, stone_axes: 2, bone_maces: 1, tomahawks: 1 },
    enemyResources: { food: 1200, wood: 1200, stone: 1200, bone: 1200 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 6, y: 19, radius: 5, interval: 30, max: 3, pool: ['boar', 'mammoth'] },
      { x: 56, y: 89, radius: 5, interval: 30, max: 3, pool: ['tiger', 'triceratops', 'brontosaurus'] }
    ],
    aiConfig: { raidInterval: 45, raidSize: [4, 7], popCap: [36, 44], axesSec: 60, heavySec: 150, campCenter: [68, 34], trapLimit: 10, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 9, y: 85, level: 1 },
      { owner: 'player', type: 'store', x: 15, y: 78, level: 1 },
      { owner: 'player', type: 'armoury', x: 20, y: 82, level: 2 },
      { owner: 'player', type: 'kitchen', x: 12, y: 80, level: 2 },
      { owner: 'player', type: 'hut', x: 3, y: 88, level: 2 },
      { owner: 'player', type: 'hut', x: 4, y: 91, level: 2 },
      { owner: 'player', type: 'hut', x: 7, y: 92, level: 2 },
      { owner: 'enemy', type: 'store', x: 83, y: 21, level: 1 },
      { owner: 'enemy', type: 'gym', x: 69, y: 10, level: 2 },
      { owner: 'enemy', type: 'gym', x: 71, y: 29, level: 2 },
      { owner: 'enemy', type: 'range', x: 81, y: 9, level: 2 },
      { owner: 'enemy', type: 'range', x: 82, y: 34, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 73, y: 18, level: 3 },
      { owner: 'enemy', type: 'armoury', x: 78, y: 18, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 79, y: 28, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 72, y: 23, level: 2 },
      { owner: 'enemy', type: 'pia_center', x: 73, y: 39, level: 2 },
      { owner: 'enemy', type: 'disco', x: 73, y: 47, level: 2 },
      { owner: 'enemy', type: 'tower', x: 68, y: 13, level: 2 },
      { owner: 'enemy', type: 'tower', x: 67, y: 20, level: 2 },
      { owner: 'enemy', type: 'tower', x: 65, y: 30, level: 2 },
      { owner: 'enemy', type: 'tower', x: 67, y: 40, level: 2 },
      { owner: 'enemy', type: 'tower', x: 66, y: 53, level: 2 },
      { owner: 'enemy', type: 'hut', x: 76, y: 9, level: 2 },
      { owner: 'enemy', type: 'hut', x: 80, y: 46, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 8, y: 84, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'bone_mace' },
      { owner: 'player', x: 6, y: 82, age: 25, gender: 'male', name: 'Mumbo', weapon: 'stone_axe' },
      { owner: 'player', x: 8, y: 82, age: 27, gender: 'male', name: 'Shaman', role: 'shaman' },
      { owner: 'player', x: 9, y: 81, age: 22, gender: 'male', name: 'Konan', weapon: 'tomahawk' },
      { owner: 'player', x: 10, y: 81, age: 19, gender: 'female', name: 'Tazza', role: 'cook' },
      { owner: 'player', x: 7, y: 81, age: 20, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 6, y: 83, age: 21, gender: 'male', name: 'Rumbo', weapon: 'spear' },
      { owner: 'player', x: 11, y: 82, age: 24, gender: 'male', name: 'Ludo', role: 'pia_scout', weapon: 'spear' },
      { owner: 'enemy', x: 84, y: 20, age: 20, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 85, y: 19, age: 24, gender: 'male', weapon: 'tomahawk' },
      { owner: 'enemy', x: 86, y: 22, age: 21, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 74, y: 20, age: 25, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 69, y: 14, age: 22, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 69, y: 21, age: 24, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 67, y: 29, age: 20, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 68, y: 30, age: 22, gender: 'male', weapon: 'tomahawk' },
      { owner: 'enemy', x: 70, y: 16, age: 19, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 70, y: 19, age: 23, gender: 'male', weapon: 'bone_mace' }
    ],
    initialAnimals: [],
    introCutscene: 58,
    objectiveText: 'Chinh phục đại bản doanh Barbarian ở phía Đông để giành hòa bình vĩnh viễn cho tộc Avnotaklu!'
  },
  {
    id: 7, name: 'Great Lake', vnName: 'Custom 1: Great Lake (Hồ Lớn)',
    isCustom: true, chapter: 5, mapFile: '05_great_lake.bin',
    rawSize: [96, 64], playSize: [96, 64], startPos: [85, 44],
    biome: 'lush', endCondition: 'conquest',
    startingResources: { food: 35, meals: 5, wood: 40, stone: 30, bone: 10, clubs: 1, stones: 0, spears: 1, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 900, wood: 900, stone: 900, bone: 900 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 49, y: 57, radius: 7, interval: 30, max: 3, pool: ['boar', 'tiger', 'mammoth'] },
      { x: 49, y: 8, radius: 7, interval: 30, max: 3, pool: ['boar', 'tiger', 'triceratops'] }
    ],
    aiConfig: { raidInterval: 55, raidSize: [3, 6], popCap: [32, 40], axesSec: 120, heavySec: 240, campCenter: [29, 41], trapLimit: 6, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 86, y: 36, level: 1 },
      { owner: 'player', type: 'store', x: 82, y: 33, level: 1 },
      { owner: 'enemy', type: 'store', x: 13, y: 37, level: 1 },
      { owner: 'enemy', type: 'gym', x: 11, y: 24, level: 2 },
      { owner: 'enemy', type: 'range', x: 14, y: 18, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 18, y: 31, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 7, y: 31, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 22, y: 46, level: 2 },
      { owner: 'enemy', type: 'pia_center', x: 24, y: 26, level: 2 },
      { owner: 'enemy', type: 'disco', x: 17, y: 51, level: 2 },
      { owner: 'enemy', type: 'tower', x: 32, y: 9, level: 2 },
      { owner: 'enemy', type: 'tower', x: 35, y: 18, level: 2 },
      { owner: 'enemy', type: 'tower', x: 33, y: 47, level: 2 },
      { owner: 'enemy', type: 'tower', x: 33, y: 58, level: 2 },
      { owner: 'enemy', type: 'hut', x: 4, y: 46, level: 2 },
      { owner: 'enemy', type: 'hut', x: 6, y: 48, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 85, y: 45, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 83, y: 42, age: 22, gender: 'male', name: 'Mumbo' },
      { owner: 'player', x: 85, y: 43, age: 24, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 86, y: 42, age: 18, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 87, y: 42, age: 21, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 84, y: 43, age: 20, gender: 'female', name: 'Nora' },
      { owner: 'player', x: 86, y: 43, age: 22, gender: 'male', name: 'Rumbo' },
      { owner: 'enemy', x: 11, y: 37, age: 22, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 16, y: 37, age: 24, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 23, y: 49, age: 20, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 33, y: 9, age: 22, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 34, y: 49, age: 22, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 27, y: 41, age: 24, gender: 'male', weapon: 'stone_axe' }
    ],
    initialAnimals: [],
    introCutscene: null,
    objectiveText: 'Vượt qua Hồ Lớn và đánh bại căn cứ địch ở bờ Tây!'
  },
  {
    id: 8, name: 'Desert Pass', vnName: 'Custom 2: Desert Pass (Đèo Sa Mạc)',
    isCustom: true, chapter: 6, mapFile: '06_desert_pass.bin',
    rawSize: [80, 80], playSize: [80, 80], startPos: [69, 71],
    biome: 'desert', endCondition: 'conquest',
    startingResources: { food: 35, meals: 5, wood: 40, stone: 30, bone: 10, clubs: 1, stones: 0, spears: 1, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 900, wood: 900, stone: 900, bone: 900 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 58, y: 6, radius: 6, interval: 30, max: 3, pool: ['tiger', 'trex', 'mammoth'] },
      { x: 13, y: 69, radius: 6, interval: 30, max: 3, pool: ['tiger', 'triceratops'] }
    ],
    aiConfig: { raidInterval: 55, raidSize: [3, 6], popCap: [32, 40], axesSec: 120, heavySec: 240, campCenter: [24, 21], trapLimit: 8, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 68, y: 62, level: 1 },
      { owner: 'player', type: 'store', x: 63, y: 65, level: 1 },
      { owner: 'enemy', type: 'store', x: 7, y: 8, level: 1 },
      { owner: 'enemy', type: 'gym', x: 6, y: 23, level: 2 },
      { owner: 'enemy', type: 'range', x: 14, y: 22, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 19, y: 7, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 10, y: 3, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 24, y: 5, level: 2 },
      { owner: 'enemy', type: 'tower', x: 27, y: 32, level: 2 },
      { owner: 'enemy', type: 'tower', x: 31, y: 25, level: 2 },
      { owner: 'enemy', type: 'tower', x: 35, y: 19, level: 2 },
      { owner: 'enemy', type: 'hut', x: 2, y: 5, level: 2 },
      { owner: 'enemy', type: 'hut', x: 16, y: 3, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 69, y: 72, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 67, y: 69, age: 21, gender: 'male', name: 'Mumbo' },
      { owner: 'player', x: 69, y: 70, age: 22, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 70, y: 69, age: 20, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 68, y: 70, age: 19, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 70, y: 70, age: 23, gender: 'male', name: 'Rumbo' },
      { owner: 'enemy', x: 7, y: 7, age: 22, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 20, y: 9, age: 24, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 25, y: 8, age: 20, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 26, y: 32, age: 24, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 30, y: 25, age: 22, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 23, y: 19, age: 25, gender: 'male', weapon: 'stone_axe' }
    ],
    initialAnimals: [],
    introCutscene: null,
    objectiveText: 'Băng qua Đèo Sa Mạc, tránh thú dữ và san phẳng pháo đài Tây Bắc!'
  },
  {
    id: 9, name: 'Forest Belt', vnName: 'Custom 3: Forest Belt (Vành Đai Rừng)',
    isCustom: true, chapter: 7, mapFile: '07_forest_belt.bin',
    rawSize: [96, 48], playSize: [96, 48], startPos: [87, 24],
    biome: 'jungle', endCondition: 'conquest',
    startingResources: { food: 35, meals: 5, wood: 40, stone: 30, bone: 10, clubs: 1, stones: 0, spears: 1, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 900, wood: 900, stone: 900, bone: 900 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 52, y: 42, radius: 5, interval: 30, max: 3, pool: ['boar', 'tiger'] },
      { x: 43, y: 6, radius: 5, interval: 30, max: 3, pool: ['boar', 'tiger', 'mammoth'] }
    ],
    aiConfig: { raidInterval: 55, raidSize: [3, 6], popCap: [32, 40], axesSec: 120, heavySec: 240, campCenter: [26, 15], trapLimit: 8, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 86, y: 17, level: 1 },
      { owner: 'player', type: 'store', x: 88, y: 24, level: 1 },
      { owner: 'enemy', type: 'store', x: 8, y: 29, level: 1 },
      { owner: 'enemy', type: 'gym', x: 9, y: 5, level: 2 },
      { owner: 'enemy', type: 'range', x: 17, y: 3, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 18, y: 35, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 13, y: 23, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 23, y: 19, level: 2 },
      { owner: 'enemy', type: 'tower', x: 31, y: 9, level: 2 },
      { owner: 'enemy', type: 'tower', x: 30, y: 17, level: 2 },
      { owner: 'enemy', type: 'tower', x: 29, y: 24, level: 2 },
      { owner: 'enemy', type: 'tower', x: 28, y: 31, level: 2 },
      { owner: 'enemy', type: 'hut', x: 12, y: 19, level: 2 },
      { owner: 'enemy', type: 'hut', x: 13, y: 28, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 85, y: 25, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 83, y: 22, age: 21, gender: 'male', name: 'Mumbo' },
      { owner: 'player', x: 85, y: 23, age: 20, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 86, y: 22, age: 22, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 84, y: 23, age: 18, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 86, y: 23, age: 23, gender: 'male', name: 'Rumbo' },
      { owner: 'enemy', x: 7, y: 30, age: 22, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 19, y: 37, age: 24, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 24, y: 22, age: 21, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 30, y: 9, age: 22, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 29, y: 17, age: 24, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 25, y: 4, age: 20, gender: 'male', weapon: 'stone_axe' }
    ],
    initialAnimals: [],
    introCutscene: null,
    objectiveText: 'Mở đường xuyên Vành Đai Rừng rậm và tiêu diệt phòng tuyến địch phía Tây!'
  },
  {
    id: 10, name: 'Slaughter', vnName: 'Custom 4: Slaughter (Hẻm Tử Thần)',
    isCustom: true, chapter: 8, mapFile: '08_slaughter.bin',
    rawSize: [48, 96], playSize: [48, 96], startPos: [4, 83],
    biome: 'wastelands', endCondition: 'conquest',
    startingResources: { food: 35, meals: 5, wood: 40, stone: 30, bone: 10, clubs: 1, stones: 0, spears: 1, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 900, wood: 900, stone: 900, bone: 900 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 37, y: 48, radius: 5, interval: 30, max: 3, pool: ['tiger', 'trex', 'boar'] },
      { x: 22, y: 63, radius: 5, interval: 30, max: 3, pool: ['boar', 'mammoth'] }
    ],
    aiConfig: { raidInterval: 55, raidSize: [3, 6], popCap: [32, 40], axesSec: 120, heavySec: 240, campCenter: [20, 19], trapLimit: 6, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 2, y: 89, level: 1 },
      { owner: 'player', type: 'store', x: 6, y: 78, level: 1 },
      { owner: 'enemy', type: 'store', x: 34, y: 8, level: 1 },
      { owner: 'enemy', type: 'gym', x: 21, y: 11, level: 2 },
      { owner: 'enemy', type: 'range', x: 11, y: 10, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 27, y: 7, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 29, y: 13, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 24, y: 20, level: 2 },
      { owner: 'enemy', type: 'tower', x: 24, y: 28, level: 2 },
      { owner: 'enemy', type: 'tower', x: 26, y: 32, level: 2 },
      { owner: 'enemy', type: 'tower', x: 12, y: 27, level: 2 },
      { owner: 'enemy', type: 'tower', x: 11, y: 30, level: 2 },
      { owner: 'enemy', type: 'hut', x: 23, y: 7, level: 2 },
      { owner: 'enemy', type: 'hut', x: 26, y: 16, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 4, y: 82, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 2, y: 84, age: 21, gender: 'male', name: 'Mumbo' },
      { owner: 'player', x: 4, y: 85, age: 20, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 5, y: 84, age: 22, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 3, y: 85, age: 18, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 6, y: 85, age: 23, gender: 'male', name: 'Rumbo' },
      { owner: 'enemy', x: 33, y: 7, age: 22, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 28, y: 9, age: 25, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 25, y: 23, age: 21, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 25, y: 28, age: 23, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 13, y: 27, age: 22, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 17, y: 17, age: 20, gender: 'male', weapon: 'stone_axe' }
    ],
    initialAnimals: [],
    introCutscene: null,
    objectiveText: 'Trụ vững ở hẻm núi phía Nam, tích trữ giáp & vũ khí rồi tổng tiến công lên phía Bắc!'
  },
  {
    id: 11, name: 'Plot of Land', vnName: 'Custom 5: Plot of Land (Mảnh Đất Tranh Chấp)',
    isCustom: true, chapter: 9, mapFile: '09_plot_of_land.bin',
    rawSize: [64, 64], playSize: [64, 64], startPos: [14, 44],
    biome: 'lush', endCondition: 'conquest',
    startingResources: { food: 35, meals: 5, wood: 40, stone: 30, bone: 10, clubs: 1, stones: 0, spears: 1, stone_axes: 0, bone_maces: 0, tomahawks: 0 },
    enemyResources: { food: 900, wood: 900, stone: 900, bone: 900 },
    maxBuildingLevels: { hut: 2, store: 1, kitchen: 2, armoury: 3, gym: 2, range: 2, sanctuary: 2, pia_center: 2, disco: 2, nursery: 1, tower: 2 },
    herds: [
      { x: 35, y: 56, radius: 4, interval: 40, max: 3, pool: ['boar', 'tiger', 'mammoth'] }
    ],
    aiConfig: { raidInterval: 48, raidSize: [3, 7], popCap: [34, 40], axesSec: 120, heavySec: 220, campCenter: [41, 25], trapLimit: 5, useSpells: true },
    initialBuildings: [
      { owner: 'player', type: 'chiefs_hut', x: 14, y: 36, level: 1 },
      { owner: 'player', type: 'store', x: 10, y: 46, level: 1 },
      { owner: 'enemy', type: 'store', x: 55, y: 8, level: 1 },
      { owner: 'enemy', type: 'gym', x: 49, y: 13, level: 2 },
      { owner: 'enemy', type: 'range', x: 41, y: 17, level: 2 },
      { owner: 'enemy', type: 'armoury', x: 42, y: 13, level: 3 },
      { owner: 'enemy', type: 'kitchen', x: 47, y: 7, level: 2 },
      { owner: 'enemy', type: 'sanctuary', x: 43, y: 24, level: 2 },
      { owner: 'enemy', type: 'tower', x: 36, y: 24, level: 2 },
      { owner: 'enemy', type: 'tower', x: 38, y: 29, level: 2 },
      { owner: 'enemy', type: 'tower', x: 39, y: 32, level: 2 },
      { owner: 'enemy', type: 'tower', x: 41, y: 38, level: 2 },
      { owner: 'enemy', type: 'hut', x: 48, y: 4, level: 2 },
      { owner: 'enemy', type: 'hut', x: 43, y: 9, level: 2 }
    ],
    initialVillagers: [
      { owner: 'player', x: 14, y: 45, age: 35, isChief: true, gender: 'male', name: 'Chief', weapon: 'club' },
      { owner: 'player', x: 12, y: 42, age: 21, gender: 'male', name: 'Mumbo' },
      { owner: 'player', x: 14, y: 43, age: 20, gender: 'female', name: 'Tazza' },
      { owner: 'player', x: 15, y: 42, age: 22, gender: 'male', name: 'Konan', weapon: 'spear' },
      { owner: 'player', x: 13, y: 43, age: 18, gender: 'female', name: 'Flora' },
      { owner: 'player', x: 15, y: 43, age: 23, gender: 'male', name: 'Rumbo' },
      { owner: 'enemy', x: 55, y: 7, age: 22, gender: 'male', weapon: 'stone_axe' },
      { owner: 'enemy', x: 43, y: 15, age: 24, gender: 'male', weapon: 'bone_mace' },
      { owner: 'enemy', x: 44, y: 27, age: 21, gender: 'male', role: 'shaman' },
      { owner: 'enemy', x: 35, y: 24, age: 22, gender: 'male', role: 'guard', weapon: 'tomahawk' },
      { owner: 'enemy', x: 37, y: 29, age: 24, gender: 'male', role: 'guard', weapon: 'spear' },
      { owner: 'enemy', x: 39, y: 23, age: 20, gender: 'male', weapon: 'stone_axe' }
    ],
    initialAnimals: [],
    introCutscene: null,
    objectiveText: 'Đọ sức trực diện trên bản đồ cận chiến cường độ cao!'
  }
];

export const CUTSCENES = {
  0: {
    id: 0,
    title: 'Mở Đầu — Tộc Avnotaklu Rời Hang Băng',
    lines: [
      { speaker: 'Narrator', portrait: 'hud_scroll_bg', text: 'Từ thuở xa xưa, vùng đất này từng là thiên đường xanh tươi đầy voi ma mút và mãnh thú... cho đến khi Kỷ Băng Hà kéo đến nhấn chìm tất cả.' },
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Chief! Chiiieef! Băng tuyết tan hết rồi! Kỷ Băng Hà qua rồi! Mặt trời tỏa nắng, chim hót líu lo ngoài kia kìa!' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Cái gì?! Ra ngoài sao? Mọi người nghe đây: đã đến lúc rời khỏi hang động tối tăm này và xây dựng lại bộ lạc Avnotaklu!' }
    ]
  },
  2: {
    id: 2,
    title: 'Chương 1 — Thế Giới Bên Ngoài',
    lines: [
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Lâu lắm rồi bộ lạc mới được hít thở ánh nắng trên cỏ xanh và nhìn dòng nước lấp lánh thế này...' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Ta đói rồi! Lại còn lạnh nữa! Mau tìm gỗ đá dựng Lều, Kho (Store) và Nhà Bếp (Kitchen) ngay cho ta!' },
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Hàng ngàn năm trong hang mà ông ấy chỉ nghĩ đến cái dạ dày... Nào mọi người, chặt cây, khai thác đá bờ suối và hái quả mọng thôi!' }
    ]
  },
  15: {
    id: 15,
    title: 'Cảnh Báo — Bộ Lạc Ăn Thịt Người',
    lines: [
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Chief ơi! Có mấy gã trông rất hung tợn đang vung chùy gỗ lao thẳng về phía trại ta!' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Chắc hàng xóm qua chào hỏi thôi. Mau ra đón tiếp chúng!' },
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Á! Nó cắn tôi! Chúng là... lũ ăn thịt người! Hãy dùng lệnh Call to Arms để tập hợp dân phòng thủ!' }
    ]
  },
  18: {
    id: 18,
    title: 'Thành Lập Lực Lượng Vũ Trang',
    lines: [
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Nguy hiểm quá! Một tên suýt cắn đứt tay ta rồi! Chúng ta không thể tay không mãi được.' },
      { speaker: 'Shaman', portrait: 'portrait_mumbo', text: 'Hãy xây Xưởng Vũ Khí (Armoury) chế tạo Lao & Chùy, rồi dựng Gym và Trường Bắn (Range) để huấn luyện Chiến Binh tinh nhuệ!' }
    ]
  },
  32: {
    id: 32,
    title: 'Chương 2 — Cuộc Báo Thù (Revenge)',
    lines: [
      { speaker: 'Narrator', portrait: 'hud_scroll_bg', text: 'Tộc Avnotaklu đã đánh đuổi kẻ thù ra khỏi thung lũng. Nay họ xây Tháp Canh, Trung Tâm Tình Báo PIA và Đền Thờ Shaman để đề phòng ngày phục thù.' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Xây Watchtower, PIA Centre để trinh sát ẩn thân trong bụi rậm và Đền Thờ để Shaman cầu thần linh ban phép ngay trước bình minh!' }
    ]
  },
  37: {
    id: 37,
    title: 'Biến Cố — Phụ Nữ & Trẻ Em Bị Bắt Cóc!',
    lines: [
      { speaker: 'Cannibal', portrait: 'portrait_chief', text: 'Muahaha! Trong lúc quân chủ lực các ngươi kéo đi tấn công, ta đã bắt gọn phụ nữ và trẻ em làm bữa tiệc rồi!' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Lũ đê tiện! Toàn quân xuất kích, chúng ta phải lần theo dấu vết để giải cứu gia đình khỏi nồi nước sôi!' }
    ]
  },
  39: {
    id: 39,
    title: 'Chương 3 — Cuộc Giải Cứu (Escape)',
    lines: [
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Ngửi thấy mùi thịt nướng khét lẹt không?! Chúng đang ở gần đây thôi!' },
      { speaker: 'PIA Scout', portrait: 'portrait_mumbo', text: 'Trại giam có Tháp Canh và lính rìu đá gác rất chặt! Nhưng gần đây có bầy Hổ dữ — hãy tận dụng kỹ năng Ẩn Thân dụ bầy Hổ vào trại địch, rồi phá Lều Giam cứu người!' }
    ]
  },
  46: {
    id: 46,
    title: 'Đoàn Tụ — Lời Mời Của Kẻ Lạ Mặt Jafar',
    lines: [
      { speaker: 'Narrator', portrait: 'hud_scroll_bg', text: 'Nhờ bầy Hổ quấy rối và trinh sát PIA dẫn đường, toàn bộ phụ nữ và trẻ em đã được giải cứu! Nhưng khi trở về, làng cũ đã bị san phẳng...' },
      { speaker: 'Jafar', portrait: 'portrait_chief', text: 'Ta tên Jafar! Bộ lạc của ta nằm ở vùng Đất Hứa nắng ấm quanh năm, trái ngọt đầy cành! Hãy đi theo ta!' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Tuyệt vời! Toàn bộ tộc Avnotaklu thu dọn hành lý lên đường tới Đất Hứa ngay!' }
    ]
  },
  49: {
    id: 49,
    title: 'Chương 4 — Vùng Đất Hoang & Lời Tiên Tri',
    lines: [
      { speaker: 'Shaman', portrait: 'portrait_mumbo', text: 'Khoan đã! Thần linh báo mộng rằng đây là cái bẫy của tộc Barbarian hiếu chiến! Đường về đã bị sạt lở chặn đứng, và chúng nhắm giết Tù Trưởng trước tiên!' },
      { speaker: 'Jafar', portrait: 'portrait_chief', text: 'Hahaha! Không có Đất Hứa nào hết! Đánh úp! Bắt sống tất cả và giết Tù Trưởng cho ta!' },
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Bảo vệ Tù Trưởng bằng mọi giá và đâm thẳng xuyên qua doanh trại địch ở phía Bắc!' }
    ]
  },
  55: {
    id: 55,
    title: 'Chương 5 — Vùng Đất Hứa (A New Home)',
    lines: [
      { speaker: 'Narrator', portrait: 'hud_scroll_bg', text: 'Sống sót qua vùng đất hoang khắc nghiệt, tộc Avnotaklu tìm thấy một thung lũng rộng lớn trù phú. Nhưng quân Barbarian vẫn chưa buông tha...' },
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Đây chính là nhà mới của chúng ta! Hãy xây dựng pháo đài kiên cố nhất và quét sạch quân Barbarian một lần và mãi mãi!' }
    ]
  },
  58: {
    id: 58,
    title: 'Chương Cuối — Trận Chiến Định Mệnh',
    lines: [
      { speaker: 'Chief', portrait: 'portrait_chief', text: 'Quân Barbarian đang dồn toàn lực ở pháo đài phía Đông! Nâng cấp Armoury Lv.3 chế tạo Tomahawk & Bone Mace, dùng phép Disease và Love Potion áp đảo chúng!' },
      { speaker: 'Mumbo', portrait: 'portrait_mumbo', text: 'Chiến đấu vì hòa bình của tộc Avnotaklu! Tiến lên!' }
    ]
  },
  59: {
    id: 59,
    title: 'Đại Thắng — Hòa Bình Cho Tộc Avnotaklu!',
    lines: [
      { speaker: 'Narrator', portrait: 'hud_scroll_bg', text: 'Sau muôn vàn gian nan từ Kỷ Băng Hà, vượt qua tộc Ăn Thịt Người và đế chế Barbarian, tộc Avnotaklu cuối cùng đã tìm thấy mái nhà vĩnh cửu bên dòng suối yên bình!' }
    ]
  }
};
