import type { Frame } from "../models";
import { createFrameHeader } from "./frame-panel-header";
import type { RenderFramePanelOptions } from "./frame-panel-types";
import { createFrameActionList } from "./frame-panel-actions";

export function createFrameCard(
  frame: Frame,
  frameIndex: number,
  options: Pick<
    RenderFramePanelOptions,
    | "selectedFrameId"
    | "onSelectFrame"
    | "onEditFrame"
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
    onSelectFrame: options.onSelectFrame,
    onEditFrame: options.onEditFrame,
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

  card.append(header, list);
  return card;
}
