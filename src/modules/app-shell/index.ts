function requiredElement<T extends Element>(value: T | null, name: string) {
  if (!value) throw new Error(`Missing required element: ${name}`);
  return value;
}

export interface AppDomRefs {
  stageContainer: HTMLDivElement;
  statusText: HTMLSpanElement;
  frameListPanel: HTMLDivElement;
  timelinePanel: HTMLElement;
  frameDescEditor: HTMLElement;
  openExportPanelBtn: HTMLButtonElement;
  exportDialog: HTMLDialogElement;
  exportOpenDirBtn: HTMLButtonElement;
  exportCloseBtn: HTMLButtonElement;
  refreshCanvasBtn: HTMLButtonElement;
  settingsBtn: HTMLButtonElement;
  settingsDialog: HTMLDialogElement;
  settingTabButtons: HTMLButtonElement[];
  frameDescInput: HTMLTextAreaElement;
  settingSavePath: HTMLInputElement;
  settingZipName: HTMLInputElement;
  settingZipNameTip: HTMLParagraphElement;
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
  settingCancelBtn: HTMLButtonElement;
  settingSaveBtn: HTMLButtonElement;
  frameDescCancelBtn: HTMLButtonElement;
  frameDescSaveBtn: HTMLButtonElement;
  imageInput: HTMLInputElement;
  projectInput: HTMLInputElement;
  exportFrameList: HTMLOListElement;
  exportFeedback: HTMLParagraphElement;
  selectedInfo: HTMLParagraphElement;
  styleColor: HTMLInputElement;
  styleStroke: HTMLInputElement;
  styleArrow: HTMLInputElement;
  styleFont: HTMLInputElement;
  applyStyleBtn: HTMLButtonElement;
  frameVisibilitySlider: HTMLInputElement;
  frameVisibilityValue: HTMLSpanElement;
  addEmptyFrameBtn: HTMLButtonElement;
  addClearBtn: HTMLButtonElement;
  toggleStepLockBtn: HTMLButtonElement;
  deleteActionBtn: HTMLButtonElement;
  exportProjectBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  toolButtons: HTMLButtonElement[];
}

