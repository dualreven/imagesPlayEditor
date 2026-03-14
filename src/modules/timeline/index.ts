import { createStepId } from "../annotation";
import type { Frame, TimelineAction, TimelineStep } from "../models";
export * from "./new-frame-dropzone";
export * from "./sortable-system";
export * from "./sortable-types";

function createFrameId() { return `frame_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function clampIndex(index: number, max: number) { return Math.min(Math.max(0, index), max); }

export function createAnnotationStep(annotationId: string): TimelineStep {
  return { id: createStepId(), type: "annotation", annotationId };
}

export function createSystemStep(action: TimelineAction): TimelineStep {
  return { id: createStepId(), type: "system", action };
}

export function createFrame(actionIds: string[] = [], description = ""): Frame {
  return { id: createFrameId(), actionIds: [...actionIds], description, exclusive: false, createdAt: Date.now() };
}

export function appendActionAsNewFrame(frames: Frame[], actionId: string): Frame[] {
  return [...frames, createFrame([actionId])];
}

export function updateFrameDescription(frames: Frame[], frameId: string, description: string): Frame[] {
  return frames.map((frame) => (frame.id === frameId ? { ...frame, description } : frame));
}

export function findFrameIdByActionId(frames: Frame[], actionId: string): string | null {
  for (const frame of frames) {
    if (frame.actionIds.includes(actionId)) return frame.id;
  }
  return null;
}

export function removeActionFromFrames(frames: Frame[], actionId: string): Frame[] {
  return frames.map((frame) => ({ ...frame, actionIds: frame.actionIds.filter((id) => id !== actionId) }));
}

export function moveActionToFrame(frames: Frame[], actionId: string, targetFrameId: string, insertIndex: number): Frame[] {
  const sourceFrameIndex = frames.findIndex((frame) => frame.actionIds.includes(actionId));
  const targetFrameIndex = frames.findIndex((frame) => frame.id === targetFrameId);
  if (sourceFrameIndex < 0 || targetFrameIndex < 0) return [...frames];
  const nextFrames = frames.map((frame) => ({ ...frame, actionIds: [...frame.actionIds] }));
  const source = nextFrames[sourceFrameIndex];
  source.actionIds = source.actionIds.filter((id) => id !== actionId);
  const target = nextFrames[targetFrameIndex];
  const safeIndex = clampIndex(insertIndex, target.actionIds.length);
  target.actionIds.splice(safeIndex, 0, actionId);
  return nextFrames;
}

export function moveActionToNewFrame(
  frames: Frame[],
  actionId: string,
  insertIndex = frames.length
): { frames: Frame[]; newFrameId: string } {
  const nextFrames = removeActionFromFrames(frames, actionId);
  const newFrame = createFrame([actionId]);
  const safeIndex = clampIndex(insertIndex, nextFrames.length);
  nextFrames.splice(safeIndex, 0, newFrame);
  return {
    frames: nextFrames,
    newFrameId: newFrame.id
  };
}

export function removeFrameAndCollectActionIds(frames: Frame[], frameId: string) {
  const frame = frames.find((item) => item.id === frameId);
  return { frames: frames.filter((item) => item.id !== frameId), removedActionIds: frame ? [...frame.actionIds] : [] };
}

export function moveFrameToIndex(frames: Frame[], frameId: string, targetIndex: number): Frame[] {
  const sourceIndex = frames.findIndex((frame) => frame.id === frameId);
  if (sourceIndex < 0) return [...frames];
  const source = frames[sourceIndex];
  const remaining = frames.filter((frame) => frame.id !== frameId);
  const safeIndex = clampIndex(targetIndex, remaining.length);
  remaining.splice(safeIndex, 0, source);
  return remaining;
}
