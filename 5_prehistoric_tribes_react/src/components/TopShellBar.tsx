import React from 'react';
import type { GameSnapshot } from '../engine/bridgeTypes';

interface TopShellBarProps {
  snapshot: GameSnapshot;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleMusic: () => void;
  onChangeLanguage: (langIdx: number) => void;
  onOpenRoster: () => void;
  onOpenPause: () => void;
}

const LANGUAGES = [
  { id: 0, label: 'EN' },
  { id: 1, label: 'FR' },
  { id: 2, label: 'IT' },
  { id: 3, label: 'DE' },
  { id: 4, label: 'ES' },
];

export const TopShellBar: React.FC<TopShellBarProps> = ({
  snapshot,
  onZoomIn,
  onZoomOut,
  onToggleMusic,
  onChangeLanguage,
  onOpenRoster,
  onOpenPause,
}) => {
  const isPlaying = snapshot.gameState === 1;

  return (
    <header className="pt-topbar">
      <div className="pt-topbar-left">
        <img className="pt-brand-icon" src="./icons/icon-192.png" alt="Prehistoric Tribes" />
        <span className="pt-brand-title">Prehistoric Tribes</span>
        <span className="pt-level-pill">
          {isPlaying ? snapshot.levelName : 'React 1:1 Edition'}
        </span>
      </div>

      {isPlaying && (
        <div className="pt-resource-strip" aria-label="Tribe resources">
          <span className="pt-res-chip" title="Dân số / Chỗ ở">
            <strong>Dân</strong> {snapshot.population}/{snapshot.livingSpace}
          </span>
          <span className="pt-res-chip" title="Thức ăn (Bữa nấu sẵn)">
            <strong>Ăn</strong> {snapshot.food}
            <small> ({snapshot.meals})</small>
          </span>
          <span className="pt-res-chip" title="Gỗ">
            <strong>Gỗ</strong> {snapshot.wood}
          </span>
          <span className="pt-res-chip" title="Đá">
            <strong>Đá</strong> {snapshot.stones}
          </span>
          <span className="pt-res-chip" title="Xương">
            <strong>Xương</strong> {snapshot.bones}
          </span>
        </div>
      )}

      <div className="pt-topbar-actions">
        <div className="pt-zoom-group" title="Thu phóng bản đồ (+ / -)">
          <button
            type="button"
            className="pt-btn"
            onClick={onZoomOut}
            disabled={snapshot.zoomOut >= snapshot.maxZoomOut}
            title="Thu nhỏ (-)"
          >
            −
          </button>
          <button
            type="button"
            className="pt-btn"
            onClick={onZoomIn}
            disabled={snapshot.zoomOut <= 0}
            title="Phóng to (+)"
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={`pt-btn ${snapshot.musicOn ? 'is-active' : ''}`}
          onClick={onToggleMusic}
          title="Bật / Tắt nhạc nền"
        >
          {snapshot.musicOn ? 'Nhạc: Bật' : 'Nhạc: Tắt'}
        </button>

        <select
          className="pt-select"
          value={snapshot.language}
          onChange={(e) => onChangeLanguage(Number(e.target.value))}
          aria-label="Language"
          title="Ngôn ngữ trong game"
        >
          {LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>

        {isPlaying && (
          <>
            <button
              type="button"
              className="pt-btn"
              onClick={onOpenRoster}
              title="Danh sách dân làng (Phím V)"
            >
              Dân ({snapshot.villagers.length}) [V]
            </button>
            <button
              type="button"
              className="pt-btn"
              onClick={onOpenPause}
              title="Menu / Lưu game (Esc)"
            >
              Menu [Esc]
            </button>
          </>
        )}
      </div>
    </header>
  );
};
