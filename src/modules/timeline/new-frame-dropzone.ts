export const NEW_FRAME_DROPZONE_ID = "__new_frame_dropzone__";

export function isNewFrameDropzoneId(frameId: string) {
  return frameId === NEW_FRAME_DROPZONE_ID;
}
