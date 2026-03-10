# imagesPlayEditor

Rust + Tauri image step annotation editor.

## Scope (current)
- Project skeleton for frontend + Tauri backend
- Load image and draw annotations (box / arrow / text)
- Drag-sort timeline and insert system actions (`clear_previous`, `keep_next`)
- Annotation lock/unlock support
- Step-by-step frame export as ZIP (`step_001.png`, ...)
- Independent Git repository
- Lint/format checks
- Max 500 lines per source file check
- Public import channel for modules (`@modules` on frontend, `domain::mod.rs` on backend)

## Quick start
1. Install dependencies:
```bash
npm install
```
2. Run frontend dev server:
```bash
npm run dev
```
3. Run Tauri dev app:
```bash
npm run tauri:dev
```
4. Run full lint:
```bash
npm run lint
```
5. Build MSI with auto version + git hash in filename:
```bash
npm run tauri:build
```
6. Build MSI with manual version (`YY.MM.NN`):
```bash
npm run tauri:build -- --version 26.03.08
```

## Rules
- Keep each source file under 500 lines.
- Frontend imports from module barrel only:
  - Allowed: `import { ... } from "@modules"`
  - Avoid: deep imports like `@/modules/annotation/...`
- Rust domain modules are exported via `src-tauri/src/domain/mod.rs`.

## Build versioning
- `npm run tauri:build` now uses monthly version format: `YY.MM.NN`.
- If `--version` is omitted, it auto-continues this month's sequence from `.ai-temp/memory-bank/build-version-state.json`.
- Each build artifact filename always includes git short hash, e.g.:
  - `imagesPlayEditor_26.03.08_git-a1b2c3d_x64_en-US.msi`
- Build is failed-fast when repository has no commit (`HEAD` missing), because git revision is mandatory in artifact naming.

## Known environment limitation
- On this machine, `npm run lint:rust` may fail due Windows code integrity policy (`os error 4551`), which blocks Cargo build scripts.
