import { useState } from 'react';
import { Cmd, isEnemyUnit, type EngineCommands, type InteractionState, type WorldView } from '@pt3d/engine-adapter';
import { BUILDING_NAMES, capitalize, commandName, ITEM_NAMES, JOB_NAMES } from '../labels';
import { BuildingThumb, Ic } from '../skin';

interface Props {
  ui: InteractionState;
  world: WorldView;
  commands: EngineCommands;
  villagerNames: string[];
  onAct: (fn: (c: EngineCommands) => void) => void;
  onFocus: (unit: number) => void;
}

/** First building type that is a construction site (sites use placement types 12..19). */
const FIRST_SITE_TYPE = 12;

export function SelectionCard({ ui, world, commands, villagerNames, onAct, onFocus }: Props) {
  if (ui.selectedBuilding > 0) return <BuildingCard id={ui.selectedBuilding} ui={ui} world={world} commands={commands} villagerNames={villagerNames} onAct={onAct} />;
  if (ui.selectedUnits.length > 1) return <GroupCard ids={ui.selectedUnits} world={world} villagerNames={villagerNames} onAct={onAct} onFocus={onFocus} />;
  if (ui.selectedUnits.length === 1) return <VillagerCard id={ui.selectedUnits[0]!} world={world} villagerNames={villagerNames} onFocus={onFocus} />;
  return null;
}

function unitName(world: WorldView, id: number, names: string[]): string {
  const n = names[world.units.name[id] ?? -1];
  return n ? capitalize(n) : `Dân #${id}`;
}

function VillagerCard({ id, world, villagerNames, onFocus }: { id: number; world: WorldView; villagerNames: string[]; onFocus: (u: number) => void }) {
  const u = world.units;
  const age = u.age[id] ?? 0;
  const chief = (world.tribeStats[0]?.[17] ?? 0) === id;
  const weapon = u.weapon[id] ?? -1;
  const skills: [string, number][] = [
    ['Cận chiến', u.meleeSkill[id] ?? 0],
    ['Ném', u.throwingSkill[id] ?? 0],
    ['Hái lượm', u.gatheringSkill[id] ?? 0],
    ['Xây', u.buildingSkill[id] ?? 0],
    ['Trinh sát', u.scoutingSkill[id] ?? 0],
  ];
  skills.sort((a, b) => b[1] - a[1]);
  return (
    <aside className="card" aria-label="Dân được chọn">
      <header className="card-head">
        <button type="button" className="avatar" onClick={() => onFocus(id)} title="Đưa camera tới">
          {chief ? '👑' : age < 12 ? '🧒' : (u.gender[id] ?? 0) === 1 ? '👩' : '🧔'}
        </button>
        <div>
          <h3>{unitName(world, id, villagerNames)}</h3>
          <p className="sub">
            {isEnemyUnit(id) ? 'Quân địch · ' : ''}
            {age} tuổi · {JOB_NAMES[u.job[id] ?? 0] ?? 'Rảnh'}
            {weapon >= 0 && weapon <= 5 ? ` · ${ITEM_NAMES[weapon]}` : ''}
          </p>
        </div>
      </header>
      <Bar icon="stat_hp" label="Máu" value={u.hp[id] ?? 0} max={u.maxHp[id] ?? 1} color="var(--hp)" />
      <Bar icon="stat_hunger" label="No" value={u.food[id] ?? 0} max={100} color="var(--food)" />
      <Bar icon="stat_tired" label="Sức" value={u.energy[id] ?? 0} max={100} color="var(--energy)" />
      <Bar icon="stat_happiness" label="Vui" value={u.happiness[id] ?? 0} max={100} color="var(--happy)" />
      <p className="skills">{skills.slice(0, 3).map(([k, v]) => `${k} ${v}`).join(' · ')}</p>
      <p className="tip">Chạm/click vào cây, bụi quả, đá, thú, công trình để giao việc · chạm đúp để chạy</p>
    </aside>
  );
}

