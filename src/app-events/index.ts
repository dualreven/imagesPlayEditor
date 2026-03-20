import type { DrawingTool } from "@modules";

export interface BindAppEventsOptions {
  toolButtons: HTMLButtonElement[];
  openExportPanelBtn: HTMLButtonElement;
  exportCloseBtn: HTMLButtonElement;
  exportOpenDirBtn: HTMLButtonElement;
  refreshCanvasBtn: HTMLButtonElement;
  settingsBtn: HTMLButtonElement;
  settingTabButtons: HTMLButtonElement[];
  settingCancelBtn: HTMLButtonElement;
  settingZipName: HTMLInputElement;
  settingNamePattern: HTMLInputElement;
  settingSaveBtn: HTMLButtonElement;
  settingOpenHistoryBtn: HTMLButtonElement;
  frameDescCancelBtn: HTMLButtonElement;
  frameDescSaveBtn: HTMLButtonElement;
  styleColor: HTMLInputElement;
  styleStroke: HTMLInputElement;
  styleArrow: HTMLInputElement;
  styleFont: HTMLInputElement;
  applyStyleBtn: HTMLButtonElement;
  imageInput: HTMLInputElement;
  stageContainer: HTMLDivElement;
  addEmptyFrameBtn: HTMLButtonElement;
  addClearBtn: HTMLButtonElement;
  timelinePanel: HTMLElement;
  frameVisibilitySlider: HTMLInputElement;
  toggleStepLockBtn: HTMLButtonElement;
  deleteActionBtn: HTMLButtonElement;
  projectInput: HTMLInputElement;
  exportProjectBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  onToolSelect: (tool: DrawingTool) => void;
  onRefreshCanvas: () => void;
  onOpenExportDialog: () => void;
  onCloseExportDialog: () => void;
  onOpenExportDirectory: () => Promise<void> | void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  onSettingTabSelect: (tabId: string) => void;
  onSettingPatternInput: () => void;
  onSettingSave: () => void;
  onOpenUpdateHistoryFile: () => Promise<void> | void;
  onFrameDescCancel: () => void;
  onFrameDescSave: () => void;
  onStyleInputChange: () => void;
  onApplyStyle: () => void;
  onRequestImagePick: (event: MouseEvent) => Promise<void> | void;
  onImageInputChange: (file: File | null, sourcePath: string | null) => Promise<void> | void;
  onAddEmptyFrame: () => void;
  onAddClearBefore: () => void;
  onTimelineBackgroundClick: (target: HTMLElement | null) => void;
  onFrameVisibilityChange: (value: string) => void;
  onToggleStepLock: () => void;
  onDeleteAction: () => void;
  onProjectImport: (file: File | null) => Promise<void> | void;
  onProjectExport: () => Promise<void> | void;
  onCanvasDragOver: (event: DragEvent) => void;
  onCanvasDrop: (event: DragEvent) => Promise<void> | void;
  onExport: () => Promise<void> | void;
}

export function bindAppEvents(options: BindAppEventsOptions) {
  const removeListeners: Array<() => void> = [];
  const listen = (
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    eventOptions?: AddEventListenerOptions | boolean
  ) => {
    target.addEventListener(type, listener, eventOptions);
    removeListeners.push(() => target.removeEventListener(type, listener, eventOptions));
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
  listen(options.exportOpenDirBtn, "click", () => {
    void options.onOpenExportDirectory();
  });
  listen(options.refreshCanvasBtn, "click", () => options.onRefreshCanvas());
  listen(options.settingsBtn, "click", () => options.onOpenSettings());
  options.settingTabButtons.forEach((button) => {
    listen(button, "click", () => {
      const tabId = button.dataset.settingsTab;
      if (!tabId) return;
      options.onSettingTabSelect(tabId);
    });
  });
  listen(options.settingCancelBtn, "click", () => options.onCloseSettings());
  listen(options.settingZipName, "input", () => options.onSettingPatternInput());
  listen(options.settingNamePattern, "input", () => options.onSettingPatternInput());
  listen(options.settingSaveBtn, "click", () => options.onSettingSave());
  listen(options.settingOpenHistoryBtn, "click", () => {
    void options.onOpenUpdateHistoryFile();
  });
  listen(options.frameDescCancelBtn, "click", () => options.onFrameDescCancel());
  listen(options.frameDescSaveBtn, "click", () => options.onFrameDescSave());
  [options.styleColor, options.styleStroke, options.styleArrow, options.styleFont].forEach((input) => {
    listen(input, "change", () => options.onStyleInputChange());
  });
  listen(options.applyStyleBtn, "click", () => options.onApplyStyle());
  listen(options.imageInput, "click", (event) => {
    void options.onRequestImagePick(event as MouseEvent);
  });
  listen(options.imageInput, "change", () => {
    void options.onImageInputChange(options.imageInput.files?.[0] ?? null, options.imageInput.value || null);
    options.imageInput.value = "";
  });
  listen(options.addEmptyFrameBtn, "click", () => options.onAddEmptyFrame());
  listen(options.addClearBtn, "click", () => options.onAddClearBefore());
  listen(options.timelinePanel, "click", (event) => {
    options.onTimelineBackgroundClick(event.target as HTMLElement | null);
  });
  listen(options.frameVisibilitySlider, "input", () => options.onFrameVisibilityChange(options.frameVisibilitySlider.value));
  listen(
    options.frameVisibilitySlider,
    "wheel",
    (event) => {
      if (!(event instanceof WheelEvent)) {
        return;
      }
      const slider = options.frameVisibilitySlider;
      if (slider.disabled) {
        return;
      }
      const currentValue = Number(slider.value);
      const min = Number(slider.min);
      const max = Number(slider.max);
      const nextValue = event.deltaY > 0 ? Math.min(max, currentValue + 1) : Math.max(min, currentValue - 1);
      if (nextValue === currentValue) {
        return;
      }
      event.preventDefault();
      slider.value = String(nextValue);
      options.onFrameVisibilityChange(slider.value);
    },
    { passive: false }
  );
  listen(options.toggleStepLockBtn, "click", () => options.onToggleStepLock());
  listen(options.deleteActionBtn, "click", () => options.onDeleteAction());
  listen(options.projectInput, "change", () => {
    void options.onProjectImport(options.projectInput.files?.[0] ?? null);
    options.projectInput.value = "";
  });
  listen(options.exportProjectBtn, "click", () => {
    void options.onProjectExport();
  });
  listen(options.exportBtn, "click", () => {
    void options.onExport();
  });
  listen(options.stageContainer, "dragover", (event) => {
    options.onCanvasDragOver(event as DragEvent);
  });
  listen(options.stageContainer, "drop", (event) => {
    void options.onCanvasDrop(event as DragEvent);
  });

  return () => {
    removeListeners.forEach((remove) => remove());
  };
}
