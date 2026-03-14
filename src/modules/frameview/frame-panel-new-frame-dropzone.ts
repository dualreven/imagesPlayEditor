import { createNewFrameDropzoneId } from "../timeline";

export function createNewFrameDropzoneCard(insertIndex: number) {
  const card = document.createElement("section");
  card.className = "frame-new-dropzone";
  card.dataset.insertIndex = String(insertIndex);

  const list = document.createElement("ol");
  list.className = "frame-action-list frame-new-dropzone-action-list";
  list.dataset.frameId = createNewFrameDropzoneId(insertIndex);

  const hint = document.createElement("li");
  hint.className = "frame-new-dropzone-hint";
  hint.textContent = "拖到空白处新建帧";
  list.append(hint);

  card.append(list);
  return card;
}
