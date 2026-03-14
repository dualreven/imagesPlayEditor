import {
  assignAnnotationIdentity,
  clearActionSelection,
  createAnnotationStep,
  createFrame,
  findFrameIdByActionId,
  type Annotation
} from "@modules";
import type { AppState } from "../app-state";

interface CanvasCallbacks {
  onAnnotationCreated: (annotation: Annotation) => void;
  onAnnotationSelected: (annotationId: string | null) => void;
  onAnnotationUpdated: (annotation: Annotation) => void;
  onRequireImage: () => void;
}

type AppCanvasState = Pick<
  AppState,
  "annotations" | "annotationCounters" | "actions" | "frames" | "selectedFrameId" | "selectedActionId" | "selectedAnnotationId"
>;

interface CreateCanvasCallbacksOptions {
  state: AppCanvasState;
  refresh: () => void;
  setStatus: (message: string) => void;
  syncStyleInputsFromSelected: () => void;
}

export function createCanvasCallbacks(options: CreateCanvasCallbacksOptions): CanvasCallbacks {
  const { state, refresh, setStatus, syncStyleInputsFromSelected } = options;
  return {
    onAnnotationCreated: (annotation) => {
      const nextSequence = state.annotationCounters[annotation.kind] + 1;
      const identifiedAnnotation = assignAnnotationIdentity(annotation, nextSequence);
      state.annotationCounters[annotation.kind] = nextSequence;
      state.annotations.set(identifiedAnnotation.id, identifiedAnnotation);
      const action = createAnnotationStep(identifiedAnnotation.id);
      state.actions.set(action.id, action);
      const selectedIndex = state.selectedFrameId ? state.frames.findIndex((frame) => frame.id === state.selectedFrameId) : -1;
      if (selectedIndex >= 0) {
        state.frames = state.frames.map((frame, index) => (index === selectedIndex ? { ...frame, actionIds: [...frame.actionIds, action.id] } : frame));
      } else {
        state.frames = [...state.frames, createFrame([action.id])];
      }
      clearActionSelection(state);
      refresh();
      setStatus(
        selectedIndex >= 0
          ? `已添加标注 ${identifiedAnnotation.name} 并追加到选中帧`
          : `已添加标注 ${identifiedAnnotation.name} 并创建新帧`
      );
    },
    onAnnotationSelected: (annotationId) => {
      state.selectedAnnotationId = annotationId;
      if (!annotationId) {
        clearActionSelection(state);
        refresh();
        return;
      }
      const action = [...state.actions.values()].find(
        (item) => item.type === "annotation" && item.annotationId === annotationId
      );
      state.selectedActionId = action?.id ?? null;
      state.selectedFrameId = action ? findFrameIdByActionId(state.frames, action.id) : null;
      syncStyleInputsFromSelected();
      refresh();
    },
    onAnnotationUpdated: (annotation) => {
      state.annotations.set(annotation.id, annotation);
      state.selectedAnnotationId = annotation.id;
      syncStyleInputsFromSelected();
      refresh();
    },
    onRequireImage: () => setStatus("请先加载图片，再进行标注")
  };
}
