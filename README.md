# imagesPlayEditor

`imagesPlayEditor` is a Tauri-based desktop editor for turning one source image into a step-by-step annotated image sequence.

It combines a TypeScript frontend with a Rust/Tauri shell and is organized around a timeline model of actions and frames.

## Current capabilities

- Import one image as the editing source.
- Draw box, arrow, and text annotations.
- Select, move, edit, and lock annotations.
- Organize steps with actions, frames, and separators.
- Drag actions across frames and insert new frames from drop zones.
- Filter the visible frame independently from the current selection.
- Export a ZIP that includes rendered step images, frame descriptions, the original image, and the project snapshot JSON.
- Build a Windows MSI artifact with version and git hash embedded in the file name.

## Tech stack

- Frontend: TypeScript + Vite + Konva + SortableJS
- Desktop shell: Tauri 2
- Native side: Rust

## Requirements

- Node.js and npm
- Rust toolchain
- Windows build prerequisites required by Tauri for MSI packaging
- A valid git repository with at least one commit for build commands

## Quick start

1. Install dependencies.

```bash
npm install
```

2. Run the frontend-only development server.

```bash
npm run dev
```

3. Run the Tauri desktop app in development mode.

```bash
npm run tauri:dev
```

4. Run the full lint suite.

```bash
npm run lint
```

5. Build the MSI with the next automatic monthly version.

```bash
npm run tauri:build
```

6. Build the MSI with a manual version in `YY.MM.NN` format.

```bash
npm run tauri:build -- --version 26.03.08
```

7. Override the auto-commit message when the build needs to snapshot pending source changes first.

```bash
npm run tauri:build -- --commit-message "feat: refine export flow"
```

## Repository constraints

- Source files must stay under 500 lines.
- Frontend modules must be imported through the public module entry, not deep internal paths.
- Rust domain modules should be re-exported from `src-tauri/src/domain/mod.rs`.
- Build scripts follow failed-fast behavior and stop on lint/build failures, missing git history, or ambiguous git push targets.

## Build behavior

- `npm run lint` runs TypeScript lint, Rust formatting and clippy, plus the 500-line guard.
- `npm run tauri:build` runs lint first, auto-commits pending source changes when needed, then packages the app.
- Use `--commit-message "..."` to replace the default auto-commit message for source changes captured by `tauri:build`.
- After a successful `npm run tauri:build`, the current branch is pushed to its upstream remote, or to `origin` / the only configured remote when no upstream exists.
- MSI artifacts are renamed to include both display version and git short hash, for example `imagesPlayEditor_26.03.08_git-a1b2c3d_x64_en-US.msi`.
- MSI artifacts remain in `src-tauri/target/release/bundle/msi/` and are no longer copied into the repository.
- Build metadata is written to `src/generated/build-info.ts`.
- Build history and version state are persisted under `.ai-temp/memory-bank/`.

## Public repository status

- This repository is public.
- This repository is licensed under Apache-2.0.
- See [LICENSE](./LICENSE) for the full terms.

## Project notes

- [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) tracks delivery and engineering constraints.
- [PUBLIC_REPO_CHECKLIST.md](./PUBLIC_REPO_CHECKLIST.md) tracks repository hygiene items specific to public publishing.
