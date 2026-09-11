import { describe, it, expect } from 'vitest';
import { groupItems } from './groupItems';
import type { ActivityNode } from './types';
import { ALEX, CI, DEPLOY, JORDAN, comment, event } from './testFixtures';

// Rule tests state the threshold they exercise, so retuning the default does
// not break them. Exactly one test below pins the default itself.
const GAP = 30 * 60_000;

function shape(nodes: readonly ActivityNode[]): string[] {
  return nodes.map((node) =>
    node.type === 'group'
      ? `group(${node.actor.id}:${node.items.map((i) => i.id).join(',')})`
      : `item(${node.item.id})`,
  );
}

describe('groupItems — rule 1: comments and asks never group', () => {
  it('keeps a comment standalone between two events by the same author', () => {
    const nodes = groupItems([
      event(JORDAN, 0),
      comment(JORDAN, 1),
      event(JORDAN, 2),
    ]);

    expect(shape(nodes)).toEqual(['item(jd-0)', 'item(c-jd-1)', 'item(jd-2)']);
  });

  it('breaks a run that would otherwise group', () => {
    const nodes = groupItems([
      event(JORDAN, 0),
      event(JORDAN, 1),
      comment(JORDAN, 2),
      event(JORDAN, 3),
      event(JORDAN, 4),
    ]);

    expect(shape(nodes)).toEqual([
      'group(jd:jd-0,jd-1)',
      'item(c-jd-2)',
      'group(jd:jd-3,jd-4)',
    ]);
  });
});

describe('groupItems — rule 2: a different human breaks the run', () => {
  it('splits Jordan → Alex → Jordan into two Jordan groups', () => {
    const nodes = groupItems([
      event(JORDAN, 0),
      event(JORDAN, 1),
      event(ALEX, 2),
      event(JORDAN, 3),
      event(JORDAN, 4),
    ]);

    expect(shape(nodes)).toEqual([
      'group(jd:jd-0,jd-1)',
      'item(am-2)',
      'group(jd:jd-3,jd-4)',
    ]);
  });
});

describe('groupItems — rule 3: system actors are transparent', () => {
  it('absorbs a system event into the surrounding human run', () => {
    const nodes = groupItems([
      event(JORDAN, 0),
      event(CI, 1),
      event(JORDAN, 2),
    ]);

    expect(shape(nodes)).toEqual(['group(jd:jd-0,ci-1,jd-2)']);
  });

  it('groups a system-only run under the system actor', () => {
    const nodes = groupItems([event(CI, 0), event(CI, 1), event(CI, 2)]);

    expect(shape(nodes)).toEqual(['group(ci:ci-0,ci-1,ci-2)']);
  });

  it('splits a system-only run across the gap, like any other run', () => {
    const nodes = groupItems([event(CI, 0), event(CI, 480)], { gapMs: GAP });

    expect(shape(nodes)).toEqual(['item(ci-0)', 'item(ci-480)']);
  });

  it('does not collapse system events days apart into one group', () => {
    const nodes = groupItems([event(CI, 0), event(CI, 2880)], { gapMs: GAP });

    expect(shape(nodes)).toEqual(['item(ci-0)', 'item(ci-2880)']);
  });

  // The mockup's "4 system events · CI, deploys, QA runs" group mixes a build,
  // a QA run, a deploy and an evidence upload. Splitting on actor would shatter
  // it, so system runs group by time alone.
  it('keeps different bots together when they fire close in time', () => {
    const nodes = groupItems([event(CI, 0), event(DEPLOY, 1), event(CI, 2)], {
      gapMs: GAP,
    });

    expect(shape(nodes)).toEqual(['group(ci:ci-0,deploy-1,ci-2)']);
  });
});

