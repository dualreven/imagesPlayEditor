import Konva from "konva";

import type { DrawingTool, Point } from "../models";

interface BindCanvasPointerEventsOptions {
  stage: Konva.Stage;
  getTool: () => DrawingTool;
  getBackgroundImageNode: () => Konva.Image | null;
  hasImage: () => boolean;
  getScenePointerPosition: () => Point | null;
  onRequireImage: () => void;
  onSelectNone: () => void;
  onStartDrawing: (point: Point) => void;
  onMoveDrawing: (point: Point) => void;
  onCommitDrawing: (point: Point) => void;
  onClearDrawing: () => void;
  onStartCreateTextInput: (point: Point) => void;
}

export function bindCanvasPointerEvents(options: BindCanvasPointerEventsOptions) {
  const {
    stage,
    getTool,
    getBackgroundImageNode,
    hasImage,
    getScenePointerPosition,
    onRequireImage,
    onSelectNone,
    onStartDrawing,
    onMoveDrawing,
    onCommitDrawing,
    onClearDrawing,
    onStartCreateTextInput
  } = options;

  stage.on("mousedown", () => {
    const tool = getTool();
    if (tool === "select" || tool === "text") {
      return;
    }
    if (!hasImage()) {
      onRequireImage();
      return;
    }
    const pointer = getScenePointerPosition();
    if (!pointer) {
      return;
    }
    onStartDrawing(pointer);
  });

  stage.on("mousemove", () => {
    const pointer = getScenePointerPosition();
    if (!pointer) {
      return;
    }
    onMoveDrawing(pointer);
  });

  stage.on("mouseup", () => {
    const pointer = getScenePointerPosition();
    if (!pointer) {
      onClearDrawing();
      return;
    }
    onCommitDrawing(pointer);
    onClearDrawing();
  });

  stage.on("click", (event) => {
    const target = event.target;
    const backgroundImageNode = getBackgroundImageNode();
    if (target && target !== stage && target !== backgroundImageNode) {
      return;
    }

    const tool = getTool();
    if (tool === "select") {
      onSelectNone();
      return;
    }
    if (tool !== "text") {
      return;
    }
    if (!hasImage()) {
      onRequireImage();
      return;
    }
    const pointer = getScenePointerPosition();
    if (!pointer) {
      return;
    }
    onStartCreateTextInput(pointer);
  });
}
