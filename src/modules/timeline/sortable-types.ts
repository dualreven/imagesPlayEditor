export interface TimelineOrderSnapshot {
  frameIds: string[];
  clearBeforeFrameIds: Set<string>;
}

export type MovedKind = "frame" | "clear";

export interface TimelineOrderChange extends TimelineOrderSnapshot {
  movedKind: MovedKind;
  movedFrameId: string | null;
}

export interface TimelineSortableSystemOptions {
  root: HTMLElement;
  onMoveAction: (actionId: string, targetFrameId: string, insertIndex: number) => void;
  onChangeTimelineOrder: (change: TimelineOrderChange) => void;
}

export interface TimelineSortableSystem {
  bind: () => void;
  destroy: () => void;
}
