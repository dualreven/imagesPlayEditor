import { invoke } from "@tauri-apps/api/core";
import { BUILD_INFO } from "../../generated/build-info";
import { isTauriRuntime } from "../settings";

export interface AppBuildInfo {
  displayVersion: string;
  semverVersion: string;
  gitHash: string;
  previousGitHash: string | null;
  updateNotes: string[];
  artifactPath: string | null;
  updatedAt: string;
  historyFilePath: string | null;
  historyEntries: AppBuildHistoryEntry[];
}

export interface AppBuildHistoryEntry {
  displayVersion: string;
  semverVersion: string;
  gitHash: string;
  previousGitHash: string | null;
  updateNotes: string[];
  artifactPath: string | null;
  updatedAt: string;
}

export function getAppBuildInfo(): AppBuildInfo {
  const historyEntries = BUILD_INFO.historyEntries as AppBuildHistoryEntry[];
  return {
    displayVersion: BUILD_INFO.displayVersion,
    semverVersion: BUILD_INFO.semverVersion,
    gitHash: BUILD_INFO.gitHash,
    previousGitHash: BUILD_INFO.previousGitHash,
    updateNotes: [...BUILD_INFO.updateNotes],
    artifactPath: BUILD_INFO.artifactPath,
    updatedAt: BUILD_INFO.updatedAt,
    historyFilePath: BUILD_INFO.historyFilePath,
    historyEntries: historyEntries.map((entry) => ({
      displayVersion: entry.displayVersion,
      semverVersion: entry.semverVersion,
      gitHash: entry.gitHash,
      previousGitHash: entry.previousGitHash,
      updateNotes: [...entry.updateNotes],
      artifactPath: entry.artifactPath,
      updatedAt: entry.updatedAt
    }))
  };
}

export function getAppVersionLabel(info = getAppBuildInfo()) {
  return `${info.displayVersion} (git ${info.gitHash})`;
}

export async function openBuildHistoryFile(info = getAppBuildInfo()) {
  if (!info.historyFilePath) {
    throw new Error("Build history file path is missing.");
  }
  if (!isTauriRuntime()) {
    throw new Error("Open local history file is only available in Tauri runtime.");
  }
  await invoke("open_local_file_path", { path: info.historyFilePath });
}
