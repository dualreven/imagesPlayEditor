import { clearActionSelection, getToolLabel, mergeStyleForAnnotation, updateAnnotationStyle } from "@modules";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

type ToolAndStyleCallbacks = Pick<
  EventCallbacks,
  "onToolSelect" | "onStyleInputChange" | "onApplyStyle" | "onImageInputChange"
>;

export function createToolAndStyleHandlers(options: CreateAppEventHandlersOptions): ToolAndStyleCallbacks {
  const { state, refresh, setStatus, collectStyleFromInputs, getSelectedAnnotation, loadImage } = options;

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
    onImageInputChange: async (file, sourcePath) => {
      if (!file) return;
      try {
        const image = await loadImage(file, sourcePath);
        state.image = image;
        refresh();
        setStatus(`图片已加载: ${image.width}x${image.height}`);
      } catch (error) {
        console.error(error);
        setStatus("图片加载失败");
      }
    }
  };
}
