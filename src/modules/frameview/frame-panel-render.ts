import { createFrameCard } from "./frame-panel-card";
import { createNewFrameDropzoneCard } from "./frame-panel-new-frame-dropzone";
import { createClearSeparator } from "./frame-panel-separator";
import type { RenderFramePanelOptions } from "./frame-panel-types";

export function renderFramePanel(options: RenderFramePanelOptions) {
  const { container, frames, clearBeforeFrameIds, onToggleClearBefore, scrollToFrameId } = options;
  container.innerHTML = "";
  container.append(createNewFrameDropzoneCard(0));
  frames.forEach((frame, index) => {
    if (index > 0) {
      container.append(createNewFrameDropzoneCard(index));
    }
    if (index > 0 && clearBeforeFrameIds.has(frame.id)) {
      container.append(createClearSeparator(frame.id, onToggleClearBefore));
    }
    container.append(createFrameCard(frame, index, options));
  });
  container.append(createNewFrameDropzoneCard(frames.length));
  if (scrollToFrameId) {
    const target = container.querySelector<HTMLElement>(
      `.frame-card[data-frame-id="${scrollToFrameId}"]`
    );
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}
