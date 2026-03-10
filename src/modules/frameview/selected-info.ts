import type { Annotation, Frame, TimelineAction, TimelineStep } from "../models";

export function buildSelectedInfoText(
  frames: Frame[],
  actions: Map<string, TimelineStep>,
  annotations: Map<string, Annotation>,
  selectedFrameId: string | null,
  selectedActionId: string | null,
  getActionLabel: (action: TimelineAction) => string
) {
  const frame = selectedFrameId ? frames.find((item) => item.id === selectedFrameId) ?? null : null;
  const action = selectedActionId ? actions.get(selectedActionId) ?? null : null;
  if (!frame && !action) {
    return "当前无选中项";
  }
  const frameLabel = frame ? `帧${frames.findIndex((item) => item.id === frame.id) + 1}` : "未选中帧";
  if (!action) {
    return `选中: ${frameLabel}`;
  }
  if (action.type === "annotation") {
    const annotation = annotations.get(action.annotationId);
    return `选中: ${frameLabel} / 标注:${annotation?.kind ?? "unknown"} (${annotation?.locked ? "已锁定" : "未锁定"})`;
  }
  return `选中: ${frameLabel} / 动作:${getActionLabel(action.action)}`;
}
