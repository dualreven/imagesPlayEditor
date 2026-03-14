import { createDialogHandlers } from "./dialog-handlers";
import { createProjectHandlers } from "./project-handlers";
import { createTimelineHandlers } from "./timeline-handlers";
import { createToolAndStyleHandlers } from "./tool-style-handlers";
import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

export type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

export function createAppEventHandlers(options: CreateAppEventHandlersOptions): EventCallbacks {
  return {
    ...createToolAndStyleHandlers(options),
    ...createDialogHandlers(options),
    ...createProjectHandlers(options),
    ...createTimelineHandlers(options),
    onExport: options.runExport
  };
}
