import type { ActivityItem } from './types';

export type ActivitySegment = 'all' | 'comments' | 'events';

export function filterItems(
  items: readonly ActivityItem[],
  segment: ActivitySegment,
): ActivityItem[] {
  if (segment === 'all') return [...items];
  return items.filter((item) =>
    segment === 'comments' ? item.kind !== 'event' : item.kind === 'event',
  );
}
