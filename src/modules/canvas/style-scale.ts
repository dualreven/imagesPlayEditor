import type { AnnotationStyle } from "../models";

export interface ResolvedAnnotationStyle {
  strokeWidth: number;
  arrowLength: number;
  fontSize: number;
}

function resolvePercentLength(percent: number, referenceSize: number, minValue: number) {
  const safePercent = Number.isFinite(percent) ? percent : 0;
  return Math.max(minValue, referenceSize * (safePercent / 100));
}

export function resolveAnnotationStyle(style: AnnotationStyle, referenceSize: number): ResolvedAnnotationStyle {
  const safeReference = Math.max(1, Number.isFinite(referenceSize) ? referenceSize : 1);
  const strokeWidth = resolvePercentLength(style.strokeWidth, safeReference, 1);
  const arrowLength = Math.max(strokeWidth * 2, resolvePercentLength(style.arrowLength, safeReference, 6));
  const fontSize = resolvePercentLength(style.fontSize, safeReference, 12);
  return { strokeWidth, arrowLength, fontSize };
}
