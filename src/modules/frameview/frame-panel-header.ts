import { renderAntIcon } from "../ui";
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

function createHeaderActionButton(
  iconName: "pin" | "pinOff" | "edit" | "delete" | "copy",
  className: string,
  title: string,
  onClick: () => void
) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${className} toolbar-icon-button`;
  button.innerHTML = renderAntIcon(iconName);
  button.title = title;
  button.setAttribute("aria-label", title);
  button.dataset.tooltip = title;
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
    "onEditFrame" | "onDuplicateFrame" | "onDeleteFrame" | "onToggleFrameExclusive"
  >
) {
  const { onEditFrame, onDuplicateFrame, onDeleteFrame, onToggleFrameExclusive } = options;
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
    frame.exclusive ? "pin" : "pinOff",
    "frame-exclusive-btn",
    frame.exclusive ? "当前已开启独占，点击关闭" : "当前未开启独占，点击开启",
    () => onToggleFrameExclusive(frame.id)
  );
  if (frame.exclusive) {
    exclusiveButton.classList.add("is-active");
  }
  const editButton = createHeaderActionButton("edit", "frame-edit-btn", "编辑此帧描述", () =>
    onEditFrame(frame.id)
  );
  const copyButton = createHeaderActionButton("copy", "frame-copy-btn", "复制此帧到下一帧", () =>
    onDuplicateFrame(frame.id)
  );
  const deleteButton = createHeaderActionButton("delete", "frame-delete-btn", "删除此帧", () =>
    onDeleteFrame(frame.id)
  );

  titleActions.append(exclusiveButton, editButton, copyButton, deleteButton);
  title.append(titleText, titleActions);
  main.append(title, hint);
  header.append(main);
  return header;
}
