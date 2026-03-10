import Konva from "konva";
import type { Annotation } from "../models";
import { enableEditingControls } from "./editing-controls";
import { resolveAnnotationStyle } from "./style-scale";

export interface LastTextClick {
  annotationId: string;
  timestamp: number;
}

interface RenderAnnotationLayerOptions {
  annotationLayer: Konva.Layer;
  annotations: Map<string, Annotation>;
  selectedAnnotationId: string | null;
  visibleAnnotationIds: Set<string> | null;
  selectable: boolean;
  editable: boolean;
  isAnnotationSelected: (annotationId: string) => boolean;
  getStyleReferenceSize: () => number;
  getLastTextClick: () => LastTextClick | null;
  setLastTextClick: (value: LastTextClick | null) => void;
  onAnnotationSelected: (annotationId: string) => void;
  onAnnotationUpdated: (annotation: Annotation) => void;
  onStartEditTextInput: (annotationId: string) => void;
}

function createAnnotationNode(
  annotation: Annotation,
  selected: boolean,
  styleReferenceSize: number
): Konva.Shape {
  const stroke = annotation.style.color;
  const selectedStroke = "#0ea5e9";
  const style = resolveAnnotationStyle(annotation.style, styleReferenceSize);
  const strokeWidth = selected ? style.strokeWidth + Math.max(1, style.strokeWidth * 0.25) : style.strokeWidth;
  if (annotation.kind === "box") {
    return new Konva.Rect({
      ...annotation.data,
      stroke: selected ? selectedStroke : stroke,
      strokeWidth
    });
  }
  if (annotation.kind === "arrow") {
    return new Konva.Arrow({
      points: [annotation.data.startX, annotation.data.startY, annotation.data.endX, annotation.data.endY],
      stroke: selected ? selectedStroke : stroke,
      fill: selected ? selectedStroke : stroke,
      strokeWidth,
      pointerLength: style.arrowLength,
      pointerWidth: Math.max(style.strokeWidth * 1.2, style.arrowLength * 0.6)
    });
  }
  return new Konva.Text({
    x: annotation.data.x,
    y: annotation.data.y,
    text: annotation.data.content,
    fill: selected ? selectedStroke : stroke,
    fontSize: style.fontSize,
    fontFamily: "Microsoft YaHei"
  });
}

export function renderAnnotationLayer(options: RenderAnnotationLayerOptions) {
  const {
    annotationLayer,
    annotations,
    selectedAnnotationId,
    visibleAnnotationIds,
    selectable,
    editable,
    isAnnotationSelected,
    getStyleReferenceSize,
    getLastTextClick,
    setLastTextClick,
    onAnnotationSelected,
    onAnnotationUpdated,
    onStartEditTextInput
  } = options;
  annotationLayer.destroyChildren();
  const list = [...annotations.values()].sort((a, b) => a.createdAt - b.createdAt);
  for (const annotation of list) {
    const node = createAnnotationNode(annotation, isAnnotationSelected(annotation.id), getStyleReferenceSize());
    if (visibleAnnotationIds && !visibleAnnotationIds.has(annotation.id)) {
      node.visible(false);
    }
    node.on("click tap", (event) => {
      event.cancelBubble = true;
      if (!selectable) {
        setLastTextClick(null);
        return;
      }
      onAnnotationSelected(annotation.id);
      if (annotation.kind !== "text" || !editable) {
        setLastTextClick(null);
        return;
      }
      const now = Date.now();
      const lastTextClick = getLastTextClick();
      const isDoubleClick =
        lastTextClick?.annotationId === annotation.id && now - lastTextClick.timestamp <= 350;
      setLastTextClick({ annotationId: annotation.id, timestamp: now });
      if (isDoubleClick) {
        onStartEditTextInput(annotation.id);
      }
    });
    annotationLayer.add(node);
    if (editable && annotation.id === selectedAnnotationId) {
      enableEditingControls({
        annotation,
        node,
        annotationLayer,
        getStyleReferenceSize,
        onAnnotationSelected,
        onAnnotationUpdated
      });
    }
  }
  annotationLayer.draw();
}
