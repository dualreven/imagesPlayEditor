import fs from "node:fs/promises";
import path from "node:path";
import {
  assertCleanGitWorktree,
  buildBuildInfoPayload,
  getGitShortHash,
  getGitUpdateNotes,
  readBuildHistory,
  writeGeneratedBuildInfo
} from "./build-info-utils.mjs";

async function readVersionState(statePath) {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function main() {
  const root = process.cwd();
  assertCleanGitWorktree(root);
  const statePath = path.join(root, ".ai-temp", "memory-bank", "build-version-state.json");
  const historyPath = path.join(root, ".ai-temp", "memory-bank", "build-history.json");
  const previousState = await readVersionState(statePath);
  const gitHash = getGitShortHash(root);
  const previousGitHash = previousState?.lastGitHash ?? null;
  const updateNotes = getGitUpdateNotes(root, previousGitHash);
  const historyEntries = await readBuildHistory(historyPath);

  await writeGeneratedBuildInfo(
    root,
    buildBuildInfoPayload({
      versionInfo: {
        display: previousState?.lastDisplayVersion ?? "dev",
        semver: previousState?.lastSemverVersion ?? "0.0.0"
      },
      gitHash,
      previousGitHash,
      updateNotes,
      artifactPath: previousState?.lastArtifactPath ?? null,
      updatedAt: new Date().toISOString(),
      historyEntries,
      historyFilePath: historyPath
    })
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
