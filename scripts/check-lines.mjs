import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_DIRS = ["src", "src-tauri/src", "scripts"];
const CHECK_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".rs", ".css"]);
const EXCLUDE_DIRS = new Set(["node_modules", "dist", "target", ".git"]);
const MAX_LINES = 500;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) {
        continue;
      }
      files.push(...(await walk(entryPath)));
      continue;
    }

    const ext = path.extname(entry.name);
    if (CHECK_EXT.has(ext)) {
      files.push(entryPath);
    }
  }

  return files;
}

async function countLines(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  if (data.length === 0) {
    return 0;
  }
  return data.split(/\r?\n/u).length;
}

async function main() {
  const files = [];
  for (const folder of SOURCE_DIRS) {
    const fullPath = path.join(ROOT, folder);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        files.push(...(await walk(fullPath)));
      }
    } catch {
      // Skip missing folders to keep the script reusable.
    }
  }

  const violations = [];
  for (const file of files) {
    const lineCount = await countLines(file);
    if (lineCount > MAX_LINES) {
      violations.push({ file, lineCount });
    }
  }

  if (violations.length > 0) {
    console.error("Line count violations detected:");
    for (const item of violations) {
      const relative = path.relative(ROOT, item.file);
      console.error(`- ${relative}: ${item.lineCount} lines (max ${MAX_LINES})`);
    }
    process.exit(1);
  }

  console.log(`Line count check passed (max ${MAX_LINES} lines per file).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

