import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  clearScreen: false,
  envPrefix: ["VITE_", "TAURI_"],
  server: {
    port: 17641,
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(currentDir, "src"),
      "@modules": path.resolve(currentDir, "src/modules/index.ts")
    }
  }
});
