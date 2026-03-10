import {
  closeSettingsDialog,
  getSaveModeText,
  normalizeExportSettings,
  openSettingsDialog,
  refreshSettingsPatternPreview,
  saveExportSettings,
  updateFrameDescription
} from "@modules";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

type DialogCallbacks = Pick<
  EventCallbacks,
  | "onOpenExportDialog"
  | "onCloseExportDialog"
  | "onOpenSettings"
  | "onCloseSettings"
  | "onSettingPatternInput"
  | "onSettingSave"
  | "onFrameDescCancel"
  | "onFrameDescSave"
>;

export function createDialogHandlers(options: CreateAppEventHandlersOptions): DialogCallbacks {
  const {
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
    onOpenSettings: () =>
      openSettingsDialog(
        {
          dialog: settingsDialog,
          savePathInput: settingSavePath,
          patternInput: settingNamePattern,
          patternTip: settingPatternTip,
          preview: settingPreview
        },
        state.exportSettings
      ),
    onCloseSettings: () => closeSettingsDialog(settingsDialog),
    onSettingPatternInput: () => {
      refreshSettingsPatternPreview({
        patternInput: settingNamePattern,
        patternTip: settingPatternTip,
        preview: settingPreview
      });
    },
    onSettingSave: () => {
      if (
        !refreshSettingsPatternPreview({
          patternInput: settingNamePattern,
          patternTip: settingPatternTip,
          preview: settingPreview
        })
      ) {
        return;
      }
      state.exportSettings = normalizeExportSettings({
        savePath: settingSavePath.value,
        filePattern: settingNamePattern.value
      });
      saveExportSettings(state.exportSettings);
      closeSettingsDialog(settingsDialog);
      refresh();
      setStatus("导出设置已保存");
      setExportFeedback(`${getSaveModeText(state.exportSettings)} | 命名格式: ${state.exportSettings.filePattern}`);
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
