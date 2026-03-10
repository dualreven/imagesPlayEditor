import { selectActionInFrame, selectFrameOnly, type Frame } from "@modules";
import type { AppState } from "../app-state";

type FramePanelState = Pick<AppState, "frames" | "selectedFrameId" | "selectedActionId" | "selectedAnnotationId">;

interface CreateFramePanelHandlersOptions {
  state: FramePanelState;
  refresh: () => void;
  setStatus: (message: string) => void;
  openFrameDescEditor: (frame: Frame) => void;
  deleteFrameById: (frameId: string) => boolean;
  toggleFrameExclusive: (frameId: string) => boolean;
  toggleClearBeforeFrame: (frameId: string) => boolean | null;
  syncStyleInputsFromSelected: () => void;
}

export function createFramePanelHandlers(options: CreateFramePanelHandlersOptions) {
  const {
    state,
    refresh,
    setStatus,
    openFrameDescEditor,
    deleteFrameById,
    toggleFrameExclusive,
    toggleClearBeforeFrame,
    syncStyleInputsFromSelected
  } = options;

  return {
    onSelectFrame: (frameId: string) => {
      selectFrameOnly(state, frameId);
      refresh();
    },
    onEditFrame: (frameId: string) => {
      const frame = state.frames.find((item) => item.id === frameId);
      if (!frame) return;
      selectFrameOnly(state, frameId);
      openFrameDescEditor(frame);
      refresh();
    },
    onDeleteFrame: (frameId: string) => {
      if (!deleteFrameById(frameId)) return;
      refresh();
      setStatus("已删除选中帧");
    },
    onToggleFrameExclusive: (frameId: string) => {
      const enabled = toggleFrameExclusive(frameId);
      selectFrameOnly(state, frameId);
      refresh();
      setStatus(enabled ? "当前帧已开启标注独占" : "当前帧已关闭标注独占");
    },
    onToggleClearBefore: (frameId: string) => {
      const enabled = toggleClearBeforeFrame(frameId);
      if (enabled === null) return;
      selectFrameOnly(state, frameId);
      refresh();
      setStatus(enabled ? "已在该帧前插入清空动作" : "已取消该帧前清空动作");
    },
    onSelectAction: (actionId: string, frameId: string, annotationId: string | null) => {
      selectActionInFrame(state, actionId, frameId, annotationId);
      syncStyleInputsFromSelected();
      refresh();
    }
  };
}
