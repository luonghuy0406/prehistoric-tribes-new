import type { InteractionState } from '@pt3d/engine-adapter';
import { chromeUrl, Ic } from '../skin';

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
      <DockButton icon="cmd_build" label="Xây" kbd="B" active={p.buildOpen} onClick={p.onBuild} />
      <DockButton icon="cmd_call_to_arms" label="Báo động" kbd="C" active={p.ui.callToArms} onClick={p.onCallToArms} />
      <DockButton icon="cmd_form_up" label="Tập hợp" kbd="F" active={p.ui.formUp} onClick={p.onFormUp} />
      <DockButton icon="skill_harvest" label="Về làm" kbd="H" onClick={p.onBackToWork} disabled={!p.ui.callToArms && !p.ui.formUp} />
      <span className="dock-sep" />
      <DockButton icon="job_guard" label="Tù trưởng" kbd="␣" onClick={p.onChief} />
      <DockButton icon="stat_population" label="Chọn hết" kbd="Ctrl+A" onClick={p.onSelectAll} />
      {p.touch && <DockButton chrome="select_ring" label="Chọn vùng" active={p.boxMode} onClick={() => p.onBoxMode(!p.boxMode)} />}
      {hasSelection && <DockButton chrome="cursor_forbidden" label="Huỷ" kbd="Esc" onClick={p.onCancel} />}
    </nav>
  );
}

function DockButton(props: { icon?: string; chrome?: string; label: string; kbd?: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
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
        {props.icon ? <Ic name={props.icon} size={36} /> : <img className="ic" src={chromeUrl(props.chrome ?? '')} height={30} alt="" draggable={false} />}
      </span>
      <span className="dock-label">{props.label}</span>
      {props.kbd && <kbd>{props.kbd}</kbd>}
    </button>
  );
}
