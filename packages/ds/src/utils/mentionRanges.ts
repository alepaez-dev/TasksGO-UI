import type { MatchRange } from './matchRanges';

const MENTION = /(^|[^\p{L}\p{N}_@])(@([\p{L}\p{N}_-]+))/gu;

export function mentionRanges(
  text: string,
  handles: readonly string[],
): MatchRange[] {
  if (handles.length === 0) return [];
  const known = new Set(handles.map((handle) => handle.toLowerCase()));
  const ranges: MatchRange[] = [];
  for (const match of text.matchAll(MENTION)) {
    const [, lead, mention, handle] = match;
    if (!known.has(handle.toLowerCase())) continue;
    const start = match.index + lead.length;
    ranges.push({ start, end: start + mention.length });
  }
  return ranges;
}
