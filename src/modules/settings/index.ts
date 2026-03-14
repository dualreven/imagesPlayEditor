import { isTauri } from "@tauri-apps/api/core";

export interface ExportSettings {
  savePath: string;
  filePattern: string;
}

export interface ExportSettingsValidation {
  valid: boolean;
  message: string;
}

const STORAGE_KEY = "imagesPlayEditor.exportSettings.v1";
const DEFAULT_SETTINGS: ExportSettings = {
  savePath: "",
  filePattern: "step_[n3]"
};
const TOKEN_REGEX = /\[n(\d{1,3})\]/i;
const TOKEN_LITERAL_REGEX = /\[n\d{1,3}\]/gi;
const FILE_UNSAFE_REGEX = /[<>:"/\\|?*]/g;
const PATTERN_UNSAFE_REGEX = /\[|\]/g;

function sanitizeFileStem(value: string) {
  return value.replace(FILE_UNSAFE_REGEX, "_").trim();
}

function buildPatternStemFromImageName(fileName: string) {
  const stem = fileName
    .trim()
    .replace(/\.[^.]+$/, "")
    .replace(TOKEN_LITERAL_REGEX, "")
    .replace(PATTERN_UNSAFE_REGEX, "_");
  const normalized = sanitizeFileStem(stem);
  if (!normalized) {
    throw new Error(`Cannot derive export file pattern from image name: ${fileName}`);
  }
  return normalized;
}

export function isTauriRuntime() {
  return isTauri();
}

export function loadExportSettings(): ExportSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }
    const parsed = JSON.parse(raw) as Partial<ExportSettings>;
    return normalizeExportSettings(parsed);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function normalizeExportSettings(input: Partial<ExportSettings>): ExportSettings {
  return {
    savePath: (input.savePath ?? "").trim(),
    filePattern: (input.filePattern ?? DEFAULT_SETTINGS.filePattern).trim() || DEFAULT_SETTINGS.filePattern
  };
}

export function saveExportSettings(settings: ExportSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function validateFilePattern(pattern: string): ExportSettingsValidation {
  const normalized = pattern.trim();
  if (!normalized) {
    return { valid: false, message: "命名格式不能为空" };
  }
  const match = normalized.match(TOKEN_REGEX);
  if (!match) {
    return { valid: false, message: "命名格式必须包含编号占位符，如 [n3]" };
  }
  const digits = Number(match[1]);
  if (!Number.isInteger(digits) || digits < 1 || digits > 9) {
    return { valid: false, message: "编号位数范围为 1 到 9" };
  }
  return { valid: true, message: "" };
}

export function buildStepFileStem(pattern: string, index: number): string {
  const source = pattern.trim() || DEFAULT_SETTINGS.filePattern;
  const match = source.match(TOKEN_REGEX);
  if (!match) {
    return sanitizeFileStem(`${source}${index}`);
  }
  const digits = Number(match[1]);
  const numberText = String(index).padStart(Math.max(1, digits), "0");
  const replaced = source.replace(TOKEN_REGEX, numberText);
  const stem = sanitizeFileStem(replaced);
  return stem || `step_${numberText}`;
}

export function buildPreviewNames(pattern: string, count = 4): string[] {
  const names: string[] = [];
  for (let index = 1; index <= count; index += 1) {
    names.push(buildStepFileStem(pattern, index));
  }
  return names;
}

export function buildFilePatternFromImageName(fileName: string) {
  return `${buildPatternStemFromImageName(fileName)}_[n3]`;
}
