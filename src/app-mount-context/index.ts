import type { AnnotationStyle, CanvasController, Frame } from "@modules";
import type { AppState } from "../app-state";
import type { ActionControls, FrameFilterControls, StyleControls } from "../app-ui-controls";

interface CreateAppMountContextOptions {
  state: AppState;
  controller: CanvasController;
  statusText: HTMLElement;
  exportFeedback: HTMLElement;
  frameDescEditor: HTMLElement;
  frameDescInput: HTMLTextAreaElement;
  styleColor: HTMLInputElement;
  styleStroke: HTMLInputElement;
  styleArrow: HTMLInputElement;
  styleFont: HTMLInputElement;
  applyStyleBtn: HTMLButtonElement;
  frameVisibilitySlider: HTMLInputElement;
  frameVisibilityValue: HTMLElement;
  toggleStepLockBtn: HTMLButtonElement;
  deleteActionBtn: HTMLButtonElement;
  addClearBtn: HTMLButtonElement;
}

export interface AppMountContext {
  styleControls: StyleControls;
  actionControls: ActionControls;
  frameFilterControls: FrameFilterControls;
  setStatus: (message: string) => void;
  setExportFeedback: (message: string, kind?: "info" | "success" | "error") => void;
  collectStyleFromInputs: () => void;
  openFrameDescEditor: (frame: Frame) => void;
  closeFrameDescEditor: () => void;
  getEditingFrameDescId: () => string | null;
}

export function createAppMountContext(options: CreateAppMountContextOptions): AppMountContext {
  const {
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
  } = options;

  let editingFrameDescId: string | null = null;
  const styleControls = { styleColor, styleStroke, styleArrow, styleFont, applyStyleBtn };
  const actionControls = { toggleStepLockBtn, deleteActionBtn, addClearBtn };
  const frameFilterControls = { frameVisibilitySlider, frameVisibilityValue };

  const setStatus = (message: string) => {
    statusText.textContent = message;
  };

  const setExportFeedback = (message: string, kind: "info" | "success" | "error" = "info") => {
    exportFeedback.textContent = message;
    exportFeedback.dataset.kind = kind;
  };

  const collectStyleFromInputs = () => {
    state.style = {
      color: styleColor.value,
      strokeWidth: Number(styleStroke.value),
      arrowLength: Number(styleArrow.value),
      fontSize: Number(styleFont.value)
    } satisfies AnnotationStyle;
    controller.setStyle(state.style);
  };

  const openFrameDescEditor = (frame: Frame) => {
    editingFrameDescId = frame.id;
    frameDescInput.value = frame.description;
    frameDescEditor.classList.remove("is-hidden");
    frameDescInput.focus();
  };

  const closeFrameDescEditor = () => {
    editingFrameDescId = null;
    frameDescEditor.classList.add("is-hidden");
  };

  return {
    styleControls,
    actionControls,
    frameFilterControls,
    setStatus,
    setExportFeedback,
    collectStyleFromInputs,
    openFrameDescEditor,
    closeFrameDescEditor,
    getEditingFrameDescId: () => editingFrameDescId
  };
}
