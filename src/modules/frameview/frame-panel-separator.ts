export function createClearSeparator(frameId: string, onToggleClearBefore: (frameId: string) => void) {
  const separator = document.createElement("div");
  separator.className = "frame-clear-separator";
  separator.dataset.frameId = frameId;

  const text = document.createElement("span");
  text.textContent = "清空上一帧内容";
  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "frame-clear-toggle-btn";
  toggleButton.textContent = "取消清空";
  toggleButton.addEventListener("click", () => onToggleClearBefore(frameId));
  separator.append(text, toggleButton);
  return separator;
}
