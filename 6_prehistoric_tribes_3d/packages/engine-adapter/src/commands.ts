/**
 * Player commands for pointer/touch play, implemented by driving the ORIGINAL engine's own input
 * handlers (so every game rule — who may be ordered where, costs, context menus — stays original).
 *
 * The original was played with a keypad cursor: "FIRE" on a tile selects / orders / confirms
 * depending on the interaction mode. Here a tap puts that cursor on the tapped tile and runs the
 * same handler (`input.handleFireTap`). The engine camera is pinned to (0,0) so cursor == tile.
 */

/** Interaction modes (enum `D`). */
export const Mode = { FREE: 0, COMMANDING: 1, CONTEXT_MENU: 2, PLACING: 3, CONFIRMING: 4 } as const;
/** Context/command item ids (enum `y`); 0..8 are items (club..pit trap), negative = listed villager. */
export const Cmd = {
  BUILD: 10,
  FORM_UP: 11,
  CALL_TO_ARMS: 12,
  VILLAGERS: 13,
  DISMISS: 14,
  BACK_TO_WORK: 15,
  UPGRADE: 16,
  DEMOLISH: 17,
  GET_OUT: 18,
  FIRST_SPELL: 19,
  DISEASE_SPELL: 22,
  FIRST_INFO_MODE: 23,
  LAST_INFO_MODE: 25,
  REPAIR: 26,
  CANCEL_UPGRADE: 27,
  CANCEL_REPAIR: 28,
  UNLOAD: 29,
} as const;
/** Panels (enum `I`). */
const Panel = { CONTEXT_BAR: 2, VILLAGE_COMMANDS: 5, BUILD_MENU: 6 } as const;
/** Targeting modes (enum `di`). */
const Targeting = { RESTORE_PANELS: -1, PLACE_BUILDING: 0, SELECT_PLACE: 2, DEMOLISH: 3 } as const;
/** `buildingStats` rows (enum `C`), table is stat-major: value(stat*26 + type). */
const Stat = { WIDTH: 4, HEIGHT: 5, COST_WOOD: 10, COST_STONES: 11, COST_BONES: 12, UP_WOOD: 13, UP_STONES: 14 } as const;
/**
 * placementType (enum `Lr`/`Pr`): 100 = rally point, <0 weapon pickup, 0..3 spells (heal, defence,
 * love potion, disease), 12..19 = construction-site type for a building (shared by footprint size —
 * NOT the building type; the building type is read from contextItems[contextCursor] on placement).
 */
const RALLY_POINT = 100;
const LAST_VILLAGER = 50;
const FIRST_ENEMY = 51;
const LAST_ENEMY = 100;
const MAX_UNITS = 101;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fn = (...args: any[]) => any;
/* eslint-enable @typescript-eslint/no-explicit-any */

/** The engine internals this module touches (structural, untyped engine underneath). */
export interface EngineInternals {
  cameraX: number;
  cameraY: number;
  cursorX: number;
  cursorY: number;
  hoveredUnit: number;
  firePressCount: number;
  interactionMode: number;
  selectedVillager: number;
  inspectedVillager: number;
  selectedBuilding: number;
  selectedGroup: number;
  targetVillager: number;
  placementType: number;
  placementX: number;
  placementY: number;
  placementValid: boolean;
  targetingMode: number;
  callToArms: boolean;
  formUp: boolean;
  callToArmsRequested: boolean;
  formUpRequested: boolean;
  keepContextCursor: boolean;
  mapWidth: number;
  mapHeight: number;
  boxLeft: number;
  boxTop: number;
  boxWidth: number;
  boxHeight: number;
  boxSelecting: boolean;
  fireHeld: boolean;
  contextItemCount: number;
  contextCursor: number;
  contextItems: ArrayLike<number> & { [i: number]: number };
  contextItemCounts: ArrayLike<number>;
  panelVisible: ArrayLike<boolean>;
  occupancy: readonly (ArrayLike<number> & { [i: number]: number })[];
  units: { hp: ArrayLike<number>; age: ArrayLike<number>; x: ArrayLike<number>; y: ArrayLike<number> };
  buildings: { type: ArrayLike<number> };
  groups: (ArrayLike<number> & { [i: number]: number })[];
  rallyPoint: ArrayLike<number>;
  data: { buildingStat(stat: number, type: number): number };
  input: { handleFireTap: Fn; selectVillager: Fn };
  selection: { finishBoxSelection: Fn; clearBoxGroup: Fn; cancelBox: Fn };
  contextMenu: { build: Fn; executeContextCommand: Fn; adjustContextQuantity: Fn; setTargetingMode: Fn; close: Fn };
  construction: { canPlaceBuilding(type: number, x: number, y: number, needVisible: boolean): boolean };
  deselectEverything: Fn;
}

