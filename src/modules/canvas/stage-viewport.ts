import Konva from "konva";

import type { EditorImage, Point } from "../models";

export function getImageSize(imageMeta: EditorImage | null, stage: Konva.Stage) {
  if (imageMeta) {
    return {
      width: imageMeta.width,
      height: imageMeta.height
    };
  }
  return {
    width: stage.width(),
    height: stage.height()
  };
}

export function getStyleReferenceSize(imageMeta: EditorImage | null, stage: Konva.Stage) {
  if (imageMeta) return Math.max(1, Math.min(imageMeta.width, imageMeta.height));
  return Math.max(1, Math.min(stage.width(), stage.height()));
}

export function getScenePointerPosition(stage: Konva.Stage, displayScale: number): Point | null {
  const pointer = stage.getPointerPosition();
  if (!pointer) {
    return null;
  }
  return {
    x: pointer.x / displayScale,
    y: pointer.y / displayScale
  };
}

export function applyDisplayScale(stage: Konva.Stage, imageMeta: EditorImage, scale: number) {
  stage.scale({ x: scale, y: scale });
  stage.width(imageMeta.width * scale);
  stage.height(imageMeta.height * scale);
  stage.batchDraw();
}

export function computeAutoFitScale(container: HTMLDivElement, imageMeta: EditorImage) {
  const { width: containerWidth, height: containerHeight } = getViewportContentSize(container);
  const fitScale = Math.min(containerWidth / imageMeta.width, containerHeight / imageMeta.height);
  return Number.isFinite(fitScale) && fitScale > 0 ? fitScale : 1;
}

export function getViewportContentSize(container: HTMLDivElement) {
  const viewport = container.parentElement instanceof HTMLElement ? container.parentElement : container;
  const containerWidth = Math.max(240, viewport.clientWidth - 24);
  const containerHeight = Math.max(240, viewport.clientHeight - 24);
  return { width: containerWidth, height: containerHeight };
}

export function applyViewportStageSize(stage: Konva.Stage, container: HTMLDivElement) {
  const { width, height } = getViewportContentSize(container);
  stage.scale({ x: 1, y: 1 });
  stage.width(width);
  stage.height(height);
  stage.batchDraw();
}

export function toDataUrlAtOriginalScale(
  stage: Konva.Stage,
  imageMeta: EditorImage | null,
  displayScale: number,
  setScale: (scale: number) => void
) {
  if (!imageMeta || displayScale === 1) {
    return stage.toDataURL({ pixelRatio: 1 });
  }
  const savedScale = displayScale;
  setScale(1);
  const dataUrl = stage.toDataURL({ pixelRatio: 1 });
  setScale(savedScale);
  return dataUrl;
}
