import type { EngineCommands } from '@pt3d/engine-adapter';
import { BUILDING_HINTS, BUILDING_NAMES } from '../labels';
import { BuildingThumb, Ic } from '../skin';
import type { HudStats } from '../useGame';

interface Props {
  options: number[];
  commands: EngineCommands;
  stats: HudStats;
  onChoose: (type: number) => void;
  onClose: () => void;
}

/** Build menu: cards with cost, size and affordability. Bottom sheet on mobile, panel on desktop. */
export function BuildSheet({ options, commands, stats, onChoose, onClose }: Props) {
  return (
    <section className="sheet" aria-label="Xây công trình">
      <header className="sheet-head">
        <h2>Xây công trình</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </header>
      <div className="build-grid">
        {options.map((type) => {
          const cost = commands.buildingCost(type);
          const size = commands.buildingSize(type);
          const short = cost.wood > stats.wood || cost.stones > stats.stones || cost.bones > stats.bones;
          return (
            <button
              type="button"
              key={type}
              className={short ? 'build-card short' : 'build-card'}
              onClick={() => onChoose(type)}
              title={BUILDING_HINTS[type]}
            >
              <span className="build-icon" aria-hidden="true">
                <BuildingThumb type={type} size={64} />
              </span>
              <span className="build-name">{BUILDING_NAMES[type]}</span>
              <span className="build-cost">
                {cost.wood > 0 && <Cost icon="res_wood" n={cost.wood} lack={cost.wood > stats.wood} />}
                {cost.stones > 0 && <Cost icon="res_stone" n={cost.stones} lack={cost.stones > stats.stones} />}
                {cost.bones > 0 && <Cost icon="res_bone" n={cost.bones} lack={cost.bones > stats.bones} />}
              </span>
              <span className="build-size">
                {size.w}×{size.h} ô
              </span>
            </button>
          );
        })}
      </div>
      <p className="sheet-note">Thiếu tài nguyên vẫn đặt được công trường; thợ xây sẽ chờ đủ vật liệu như bản gốc.</p>
    </section>
  );
}

function Cost({ icon, n, lack }: { icon: string; n: number; lack: boolean }) {
  return (
    <span className={lack ? 'cost lack' : 'cost'}>
      <Ic name={icon} size={18} />
      {n}
    </span>
  );
}
