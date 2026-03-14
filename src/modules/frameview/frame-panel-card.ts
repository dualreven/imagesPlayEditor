import type { Frame } from "../models";
import { createFrameHeader } from "./frame-panel-header";
import type { RenderFramePanelOptions } from "./frame-panel-types";
import { createFrameActionList } from "./frame-panel-actions";

function shouldKeepCurrentSelection(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest(".frame-action-item, .toolbar-icon-button, .frame-action-drop-placeholder"));
}

export function createFrameCard(
  frame: Frame,
  frameIndex: number,
  options: Pick<
    RenderFramePanelOptions,
    | "selectedFrameId"
    | "onSelectFrame"
    | "onEditFrame"
    | "onDuplicateFrame"
    | "onDeleteFrame"
    | "onToggleFrameExclusive"
    | "actions"
    | "annotations"
    | "selectedActionId"
    | "onSelectAction"
    | "getActionLabel"
  >
) {
  const card = document.createElement("section");
  card.className = "frame-card";
  card.dataset.frameId = frame.id;
  if (frame.id === options.selectedFrameId) {
    card.classList.add("is-selected");
  }

  const header = createFrameHeader(frame, frameIndex, {
    onEditFrame: options.onEditFrame,
    onDuplicateFrame: options.onDuplicateFrame,
    onDeleteFrame: options.onDeleteFrame,
    onToggleFrameExclusive: options.onToggleFrameExclusive
  });

  const list = createFrameActionList(frame, {
    actions: options.actions,
    annotations: options.annotations,
    selectedActionId: options.selectedActionId,
    onSelectAction: options.onSelectAction,
    getActionLabel: options.getActionLabel
  });

  card.addEventListener("click", (event) => {
    if (shouldKeepCurrentSelection(event.target)) {
      return;
    }
    options.onSelectFrame(frame.id);
  });

  card.append(header, list);
  return card;
}
