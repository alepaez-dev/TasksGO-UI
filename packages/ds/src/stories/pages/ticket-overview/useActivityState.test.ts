import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivityState } from './useActivityState';
import {
  ALEX,
  CI,
  JORDAN,
  ask,
  comment,
  event,
  at,
} from '../../../utils/activity/testFixtures';
import type { ActivityItem } from '../../../utils/activity';

const items: readonly ActivityItem[] = [
  comment(JORDAN, 0, { id: 'c1', body: 'looking at edge-caching' }),
  event(JORDAN, 10, {
    id: 'e1',
    summary: 'changed status',
    field: 'status',
    change: { from: 'To Do', to: 'In Progress' },
  }),
  event(JORDAN, 12, { id: 'e1b', summary: 'updated the description' }),
  event(JORDAN, 14, { id: 'e1c', summary: 'added label edge-cache' }),
  event(CI, 20, { id: 'e2', summary: 'Build #1847 passed on QA-01' }),
  ask(ALEX, 30, { id: 'a1', body: 'what TTL are we using?' }),
];

const NOW = at(600);

const setup = () => renderHook(() => useActivityState({ items, now: NOW }));

describe('useActivityState', () => {
  it('starts on all activity, oldest first, with nothing searched or pinned', () => {
    const { result } = setup();
    expect(result.current.segment).toBe('all');
    expect(result.current.sort).toBe('oldest');
    expect(result.current.query).toBe('');
    expect(result.current.pinnedId).toBeNull();
  });

  it('counts each segment over the whole feed, not the filtered view', () => {
    const { result } = setup();
    expect(result.current.counts).toEqual({ all: 6, comments: 2, events: 4 });
    act(() => result.current.setSegment('comments'));
    expect(result.current.counts).toEqual({ all: 6, comments: 2, events: 4 });
  });

  it('narrows the feed to the chosen segment', () => {
    const { result } = setup();
    act(() => result.current.setSegment('comments'));
    expect(result.current.visibleIds).toEqual(['c1', 'a1']);
  });

  it('keeps only matches while a query is active', () => {
    const { result } = setup();
    act(() => result.current.setQuery('In Progress'));
    expect(result.current.visibleIds).toEqual(['e1']);
    expect(result.current.matchCount).toBe(1);
  });

  it('finds an event by its summary, which is how a deploy is found', () => {
    const { result } = setup();
    act(() => result.current.setQuery('Build #1847'));
    expect(result.current.visibleIds).toEqual(['e2']);
  });

  it('reverses the feed when the sort is toggled', () => {
    const { result } = setup();
    const oldest = result.current.visibleIds;
    act(() => result.current.toggleSort());
    expect(result.current.sort).toBe('newest');
    expect(result.current.visibleIds).toEqual([...oldest].reverse());
  });

  it('pinning clears the query and restores the full timeline around the pin', () => {
    const { result } = setup();
    act(() => result.current.setQuery('In Progress'));
    expect(result.current.visibleIds).toEqual(['e1']);

    act(() => result.current.pin('e1'));
    expect(result.current.pinnedId).toBe('e1');
    expect(result.current.query).toBe('');
    expect(result.current.visibleIds).toEqual([
      'c1',
      'e1',
      'e1b',
      'e1c',
      'e2',
      'a1',
    ]);
  });

  it('pins one thing at a time', () => {
    const { result } = setup();
    act(() => result.current.pin('e1'));
    act(() => result.current.pin('a1'));
    expect(result.current.pinnedId).toBe('a1');
  });

  it('clears the pin', () => {
    const { result } = setup();
    act(() => result.current.pin('e1'));
    act(() => result.current.clearPin());
    expect(result.current.pinnedId).toBeNull();
  });

  it('builds a feed with day dividers, not a bare list', () => {
    const { result } = setup();
    expect(result.current.feed.some((node) => node.type === 'dayDivider')).toBe(
      true,
    );
  });

  it('keeps groups collapsed until opened', () => {
    const { result } = setup();
    const group = result.current.feed.find((n) => n.type === 'group');
    expect(group).toBeDefined();
    if (group?.type !== 'group') return;
    expect(result.current.isGroupOpen(group.id)).toBe(false);
    act(() => result.current.toggleGroup(group.id));
    expect(result.current.isGroupOpen(group.id)).toBe(true);
  });

  it('opens a group that holds a match, so the hit is not buried', () => {
    const { result } = setup();
    act(() => result.current.setQuery('Jordan'));
    const group = result.current.feed.find((n) => n.type === 'group');
    expect(group?.type).toBe('group');
    if (group?.type !== 'group') return;
    expect(result.current.isGroupOpen(group.id)).toBe(true);
  });

  it('keeps a group at its own size while showing only the hits', () => {
    const { result } = setup();
    act(() => result.current.setQuery('In Progress'));
    const group = result.current.feed.find((n) => n.type === 'group');
    expect(group?.type).toBe('group');
    if (group?.type !== 'group') return;
    expect(group.items).toHaveLength(3);
    expect(result.current.visibleRowsOf(group)).toHaveLength(1);
    expect(result.current.matchLabelOf(group)).toBe('1 of 3 match');
  });

  it('shows every row and no match label when nothing is searched', () => {
    const { result } = setup();
    const group = result.current.feed.find((n) => n.type === 'group');
    if (group?.type !== 'group') return;
    expect(result.current.visibleRowsOf(group)).toHaveLength(3);
    expect(result.current.matchLabelOf(group)).toBeNull();
  });

  it('reports an empty feed when nothing matches', () => {
    const { result } = setup();
    act(() => result.current.setQuery('nothing matches this'));
    expect(result.current.visibleIds).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });
});

