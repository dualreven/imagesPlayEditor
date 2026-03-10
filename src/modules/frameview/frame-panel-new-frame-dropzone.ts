import { NEW_FRAME_DROPZONE_ID } from "../timeline";

export function createNewFrameDropzoneCard() {
  const card = document.createElement("section");
  card.className = "frame-new-dropzone";

  const title = document.createElement("p");
  title.className = "frame-new-dropzone-title";
  title.textContent = "拖到此处可新建帧";

  const list = document.createElement("ol");
  list.className = "frame-action-list frame-new-dropzone-action-list";
  list.dataset.frameId = NEW_FRAME_DROPZONE_ID;

  const hint = document.createElement("li");
  hint.className = "frame-new-dropzone-hint";
  hint.textContent = "释放后自动创建新帧并放入该动作";
  list.append(hint);

  card.append(title, list);
  return card;
}
