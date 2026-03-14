import type {
  Annotation,
  AnnotationCounters,
  EditorImage,
  Frame,
  TimelineStep
} from "../models";
import type { ExportSettings } from "../settings";

export interface ProjectSnapshot {
  version: 1;
  exportedAt: string;
  image: EditorImage | null;
  style: Annotation["style"];
  exportSettings: ExportSettings;
  annotations: Annotation[];
  actions: TimelineStep[];
  frames: Frame[];
  clearBeforeFrameIds: string[];
  annotationCounters: AnnotationCounters;
  selectedFrameId: string | null;
  selectedActionId: string | null;
  selectedAnnotationId: string | null;
  focusedFrameId: string | null;
  tool: "select" | "box" | "arrow" | "text";
}

interface BuildProjectSnapshotOptions {
  image: EditorImage | null;
  style: Annotation["style"];
  exportSettings: ExportSettings;
  annotations: Map<string, Annotation>;
  actions: Map<string, TimelineStep>;
  frames: Frame[];
  clearBeforeFrameIds: ReadonlySet<string>;
  annotationCounters: AnnotationCounters;
  selectedFrameId: string | null;
  selectedActionId: string | null;
  selectedAnnotationId: string | null;
  focusedFrameId: string | null;
  tool: ProjectSnapshot["tool"];
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, field: string) {
  assert(typeof value === "string", `${field} must be a string.`);
  return value;
}

function readNullableString(value: unknown, field: string) {
  assert(value === null || typeof value === "string", `${field} must be a string or null.`);
  return value;
}

function readNumber(value: unknown, field: string) {
  assert(typeof value === "number" && Number.isFinite(value), `${field} must be a finite number.`);
  return value;
}

function readBoolean(value: unknown, field: string) {
  assert(typeof value === "boolean", `${field} must be a boolean.`);
  return value;
}

function parseImage(value: unknown): EditorImage | null {
  if (value === null) {
    return null;
  }
  assert(isObject(value), "image must be an object or null.");
  return {
    src: readString(value.src, "image.src"),
    width: readNumber(value.width, "image.width"),
    height: readNumber(value.height, "image.height"),
    fileName: readString(value.fileName, "image.fileName"),
    sourcePath: readNullableString(value.sourcePath, "image.sourcePath")
  };
}

function parseStyle(value: unknown, field: string) {
  assert(isObject(value), `${field} must be an object.`);
  return {
    color: readString(value.color, `${field}.color`),
    strokeWidth: readNumber(value.strokeWidth, `${field}.strokeWidth`),
    arrowLength: readNumber(value.arrowLength, `${field}.arrowLength`),
    fontSize: readNumber(value.fontSize, `${field}.fontSize`)
  };
}

function parseAnnotation(value: unknown): Annotation {
  assert(isObject(value), "annotation must be an object.");
  const kind = readString(value.kind, "annotation.kind");
  assert(kind === "box" || kind === "arrow" || kind === "text", "annotation.kind is invalid.");
  const annotationBase = {
    id: readString(value.id, "annotation.id"),
    kind,
    name: readString(value.name, "annotation.name"),
    sequence: readNumber(value.sequence, "annotation.sequence"),
    locked: readBoolean(value.locked, "annotation.locked"),
    createdAt: readNumber(value.createdAt, "annotation.createdAt"),
    style: parseStyle(value.style, "annotation.style")
  };
  assert(isObject(value.data), "annotation.data must be an object.");
  if (kind === "box") {
    return {
      ...annotationBase,
      kind,
      data: {
        x: readNumber(value.data.x, "annotation.data.x"),
        y: readNumber(value.data.y, "annotation.data.y"),
        width: readNumber(value.data.width, "annotation.data.width"),
        height: readNumber(value.data.height, "annotation.data.height")
      }
    };
  }
  if (kind === "arrow") {
    return {
      ...annotationBase,
      kind,
      data: {
        startX: readNumber(value.data.startX, "annotation.data.startX"),
        startY: readNumber(value.data.startY, "annotation.data.startY"),
        endX: readNumber(value.data.endX, "annotation.data.endX"),
        endY: readNumber(value.data.endY, "annotation.data.endY")
      }
    };
  }
  return {
    ...annotationBase,
    kind,
    data: {
      x: readNumber(value.data.x, "annotation.data.x"),
      y: readNumber(value.data.y, "annotation.data.y"),
      content: readString(value.data.content, "annotation.data.content")
    }
  };
}

function parseAction(value: unknown): TimelineStep {
  assert(isObject(value), "action must be an object.");
  const type = readString(value.type, "action.type");
  assert(type === "annotation" || type === "system", "action.type is invalid.");
  if (type === "annotation") {
    return {
      id: readString(value.id, "action.id"),
      type,
      annotationId: readString(value.annotationId, "action.annotationId")
    };
  }
  const action = readString(value.action, "action.action");
  assert(action === "clear_previous" || action === "keep_next", "action.action is invalid.");
  return {
    id: readString(value.id, "action.id"),
    type,
    action
  };
}

