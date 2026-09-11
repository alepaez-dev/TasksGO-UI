import { describe, it, expect } from 'vitest';
import { filterItems } from './filterItems';
import { ALEX, CI, JORDAN, ask, comment, event } from './testFixtures';

const FEED = [
  event(JORDAN, 0),
  comment(JORDAN, 1),
  event(CI, 2),
  ask(ALEX, 3),
  event(ALEX, 4),
];

const ids = (items: readonly { id: string }[]) => items.map((i) => i.id);

describe('filterItems', () => {
  it('keeps everything under "all"', () => {
    expect(ids(filterItems(FEED, 'all'))).toEqual([
      'jd-0',
      'c-jd-1',
      'ci-2',
      'a-am-3',
      'am-4',
    ]);
  });

  it('keeps only comments and asks under "comments"', () => {
    expect(ids(filterItems(FEED, 'comments'))).toEqual(['c-jd-1', 'a-am-3']);
  });

  it('keeps every event under "events", whoever performed it', () => {
    expect(ids(filterItems(FEED, 'events'))).toEqual(['jd-0', 'ci-2', 'am-4']);
  });

  it('partitions the feed — comments and events are disjoint and complete', () => {
    const comments = filterItems(FEED, 'comments');
    const events = filterItems(FEED, 'events');

    expect(comments.length + events.length).toBe(FEED.length);
    expect(ids(comments).filter((id) => ids(events).includes(id))).toEqual([]);
  });
});
