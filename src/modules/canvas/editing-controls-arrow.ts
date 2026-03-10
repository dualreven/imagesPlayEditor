import Konva from "konva";

import type { Annotation, ArrowAnnotation, Point } from "../models";
import { setArrowPoints } from "./annotation-ops";
import { resolveAnnotationStyle } from "./style-scale";

interface ArrowEditingControlsOptions {
  annotation: ArrowAnnotation;
  node: Konva.Arrow;
  annotationLayer: Konva.Layer;
  getStyleReferenceSize: () => number;
  onAnnotationSelected: (annotationId: string) => void;
  onAnnotationUpdated: (annotation: Annotation) => void;
}

export function enableArrowEditingControls(options: ArrowEditingControlsOptions) {
  const {
    annotation,
    node,
    annotationLayer,
    getStyleReferenceSize,
    onAnnotationSelected,
    onAnnotationUpdated
  } = options;

  node.draggable(true);
  const style = resolveAnnotationStyle(annotation.style, getStyleReferenceSize());
  const radius = Math.max(6, style.strokeWidth * 1.4);
  const createHandle = (point: Point) =>
    new Konva.Circle({
      x: point.x,
      y: point.y,
      radius,
      stroke: "#0ea5e9",
      strokeWidth: Math.max(1.5, style.strokeWidth * 0.6),
      fill: "#ffffff",
      draggable: true
    });

  const startHandle = createHandle({ x: annotation.data.startX, y: annotation.data.startY });
  const endHandle = createHandle({ x: annotation.data.endX, y: annotation.data.endY });

  const getAbsolutePoints = () => {
    const [startX, startY, endX, endY] = node.points();
    return {
      start: { x: startX + node.x(), y: startY + node.y() },
      end: { x: endX + node.x(), y: endY + node.y() }
    };
  };

  const syncArrowByHandles = () => {
    const start = startHandle.position();
    const end = endHandle.position();
    node.position({ x: 0, y: 0 });
    node.points([start.x, start.y, end.x, end.y]);
  };

  const commitArrow = () => {
    const start = startHandle.position();
    const end = endHandle.position();
    onAnnotationUpdated(setArrowPoints(annotation, start, end));
  };

  node.on("dragmove", () => {
    const points = getAbsolutePoints();
    startHandle.position(points.start);
    endHandle.position(points.end);
    annotationLayer.batchDraw();
  });

  node.on("dragend", () => {
    const points = getAbsolutePoints();
    node.position({ x: 0, y: 0 });
    node.points([points.start.x, points.start.y, points.end.x, points.end.y]);
    startHandle.position(points.start);
    endHandle.position(points.end);
    commitArrow();
  });

  [startHandle, endHandle].forEach((handle) => {
    handle.on("click tap", (event) => {
      event.cancelBubble = true;
      onAnnotationSelected(annotation.id);
    });
    handle.on("dragmove", () => {
      syncArrowByHandles();
      annotationLayer.batchDraw();
    });
    handle.on("dragend", commitArrow);
  });

  annotationLayer.add(startHandle, endHandle);
}
