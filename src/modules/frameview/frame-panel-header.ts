import type { Frame } from "../models";
import type { RenderFramePanelOptions } from "./frame-panel-types";

function formatDescriptionHint(description: string, maxLength = 15) {
  const text = description.trim();
  if (!text) {
    return "无描述";
  }
  const chars = Array.from(text);
  if (chars.length <= maxLength) {
    return text;
  }
  return `${chars.slice(0, maxLength).join("")}...`;
}

function createHeaderActionButton(label: string, className: string, title: string, onClick: () => void) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.title = title;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

export function createFrameHeader(
  frame: Frame,
  frameIndex: number,
  options: Pick<
    RenderFramePanelOptions,
    "onSelectFrame" | "onEditFrame" | "onDeleteFrame" | "onToggleFrameExclusive"
  >
) {
  const { onSelectFrame, onEditFrame, onDeleteFrame, onToggleFrameExclusive } = options;
  const header = document.createElement("header");
  header.className = "frame-header";
  header.title = frame.description.trim() ? frame.description : "无描述";

  const main = document.createElement("div");
  main.className = "frame-header-main";
  const title = document.createElement("span");
  title.className = "frame-title";
  const titleText = document.createElement("span");
  titleText.className = "frame-title-text";
  titleText.textContent = `帧${frameIndex + 1} [动作${frame.actionIds.length}]`;

  const titleActions = document.createElement("span");
  titleActions.className = "frame-title-actions";
  const hint = document.createElement("span");
  hint.className = "frame-desc-hint";
  hint.textContent = formatDescriptionHint(frame.description, 15);

  const exclusiveButton = createHeaderActionButton(
    frame.exclusive ? "独占开" : "独占关",
    "frame-exclusive-btn",
    "切换此帧独占",
    () => onToggleFrameExclusive(frame.id)
  );
  if (frame.exclusive) {
    exclusiveButton.classList.add("is-active");
  }
  const editButton = createHeaderActionButton("编辑", "frame-edit-btn", "编辑此帧描述", () =>
    onEditFrame(frame.id)
  );
  const deleteButton = createHeaderActionButton("删除", "frame-delete-btn", "删除此帧", () =>
    onDeleteFrame(frame.id)
  );

  titleActions.append(exclusiveButton, editButton, deleteButton);
  title.append(titleText, titleActions);
  main.append(title, hint);
  header.append(main);
  header.addEventListener("click", () => onSelectFrame(frame.id));
  return header;
}
