import assert from "node:assert/strict";
import test from "node:test";
import { buildFrame } from "./frame-factory.ts";

test("buildFrame enables exclusive mode by default", () => {
  const sourceActionIds = ["step_1"];
  const frame = buildFrame({
    id: "frame_1",
    actionIds: sourceActionIds,
    description: "demo",
    createdAt: 123
  });

  assert.equal(frame.exclusive, true);
  assert.deepEqual(frame.actionIds, ["step_1"]);
  sourceActionIds.push("step_2");
  assert.deepEqual(frame.actionIds, ["step_1"]);
});
