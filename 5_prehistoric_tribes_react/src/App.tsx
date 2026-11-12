import { useEffect, useState } from 'react';
import { useGameEngine } from './engine/useGameEngine';
import { TopShellBar } from './components/TopShellBar';
import { BottomDock } from './components/BottomDock';
import { VillagerRosterModal } from './components/VillagerRosterModal';

export function App() {
  const [rosterOpen, setRosterOpen] = useState(false);
  const { appRef, stageRef, canvasRef, overlay, snapshot, actions } = useGameEngine(rosterOpen);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && rosterOpen) {
        ev.preventDefault();
        setRosterOpen(false);
        return;
      }
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((ev.key === 'v' || ev.key === 'V') && snapshot.gameState === 1 && !ev.metaKey && !ev.ctrlKey) {
        ev.preventDefault();
        setRosterOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [rosterOpen, snapshot.gameState]);

  useEffect(() => {
    if (snapshot.gameState !== 1 && rosterOpen) {
      setRosterOpen(false);
    }
  }, [snapshot.gameState, rosterOpen]);

  return (
    <main id="app" ref={appRef}>
      <TopShellBar
        snapshot={snapshot}
        onZoomIn={actions.zoomIn}
        onZoomOut={actions.zoomOut}
        onToggleMusic={actions.toggleMusic}
        onChangeLanguage={actions.setLanguage}
        onOpenRoster={() => setRosterOpen(true)}
        onOpenPause={actions.openPauseMenu}
      />

      <div id="stage" ref={stageRef}>
        <canvas id="screen" ref={canvasRef} width={240} height={320} aria-label="Game screen" />
      </div>

      <BottomDock
        snapshot={snapshot}
        onFocusChief={actions.focusChief}
        onOpenBuild={actions.openBuildMenu}
        onOpenMinimap={actions.openMinimap}
        onJumpAlert={actions.jumpToAlert}
        onToggleCallToArms={actions.toggleCallToArms}
        onToggleFormUp={actions.toggleFormUp}
        onBackToWork={actions.backToWork}
        onToggleFreeze={actions.toggleFreezeSim}
        onOpenRoster={() => setRosterOpen(true)}
      />

      <VillagerRosterModal
        open={rosterOpen}
        villagers={snapshot.villagers}
        selectedId={snapshot.selectedVillager?.id ?? 0}
        onSelectVillager={actions.selectVillager}
        onClose={() => setRosterOpen(false)}
      />

      {overlay.visible && (
        <div id="overlay" className={overlay.isError ? 'interactive' : ''}>
          <p className="overlay-status">{overlay.status}</p>
          {overlay.isError && (
            <button type="button" className="start-button" onClick={() => window.location.reload()}>
              Reload
            </button>
          )}
        </div>
      )}

      {overlay.notice && <div className="toast">{overlay.notice}</div>}
    </main>
  );
}

export default App;