describe('useActivityState posting', () => {
  const posted = {
    kind: 'comment' as const,
    id: 'new-1',
    at: at(599),
    actor: JORDAN,
    body: 'does this actually post?',
    reactions: [],
    replies: [],
    attachments: [],
  };

  it('shows a posted comment in the feed', () => {
    const { result } = setup();
    expect(result.current.visibleIds).not.toContain('new-1');
    act(() => result.current.addItem(posted));
    expect(result.current.visibleIds).toContain('new-1');
  });

  it('counts a posted comment in the segment totals', () => {
    const { result } = setup();
    const before = result.current.counts;
    act(() => result.current.addItem(posted));
    expect(result.current.counts.all).toBe(before.all + 1);
    expect(result.current.counts.comments).toBe(before.comments + 1);
    expect(result.current.counts.events).toBe(before.events);
  });

  it('finds a posted comment by search', () => {
    const { result } = setup();
    act(() => result.current.addItem(posted));
    act(() => result.current.setQuery('actually post'));
    expect(result.current.visibleIds).toContain('new-1');
  });

  it('lets the viewer react to what they just posted', () => {
    const { result } = setup();
    act(() => result.current.addItem(posted));
    act(() => result.current.pickReaction('new-1', '🎉'));
    expect(result.current.reactionsOf('new-1')).toHaveLength(1);
  });

  it('shows a posted ask too', () => {
    const { result } = setup();
    act(() =>
      result.current.addItem({ ...posted, kind: 'ask', id: 'new-ask' }),
    );
    expect(result.current.visibleIds).toContain('new-ask');
  });
});

describe('useActivityState — the banner agrees with the feed', () => {
  it('does not count matches the active filter hides', () => {
    const { result } = setup();
    act(() => result.current.setSegment('comments'));
    act(() => result.current.setQuery('Build #1847'));

    expect(result.current.isEmpty).toBe(true);
    expect(result.current.matchCount).toBe(0);
  });

  it('still counts matches the filter keeps', () => {
    const { result } = setup();
    act(() => result.current.setSegment('comments'));
    act(() => result.current.setQuery('edge-caching'));

    expect(result.current.isEmpty).toBe(false);
    expect(result.current.matchCount).toBeGreaterThan(0);
  });
});

