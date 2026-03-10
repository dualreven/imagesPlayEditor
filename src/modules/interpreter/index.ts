import type { Annotation, ExportFrame, Frame, TimelineStep } from "../models";

function keepLockedOnly(visible: string[], annotations: Map<string, Annotation>) {
  return visible.filter((annotationId) => annotations.get(annotationId)?.locked);
}

function mergeWithLocked(visible: string[], incomingId: string, annotations: Map<string, Annotation>) {
  const preserved = keepLockedOnly(visible, annotations);
  return preserved.includes(incomingId) ? preserved : [...preserved, incomingId];
}

export function buildExportFrames(
  frames: Frame[],
  actions: Map<string, TimelineStep>,
  annotations: Map<string, Annotation>,
  clearBeforeFrameIds: ReadonlySet<string>
): ExportFrame[] {
  const results: ExportFrame[] = [];
  let visible: string[] = [];
  let keepNext = false;

  for (const frame of frames) {
    if (frame.exclusive || clearBeforeFrameIds.has(frame.id)) {
      visible = keepLockedOnly(visible, annotations);
      keepNext = false;
    }

    for (const actionId of frame.actionIds) {
      const action = actions.get(actionId);
      if (!action) {
        continue;
      }

      if (action.type === "annotation") {
        if (!annotations.has(action.annotationId)) {
          continue;
        }
        if (keepNext) {
          visible = mergeWithLocked(visible, action.annotationId, annotations);
          keepNext = false;
        } else if (!visible.includes(action.annotationId)) {
          visible = [...visible, action.annotationId];
        }
        continue;
      }

      if (action.action === "clear_previous") {
        visible = keepLockedOnly(visible, annotations);
        keepNext = false;
      } else if (action.action === "keep_next") {
        keepNext = true;
      }
    }

    results.push({
      frameId: frame.id,
      description: frame.description,
      visibleAnnotationIds: [...visible]
    });
  }

  return results;
}
