import { describe, it, expect } from 'vitest';
import { withDividers } from './withDividers';
import type { ActivityFeedNode, ActivityNode } from './types';
import { JORDAN, at, event } from './testFixtures';

function itemNode(minutes: number): ActivityNode {
  return { type: 'item', item: event(JORDAN, minutes) };
}

const HOUR = 60;
const DAY = 24 * HOUR;

function groupNode(minutes: readonly number[]): ActivityNode {
  const items = minutes.map((m) => event(JORDAN, m));
  return {
    type: 'group',
    id: `group-${items[0].id}`,
    actor: JORDAN,
    items,
    fields: ['status'],
  };
}

function shape(nodes: readonly ActivityFeedNode[]): string[] {
  return nodes.map((node) => {
    if (node.type === 'dayDivider') return `day(${node.relative ?? 'other'})`;
    if (node.type === 'gapDivider')
      return `gap(${(node.durationMs / 3_600_000).toFixed(2)}h)`;
    if (node.type === 'group') return `group(${node.items[0].id})`;
    return `item(${node.item.id})`;
  });
}

describe('withDividers — day dividers', () => {
  it('opens the feed with a day divider', () => {
    const nodes = withDividers([itemNode(0)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual(['day(today)', 'item(jd-0)']);
  });

  it('labels the previous day as yesterday', () => {
    const nodes = withDividers([itemNode(-DAY), itemNode(0)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual([
      'day(yesterday)',
      'item(jd--1440)',
      'day(today)',
      'item(jd-0)',
    ]);
  });

  it('leaves older days unlabelled', () => {
    const nodes = withDividers([itemNode(-5 * DAY)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual(['day(other)', 'item(jd--7200)']);
  });
});

describe('withDividers — gap dividers', () => {
  it('marks a long gap within a single day', () => {
    const nodes = withDividers([itemNode(0), itemNode(6 * HOUR)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual([
      'day(today)',
      'item(jd-0)',
      'gap(6.00h)',
      'item(jd-360)',
    ]);
  });

  it('leaves short gaps alone', () => {
    const nodes = withDividers([itemNode(0), itemNode(30)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual(['day(today)', 'item(jd-0)', 'item(jd-30)']);
  });

  it('does not stack a gap divider onto a day boundary', () => {
    const nodes = withDividers([itemNode(-DAY), itemNode(0)], {
      now: at(0),
    });

    expect(shape(nodes).filter((s) => s.startsWith('gap'))).toEqual([]);
  });
});

describe('withDividers — gaps are measured from a group’s trailing edge', () => {
  it('ignores a gap that only looks long because the group is wide', () => {
    // Group spans 0–50; next item at 260. The real gap is 3.5h, under the
    // 4h default — measuring from the group's start would report 4.33h.
    const nodes = withDividers([groupNode([0, 25, 50]), itemNode(260)], {
      now: at(0),
    });

    expect(shape(nodes).filter((s) => s.startsWith('gap'))).toEqual([]);
  });

  it('reports the true distance when the gap is genuinely long', () => {
    // 50 → 320 is 4.5h, not the 5.33h a start-anchored measure would claim.
    const nodes = withDividers([groupNode([0, 25, 50]), itemNode(320)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual([
      'day(today)',
      'group(jd-0)',
      'gap(4.50h)',
      'item(jd-320)',
    ]);
  });
});

describe('withDividers — caller-configurable gap', () => {
  const TWO_HOURS = [itemNode(0), itemNode(2 * HOUR)];

  it('stays silent about a 2-hour gap under the 4-hour default', () => {
    expect(shape(withDividers(TWO_HOURS, { now: at(0) }))).toEqual([
      'day(today)',
      'item(jd-0)',
      'item(jd-120)',
    ]);
  });

  it('marks the same gap when the caller lowers the threshold', () => {
    const nodes = withDividers(TWO_HOURS, {
      now: at(0),
      gapMs: 60 * 60_000,
    });

    expect(shape(nodes)).toEqual([
      'day(today)',
      'item(jd-0)',
      'gap(2.00h)',
      'item(jd-120)',
    ]);
  });
});

describe('withDividers — sort direction and edges', () => {
  it('still emits dividers newest-first, in reverse order', () => {
    const nodes = withDividers([itemNode(0), itemNode(-DAY)], {
      now: at(0),
    });

    expect(shape(nodes)).toEqual([
      'day(today)',
      'item(jd-0)',
      'day(yesterday)',
      'item(jd--1440)',
    ]);
  });

  it('returns nothing for an empty feed', () => {
    expect(withDividers([], { now: at(0) })).toEqual([]);
  });
});
