import Sortable, { type MoveEvent, type SortableEvent } from "sortablejs";

import { findActionInsertIndex, readTimelineOrder } from "./sortable-order";
import { isNewFrameDropzoneId, readNewFrameDropzoneInsertIndex } from "./new-frame-dropzone";
import type { MovedKind, TimelineOrderChange } from "./sortable-types";

function setVisibleNewFrameDropzones(root: HTMLElement, insertIndexes: number[]) {
  const visibleInsertIndexes = new Set(insertIndexes);
  root.querySelectorAll<HTMLElement>(".frame-new-dropzone").forEach((element) => {
    const insertIndex = Number(element.dataset.insertIndex);
    element.classList.toggle("is-visible", visibleInsertIndexes.has(insertIndex));
  });
}

function clearVisibleNewFrameDropzones(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".frame-new-dropzone.is-visible").forEach((element) => {
    element.classList.remove("is-visible");
  });
}

function resolveFrameInsertIndexes(root: HTMLElement, frameId: string | null) {
  if (!frameId) {
    return [];
  }
  if (isNewFrameDropzoneId(frameId)) {
    const insertIndex = readNewFrameDropzoneInsertIndex(frameId);
    return insertIndex === null ? [] : [insertIndex];
  }
  const frameCards = [...root.querySelectorAll<HTMLElement>(".frame-card")];
  const frameIndex = frameCards.findIndex((card) => card.dataset.frameId === frameId);
  if (frameIndex < 0) {
    return [];
  }
  return [frameIndex, frameIndex + 1];
}

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
    emptyInsertThreshold: 20,
    forceFallback: true,
    fallbackOnBody: true,
    fallbackClass: "frame-action-drag-ghost",
    ghostClass: "frame-action-drop-placeholder",
    chosenClass: "is-drag-source",
    onStart: (event: SortableEvent) => {
      root.classList.add("is-dragging", "is-action-dragging");
      const sourceFrameId = (event.from as HTMLElement | null)?.dataset.frameId ?? null;
      setVisibleNewFrameDropzones(root, resolveFrameInsertIndexes(root, sourceFrameId));
    },
    onMove: (event: MoveEvent) => {
      const targetFrameId = (event.to as HTMLElement | null)?.dataset.frameId ?? null;
      setVisibleNewFrameDropzones(root, resolveFrameInsertIndexes(root, targetFrameId));
      return true;
    },
    onEnd: (event: SortableEvent) => {
      root.classList.remove("is-dragging", "is-action-dragging");
      clearVisibleNewFrameDropzones(root);
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
