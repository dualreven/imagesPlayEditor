import {
  clearActionSelection,
  createAnnotationStep,
  createSystemStep,
  clearSelection,
  removeActionFromFrames,
  removeFrameAndCollectActionIds,
  selectFrameOnly
} from "@modules";
import type { AppState } from "../app-state";

export function toggleClearBeforeFrame(state: AppState, frameId: string) {
  if (state.frames.findIndex((item) => item.id === frameId) <= 0) return null;
  if (state.clearBeforeFrameIds.has(frameId)) {
    state.clearBeforeFrameIds.delete(frameId);
    return false;
  }
  state.clearBeforeFrameIds.add(frameId);
  return true;
}

export function toggleFrameExclusive(state: AppState, frameId: string) {
  let enabled = false;
  state.frames = state.frames.map((frame) => {
    if (frame.id !== frameId) return frame;
    enabled = !frame.exclusive;
    return { ...frame, exclusive: enabled };
  });
  return enabled;
}

export function duplicateFrameById(state: AppState, frameId: string) {
  const sourceIndex = state.frames.findIndex((frame) => frame.id === frameId);
  if (sourceIndex < 0) {
    return null;
  }
  const sourceFrame = state.frames[sourceIndex];
  const duplicatedActionIds = sourceFrame.actionIds.map((actionId) => {
    const sourceAction = state.actions.get(actionId);
    if (!sourceAction) {
      throw new Error(`Missing action while duplicating frame: ${actionId}`);
    }
    const duplicatedAction =
      sourceAction.type === "annotation"
        ? createAnnotationStep(sourceAction.annotationId)
        : createSystemStep(sourceAction.action);
    state.actions.set(duplicatedAction.id, duplicatedAction);
    return duplicatedAction.id;
  });
  const duplicatedFrame = {
    ...sourceFrame,
    id: `frame_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    actionIds: duplicatedActionIds,
    createdAt: Date.now()
  };
  const nextFrames = [...state.frames];
  nextFrames.splice(sourceIndex + 1, 0, duplicatedFrame);
  state.frames = nextFrames;
  return duplicatedFrame.id;
}

export function removeActionsFromState(state: AppState, actionIds: string[]) {
  actionIds.forEach((actionId) => {
    const action = state.actions.get(actionId);
    if (!action) {
      return;
    }
    if (action.type === "annotation") {
      state.annotations.delete(action.annotationId);
    }
    state.actions.delete(actionId);
    state.frames = removeActionFromFrames(state.frames, actionId);
  });
  if (state.selectedActionId && !state.actions.has(state.selectedActionId)) {
    clearActionSelection(state);
  }
}

interface DeleteFrameOptions {
  editingFrameDescId: string | null;
  closeFrameDescEditor: () => void;
}

export function deleteFrameById(state: AppState, frameId: string, options: DeleteFrameOptions) {
  const { editingFrameDescId, closeFrameDescEditor } = options;
  const currentIndex = state.frames.findIndex((item) => item.id === frameId);
  if (currentIndex < 0) return false;
  const nextFrameId = state.frames[currentIndex + 1]?.id ?? null;
  const previousFrameId = state.frames[currentIndex - 1]?.id ?? null;
  const shouldKeepClearAfterDelete = state.clearBeforeFrameIds.has(frameId);
  state.clearBeforeFrameIds.delete(frameId);
  if (shouldKeepClearAfterDelete && nextFrameId) {
    state.clearBeforeFrameIds.add(nextFrameId);
  }
  const { frames, removedActionIds } = removeFrameAndCollectActionIds(state.frames, frameId);
  state.frames = frames;
  if (state.focusedFrameId === frameId) {
    state.focusedFrameId = nextFrameId ?? previousFrameId;
  }
  removeActionsFromState(state, removedActionIds);
  const nextSelectedFrameId = state.frames.length > 0 ? state.frames[Math.max(0, state.frames.length - 1)].id : null;
  if (nextSelectedFrameId) {
    selectFrameOnly(state, nextSelectedFrameId);
  } else {
    clearSelection(state, { resetFocusedView: true });
  }
  if (editingFrameDescId === frameId) closeFrameDescEditor();
  return true;
}
