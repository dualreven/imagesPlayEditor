import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import {
  assertCleanGitWorktree,
  buildBuildInfoPayload,
  getGitShortHash,
  getGitUpdateNotes,
  readBuildHistory,
  writeBuildHistory,
  writeGeneratedBuildInfo
} from "./build-info-utils.mjs";

const VERSION_ARG_FLAG = "--version";
const VERSION_ARG_SHORT = "-v";
const VERSION_PATTERN = /^(\d{2})\.(\d{2})\.(\d{2})$/;

function parseArgs(argv) {
  let versionArg = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === VERSION_ARG_FLAG || arg === VERSION_ARG_SHORT) {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("Missing version value. Use --version YY.MM.NN");
      }
      versionArg = next;
      index += 1;
      continue;
    }
    if (arg.startsWith(`${VERSION_ARG_FLAG}=`)) {
      versionArg = arg.slice(`${VERSION_ARG_FLAG}=`.length);
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return { versionArg };
}

function parseDisplayVersion(version) {
  const matched = VERSION_PATTERN.exec(version);
  if (!matched) {
    throw new Error(`Invalid version "${version}". Expected YY.MM.NN`);
  }

  const [, yy, mm, nn] = matched;
  const mmNum = Number(mm);
  const nnNum = Number(nn);
  if (mmNum < 1 || mmNum > 12) {
    throw new Error(`Invalid month in version "${version}". Month must be 01-12`);
  }
  if (nnNum < 1 || nnNum > 99) {
    throw new Error(`Invalid monthly sequence in version "${version}". Sequence must be 01-99`);
  }

  return {
    display: `${yy}.${mm}.${nn}`,
    year: yy,
    month: mm,
    seq: nn,
    semver: `${Number(yy)}.${mmNum}.${nnNum}`
  };
}

async function readVersionState(statePath) {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || typeof data.lastDisplayVersion !== "string") {
      throw new Error(`Invalid version state format in ${statePath}`);
    }
    parseDisplayVersion(data.lastDisplayVersion);
    return data;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function formatCurrentYearMonth(now = new Date()) {
  const year = String(now.getFullYear() % 100).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return { year, month };
}

function resolveDisplayVersion(versionArg, previousState) {
  if (versionArg) {
    return parseDisplayVersion(versionArg);
  }

  const { year, month } = formatCurrentYearMonth();
  let seq = 1;

  if (previousState?.lastDisplayVersion) {
    const previous = parseDisplayVersion(previousState.lastDisplayVersion);
    if (previous.year === year && previous.month === month) {
      seq = Number(previous.seq) + 1;
    }
  }

  if (seq > 99) {
    throw new Error(`Monthly sequence exceeded 99 for ${year}.${month}. Please pass --version manually.`);
  }

  const autoVersion = `${year}.${month}.${String(seq).padStart(2, "0")}`;
  return parseDisplayVersion(autoVersion);
}

