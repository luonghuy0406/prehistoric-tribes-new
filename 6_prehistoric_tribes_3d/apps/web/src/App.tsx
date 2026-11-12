import { useState } from 'react';
import { isEnemyUnit, type WorldView } from '@pt3d/engine-adapter';
import type { Selection } from '@pt3d/render2d';
import { useGame } from './useGame';

/** Level ids → names (chapter names from labels.levels; i18n comes with T24). */
const LEVELS = [
  'Tutorial',
  'Outside',
  'Revenge',
  'Escape',
  'Wastelands',
  'A New Home',
  'A New Home (finale)',
  'Custom: Great Lake',
  'Custom: Desert Pass',
  'Custom: Forest Belt',
  'Custom: Slaughter',
  'Custom: Plot of Land',
];
const BUILDINGS = ['Armoury', 'Gym', 'Hut', "Chief's Hut", 'Kitchen', 'Range', 'Store', 'Disco', 'Sanctuary', 'PIA Center', 'Nursery', 'Tower'];
const DEFAULT_LEVEL = 7;

function describe(sel: Selection | null, world: WorldView | undefined): string[] {
  if (!sel || !world) return [];
  if (sel.kind === 'unit') {
    const u = world.units;
    const i = sel.id;
    return [
      `${isEnemyUnit(i) ? 'Địch' : 'Dân'} #${i} · ${(u.gender[i] ?? 0) === 1 ? 'Nữ' : 'Nam'} · ${u.age[i] ?? 0} tuổi`,
      `HP ${u.hp[i] ?? 0}/${u.maxHp[i] ?? 0}`,
      `Ô (${u.x[i]}, ${u.y[i]}) · task ${u.task[i]} · job ${u.job[i]}`,
    ];
  }
  if (sel.kind === 'building') {
    const b = world.buildings;
    const i = sel.id;
    return [`${BUILDINGS[b.type[i] ?? 0] ?? 'Công trình'} cấp ${b.level[i] ?? 1}`, `HP ${b.hp[i] ?? 0}/${b.maxHp[i] ?? 0}`];
  }
  if (sel.kind === 'animal') {
    const a = world.animals;
    return [`Động vật #${sel.id} · loại ${a.type[sel.id] ?? 0}`, `HP ${a.hp[sel.id] ?? 0}`];
  }
  return [`Ô (${sel.tileX}, ${sel.tileY}) · mã ${sel.id}`];
}

export function App() {
  const game = useGame(DEFAULT_LEVEL);
  const [speed, setSpeedState] = useState(1);
  const info = describe(game.selection, game.adapterRef.current?.world);
  const s = game.stats;

  return (
    <main className="app">
      <div className="stage" ref={game.hostRef} />

      <header className="hud-top">
        <div className="brand">Prehistoric Tribes <span>Remastered · bản thử</span></div>
        <div className="resources">
          <Res label="Thức ăn" value={s.food} />
          <Res label="Bữa ăn" value={s.meals} />
          <Res label="Gỗ" value={s.wood} />
          <Res label="Đá" value={s.stones} />
          <Res label="Xương" value={s.bones} />
          <Res label="Dân" value={`${s.population}/${s.livingSpace}`} />
          <Res label="Địch" value={s.enemyPopulation} />
        </div>
        <div className="controls">
          <select value={game.level} onChange={(e) => game.setLevel(Number(e.target.value))} aria-label="Chọn level">
            {LEVELS.map((name, i) => (
              <option key={name} value={i}>
                {i}. {name}
              </option>
            ))}
          </select>
          <button type="button" onClick={game.toggleRun}>
            {game.running ? 'Tạm dừng' : 'Chạy'}
          </button>
          <select
            value={speed}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSpeedState(v);
              game.setSpeed(v);
            }}
            aria-label="Tốc độ"
          >
            {[1, 2, 4].map((v) => (
              <option key={v} value={v}>
                ×{v}
              </option>
            ))}
          </select>
          <span className="tick">tick {s.tick}</span>
        </div>
      </header>

      {info.length > 0 && (
        <aside className="inspector">
          {info.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </aside>
      )}

      <footer className="hint">Kéo chuột / WASD để di chuyển · cuộn để zoom · click để chọn{game.screenRequests > 0 ? ` · bỏ qua ${game.screenRequests} màn hình cốt truyện (T26)` : ''}</footer>

      {game.status !== 'ready' && (
        <div className="overlay">{game.status === 'loading' ? 'Đang tải engine gốc…' : `Lỗi: ${game.error}`}</div>
      )}
    </main>
  );
}

function Res({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="res">
      <span className="res-label">{label}</span>
      <span className="res-value">{value}</span>
    </div>
  );
}
