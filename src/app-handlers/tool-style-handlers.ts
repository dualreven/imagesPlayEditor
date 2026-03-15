import {
  buildSavePathFromImageSourcePath,
  buildFilePatternFromImageName,
  buildZipFileNameFromImageName,
  clearActionSelection,
  getExportSettingsSummaryText,
  getToolLabel,
  isTauriRuntime,
  mergeStyleForAnnotation,
  pickLocalImageSource,
  saveExportSettings,
  updateAnnotationStyle
} from "@modules";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

type ToolAndStyleCallbacks = Pick<
  EventCallbacks,
  "onToolSelect" | "onStyleInputChange" | "onApplyStyle" | "onRequestImagePick" | "onImageInputChange"
>;

export function createToolAndStyleHandlers(options: CreateAppEventHandlersOptions): ToolAndStyleCallbacks {
  const { state, refresh, setStatus, setExportFeedback, collectStyleFromInputs, getSelectedAnnotation, loadImage, loadImageSource } = options;

  const applyLoadedImage = async (
    fileName: string,
    sourcePath: string | null,
    load: () => Promise<{
      src: string;
      width: number;
      height: number;
      fileName: string;
      sourcePath: string | null;
    }>
  ) => {
    const filePattern = buildFilePatternFromImageName(fileName);
    const image = await load();
    state.image = image;
    state.lastExportDir = null;
    state.exportSettings = {
      ...state.exportSettings,
      savePath: buildSavePathFromImageSourcePath(sourcePath ?? image.sourcePath, fileName),
      filePattern,
      zipFileName: buildZipFileNameFromImageName(fileName)
    };
    saveExportSettings(state.exportSettings);
    refresh();
    setStatus(`图片已加载: ${image.width}x${image.height}`);
    setExportFeedback(getExportSettingsSummaryText(state.exportSettings));
  };

  return {
    onToolSelect: (tool) => {
      state.tool = tool;
      if (tool === "box" || tool === "arrow" || tool === "text") {
        state.selectedFrameId = null;
        clearActionSelection(state);
      }
      refresh();
      setStatus(`当前工具: ${getToolLabel(tool)}`);
    },
    onStyleInputChange: () => {
      collectStyleFromInputs();
      refresh();
    },
    onApplyStyle: () => {
      collectStyleFromInputs();
      const annotation = getSelectedAnnotation();
      if (!annotation) {
        setStatus("样式已更新为默认绘制样式");
        return;
      }
      const mergedStyle = mergeStyleForAnnotation(annotation, state.style);
      state.annotations.set(annotation.id, updateAnnotationStyle(annotation, mergedStyle));
      refresh();
      setStatus("已应用样式到选中标注");
    },
    onRequestImagePick: async (event) => {
      if (!isTauriRuntime()) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      try {
        const picked = await pickLocalImageSource();
        if (!picked) {
          return;
        }
        await applyLoadedImage(picked.fileName, picked.filePath, () =>
          loadImageSource({
            src: picked.dataUrl,
            width: 0,
            height: 0,
            fileName: picked.fileName,
            sourcePath: picked.filePath
          })
        );
      } catch (error) {
        console.error(error);
        setStatus(`图片加载失败: ${(error as Error).message}`);
      }
    },
    onImageInputChange: async (file, sourcePath) => {
      if (!file) return;
      try {
        await applyLoadedImage(file.name, sourcePath, () => loadImage(file, sourcePath));
      } catch (error) {
        console.error(error);
        setStatus(`图片加载失败: ${(error as Error).message}`);
      }
    }
  };
}
