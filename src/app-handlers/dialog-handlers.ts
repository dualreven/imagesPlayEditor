import {
  closeSettingsDialog,
  getExportSettingsSummaryText,
  normalizeExportSettings,
  openLocalPath,
  openLocalBuildHistoryFile,
  openSettingsDialog,
  refreshSettingsPatternPreview,
  saveExportSettings,
  selectSettingsTab,
  updateFrameDescription
} from "@modules";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

type DialogCallbacks = Pick<
  EventCallbacks,
  | "onOpenExportDialog"
  | "onCloseExportDialog"
  | "onOpenExportDirectory"
  | "onOpenSettings"
  | "onCloseSettings"
  | "onSettingTabSelect"
  | "onSettingPatternInput"
  | "onSettingSave"
  | "onOpenUpdateHistoryFile"
  | "onFrameDescCancel"
  | "onFrameDescSave"
>;

export function createDialogHandlers(options: CreateAppEventHandlersOptions): DialogCallbacks {
  const {
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
    frameDescInput,
    getEditingFrameDescId,
    refresh,
    setStatus,
    setExportFeedback,
    closeFrameDescEditor
  } = options;

  return {
    onOpenExportDialog: () => {
      if (typeof exportDialog.showModal === "function") {
        exportDialog.showModal();
        return;
      }
      exportDialog.setAttribute("open", "true");
    },
    onCloseExportDialog: () => closeSettingsDialog(exportDialog),
    onOpenExportDirectory: async () => {
      try {
        const targetPath = (state.exportSettings.savePath || state.lastExportDir || "").trim();
        if (!targetPath) {
          throw new Error("当前没有可打开的导出目录，请先导出到本地目录。");
        }
        await openLocalPath(targetPath);
        setStatus(`已打开导出目录: ${targetPath}`);
      } catch (error) {
        console.error(error);
        setStatus(`打开导出目录失败: ${(error as Error).message}`);
      }
    },
    onOpenSettings: () =>
      openSettingsDialog(
        {
          dialog: settingsDialog,
          tabButtons: settingTabButtons,
          savePathInput: settingSavePath,
          zipNameInput: settingZipName,
          zipNameTip: settingZipNameTip,
          saveBtn: options.settingSaveBtn,
          patternInput: settingNamePattern,
          patternTip: settingPatternTip,
          preview: settingPreview,
          versionLineMain: settingVersionLineMain,
          versionLineDetail: settingVersionLineDetail,
          versionLineTime: settingVersionLineTime,
          updateList: settingUpdateList,
          historyList: settingHistoryList,
          historyFilePath: settingHistoryFilePath,
          openHistoryBtn: settingOpenHistoryBtn
        },
        state.exportSettings
      ),
    onCloseSettings: () => closeSettingsDialog(settingsDialog),
    onSettingTabSelect: (tabId) =>
      selectSettingsTab(
        {
          dialog: settingsDialog,
          tabButtons: settingTabButtons,
          saveBtn: options.settingSaveBtn
        },
        tabId
      ),
    onSettingPatternInput: () => {
      refreshSettingsPatternPreview({
        zipNameInput: settingZipName,
        zipNameTip: settingZipNameTip,
        patternInput: settingNamePattern,
        patternTip: settingPatternTip,
        preview: settingPreview
      });
    },
    onOpenUpdateHistoryFile: async () => {
      try {
        await openLocalBuildHistoryFile();
        setStatus("已打开本地更新文件");
      } catch (error) {
        const message = error instanceof Error ? error.message : "打开本地更新文件失败";
        setStatus(message);
      }
    },
    onSettingSave: () => {
      if (
        !refreshSettingsPatternPreview({
          zipNameInput: settingZipName,
          zipNameTip: settingZipNameTip,
          patternInput: settingNamePattern,
          patternTip: settingPatternTip,
          preview: settingPreview
        })
      ) {
        return;
      }
      state.exportSettings = normalizeExportSettings({
        savePath: settingSavePath.value,
        filePattern: settingNamePattern.value,
        zipFileName: settingZipName.value
      });
      saveExportSettings(state.exportSettings);
      closeSettingsDialog(settingsDialog);
      refresh();
      setStatus("导出设置已保存");
      setExportFeedback(getExportSettingsSummaryText(state.exportSettings));
    },
    onFrameDescCancel: () => closeFrameDescEditor(),
    onFrameDescSave: () => {
      const editingFrameDescId = getEditingFrameDescId();
      if (!editingFrameDescId) return;
      state.frames = updateFrameDescription(state.frames, editingFrameDescId, frameDescInput.value.trim());
      closeFrameDescEditor();
      refresh();
      setStatus("帧描述已更新");
    }
  };
}
