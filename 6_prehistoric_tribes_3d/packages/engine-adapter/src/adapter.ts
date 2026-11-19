/**
 * EngineAdapter — runs the ORIGINAL simulation from ptCore.js headless (its own canvas hidden),
 * jumps straight into a level (no menus), and drives ticks itself so a new renderer/HUD can read
 * the state. Verified in T0: `updateSimulation()` without rendering is deterministic and matches
 * the live game loop.
 */
import { mountPrehistoricTribes } from './vendor/ptCore.js';
import type { EngineController } from './vendor/bridgeTypes.js';
import { EngineCommands, type EngineInternals } from './commands.js';
import type { WorldView } from './world.js';

/** Engine UI states (enum `ui`) and the gameplay screen id (enum `z`). */
const PLAYING = 1;
const SCREEN_GAMEPLAY = 28;
/** Original frame delay: 120 ms (~8.3 ticks/s); "fast" mode in the original was 50 ms. */
export const TICK_MS = 120;

export interface AdapterOptions {
  /** URL prefix where `res/` and `music/` are served. */
  baseUrl: string;
  /** Element that will hold the engine's hidden DOM (defaults to document.body). */
  host?: HTMLElement;
}

export type AdapterEvent =
  | { kind: 'tick'; tick: number }
  | { kind: 'levelStarted'; level: number }
  /** The engine asked for a menu/cutscene/story screen; v1 shims it and keeps playing. */
  | { kind: 'screenRequested'; tick: number; screen: number; gameState: number }
  /** Selection / panel / placement changed because of a player command. */
  | { kind: 'interaction' }
  | { kind: 'error'; error: unknown };

type Listener = (e: AdapterEvent) => void;

/** Minimal structural type for the parts of the engine `game` object the adapter touches. */
interface EngineGame extends WorldView {
  level: number;
  gameState: number;
  screen: number;
  returnScreen: number;
  cutsceneActive: boolean;
  gameTick: number;
  musicLevel: number;
  levels: { start(level: number): void };
  updatePlayingFrame(): void;
  requestPaint: () => void;
  stopMusic?: () => void;
}

export class EngineAdapter {
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<Listener>();
  private speed = 1;
  readonly ticksPerSecond = 1000 / TICK_MS;
  /** Pointer/touch commands routed through the original input handlers. */
  readonly commands: EngineCommands;

  private constructor(
    private readonly controller: EngineController,
    private readonly game: EngineGame,
    private readonly hostEl: HTMLElement,
  ) {
    this.commands = new EngineCommands(
      game as unknown as EngineInternals,
      (cmd) => controller.triggerVillageCommand(cmd),
      () => controller.openBuildMenu(),
    );
  }

  /** Run a command and tell listeners (HUD) that the interaction state changed. */
  act<T>(fn: (c: EngineCommands) => T): T {
    const r = fn(this.commands);
    this.emit({ kind: 'interaction' });
    return r;
  }

  static async create(opts: AdapterOptions): Promise<EngineAdapter> {
    const host = opts.host ?? document.body;
    const hidden = document.createElement('div');
    hidden.setAttribute('aria-hidden', 'true');
    hidden.style.cssText = 'position:fixed;left:-10000px;top:0;width:240px;height:320px;overflow:hidden;pointer-events:none;';
    const app = document.createElement('div');
    const stage = document.createElement('div');
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 320;
    stage.appendChild(canvas);
    app.appendChild(stage);
    hidden.appendChild(app);
    host.appendChild(hidden);

    const noop = (): void => {};
    const controller = await mountPrehistoricTribes({
      appEl: app,
      stageEl: stage,
      canvasEl: canvas,
      baseUrl: opts.baseUrl,
      // The new UI owns the keyboard; the original engine must not react to keys.
      shouldIgnoreKey: () => true,
      overlayHandlers: { showLoading: noop, showStatus: noop, hide: noop, notice: noop, showError: noop },
    });
    const ctrl = controller as EngineController & { loop: { pause(): void } };
    ctrl.loop.pause();
    const game = ctrl.game as unknown as EngineGame;
    game.musicLevel = 0;
    game.stopMusic?.();
    // The original renderer must stay idle: window resizes would otherwise make it repaint its
    // hidden 240x320 canvas (wasted work, and "Region exceeds source image bounds" errors).
    game.requestPaint = () => {};
    return new EngineAdapter(controller, game, hidden);
  }

  get world(): WorldView {
    return this.game;
  }

  get tick(): number {
    return this.game.gameTick;
  }

  get running(): boolean {
    return this.timer !== null;
  }

  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Load a level directly (0 = tutorial, 7..11 = custom maps) and pause. */
  startLevel(level: number): void {
    this.pause();
    const g = this.game;
    g.level = level;
    g.levels.start(level);
    this.commands.reset();
    this.forcePlaying();
    this.emit({ kind: 'levelStarted', level });
  }

  /** Advance exactly one original frame of gameplay. */
  step(): void {
    const g = this.game;
    try {
      g.updatePlayingFrame();
    } catch (error) {
      this.pause();
      this.emit({ kind: 'error', error });
      return;
    }
    this.commands.onTick();
    if (g.gameState !== PLAYING || g.screen !== SCREEN_GAMEPLAY) {
      this.emit({ kind: 'screenRequested', tick: g.gameTick, screen: g.screen, gameState: g.gameState });
      this.forcePlaying(); // TODO(T26): route story/cutscene screens to the new UI instead.
    }
    this.emit({ kind: 'tick', tick: g.gameTick });
  }

  resume(): void {
    if (this.timer !== null) return;
    this.timer = setInterval(() => {
      for (let i = 0; i < this.speed; i++) this.step();
    }, TICK_MS);
  }

  pause(): void {
    if (this.timer === null) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  /** 1 = original speed; 2..4 run several ticks per interval. */
  setSpeed(multiplier: number): void {
    this.speed = Math.max(1, Math.min(4, Math.floor(multiplier)));
  }

  dispose(): void {
    this.pause();
    this.listeners.clear();
    this.controller.unmount();
    this.hostEl.remove();
  }

  private forcePlaying(): void {
    const g = this.game;
    g.gameState = PLAYING;
    g.screen = SCREEN_GAMEPLAY;
    g.returnScreen = SCREEN_GAMEPLAY;
    g.cutsceneActive = false;
  }

  private emit(e: AdapterEvent): void {
    for (const l of this.listeners) l(e);
  }
}
