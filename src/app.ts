import { CanvasController, getExportSettingsSummaryText, queryAppDom } from "@modules";
import { APP_TEMPLATE } from "./app-template";
import { createExportRuntime } from "./app-export-runtime";
import { createAppMountContext } from "./app-mount-context";
import { createProjectRuntime, sanitizeFileInputPath } from "./app-project-runtime";
import { createTimelineRuntime } from "./app-timeline-runtime";
import { createAppRefreshRuntime } from "./app-refresh-runtime";
import { bindAppEvents } from "./app-events";
import { createCanvasCallbacks } from "./app-canvas-callbacks";
import { createAppEventHandlers } from "./app-handlers";
import { createInitialState } from "./app-state";
import {
  duplicateFrameById as duplicateFrameByIdInState,
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
    exportOpenDirBtn,
    exportCloseBtn,
    refreshCanvasBtn,
    settingsBtn,
    settingsDialog,
    settingTabButtons,
    frameDescInput,
    settingSavePath,
    settingZipName,
    settingZipNameTip,
    settingNamePattern,
    settingPatternTip,
    settingPreview,
    settingVersionLineMain,
    settingVersionLineDetail,
    settingVersionLineTime,
    settingUpdateList,
    settingHistoryList,
    settingHistoryFilePath,
    settingOpenHistoryBtn,
    settingCancelBtn,
    settingSaveBtn,
    frameDescCancelBtn,
    frameDescSaveBtn,
    imageInput,
    projectInput,
    exportFrameList,
    exportFeedback,
    selectedInfo,
    styleColor,
    styleStroke,
    styleArrow,
    styleFont,
    applyStyleBtn,
    frameVisibilitySlider,
    frameVisibilityValue,
    addEmptyFrameBtn,
    addClearBtn,
    toggleStepLockBtn,
    deleteActionBtn,
    exportProjectBtn,
    exportBtn,
    toolButtons
  } = queryAppDom(root);

  let refresh = () => {};
  let queueFramePanelScroll: (frameId: string) => void = () => {};
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
        queueFramePanelScroll: (frameId) => queueFramePanelScroll(frameId),
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
    frameVisibilitySlider,
    frameVisibilityValue,
    toggleStepLockBtn,
    deleteActionBtn,
    addClearBtn
  });
  const {
    styleControls,
    actionControls,
    frameFilterControls,
    collectStyleFromInputs,
    openFrameDescEditor,
    closeFrameDescEditor,
    getEditingFrameDescId
  } = mountContext;

  const toggleClearBeforeFrame = (frameId: string) => toggleClearBeforeFrameInState(state, frameId);
  const toggleFrameExclusive = (frameId: string) => toggleFrameExclusiveInState(state, frameId);
  const duplicateFrameById = (frameId: string) => duplicateFrameByIdInState(state, frameId);
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
  const projectRuntime = createProjectRuntime({
    state,
    controller
  });
  const timelineSortableSystem = createTimelineRuntime({
    root: frameListPanel,
    state,
    refresh: () => refresh(),
    queueFramePanelScroll: (frameId) => queueFramePanelScroll(frameId),
    setStatus
  });
  const refreshRuntime = createAppRefreshRuntime({
    state,
    controller,
    frameListPanel,
    exportFrameList,
    selectedInfo,
    exportOpenDirBtn,
    toolButtons,
    styleControls,
    actionControls,
    frameFilterControls,
    setStatus,
    openFrameDescEditor,
    duplicateFrameById,
    deleteFrameById,
    toggleFrameExclusive,
    toggleClearBeforeFrame,
    exportRuntime,
    timelineSortableSystem
  });
  refresh = refreshRuntime.refresh;
  queueFramePanelScroll = refreshRuntime.queueFramePanelScroll;
  syncStyleInputsFromSelected = refreshRuntime.syncStyleInputsFromSelected;

  const appEventHandlers = createAppEventHandlers({
    state,
    exportDialog,
    settingsDialog,
    settingTabButtons,
    settingSavePath,
    settingZipName,
    settingZipNameTip,
    settingNamePattern,
    settingPatternTip,
    settingPreview,
    settingVersionLineMain,
    settingVersionLineDetail,
    settingVersionLineTime,
    settingUpdateList,
    settingHistoryList,
    settingHistoryFilePath,
    settingOpenHistoryBtn,
    settingSaveBtn,
    frameDescInput,
    getEditingFrameDescId,
    refresh,
    setStatus,
    setExportFeedback,
    closeFrameDescEditor,
    collectStyleFromInputs,
    getSelectedAnnotation: () => refreshRuntime.getSelectedAnnotation(),
    loadImageSource: (imageSource) => controller.loadImageSource(imageSource),
    refreshCanvas: () => controller.refreshCanvas(),
    getDropImageFile: (dataTransfer) => controller.getDropImageFile(dataTransfer),
    queueFramePanelScroll: (frameId) => queueFramePanelScroll(frameId),
    toggleClearBeforeFrame,
    removeActions,
    loadImage: (file, sourcePath) =>
      controller.loadImage(file, sanitizeFileInputPath(sourcePath, file.name)),
    exportProject: projectRuntime.exportProject,
    importProject: projectRuntime.importProject,
    runExport: exportRuntime.runExport
  });
  const unbindAppEvents = bindAppEvents({
    toolButtons,
    openExportPanelBtn,
    exportCloseBtn,
    exportOpenDirBtn,
    refreshCanvasBtn,
    settingsBtn,
    settingTabButtons,
    settingCancelBtn,
    settingZipName,
    settingNamePattern,
    settingSaveBtn,
    settingOpenHistoryBtn,
    frameDescCancelBtn,
    frameDescSaveBtn,
    styleColor,
    styleStroke,
    styleArrow,
    styleFont,
    applyStyleBtn,
    imageInput,
    stageContainer,
    projectInput,
    addEmptyFrameBtn,
    addClearBtn,
    timelinePanel,
    frameVisibilitySlider,
    toggleStepLockBtn,
    deleteActionBtn,
    exportProjectBtn,
    exportBtn,
    ...appEventHandlers
  });

  refresh();
  setExportFeedback(getExportSettingsSummaryText(state.exportSettings));
  window.addEventListener("beforeunload", () => {
    unbindAppEvents();
    timelineSortableSystem.destroy();
    controller.destroy();
  });
}
