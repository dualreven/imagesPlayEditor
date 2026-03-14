import { getAppBuildInfo, openBuildHistoryFile } from "../build-info";
import { isTauriRuntime } from "../settings";
import { buildPreviewNames, validateFilePattern, type ExportSettings } from "../settings";

interface SettingsPreviewRefs {
  patternInput: HTMLInputElement;
  patternTip: HTMLParagraphElement;
  preview: HTMLParagraphElement;
}

interface SettingsDialogRefs extends SettingsPreviewRefs {
  dialog: HTMLDialogElement;
  tabButtons: HTMLButtonElement[];
  savePathInput: HTMLInputElement;
  saveBtn: HTMLButtonElement;
  versionLineMain: HTMLParagraphElement;
  versionLineDetail: HTMLParagraphElement;
  versionLineTime: HTMLParagraphElement;
  updateList: HTMLOListElement;
  historyList: HTMLOListElement;
  historyFilePath: HTMLParagraphElement;
  openHistoryBtn: HTMLButtonElement;
}

function activateSettingsTab(refs: Pick<SettingsDialogRefs, "dialog" | "tabButtons" | "saveBtn">, tabId: string) {
  refs.tabButtons.forEach((button) => {
    const active = button.dataset.settingsTab === tabId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  refs.dialog.querySelectorAll<HTMLElement>("[data-settings-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.settingsPanel === tabId);
  });
  refs.saveBtn.disabled = tabId === "version-info";
}

function renderBuildInfo(
  refs: Pick<
    SettingsDialogRefs,
    | "versionLineMain"
    | "versionLineDetail"
    | "versionLineTime"
    | "updateList"
    | "historyList"
    | "historyFilePath"
    | "openHistoryBtn"
  >
) {
  const buildInfo = getAppBuildInfo();
  refs.versionLineMain.textContent = `版本号：${buildInfo.displayVersion}`;
  refs.versionLineDetail.textContent = `Git：${buildInfo.gitHash} | Semver：${buildInfo.semverVersion}`;
  refs.versionLineTime.textContent = `生成时间：${buildInfo.updatedAt}`;
  refs.updateList.innerHTML = "";
  buildInfo.updateNotes.forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    refs.updateList.append(item);
  });
  refs.historyList.innerHTML = "";
  buildInfo.historyEntries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "setting-history-item";
    const headline = document.createElement("p");
    headline.className = "setting-history-head";
    headline.textContent = `${entry.displayVersion} | git ${entry.gitHash} | ${entry.updatedAt}`;
    const notes = document.createElement("p");
    notes.className = "setting-history-notes";
    notes.textContent = entry.updateNotes.join(" | ");
    item.append(headline, notes);
    refs.historyList.append(item);
  });
  refs.historyFilePath.textContent = `本地更新文件：${buildInfo.historyFilePath ?? "-"}`;
  refs.openHistoryBtn.disabled = !isTauriRuntime() || !buildInfo.historyFilePath;
  refs.openHistoryBtn.title = refs.openHistoryBtn.disabled ? "仅 Tauri 环境可打开本地更新文件" : "打开本地更新文件";
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
  renderBuildInfo(refs);
  activateSettingsTab(refs, "save-path");
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

export function selectSettingsTab(
  refs: Pick<SettingsDialogRefs, "dialog" | "tabButtons" | "saveBtn">,
  tabId: string
) {
  activateSettingsTab(refs, tabId);
}

export async function openLocalBuildHistoryFile() {
  await openBuildHistoryFile();
}
