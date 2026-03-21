import type { Frame } from "../models";

interface BuildFrameOptions {
  id: string;
  actionIds?: string[];
  description?: string;
  createdAt: number;
  exclusive?: boolean;
}

export function buildFrame(options: BuildFrameOptions): Frame {
  const { id, actionIds = [], description = "", createdAt, exclusive = true } = options;
  return {
    id,
    actionIds: [...actionIds],
    description,
    exclusive,
    createdAt
  };
}
