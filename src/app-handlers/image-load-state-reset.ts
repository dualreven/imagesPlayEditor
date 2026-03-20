export interface ImageLoadResetState {
  annotations: Map<string, unknown>;
  annotationCounters: { box: number; arrow: number; text: number };
  actions: Map<string, unknown>;
  frames: unknown[];
  clearBeforeFrameIds: Set<string>;
  selectedFrameId: string | null;
  selectedActionId: string | null;
  selectedAnnotationId: string | null;
  focusedFrameId: string | null;
}

export function resetStateForLoadedImage(state: ImageLoadResetState) {
  state.annotations = new Map();
  state.annotationCounters = {
    box: 0,
    arrow: 0,
    text: 0
  };
  state.actions = new Map();
  state.frames = [];
  state.clearBeforeFrameIds = new Set();
  state.selectedFrameId = null;
  state.selectedActionId = null;
  state.selectedAnnotationId = null;
  state.focusedFrameId = null;
}
