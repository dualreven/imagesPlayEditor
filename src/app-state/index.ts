import {
  createDefaultStyle,
  createEmptyAnnotationCounters,
  loadExportSettings,
  type Annotation,
  type AnnotationCounters,
  type AnnotationStyle,
  type DrawingTool,
  type EditorImage,
  type ExportSettings,
  type Frame,
  type TimelineStep
} from "@modules";

export interface AppState {
  tool: DrawingTool;
  style: AnnotationStyle;
  exportSettings: ExportSettings;
  image: EditorImage | null;
  annotations: Map<string, Annotation>;
  annotationCounters: AnnotationCounters;
  actions: Map<string, TimelineStep>;
  frames: Frame[];
  clearBeforeFrameIds: Set<string>;
  selectedFrameId: string | null;
  selectedActionId: string | null;
  selectedAnnotationId: string | null;
  focusedFrameId: string | null;
}

export function createInitialState(): AppState {
  return {
    tool: "select",
    style: createDefaultStyle(),
    exportSettings: loadExportSettings(),
    image: null,
    annotations: new Map(),
    annotationCounters: createEmptyAnnotationCounters(),
    actions: new Map(),
    frames: [],
    clearBeforeFrameIds: new Set(),
    selectedFrameId: null,
    selectedActionId: null,
    selectedAnnotationId: null,
    focusedFrameId: null
  };
}
