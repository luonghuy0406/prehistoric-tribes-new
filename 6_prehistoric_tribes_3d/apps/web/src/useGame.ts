import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Cmd,
  EngineAdapter,
  Mode,
  Stat,
  TICK_MS,
  Tribe,
  type EngineCommands,
  type InteractionState,
  type WorldView,
} from '@pt3d/engine-adapter';
import { Renderer2D, type WorldRect } from '@pt3d/render2d';

export interface HudStats {
  tick: number;
  food: number;
  meals: number;
  wood: number;
  stones: number;
  bones: number;
  population: number;
  livingSpace: number;
  enemyPopulation: number;
  chief: number;
}

export type Status = 'loading' | 'ready' | 'error';

const EMPTY_STATS: HudStats = { tick: 0, food: 0, meals: 0, wood: 0, stones: 0, bones: 0, population: 0, livingSpace: 0, enemyPopulation: 0, chief: 0 };
const EMPTY_UI: InteractionState = {
  mode: 0,
  selectedVillager: 0,
  selectedBuilding: 0,
  selectedUnits: [],
  placingType: null,
  placingRally: false,
  callToArms: false,
  formUp: false,
  rallyPoint: [0, 0],
  panel: null,
  contextItems: [],
};
const ORDER_COLOR = 0xfff3a0;
const ATTACK_COLOR = 0xd94141;

/** Touch placement is two-step: first tap positions the ghost, "Xây ở đây" confirms. */
export interface PendingPlacement {
  tx: number;
  ty: number;
  valid: boolean;
}

