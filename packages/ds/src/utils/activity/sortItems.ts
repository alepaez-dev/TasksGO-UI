import type { ActivityItem } from './types';

export type ActivitySortDirection = 'oldest' | 'newest';

export function sortItems(
  items: readonly ActivityItem[],
  direction: ActivitySortDirection,
): ActivityItem[] {
  const sign = direction === 'oldest' ? 1 : -1;
  return [...items].sort(
    (a, b) => sign * (Date.parse(a.at) - Date.parse(b.at)),
  );
}
