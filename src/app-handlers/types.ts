import type { Annotation } from "@modules";
import type { BindAppEventsOptions } from "../app-events";
import type { AppState } from "../app-state";

export interface CreateAppEventHandlersOptions {
  state: AppState;
  exportDialog: HTMLDialogElement;
  settingsDialog: HTMLDialogElement;
  settingSavePath: HTMLInputElement;
  settingNamePattern: HTMLInputElement;
  settingPatternTip: HTMLParagraphElement;
  settingPreview: HTMLParagraphElement;
  frameDescInput: HTMLTextAreaElement;
  getEditingFrameDescId: () => string | null;
  refresh: () => void;
  setStatus: (message: string) => void;
  setExportFeedback: (message: string, kind?: "info" | "success" | "error") => void;
  closeFrameDescEditor: () => void;
  collectStyleFromInputs: () => void;
  getSelectedAnnotation: () => Annotation | null;
  toggleClearBeforeFrame: (frameId: string) => boolean | null;
  removeActions: (actionIds: string[]) => void;
  loadImage: (file: File) => Promise<{ width: number; height: number }>;
  runExport: () => Promise<void>;
  timelineIgnoreSelector?: string;
}

export type EventCallbacks = Pick<
  BindAppEventsOptions,
  | "onToolSelect"
  | "onOpenExportDialog"
  | "onCloseExportDialog"
  | "onOpenSettings"
  | "onCloseSettings"
  | "onSettingPatternInput"
  | "onSettingSave"
  | "onFrameDescCancel"
  | "onFrameDescSave"
  | "onStyleInputChange"
  | "onApplyStyle"
  | "onImageInputChange"
  | "onAddEmptyFrame"
  | "onAddClearBefore"
  | "onTimelineBackgroundClick"
  | "onToggleFrameFocus"
  | "onToggleStepLock"
  | "onDeleteAction"
  | "onExport"
>;
