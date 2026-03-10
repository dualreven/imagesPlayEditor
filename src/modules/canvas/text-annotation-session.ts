import { createTextAnnotation } from "../annotation";
import type { Annotation, AnnotationStyle, Point } from "../models";
import { setTextContent } from "./annotation-ops";
import { TextInputOverlayController } from "./text-input-overlay";

interface StartCreateTextInputOptions {
  textInputOverlay: TextInputOverlayController;
  point: Point;
  style: AnnotationStyle;
  onAnnotationCreated: (annotation: Annotation) => void;
}

export function startCreateTextInput(options: StartCreateTextInputOptions) {
  const { textInputOverlay, point, style, onAnnotationCreated } = options;
  textInputOverlay.open(point, "", style, (content) => {
    onAnnotationCreated(createTextAnnotation(point, content, style));
  });
}

interface StartEditTextInputOptions {
  textInputOverlay: TextInputOverlayController;
  annotationId: string;
  annotations: Map<string, Annotation>;
  onAnnotationUpdated: (annotation: Annotation) => void;
}

export function startEditTextInput(options: StartEditTextInputOptions) {
  const { textInputOverlay, annotationId, annotations, onAnnotationUpdated } = options;
  const annotation = annotations.get(annotationId);
  if (!annotation || annotation.kind !== "text") {
    return;
  }
  const point = { x: annotation.data.x, y: annotation.data.y };
  textInputOverlay.open(point, annotation.data.content, annotation.style, (content) => {
    onAnnotationUpdated(setTextContent(annotation, content));
  });
}
