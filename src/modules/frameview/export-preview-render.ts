import type { ExportFrame } from "../models";
import { buildStepFileStem } from "../settings";

export function renderExportFramePreview(list: HTMLOListElement, frames: ExportFrame[], filePattern: string) {
  list.innerHTML = "";
  frames.forEach((frame, index) => {
    const li = document.createElement("li");
    li.className = "frame-item";
    const fileStem = buildStepFileStem(filePattern, index + 1);
    const desc = frame.description.trim() ? frame.description.trim() : "(无描述)";
    li.textContent = `${String(index + 1).padStart(3, "0")} | ${fileStem}.png | visible=${frame.visibleAnnotationIds.length} | ${desc}`;
    list.append(li);
  });
}
