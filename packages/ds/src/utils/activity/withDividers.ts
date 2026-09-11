import type {
  ActivityFeedNode,
  ActivityNode,
  ActivityRelativeDay,
} from './types';
import { toLocalDayNumber } from './localDay';

/** Default only — callers override per feed via `withDividers(nodes, { gapMs })`. */
export const GAP_DIVIDER_MS = 4 * 60 * 60 * 1000;

export interface WithDividersOptions {
  readonly now: string;
  readonly gapMs?: number;
}

function nodeStart(node: ActivityNode): string {
  return node.type === 'item' ? node.item.at : node.items[0].at;
}

function nodeEnd(node: ActivityNode): string {
  return node.type === 'item'
    ? node.item.at
    : node.items[node.items.length - 1].at;
}

function relativeDay(iso: string, now: string): ActivityRelativeDay | null {
  const delta = toLocalDayNumber(now) - toLocalDayNumber(iso);
  if (delta === 0) return 'today';
  if (delta === 1) return 'yesterday';
  return null;
}

export function withDividers(
  nodes: readonly ActivityNode[],
  { now, gapMs = GAP_DIVIDER_MS }: WithDividersOptions,
): ActivityFeedNode[] {
  const feed: ActivityFeedNode[] = [];
  let previousAt: string | null = null;

  for (const node of nodes) {
    const at = nodeStart(node);

    if (
      previousAt === null ||
      toLocalDayNumber(at) !== toLocalDayNumber(previousAt)
    ) {
      feed.push({ type: 'dayDivider', at, relative: relativeDay(at, now) });
    } else {
      // Only within a day: across one, the day divider already marks the break.
      const gap = Math.abs(Date.parse(at) - Date.parse(previousAt));
      if (gap >= gapMs) {
        feed.push({ type: 'gapDivider', durationMs: gap });
      }
    }

    feed.push(node);
    previousAt = nodeEnd(node);
  }

  return feed;
}
