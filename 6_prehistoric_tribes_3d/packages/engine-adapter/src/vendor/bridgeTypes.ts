export interface OverlayHandlers {
  showLoading: () => void;
  showStatus: (text: string) => void;
  hide: () => void;
  notice: (text: string) => void;
  showError: (text: string, err?: unknown) => void;
}

export interface OverlayState {
  visible: boolean;
  status: string;
  isError: boolean;
  notice: string | null;
}

export interface LocaleTextData {
  labels: {
    buildings: string[];
    items: string[];
    commands: string[];
    notices: string[];
    menuItems: string[];
    levels: string[];
    languages: string[];
    pageTitles: string[];
    roles: string[];
    villagerNames: string[];
  };
}

export interface VillagerRow {
  id: number;
  name: string;
  isChief: boolean;
  isChild: boolean;
  gender: 'M' | 'F';
  age: number;
  hp: number;
  maxHp: number;
  food: number;
  energy: number;
  happiness: number;
  weaponName: string;
  meleeSkill: number;
  throwingSkill: number;
  scoutingSkill: number;
  gatheringSkill: number;
  buildingSkill: number;
  topSkillText: string;
}

export interface BuildingSummary {
  id: number;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
}

export interface GameSnapshot {
  ready: boolean;
  gameState: number; // 0=MENU, 1=PLAYING, 2=STARTING
  screen: number;
  level: number;
  levelName: string;
  language: number;
  musicOn: boolean;
  musicVolume: number;
  zoomOut: number;
  maxZoomOut: number;
  loopPaused: boolean;
  population: number;
  livingSpace: number;
  meals: number;
  food: number;
  wood: number;
  stones: number;
  bones: number;
  alertType: number;
  alertText: string;
  callToArms: boolean;
  formUp: boolean;
  selectedVillager: VillagerRow | null;
  selectedBuilding: BuildingSummary | null;
  villagers: VillagerRow[];
}

export interface EngineEnums {
  ui: { MENU: number; PLAYING: number; STARTING: number };
  z: Record<string, number>;
  B: Record<string, number>;
  w: { PLAYER: number; ENEMY: number };
  D: Record<string, number>;
  y: Record<string, number>;
  O: Record<string, number>;
}

export interface EngineController {
  game: any;
  input: any;
  viewport: any;
  audio: any;
  loop: any;
  enums: EngineEnums;
  getLanguage: () => number;
  setLanguage: (langIdx: number) => boolean;
  toggleMusic: () => void;
  setMusicVolume: (vol: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  tapKey: (keyCode: number) => void;
  tapShortcut: (digit: number) => void;
  selectVillager: (uid: number) => void;
  focusChief: () => void;
  openBuildMenu: () => void;
  triggerVillageCommand: (cmdCode: number) => void;
  togglePauseLoop: () => boolean;
  unmount: () => void;
}
