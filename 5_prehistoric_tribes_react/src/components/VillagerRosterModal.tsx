import React, { useMemo, useState } from 'react';
import type { VillagerRow } from '../engine/bridgeTypes';

interface VillagerRosterModalProps {
  open: boolean;
  villagers: VillagerRow[];
  selectedId: number;
  onSelectVillager: (uid: number) => void;
  onClose: () => void;
}

type RoleFilter = 'all' | 'combat' | 'worker' | 'child';

export const VillagerRosterModal: React.FC<VillagerRosterModalProps> = ({
  open,
  villagers,
  selectedId,
  onSelectVillager,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RoleFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return villagers.filter((v) => {
      if (q && !v.name.toLowerCase().includes(q) && !v.weaponName.toLowerCase().includes(q)) {
        return false;
      }
      if (filter === 'child') return v.isChild;
      if (filter === 'combat') {
        return !v.isChild && (v.meleeSkill >= 3 || v.throwingSkill >= 3 || v.scoutingSkill >= 3);
      }
      if (filter === 'worker') {
        return !v.isChild && v.meleeSkill < 3 && v.throwingSkill < 3 && v.scoutingSkill < 3;
      }
      return true;
    });
  }, [villagers, query, filter]);

  if (!open) return null;

  return (
    <div className="pt-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="pt-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pt-modal-header">
          <div>
            <h2>Bộ lạc Avnotaklu ({villagers.length} thành viên)</h2>
            <p>Click vào một dòng để chọn &amp; di chuyển camera trực tiếp tới nhân vật.</p>
          </div>
          <button type="button" className="pt-btn" onClick={onClose}>
            ✕ Đóng [Esc]
          </button>
        </div>

        <div className="pt-modal-toolbar">
          <input
            type="text"
            className="pt-search-input"
            placeholder="Tìm theo tên hoặc vũ khí..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="pt-filter-tabs">
            {(['all', 'combat', 'worker', 'child'] as RoleFilter[]).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`pt-btn ${filter === tab ? 'is-active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab === 'all'
                  ? 'Tất cả'
                  : tab === 'combat'
                    ? 'Chiến đấu / Trinh sát'
                    : tab === 'worker'
                      ? 'Dân lao động'
                      : 'Trẻ em'}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-table-wrap">
          <table className="pt-roster-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Tuổi</th>
                <th>Máu</th>
                <th>Ăn / Lực / Vui</th>
                <th>Vũ khí</th>
                <th>Kỹ năng nổi bật</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  className={v.id === selectedId ? 'is-selected' : ''}
                  onClick={() => {
                    onSelectVillager(v.id);
                    onClose();
                  }}
                >
                  <td>
                    <strong>{v.name}</strong>{' '}
                    {v.isChief && <span className="pt-badge-chief">Chief</span>}
                    {v.isChild && <span className="pt-badge-child">Trẻ em</span>}
                  </td>
                  <td>
                    {v.age} ({v.gender})
                  </td>
                  <td>
                    {v.hp}/{v.maxHp}
                  </td>
                  <td>
                    {v.food}% · {v.energy}% · {v.happiness}%
                  </td>
                  <td>{v.weaponName}</td>
                  <td>{v.topSkillText}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 18 }}>
                    Không tìm thấy thành viên phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
