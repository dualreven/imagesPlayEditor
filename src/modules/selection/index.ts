interface SelectionIdsState {
  selectedFrameId: string | null;
  selectedActionId: string | null;
  selectedAnnotationId: string | null;
}

interface FocusedSelectionState extends SelectionIdsState {
  focusedFrameId: string | null;
}

export function hasSelection(state: SelectionIdsState) {
  return Boolean(state.selectedFrameId || state.selectedActionId || state.selectedAnnotationId);
}

export function clearActionSelection(state: SelectionIdsState) {
  state.selectedActionId = null;
  state.selectedAnnotationId = null;
}

export function selectFrameOnly(state: SelectionIdsState, frameId: string) {
  state.selectedFrameId = frameId;
  clearActionSelection(state);
}

export function selectActionInFrame(state: SelectionIdsState, actionId: string, frameId: string, annotationId: string | null) {
  state.selectedActionId = actionId;
  state.selectedFrameId = frameId;
  state.selectedAnnotationId = annotationId;
}

export function clearSelection(state: FocusedSelectionState, options: { resetFocusedView?: boolean } = {}) {
  state.selectedFrameId = null;
  clearActionSelection(state);
  if (options.resetFocusedView) {
    state.focusedFrameId = null;
  }
}
