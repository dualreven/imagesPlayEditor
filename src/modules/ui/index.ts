import type { Annotation, AnnotationStyle, DrawingTool, TimelineAction } from "../models";
import type { ExportSettings } from "../settings";

export type AppIconName =
  | "image"
  | "projectImport"
  | "projectExport"
  | "select"
  | "box"
  | "arrow"
  | "text"
  | "export"
  | "settings"
  | "style"
  | "frameAdd"
  | "clear"
  | "lock"
  | "delete"
  | "edit"
  | "pin"
  | "pinOff"
  | "copy";

const iconMarkupMap: Record<AppIconName, string> = {
  image:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M864 160H160c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h704c35.3 0 64-28.7 64-64V224c0-35.3-28.7-64-64-64zm-32 608H192V256h640v512z"></path><path d="M304 456a72 72 0 1 0 0-144 72 72 0 0 0 0 144zm464 232H256l136-168 96 112 72-88z"></path></svg>',
  projectImport:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M832 320H540.7l-83.2-96H192c-35.3 0-64 28.7-64 64v448c0 35.3 28.7 64 64 64h640c35.3 0 64-28.7 64-64V384c0-35.3-28.7-64-64-64zm-96 272H552v104a32 32 0 1 1-64 0V592H304a32 32 0 1 1 0-64h184V424a32 32 0 1 1 64 0v104h184a32 32 0 1 1 0 64z"></path></svg>',
  projectExport:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M832 320H540.7l-83.2-96H192c-35.3 0-64 28.7-64 64v448c0 35.3 28.7 64 64 64h640c35.3 0 64-28.7 64-64V384c0-35.3-28.7-64-64-64zm-96 336H552v-88a32 32 0 1 0-64 0v88H304a32 32 0 1 0 0 64h184v88a32 32 0 1 0 64 0v-88h184a32 32 0 1 0 0-64z"></path></svg>',
  select:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M224 160l192 576 96-184 184 312 80-48-184-312 200-8z"></path></svg>',
  box:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M224 224h576v576H224zM288 736h448V288H288z"></path></svg>',
  arrow:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M640 192l-45.3 45.3L729.4 372H224v64h505.4L594.7 570.7 640 616l192-192z"></path></svg>',
  text:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M160 224h704v96h-64v-32H576v448h96v64H352v-64h96V288H224v32h-64z"></path></svg>',
  export:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M505.7 201.1a32 32 0 0 1 45.3 0l181 181a32 32 0 1 1-45.3 45.2L560 300.5V672a32 32 0 1 1-64 0V300.5L369.3 427.3a32 32 0 1 1-45.3-45.2l181-181z"></path><path d="M224 736a32 32 0 0 1 32 32v32h512v-32a32 32 0 1 1 64 0v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32z"></path></svg>',
  settings:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M512 352a160 160 0 1 0 0 320 160 160 0 0 0 0-320zm0 256a96 96 0 1 1 0-192 96 96 0 0 1 0 192z"></path><path d="M880 560v-96l-91.2-24.8a287.7 287.7 0 0 0-26.8-64.5l47.2-82.6-67.9-67.9-82.6 47.2a287.7 287.7 0 0 0-64.5-26.8L560 144h-96l-24.8 91.2a287.7 287.7 0 0 0-64.5 26.8l-82.6-47.2-67.9 67.9 47.2 82.6a287.7 287.7 0 0 0-26.8 64.5L144 464v96l91.2 24.8a287.7 287.7 0 0 0 26.8 64.5l-47.2 82.6 67.9 67.9 82.6-47.2a287.7 287.7 0 0 0 64.5 26.8L464 880h96l24.8-91.2a287.7 287.7 0 0 0 64.5-26.8l82.6 47.2 67.9-67.9-47.2-82.6a287.7 287.7 0 0 0 26.8-64.5zM512 736a224 224 0 1 1 0-448 224 224 0 0 1 0 448z"></path></svg>',
  style:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M672 160 256 576l-64 224 224-64 416-416-160-160zm-288 520-100 28 28-100 360-360 72 72-360 360z"></path></svg>',
  frameAdd:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M192 224h448v128h128v448H192zM256 736h448V416H576V288H256z"></path><path d="M736 160v96h96v64h-96v96h-64v-96h-96v-64h96v-96z"></path></svg>',
  clear:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M320 256h512v64H320z"></path><path d="M416 320h64v352h-64zm128 0h64v352h-64zm128 0h64v352h-64z"></path><path d="M256 224h64l64-96h256l64 96h64v64H256zm64 96h384v480H320z"></path></svg>',
  lock:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M320 448v-96a192 192 0 1 1 384 0v96h32a64 64 0 0 1 64 64v256a64 64 0 0 1-64 64H288a64 64 0 0 1-64-64V512a64 64 0 0 1 64-64h32zm64 0h256v-96a128 128 0 1 0-256 0v96z"></path></svg>',
  delete:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M352 320h64v384h-64zm128 0h64v384h-64zm128 0h64v384h-64z"></path><path d="M256 224h160l32-64h128l32 64h160v64H256zm64 96h384v512H320z"></path></svg>',
  edit:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M257.9 768.2 192 832l63.8-65.9 467-467 65.9 65.9z"></path><path d="M880 256.2a63.8 63.8 0 0 0 0-90.3l-21.9-21.9a63.8 63.8 0 0 0-90.3 0l-56.7 56.6 112.2 112.2L880 256.2zM192 832l181.5-33.9L272 696.5z"></path></svg>',
  pin:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M512 96a224 224 0 0 1 224 224c0 54.7-19.6 97.8-57.1 139.7L576 576v224l-64 128-64-128V576L345.1 459.7C307.6 417.8 288 374.7 288 320A224 224 0 0 1 512 96zm0 64a160 160 0 0 0-160 160c0 39.4 13.4 68.6 40.8 99.2L512 553.1l119.2-133.9c27.4-30.6 40.8-59.8 40.8-99.2a160 160 0 0 0-160-160z"></path><path d="M512 256a64 64 0 1 1 0 128 64 64 0 0 1 0-128z"></path></svg>',
  pinOff:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M512 96a224 224 0 0 1 224 224c0 54.7-19.6 97.8-57.1 139.7L576 576v224l-64 128-64-128V576L345.1 459.7C307.6 417.8 288 374.7 288 320A224 224 0 0 1 512 96zm0 64a160 160 0 0 0-160 160c0 39.4 13.4 68.6 40.8 99.2L512 553.1l119.2-133.9c27.4-30.6 40.8-59.8 40.8-99.2a160 160 0 0 0-160-160z"></path><path d="M300.6 768.2 768.2 300.6l45.2 45.2-467.6 467.6z"></path></svg>',
  copy:
    '<svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true"><path d="M320 192h448v512H320zM384 640h320V256H384z"></path><path d="M192 320h64v512h448v64H192z"></path></svg>'
};