describe('groupItems — rule 5: a run never spans two local days', () => {
  // Day dividers file a node under one heading, so a run crossing midnight
  // would put tomorrow's event under a "Yesterday" one.
  const localAt = (day: number, hour: number, minute: number): string =>
    new Date(2026, 0, day, hour, minute).toISOString();

  const nightEvent = (id: string, iso: string) =>
    event(JORDAN, 0, { id, at: iso });

  it('splits a human run that crosses midnight', () => {
    const nodes = groupItems(
      [
        nightEvent('before', localAt(13, 23, 50)),
        nightEvent('after', localAt(14, 0, 10)),
      ],
      { gapMs: GAP },
    );

    expect(shape(nodes)).toEqual(['item(before)', 'item(after)']);
  });

  it('splits a system run that crosses midnight', () => {
    const nodes = groupItems(
      [
        { ...nightEvent('ci-before', localAt(13, 23, 50)), actor: CI },
        { ...nightEvent('ci-after', localAt(14, 0, 10)), actor: CI },
      ],
      { gapMs: GAP },
    );

    expect(shape(nodes)).toEqual(['item(ci-before)', 'item(ci-after)']);
  });

  it('still groups two events the same distance apart within one day', () => {
    const nodes = groupItems(
      [
        nightEvent('early', localAt(14, 10, 50)),
        nightEvent('late', localAt(14, 11, 10)),
      ],
      { gapMs: GAP },
    );

    expect(shape(nodes)).toEqual(['group(jd:early,late)']);
  });
});

describe('groupItems — rule 4: a gap of 30+ minutes breaks the run', () => {
  it('splits two same-author sessions an hour apart', () => {
    const nodes = groupItems(
      [
        event(JORDAN, 0),
        event(JORDAN, 1),
        event(JORDAN, 60),
        event(JORDAN, 61),
      ],
      { gapMs: GAP },
    );

    expect(shape(nodes)).toEqual([
      'group(jd:jd-0,jd-1)',
      'group(jd:jd-60,jd-61)',
    ]);
  });

  it('keeps a long run together while each step stays under the gap', () => {
    const nodes = groupItems(
      [event(JORDAN, 0), event(JORDAN, 25), event(JORDAN, 50)],
      { gapMs: GAP },
    );

    expect(shape(nodes)).toEqual(['group(jd:jd-0,jd-25,jd-50)']);
  });
});

describe('groupItems — rules 3 and 4 together', () => {
  it('does not let a system event extend a human session across the gap', () => {
    const nodes = groupItems(
      [
        event(JORDAN, 0),
        event(JORDAN, 1),
        event(CI, 20),
        event(JORDAN, 35),
        event(JORDAN, 36),
      ],
      { gapMs: GAP },
    );

    expect(shape(nodes)).toEqual([
      'group(jd:jd-0,jd-1)',
      'item(ci-20)',
      'group(jd:jd-35,jd-36)',
    ]);
  });
});

describe('groupItems — caller-configurable gap', () => {
  const SESSIONS = [event(JORDAN, 0), event(JORDAN, 45)];

  it('splits a 45-minute gap under the 30-minute default', () => {
    expect(shape(groupItems(SESSIONS))).toEqual(['item(jd-0)', 'item(jd-45)']);
  });

  it('holds the same run together when the caller widens the gap', () => {
    expect(shape(groupItems(SESSIONS, { gapMs: 60 * 60_000 }))).toEqual([
      'group(jd:jd-0,jd-45)',
    ]);
  });

  it('splits a run the default would keep when the caller narrows the gap', () => {
    const nodes = groupItems([event(JORDAN, 0), event(JORDAN, 10)], {
      gapMs: 5 * 60_000,
    });

    expect(shape(nodes)).toEqual(['item(jd-0)', 'item(jd-10)']);
  });
});

describe('groupItems — shape and edge cases', () => {
  it('returns an empty list for no items', () => {
    expect(groupItems([])).toEqual([]);
  });

  it('degrades an unparseable timestamp to a standalone event', () => {
    // One malformed row from an API must not group wrongly or throw — the feed
    // still renders, that item just keeps to itself.
    const nodes = groupItems([
      event(JORDAN, 0, { id: 'bad-a', at: 'not-a-date' }),
      event(JORDAN, 0, { id: 'bad-b', at: 'also-bad' }),
    ]);

    expect(shape(nodes)).toEqual(['item(bad-a)', 'item(bad-b)']);
  });

  it('renders a run of one as a standalone event', () => {
    expect(shape(groupItems([event(JORDAN, 0)]))).toEqual(['item(jd-0)']);
  });

  it('lists each changed field once, in first-seen order', () => {
    const nodes = groupItems([
      event(JORDAN, 0, { field: 'status' }),
      event(JORDAN, 1, { field: 'description' }),
      event(JORDAN, 2, { field: 'status' }),
    ]);

    expect(nodes).toHaveLength(1);
    const [group] = nodes;
    expect(group.type === 'group' && group.fields).toEqual([
      'status',
      'description',
    ]);
  });
});
