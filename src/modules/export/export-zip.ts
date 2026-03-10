import JSZip from "jszip";
import { invoke } from "@tauri-apps/api/core";

import type { ExportFrame } from "../models";
import { buildStepFileStem, isTauriRuntime } from "../settings";

export interface ExportZipResult {
  fileName: string;
  frameCount: number;
  sizeBytes: number;
  savedPath?: string;
}

type ExportProgressHandler = (current: number, total: number) => void;

export interface ExportZipOptions {
  filePattern?: string;
  outputDir?: string;
  onProgress?: ExportProgressHandler;
}

function getBase64Payload(dataUrl: string) {
  const marker = "base64,";
  const index = dataUrl.indexOf(marker);
  if (index < 0) {
    throw new Error("Invalid data URL format.");
  }
  return dataUrl.slice(index + marker.length);
}

function downloadBlob(blob: Blob, fileName: string) {
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 30_000);
}

function ensurePngFileName(stemOrName: string) {
  return stemOrName.toLowerCase().endsWith(".png") ? stemOrName : `${stemOrName}.png`;
}

function toDescriptionMarkdown(fileNames: string[], frames: ExportFrame[]) {
  const lines = ["# Frame Descriptions", "", "| Image | Description |", "| --- | --- |"];
  fileNames.forEach((fileName, index) => {
    const description = (frames[index]?.description ?? "").trim();
    const safeDescription = description
      ? description.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br/>")
      : "(empty)";
    lines.push(`| ${fileName} | ${safeDescription} |`);
  });
  return lines.join("\n");
}

async function blobToBase64(blob: Blob) {
  const array = await blob.arrayBuffer();
  const bytes = new Uint8Array(array);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function exportFramesAsZip(
  frames: ExportFrame[],
  renderFrame: (frame: ExportFrame) => Promise<string> | string,
  options: ExportZipOptions = {}
): Promise<ExportZipResult> {
  if (frames.length === 0) {
    throw new Error("No frames to export.");
  }

  const zip = new JSZip();
  const filePattern = options.filePattern?.trim() || "step_[n3]";
  const fileNames: string[] = [];

  for (let index = 0; index < frames.length; index += 1) {
    const frame = frames[index];
    const dataUrl = await renderFrame(frame);
    const base64Png = getBase64Payload(dataUrl);
    const fileName = ensurePngFileName(buildStepFileStem(filePattern, index + 1));
    zip.file(fileName, base64Png, { base64: true });
    fileNames.push(fileName);
    options.onProgress?.(index + 1, frames.length);
  }
  zip.file("frame-descriptions.md", toDescriptionMarkdown(fileNames, frames));

  const blob = await zip.generateAsync({ type: "blob" });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const fileName = `images-play-export-${stamp}.zip`;

  if (options.outputDir && isTauriRuntime()) {
    const zipBase64 = await blobToBase64(blob);
    const savedPath = await invoke<string>("save_export_zip_base64", {
      dirPath: options.outputDir,
      fileName,
      base64Data: zipBase64
    });
    return {
      fileName,
      frameCount: frames.length,
      sizeBytes: blob.size,
      savedPath
    };
  }

  downloadBlob(blob, fileName);
  return { fileName, frameCount: frames.length, sizeBytes: blob.size };
}
