import { useEffect, useMemo, useState } from 'react';
import { Cmd, Mode } from '@pt3d/engine-adapter';
import { BuildSheet } from './hud/BuildSheet';
import { Dock } from './hud/Dock';
import { SelectionCard } from './hud/SelectionCard';
import { TopBar } from './hud/TopBar';
import { BUILDING_NAMES } from './labels';
import { useGame } from './useGame';

const DEFAULT_LEVEL = 7;

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(() => window.matchMedia('(pointer: coarse)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const on = () => setCoarse(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return coarse;
}

function useVillagerNames(): string[] {
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    fetch('./original/res/text/en.json')
      .then((r) => r.json() as Promise<{ labels?: { villagerNames?: string[] } }>)
      .then((j) => setNames(j.labels?.villagerNames ?? []))
      .catch(() => setNames([]));
  }, []);
  return names;
}

export function App() {
  const game = useGame(DEFAULT_LEVEL);
  const touch = useCoarsePointer();
  const villagerNames = useVillagerNames();
  const { ui, act, commands, world } = game;
  const buildOpen = ui.panel === 'build';
  const placing = ui.mode === Mode.PLACING;
  const buildOptions = useMemo(() => (buildOpen && commands ? commands.buildOptions() : []), [buildOpen, commands, ui]);

  const actions = useMemo(
    () => ({
      build: () => act((c) => (buildOpen ? c.cancel() : c.openBuildMenu())),
      callToArms: () => act((c) => c.village(Cmd.CALL_TO_ARMS)),
      formUp: () => act((c) => c.village(Cmd.FORM_UP)),
      backToWork: () => act((c) => c.village(Cmd.BACK_TO_WORK)),
      selectAll: () => act((c) => c.selectAllVillagers()),
      cancel: () => {
        game.cancelPending();
        act((c) => c.cancel());
      },
    }),
    [act, buildOpen, game],
  );

  // Keyboard shortcuts (desktop).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? '';
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === 'a') {
        e.preventDefault();
        actions.selectAll();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (k === 'escape') actions.cancel();
      else if (k === 'b') actions.build();
      else if (k === 'c') actions.callToArms();
      else if (k === 'f') actions.formUp();
      else if (k === 'h') actions.backToWork();
      else if (k === 'p') game.toggleRun();
      else if (k === ' ') {
        e.preventDefault();
        game.focusChief();
      } else if (k === '+' || k === '=') game.zoom(1.2);
      else if (k === '-') game.zoom(1 / 1.2);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actions, game]);

  const placingLabel = ui.placingRally
    ? ui.formUp || !ui.callToArms
      ? 'Chọn điểm tập hợp'
      : 'Chọn điểm báo động'
    : game.placingBuilding >= 0
      ? `Đặt ${BUILDING_NAMES[game.placingBuilding] ?? 'công trình'}`
      : 'Chọn mục tiêu cho phép thuật';

  return (
    <main className={touch ? 'app touch' : 'app'}>
      <div className="stage" ref={game.hostRef} />

      <TopBar stats={game.stats} running={game.running} level={game.level} onToggleRun={game.toggleRun} onSpeed={game.setSpeed} onLevel={game.setLevel} />

      {placing && (
        <div className="banner" role="status">
          <strong>{placingLabel}</strong>
          <span className="banner-hint">
            {touch
              ? game.pending
                ? game.pending.valid
                  ? 'Chạm lại hoặc bấm "Xây ở đây"'
                  : 'Vị trí không hợp lệ — chạm chỗ khác'
                : 'Chạm vào bản đồ'
              : 'Click để đặt · chuột phải / Esc để huỷ'}
          </span>
          {touch && game.pending?.valid && !ui.placingRally && (
            <button type="button" className="action primary" onClick={game.confirmPending}>
              Xây ở đây
            </button>
          )}
          <button type="button" className="action" onClick={actions.cancel}>
            Huỷ
          </button>
        </div>
      )}

      {buildOpen && commands && (
        <BuildSheet options={buildOptions} commands={commands} stats={game.stats} onChoose={(t) => act((c) => c.chooseBuilding(t))} onClose={actions.cancel} />
      )}

      {!buildOpen && !placing && world && commands && (
        <SelectionCard ui={ui} world={world} commands={commands} villagerNames={villagerNames} onAct={(fn) => act(fn)} onFocus={game.focusUnit} />
      )}

      <Dock
        ui={ui}
        buildOpen={buildOpen}
        boxMode={game.boxMode}
        touch={touch}
        onBuild={actions.build}
        onCallToArms={actions.callToArms}
        onFormUp={actions.formUp}
        onBackToWork={actions.backToWork}
        onChief={game.focusChief}
        onSelectAll={actions.selectAll}
        onBoxMode={game.setBoxMode}
        onCancel={actions.cancel}
      />

      {!touch && ui.selectedUnits.length === 0 && !placing && !buildOpen && ui.selectedBuilding === 0 && (
        <p className="hint">Click chọn dân · kéo chuột trái để chọn vùng · chuột phải ra lệnh · kéo chuột phải / WASD để di chuyển · cuộn để zoom</p>
      )}

      {game.status !== 'ready' && <div className="overlay">{game.status === 'loading' ? 'Đang tải engine gốc…' : `Lỗi: ${game.error}`}</div>}
    </main>
  );
}
