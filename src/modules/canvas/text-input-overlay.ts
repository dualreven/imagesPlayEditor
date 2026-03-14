import type { AnnotationStyle, Point } from "../models";
import { resolveAnnotationStyle } from "./style-scale";

interface TextInputOverlayOptions {
  container: HTMLDivElement;
  getStageRect: () => DOMRect;
  getDisplayScale: () => number;
  getStyleReferenceSize: () => number;
  getHostRect: () => DOMRect;
}

export class TextInputOverlayController {
  private container: HTMLDivElement;
  private getStageRect: () => DOMRect;
  private getDisplayScale: () => number;
  private getStyleReferenceSize: () => number;
  private getHostRect: () => DOMRect;
  private activePanel: HTMLDivElement | null = null;
  private activeTextInput: HTMLTextAreaElement | null = null;
  private activeTextCommit: ((content: string) => void) | null = null;

  constructor(options: TextInputOverlayOptions) {
    this.container = options.container;
    this.getStageRect = options.getStageRect;
    this.getDisplayScale = options.getDisplayScale;
    this.getStyleReferenceSize = options.getStyleReferenceSize;
    this.getHostRect = options.getHostRect;
  }

  isActive() {
    return Boolean(this.activeTextInput);
  }

  open(point: Point, initialValue: string, style: AnnotationStyle, onCommit: (content: string) => void) {
    this.finish(true);
    const host = this.getHost();
    const displayPoint = this.getDisplayPoint(point);
    const panel = document.createElement("div");
    panel.className = "text-input-overlay-panel";
    panel.style.left = `${displayPoint.x}px`;
    panel.style.top = `${displayPoint.y}px`;

    const input = document.createElement("textarea");
    input.className = "text-input-overlay";
    input.placeholder = "输入文字...";
    input.value = initialValue;
    input.style.color = style.color;
    input.style.fontSize = `${resolveAnnotationStyle(style, this.getStyleReferenceSize()).fontSize * this.getDisplayScale()}px`;
    input.style.width = `${this.getPreferredWidth(displayPoint.x)}px`;
    const actions = document.createElement("div");
    actions.className = "text-input-overlay-actions";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "text-input-overlay-btn is-cancel";
    cancelButton.textContent = "取消";
    cancelButton.addEventListener("click", () => {
      this.finish(false);
    });

    const confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.className = "text-input-overlay-btn is-confirm";
    confirmButton.textContent = "确认";
    confirmButton.addEventListener("click", () => {
      this.finish(true);
    });

    actions.append(cancelButton, confirmButton);
    panel.append(input, actions);
    host.append(panel);
    this.activePanel = panel;
    this.activeTextInput = input;
    this.activeTextCommit = onCommit;
    const resize = () => {
      input.style.height = "auto";
      input.style.height = `${Math.max(40, input.scrollHeight)}px`;
    };
    input.addEventListener("input", resize);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        this.finish(false);
      }
    });
    resize();
    input.focus();
  }

  finish(shouldCommit: boolean) {
    if (!this.activeTextInput) {
      this.activePanel = null;
      this.activeTextInput = null;
      this.activeTextCommit = null;
      return;
    }
    const panel = this.activePanel;
    const input = this.activeTextInput;
    const commit = this.activeTextCommit;
    this.activePanel = null;
    this.activeTextInput = null;
    this.activeTextCommit = null;
    const content = input.value.trim();
    panel?.remove();
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

  private getPreferredWidth(offsetLeft: number) {
    const hostWidth = this.getHostRect().width;
    const remaining = Math.max(160, hostWidth - offsetLeft - 28);
    return Math.min(360, remaining);
  }
}
