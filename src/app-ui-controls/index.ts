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
}

export interface FrameFilterControls {
  frameVisibilitySlider: HTMLInputElement;
  frameVisibilityValue: HTMLElement;
}

interface ActionControlState {
  selectedAction: TimelineStep | null;
  selectedFrameIndex: number;
}

interface FrameFilterState {
  frameIds: string[];
  focusedFrameId: string | null;
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
  const tooltip = annotation ? `应用到 ${annotation.name}` : "更新默认绘制样式";
  controls.applyStyleBtn.title = tooltip;
  controls.applyStyleBtn.setAttribute("aria-label", tooltip);
  controls.applyStyleBtn.dataset.tooltip = tooltip;
}

export function updateActionFrameControlAvailability(state: ActionControlState, controls: ActionControls) {
  controls.toggleStepLockBtn.disabled = !state.selectedAction || state.selectedAction.type !== "annotation";
  controls.deleteActionBtn.disabled = !state.selectedAction;
  controls.addClearBtn.disabled = state.selectedFrameIndex <= 0;
}

export function syncFrameFilterControls(state: FrameFilterState, controls: FrameFilterControls) {
  const frameCount = state.frameIds.length;
  controls.frameVisibilitySlider.min = "0";
  controls.frameVisibilitySlider.max = String(frameCount);
  controls.frameVisibilitySlider.step = "1";
  controls.frameVisibilitySlider.disabled = frameCount === 0;
  const focusedIndex = state.focusedFrameId ? state.frameIds.indexOf(state.focusedFrameId) : -1;
  const nextValue = focusedIndex >= 0 ? focusedIndex + 1 : 0;
  controls.frameVisibilitySlider.value = String(nextValue);
  controls.frameVisibilityValue.textContent = nextValue === 0 ? "全部" : `帧${nextValue}`;
}
