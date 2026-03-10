import type { Annotation, ArrowAnnotation, BoxAnnotation, Point, TextAnnotation } from "../models";

export function moveAnnotation(annotation: Annotation, dx: number, dy: number): Annotation {
  if (annotation.kind === "box") {
    return { ...annotation, data: { ...annotation.data, x: annotation.data.x + dx, y: annotation.data.y + dy } };
  }
  if (annotation.kind === "arrow") {
    return {
      ...annotation,
      data: {
        ...annotation.data,
        startX: annotation.data.startX + dx,
        startY: annotation.data.startY + dy,
        endX: annotation.data.endX + dx,
        endY: annotation.data.endY + dy
      }
    };
  }
  return { ...annotation, data: { ...annotation.data, x: annotation.data.x + dx, y: annotation.data.y + dy } };
}

export function setBoxRect(annotation: BoxAnnotation, rect: { x: number; y: number; width: number; height: number }): BoxAnnotation {
  return { ...annotation, data: { ...rect } };
}

export function setArrowPoints(annotation: ArrowAnnotation, start: Point, end: Point): ArrowAnnotation {
  return { ...annotation, data: { startX: start.x, startY: start.y, endX: end.x, endY: end.y } };
}

export function setTextContent(annotation: TextAnnotation, content: string): TextAnnotation {
  return { ...annotation, data: { ...annotation.data, content } };
}
