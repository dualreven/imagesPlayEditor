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
import { resetStateForLoadedImage } from "./image-load-state-reset";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

const DRAG_COPY_DROP_EFFECT = "copy";

type ToolAndStyleCallbacks = Pick<
  EventCallbacks,
  | "onToolSelect"
  | "onStyleInputChange"
  | "onApplyStyle"
  | "onRequestImagePick"
  | "onImageInputChange"
  | "onRefreshCanvas"
  | "onCanvasDragOver"
  | "onCanvasDrop"
>;

export function createToolAndStyleHandlers(options: CreateAppEventHandlersOptions): ToolAndStyleCallbacks {
  const {
    state,
    refresh,
    setStatus,
    setExportFeedback,
    collectStyleFromInputs,
    getSelectedAnnotation,
    loadImage,
    loadImageSource,
    refreshCanvas,
    getDropImageFile
  } = options;

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
    const hadImage = Boolean(state.image);
    const filePattern = buildFilePatternFromImageName(fileName);
    const image = await load();
    resetStateForLoadedImage(state);
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
    setExportFeedback(hadImage ? "已清空旧标注并加载新图片" : getExportSettingsSummaryText(state.exportSettings));
  };

  const loadDroppedImage = async (event: DragEvent) => {
    event.preventDefault();
    const file = getDropImageFile(event.dataTransfer);
    if (!file) {
      setStatus("拖拽的不是图片文件");
      setExportFeedback("拖拽未执行：仅支持图片文件", "error");
      return;
    }
    await applyLoadedImage(file.name, null, () => loadImage(file, null));
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
    },
    onRefreshCanvas: () => {
      refreshCanvas();
      refresh();
      setStatus("画布已刷新");
    },
    onCanvasDragOver: (event) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = DRAG_COPY_DROP_EFFECT;
      }
    },
    onCanvasDrop: async (event) => {
      try {
        await loadDroppedImage(event);
      } catch (error) {
        console.error(error);
        setStatus(`图片加载失败: ${(error as Error).message}`);
      }
    }
  };
}
