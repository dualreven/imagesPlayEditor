export type AnnotationKind = "box" | "arrow" | "text";
export type DrawingTool = AnnotationKind | "select";
export type TimelineAction = "clear_previous" | "keep_next";
export type AnnotationCounters = Record<AnnotationKind, number>;

export interface Point {
  x: number;
  y: number;
}

export interface AnnotationStyle {
  color: string;
  strokeWidth: number;
  arrowLength: number;
  fontSize: number;
}

export interface BoxData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArrowData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface TextData {
  x: number;
  y: number;
  content: string;
}

interface AnnotationBase {
  id: string;
  kind: AnnotationKind;
  name: string;
  sequence: number;
  locked: boolean;
  createdAt: number;
  style: AnnotationStyle;
}

export interface BoxAnnotation extends AnnotationBase {
  kind: "box";
  data: BoxData;
}

export interface ArrowAnnotation extends AnnotationBase {
  kind: "arrow";
  data: ArrowData;
}

export interface TextAnnotation extends AnnotationBase {
  kind: "text";
  data: TextData;
}

export type Annotation = BoxAnnotation | ArrowAnnotation | TextAnnotation;

export interface AnnotationTimelineStep {
  id: string;
  type: "annotation";
  annotationId: string;
}

export interface SystemTimelineStep {
  id: string;
  type: "system";
  action: TimelineAction;
}

export type TimelineStep = AnnotationTimelineStep | SystemTimelineStep;

export interface Frame {
  id: string;
  actionIds: string[];
  description: string;
  exclusive: boolean;
  createdAt: number;
}

export interface ExportFrame {
  frameId: string;
  description: string;
  visibleAnnotationIds: string[];
}

export interface EditorImage {
  src: string;
  width: number;
  height: number;
  fileName: string;
  sourcePath: string | null;
}
