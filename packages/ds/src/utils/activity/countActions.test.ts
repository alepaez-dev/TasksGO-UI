import { describe, it, expect } from 'vitest';
import { countActions } from './countActions';
import { groupItems } from './groupItems';
import { CI, DEPLOY, JORDAN, event } from './testFixtures';
import type { ActivityGroup } from './types';

function groupOf(items: Parameters<typeof groupItems>[0]): ActivityGroup {
  const [node] = groupItems(items);
  if (node?.type !== 'group') throw new Error('expected a group');
  return node;
}

describe('countActions', () => {
  it('counts a person’s own actions, not the system extras inside them', () => {
    const group = groupOf([event(JORDAN, 0), event(CI, 1), event(JORDAN, 2)]);

    expect(group.items).toHaveLength(3);
    expect(countActions(group)).toBe(2);
  });

  it('counts every row of a system-only run', () => {
    // No person to attribute to, so the run's own events are the actions —
    // "4 system events", not zero.
    const group = groupOf([event(CI, 0), event(DEPLOY, 1), event(CI, 2)]);

    expect(countActions(group)).toBe(3);
  });

  it('counts a person’s run with no extras as its full length', () => {
    const group = groupOf([event(JORDAN, 0), event(JORDAN, 1)]);

    expect(countActions(group)).toBe(2);
  });
});
