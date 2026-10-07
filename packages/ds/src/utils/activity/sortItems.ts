import type { ActivityItem } from './types';

export type ActivitySortDirection = 'oldest' | 'newest';

export function sortItems(
  items: readonly ActivityItem[],
  direction: ActivitySortDirection,
): ActivityItem[] {
  const sign = direction === 'oldest' ? 1 : -1;
  return [...items].sort((a, b) => {
    const aTime = Date.parse(a.at);
    const bTime = Date.parse(b.at);
    const aBad = Number.isNaN(aTime);
    const bBad = Number.isNaN(bTime);
    if (aBad || bBad) return Number(aBad) - Number(bBad);
    return sign * (aTime - bTime);
  });
}
