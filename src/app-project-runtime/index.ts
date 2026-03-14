import { buildProjectSnapshot, parseProjectSnapshot, type CanvasController } from "@modules";

import type { AppState } from "../app-state";

interface CreateProjectRuntimeOptions {
  state: AppState;
  controller: CanvasController;
}

function readSnapshot(snapshotText: string) {
  return parseProjectSnapshot(snapshotText);
}

function buildProjectFileName(imageFileName: string | null) {
  const stem = (imageFileName ?? "images-play-project").replace(/\.[^.]+$/, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
  return `${stem}-${stamp}.json`;
}

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function sanitizeFileInputPath(rawPath: string | null, fileName: string) {
  const normalized = (rawPath ?? "").trim();
  if (!normalized || /fakepath/i.test(normalized)) {
    return fileName;
  }
  return normalized;
}

export function createProjectRuntime(options: CreateProjectRuntimeOptions) {
  const { state, controller } = options;

  return {
    importProject: async (file: File) => {
      const snapshot = readSnapshot(await file.text());
      if (snapshot.image) {
        state.image = await controller.loadImageSource(snapshot.image);
      } else {
        controller.clearImage();
        state.image = null;
      }
      state.tool = snapshot.tool;
      state.style = { ...snapshot.style };
      state.exportSettings = { ...snapshot.exportSettings };
      state.annotationCounters = { ...snapshot.annotationCounters };
      state.annotations = new Map(snapshot.annotations.map((annotation) => [annotation.id, annotation] as const));
      state.actions = new Map(snapshot.actions.map((action) => [action.id, action] as const));
      state.frames = snapshot.frames.map((frame) => ({ ...frame, actionIds: [...frame.actionIds] }));
      state.clearBeforeFrameIds = new Set(snapshot.clearBeforeFrameIds);
      state.selectedFrameId = snapshot.selectedFrameId;
      state.selectedActionId = snapshot.selectedActionId;
      state.selectedAnnotationId = snapshot.selectedAnnotationId;
      state.focusedFrameId = snapshot.focusedFrameId;
    },
    exportProject: async () => {
      const snapshot = buildProjectSnapshot({
        image: state.image,
        style: state.style,
        exportSettings: state.exportSettings,
        annotations: state.annotations,
        actions: state.actions,
        frames: state.frames,
        clearBeforeFrameIds: state.clearBeforeFrameIds,
        annotationCounters: state.annotationCounters,
        selectedFrameId: state.selectedFrameId,
        selectedActionId: state.selectedActionId,
        selectedAnnotationId: state.selectedAnnotationId,
        focusedFrameId: state.focusedFrameId,
        tool: state.tool
      });
      downloadTextFile(buildProjectFileName(state.image?.fileName ?? null), JSON.stringify(snapshot, null, 2));
    }
  };
}
