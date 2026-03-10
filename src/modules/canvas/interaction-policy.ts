import type { DrawingTool } from "../models";

interface CanvasInteractionState {
  tool: DrawingTool;
  visibleAnnotationIds: Set<string> | null;
  selectedAnnotationId: string | null;
}

export function canEditSelectedAnnotation(state: CanvasInteractionState) {
  if (state.tool !== "select") return false;
  if (!state.visibleAnnotationIds) return true;
  if (!state.selectedAnnotationId) return false;
  return state.visibleAnnotationIds.has(state.selectedAnnotationId);
}

export function isAnnotationSelectedForEditing(annotationId: string, state: CanvasInteractionState) {
  return annotationId === state.selectedAnnotationId && canEditSelectedAnnotation(state);
}
