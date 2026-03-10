import Konva from "konva";

import type { Annotation, AnnotationStyle, DrawingTool, Point } from "../models";
import { createDrawingAnnotation, createDrawingPreviewNode, updateDrawingPreviewNode } from "./drawing-flow";

interface DrawingSessionOptions {
  drawingLayer: Konva.Layer;
  getTool: () => DrawingTool;
  getStyle: () => AnnotationStyle;
  getStyleReferenceSize: () => number;
  onAnnotationCreated: (annotation: Annotation) => void;
}

export class DrawingSession {
  private drawingLayer: Konva.Layer;
  private getTool: () => DrawingTool;
  private getStyle: () => AnnotationStyle;
  private getStyleReferenceSize: () => number;
  private onAnnotationCreated: (annotation: Annotation) => void;
  private start: Point | null = null;
  private preview: Konva.Shape | null = null;

  constructor(options: DrawingSessionOptions) {
    this.drawingLayer = options.drawingLayer;
    this.getTool = options.getTool;
    this.getStyle = options.getStyle;
    this.getStyleReferenceSize = options.getStyleReferenceSize;
    this.onAnnotationCreated = options.onAnnotationCreated;
  }

  startAt(point: Point) {
    this.start = point;
    this.preview = createDrawingPreviewNode(
      this.getTool(),
      point,
      this.getStyle(),
      this.getStyleReferenceSize()
    );
    if (!this.preview) {
      return;
    }
    this.drawingLayer.add(this.preview);
    this.drawingLayer.draw();
  }

  moveTo(point: Point) {
    if (!this.start || !this.preview) {
      return;
    }
    updateDrawingPreviewNode(this.getTool(), this.preview, this.start, point);
    this.drawingLayer.batchDraw();
  }

  commitAt(point: Point) {
    if (!this.start || !this.preview) {
      return;
    }
    const annotation = createDrawingAnnotation(this.getTool(), this.start, point, this.getStyle());
    if (!annotation) {
      return;
    }
    this.onAnnotationCreated(annotation);
  }

  clear() {
    this.start = null;
    this.preview?.destroy();
    this.preview = null;
    this.drawingLayer.draw();
  }
}
