# Public Repo Checklist

This checklist tracks the minimum repository hygiene expected for a public GitHub project.

## Current status
- Repository visibility: public
- Remote repository: `https://github.com/dualreven/imagesPlayEditor`
- README: present and updated for public readers
- `.gitignore`: present and aligned with current build outputs
- Tracked MSI publish path: `build-artifacts/msi/`
- LICENSE: Apache-2.0 added

## Checklist
- `README.md`
  - Status: done
  - Covers project purpose, stack, requirements, quick start, build behavior, and public-repo caveat.
- `.gitignore`
  - Status: done
  - Ignores build outputs, editor folders, generated files, and common local log artifacts.
- `LICENSE`
  - Status: done
  - Repository now uses Apache-2.0.
- Release assets
  - Status: optional
  - The latest MSI is now copied into `build-artifacts/msi/` for git-based distribution.
  - Consider GitHub Releases later if repository binary growth becomes unacceptable.
- Screenshots or demo
  - Status: optional
  - Add at least one screenshot or short GIF to improve public discoverability.
- Contribution policy
  - Status: optional
  - Add `CONTRIBUTING.md` only when external contributions are expected.

## Recommended next decision
The license has been chosen. Next optional publication improvements are:
- Add a screenshot or short GIF to the README.
- Publish MSI artifacts through GitHub Releases.
- Add `CONTRIBUTING.md` only when external contributions are expected.

## Notes
- This project's build scripts depend on git metadata and a clean worktree.
- `.ai-temp/memory-bank/` is intentionally ignored from Git, but it still stores local project memory and build history.
- `tauri:build` now publishes the newest MSI into a tracked repo directory, but Git can still only push that artifact after it is committed.
