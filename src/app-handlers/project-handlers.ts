import type { CreateAppEventHandlersOptions, EventCallbacks } from "./types";

type ProjectCallbacks = Pick<EventCallbacks, "onProjectImport" | "onProjectExport">;

export function createProjectHandlers(options: CreateAppEventHandlersOptions): ProjectCallbacks {
  const { importProject, exportProject, refresh, setStatus } = options;

  return {
    onProjectImport: async (file) => {
      if (!file) {
        return;
      }
      try {
        await importProject(file);
        refresh();
        setStatus(`工程已导入: ${file.name}`);
      } catch (error) {
        console.error(error);
        setStatus(`工程导入失败: ${(error as Error).message}`);
      }
    },
    onProjectExport: async () => {
      try {
        await exportProject();
        setStatus("工程 JSON 已导出");
      } catch (error) {
        console.error(error);
        setStatus(`工程导出失败: ${(error as Error).message}`);
      }
    }
  };
}