export interface BuildingCost {
  wood: number;
  stones: number;
  bones: number;
}

export interface PlacementPreview {
  kind: 'building' | 'rally' | 'unit-target';
  type: number;
  x: number;
  y: number;
  w: number;
  h: number;
  valid: boolean;
}

export interface ContextItem {
  index: number;
  id: number;
  count: number;
}

export interface InteractionState {
  mode: number;
  selectedVillager: number;
  selectedBuilding: number;
  /** All selected villagers (single selection or box group). */
  selectedUnits: number[];
  placingType: number | null;
  placingRally: boolean;
  callToArms: boolean;
  formUp: boolean;
  rallyPoint: [number, number];
  panel: 'build' | 'building' | 'village' | null;
  contextItems: ContextItem[];
}

export class EngineCommands {
  private readonly rallyType = RALLY_POINT;
  /** Building type chosen in the build menu, kept for the whole placement. */
  private chosenBuilding = -1;
  private chosenIndex = -1;

  constructor(
    private readonly g: EngineInternals,
    private readonly villageCommand: (cmd: number) => void,
    private readonly openBuildMenuFn: () => void,
  ) {}

  /** Building type being placed (the HUD shows its name), or -1. */
  get placingBuilding(): number {
    return this.g.interactionMode === Mode.PLACING && this.g.placementType > 3 && this.g.placementType !== RALLY_POINT ? this.chosenBuilding : -1;
  }

  // ---- queries ---------------------------------------------------------------------------

  buildingSize(type: number): { w: number; h: number } {
    return { w: this.g.data.buildingStat(Stat.WIDTH, type), h: this.g.data.buildingStat(Stat.HEIGHT, type) };
  }

  buildingCost(type: number): BuildingCost {
    const d = this.g.data;
    return { wood: d.buildingStat(Stat.COST_WOOD, type), stones: d.buildingStat(Stat.COST_STONES, type), bones: d.buildingStat(Stat.COST_BONES, type) };
  }

  upgradeCost(type: number): BuildingCost {
    const d = this.g.data;
    return { wood: d.buildingStat(Stat.UP_WOOD, type), stones: d.buildingStat(Stat.UP_STONES, type), bones: 0 };
  }

  state(): InteractionState {
    const g = this.g;
    const selectedUnits: number[] = [];
    if (g.selectedGroup !== -1) {
      const grp = g.groups[g.selectedGroup];
      if (grp) for (let i = 0; i < 50; i++) if ((grp[i] ?? 0) > 0) selectedUnits.push(grp[i]!);
    } else if (g.selectedVillager > 0) selectedUnits.push(g.selectedVillager);
    const placing = g.interactionMode === Mode.PLACING;
    const panel = g.panelVisible[Panel.BUILD_MENU]
      ? 'build'
      : g.panelVisible[Panel.CONTEXT_BAR] && g.interactionMode === Mode.CONTEXT_MENU
        ? 'building'
        : g.panelVisible[Panel.VILLAGE_COMMANDS]
          ? 'village'
          : null;
    const contextItems: ContextItem[] = [];
    if (panel) for (let i = 0; i < g.contextItemCount; i++) contextItems.push({ index: i, id: g.contextItems[i] ?? 0, count: g.contextItemCounts[i] ?? 0 });
    return {
      mode: g.interactionMode,
      selectedVillager: g.selectedVillager,
      selectedBuilding: g.interactionMode === Mode.CONTEXT_MENU || g.interactionMode === Mode.CONFIRMING ? g.selectedBuilding : 0,
      selectedUnits,
      placingType: placing && g.placementType !== this.rallyType ? g.placementType : null,
      placingRally: placing && g.placementType === this.rallyType,
      callToArms: g.callToArms,
      formUp: g.formUp,
      rallyPoint: [g.rallyPoint[0] ?? 0, g.rallyPoint[1] ?? 0],
      panel,
      contextItems,
    };
  }

