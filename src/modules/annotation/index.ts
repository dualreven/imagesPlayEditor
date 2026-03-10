import type {
  Annotation,
  AnnotationStyle,
  ArrowAnnotation,
  ArrowData,
  BoxAnnotation,
  BoxData,
  Point,
  TextAnnotation
} from "../models";

const defaultStyle: AnnotationStyle = {
  color: "#ef4444",
  strokeWidth: 0.3,
  arrowLength: 1.6,
  fontSize: 2.4
};

function createId(prefix: "ann" | "step") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createStepId() {
  return createId("step");
}

export function createDefaultStyle(): AnnotationStyle {
  return { ...defaultStyle };
}

export function createBoxAnnotation(data: BoxData, style: AnnotationStyle): BoxAnnotation {
  return {
    id: createId("ann"),
    kind: "box",
    data,
    locked: false,
    createdAt: Date.now(),
    style: { ...style }
  };
}

export function createArrowAnnotation(data: ArrowData, style: AnnotationStyle): ArrowAnnotation {
  return {
    id: createId("ann"),
    kind: "arrow",
    data,
    locked: false,
    createdAt: Date.now(),
    style: { ...style }
  };
}

export function createTextAnnotation(position: Point, content: string, style: AnnotationStyle): TextAnnotation {
  return {
    id: createId("ann"),
    kind: "text",
    data: {
      x: position.x,
      y: position.y,
      content
    },
    locked: false,
    createdAt: Date.now(),
    style: { ...style }
  };
}

export function updateAnnotationStyle(annotation: Annotation, style: AnnotationStyle): Annotation {
  return {
    ...annotation,
    style: { ...style }
  };
}
