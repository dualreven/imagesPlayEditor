import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

function resolveGitExecutable() {
  const envGit = process.env.GIT_EXE?.trim();
  if (envGit) {
    return envGit;
  }
  try {
    const output = execFileSync("where.exe", ["git"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
    const gitPath = output.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
    if (gitPath) {
      return gitPath;
    }
  } catch {
    // fall through to default binary name
  }
  return "git";
}

function runGit(args, cwd) {
  return execFileSync(resolveGitExecutable(), args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function shouldSkipCleanWorktreeCheck() {
  return process.env.ALLOW_DIRTY_WORKTREE === "1";
}

export function assertCleanGitWorktree(cwd) {
  let output = "";
  try {
    output = runGit(["status", "--porcelain", "--untracked-files=all"], cwd).trim();
  } catch (error) {
    throw new Error(`Failed to inspect git worktree: ${error instanceof Error ? error.message : error}`);
  }

  if (output && !shouldSkipCleanWorktreeCheck()) {
    throw new Error("Git worktree is dirty. Please commit or stash all changes before build, or set ALLOW_DIRTY_WORKTREE=1.");
  }
}

export function getGitShortHash(cwd) {
  let hash = "";
  try {
    hash = runGit(["rev-parse", "--short", "HEAD"], cwd).trim();
  } catch {
    throw new Error("Git HEAD not found. Please create at least one commit before build.");
  }

  if (!hash) {
    throw new Error("Failed to read git short hash.");
  }
  return hash;
}

export function getGitUpdateNotes(cwd, previousGitHash) {
  const fromHash = typeof previousGitHash === "string" ? previousGitHash.trim() : "";
  try {
    const args = fromHash ? ["log", "--format=%h %s", `${fromHash}..HEAD`] : ["log", "--format=%h %s", "HEAD"];
    const output = runGit(args, cwd).trim();
    if (!output) {
      return ["No git commits since previous version."];
    }
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    throw new Error(`Failed to read git update notes: ${error instanceof Error ? error.message : error}`);
  }
}

function toGeneratedModuleContent(payload) {
  return `export const BUILD_INFO = ${JSON.stringify(payload, null, 2)};\n`;
}

export async function writeGeneratedBuildInfo(root, payload) {
  const generatedDir = path.join(root, "src", "generated");
  const targetPath = path.join(generatedDir, "build-info.ts");
  await fs.mkdir(generatedDir, { recursive: true });
  await fs.writeFile(targetPath, toGeneratedModuleContent(payload), "utf8");
  return targetPath;
}

export async function readBuildHistory(historyPath) {
  try {
    const raw = await fs.readFile(historyPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.entries)) {
      throw new Error(`Invalid build history format in ${historyPath}`);
    }
    return parsed.entries;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function sortHistoryEntries(entries) {
  return [...entries].sort((left, right) => {
    const leftTime = Date.parse(left.updatedAt ?? "");
    const rightTime = Date.parse(right.updatedAt ?? "");
    return rightTime - leftTime;
  });
}

export async function writeBuildHistory(historyPath, entry) {
  const history = await readBuildHistory(historyPath);
  const deduped = history.filter(
    (item) => !(item.displayVersion === entry.displayVersion && item.gitHash === entry.gitHash)
  );
  const entries = sortHistoryEntries([entry, ...deduped]);
  await fs.mkdir(path.dirname(historyPath), { recursive: true });
  await fs.writeFile(historyPath, `${JSON.stringify({ entries }, null, 2)}\n`, "utf8");
  return entries;
}

export function buildBuildInfoPayload({
  versionInfo,
  gitHash,
  previousGitHash,
  updateNotes,
  artifactPath,
  updatedAt,
  historyEntries,
  historyFilePath
}) {
  return {
    displayVersion: versionInfo.display,
    semverVersion: versionInfo.semver,
    gitHash,
    previousGitHash,
    updateNotes,
    artifactPath,
    updatedAt,
    historyFilePath,
    historyEntries: sortHistoryEntries(historyEntries).slice(0, 20)
  };
}
