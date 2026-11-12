import { useState } from 'react';
import { LEVEL_NAMES } from '../labels';
import type { HudStats } from '../useGame';

interface Props {
  stats: HudStats;
  running: boolean;
  level: number;
  onToggleRun: () => void;
  onSpeed: (s: number) => void;
  onLevel: (l: number) => void;
}

export function TopBar({ stats: s, running, level, onToggleRun, onSpeed, onLevel }: Props) {
  const [speed, setSpeed] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const cycleSpeed = () => {
    const next = speed === 1 ? 2 : speed === 2 ? 4 : 1;
    setSpeed(next);
    onSpeed(next);
  };
  return (
    <header className="topbar">
      <div className="resources" aria-label="Tài nguyên">
        <Res icon="🍖" label="Thức ăn" value={s.food} />
        <Res icon="🍲" label="Bữa ăn" value={s.meals} />
        <Res icon="🪵" label="Gỗ" value={s.wood} />
        <Res icon="🪨" label="Đá" value={s.stones} />
        <Res icon="🦴" label="Xương" value={s.bones} />
        <Res icon="👥" label="Dân số" value={s.population} />
        <Res icon="⚔️" label="Quân địch" value={s.enemyPopulation} muted />
      </div>
      <div className="top-actions">
        <button type="button" className="chip" onClick={cycleSpeed} title="Tốc độ">
          ×{speed}
        </button>
        <button type="button" className="chip" onClick={onToggleRun} title="Tạm dừng / chạy (P)">
          {running ? '⏸' : '▶'}
        </button>
        <button type="button" className="chip" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} title="Menu">
          ☰
        </button>
      </div>
      {menuOpen && (
        <div className="menu-pop" role="menu">
          <p className="menu-title">Chọn màn chơi</p>
          {LEVEL_NAMES.map((name, i) => (
            <button
              type="button"
              role="menuitem"
              key={name}
              className={i === level ? 'menu-item active' : 'menu-item'}
              onClick={() => {
                onLevel(i);
                setMenuOpen(false);
              }}
            >
              <span>{i}</span> {name}
            </button>
          ))}
          <p className="menu-foot">tick {s.tick}</p>
        </div>
      )}
    </header>
  );
}

function Res({ icon, label, value, muted }: { icon: string; label: string; value: number | string; muted?: boolean }) {
  return (
    <div className={muted ? 'res muted' : 'res'} title={label}>
      <span className="res-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="res-value">{value}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
