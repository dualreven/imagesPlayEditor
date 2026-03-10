import { buildSelectedInfoText, getActionLabel, renderExportFramePreview, type CanvasController } from "@modules";

import type { ExportRuntime } from "../app-export-runtime";
import type { AppState } from "../app-state";

interface RefreshCanvasAndExportOptions {
  state: AppState;
  controller: CanvasController;
  selectedInfo: HTMLElement;
  exportFrameList: HTMLOListElement;
  exportRuntime: ExportRuntime;
}

export function refreshCanvasAndExport(options: RefreshCanvasAndExportOptions) {
  const { state, controller, selectedInfo, exportFrameList, exportRuntime } = options;

  selectedInfo.textContent = buildSelectedInfoText(
    state.frames,
    state.actions,
    state.annotations,
    state.selectedFrameId,
    state.selectedActionId,
    getActionLabel
  );

  const exportFrames = exportRuntime.getFramesForExport();
  renderExportFramePreview(exportFrameList, exportFrames, state.exportSettings.filePattern);
  exportRuntime.syncCanvasSelectionFromAction();

  controller.setTool(state.tool);
  controller.setStyle(state.style);
  controller.setVisibleAnnotationIds(exportRuntime.resolveFocusedVisibleAnnotationIds(exportFrames));
  controller.setAnnotations(state.annotations, state.selectedAnnotationId);
}
