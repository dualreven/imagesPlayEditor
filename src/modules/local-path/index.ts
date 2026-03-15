import { invoke } from "@tauri-apps/api/core";
import { isTauriRuntime } from "../settings";

export interface PickedLocalImageSource {
  filePath: string;
  fileName: string;
  dataUrl: string;
}

interface PickedLocalImageSourcePayload {
  file_path: string;
  file_name: string;
  data_url: string;
}

export function getDirectoryPathFromFilePath(filePath: string) {
  const normalized = filePath.trim();
  const separatorIndex = Math.max(normalized.lastIndexOf("\\"), normalized.lastIndexOf("/"));
  if (separatorIndex <= 0) {
    throw new Error(`Cannot resolve directory from file path: ${filePath}`);
  }
  return normalized.slice(0, separatorIndex);
}

export async function pickLocalImageSource() {
  if (!isTauriRuntime()) {
    throw new Error("Pick local image is only available in Tauri runtime.");
  }
  const payload = await invoke<PickedLocalImageSourcePayload | null>("pick_image_file_base64");
  if (!payload) {
    return null;
  }
  return {
    filePath: payload.file_path,
    fileName: payload.file_name,
    dataUrl: payload.data_url
  } satisfies PickedLocalImageSource;
}

export async function openLocalPath(path: string) {
  const normalized = path.trim();
  if (!normalized) {
    throw new Error("Path is empty.");
  }
  if (!isTauriRuntime()) {
    throw new Error("Open local path is only available in Tauri runtime.");
  }
  await invoke("open_local_file_path", { path: normalized });
}
