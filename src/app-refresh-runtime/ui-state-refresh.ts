import { isTauriRuntime, type Annotation } from "@modules";
import type { AppState } from "../app-state";
import {
  renderToolState,
  syncFrameFilterControls,
  updateActionFrameControlAvailability,
  updateStyleControlAvailability,
  type ActionControls,
  type FrameFilterControls,
  type StyleControls
} from "../app-ui-controls";

interface RefreshUiStateOptions {
  state: AppState;
  toolButtons: HTMLButtonElement[];
  exportOpenDirBtn: HTMLButtonElement;
  styleControls: StyleControls;
  actionControls: ActionControls;
  frameFilterControls: FrameFilterControls;
  selectedAnnotation: Annotation | null;
}

export function refreshUiState(options: RefreshUiStateOptions) {
  const { state, toolButtons, exportOpenDirBtn, styleControls, actionControls, frameFilterControls, selectedAnnotation } = options;
  renderToolState(toolButtons, state.tool);
  const exportDir = (state.exportSettings.savePath || state.lastExportDir || "").trim();
  exportOpenDirBtn.disabled = !isTauriRuntime() || !exportDir;
  exportOpenDirBtn.title = exportOpenDirBtn.disabled ? "仅 Tauri 且已设置本地导出目录时可用" : `打开导出目录: ${exportDir}`;
  updateStyleControlAvailability(selectedAnnotation, styleControls);
  const selectedAction = state.selectedActionId ? state.actions.get(state.selectedActionId) ?? null : null;
  const selectedFrameIndex = state.selectedFrameId ? state.frames.findIndex((item) => item.id === state.selectedFrameId) : -1;
  updateActionFrameControlAvailability(
    {
      selectedAction,
      selectedFrameIndex
    },
    actionControls
  );
  syncFrameFilterControls(
    {
      frameIds: state.frames.map((frame) => frame.id),
      focusedFrameId: state.focusedFrameId
    },
    frameFilterControls
  );
}
