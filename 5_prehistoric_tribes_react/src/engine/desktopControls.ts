import type { EngineController } from './bridgeTypes';

/**
 * Desktop (keyboard + mouse) control layer sitting on top of the phone-style engine input.
 *
 *  - WASD pans the camera smoothly while playing (held key); in menus it behaves like arrow keys.
 *  - Single-key hotkeys for the most common actions (chief, build, minimap, village commands, pause).
 *  - Tab / Shift+Tab cycles through living villagers.
 */

const PAN_KEYS: Record<string, [number, number]> = {
  KeyW: [0, -1],
  KeyS: [0, 1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
};

const MENU_NAV: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
  KeyW: 'UP',
  KeyS: 'DOWN',
  KeyA: 'LEFT',
  KeyD: 'RIGHT',
};

const HOTKEY_CODES = new Set(['Space', 'KeyH', 'KeyB', 'KeyM', 'KeyC', 'KeyF', 'KeyX', 'KeyP', 'Tab']);
const PAN_INTERVAL_MS = 70;
const MAX_UNIT_ID = 50;

export interface DesktopControls {
  onKeyDown: (ev: KeyboardEvent) => boolean;
  onKeyUp: (ev: KeyboardEvent) => boolean;
  reset: () => void;
}

export function createDesktopControls(ctrl: EngineController): DesktopControls {
  const { game, input, enums } = ctrl;
  const held = new Map<string, 'pan' | number>();
  let timer: number | null = null;
  let stepPending = false;

  const canPan = (snap: any) =>
    snap.gameState === enums.ui.PLAYING &&
    snap.interactionMode !== enums.D.CONTEXT_MENU &&
    snap.interactionMode !== enums.D.CONFIRMING &&
    !snap.cutscene &&
    !snap.boxSelecting;

  const panStep = () => {
    if (stepPending) return;
    let dx = 0;
    let dy = 0;
    for (const [code, mode] of held) {
      if (mode !== 'pan') continue;
      dx += PAN_KEYS[code][0];
      dy += PAN_KEYS[code][1];
    }
    dx = Math.sign(dx);
    dy = Math.sign(dy);
    if (dx === 0 && dy === 0) return;
    stepPending = true;
    input.schedule(() => {
      stepPending = false;
      if (!canPan(game.touch.snapshot())) return true;
      return game.touch.pan(dx, dy);
    }, 1);
  };

  const startTimer = () => {
    if (timer !== null) return;
    panStep();
    timer = window.setInterval(panStep, PAN_INTERVAL_MS);
  };

  const stopTimerIfIdle = () => {
    for (const mode of held.values()) if (mode === 'pan') return;
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const cycleVillager = (dir: 1 | -1) => {
    const alive: number[] = [];
    for (let id = 1; id <= MAX_UNIT_ID; id++) {
      if ((game.units.hp[id] ?? 0) > 0) alive.push(id);
    }
    if (alive.length === 0) return;
    const cur = alive.indexOf(game.selectedVillager ?? 0);
    const next = alive[(cur + dir + alive.length) % alive.length];
    ctrl.selectVillager(next);
  };

  const hotkey = (ev: KeyboardEvent, snap: any): boolean => {
    const free = snap.interactionMode === enums.D.FREE_CURSOR || snap.interactionMode === enums.D.COMMANDING;
    if (snap.gameState !== enums.ui.PLAYING || snap.cutscene || !free) return false;
    if (ev.repeat) return HOTKEY_CODES.has(ev.code);
    switch (ev.code) {
      case 'Space':
      case 'KeyH':
        ctrl.focusChief();
        return true;
      case 'KeyB':
        ctrl.openBuildMenu();
        return true;
      case 'KeyM':
        ctrl.tapShortcut(3);
        return true;
      case 'KeyC':
        ctrl.triggerVillageCommand(enums.y.CALL_TO_ARMS);
        return true;
      case 'KeyF':
        ctrl.triggerVillageCommand(enums.y.FORM_UP);
        return true;
      case 'KeyX':
        ctrl.triggerVillageCommand(enums.y.BACK_TO_WORK);
        return true;
      case 'KeyP':
        ctrl.togglePauseLoop();
        return true;
      case 'Tab':
        cycleVillager(ev.shiftKey ? -1 : 1);
        return true;
      default:
        return false;
    }
  };

  const blurButton = () => {
    const el = document.activeElement as HTMLElement | null;
    if (el && el.tagName === 'BUTTON') el.blur();
  };

  const reset = () => {
    for (const mode of held.values()) if (mode !== 'pan') input.release(mode);
    held.clear();
    stopTimerIfIdle();
  };

  return {
    onKeyDown(ev) {
      if (ev.ctrlKey && !ev.metaKey && !ev.altKey && (ev.code === 'Digit7' || ev.code === 'Digit9')) {
        // Assign current selection to group: the engine expects the shortcut key to be held for a few frames.
        if (ev.repeat) return true;
        const g = game.touch.snapshot();
        if (g.gameState === enums.ui.PLAYING && g.interactionMode === enums.D.COMMANDING) {
          const key = enums.O[ev.code === 'Digit7' ? 'NUM7' : 'NUM9'];
          input.press(key);
          window.setTimeout(() => input.release(key), 400);
        }
        return true;
      }
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return false;
      const snap = game.touch.snapshot();
      if (PAN_KEYS[ev.code]) {
        blurButton();
        if (ev.repeat || held.has(ev.code)) return true;
        if (canPan(snap)) {
          held.set(ev.code, 'pan');
          startTimer();
        } else {
          const key = enums.O[MENU_NAV[ev.code]];
          held.set(ev.code, key);
          input.press(key);
        }
        return true;
      }
      if (hotkey(ev, snap)) {
        blurButton();
        return true;
      }
      return false;
    },
    onKeyUp(ev) {
      const mode = held.get(ev.code);
      if (mode === undefined) return false;
      if (mode !== 'pan') input.release(mode);
      held.delete(ev.code);
      stopTimerIfIdle();
      return true;
    },
    reset,
  };
}
