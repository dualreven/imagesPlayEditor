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
  exportCloseBtn: HTMLButtonElement;
  settingsBtn: HTMLButtonElement;
  settingsDialog: HTMLDialogElement;
  frameDescInput: HTMLTextAreaElement;
  settingSavePath: HTMLInputElement;
  settingNamePattern: HTMLInputElement;
  settingPatternTip: HTMLParagraphElement;
  settingPreview: HTMLParagraphElement;
  settingCancelBtn: HTMLButtonElement;
  settingSaveBtn: HTMLButtonElement;
  frameDescCancelBtn: HTMLButtonElement;
  frameDescSaveBtn: HTMLButtonElement;
  imageInput: HTMLInputElement;
  exportFrameList: HTMLOListElement;
  exportFeedback: HTMLParagraphElement;
  selectedInfo: HTMLParagraphElement;
  styleColor: HTMLInputElement;
  styleStroke: HTMLInputElement;
  styleArrow: HTMLInputElement;
  styleFont: HTMLInputElement;
  applyStyleBtn: HTMLButtonElement;
  addEmptyFrameBtn: HTMLButtonElement;
  addClearBtn: HTMLButtonElement;
  toggleFrameFocusBtn: HTMLButtonElement;
  toggleStepLockBtn: HTMLButtonElement;
  deleteActionBtn: HTMLButtonElement;
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
    exportCloseBtn: requiredElement(root.querySelector<HTMLButtonElement>("#export-close-btn"), "#export-close-btn"),
    settingsBtn: requiredElement(root.querySelector<HTMLButtonElement>("#settings-btn"), "#settings-btn"),
    settingsDialog: requiredElement(root.querySelector<HTMLDialogElement>("#settings-dialog"), "#settings-dialog"),
    frameDescInput: requiredElement(root.querySelector<HTMLTextAreaElement>("#frame-desc-input"), "#frame-desc-input"),
    settingSavePath: requiredElement(root.querySelector<HTMLInputElement>("#setting-save-path"), "#setting-save-path"),
    settingNamePattern: requiredElement(root.querySelector<HTMLInputElement>("#setting-name-pattern"), "#setting-name-pattern"),
    settingPatternTip: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-pattern-tip"), "#setting-pattern-tip"),
    settingPreview: requiredElement(root.querySelector<HTMLParagraphElement>("#setting-preview"), "#setting-preview"),
    settingCancelBtn: requiredElement(root.querySelector<HTMLButtonElement>("#setting-cancel-btn"), "#setting-cancel-btn"),
    settingSaveBtn: requiredElement(root.querySelector<HTMLButtonElement>("#setting-save-btn"), "#setting-save-btn"),
    frameDescCancelBtn: requiredElement(root.querySelector<HTMLButtonElement>("#frame-desc-cancel-btn"), "#frame-desc-cancel-btn"),
    frameDescSaveBtn: requiredElement(root.querySelector<HTMLButtonElement>("#frame-desc-save-btn"), "#frame-desc-save-btn"),
    imageInput: requiredElement(root.querySelector<HTMLInputElement>("#image-input"), "#image-input"),
    exportFrameList: requiredElement(root.querySelector<HTMLOListElement>("#export-frame-list"), "#export-frame-list"),
    exportFeedback: requiredElement(root.querySelector<HTMLParagraphElement>("#export-feedback"), "#export-feedback"),
    selectedInfo: requiredElement(root.querySelector<HTMLParagraphElement>("#selected-info"), "#selected-info"),
    styleColor: requiredElement(root.querySelector<HTMLInputElement>("#style-color"), "#style-color"),
    styleStroke: requiredElement(root.querySelector<HTMLInputElement>("#style-stroke"), "#style-stroke"),
    styleArrow: requiredElement(root.querySelector<HTMLInputElement>("#style-arrow"), "#style-arrow"),
    styleFont: requiredElement(root.querySelector<HTMLInputElement>("#style-font"), "#style-font"),
    applyStyleBtn: requiredElement(root.querySelector<HTMLButtonElement>("#apply-style-btn"), "#apply-style-btn"),
    addEmptyFrameBtn: requiredElement(root.querySelector<HTMLButtonElement>("#add-empty-frame-btn"), "#add-empty-frame-btn"),
    addClearBtn: requiredElement(root.querySelector<HTMLButtonElement>("#add-clear-btn"), "#add-clear-btn"),
    toggleFrameFocusBtn: requiredElement(root.querySelector<HTMLButtonElement>("#toggle-frame-focus-btn"), "#toggle-frame-focus-btn"),
    toggleStepLockBtn: requiredElement(root.querySelector<HTMLButtonElement>("#toggle-step-lock-btn"), "#toggle-step-lock-btn"),
    deleteActionBtn: requiredElement(root.querySelector<HTMLButtonElement>("#delete-action-btn"), "#delete-action-btn"),
    exportBtn: requiredElement(root.querySelector<HTMLButtonElement>("#export-btn"), "#export-btn"),
    toolButtons: [...root.querySelectorAll<HTMLButtonElement>("[data-tool]")]
  };
}
