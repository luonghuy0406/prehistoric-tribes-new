import { useCallback, useEffect, useRef, useState } from 'react';
import { mountPrehistoricTribes } from './ptCore';
import type {
  BuildingSummary,
  EngineController,
  GameSnapshot,
  LocaleTextData,
  OverlayState,
  VillagerRow,
} from './bridgeTypes';

const LOCALE_CODES = ['en', 'fr', 'it', 'de', 'es'] as const;

const INITIAL_SNAPSHOT: GameSnapshot = {
  ready: false,
  gameState: 0,
  screen: 0,
  level: 0,
  levelName: 'Prehistoric Tribes',
  language: 0,
  musicOn: true,
  musicVolume: 4,
  zoomOut: 0,
  maxZoomOut: 0,
  loopPaused: false,
  population: 0,
  livingSpace: 0,
  meals: 0,
  food: 0,
  wood: 0,
  stones: 0,
  bones: 0,
  alertType: 0,
  alertText: '',
  callToArms: false,
  formUp: false,
  selectedVillager: null,
  selectedBuilding: null,
  villagers: [],
};

function capWords(s: string): string {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

function readTopSkill(u: any, id: number): string {
  const candidates: Array<[string, number]> = [
    ['Chiến', u.meleeSkill[id]],
    ['Ném', u.throwingSkill[id]],
    ['Thám', u.scoutingSkill[id]],
    ['Hái', u.gatheringSkill[id]],
    ['Xây', u.buildingSkill[id]],
    ['Rèn', u.craftingSkill[id]],
    ['Bếp', u.cookingSkill[id]],
    ['Trị', u.healingSkill[id]],
    ['DJ', u.djSkill[id]],
  ];
  candidates.sort((a, b) => b[1] - a[1]);
  return candidates
    .slice(0, 2)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ');
}

function buildVillagerRow(
  id: number,
  u: any,
  chiefId: number,
  locale: LocaleTextData | null,
): VillagerRow {
  const nameIdx = u.name[id] ?? 0;
  const rawName = locale?.labels.villagerNames?.[nameIdx] || `Unit #${id}`;
  const weaponCode = u.weapon[id];
  const rawWeapon =
    weaponCode >= 0 && weaponCode <= 5
      ? locale?.labels.items?.[weaponCode] || `W#${weaponCode}`
      : 'Tay không';

  return {
    id,
    name: capWords(rawName),
    isChief: id === chiefId,
    isChild: (u.age[id] ?? 0) < 12,
    gender: u.gender[id] === 1 ? 'F' : 'M',
    age: u.age[id] ?? 0,
    hp: u.hp[id] ?? 0,
    maxHp: Math.max(1, u.maxHp[id] ?? 1),
    food: u.food[id] ?? 0,
    energy: u.energy[id] ?? 0,
    happiness: u.happiness[id] ?? 0,
    weaponName: capWords(rawWeapon),
    meleeSkill: u.meleeSkill[id] ?? 0,
    throwingSkill: u.throwingSkill[id] ?? 0,
    scoutingSkill: u.scoutingSkill[id] ?? 0,
    gatheringSkill: u.gatheringSkill[id] ?? 0,
    buildingSkill: u.buildingSkill[id] ?? 0,
    topSkillText: readTopSkill(u, id),
  };
}

export function useGameEngine(modalOpen: boolean) {
  const appRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<EngineController | null>(null);
  const modalOpenRef = useRef(modalOpen);
  modalOpenRef.current = modalOpen;

  const localesCacheRef = useRef<Record<string, LocaleTextData>>({});
  const [overlay, setOverlay] = useState<OverlayState>({
    visible: true,
    status: 'Loading…',
    isError: false,
    notice: null,
  });
  const [snapshot, setSnapshot] = useState<GameSnapshot>(INITIAL_SNAPSHOT);

  const ensureLocale = useCallback(async (langIdx: number) => {
    const code = LOCALE_CODES[langIdx] ?? 'en';
    if (localesCacheRef.current[code]) return localesCacheRef.current[code];
    try {
      const res = await fetch(`./res/text/${code}.json`);
      if (res.ok) {
        const data = (await res.json()) as LocaleTextData;
        localesCacheRef.current[code] = data;
        return data;
      }
    } catch {
      // Ignore fallback fetch errors when offline
    }
    return localesCacheRef.current.en ?? null;
  }, []);

  useEffect(() => {
    ensureLocale(0);
  }, [ensureLocale]);

  useEffect(() => {
    const appEl = appRef.current;
    const stageEl = stageRef.current;
    const canvasEl = canvasRef.current;
    if (!appEl || !stageEl || !canvasEl) return;

    let cancelled = false;
    let activeController: EngineController | null = null;
    let noticeTimer: number | null = null;

    mountPrehistoricTribes({
      appEl,
      stageEl,
      canvasEl,
      baseUrl: './',
      shouldAbort: () => cancelled,
      shouldIgnoreKey: (ev) => {
        if (modalOpenRef.current) return ev.key !== 'Escape';
        const tag = (document.activeElement?.tagName || '').toUpperCase();
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      },
      overlayHandlers: {
        showLoading: () => {
          if (!cancelled) setOverlay((prev) => ({ ...prev, visible: true, status: 'Loading…', isError: false }));
        },
        showStatus: (status) => {
          if (!cancelled) setOverlay((prev) => ({ ...prev, visible: true, status, isError: false }));
        },
        hide: () => {
          if (!cancelled) setOverlay((prev) => ({ ...prev, visible: false }));
        },
        notice: (msg) => {
          if (cancelled) return;
          setOverlay((prev) => ({ ...prev, notice: msg }));
          if (noticeTimer) window.clearTimeout(noticeTimer);
          noticeTimer = window.setTimeout(() => {
            if (!cancelled) setOverlay((prev) => ({ ...prev, notice: null }));
          }, 6000);
        },
        showError: (msg) => {
          if (!cancelled) setOverlay((prev) => ({ ...prev, visible: true, status: msg, isError: true }));
        },
      },
      onReady: (ctrl) => {
        if (cancelled) {
          ctrl.unmount();
          return;
        }
        activeController = ctrl;
        controllerRef.current = ctrl;
      },
    }).then((ctrl) => {
      if (cancelled) {
        ctrl.unmount();
        return;
      }
      activeController = ctrl;
      controllerRef.current = ctrl;
    });

    return () => {
      cancelled = true;
      if (noticeTimer) window.clearTimeout(noticeTimer);
      activeController?.unmount();
      controllerRef.current = null;
    };
  }, []);

  // Poll lightweight engine telemetry at ~8Hz without disturbing 20 FPS engine loop
  useEffect(() => {
    let lastSig = '';
    const timer = window.setInterval(() => {
      const ctrl = controllerRef.current;
      if (!ctrl) return;
      const { game, viewport, loop, enums } = ctrl;
      const lang = ctrl.getLanguage();
      const code = LOCALE_CODES[lang] ?? 'en';
      const locale = localesCacheRef.current[code] ?? localesCacheRef.current.en ?? null;
      if (!localesCacheRef.current[code]) {
        void ensureLocale(lang);
      }

      const { B, w } = enums;
      const stats = game.tribeStats?.[w.PLAYER];
      const pop = stats?.[B.POPULATION] ?? 0;
      const space = stats?.[B.LIVING_SPACE] ?? 0;
      const meals = stats?.[B.MEALS] ?? 0;
      const food = stats?.[B.FOOD] ?? 0;
      const wood = stats?.[B.WOOD] ?? 0;
      const stones = stats?.[B.STONES] ?? 0;
      const bones = stats?.[B.BONES] ?? 0;
      const chiefId = stats?.[B.CHIEF] ?? 0;
      const selV = game.selectedVillager ?? 0;
      const selB = game.selectedBuilding ?? 0;
      const rawAlertType = game.alertTypes?.[0] ?? 0;
      const alertType = rawAlertType > 0 && rawAlertType < 16 ? rawAlertType : 0;
      const zoomOut = viewport.current?.zoomOut ?? 0;
      const maxZoomOut = viewport.current?.maxZoomOut ?? 0;
      const musicOn = Boolean(game.isMusicOn?.());
      const musicVolume = game.getMusicVolume?.() ?? 0;
      const loopPaused = Boolean(loop?.paused);
      const selVHp = selV > 0 ? game.units.hp[selV] : 0;
      const selBHp = selB > 0 ? game.buildings.hp[selB] : 0;

      const sig = [
        game.gameState,
        game.screen,
        game.level,
        lang,
        musicOn ? 1 : 0,
        musicVolume,
        zoomOut,
        maxZoomOut,
        loopPaused ? 1 : 0,
        pop,
        space,
        meals,
        food,
        wood,
        stones,
        bones,
        alertType,
        game.callToArms ? 1 : 0,
        game.formUp ? 1 : 0,
        selV,
        selVHp,
        selB,
        selBHp,
        game.gameState === 1 ? Math.floor((game.gameTick ?? 0) / 10) : 0,
      ].join('|');

      if (sig === lastSig) return;
      lastSig = sig;

      const chapter = game.data?.chapterOfLevel?.(game.level) ?? 0;
      const levelRaw =
        game.level === 0
          ? 'Tutorial'
          : locale?.labels.levels?.[chapter] || `Level ${game.level}`;
      const alertRaw = alertType > 0 ? locale?.labels.notices?.[alertType] || 'Alert!' : '';

      const villagers: VillagerRow[] = [];
      if (game.gameState === enums.ui.PLAYING) {
        for (let id = 1; id <= 50; id++) {
          if ((game.units.hp[id] ?? 0) > 0) {
            villagers.push(buildVillagerRow(id, game.units, chiefId, locale));
          }
        }
      }

      const selectedVillager =
        selV > 0 && (game.units.hp[selV] ?? 0) > 0
          ? buildVillagerRow(selV, game.units, chiefId, locale)
          : null;

      let selectedBuilding: BuildingSummary | null = null;
      if (selB > 0 && (game.buildings.hp[selB] ?? 0) > 0) {
        const bType = game.buildings.type[selB];
        const rawBName = locale?.labels.buildings?.[bType] || `Building #${bType}`;
        selectedBuilding = {
          id: selB,
          name: capWords(rawBName),
          level: game.buildings.level[selB] ?? 1,
          hp: game.buildings.hp[selB] ?? 0,
          maxHp: Math.max(1, game.buildings.maxHp[selB] ?? 1),
        };
      }

      setSnapshot({
        ready: true,
        gameState: game.gameState,
        screen: game.screen,
        level: game.level,
        levelName: capWords(levelRaw),
        language: lang,
        musicOn,
        musicVolume,
        zoomOut,
        maxZoomOut,
        loopPaused,
        population: pop,
        livingSpace: space,
        meals,
        food,
        wood,
        stones,
        bones,
        alertType,
        alertText: capWords(alertRaw),
        callToArms: Boolean(game.callToArms),
        formUp: Boolean(game.formUp),
        selectedVillager,
        selectedBuilding,
        villagers,
      });
    }, 125);

    return () => window.clearInterval(timer);
  }, [ensureLocale]);

  const actions = {
    zoomIn: () => controllerRef.current?.zoomIn(),
    zoomOut: () => controllerRef.current?.zoomOut(),
    toggleMusic: () => controllerRef.current?.toggleMusic(),
    setLanguage: (langIdx: number) => {
      void ensureLocale(langIdx);
      controllerRef.current?.setLanguage(langIdx);
    },
    openBuildMenu: () => controllerRef.current?.openBuildMenu(),
    openMinimap: () => controllerRef.current?.tapShortcut(3),
    jumpToAlert: () => controllerRef.current?.tapShortcut(1),
    openQuickMenu: () => controllerRef.current?.tapShortcut(0),
    openPauseMenu: () => {
      const ctrl = controllerRef.current;
      if (!ctrl) return;
      ctrl.tapKey(ctrl.enums.O.SOFT_RIGHT);
    },
    focusChief: () => controllerRef.current?.focusChief(),
    selectVillager: (uid: number) => controllerRef.current?.selectVillager(uid),
    toggleCallToArms: () => {
      const ctrl = controllerRef.current;
      if (ctrl) ctrl.triggerVillageCommand(ctrl.enums.y.CALL_TO_ARMS);
    },
    toggleFormUp: () => {
      const ctrl = controllerRef.current;
      if (ctrl) ctrl.triggerVillageCommand(ctrl.enums.y.FORM_UP);
    },
    backToWork: () => {
      const ctrl = controllerRef.current;
      if (ctrl) ctrl.triggerVillageCommand(ctrl.enums.y.BACK_TO_WORK);
    },
    toggleFreezeSim: () => controllerRef.current?.togglePauseLoop(),
  };

  return { appRef, stageRef, canvasRef, overlay, snapshot, actions };
}
