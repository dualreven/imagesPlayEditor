import assert from "node:assert/strict";
import test from "node:test";
import { resetStateForLoadedImage } from "./image-load-state-reset.ts";

test("resetStateForLoadedImage clears frames, annotations and selections", () => {
  const state = {
    annotations: new Map([["ann_1", { id: "ann_1" }]]),
    annotationCounters: { box: 3, arrow: 2, text: 1 },
    actions: new Map([["step_1", { id: "step_1" }]]),
    frames: [{ id: "frame_1", actionIds: ["step_1"] }],
    clearBeforeFrameIds: new Set(["frame_1"]),
    selectedFrameId: "frame_1",
    selectedActionId: "step_1",
    selectedAnnotationId: "ann_1",
    focusedFrameId: "frame_1"
  };

  resetStateForLoadedImage(state);

  assert.deepEqual([...state.annotations.keys()], []);
  assert.deepEqual(state.annotationCounters, { box: 0, arrow: 0, text: 0 });
  assert.deepEqual([...state.actions.keys()], []);
  assert.deepEqual(state.frames, []);
  assert.deepEqual([...state.clearBeforeFrameIds.values()], []);
  assert.equal(state.selectedFrameId, null);
  assert.equal(state.selectedActionId, null);
  assert.equal(state.selectedAnnotationId, null);
  assert.equal(state.focusedFrameId, null);
});
