import Konva from "konva";

import type { Annotation, TextAnnotation } from "../models";
import { moveAnnotation } from "./annotation-ops";

interface TextEditingControlsOptions {
  annotation: TextAnnotation;
  node: Konva.Text;
  onAnnotationUpdated: (annotation: Annotation) => void;
}

export function enableTextEditingControls(options: TextEditingControlsOptions) {
  const { annotation, node, onAnnotationUpdated } = options;
  node.draggable(true);
  node.on("dragend", () => {
    const dx = node.x() - annotation.data.x;
    const dy = node.y() - annotation.data.y;
    if (dx !== 0 || dy !== 0) {
      onAnnotationUpdated(moveAnnotation(annotation, dx, dy));
    }
  });
}
