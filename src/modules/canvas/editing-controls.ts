import Konva from "konva";

import type { Annotation } from "../models";
import { enableArrowEditingControls } from "./editing-controls-arrow";
import { enableBoxEditingControls } from "./editing-controls-box";
import { enableTextEditingControls } from "./editing-controls-text";

interface EditingControlsOptions {
  annotation: Annotation;
  node: Konva.Shape;
  annotationLayer: Konva.Layer;
  getStyleReferenceSize: () => number;
  onAnnotationSelected: (annotationId: string) => void;
  onAnnotationUpdated: (annotation: Annotation) => void;
}

export function enableEditingControls(options: EditingControlsOptions) {
  const {
    annotation,
    node,
    annotationLayer,
    getStyleReferenceSize,
    onAnnotationSelected,
    onAnnotationUpdated
  } = options;

  if (annotation.kind === "box" && node instanceof Konva.Rect) {
    enableBoxEditingControls({
      annotation,
      node,
      annotationLayer,
      onAnnotationUpdated
    });
    return;
  }

  if (annotation.kind === "arrow" && node instanceof Konva.Arrow) {
    enableArrowEditingControls({
      annotation,
      node,
      annotationLayer,
      getStyleReferenceSize,
      onAnnotationSelected,
      onAnnotationUpdated
    });
    return;
  }

  if (annotation.kind === "text" && node instanceof Konva.Text) {
    enableTextEditingControls({ annotation, node, onAnnotationUpdated });
  }
}
