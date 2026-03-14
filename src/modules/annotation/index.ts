import type {
  Annotation,
  AnnotationStyle,
  AnnotationKind,
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

const annotationKindLabels: Record<AnnotationKind, string> = {
  box: "框选",
  arrow: "箭头",
  text: "文字"
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

export function createEmptyAnnotationCounters() {
  return {
    box: 0,
    arrow: 0,
    text: 0
  };
}

export function getAnnotationKindLabel(kind: AnnotationKind) {
  return annotationKindLabels[kind];
}

export function buildAnnotationDisplayName(kind: AnnotationKind, sequence: number) {
  return `${getAnnotationKindLabel(kind)}-${String(sequence).padStart(2, "0")}`;
}

export function createBoxAnnotation(data: BoxData, style: AnnotationStyle): BoxAnnotation {
  return {
    id: createId("ann"),
    kind: "box",
    name: "",
    sequence: 0,
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
    name: "",
    sequence: 0,
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
    name: "",
    sequence: 0,
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

export function assignAnnotationIdentity(annotation: Annotation, sequence: number): Annotation {
  return {
    ...annotation,
    sequence,
    name: buildAnnotationDisplayName(annotation.kind, sequence)
  };
}
