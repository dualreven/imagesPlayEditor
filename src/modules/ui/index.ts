import type { Annotation, AnnotationStyle, DrawingTool, TimelineAction } from "../models";
import type { ExportSettings } from "../settings";

export function getToolLabel(tool: DrawingTool) {
  const labelMap: Record<DrawingTool, string> = {
    select: "选择",
    box: "框选",
    arrow: "箭头",
    text: "文字"
  };
  return labelMap[tool];
}

export function getActionLabel(action: TimelineAction) {
  return action === "clear_previous" ? "清空之前标注(锁定保留)" : "保留下一个标注";
}

export function getEditableStyleFlags(kind: Annotation["kind"] | null) {
  if (kind === "box") {
    return { color: true, stroke: true, arrow: false, font: false };
  }
  if (kind === "arrow") {
    return { color: true, stroke: true, arrow: true, font: false };
  }
  if (kind === "text") {
    return { color: true, stroke: false, arrow: false, font: true };
  }
  return { color: true, stroke: true, arrow: true, font: true };
}

export function mergeStyleForAnnotation(annotation: Annotation, draft: AnnotationStyle): AnnotationStyle {
  const next = { ...annotation.style, color: draft.color };
  if (annotation.kind === "box" || annotation.kind === "arrow") {
    next.strokeWidth = draft.strokeWidth;
  }
  if (annotation.kind === "arrow") {
    next.arrowLength = draft.arrowLength;
  }
  if (annotation.kind === "text") {
    next.fontSize = draft.fontSize;
  }
  return next;
}

export function getSaveModeText(settings: ExportSettings) {
  return settings.savePath ? `保存路径: ${settings.savePath}` : "保存路径: 浏览器下载目录";
}

