import { getActionLabel, renderFramePanel, type Frame } from "@modules";

import { createFramePanelHandlers } from "../app-frame-panel";
import type { AppState } from "../app-state";

interface RenderFramePanelRefreshOptions {
  state: AppState;
  container: HTMLDivElement;
  scrollToFrameId: string | null;
  queueFramePanelScroll: (frameId: string) => void;
  setStatus: (message: string) => void;
  openFrameDescEditor: (frame: Frame) => void;
  duplicateFrameById: (frameId: string) => string | null;
  deleteFrameById: (frameId: string) => boolean;
  toggleFrameExclusive: (frameId: string) => boolean;
  toggleClearBeforeFrame: (frameId: string) => boolean | null;
  syncStyleInputsFromSelected: () => void;
  refresh: () => void;
}

export function renderFramePanelRefresh(options: RenderFramePanelRefreshOptions) {
  const {
    state,
    container,
    scrollToFrameId,
    queueFramePanelScroll,
    setStatus,
    openFrameDescEditor,
    duplicateFrameById,
    deleteFrameById,
    toggleFrameExclusive,
    toggleClearBeforeFrame,
    syncStyleInputsFromSelected,
    refresh
  } = options;

  const framePanelHandlers = createFramePanelHandlers({
    state,
    refresh,
    queueFramePanelScroll,
    setStatus,
    openFrameDescEditor,
    duplicateFrameById,
    deleteFrameById,
    toggleFrameExclusive,
    toggleClearBeforeFrame,
    syncStyleInputsFromSelected
  });

  renderFramePanel({
    container,
    frames: state.frames,
    actions: state.actions,
    annotations: state.annotations,
    scrollToFrameId,
    clearBeforeFrameIds: state.clearBeforeFrameIds,
    selectedFrameId: state.selectedFrameId,
    selectedActionId: state.selectedActionId,
    ...framePanelHandlers,
    getActionLabel
  });
}
