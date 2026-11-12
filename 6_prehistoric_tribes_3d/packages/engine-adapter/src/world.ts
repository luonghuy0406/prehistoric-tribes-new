/**
 * Read-only view of the original engine's simulation state, plus the facts the renderer needs.
 * Arrays are the engine's live SoA arrays — never write to them from render/UI code.
 */
export type NumArray = ArrayLike<number>;

/** Original pixel grid: one tile = 22 x 16 px; units add a pixel offset inside that space. */
export const TILE_W = 22;
export const TILE_H = 16;

/** Entity id ranges (enum `T` in ptCore.js). */
export const UnitId = { FIRST_VILLAGER: 1, LAST_VILLAGER: 50, FIRST_ENEMY: 51, LAST_ENEMY: 100, COUNT: 101 } as const;
export const MAX_BUILDINGS = 61;
export const MAX_ANIMALS = 22;
export const MAX_OBJECTS = 50;

/** Building types in label order (`labels.buildings`). */
export const BuildingType = {
  ARMOURY: 0,
  GYM: 1,
  HUT: 2,
  CHIEF_HUT: 3,
  KITCHEN: 4,
  RANGE: 5,
  STORE: 6,
  DISCO: 7,
  SANCTUARY: 8,
  PIA_CENTER: 9,
  NURSERY: 10,
  TOWER: 11,
} as const;

/** Index into `tribeStats[tribe]` (enum `B`). */
export const Stat = {
  MEALS: 0,
  FOOD: 1,
  WOOD: 2,
  STONES: 3,
  BONES: 4,
  POPULATION: 11,
  MALES: 12,
  FEMALES: 13,
  BUILDINGS: 14,
  LIVING_SPACE: 16,
  CHIEF: 17,
  SCORE: 24,
} as const;

export const Tribe = { PLAYER: 0, ENEMY: 1 } as const;

export interface UnitArrays {
  x: NumArray;
  y: NumArray;
  offsetX: NumArray;
  offsetY: NumArray;
  direction: NumArray;
  hp: NumArray;
  maxHp: NumArray;
  age: NumArray;
  gender: NumArray;
  animation: NumArray;
  task: NumArray;
  job: NumArray;
  flags: NumArray;
  food: NumArray;
  energy: NumArray;
  happiness: NumArray;
  /** Index into labels.villagerNames. */
  name: NumArray;
  /** Item id (0..5 weapon) or <0 for none. */
  weapon: NumArray;
  meleeSkill: NumArray;
  throwingSkill: NumArray;
  gatheringSkill: NumArray;
  buildingSkill: NumArray;
  scoutingSkill: NumArray;
}

export interface BuildingArrays {
  x: NumArray;
  y: NumArray;
  hp: NumArray;
  maxHp: NumArray;
  type: NumArray;
  level: NumArray;
  state: NumArray;
  /** For construction sites (type >= 12): the building type being built. */
  payload: NumArray;
  firstUnit: NumArray;
}

export interface AnimalArrays {
  x: NumArray;
  y: NumArray;
  offsetX: NumArray;
  offsetY: NumArray;
  direction: NumArray;
  hp: NumArray;
  type: NumArray;
  animation: NumArray;
}

export interface ObjectArrays {
  x: NumArray;
  y: NumArray;
  type: NumArray;
  variant: NumArray;
  stage: NumArray;
}

export interface WorldView {
  readonly level: number;
  readonly tick: number;
  readonly mapWidth: number;
  readonly mapHeight: number;
  /** terrain[row][col], signed Int8 values as stored by the engine (`& 255` for the tile id). */
  readonly terrain: readonly NumArray[];
  /** occupancy[row][col]: >0 unit/animal ref, -1..-60 building, -61..-110 object, <=-124 terrain class. */
  readonly occupancy: readonly NumArray[];
  readonly units: UnitArrays;
  readonly buildings: BuildingArrays;
  readonly animals: AnimalArrays;
  readonly objects: ObjectArrays;
  readonly tribeStats: readonly NumArray[];
}

export function isEnemyUnit(id: number): boolean {
  return id >= UnitId.FIRST_ENEMY && id <= UnitId.LAST_ENEMY;
}
