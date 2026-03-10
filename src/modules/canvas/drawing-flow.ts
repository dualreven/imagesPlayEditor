import Konva from "konva";
import { createArrowAnnotation, createBoxAnnotation } from "../annotation";
import type { Annotation, AnnotationStyle, DrawingTool, Point } from "../models";
import { normalizeRect } from "./geometry";
import { resolveAnnotationStyle } from "./style-scale";

export function createDrawingPreviewNode(
  tool: DrawingTool,
  start: Point,
  style: AnnotationStyle,
  styleReferenceSize: number
): Konva.Shape | null {
  const scaledStyle = resolveAnnotationStyle(style, styleReferenceSize);
  if (tool === "box") {
    return new Konva.Rect({
      x: start.x,
      y: start.y,
      width: 1,
      height: 1,
      stroke: style.color,
      strokeWidth: scaledStyle.strokeWidth,
      dash: [8, 4]
    });
  }
  if (tool === "arrow") {
    return new Konva.Arrow({
      points: [start.x, start.y, start.x + 1, start.y + 1],
      stroke: style.color,
      fill: style.color,
      strokeWidth: scaledStyle.strokeWidth,
      pointerLength: scaledStyle.arrowLength,
      pointerWidth: Math.max(scaledStyle.strokeWidth * 1.2, scaledStyle.arrowLength * 0.6),
      dash: [6, 4]
    });
  }
  return null;
}

export function updateDrawingPreviewNode(tool: DrawingTool, node: Konva.Shape, start: Point, end: Point) {
  if (tool === "box" && node instanceof Konva.Rect) {
    const rect = normalizeRect(start, end);
    node.setAttrs(rect);
    return;
  }
  if (tool === "arrow" && node instanceof Konva.Arrow) {
    node.points([start.x, start.y, end.x, end.y]);
  }
}

export function createDrawingAnnotation(
  tool: DrawingTool,
  start: Point,
  end: Point,
  style: AnnotationStyle
): Annotation | null {
  if (tool === "box") {
    const rect = normalizeRect(start, end);
    if (rect.width < 4 || rect.height < 4) {
      return null;
    }
    return createBoxAnnotation(rect, style);
  }
  if (tool === "arrow") {
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    if (distance < 6) {
      return null;
    }
    return createArrowAnnotation(
      {
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y
      },
      style
    );
  }
  return null;
}
