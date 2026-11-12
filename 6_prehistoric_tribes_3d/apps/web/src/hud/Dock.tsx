import type { InteractionState } from '@pt3d/engine-adapter';

interface Props {
  ui: InteractionState;
  buildOpen: boolean;
  boxMode: boolean;
  touch: boolean;
  onBuild: () => void;
  onCallToArms: () => void;
  onFormUp: () => void;
  onBackToWork: () => void;
  onChief: () => void;
  onSelectAll: () => void;
  onBoxMode: (on: boolean) => void;
  onCancel: () => void;
}

/** Bottom command dock — large touch targets, keyboard shortcut shown on desktop. */
export function Dock(p: Props) {
  const hasSelection = p.ui.selectedUnits.length > 0 || p.ui.selectedBuilding > 0 || p.ui.mode === 3;
  return (
    <nav className="dock" aria-label="Lệnh">
      <DockButton icon="🔨" label="Xây" kbd="B" active={p.buildOpen} onClick={p.onBuild} />
      <DockButton icon="📯" label="Báo động" kbd="C" active={p.ui.callToArms} onClick={p.onCallToArms} />
      <DockButton icon="🚩" label="Tập hợp" kbd="F" active={p.ui.formUp} onClick={p.onFormUp} />
      <DockButton icon="⛏️" label="Về làm" kbd="H" onClick={p.onBackToWork} disabled={!p.ui.callToArms && !p.ui.formUp} />
      <span className="dock-sep" />
      <DockButton icon="👑" label="Tù trưởng" kbd="␣" onClick={p.onChief} />
      <DockButton icon="👥" label="Chọn hết" kbd="Ctrl+A" onClick={p.onSelectAll} />
      {p.touch && <DockButton icon="⬚" label="Chọn vùng" active={p.boxMode} onClick={() => p.onBoxMode(!p.boxMode)} />}
      {hasSelection && <DockButton icon="✕" label="Huỷ" kbd="Esc" onClick={p.onCancel} />}
    </nav>
  );
}

function DockButton(props: { icon: string; label: string; kbd?: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={props.active ? 'dock-btn active' : 'dock-btn'}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-pressed={props.active}
      title={props.kbd ? `${props.label} (${props.kbd})` : props.label}
    >
      <span className="dock-icon" aria-hidden="true">
        {props.icon}
      </span>
      <span className="dock-label">{props.label}</span>
      {props.kbd && <kbd>{props.kbd}</kbd>}
    </button>
  );
}
