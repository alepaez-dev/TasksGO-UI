import { describe, it, expect } from 'vitest';
import { sortItems } from './sortItems';
import { JORDAN, comment, event } from './testFixtures';

const ids = (items: readonly { id: string }[]) => items.map((i) => i.id);

describe('sortItems', () => {
  const FEED = [event(JORDAN, 10), comment(JORDAN, 0), event(JORDAN, 5)];

  it('orders oldest first', () => {
    expect(ids(sortItems(FEED, 'oldest'))).toEqual(['c-jd-0', 'jd-5', 'jd-10']);
  });

  it('orders newest first', () => {
    expect(ids(sortItems(FEED, 'newest'))).toEqual(['jd-10', 'jd-5', 'c-jd-0']);
  });

  it('does not mutate the input', () => {
    const input = [event(JORDAN, 10), event(JORDAN, 0)];
    sortItems(input, 'oldest');
    expect(ids(input)).toEqual(['jd-10', 'jd-0']);
  });

  it('keeps insertion order for identical timestamps', () => {
    const a = event(JORDAN, 0, { id: 'first' });
    const b = event(JORDAN, 0, { id: 'second' });
    expect(ids(sortItems([a, b], 'oldest'))).toEqual(['first', 'second']);
  });
});
