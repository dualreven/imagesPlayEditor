import { createDefaultStyle, loadExportSettings, type Annotation, type AnnotationStyle, type DrawingTool, type ExportSettings, type Frame, type TimelineStep } from "@modules";

export interface AppState {
  tool: DrawingTool;
  style: AnnotationStyle;
  exportSettings: ExportSettings;
  annotations: Map<string, Annotation>;
  actions: Map<string, TimelineStep>;
  frames: Frame[];
  clearBeforeFrameIds: Set<string>;
  selectedFrameId: string | null;
  selectedActionId: string | null;
  selectedAnnotationId: string | null;
  showCurrentFrameOnly: boolean;
}

export function createInitialState(): AppState {
  return {
    tool: "select",
    style: createDefaultStyle(),
    exportSettings: loadExportSettings(),
    annotations: new Map(),
    actions: new Map(),
    frames: [],
    clearBeforeFrameIds: new Set(),
    selectedFrameId: null,
    selectedActionId: null,
    selectedAnnotationId: null,
    showCurrentFrameOnly: false
  };
}
