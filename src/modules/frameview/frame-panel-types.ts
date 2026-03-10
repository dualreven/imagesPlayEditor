import type { Annotation, Frame, TimelineAction, TimelineStep } from "../models";

export interface RenderFramePanelOptions {
  container: HTMLDivElement;
  frames: Frame[];
  actions: Map<string, TimelineStep>;
  annotations: Map<string, Annotation>;
  clearBeforeFrameIds: ReadonlySet<string>;
  selectedFrameId: string | null;
  selectedActionId: string | null;
  onSelectFrame: (frameId: string) => void;
  onEditFrame: (frameId: string) => void;
  onDeleteFrame: (frameId: string) => void;
  onToggleFrameExclusive: (frameId: string) => void;
  onToggleClearBefore: (frameId: string) => void;
  onSelectAction: (actionId: string, frameId: string, annotationId: string | null) => void;
  getActionLabel: (action: TimelineAction) => string;
}
