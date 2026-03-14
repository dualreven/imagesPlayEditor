const NEW_FRAME_DROPZONE_PREFIX = "__new_frame_dropzone__";

export function isNewFrameDropzoneId(frameId: string) {
  return frameId.startsWith(`${NEW_FRAME_DROPZONE_PREFIX}:`);
}

export function createNewFrameDropzoneId(insertIndex: number) {
  return `${NEW_FRAME_DROPZONE_PREFIX}:${insertIndex}`;
}

export function readNewFrameDropzoneInsertIndex(frameId: string) {
  if (!isNewFrameDropzoneId(frameId)) {
    return null;
  }
  const [, rawIndex] = frameId.split(":");
  const index = Number(rawIndex);
  return Number.isInteger(index) && index >= 0 ? index : null;
}
