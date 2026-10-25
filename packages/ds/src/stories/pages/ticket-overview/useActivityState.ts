import { useCallback, useMemo, useState } from 'react';
import {
  useActivityReactions,
  type UseActivityReactions,
  type UseActivityReactionsOptions,
} from './useActivityReactions';
import {
  buildSearchIndex,
  filterItems,
  groupItems,
  matchesQuery,
  sortItems,
  withDividers,
  type ActivityFeedNode,
  type ActivityEvent,
  type ActivityGroup,
  type ActivityItem,
  type ActivitySegment,
  type ActivitySortDirection,
} from '../../../utils/activity';

export interface ActivitySegmentCounts {
  readonly all: number;
  readonly comments: number;
  readonly events: number;
}

export interface UseActivityStateOptions {
  items: readonly ActivityItem[];
  now: string;
  viewer?: UseActivityReactionsOptions['viewer'];
}

export interface UseActivityState extends UseActivityReactions {
  segment: ActivitySegment;
  sort: ActivitySortDirection;
  query: string;
  pinnedId: string | null;
  counts: ActivitySegmentCounts;
  feed: readonly ActivityFeedNode[];
  visibleIds: readonly string[];
  matchCount: number;
  isEmpty: boolean;
  addItem: (item: ActivityItem) => void;
  isGroupOpen: (groupId: string) => boolean;
  visibleRowsOf: (group: ActivityGroup) => readonly ActivityEvent[];
  matchLabelOf: (group: ActivityGroup) => string | null;
  toggleGroup: (groupId: string) => void;
  setSegment: (segment: ActivitySegment) => void;
  setQuery: (query: string) => void;
  toggleSort: () => void;
  pin: (id: string) => void;
  clearPin: () => void;
}

function idsOf(
  nodes: readonly ActivityFeedNode[],
  matched: ReadonlySet<string> | null,
): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.type === 'item') ids.push(node.item.id);
    else if (node.type === 'group') {
      for (const item of node.items) {
        if (matched === null || matched.has(item.id)) ids.push(item.id);
      }
    }
  }
  return ids;
}

export function useActivityState({
  items,
  now,
  viewer = { id: 'viewer', name: 'You' },
}: UseActivityStateOptions): UseActivityState {
  const [segment, setSegment] = useState<ActivitySegment>('all');
  const [sort, setSort] = useState<ActivitySortDirection>('oldest');
  const [query, setQuery] = useState('');
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [groupOverrides, setGroupOverrides] = useState<
    ReadonlyMap<string, boolean>
  >(() => new Map());
  const [posted, setPosted] = useState<readonly ActivityItem[]>([]);

  const allItems = useMemo(() => [...items, ...posted], [items, posted]);

  const addItem = useCallback((item: ActivityItem) => {
    setPosted((current) => [...current, item]);
  }, []);

  const reactions = useActivityReactions({ items: allItems, viewer });

  const indexed = useMemo(
    () => allItems.map((item) => ({ item, index: buildSearchIndex(item) })),
    [allItems],
  );

  const counts = useMemo<ActivitySegmentCounts>(
    () => ({
      all: allItems.length,
      comments: filterItems(allItems, 'comments').length,
      events: filterItems(allItems, 'events').length,
    }),
    [allItems],
  );

  const matched = useMemo(() => {
    if (query.trim() === '') return null;
    return new Set(
      indexed
        .filter((entry) => matchesQuery(entry.index, query))
        .map((entry) => entry.item.id),
    );
  }, [indexed, query]);

  const feed = useMemo(() => {
    const grouped = groupItems(sortItems(filterItems(allItems, segment), sort));
    const kept =
      matched === null
        ? grouped
        : grouped.filter((node) =>
            node.type === 'group'
              ? node.items.some((item) => matched.has(item.id))
              : matched.has(node.item.id),
          );
    return withDividers(kept, { now });
  }, [allItems, segment, matched, sort, now]);

  const visibleIds = useMemo(() => idsOf(feed, matched), [feed, matched]);

  const matchedGroupIds = useMemo(() => {
    if (matched === null) return new Set<string>();
    const ids = new Set<string>();
    for (const node of feed) {
      if (
        node.type === 'group' &&
        node.items.some((item) => matched.has(item.id))
      ) {
        ids.add(node.id);
      }
    }
    return ids;
  }, [feed, matched]);

  const isGroupOpen = useCallback(
    (groupId: string) => {
      const chosen = groupOverrides.get(groupId);
      return chosen ?? matchedGroupIds.has(groupId);
    },
    [groupOverrides, matchedGroupIds],
  );

  const visibleRowsOf = useCallback(
    (group: ActivityGroup) =>
      matched === null
        ? group.items
        : group.items.filter((item) => matched.has(item.id)),
    [matched],
  );

  const matchLabelOf = useCallback(
    (group: ActivityGroup) => {
      if (matched === null) return null;
      const hits = group.items.filter((item) => matched.has(item.id)).length;
      return `${hits} of ${group.items.length} match`;
    },
    [matched],
  );

  const toggleGroup = useCallback(
    (groupId: string) => {
      const shouldOpen = !isGroupOpen(groupId);
      setGroupOverrides((current) => new Map(current).set(groupId, shouldOpen));
    },
    [isGroupOpen],
  );

  const toggleSort = useCallback(() => {
    setSort((current) => (current === 'oldest' ? 'newest' : 'oldest'));
  }, []);

  const pin = useCallback(
    (id: string) => {
      const holder = feed.find(
        (node) =>
          node.type === 'group' && node.items.some((item) => item.id === id),
      );
      if (holder?.type === 'group') {
        setGroupOverrides((current) => new Map(current).set(holder.id, true));
      }
      setPinnedId(id);
      setQuery('');
    },
    [feed],
  );

  const clearPin = useCallback(() => setPinnedId(null), []);

  return {
    segment,
    sort,
    query,
    pinnedId,
    counts,
    feed,
    visibleIds,
    matchCount: matched === null ? 0 : visibleIds.length,
    isEmpty: visibleIds.length === 0,
    addItem,
    ...reactions,
    isGroupOpen,
    toggleGroup,
    visibleRowsOf,
    matchLabelOf,
    setSegment,
    setQuery,
    toggleSort,
    pin,
    clearPin,
  };
}
