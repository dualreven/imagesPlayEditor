import Sortable from "sortablejs";

import { createActionListSortable, createTimelineRootSortable } from "./sortable-factories";
import type { TimelineSortableSystem, TimelineSortableSystemOptions } from "./sortable-types";

export function createTimelineSortableSystem(options: TimelineSortableSystemOptions): TimelineSortableSystem {
  const { root, onMoveAction, onChangeTimelineOrder } = options;
  let timelineSortable: Sortable | null = null;
  const actionSortables = new Map<string, { element: HTMLElement; sortable: Sortable }>();

  const destroyActionSortables = () => {
    actionSortables.forEach((entry) => entry.sortable.destroy());
    actionSortables.clear();
  };

  const setupTimelineSortable = () => {
    if (timelineSortable) return;
    timelineSortable = createTimelineRootSortable({ root, onChangeTimelineOrder });
  };

  const syncActionSortables = () => {
    const nextLists = new Map<string, HTMLElement>();
    root.querySelectorAll<HTMLElement>(".frame-action-list").forEach((list) => {
      const frameId = list.dataset.frameId;
      if (!frameId) return;
      nextLists.set(frameId, list);
    });

    for (const [frameId, entry] of actionSortables.entries()) {
      const nextElement = nextLists.get(frameId);
      if (nextElement === entry.element) continue;
      entry.sortable.destroy();
      actionSortables.delete(frameId);
    }

    for (const [frameId, element] of nextLists.entries()) {
      if (actionSortables.has(frameId)) continue;
      actionSortables.set(frameId, {
        element,
        sortable: createActionListSortable({ root, list: element, onMoveAction })
      });
    }
  };

  return {
    bind: () => {
      setupTimelineSortable();
      syncActionSortables();
    },
    destroy: () => {
      timelineSortable?.destroy();
      timelineSortable = null;
      destroyActionSortables();
      root.classList.remove("is-dragging");
    }
  };
}
