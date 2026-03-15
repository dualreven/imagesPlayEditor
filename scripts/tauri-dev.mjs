import net from "node:net";
import { spawn } from "node:child_process";
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const PORT_START = 17641;
const PORT_END = 17740;

function canBind(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
  });
}

function isPortInUseWindows(port) {
  try {
    const output = execSync(
      `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Measure-Object).Count"`,
      {
        stdio: ["ignore", "pipe", "ignore"],
        encoding: "utf8"
      }
    ).trim();
    return Number(output) > 0;
  } catch {
    return false;
  }
}

async function isPortInUse(port) {
  if (process.platform === "win32") {
    return isPortInUseWindows(port);
  }
  return !(await canBind(port));
}

async function findFreePort(start, end) {
  for (let port = start; port <= end; port += 1) {
    if (!(await isPortInUse(port))) {
      return port;
    }
  }
  throw new Error(`No free port found in range ${start}-${end}.`);
}

function runTauriDev(port) {
  const root = process.cwd();
  const sourceConfigPath = path.join(root, "src-tauri", "tauri.conf.json");
  const tempConfigPath = path.join(root, "src-tauri", "tauri.auto-dev.conf.json");
  const devUrl = `http://127.0.0.1:${port}`;
  const beforeDevCommand = `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`;

  console.log(`Using dev port ${port}`);
  return fs
    .readFile(sourceConfigPath, "utf8")
    .then((raw) => JSON.parse(raw))
    .then((config) => {
      config.build = {
        ...(config.build ?? {}),
        devUrl,
        beforeDevCommand
      };
      return fs.writeFile(tempConfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    })
    .then(() => {
      const child = spawn(`npm run _tauri:dev:raw -- --config "${tempConfigPath}"`, {
        stdio: "inherit",
        shell: true
      });

      child.on("exit", (code, signal) => {
        if (signal) {
          process.kill(process.pid, signal);
          return;
        }
        process.exit(code ?? 1);
      });
    });
}

async function main() {
  const port = await findFreePort(PORT_START, PORT_END);
  await runTauriDev(port);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
