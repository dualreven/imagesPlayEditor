import { buildPreviewNames, validateFilePattern, type ExportSettings } from "../settings";

interface SettingsPreviewRefs {
  patternInput: HTMLInputElement;
  patternTip: HTMLParagraphElement;
  preview: HTMLParagraphElement;
}

interface SettingsDialogRefs extends SettingsPreviewRefs {
  dialog: HTMLDialogElement;
  savePathInput: HTMLInputElement;
}

export function refreshSettingsPatternPreview(refs: SettingsPreviewRefs) {
  const validation = validateFilePattern(refs.patternInput.value);
  if (!validation.valid) {
    refs.patternTip.textContent = validation.message;
    refs.patternTip.dataset.kind = "error";
    refs.preview.textContent = "预览：-";
    return false;
  }
  refs.patternTip.textContent = "支持 [n3] 表示三位编号，如 abcd001。";
  refs.patternTip.dataset.kind = "info";
  refs.preview.textContent = `预览：${buildPreviewNames(refs.patternInput.value, 4).join(", ")}`;
  return true;
}

export function openSettingsDialog(refs: SettingsDialogRefs, settings: ExportSettings) {
  refs.savePathInput.value = settings.savePath;
  refs.patternInput.value = settings.filePattern;
  refreshSettingsPatternPreview(refs);
  if (typeof refs.dialog.showModal === "function") {
    refs.dialog.showModal();
    return;
  }
  refs.dialog.setAttribute("open", "true");
}

export function closeSettingsDialog(dialog: HTMLDialogElement) {
  if (typeof dialog.close === "function") {
    dialog.close();
    return;
  }
  dialog.removeAttribute("open");
}
