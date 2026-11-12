/** Placeholder colours until HD sprites (docs/05_GEMINI_2D_ASSET_PROMPTS.md) are delivered. */
export const Colors = {
  grass: 0x6da83a,
  grassAlt: 0x649f35,
  forestFloor: 0x3f7a2a,
  water: 0x4fa6d8,
  waterDeep: 0x3d8fc0,
  shore: 0xd9c38a,
  rock: 0x8a8378,
  rockDark: 0x6e675d,
  outline: 0x2b2014,
  treeCanopy: 0x2f6b22,
  treeCanopyLight: 0x4c8f33,
  trunk: 0x6b4423,
  player: 0x3b82f6,
  enemy: 0xd94141,
  chief: 0xf2b33d,
  shadow: 0x000000,
  selection: 0xfff3a0,
  hpGood: 0x58c75a,
  hpBad: 0xd94141,
} as const;

/** Per building type (labels.buildings order): wall colour and roof colour, plus block height in px (HD). */
export const BuildingStyle: readonly { wall: number; roof: number; height: number }[] = [
  { wall: 0x8c6239, roof: 0x5a3d22, height: 70 }, // armoury
  { wall: 0x9c7a4f, roof: 0x7a5a32, height: 50 }, // gym
  { wall: 0xa8743f, roof: 0x7a4e2a, height: 80 }, // hut
  { wall: 0xc08a4c, roof: 0xf2b33d, height: 120 }, // chief's hut
  { wall: 0xb5651d, roof: 0x7a3e12, height: 70 }, // kitchen
  { wall: 0x9c8a5f, roof: 0x6f6040, height: 40 }, // range
  { wall: 0x8a6a45, roof: 0x5e472c, height: 90 }, // store
  { wall: 0x7a4a8c, roof: 0xd04fa0, height: 100 }, // disco
  { wall: 0x8f8aa8, roof: 0x6c5ca8, height: 110 }, // sanctuary
  { wall: 0x5f8a3f, roof: 0x3f6a2a, height: 90 }, // PIA centre
  { wall: 0xc2a36b, roof: 0x9c7a4f, height: 50 }, // nursery
  { wall: 0x7a5a32, roof: 0x4a3721, height: 220 }, // tower
];

/** Object kinds 1..7 (kind 5 = fish shoal, 6 = carcass, 7 = bones; 1..4 still unnamed, see MAP_FORMAT.md). */
export const ObjectColors: readonly number[] = [0, 0xc0392b, 0x7fb03a, 0x9a9286, 0xb08d57, 0x9fd3f0, 0x8e3b2e, 0xe9dcc0];

export const AnimalColors: readonly number[] = [0x7a4e2a, 0x6b4a2f, 0x5c3b22, 0xe08a2c, 0xc77d2a, 0x9a6a3a];
