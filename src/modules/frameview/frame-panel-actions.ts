import type { Frame, TimelineStep } from "../models";
import type { RenderFramePanelOptions } from "./frame-panel-types";

function createActionItem(
  action: TimelineStep,
  frame: Frame,
  options: Pick<RenderFramePanelOptions, "annotations" | "selectedActionId" | "onSelectAction" | "getActionLabel">
) {
  const { annotations, selectedActionId, onSelectAction, getActionLabel } = options;
  const li = document.createElement("li");
  li.className = "frame-action-item";
  li.dataset.actionId = action.id;
  if (selectedActionId === action.id) {
    li.classList.add("is-selected");
  }
  if (action.type === "annotation") {
    const annotation = annotations.get(action.annotationId);
    const lockMark = annotation?.locked ? " [锁]" : "";
    li.textContent = `标注:${annotation?.name ?? annotation?.kind ?? "unknown"}${lockMark}`;
  } else {
    li.textContent = `动作:${getActionLabel(action.action)}`;
  }
  li.addEventListener("click", () => {
    onSelectAction(action.id, frame.id, action.type === "annotation" ? action.annotationId : null);
  });
  return li;
}

export function createFrameActionList(
  frame: Frame,
  options: Pick<
    RenderFramePanelOptions,
    "actions" | "annotations" | "selectedActionId" | "onSelectAction" | "getActionLabel"
  >
) {
  const { actions, annotations, selectedActionId, onSelectAction, getActionLabel } = options;
  const list = document.createElement("ol");
  list.className = "frame-action-list";
  list.dataset.frameId = frame.id;

  if (frame.actionIds.length === 0) {
    const empty = document.createElement("li");
    empty.className = "frame-empty-indicator";
    empty.textContent = "空帧（不新增标注）";
    list.append(empty);
    return list;
  }

  frame.actionIds.forEach((actionId) => {
    const action = actions.get(actionId);
    if (!action) {
      return;
    }
    list.append(
      createActionItem(action, frame, {
        annotations,
        selectedActionId,
        onSelectAction,
        getActionLabel
      })
    );
  });
  return list;
}