  /** Ghost for the tile under the pointer while placing (mirrors the engine's render-time `updatePlacement`). */
  previewAt(tx: number, ty: number): PlacementPreview | null {
    const g = this.g;
    if (g.interactionMode !== Mode.PLACING) return null;
    if (g.placementType === this.rallyType) return { kind: 'rally', type: g.placementType, x: tx, y: ty, w: 1, h: 1, valid: this.onMap(tx, ty) };
    if (g.placementType < 0 || g.placementType <= 3) {
      const u = this.unitAt(tx, ty);
      return { kind: 'unit-target', type: g.placementType, x: tx, y: ty, w: 1, h: 1, valid: u > 0 && u <= LAST_VILLAGER };
    }
    const { w, h } = this.buildingSize(g.placementType);
    const x = tx - Math.trunc(w / 2);
    const y = ty - Math.trunc(h / 2);
    return { kind: 'building', type: g.placementType, x, y, w, h, valid: g.construction.canPlaceBuilding(g.placementType, x, y, true) };
  }

  // ---- pointer commands -----------------------------------------------------------------

  /**
   * Primary tap/click on a tile: select own villager/building, order the selection, or confirm a
   * placement — exactly what the original FIRE key did. `unitHint` = unit the renderer hit-tested
   * (more precise than the tile for moving units). `run` = double-tap → villagers run.
   */
  tap(tx: number, ty: number, unitHint = 0, run = false): void {
    const g = this.g;
    if (!this.onMap(tx, ty)) return;
    this.pinCursor(tx, ty);
    g.hoveredUnit = this.hoverFor(tx, ty, unitHint);
    if (g.interactionMode === Mode.PLACING) this.preparePlacement(tx, ty);
    if (g.interactionMode === Mode.CONTEXT_MENU && !this.isOwnBuildingOrUnit(tx, ty, unitHint)) {
      // Tapping elsewhere while a building panel is open closes it first (modern UX).
      g.contextMenu.close();
      if (g.selectedVillager === 0 && g.selectedGroup === -1) g.deselectEverything();
    }
    g.firePressCount = run ? 2 : 1;
    if (unitHint > 0 && unitHint <= LAST_VILLAGER && g.interactionMode !== Mode.COMMANDING && g.interactionMode !== Mode.PLACING) {
      g.firePressCount = 0; // selectVillager() treats >1 as "select everyone in view"
    }
    g.input.handleFireTap();
    g.firePressCount = 0;
  }

  /** Right-click / long-press: order the current selection to a tile (never changes the selection). */
  order(tx: number, ty: number, unitHint = 0, run = false): void {
    const g = this.g;
    if (g.interactionMode === Mode.PLACING) {
      this.cancel();
      return;
    }
    if (g.selectedVillager === 0 && g.selectedGroup === -1) return;
    g.interactionMode = Mode.COMMANDING;
    const own = this.unitAt(tx, ty);
    if (own > 0 && own <= LAST_VILLAGER) return; // ordering onto an own villager is a no-op
    this.tap(tx, ty, unitHint > LAST_VILLAGER ? unitHint : 0, run);
  }

  /** Drag-box selection of own villagers (tile rect, inclusive). */
  boxSelect(x0: number, y0: number, x1: number, y1: number): void {
    const g = this.g;
    const left = Math.max(0, Math.min(x0, x1));
    const top = Math.max(0, Math.min(y0, y1));
    const right = Math.min(g.mapWidth - 1, Math.max(x0, x1));
    const bottom = Math.min(g.mapHeight - 1, Math.max(y0, y1));
    g.deselectEverything();
    g.boxLeft = left - 1;
    g.boxTop = top - 1;
    g.boxWidth = right - left + 1;
    g.boxHeight = bottom - top + 1;
    g.boxSelecting = true;
    g.fireHeld = true;
    g.selection.finishBoxSelection();
  }

  selectAllVillagers(): void {
    this.boxSelect(0, 0, this.g.mapWidth - 1, this.g.mapHeight - 1);
  }

  selectVillager(id: number): void {
    const g = this.g;
    if ((g.units.hp[id] ?? 0) <= 0) return;
    g.deselectEverything();
    g.selectedBuilding = 0;
    g.firePressCount = 0;
    g.input.selectVillager(id);
  }

  deselect(): void {
    this.g.deselectEverything();
  }

  /** Escape / back: cancel placement, close panel, then clear selection. */
  cancel(): void {
    const g = this.g;
    if (g.interactionMode === Mode.PLACING || g.interactionMode === Mode.CONFIRMING) {
      g.placementType = 0;
      g.contextMenu.setTargetingMode(Targeting.RESTORE_PANELS);
      this.chosenBuilding = -1;
      this.chosenIndex = -1;
      // Leaving placement returns to the build menu in the original; the new UI closes it too.
      if (g.panelVisible[Panel.BUILD_MENU]) g.contextMenu.close();
      return;
    }
    g.deselectEverything();
  }

