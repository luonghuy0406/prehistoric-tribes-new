import type { EngineController, OverlayHandlers } from './bridgeTypes';

export interface MountOptions {
  appEl: HTMLElement;
  stageEl: HTMLElement;
  canvasEl: HTMLCanvasElement;
  baseUrl?: string;
  overlayHandlers: OverlayHandlers;
  shouldIgnoreKey?: (ev: KeyboardEvent) => boolean;
  shouldAbort?: () => boolean;
  onReady?: (controller: EngineController) => void;
  onStopped?: (err: unknown) => void;
}

export function mountPrehistoricTribes(options: MountOptions): Promise<EngineController>;
