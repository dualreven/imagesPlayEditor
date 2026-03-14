import type { Annotation } from "@modules";
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
  styleControls: StyleControls;
  actionControls: ActionControls;
  frameFilterControls: FrameFilterControls;
  selectedAnnotation: Annotation | null;
}

export function refreshUiState(options: RefreshUiStateOptions) {
  const { state, toolButtons, styleControls, actionControls, frameFilterControls, selectedAnnotation } = options;
  renderToolState(toolButtons, state.tool);
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
