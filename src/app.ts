import { CanvasController, getSaveModeText, queryAppDom } from "@modules";
import { APP_TEMPLATE } from "./app-template";
import { createExportRuntime } from "./app-export-runtime";
import { createAppMountContext } from "./app-mount-context";
import { createTimelineRuntime } from "./app-timeline-runtime";
import { createAppRefreshRuntime } from "./app-refresh-runtime";
import { bindAppEvents } from "./app-events";
import { createCanvasCallbacks } from "./app-canvas-callbacks";
import { createAppEventHandlers } from "./app-handlers";
import { createInitialState } from "./app-state";
import {
  deleteFrameById as deleteFrameByIdInState,
  removeActionsFromState,
  toggleClearBeforeFrame as toggleClearBeforeFrameInState,
  toggleFrameExclusive as toggleFrameExclusiveInState
} from "./app-state-ops";

export function mountApp(root: HTMLDivElement) {
  const state = createInitialState();
  root.innerHTML = APP_TEMPLATE;
  const {
    stageContainer,
    statusText,
    frameListPanel,
    timelinePanel,
    frameDescEditor,
    openExportPanelBtn,
    exportDialog,
    exportCloseBtn,
    settingsBtn,
    settingsDialog,
    frameDescInput,
    settingSavePath,
    settingNamePattern,
    settingPatternTip,
    settingPreview,
    settingCancelBtn,
    settingSaveBtn,
    frameDescCancelBtn,
    frameDescSaveBtn,
    imageInput,
    exportFrameList,
    exportFeedback,
    selectedInfo,
    styleColor,
    styleStroke,
    styleArrow,
    styleFont,
    applyStyleBtn,
    addEmptyFrameBtn,
    addClearBtn,
    toggleFrameFocusBtn,
    toggleStepLockBtn,
    deleteActionBtn,
    exportBtn,
    toolButtons
  } = queryAppDom(root);

  let refresh = () => {};
  let syncStyleInputsFromSelected = () => {};
  const setStatus = (message: string) => {
    statusText.textContent = message;
  };
  const setExportFeedback = (message: string, kind: "info" | "success" | "error" = "info") => {
    exportFeedback.textContent = message;
    exportFeedback.dataset.kind = kind;
  };

  const controller = new CanvasController(
    {
      container: stageContainer,
      callbacks: createCanvasCallbacks({
        state,
        refresh: () => refresh(),
        setStatus,
        syncStyleInputsFromSelected: () => syncStyleInputsFromSelected()
      })
    },
    state.style
  );
  const mountContext = createAppMountContext({
    state,
    controller,
    statusText,
    exportFeedback,
    frameDescEditor,
    frameDescInput,
    styleColor,
    styleStroke,
    styleArrow,
    styleFont,
    applyStyleBtn,
    toggleStepLockBtn,
    deleteActionBtn,
    addClearBtn,
    toggleFrameFocusBtn
  });
  const {
    styleControls,
    actionControls,
    collectStyleFromInputs,
    openFrameDescEditor,
    closeFrameDescEditor,
    getEditingFrameDescId
  } = mountContext;

  const toggleClearBeforeFrame = (frameId: string) => toggleClearBeforeFrameInState(state, frameId);
  const toggleFrameExclusive = (frameId: string) => toggleFrameExclusiveInState(state, frameId);
  const removeActions = (actionIds: string[]) => removeActionsFromState(state, actionIds);
  const deleteFrameById = (frameId: string) =>
    deleteFrameByIdInState(state, frameId, {
      editingFrameDescId: getEditingFrameDescId(),
      closeFrameDescEditor
    });

  const exportRuntime = createExportRuntime({
    state,
    controller,
    exportBtn,
    setStatus,
    setExportFeedback,
    refresh: () => refresh()
  });
  const timelineSortableSystem = createTimelineRuntime({
    root: frameListPanel,
    state,
    refresh: () => refresh(),
    setStatus
  });
  const refreshRuntime = createAppRefreshRuntime({
    state,
    controller,
    frameListPanel,
    exportFrameList,
    selectedInfo,
    toolButtons,
    styleControls,
    actionControls,
    setStatus,
    openFrameDescEditor,
    deleteFrameById,
    toggleFrameExclusive,
    toggleClearBeforeFrame,
    exportRuntime,
    timelineSortableSystem
  });
  refresh = refreshRuntime.refresh;
  syncStyleInputsFromSelected = refreshRuntime.syncStyleInputsFromSelected;

  const appEventHandlers = createAppEventHandlers({
    state,
    exportDialog,
    settingsDialog,
    settingSavePath,
    settingNamePattern,
    settingPatternTip,
    settingPreview,
    frameDescInput,
    getEditingFrameDescId,
    refresh,
    setStatus,
    setExportFeedback,
    closeFrameDescEditor,
    collectStyleFromInputs,
    getSelectedAnnotation: () => refreshRuntime.getSelectedAnnotation(),
    toggleClearBeforeFrame,
    removeActions,
    loadImage: (file) => controller.loadImage(file),
    runExport: exportRuntime.runExport
  });
  const unbindAppEvents = bindAppEvents({
    toolButtons,
    openExportPanelBtn,
    exportCloseBtn,
    settingsBtn,
    settingCancelBtn,
    settingNamePattern,
    settingSaveBtn,
    frameDescCancelBtn,
    frameDescSaveBtn,
    styleColor,
    styleStroke,
    styleArrow,
    styleFont,
    applyStyleBtn,
    imageInput,
    addEmptyFrameBtn,
    addClearBtn,
    timelinePanel,
    toggleFrameFocusBtn,
    toggleStepLockBtn,
    deleteActionBtn,
    exportBtn,
    ...appEventHandlers
  });

  refresh();
  setExportFeedback(`${getSaveModeText(state.exportSettings)} | 命名格式: ${state.exportSettings.filePattern}`);
  window.addEventListener("beforeunload", () => {
    unbindAppEvents();
    timelineSortableSystem.destroy();
    controller.destroy();
  });
}