function GroupCard({ ids, world, villagerNames, onAct, onFocus }: { ids: number[]; world: WorldView; villagerNames: string[]; onAct: Props['onAct']; onFocus: (u: number) => void }) {
  return (
    <aside className="card" aria-label="Nhóm được chọn">
      <header className="card-head">
        <div className="avatar">👥</div>
        <div>
          <h3>{ids.length} dân</h3>
          <p className="sub">Chạm/click vào mục tiêu để ra lệnh cho cả nhóm</p>
        </div>
      </header>
      <div className="chips">
        {ids.slice(0, 24).map((id) => (
          <button
            type="button"
            key={id}
            className="chip small"
            onClick={() => {
              onAct((c) => c.selectVillager(id));
              onFocus(id);
            }}
          >
            {unitName(world, id, villagerNames)}
          </button>
        ))}
      </div>
    </aside>
  );
}

function BuildingCard({ id, ui, world, commands, villagerNames, onAct }: { id: number; ui: InteractionState; world: WorldView; commands: EngineCommands; villagerNames: string[]; onAct: Props['onAct'] }) {
  const [confirmDemolish, setConfirmDemolish] = useState(false);
  const b = world.buildings;
  const rawType = b.type[id] ?? 0;
  const site = rawType >= FIRST_SITE_TYPE;
  const type = site ? (b.payload[id] ?? 0) : rawType;
  const name = BUILDING_NAMES[type] ?? `Công trình #${type}`;
  const hp = b.hp[id] ?? 0;
  const maxHp = b.maxHp[id] ?? 1;
  const occupants = ui.contextItems.filter((it) => it.id < 0);
  const items = ui.contextItems.filter((it) => it.id >= 0 && it.id <= 8);
  const actions = ui.contextItems.filter((it) => it.id >= 10);
  const up = commands.upgradeCost(type);
  return (
    <aside className="card" aria-label="Công trình được chọn">
      <header className="card-head">
        <div className="avatar building">{site ? '🏗️' : <BuildingThumb type={type} size={40} />}</div>
        <div>
          <h3>{site ? `Công trường: ${name}` : name}</h3>
          <p className="sub">{site ? 'Ra lệnh cho dân tới đây để xây' : `Cấp ${b.level[id] ?? 1}`}</p>
        </div>
      </header>
      <Bar icon="stat_space" label="Bền" value={hp} max={maxHp} color="var(--hp)" />
      {items.length > 0 && (
        <div className="prod">
          <p className="section">Đặt chế tạo</p>
          {items.map((it) => (
            <div className="prod-row" key={it.index}>
              <span>{ITEM_NAMES[it.id]}</span>
              <button type="button" className="icon-btn" onClick={() => onAct((c) => c.adjustQuantity(it.index, -1))} aria-label="Giảm">
                −
              </button>
              <span className="qty">{it.count}</span>
              <button type="button" className="icon-btn" onClick={() => onAct((c) => c.adjustQuantity(it.index, 1))} aria-label="Tăng">
                +
              </button>
            </div>
          ))}
        </div>
      )}
      {occupants.length > 0 && (
        <div className="chips">
          {occupants.map((it) => (
            <button type="button" key={it.index} className="chip small" onClick={() => onAct((c) => c.runContextItem(it.index))}>
              {unitName(world, -it.id, villagerNames)}
            </button>
          ))}
        </div>
      )}
      <div className="actions">
        {actions.map((it) =>
          it.id === Cmd.DEMOLISH ? (
            confirmDemolish ? (
              <button
                type="button"
                key={it.index}
                className="action danger"
                onClick={() => {
                  onAct((c) => c.runContextItem(it.index));
                  setConfirmDemolish(false);
                }}
              >
                Chắc chắn phá?
              </button>
            ) : (
              <button type="button" key={it.index} className="action" onClick={() => setConfirmDemolish(true)}>
                {commandName(it.id)}
              </button>
            )
          ) : (
            <button type="button" key={it.index} className="action" onClick={() => onAct((c) => c.runContextItem(it.index))}>
              {commandName(it.id)}
              {it.id === Cmd.UPGRADE && (up.wood > 0 || up.stones > 0) && (
                <small>
                  {' '}
                  <Ic name="res_wood" size={16} />{up.wood} <Ic name="res_stone" size={16} />{up.stones}
                </small>
              )}
            </button>
          ),
        )}
      </div>
    </aside>
  );
}

function Bar({ icon, label, value, max, color }: { icon: string; label: string; value: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="bar" title={`${label}: ${value}/${max}`}>
      <span className="bar-label">
        <Ic name={icon} size={20} />
        <span className="sr-only">{label}</span>
      </span>
      <span className="bar-track">
        <span className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </span>
      <span className="bar-num">{value}</span>
    </div>
  );
}