export function getToolLabel(tool: DrawingTool) {
  const labelMap: Record<DrawingTool, string> = {
    select: "选择",
    box: "框选",
    arrow: "箭头",
    text: "文字"
  };
  return labelMap[tool];
}

export function getActionLabel(action: TimelineAction) {
  return action === "clear_previous" ? "清空之前标注(锁定保留)" : "保留下一个标注";
}

export function getEditableStyleFlags(kind: Annotation["kind"] | null) {
  if (kind === "box") {
    return { color: true, stroke: true, arrow: false, font: false };
  }
  if (kind === "arrow") {
    return { color: true, stroke: true, arrow: true, font: false };
  }
  if (kind === "text") {
    return { color: true, stroke: false, arrow: false, font: true };
  }
  return { color: true, stroke: true, arrow: true, font: true };
}

export function mergeStyleForAnnotation(annotation: Annotation, draft: AnnotationStyle): AnnotationStyle {
  const next = { ...annotation.style, color: draft.color };
  if (annotation.kind === "box" || annotation.kind === "arrow") {
    next.strokeWidth = draft.strokeWidth;
  }
  if (annotation.kind === "arrow") {
    next.arrowLength = draft.arrowLength;
  }
  if (annotation.kind === "text") {
    next.fontSize = draft.fontSize;
  }
  return next;
}

export function getSaveModeText(settings: ExportSettings) {
  return settings.savePath ? `保存路径: ${settings.savePath}` : "保存路径: 浏览器下载目录";
}

export function renderAntIcon(name: AppIconName) {
  return `<span class="btn-icon anticon" aria-hidden="true">${iconMarkupMap[name]}</span>`;
}
