import assert from "node:assert/strict";
import test from "node:test";
import { buildAutoCommitMessage, resolveGitPushArgs } from "./build-info-utils.mjs";

test("buildAutoCommitMessage uses the build snapshot convention", () => {
  const message = buildAutoCommitMessage("26.03.10");

  assert.equal(message.title, "build: prepare source snapshot for 26.03.10");
  assert.match(message.body, /pushed git revision/i);
});

test("resolveGitPushArgs uses the configured upstream when present", () => {
  const args = resolveGitPushArgs({
    branchName: "master",
    upstreamBranch: "origin/master",
    remotes: ["origin"]
  });

  assert.deepEqual(args, ["push"]);
});

test("resolveGitPushArgs prefers origin for a branch without upstream", () => {
  const args = resolveGitPushArgs({
    branchName: "release",
    upstreamBranch: null,
    remotes: ["backup", "origin"]
  });

  assert.deepEqual(args, ["push", "-u", "origin", "release"]);
});

test("resolveGitPushArgs falls back to the only remote", () => {
  const args = resolveGitPushArgs({
    branchName: "release",
    upstreamBranch: null,
    remotes: ["mirror"]
  });

  assert.deepEqual(args, ["push", "-u", "mirror", "release"]);
});

test("resolveGitPushArgs fails fast when no remote can be chosen", () => {
  assert.throws(
    () =>
      resolveGitPushArgs({
        branchName: "release",
        upstreamBranch: null,
        remotes: ["backup", "mirror"]
      }),
    /Cannot choose a git remote automatically/
  );
});
