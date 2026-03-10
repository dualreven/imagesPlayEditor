import type { TimelineOrderSnapshot } from "./sortable-types";

export function readTimelineOrder(root: HTMLElement): TimelineOrderSnapshot {
  const frameIds: string[] = [];
  const clearBeforeFrameIds = new Set<string>();
  let hasFrame = false;
  let pendingClear = false;

  for (const child of [...root.children]) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.classList.contains("frame-clear-separator")) {
      pendingClear = true;
      continue;
    }
    if (!child.classList.contains("frame-card")) continue;
    const frameId = child.dataset.frameId ?? null;
    if (!frameId) continue;
    if (hasFrame && pendingClear) clearBeforeFrameIds.add(frameId);
    frameIds.push(frameId);
    hasFrame = true;
    pendingClear = false;
  }

  return { frameIds, clearBeforeFrameIds };
}

export function findActionInsertIndex(list: HTMLElement, actionId: string) {
  return [...list.querySelectorAll<HTMLElement>(".frame-action-item")].findIndex(
    (item) => item.dataset.actionId === actionId
  );
}
