import React from 'react';
import type { GameSnapshot } from '../engine/bridgeTypes';

interface BottomDockProps {
  snapshot: GameSnapshot;
  onFocusChief: () => void;
  onOpenBuild: () => void;
  onOpenMinimap: () => void;
  onJumpAlert: () => void;
  onToggleCallToArms: () => void;
  onToggleFormUp: () => void;
  onBackToWork: () => void;
  onToggleFreeze: () => void;
  onOpenRoster: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  snapshot,
  onFocusChief,
  onOpenBuild,
  onOpenMinimap,
  onJumpAlert,
  onToggleCallToArms,
  onToggleFormUp,
  onBackToWork,
  onToggleFreeze,
  onOpenRoster,
}) => {
  if (snapshot.gameState !== 1) return null;

  const { selectedVillager: v, selectedBuilding: b } = snapshot;

  return (
    <footer className="pt-bottombar">
      <div className="pt-selection-summary">
        {v ? (
          <button
            type="button"
            className="pt-selected-pill"
            onClick={onOpenRoster}
            title="Mở bảng danh sách dân"
          >
            <span className="pt-selected-name">
              {v.name} {v.isChief ? '★' : ''}
            </span>
            <span>
              HP {v.hp}/{v.maxHp}
            </span>
            <span>Ăn {v.food}%</span>
            <span>Lực {v.energy}%</span>
            <span>Vui {v.happiness}%</span>
            <span className="pt-muted">
              {v.weaponName} · {v.topSkillText}
            </span>
          </button>
        ) : b ? (
          <div className="pt-selected-pill">
            <span className="pt-selected-name">
              {b.name} Lv.{b.level}
            </span>
            <span>
              HP {b.hp}/{b.maxHp}
            </span>
          </div>
        ) : (
          <span className="pt-hint">
            Click chọn · Kéo trái: khung chọn · Kéo phải/WASD: di camera · Space: Tộc trưởng · Tab: đổi dân · ?: phím tắt
          </span>
        )}
      </div>

      <div className="pt-command-group">
        {snapshot.alertType > 0 && snapshot.alertType < 16 && (
          <button
            type="button"
            className="pt-btn is-alert"
            onClick={onJumpAlert}
            title="Nhảy tới vị trí cảnh báo (Phím 1)"
          >
            ⚠ {snapshot.alertText} [1]
          </button>
        )}
        <button type="button" className="pt-btn" onClick={onFocusChief} title="Chọn & nhìn về Chief (Space / H)">
          Chief [Space]
        </button>
        <button type="button" className="pt-btn" onClick={onOpenBuild} title="Mở menu xây dựng (Phím B)">
          Xây [B]
        </button>
        <button
          type="button"
          className={`pt-btn ${snapshot.callToArms ? 'is-danger' : ''}`}
          onClick={onToggleCallToArms}
          title="Hiệu triệu chiến đấu (Phím C)"
        >
          {snapshot.callToArms ? 'Đang Call to Arms' : 'Call to Arms [C]'}
        </button>
        <button
          type="button"
          className={`pt-btn ${snapshot.formUp ? 'is-active' : ''}`}
          onClick={onToggleFormUp}
          title="Tập hợp đội hình (Phím F)"
        >
          Form Up [F]
        </button>
        {(snapshot.callToArms || snapshot.formUp) && (
          <button type="button" className="pt-btn" onClick={onBackToWork} title="Giải tán về làm việc (Phím X)">
            Làm việc [X]
          </button>
        )}
        <button type="button" className="pt-btn" onClick={onOpenMinimap} title="Mở bản đồ nhỏ (Phím M)">
          Bản đồ [M]
        </button>
        <button
          type="button"
          className={`pt-btn ${snapshot.loopPaused ? 'is-active' : ''}`}
          onClick={onToggleFreeze}
          title="Tạm dừng nhanh mô phỏng (Phím P)"
        >
          {snapshot.loopPaused ? '▶ Tiếp' : '⏸ Dừng'}
        </button>
      </div>
    </footer>
  );
};
