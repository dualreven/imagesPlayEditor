import { buildExportFrames, runExportWithUi, type CanvasController, type ExportFrame } from "@modules";
import type { AppState } from "../app-state";

const frameWait = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

interface CreateExportRuntimeOptions {
  state: AppState;
  controller: CanvasController;
  exportBtn: HTMLButtonElement;
  setStatus: (message: string) => void;
  setExportFeedback: (message: string, kind?: "info" | "success" | "error") => void;
  refresh: () => void;
}

export interface ExportRuntime {
  getFramesForExport: () => ExportFrame[];
  resolveFocusedVisibleAnnotationIds: (frames: ExportFrame[]) => string[] | null;
  syncCanvasSelectionFromAction: () => void;
  runExport: () => Promise<void>;
}

export function createExportRuntime(options: CreateExportRuntimeOptions): ExportRuntime {
  const { state, controller, exportBtn, setStatus, setExportFeedback, refresh } = options;

  const getFramesForExport = () =>
    buildExportFrames(state.frames, state.actions, state.annotations, state.clearBeforeFrameIds);

  const resolveFocusedVisibleAnnotationIds = (frames: ExportFrame[]) => {
    if (!state.showCurrentFrameOnly || !state.selectedFrameId) return null;
    const frame = frames.find((item) => item.frameId === state.selectedFrameId);
    return frame ? frame.visibleAnnotationIds : [];
  };

  const syncCanvasSelectionFromAction = () => {
    const action = state.selectedActionId ? state.actions.get(state.selectedActionId) ?? null : null;
    state.selectedAnnotationId = action?.type === "annotation" ? action.annotationId : null;
  };

  const runExport = async () => {
    if (state.frames.length === 0) {
      setStatus("没有帧可导出");
      setExportFeedback("导出未执行：请先创建帧", "error");
      return;
    }
    const frames = getFramesForExport();
    if (frames.length === 0) {
      setStatus("没有可导出的步骤");
      setExportFeedback("导出未执行：帧列表为空", "error");
      return;
    }
    await runExportWithUi({
      frames,
      filePattern: state.exportSettings.filePattern,
      outputDir: state.exportSettings.savePath || undefined,
      exportBtn,
      setStatus,
      setExportFeedback,
      renderFrame: async (frame) => {
        controller.setVisibleAnnotationIds(frame.visibleAnnotationIds);
        controller.setAnnotations(state.annotations, state.selectedAnnotationId);
        await frameWait();
        return controller.toDataUrl();
      },
      onFinalize: () => {
        controller.setVisibleAnnotationIds(resolveFocusedVisibleAnnotationIds(getFramesForExport()));
        controller.setAnnotations(state.annotations, state.selectedAnnotationId);
      }
    });
    refresh();
  };

  return {
    getFramesForExport,
    resolveFocusedVisibleAnnotationIds,
    syncCanvasSelectionFromAction,
    runExport
  };
}