  // ---- menus ----------------------------------------------------------------------------

  openBuildMenu(): void {
    this.g.deselectEverything();
    this.openBuildMenuFn();
  }

  /** Building types the engine currently offers in the build menu (tutorial limits apply). */
  buildOptions(): number[] {
    const g = this.g;
    if (!g.panelVisible[Panel.BUILD_MENU]) return [];
    const out: number[] = [];
    for (let i = 0; i < g.contextItemCount; i++) out.push(g.contextItems[i] ?? 0);
    return out;
  }

  /** Pick a building in the open build menu → enters placement mode. */
  chooseBuilding(type: number): boolean {
    const g = this.g;
    if (!g.panelVisible[Panel.BUILD_MENU]) this.openBuildMenu();
    for (let i = 0; i < g.contextItemCount; i++) {
      if (g.contextItems[i] === type) {
        g.contextCursor = i;
        this.chosenBuilding = type;
        this.chosenIndex = i;
        g.contextMenu.executeContextCommand();
        return g.interactionMode === Mode.PLACING;
      }
    }
    return false;
  }

  /** Run a context item of the open building panel (upgrade, repair, spells, get out, …). */
  runContextItem(index: number): void {
    const g = this.g;
    if (index < 0 || index >= g.contextItemCount) return;
    g.contextCursor = index;
    const id = g.contextItems[index] ?? 0;
    g.contextMenu.executeContextCommand();
    // DEMOLISH asks for confirmation in the original; the new UI confirms in a dialog first.
    if (id === Cmd.DEMOLISH) g.contextMenu.setTargetingMode(-2 /* CONFIRM_DEMOLISH */);
  }

  /** Armoury production quantity +/- for a context item. */
  adjustQuantity(index: number, delta: 1 | -1): void {
    const g = this.g;
    if (index < 0 || index >= g.contextItemCount) return;
    g.contextCursor = index;
    g.contextMenu.adjustContextQuantity(delta);
  }

  /** CALL_TO_ARMS / FORM_UP enter rally placement (tap a tile next); others apply at once. */
  village(cmd: number): void {
    this.villageCommand(cmd);
  }

  // ---- helpers --------------------------------------------------------------------------

  private onMap(tx: number, ty: number): boolean {
    return tx >= 0 && ty >= 0 && tx < this.g.mapWidth && ty < this.g.mapHeight;
  }

  private unitAt(tx: number, ty: number): number {
    const v = this.g.occupancy[ty]?.[tx] ?? 0;
    return v > 0 && v < MAX_UNITS ? v : 0;
  }

  private isOwnBuildingOrUnit(tx: number, ty: number, unitHint: number): boolean {
    const v = this.g.occupancy[ty]?.[tx] ?? 0;
    return (unitHint > 0 && unitHint <= LAST_VILLAGER) || (v > 0 && v <= LAST_VILLAGER) || (v < 0 && v > -61);
  }

  /** hoveredUnit as the engine's `updateHoveredUnit` would compute it, preferring the renderer's hit. */
  private hoverFor(tx: number, ty: number, unitHint: number): number {
    const g = this.g;
    const commanding = g.interactionMode === Mode.COMMANDING;
    const candidate = unitHint > 0 ? unitHint : this.unitAt(tx, ty);
    if (candidate >= FIRST_ENEMY && candidate <= LAST_ENEMY) return commanding ? candidate : 0;
    if (candidate > 0 && candidate <= LAST_VILLAGER) return commanding ? 0 : candidate;
    return 0;
  }

  private pinCursor(tx: number, ty: number): void {
    const g = this.g;
    g.cameraX = 0;
    g.cameraY = 0;
    g.cursorX = tx;
    g.cursorY = ty;
  }

  private preparePlacement(tx: number, ty: number): void {
    const g = this.g;
    const p = this.previewAt(tx, ty);
    if (!p) return;
    if (p.kind === 'building') {
      g.placementX = p.x;
      g.placementY = p.y;
      // placeBuilding() stores contextItems[contextCursor] as the building type.
      if (this.chosenBuilding >= 0 && this.chosenIndex >= 0) {
        g.contextCursor = this.chosenIndex;
        g.contextItems[this.chosenIndex] = this.chosenBuilding;
      }
    } else if (p.kind === 'unit-target') {
      const u = this.unitAt(tx, ty);
      g.targetVillager = u;
      g.hoveredUnit = u;
      g.placementX = tx;
      g.placementY = ty;
    }
    g.placementValid = p.valid;
  }
}