describe('useActivityState — collapsing a group during a search', () => {
  const groupId = 'group-e1';

  it('takes effect on the click, not after the search is cleared', () => {
    const { result } = setup();
    act(() => result.current.setQuery('description'));
    expect(result.current.isGroupOpen(groupId)).toBe(true);

    act(() => result.current.toggleGroup(groupId));
    expect(result.current.isGroupOpen(groupId)).toBe(false);
  });

  it('leaves the group closed once the search is cleared', () => {
    const { result } = setup();
    act(() => result.current.setQuery('description'));
    act(() => result.current.toggleGroup(groupId));
    act(() => result.current.setQuery(''));

    expect(result.current.isGroupOpen(groupId)).toBe(false);
  });

  it('can reopen a group it closed mid-search', () => {
    const { result } = setup();
    act(() => result.current.setQuery('description'));
    act(() => result.current.toggleGroup(groupId));
    act(() => result.current.toggleGroup(groupId));

    expect(result.current.isGroupOpen(groupId)).toBe(true);
  });
});

describe('useActivityState — pinning a row inside a group', () => {
  const groupId = 'group-e1';

  it('keeps the group open so the pinned row stays on screen', () => {
    const { result } = setup();
    act(() => result.current.setQuery('description'));
    expect(result.current.isGroupOpen(groupId)).toBe(true);

    act(() => result.current.pin('e1b'));

    expect(result.current.query).toBe('');
    expect(result.current.isGroupOpen(groupId)).toBe(true);
    expect(result.current.visibleIds).toContain('e1b');
  });

  it('leaves other groups alone', () => {
    const { result } = setup();
    act(() => result.current.setQuery('description'));
    act(() => result.current.pin('e1b'));
    expect(result.current.isGroupOpen('group-nope')).toBe(false);
  });

  it('does not open anything when the pinned row is not in a group', () => {
    const { result } = setup();
    act(() => result.current.setQuery('edge-caching'));
    act(() => result.current.pin('c1'));
    expect(result.current.isGroupOpen(groupId)).toBe(false);
    expect(result.current.visibleIds).toContain('c1');
  });
});

describe('useActivityState — grouping can be turned off', () => {
  it('groups consecutive updates by default', () => {
    const { result } = setup();
    expect(result.current.grouped).toBe(true);
    expect(result.current.feed.some((node) => node.type === 'group')).toBe(
      true,
    );
  });

  it('shows every update on its own row once grouping is off', () => {
    const { result } = setup();
    act(() => result.current.setGrouped(false));

    expect(result.current.feed.some((node) => node.type === 'group')).toBe(
      false,
    );
    for (const id of ['e1', 'e1b', 'e1c']) {
      expect(result.current.visibleIds).toContain(id);
    }
  });

  it('keeps every item visible either way', () => {
    const { result } = setup();
    const grouped = [...result.current.visibleIds].sort();
    act(() => result.current.setGrouped(false));
    expect([...result.current.visibleIds].sort()).toEqual(grouped);
  });

  it('still searches with grouping off', () => {
    const { result } = setup();
    act(() => result.current.setGrouped(false));
    act(() => result.current.setQuery('description'));
    expect(result.current.visibleIds).toEqual(['e1b']);
  });
});

describe('useActivityState — a pinned row survives a grouping change', () => {
  it('opens the group that gains the pinned row when grouping comes back on', () => {
    const { result } = setup();
    act(() => result.current.setGrouped(false));
    act(() => result.current.setQuery('description'));
    act(() => result.current.pin('e1b'));

    act(() => result.current.setGrouped(true));

    expect(result.current.isGroupOpen('group-e1')).toBe(true);
    expect(result.current.visibleIds).toContain('e1b');
  });

  it('closes again when the pin is cleared', () => {
    const { result } = setup();
    act(() => result.current.setGrouped(false));
    act(() => result.current.pin('e1b'));
    act(() => result.current.setGrouped(true));
    expect(result.current.isGroupOpen('group-e1')).toBe(true);

    act(() => result.current.clearPin());
    expect(result.current.isGroupOpen('group-e1')).toBe(false);
  });

  it('still lets the viewer close a group that holds the pin', () => {
    const { result } = setup();
    act(() => result.current.setQuery('description'));
    act(() => result.current.pin('e1b'));
    expect(result.current.isGroupOpen('group-e1')).toBe(true);

    act(() => result.current.toggleGroup('group-e1'));
    expect(result.current.isGroupOpen('group-e1')).toBe(false);
  });
});