async function writeBuildConfig(sourceConfigPath, tempConfigPath, semver) {
  const raw = await fs.readFile(sourceConfigPath, "utf8");
  const config = JSON.parse(raw);
  config.version = semver;
  await fs.writeFile(tempConfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return config;
}

function runTauriBuild(tempConfigPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(`npm run _tauri:build:raw -- --config "${tempConfigPath}"`, {
      stdio: "inherit",
      shell: true
    });
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`tauri build terminated by signal ${signal}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`tauri build failed with exit code ${code}`));
        return;
      }
      resolve();
    });
  });
}

async function findLatestMsi(bundleMsiDir) {
  const entries = await fs.readdir(bundleMsiDir, { withFileTypes: true });
  const msiFiles = entries.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".msi"));
  if (msiFiles.length === 0) {
    throw new Error(`No MSI file found in ${bundleMsiDir}`);
  }

  const stats = await Promise.all(
    msiFiles.map(async (entry) => ({
      name: entry.name,
      fullPath: path.join(bundleMsiDir, entry.name),
      stat: await fs.stat(path.join(bundleMsiDir, entry.name))
    }))
  );

  stats.sort((left, right) => right.stat.mtimeMs - left.stat.mtimeMs);
  return stats[0].fullPath;
}

function buildArtifactName(originalFileName, semver, displayVersion, gitHash, productName) {
  const ext = path.extname(originalFileName);
  const baseName = path.basename(originalFileName, ext);
  const marker = `_${semver}_`;

  if (baseName.includes(marker)) {
    const [prefix, suffix] = baseName.split(marker);
    return `${prefix}_${displayVersion}_git-${gitHash}_${suffix}${ext}`;
  }

  const safePrefix = productName || baseName;
  return `${safePrefix}_${displayVersion}_git-${gitHash}${ext}`;
}

async function renameArtifact(bundleMsiDir, versionInfo, gitHash, productName) {
  const latestMsiPath = await findLatestMsi(bundleMsiDir);
  const originalName = path.basename(latestMsiPath);
  const renamed = buildArtifactName(originalName, versionInfo.semver, versionInfo.display, gitHash, productName);
  const targetPath = path.join(bundleMsiDir, renamed);

  if (targetPath === latestMsiPath) {
    return { latestMsiPath, targetPath };
  }

  try {
    await fs.access(targetPath);
    throw new Error(`Target artifact already exists: ${targetPath}`);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      await fs.rename(latestMsiPath, targetPath);
      return { latestMsiPath, targetPath };
    }
    throw error;
  }
}

async function writeVersionState(statePath, versionInfo, gitHash, artifactPath, updateNotes, previousGitHash) {
  const payload = {
    lastDisplayVersion: versionInfo.display,
    lastSemverVersion: versionInfo.semver,
    lastGitHash: gitHash,
    previousGitHash: previousGitHash ?? null,
    updateNotes,
    lastArtifactPath: artifactPath,
    updatedAt: new Date().toISOString()
  };
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  const root = process.cwd();
  assertCleanGitWorktree(root);
  const args = parseArgs(process.argv.slice(2));
  const statePath = path.join(root, ".ai-temp", "memory-bank", "build-version-state.json");
  const historyPath = path.join(root, ".ai-temp", "memory-bank", "build-history.json");
  const sourceConfigPath = path.join(root, "src-tauri", "tauri.conf.json");
  const tempConfigPath = path.join(root, "src-tauri", "tauri.auto-build.conf.json");
  const bundleMsiDir = path.join(root, "src-tauri", "target", "release", "bundle", "msi");

  const previousState = await readVersionState(statePath);
  const versionInfo = resolveDisplayVersion(args.versionArg, previousState);
  const gitHash = getGitShortHash(root);
  const previousGitHash = previousState?.lastGitHash ?? null;
  const updateNotes = getGitUpdateNotes(root, previousGitHash);
  const updatedAt = new Date().toISOString();
  const historyEntries = await readBuildHistory(historyPath);

  const config = await writeBuildConfig(sourceConfigPath, tempConfigPath, versionInfo.semver);
  await writeGeneratedBuildInfo(
    root,
    buildBuildInfoPayload({
      versionInfo,
      gitHash,
      previousGitHash,
      updateNotes,
      artifactPath: previousState?.lastArtifactPath ?? null,
      updatedAt,
      historyEntries,
      historyFilePath: historyPath
    })
  );
  console.log(`Build version: ${versionInfo.display} (semver ${versionInfo.semver})`);
  console.log(`Git revision: ${gitHash}`);

  await runTauriBuild(tempConfigPath);

  const { targetPath } = await renameArtifact(bundleMsiDir, versionInfo, gitHash, config.productName);
  const nextHistoryEntries = await writeBuildHistory(historyPath, {
    displayVersion: versionInfo.display,
    semverVersion: versionInfo.semver,
    gitHash,
    previousGitHash,
    updateNotes,
    artifactPath: targetPath,
    updatedAt
  });
  await writeGeneratedBuildInfo(
    root,
    buildBuildInfoPayload({
      versionInfo,
      gitHash,
      previousGitHash,
      updateNotes,
      artifactPath: targetPath,
      updatedAt,
      historyEntries: nextHistoryEntries,
      historyFilePath: historyPath
    })
  );
  await writeVersionState(statePath, versionInfo, gitHash, targetPath, updateNotes, previousGitHash);
  console.log(`Artifact: ${targetPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
