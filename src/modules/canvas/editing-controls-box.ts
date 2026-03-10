import Konva from "konva";

import type { Annotation, BoxAnnotation } from "../models";
import { setBoxRect } from "./annotation-ops";

interface BoxEditingControlsOptions {
  annotation: BoxAnnotation;
  node: Konva.Rect;
  annotationLayer: Konva.Layer;
  onAnnotationUpdated: (annotation: Annotation) => void;
}

export function enableBoxEditingControls(options: BoxEditingControlsOptions) {
  const { annotation, node, annotationLayer, onAnnotationUpdated } = options;
  node.draggable(true);
  node.on("dragend", () => {
    onAnnotationUpdated(
      setBoxRect(annotation, {
        x: node.x(),
        y: node.y(),
        width: Math.max(4, node.width()),
        height: Math.max(4, node.height())
      })
    );
  });
  node.on("transformend", () => {
    const width = Math.max(4, node.width() * node.scaleX());
    const height = Math.max(4, node.height() * node.scaleY());
    node.scale({ x: 1, y: 1 });
    node.size({ width, height });
    onAnnotationUpdated(
      setBoxRect(annotation, {
        x: node.x(),
        y: node.y(),
        width,
        height
      })
    );
  });
  annotationLayer.add(
    new Konva.Transformer({
      nodes: [node],
      rotateEnabled: false,
      flipEnabled: false,
      enabledAnchors: [
        "top-left",
        "top-center",
        "top-right",
        "middle-left",
        "middle-right",
        "bottom-left",
        "bottom-center",
        "bottom-right"
      ]
    })
  );
}
