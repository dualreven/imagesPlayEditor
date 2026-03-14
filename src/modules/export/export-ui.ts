import type { ExportFrame } from "../models";
import { buildStepFileStem } from "../settings";
import { renderAntIcon } from "../ui";
import { exportFramesAsZip } from "./export-zip";

type ExportFeedbackKind = "info" | "success" | "error";

export interface RunExportWithUiOptions {
  frames: ExportFrame[];
  filePattern: string;
  outputDir?: string;
  originalImage: {
    fileName: string;
    dataUrl: string;
  };
  projectFile: {
    fileName: string;
    content: string;
  };
  exportBtn: HTMLButtonElement;
  setStatus: (message: string) => void;
  setExportFeedback: (message: string, kind?: ExportFeedbackKind) => void;
  renderFrame: (frame: ExportFrame) => Promise<string> | string;
  onFinalize: () => void;
}

export async function runExportWithUi(options: RunExportWithUiOptions) {
  const { frames, filePattern, outputDir, originalImage, projectFile, exportBtn, setStatus, setExportFeedback, renderFrame, onFinalize } = options;
  const setButtonContent = (label: string) => {
    exportBtn.innerHTML = `<span class="export-btn-text">${label}</span>${renderAntIcon("export")}`;
  };
  exportBtn.disabled = true;
  exportBtn.classList.add("is-busy");
  setButtonContent(`导出中 0/${frames.length}`);
  setExportFeedback("正在准备导出...", "info");
  setStatus(`正在导出 ${frames.length} 张帧图`);

  try {
    const result = await exportFramesAsZip(frames, renderFrame, {
      filePattern,
      outputDir,
      originalImage,
      projectFile,
      onProgress: (current, total) => {
        setButtonContent(`导出中 ${current}/${total}`);
        setExportFeedback(`正在生成第 ${current}/${total} 帧：${buildStepFileStem(filePattern, current)}.png`, "info");
      }
    });
    const sizeText = `${Math.max(1, Math.round(result.sizeBytes / 1024))} KB`;
    if (result.savedPath) {
      setStatus(`导出完成: ${result.savedPath}`);
      setExportFeedback(`已保存到 ${result.savedPath}（${result.frameCount} 张，${sizeText}）`, "success");
      return;
    }
    setStatus(`导出完成: ${result.fileName}`);
    setExportFeedback(`已触发下载：${result.fileName}（${result.frameCount} 张，${sizeText}）`, "success");
  } catch (error) {
    console.error(error);
    setStatus("导出失败");
    setExportFeedback("导出失败：请查看控制台错误信息", "error");
  } finally {
    exportBtn.disabled = false;
    exportBtn.classList.remove("is-busy");
    setButtonContent("导出步骤图 ZIP");
    onFinalize();
  }
}
