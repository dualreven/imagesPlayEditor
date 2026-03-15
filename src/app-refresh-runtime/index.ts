import { type Annotation, type CanvasController, type Frame } from "@modules";
import type { AppState } from "../app-state";
import type { ExportRuntime } from "../app-export-runtime";
import { refreshCanvasAndExport } from "./canvas-export-refresh";
import { renderFramePanelRefresh } from "./panel-refresh";
import {
  syncStyleInputsFromAnnotation,
  type ActionControls,
  type FrameFilterControls,
  type StyleControls
} from "../app-ui-controls";
import { refreshUiState } from "./ui-state-refresh";

interface CreateAppRefreshRuntimeOptions {
  state: AppState;
  controller: CanvasController;
  frameListPanel: HTMLDivElement;
  exportFrameList: HTMLOListElement;
  selectedInfo: HTMLElement;
  exportOpenDirBtn: HTMLButtonElement;
  toolButtons: HTMLButtonElement[];
  styleControls: StyleControls;
  actionControls: ActionControls;
  frameFilterControls: FrameFilterControls;
  setStatus: (message: string) => void;
  openFrameDescEditor: (frame: Frame) => void;
  duplicateFrameById: (frameId: string) => string | null;
  deleteFrameById: (frameId: string) => boolean;
  toggleFrameExclusive: (frameId: string) => boolean;
  toggleClearBeforeFrame: (frameId: string) => boolean | null;
  exportRuntime: ExportRuntime;
  timelineSortableSystem: { bind: () => void };
}

export interface AppRefreshRuntime {
  refresh: () => void;
  syncStyleInputsFromSelected: () => void;
  getSelectedAnnotation: () => Annotation | null;
}

export function createAppRefreshRuntime(options: CreateAppRefreshRuntimeOptions): AppRefreshRuntime {
  const {
    state,
    controller,
    frameListPanel,
    exportFrameList,
    selectedInfo,
    exportOpenDirBtn,
    toolButtons,
    styleControls,
    actionControls,
    frameFilterControls,
    setStatus,
    openFrameDescEditor,
    duplicateFrameById,
    deleteFrameById,
    toggleFrameExclusive,
    toggleClearBeforeFrame,
    exportRuntime,
    timelineSortableSystem
  } = options;

  const getSelectedAnnotation = () =>
    state.selectedAnnotationId ? state.annotations.get(state.selectedAnnotationId) ?? null : null;

  const syncStyleInputsFromSelected = () => {
    syncStyleInputsFromAnnotation(getSelectedAnnotation(), styleControls);
  };

  const refresh = () => {
    refreshUiState({
      state,
      toolButtons,
      exportOpenDirBtn,
      styleControls,
      actionControls,
      frameFilterControls,
      selectedAnnotation: getSelectedAnnotation()
    });

    renderFramePanelRefresh({
      state,
      container: frameListPanel,
      setStatus,
      openFrameDescEditor,
      duplicateFrameById,
      deleteFrameById,
      toggleFrameExclusive,
      toggleClearBeforeFrame,
      syncStyleInputsFromSelected,
      refresh
    });
    timelineSortableSystem.bind();

    refreshCanvasAndExport({
      state,
      controller,
      selectedInfo,
      exportFrameList,
      exportRuntime
    });
  };

  return {
    refresh,
    syncStyleInputsFromSelected,
    getSelectedAnnotation
  };
}
