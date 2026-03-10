import type { AnnotationStyle, Point } from "../models";
import { resolveAnnotationStyle } from "./style-scale";

interface TextInputOverlayOptions {
  container: HTMLDivElement;
  getStageRect: () => DOMRect;
  getDisplayScale: () => number;
  getStyleReferenceSize: () => number;
}

export class TextInputOverlayController {
  private container: HTMLDivElement;
  private getStageRect: () => DOMRect;
  private getDisplayScale: () => number;
  private getStyleReferenceSize: () => number;
  private activeTextInput: HTMLTextAreaElement | null = null;
  private activeTextCommit: ((content: string) => void) | null = null;

  constructor(options: TextInputOverlayOptions) {
    this.container = options.container;
    this.getStageRect = options.getStageRect;
    this.getDisplayScale = options.getDisplayScale;
    this.getStyleReferenceSize = options.getStyleReferenceSize;
  }

  isActive() {
    return Boolean(this.activeTextInput);
  }

  open(point: Point, initialValue: string, style: AnnotationStyle, onCommit: (content: string) => void) {
    this.finish(true);
    const host = this.getHost();
    const displayPoint = this.getDisplayPoint(point);
    const input = document.createElement("textarea");
    input.className = "text-input-overlay";
    input.placeholder = "输入文字...";
    input.value = initialValue;
    input.style.left = `${displayPoint.x}px`;
    input.style.top = `${displayPoint.y}px`;
    input.style.color = style.color;
    input.style.fontSize = `${resolveAnnotationStyle(style, this.getStyleReferenceSize()).fontSize * this.getDisplayScale()}px`;
    host.append(input);
    this.activeTextInput = input;
    this.activeTextCommit = onCommit;
    const resize = () => {
      input.style.height = "auto";
      input.style.height = `${Math.max(40, input.scrollHeight)}px`;
    };
    input.addEventListener("input", resize);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        input.blur();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.finish(false);
      }
    });
    input.addEventListener("blur", () => {
      this.finish(true);
    });
    resize();
    input.focus();
  }

  finish(shouldCommit: boolean) {
    if (!this.activeTextInput) {
      this.activeTextInput = null;
      this.activeTextCommit = null;
      return;
    }
    const input = this.activeTextInput;
    const commit = this.activeTextCommit;
    this.activeTextInput = null;
    this.activeTextCommit = null;
    const content = input.value.trim();
    input.remove();
    if (shouldCommit && content && commit) {
      commit(content);
    }
  }

  private getHost() {
    return this.container.parentElement instanceof HTMLElement ? this.container.parentElement : this.container;
  }

  private getDisplayPoint(point: Point) {
    const host = this.getHost();
    const hostRect = host.getBoundingClientRect();
    const stageRect = this.getStageRect();
    return {
      x: stageRect.left - hostRect.left + host.scrollLeft + point.x * this.getDisplayScale(),
      y: stageRect.top - hostRect.top + host.scrollTop + point.y * this.getDisplayScale()
    };
  }
}
