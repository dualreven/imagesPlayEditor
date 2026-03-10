import { getEditableStyleFlags, type Annotation, type DrawingTool, type TimelineStep } from "@modules";

export interface StyleControls {
  styleColor: HTMLInputElement;
  styleStroke: HTMLInputElement;
  styleArrow: HTMLInputElement;
  styleFont: HTMLInputElement;
  applyStyleBtn: HTMLButtonElement;
}

export interface ActionControls {
  toggleStepLockBtn: HTMLButtonElement;
  deleteActionBtn: HTMLButtonElement;
  addClearBtn: HTMLButtonElement;
  toggleFrameFocusBtn: HTMLButtonElement;
}

interface ActionControlState {
  selectedAction: TimelineStep | null;
  selectedFrameIndex: number;
  selectedFrameId: string | null;
  showCurrentFrameOnly: boolean;
}

export function renderToolState(toolButtons: HTMLButtonElement[], tool: DrawingTool) {
  toolButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
}

export function syncStyleInputsFromAnnotation(annotation: Annotation | null, controls: StyleControls) {
  if (!annotation) return;
  controls.styleColor.value = annotation.style.color;
  controls.styleStroke.value = String(annotation.style.strokeWidth);
  controls.styleArrow.value = String(annotation.style.arrowLength);
  controls.styleFont.value = String(annotation.style.fontSize);
}

export function updateStyleControlAvailability(annotation: Annotation | null, controls: StyleControls) {
  const flags = getEditableStyleFlags(annotation?.kind ?? null);
  controls.styleColor.disabled = !flags.color;
  controls.styleStroke.disabled = !flags.stroke;
  controls.styleArrow.disabled = !flags.arrow;
  controls.styleFont.disabled = !flags.font;
  controls.applyStyleBtn.textContent = annotation ? "应用到选中标注" : "更新默认绘制样式";
  controls.applyStyleBtn.title = annotation ? `当前标注类型: ${annotation.kind}` : "未选中标注，可设置默认样式";
}

export function updateActionFrameControlAvailability(state: ActionControlState, controls: ActionControls) {
  controls.toggleStepLockBtn.disabled = !state.selectedAction || state.selectedAction.type !== "annotation";
  controls.deleteActionBtn.disabled = !state.selectedAction;
  controls.addClearBtn.disabled = state.selectedFrameIndex <= 0;
  controls.toggleFrameFocusBtn.disabled = !state.selectedFrameId && !state.showCurrentFrameOnly;
  controls.toggleFrameFocusBtn.textContent = state.showCurrentFrameOnly ? "取消仅显示当前帧" : "仅显示当前帧";
}
