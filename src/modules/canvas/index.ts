import Konva from "konva";
import type { Annotation, AnnotationStyle, DrawingTool, EditorImage, Point } from "../models";
import { type LastTextClick, renderAnnotationLayer } from "./annotation-layer-render";
import { DrawingSession } from "./drawing-session";
import { loadImage, readFileAsDataUrl } from "./geometry";
import { canEditSelectedAnnotation, isAnnotationSelectedForEditing } from "./interaction-policy";
import { bindCanvasPointerEvents } from "./pointer-events";
import {
  applyDisplayScale,
  applyViewportStageSize,
  computeAutoFitScale,
  getImageSize,
  getScenePointerPosition,
  getStyleReferenceSize,
  toDataUrlAtOriginalScale
} from "./stage-viewport";
import { startCreateTextInput, startEditTextInput } from "./text-annotation-session";
import { TextInputOverlayController } from "./text-input-overlay";
interface CanvasCallbacks {
  onAnnotationCreated: (annotation: Annotation) => void;
  onAnnotationSelected: (annotationId: string | null) => void;
  onAnnotationUpdated: (annotation: Annotation) => void;
  onRequireImage?: () => void;
}
interface CanvasControllerOptions {
  container: HTMLDivElement;
  callbacks: CanvasCallbacks;
}
export class CanvasController {
  private container: HTMLDivElement;
  private stage: Konva.Stage;
  private backgroundLayer: Konva.Layer;
  private annotationLayer: Konva.Layer;
  private drawingLayer: Konva.Layer;
  private backgroundImageNode: Konva.Image | null = null;
  private callbacks: CanvasCallbacks;
  private tool: DrawingTool = "select";
  private style: AnnotationStyle;
  private annotations = new Map<string, Annotation>();
  private selectedAnnotationId: string | null = null;
  private visibleAnnotationIds: Set<string> | null = null;
  private drawingSession: DrawingSession;
  private imageMeta: EditorImage | null = null;
  private onWindowResize: () => void;
  private displayScale = 1;
  private textInputOverlay: TextInputOverlayController;
  private lastTextClick: LastTextClick | null = null;
  constructor(options: CanvasControllerOptions, style: AnnotationStyle) {
    this.container = options.container;
    this.callbacks = options.callbacks;
    this.style = { ...style };
    this.stage = new Konva.Stage({
      container: options.container,
      width: 960,
      height: 620
    });
    this.backgroundLayer = new Konva.Layer();
    this.annotationLayer = new Konva.Layer();
    this.drawingLayer = new Konva.Layer();
    this.drawingSession = new DrawingSession({
      drawingLayer: this.drawingLayer,
      getTool: () => this.tool,
      getStyle: () => this.style,
      getStyleReferenceSize: () => this.getStyleReferenceSize(),
      onAnnotationCreated: (annotation) => this.callbacks.onAnnotationCreated(annotation)
    });
    this.textInputOverlay = new TextInputOverlayController({
      container: this.container,
      getStageRect: () => this.stage.content.getBoundingClientRect(),
      getDisplayScale: () => this.displayScale,
      getStyleReferenceSize: () => this.getStyleReferenceSize()
    });
    this.stage.add(this.backgroundLayer, this.annotationLayer, this.drawingLayer);
    applyViewportStageSize(this.stage, this.container);
    this.registerPointerEvents();
    this.onWindowResize = () => {
      if (this.imageMeta) {
        this.applyAutoFitScale();
        return;
      }
      applyViewportStageSize(this.stage, this.container);
    };
    window.addEventListener("resize", this.onWindowResize);
  }
  setTool(tool: DrawingTool) {
    if (this.tool === "text" && tool !== "text") {
      this.textInputOverlay.finish(true);
    }
    this.tool = tool;
  }
  setStyle(style: AnnotationStyle) {
    this.style = { ...style };
  }
  setAnnotations(annotations: Map<string, Annotation>, selectedAnnotationId: string | null) {
    this.annotations = new Map(annotations);
    this.selectedAnnotationId = selectedAnnotationId;
    this.redrawAnnotationLayer();
  }
  setVisibleAnnotationIds(ids: string[] | null) {
    this.visibleAnnotationIds = ids ? new Set(ids) : null;
    this.redrawAnnotationLayer();
  }
  getImageSize() {
    return getImageSize(this.imageMeta, this.stage);
  }
  private getStyleReferenceSize() {
    return getStyleReferenceSize(this.imageMeta, this.stage);
  }
  async loadImage(file: File): Promise<EditorImage> {
    this.textInputOverlay.finish(true);
    const src = await readFileAsDataUrl(file);
    const image = await loadImage(src);
    this.backgroundLayer.destroyChildren();
    this.backgroundImageNode = new Konva.Image({
      x: 0,
      y: 0,
      image,
      width: image.width,
      height: image.height
    });
    this.backgroundLayer.add(this.backgroundImageNode);
    this.stage.width(image.width);
    this.stage.height(image.height);
    const meta = {
      src,
      width: image.width,
      height: image.height
    };
    this.imageMeta = meta;
    this.applyAutoFitScale();
    this.stage.draw();
    return meta;
  }
  toDataUrl() {
    return toDataUrlAtOriginalScale(this.stage, this.imageMeta, this.displayScale, (scale) =>
      this.applyDisplayScale(scale)
    );
  }
  private getScenePointerPosition() {
    return getScenePointerPosition(this.stage, this.displayScale);
  }
  private applyDisplayScale(scale: number) {
    if (!this.imageMeta) {
      return;
    }
    if (this.textInputOverlay.isActive()) {
      this.textInputOverlay.finish(true);
    }
    this.displayScale = scale;
    applyDisplayScale(this.stage, this.imageMeta, scale);
  }
  destroy() {
    this.textInputOverlay.finish(false);
    window.removeEventListener("resize", this.onWindowResize);
    this.stage.destroy();
  }
  private startCreateTextInput(point: Point) {
    startCreateTextInput({
      textInputOverlay: this.textInputOverlay,
      point,
      style: this.style,
      onAnnotationCreated: (annotation) => this.callbacks.onAnnotationCreated(annotation)
    });
  }
  private startEditTextInput(annotationId: string) {
    startEditTextInput({
      textInputOverlay: this.textInputOverlay,
      annotationId,
      annotations: this.annotations,
      onAnnotationUpdated: (annotation) => this.callbacks.onAnnotationUpdated(annotation)
    });
  }
  private applyAutoFitScale() {
    if (!this.imageMeta) {
      return;
    }
    this.applyDisplayScale(computeAutoFitScale(this.container, this.imageMeta));
  }
  private registerPointerEvents() {
    bindCanvasPointerEvents({
      stage: this.stage,
      getTool: () => this.tool,
      getBackgroundImageNode: () => this.backgroundImageNode,
      hasImage: () => Boolean(this.imageMeta),
      getScenePointerPosition: () => this.getScenePointerPosition(),
      onRequireImage: () => this.callbacks.onRequireImage?.(),
      onSelectNone: () => this.callbacks.onAnnotationSelected(null),
      onStartDrawing: (point) => this.drawingSession.startAt(point),
      onMoveDrawing: (point) => this.drawingSession.moveTo(point),
      onCommitDrawing: (point) => this.drawingSession.commitAt(point),
      onClearDrawing: () => this.drawingSession.clear(),
      onStartCreateTextInput: (point) => this.startCreateTextInput(point)
    });
  }
  private canEditAnnotations() {
    return canEditSelectedAnnotation({
      tool: this.tool,
      visibleAnnotationIds: this.visibleAnnotationIds,
      selectedAnnotationId: this.selectedAnnotationId
    });
  }
  private isAnnotationSelected(annotationId: string) {
    return isAnnotationSelectedForEditing(annotationId, {
      tool: this.tool,
      visibleAnnotationIds: this.visibleAnnotationIds,
      selectedAnnotationId: this.selectedAnnotationId
    });
  }
  private redrawAnnotationLayer() {
    renderAnnotationLayer({
      annotationLayer: this.annotationLayer,
      annotations: this.annotations,
      selectedAnnotationId: this.selectedAnnotationId,
      visibleAnnotationIds: this.visibleAnnotationIds,
      selectable: this.tool === "select",
      editable: this.canEditAnnotations(),
      isAnnotationSelected: (annotationId) => this.isAnnotationSelected(annotationId),
      getStyleReferenceSize: () => this.getStyleReferenceSize(),
      getLastTextClick: () => this.lastTextClick,
      setLastTextClick: (value) => {
        this.lastTextClick = value;
      },
      onAnnotationSelected: (annotationId) => this.callbacks.onAnnotationSelected(annotationId),
      onAnnotationUpdated: (annotation) => this.callbacks.onAnnotationUpdated(annotation),
      onStartEditTextInput: (annotationId) => this.startEditTextInput(annotationId)
    });
  }
}
