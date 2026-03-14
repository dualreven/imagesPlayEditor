import {
  createTimelineSortableSystem,
  isNewFrameDropzoneId,
  readNewFrameDropzoneInsertIndex,
  moveActionToNewFrame,
  moveActionToFrame,
  selectActionInFrame,
  selectFrameOnly,
  type Frame
} from "@modules";
import type { AppState } from "../app-state";

interface CreateTimelineRuntimeOptions {
  root: HTMLElement;
  state: AppState;
  refresh: () => void;
  setStatus: (message: string) => void;
}

export function createTimelineRuntime(options: CreateTimelineRuntimeOptions) {
  const { root, state, refresh, setStatus } = options;
  return createTimelineSortableSystem({
    root,
    onMoveAction: (actionId, targetFrameId, insertIndex) => {
      if (isNewFrameDropzoneId(targetFrameId)) {
        const next = moveActionToNewFrame(state.frames, actionId, readNewFrameDropzoneInsertIndex(targetFrameId) ?? insertIndex);
        state.frames = next.frames;
        const action = state.actions.get(actionId);
        selectActionInFrame(state, actionId, next.newFrameId, action?.type === "annotation" ? action.annotationId : null);
        refresh();
        setStatus("动作已移入新建帧");
        return;
      }
      state.frames = moveActionToFrame(state.frames, actionId, targetFrameId, insertIndex);
      const action = state.actions.get(actionId);
      selectActionInFrame(state, actionId, targetFrameId, action?.type === "annotation" ? action.annotationId : null);
      refresh();
      setStatus("动作已移动到目标帧");
    },
    onChangeTimelineOrder: ({ frameIds, clearBeforeFrameIds, movedKind, movedFrameId }) => {
      const frameMap = new Map(state.frames.map((frame) => [frame.id, frame] as const));
      state.frames = frameIds.map((id) => frameMap.get(id)).filter((item): item is Frame => Boolean(item));
      state.clearBeforeFrameIds = clearBeforeFrameIds;
      if (movedKind === "frame" && movedFrameId) {
        selectFrameOnly(state, movedFrameId);
        refresh();
        setStatus("帧顺序已调整");
        return;
      }
      refresh();
      setStatus("清空动作已移动");
    }
  });
}
