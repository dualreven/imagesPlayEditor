import type { Annotation } from "@modules";
import type { BindAppEventsOptions } from "../app-events";
import type { AppState } from "../app-state";

export interface CreateAppEventHandlersOptions {
  state: AppState;
  exportDialog: HTMLDialogElement;
  settingsDialog: HTMLDialogElement;
  settingTabButtons: HTMLButtonElement[];
  settingSavePath: HTMLInputElement;
  settingNamePattern: HTMLInputElement;
  settingPatternTip: HTMLParagraphElement;
  settingPreview: HTMLParagraphElement;
  settingVersionLineMain: HTMLParagraphElement;
  settingVersionLineDetail: HTMLParagraphElement;
  settingVersionLineTime: HTMLParagraphElement;
  settingUpdateList: HTMLOListElement;
  settingHistoryList: HTMLOListElement;
  settingHistoryFilePath: HTMLParagraphElement;
  settingOpenHistoryBtn: HTMLButtonElement;
  settingSaveBtn: HTMLButtonElement;
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
  loadImage: (file: File, sourcePath: string | null) => Promise<{
    src: string;
    width: number;
    height: number;
    fileName: string;
    sourcePath: string | null;
  }>;
  runExport: () => Promise<void>;
  exportProject: () => Promise<void>;
  importProject: (file: File) => Promise<void>;
  timelineIgnoreSelector?: string;
}

export type EventCallbacks = Pick<
  BindAppEventsOptions,
  | "onToolSelect"
  | "onOpenExportDialog"
  | "onCloseExportDialog"
  | "onOpenSettings"
  | "onCloseSettings"
  | "onSettingTabSelect"
  | "onSettingPatternInput"
  | "onSettingSave"
  | "onOpenUpdateHistoryFile"
  | "onFrameDescCancel"
  | "onFrameDescSave"
  | "onStyleInputChange"
  | "onApplyStyle"
  | "onImageInputChange"
  | "onAddEmptyFrame"
  | "onAddClearBefore"
  | "onTimelineBackgroundClick"
  | "onFrameVisibilityChange"
  | "onToggleStepLock"
  | "onDeleteAction"
  | "onProjectImport"
  | "onProjectExport"
  | "onExport"
>;