function parseFrame(value: unknown): Frame {
  assert(isObject(value), "frame must be an object.");
  assert(Array.isArray(value.actionIds), "frame.actionIds must be an array.");
  return {
    id: readString(value.id, "frame.id"),
    actionIds: value.actionIds.map((item, index) => readString(item, `frame.actionIds[${index}]`)),
    description: readString(value.description, "frame.description"),
    exclusive: readBoolean(value.exclusive, "frame.exclusive"),
    createdAt: readNumber(value.createdAt, "frame.createdAt")
  };
}

function parseCounters(value: unknown): AnnotationCounters {
  assert(isObject(value), "annotationCounters must be an object.");
  return {
    box: readNumber(value.box, "annotationCounters.box"),
    arrow: readNumber(value.arrow, "annotationCounters.arrow"),
    text: readNumber(value.text, "annotationCounters.text")
  };
}

function validateRelations(snapshot: ProjectSnapshot) {
  const annotationIds = new Set(snapshot.annotations.map((annotation) => annotation.id));
  const actionIds = new Set(snapshot.actions.map((action) => action.id));
  const frameIds = new Set(snapshot.frames.map((frame) => frame.id));

  snapshot.actions.forEach((action) => {
    if (action.type === "annotation") {
      assert(annotationIds.has(action.annotationId), `Missing annotation for action ${action.id}.`);
    }
  });
  snapshot.frames.forEach((frame) => {
    frame.actionIds.forEach((actionId) => {
      assert(actionIds.has(actionId), `Missing action ${actionId} in frame ${frame.id}.`);
    });
  });
  snapshot.clearBeforeFrameIds.forEach((frameId) => {
    assert(frameIds.has(frameId), `Missing clear-before frame ${frameId}.`);
  });
  if (snapshot.selectedFrameId) {
    assert(frameIds.has(snapshot.selectedFrameId), "selectedFrameId does not exist.");
  }
  if (snapshot.selectedActionId) {
    assert(actionIds.has(snapshot.selectedActionId), "selectedActionId does not exist.");
  }
  if (snapshot.selectedAnnotationId) {
    assert(annotationIds.has(snapshot.selectedAnnotationId), "selectedAnnotationId does not exist.");
  }
  if (snapshot.focusedFrameId) {
    assert(frameIds.has(snapshot.focusedFrameId), "focusedFrameId does not exist.");
  }
}

export function buildProjectSnapshot(options: BuildProjectSnapshotOptions): ProjectSnapshot {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    image: options.image ? { ...options.image } : null,
    style: { ...options.style },
    exportSettings: { ...options.exportSettings },
    annotations: [...options.annotations.values()],
    actions: [...options.actions.values()],
    frames: options.frames.map((frame) => ({ ...frame, actionIds: [...frame.actionIds] })),
    clearBeforeFrameIds: [...options.clearBeforeFrameIds],
    annotationCounters: { ...options.annotationCounters },
    selectedFrameId: options.selectedFrameId,
    selectedActionId: options.selectedActionId,
    selectedAnnotationId: options.selectedAnnotationId,
    focusedFrameId: options.focusedFrameId,
    tool: options.tool
  };
}

export function parseProjectSnapshot(jsonText: string): ProjectSnapshot {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    throw new Error(`Invalid project JSON: ${(error as Error).message}`);
  }
  assert(isObject(parsed), "Project JSON root must be an object.");
  const version = readNumber(parsed.version, "version");
  assert(version === 1, `Unsupported project version: ${version}.`);
  assert(Array.isArray(parsed.annotations), "annotations must be an array.");
  assert(Array.isArray(parsed.actions), "actions must be an array.");
  assert(Array.isArray(parsed.frames), "frames must be an array.");
  assert(Array.isArray(parsed.clearBeforeFrameIds), "clearBeforeFrameIds must be an array.");
  assert(isObject(parsed.exportSettings), "exportSettings must be an object.");
  const tool = readString(parsed.tool, "tool");
  assert(tool === "select" || tool === "box" || tool === "arrow" || tool === "text", "tool is invalid.");

  const snapshot: ProjectSnapshot = {
    version: 1,
    exportedAt: readString(parsed.exportedAt, "exportedAt"),
    image: parseImage(parsed.image),
    style: parseStyle(parsed.style, "style"),
    exportSettings: {
      savePath: readString(parsed.exportSettings.savePath, "exportSettings.savePath"),
      filePattern: readString(parsed.exportSettings.filePattern, "exportSettings.filePattern")
    },
    annotations: parsed.annotations.map((item) => parseAnnotation(item)),
    actions: parsed.actions.map((item) => parseAction(item)),
    frames: parsed.frames.map((item) => parseFrame(item)),
    clearBeforeFrameIds: parsed.clearBeforeFrameIds.map((item, index) =>
      readString(item, `clearBeforeFrameIds[${index}]`)
    ),
    annotationCounters: parseCounters(parsed.annotationCounters),
    selectedFrameId: readNullableString(parsed.selectedFrameId, "selectedFrameId"),
    selectedActionId: readNullableString(parsed.selectedActionId, "selectedActionId"),
    selectedAnnotationId: readNullableString(parsed.selectedAnnotationId, "selectedAnnotationId"),
    focusedFrameId: readNullableString(parsed.focusedFrameId, "focusedFrameId"),
    tool
  };

  validateRelations(snapshot);
  return snapshot;
}
