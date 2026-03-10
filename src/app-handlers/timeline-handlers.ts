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
  | "onToggleFrameFocus"
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
      clearSelection(state, { resetFocusedView: true });
      refresh();
      setStatus("已取消选中");
    },
    onToggleFrameFocus: () => {
      if (!state.showCurrentFrameOnly && !state.selectedFrameId) {
        setStatus("请先选中一个帧");
        return;
      }
      state.showCurrentFrameOnly = !state.showCurrentFrameOnly;
      refresh();
      setStatus(state.showCurrentFrameOnly ? "已开启仅显示当前帧" : "已关闭仅显示当前帧");
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
