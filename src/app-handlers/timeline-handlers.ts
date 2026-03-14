import {
  clearActionSelection,
  clearSelection,
  createFrame,
  findFrameIdByActionId,
  hasSelection,
  selectFrameOnly
} from "@modules";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

type TimelineCallbacks = Pick<
  EventCallbacks,
  | "onAddEmptyFrame"
  | "onAddClearBefore"
  | "onTimelineBackgroundClick"
  | "onFrameVisibilityChange"
  | "onToggleStepLock"
  | "onDeleteAction"
>;

const DEFAULT_TIMELINE_IGNORE_SELECTOR =
  "button, input, textarea, label, .frame-card, .frame-clear-separator, .frame-desc-editor, .frame-new-dropzone";

export function createTimelineHandlers(options: CreateAppEventHandlersOptions): TimelineCallbacks {
  const {
    state,
    refresh,
    setStatus,
    toggleClearBeforeFrame,
    removeActions,
    timelineIgnoreSelector = DEFAULT_TIMELINE_IGNORE_SELECTOR
  } = options;

  return {
    onAddEmptyFrame: () => {
      state.frames = [...state.frames, createFrame()];
      refresh();
      setStatus("已添加空帧");
    },
    onAddClearBefore: () => {
      if (!state.selectedFrameId) {
        setStatus("请先选中目标帧（将在其前插入清空）");
        return;
      }
      const enabled = toggleClearBeforeFrame(state.selectedFrameId);
      if (enabled === null) {
        setStatus("清空动作只能放在帧之间，请选择第2帧及之后");
        return;
      }
      clearActionSelection(state);
      refresh();
      setStatus(enabled ? "已在选中帧前插入清空动作" : "已取消选中帧前清空动作");
    },
    onTimelineBackgroundClick: (target) => {
      if (!target || target.closest(timelineIgnoreSelector)) return;
      if (!hasSelection(state)) return;
      clearSelection(state);
      refresh();
      setStatus("已取消选中");
    },
    onFrameVisibilityChange: (sliderValue) => {
      const nextValue = Number(sliderValue);
      if (!Number.isInteger(nextValue) || nextValue < 0) {
        setStatus("帧过滤值无效");
        return;
      }
      if (nextValue === 0) {
        state.focusedFrameId = null;
        refresh();
        setStatus("已显示全部帧内容");
        return;
      }
      const frame = state.frames[nextValue - 1];
      if (!frame) {
        setStatus("目标帧不存在");
        return;
      }
      state.focusedFrameId = frame.id;
      refresh();
      setStatus(`已切换为仅显示帧${nextValue}内容`);
    },
    onToggleStepLock: () => {
      if (!state.selectedActionId) {
        setStatus("请先选中一个动作");
        return;
      }
      const action = state.actions.get(state.selectedActionId);
      if (!action || action.type !== "annotation") {
        setStatus("当前动作不支持锁定");
        return;
      }
      const annotation = state.annotations.get(action.annotationId);
      if (!annotation) return;
      annotation.locked = !annotation.locked;
      refresh();
      setStatus(annotation.locked ? "选中标注已锁定" : "选中标注已解锁");
    },
    onDeleteAction: () => {
      if (!state.selectedActionId) {
        setStatus("请先选中一个动作");
        return;
      }
      const frameId = findFrameIdByActionId(state.frames, state.selectedActionId);
      removeActions([state.selectedActionId]);
      if (frameId) {
        selectFrameOnly(state, frameId);
      } else {
        clearActionSelection(state);
        state.selectedFrameId = null;
      }
      refresh();
      setStatus("已删除选中动作");
    }
  };
}
