import { useCallback, useEffect, useRef, useState } from 'react';
import { EngineAdapter, Stat, TICK_MS, Tribe } from '@pt3d/engine-adapter';
import { Renderer2D, type Selection } from '@pt3d/render2d';

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
}

export type Status = 'loading' | 'ready' | 'error';

const EMPTY: HudStats = { tick: 0, food: 0, meals: 0, wood: 0, stones: 0, bones: 0, population: 0, livingSpace: 0, enemyPopulation: 0 };

export function useGame(initialLevel: number) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const adapterRef = useRef<EngineAdapter | null>(null);
  const rendererRef = useRef<Renderer2D | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<HudStats>(EMPTY);
  const [running, setRunning] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [level, setLevel] = useState(initialLevel);
  const [screenRequests, setScreenRequests] = useState(0);

  const readStats = useCallback(() => {
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
    });
  }, []);

  useEffect(() => {
    let disposed = false;
    const host = hostRef.current;
    if (!host) return;
    (async () => {
      try {
        const [adapter, renderer] = await Promise.all([EngineAdapter.create({ baseUrl: './' }), Renderer2D.create(host)]);
        if (disposed) {
          adapter.dispose();
          renderer.destroy();
          return;
        }
        adapterRef.current = adapter;
        rendererRef.current = renderer;
        renderer.onSelect = setSelection;
        adapter.on((ev) => {
          if (ev.kind === 'tick') {
            renderer.onTick();
            readStats();
          } else if (ev.kind === 'screenRequested') {
            setScreenRequests((n) => n + 1);
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
    return () => {
      disposed = true;
      adapterRef.current?.dispose();
      rendererRef.current?.destroy();
      adapterRef.current = null;
      rendererRef.current = null;
    };
  }, [readStats]);

  useEffect(() => {
    const a = adapterRef.current;
    const r = rendererRef.current;
    if (status !== 'ready' || !a || !r) return;
    a.startLevel(level);
    r.setWorld(a.world, TICK_MS);
    setSelection(null);
    readStats();
    a.resume();
    setRunning(true);
  }, [status, level, readStats]);

  const toggleRun = useCallback(() => {
    const a = adapterRef.current;
    if (!a) return;
    if (a.running) a.pause();
    else a.resume();
    setRunning(a.running);
  }, []);

  const setSpeed = useCallback((s: number) => adapterRef.current?.setSpeed(s), []);

  return { hostRef, status, error, stats, running, selection, level, setLevel, toggleRun, setSpeed, screenRequests, adapterRef };
}
