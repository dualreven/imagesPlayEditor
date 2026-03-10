import Sortable, { type SortableEvent } from "sortablejs";

import { findActionInsertIndex, readTimelineOrder } from "./sortable-order";
import type { MovedKind, TimelineOrderChange } from "./sortable-types";

interface CreateTimelineRootSortableOptions {
  root: HTMLElement;
  onChangeTimelineOrder: (change: TimelineOrderChange) => void;
}

export function createTimelineRootSortable(options: CreateTimelineRootSortableOptions) {
  const { root, onChangeTimelineOrder } = options;
  return Sortable.create(root, {
    animation: 140,
    draggable: ".frame-card, .frame-clear-separator",
    handle: ".frame-header, .frame-clear-separator",
    filter: "button, .frame-action-list, .frame-action-list *, .frame-action-item, .frame-action-drop-placeholder",
    preventOnFilter: false,
    forceFallback: true,
    fallbackOnBody: true,
    fallbackClass: "frame-action-drag-ghost",
    ghostClass: "frame-action-drop-placeholder",
    chosenClass: "is-drag-source",
    onStart: () => root.classList.add("is-dragging"),
    onEnd: (event: SortableEvent) => {
      root.classList.remove("is-dragging");
      const item = event.item as HTMLElement;
      const movedKind: MovedKind = item.classList.contains("frame-clear-separator") ? "clear" : "frame";
      const movedFrameId = item.dataset.frameId ?? null;
      const snapshot = readTimelineOrder(root);
      onChangeTimelineOrder({ ...snapshot, movedKind, movedFrameId });
    }
  });
}

interface CreateActionListSortableOptions {
  root: HTMLElement;
  list: HTMLElement;
  onMoveAction: (actionId: string, targetFrameId: string, insertIndex: number) => void;
}

export function createActionListSortable(options: CreateActionListSortableOptions) {
  const { root, list, onMoveAction } = options;
  return Sortable.create(list, {
    group: "frame-actions",
    animation: 140,
    draggable: ".frame-action-item",
    forceFallback: true,
    fallbackOnBody: true,
    fallbackClass: "frame-action-drag-ghost",
    ghostClass: "frame-action-drop-placeholder",
    chosenClass: "is-drag-source",
    onStart: () => root.classList.add("is-dragging"),
    onEnd: (event: SortableEvent) => {
      root.classList.remove("is-dragging");
      const item = event.item as HTMLElement;
      const to = event.to as HTMLElement;
      const actionId = item.dataset.actionId ?? null;
      const targetFrameId = to.dataset.frameId ?? null;
      if (!actionId || !targetFrameId) return;
      const insertIndex = findActionInsertIndex(to, actionId);
      if (insertIndex < 0) return;
      onMoveAction(actionId, targetFrameId, insertIndex);
    }
  });
}
