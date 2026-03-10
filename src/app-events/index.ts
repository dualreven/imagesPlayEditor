import type { DrawingTool } from "@modules";

export interface BindAppEventsOptions {
  toolButtons: HTMLButtonElement[];
  openExportPanelBtn: HTMLButtonElement;
  exportCloseBtn: HTMLButtonElement;
  settingsBtn: HTMLButtonElement;
  settingCancelBtn: HTMLButtonElement;
  settingNamePattern: HTMLInputElement;
  settingSaveBtn: HTMLButtonElement;
  frameDescCancelBtn: HTMLButtonElement;
  frameDescSaveBtn: HTMLButtonElement;
  styleColor: HTMLInputElement;
  styleStroke: HTMLInputElement;
  styleArrow: HTMLInputElement;
  styleFont: HTMLInputElement;
  applyStyleBtn: HTMLButtonElement;
  imageInput: HTMLInputElement;
  addEmptyFrameBtn: HTMLButtonElement;
  addClearBtn: HTMLButtonElement;
  timelinePanel: HTMLElement;
  toggleFrameFocusBtn: HTMLButtonElement;
  toggleStepLockBtn: HTMLButtonElement;
  deleteActionBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  onToolSelect: (tool: DrawingTool) => void;
  onOpenExportDialog: () => void;
  onCloseExportDialog: () => void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  onSettingPatternInput: () => void;
  onSettingSave: () => void;
  onFrameDescCancel: () => void;
  onFrameDescSave: () => void;
  onStyleInputChange: () => void;
  onApplyStyle: () => void;
  onImageInputChange: (file: File | null) => Promise<void> | void;
  onAddEmptyFrame: () => void;
  onAddClearBefore: () => void;
  onTimelineBackgroundClick: (target: HTMLElement | null) => void;
  onToggleFrameFocus: () => void;
  onToggleStepLock: () => void;
  onDeleteAction: () => void;
  onExport: () => Promise<void> | void;
}

export function bindAppEvents(options: BindAppEventsOptions) {
  const removeListeners: Array<() => void> = [];
  const listen = (target: EventTarget, type: string, listener: EventListenerOrEventListenerObject) => {
    target.addEventListener(type, listener);
    removeListeners.push(() => target.removeEventListener(type, listener));
  };

  options.toolButtons.forEach((button) => {
    const listener = () => {
      const tool = button.dataset.tool as DrawingTool | undefined;
      if (!tool) return;
      options.onToolSelect(tool);
    };
    listen(button, "click", listener);
  });

  listen(options.openExportPanelBtn, "click", () => options.onOpenExportDialog());
  listen(options.exportCloseBtn, "click", () => options.onCloseExportDialog());
  listen(options.settingsBtn, "click", () => options.onOpenSettings());
  listen(options.settingCancelBtn, "click", () => options.onCloseSettings());
  listen(options.settingNamePattern, "input", () => options.onSettingPatternInput());
  listen(options.settingSaveBtn, "click", () => options.onSettingSave());
  listen(options.frameDescCancelBtn, "click", () => options.onFrameDescCancel());
  listen(options.frameDescSaveBtn, "click", () => options.onFrameDescSave());
  [options.styleColor, options.styleStroke, options.styleArrow, options.styleFont].forEach((input) => {
    listen(input, "change", () => options.onStyleInputChange());
  });
  listen(options.applyStyleBtn, "click", () => options.onApplyStyle());
  listen(options.imageInput, "change", () => {
    void options.onImageInputChange(options.imageInput.files?.[0] ?? null);
  });
  listen(options.addEmptyFrameBtn, "click", () => options.onAddEmptyFrame());
  listen(options.addClearBtn, "click", () => options.onAddClearBefore());
  listen(options.timelinePanel, "click", (event) => {
    options.onTimelineBackgroundClick(event.target as HTMLElement | null);
  });
  listen(options.toggleFrameFocusBtn, "click", () => options.onToggleFrameFocus());
  listen(options.toggleStepLockBtn, "click", () => options.onToggleStepLock());
  listen(options.deleteActionBtn, "click", () => options.onDeleteAction());
  listen(options.exportBtn, "click", () => {
    void options.onExport();
  });

  return () => {
    removeListeners.forEach((remove) => remove());
  };
}