export function useGame(initialLevel: number) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const adapterRef = useRef<EngineAdapter | null>(null);
  const rendererRef = useRef<Renderer2D | null>(null);
  const pendingRef = useRef<PendingPlacement | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<HudStats>(EMPTY_STATS);
  const [ui, setUi] = useState<InteractionState>(EMPTY_UI);
  const [running, setRunning] = useState(false);
  const [level, setLevel] = useState(initialLevel);
  const [boxMode, setBoxModeState] = useState(false);
  const [pending, setPendingState] = useState<PendingPlacement | null>(null);
  const [placingBuilding, setPlacingBuilding] = useState(-1);
  const [tickVersion, setTickVersion] = useState(0);
  const uiSig = useRef('');

  const setPending = useCallback((p: PendingPlacement | null) => {
    pendingRef.current = p;
    setPendingState(p);
  }, []);

  const refresh = useCallback(() => {
    const a = adapterRef.current;
    if (!a) return;
    const p = a.world.tribeStats[Tribe.PLAYER];
    const e = a.world.tribeStats[Tribe.ENEMY];
    setStats({
      tick: a.tick,
      food: p?.[Stat.FOOD] ?? 0,
      meals: p?.[Stat.MEALS] ?? 0,
      wood: p?.[Stat.WOOD] ?? 0,
      stones: p?.[Stat.STONES] ?? 0,
      bones: p?.[Stat.BONES] ?? 0,
      population: p?.[Stat.POPULATION] ?? 0,
      livingSpace: p?.[Stat.LIVING_SPACE] ?? 0,
      enemyPopulation: e?.[Stat.POPULATION] ?? 0,
      chief: p?.[Stat.CHIEF] ?? 0,
    });
    const next = a.commands.state();
    const sig = JSON.stringify(next);
    if (sig !== uiSig.current) {
      uiSig.current = sig;
      setUi(next);
    }
    setPlacingBuilding(a.commands.placingBuilding);
    if (next.mode !== Mode.PLACING && pendingRef.current) setPending(null);
    setTickVersion((v) => (v + 1) % 1_000_000);
  }, [setPending]);

  /** Run a command, then refresh the HUD immediately. */
  const act = useCallback(
    <T,>(fn: (c: EngineCommands) => T): T | undefined => {
      const a = adapterRef.current;
      if (!a) return undefined;
      const r = a.act(fn);
      refresh();
      return r;
    },
    [refresh],
  );

  // Boot engine + renderer once.
  useEffect(() => {
    let disposed = false;
    const host = hostRef.current;
    if (!host) return;
    (async () => {
      try {
        const [adapter, renderer] = await Promise.all([EngineAdapter.create({ baseUrl: './original/' }), Renderer2D.create(host, './hd/')]);
        if (disposed) {
          adapter.dispose();
          renderer.destroy();
          return;
        }
        adapterRef.current = adapter;
        rendererRef.current = renderer;
        const c = adapter.commands;
        renderer.providers = {
          selection: () => {
            const s = c.state();
            return { units: s.selectedUnits, building: s.selectedBuilding };
          },
          ghost: (tx, ty) => {
            const p = pendingRef.current;
            return p ? c.previewAt(p.tx, p.ty) : c.previewAt(tx, ty);
          },
          rally: () => {
            const s = c.state();
            return s.callToArms || s.formUp ? { x: s.rallyPoint[0], y: s.rallyPoint[1] } : null;
          },
        };
        wireGestures(adapter, renderer);
        adapter.on((ev) => {
          if (ev.kind === 'tick') {
            renderer.onTick();
            refresh();
          } else if (ev.kind === 'error') {
            setError(String(ev.error));
            setStatus('error');
            setRunning(false);
          }
        });
        (window as unknown as { __pt: unknown }).__pt = { adapter, renderer };
        setStatus('ready');
      } catch (e) {
        setError(String(e));
        setStatus('error');
      }
    })();

    function wireGestures(adapter: EngineAdapter, renderer: Renderer2D): void {
      const c = adapter.commands;
      const tile = (wx: number, wy: number) => renderer.tileAt(wx, wy);
      renderer.camera.handlers.tap = (wx, wy, { double, touch }) => {
        const t = tile(wx, wy);
        const before = c.state();
        if (before.mode === Mode.PLACING && !before.placingRally && touch) {
          // Touch: position the ghost first; confirm with the HUD button (or tap the same tile again).
          const p = pendingRef.current;
          if (p && p.tx === t.x && p.ty === t.y && p.valid) {
            confirmAt(t.x, t.y);
            return;
          }
          renderer.setHover(wx, wy);
          const g = c.previewAt(t.x, t.y);
          setPending({ tx: t.x, ty: t.y, valid: g?.valid ?? false });
          return;
        }
        const hint = renderer.pickUnit(wx, wy);
        adapter.act((cc) => cc.tap(t.x, t.y, hint, double));
        const after = c.state();
        if (before.mode === Mode.COMMANDING && after.mode === Mode.COMMANDING && after.selectedUnits.join() === before.selectedUnits.join()) {
          renderer.flash(t.x, t.y, hint > 50 ? ATTACK_COLOR : ORDER_COLOR);
        } else if (before.mode === Mode.PLACING) {
          renderer.flash(t.x, t.y, 0x58c75a);
        }
        refresh();
      };
      renderer.camera.handlers.order = (wx, wy, { double }) => {
        const t = tile(wx, wy);
        const hint = renderer.pickUnit(wx, wy);
        const s = c.state();
        if (s.mode === Mode.PLACING) {
          adapter.act((cc) => cc.cancel());
          setPending(null);
        } else if (s.selectedUnits.length > 0) {
          adapter.act((cc) => cc.order(t.x, t.y, hint, double));
          renderer.flash(t.x, t.y, hint > 50 ? ATTACK_COLOR : ORDER_COLOR);
        } else {
          adapter.act((cc) => cc.cancel());
        }
        refresh();
      };
      renderer.camera.handlers.box = (r: WorldRect) => {
        const a = tile(r.x, r.y);
        const b = tile(r.x + r.w, r.y + r.h);
        adapter.act((cc) => cc.boxSelect(a.x, a.y, b.x, b.y));
        refresh();
      };
      function confirmAt(tx: number, ty: number): void {
        adapter.act((cc) => cc.tap(tx, ty));
        renderer.flash(tx, ty, 0x58c75a);
        setPending(null);
        refresh();
      }
    }

    return () => {
      disposed = true;
      adapterRef.current?.dispose();
      rendererRef.current?.destroy();
      adapterRef.current = null;
      rendererRef.current = null;
    };
  }, [refresh, setPending]);

  // (Re)start level.
  useEffect(() => {
    const a = adapterRef.current;
    const r = rendererRef.current;
    if (status !== 'ready' || !a || !r) return;
    a.startLevel(level);
    r.setWorld(a.world, TICK_MS);
    setPending(null);
    refresh();
    a.resume();
    setRunning(true);
  }, [status, level, refresh, setPending]);

  const toggleRun = useCallback(() => {
    const a = adapterRef.current;
    if (!a) return;
    if (a.running) a.pause();
    else a.resume();
    setRunning(a.running);
  }, []);

  const setSpeed = useCallback((s: number) => adapterRef.current?.setSpeed(s), []);

  const setBoxMode = useCallback((on: boolean) => {
    const r = rendererRef.current;
    if (r) r.camera.boxMode = on;
    setBoxModeState(on);
  }, []);

  const confirmPending = useCallback(() => {
    const p = pendingRef.current;
    const r = rendererRef.current;
    if (!p || !p.valid) return;
    act((c) => c.tap(p.tx, p.ty));
    r?.flash(p.tx, p.ty, 0x58c75a);
    setPending(null);
  }, [act, setPending]);

  const focusChief = useCallback(() => {
    const a = adapterRef.current;
    const r = rendererRef.current;
    if (!a || !r) return;
    const chief = a.world.tribeStats[Tribe.PLAYER]?.[Stat.CHIEF] ?? 0;
    if (chief > 0) {
      act((c) => c.selectVillager(chief));
      r.focusUnit(chief);
    }
  }, [act]);

  const focusUnit = useCallback((id: number) => rendererRef.current?.focusUnit(id), []);
  const zoom = useCallback((f: number) => rendererRef.current?.camera.zoomBy(f), []);

  const world: WorldView | undefined = adapterRef.current?.world;
  const commands: EngineCommands | undefined = adapterRef.current?.commands;

  return {
    hostRef,
    status,
    error,
    stats,
    ui,
    running,
    level,
    setLevel,
    toggleRun,
    setSpeed,
    act,
    boxMode,
    setBoxMode,
    pending,
    confirmPending,
    cancelPending: () => setPending(null),
    placingBuilding,
    focusChief,
    focusUnit,
    zoom,
    world,
    commands,
    tickVersion,
    Cmd,
  };
}