export function queryAppDom(root: HTMLDivElement): AppDomRefs {
  const frameListPanel = requiredElement(root.querySelector<HTMLDivElement>("#frame-list-panel"), "#frame-list-panel");
  return {
    stageContainer: requiredElement(root.querySelector<HTMLDivElement>("#stage-container"), "#stage-container"),
    statusText: requiredElement(root.querySelector<HTMLSpanElement>("#status-text"), "#status-text"),
    frameListPanel,
    timelinePanel: requiredElement(frameListPanel.closest<HTMLElement>(".timeline-panel"), ".timeline-panel"),
    frameDescEditor: requiredElement(root.querySelector<HTMLElement>("#frame-desc-editor"), "#frame-desc-editor"),
    openExportPanelBtn: requiredElement(root.querySelector<HTMLButtonElement>("#open-export-panel-btn"), "#open-export-panel-btn"),
    exportDialog: requiredElement(root.querySelector<HTMLDialogElement>("#export-dialog"), "#export-dialog"),
    exportOpenDirBtn: requiredElement(root.querySelector<HTMLButtonElement>("#export-open-dir-btn"), "#export-open-dir-btn"),
    exportCloseBtn: requiredElement(root.querySelector<HTMLButtonElement>("#export-close-btn"), "#export-close-btn"),
    refreshCanvasBtn: requiredElement(root.querySelector<HTMLButtonElement>("#refresh-canvas-btn"), "#refresh-canvas-btn"),
    settingsBtn: requiredElement(root.querySelector<HTMLButtonElement>("#settings-btn"), "#settings-btn"),
    settingsDialog: requiredElement(root.querySelector<HTMLDialogElement>("#settings-dialog"), "#settings-dialog"),
    settingTabButtons: [...root.querySelectorAll<HTMLButtonElement>("[data-settings-tab]")],
    frameDescInput: requiredElement(root.querySelector<HTMLTextAreaElement>("#frame-desc-input"), "#frame-desc-input"),
    settingSavePath: requiredElement(root.querySelector<HTMLInputElement>("#setting-save-path"), "#setting-save-path"),
    settingZipName: requiredElement(root.querySelector<HTMLInputElement>("#setting-zip-name"), "#setting-zip-name"),
    settingZipNameTip: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-zip-name-tip"), "#setting-zip-name-tip"),
    settingNamePattern: requiredElement(root.querySelector<HTMLInputElement>("#setting-name-pattern"), "#setting-name-pattern"),
    settingPatternTip: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-pattern-tip"), "#setting-pattern-tip"),
    settingPreview: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-preview"), "#setting-preview"),
    settingVersionLineMain: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-version-line-main"), "#setting-version-line-main"),
    settingVersionLineDetail: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-version-line-detail"), "#setting-version-line-detail"),
    settingVersionLineTime: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-version-line-time"), "#setting-version-line-time"),
    settingUpdateList: requiredElement(root.querySelector<HTMLOListElement>("#setting-update-list"), "#setting-update-list"),
    settingHistoryList: requiredElement(root.querySelector<HTMLOListElement>("#setting-history-list"), "#setting-history-list"),
    settingHistoryFilePath: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-history-file-path"), "#setting-history-file-path"),
    settingOpenHistoryBtn: requiredElement(root.querySelector<HTMLButtonElement>("#setting-open-history-btn"), "#setting-open-history-btn"),
    settingCancelBtn: requiredElement(root.querySelector<HTMLButtonElement>("#setting-cancel-btn"), "#setting-cancel-btn"),
    settingSaveBtn: requiredElement(root.querySelector<HTMLButtonElement>("#setting-save-btn"), "#setting-save-btn"),
    frameDescCancelBtn: requiredElement(root.querySelector<HTMLButtonElement>("#frame-desc-cancel-btn"), "#frame-desc-cancel-btn"),
    frameDescSaveBtn: requiredElement(root.querySelector<HTMLButtonElement>("#frame-desc-save-btn"), "#frame-desc-save-btn"),
    imageInput: requiredElement(root.querySelector<HTMLInputElement>("#image-input"), "#image-input"),
    projectInput: requiredElement(root.querySelector<HTMLInputElement>("#project-input"), "#project-input"),
    exportFrameList: requiredElement(root.querySelector<HTMLOListElement>("#export-frame-list"), "#export-frame-list"),
    exportFeedback: requiredElement(root.querySelector<HTMLParagraphElement>("#export-feedback"), "#export-feedback"),
    selectedInfo: requiredElement(root.querySelector<HTMLParagraphElement>("#selected-info"), "#selected-info"),
    styleColor: requiredElement(root.querySelector<HTMLInputElement>("#style-color"), "#style-color"),
    styleStroke: requiredElement(root.querySelector<HTMLInputElement>("#style-stroke"), "#style-stroke"),
    styleArrow: requiredElement(root.querySelector<HTMLInputElement>("#style-arrow"), "#style-arrow"),
    styleFont: requiredElement(root.querySelector<HTMLInputElement>("#style-font"), "#style-font"),
    applyStyleBtn: requiredElement(root.querySelector<HTMLButtonElement>("#apply-style-btn"), "#apply-style-btn"),
    frameVisibilitySlider: requiredElement(root.querySelector<HTMLInputElement>("#frame-visibility-slider"), "#frame-visibility-slider"),
    frameVisibilityValue: requiredElement(root.querySelector<HTMLSpanElement>("#frame-visibility-value"), "#frame-visibility-value"),
    addEmptyFrameBtn: requiredElement(root.querySelector<HTMLButtonElement>("#add-empty-frame-btn"), "#add-empty-frame-btn"),
    addClearBtn: requiredElement(root.querySelector<HTMLButtonElement>("#add-clear-btn"), "#add-clear-btn"),
    toggleStepLockBtn: requiredElement(root.querySelector<HTMLButtonElement>("#toggle-step-lock-btn"), "#toggle-step-lock-btn"),
    deleteActionBtn: requiredElement(root.querySelector<HTMLButtonElement>("#delete-action-btn"), "#delete-action-btn"),
    exportProjectBtn: requiredElement(root.querySelector<HTMLButtonElement>("#export-project-btn"), "#export-project-btn"),
    exportBtn: requiredElement(root.querySelector<HTMLButtonElement>("#export-btn"), "#export-btn"),
    toolButtons: [...root.querySelectorAll<HTMLButtonElement>("[data-tool]")]
  };
}
