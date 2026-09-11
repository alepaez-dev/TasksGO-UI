import { describe, it, expect } from 'vitest';
import { buildSearchIndex, searchItems } from './searchItems';
import { ALEX, CI, JORDAN, ask, comment, event } from './testFixtures';

describe('buildSearchIndex — the three searchable families', () => {
  it('puts author, body and reply text under discussion', () => {
    const index = buildSearchIndex(
      comment(JORDAN, 0, {
        body: 'edge-caching strategy',
        replies: [
          {
            id: 'r1',
            at: '2026-01-14T12:00:00.000Z',
            actor: ALEX,
            body: 'fan-out',
          },
        ],
      }),
    );

    expect(index.discussion).toContain('jordan d.');
    expect(index.discussion).toContain('edge-caching strategy');
    expect(index.discussion).toContain('alex m.');
    expect(index.discussion).toContain('fan-out');
  });

  it('puts the summary, field name and both change values under fields', () => {
    const index = buildSearchIndex(
      event(JORDAN, 0, {
        summary: 'changed status',
        field: 'status',
        change: { from: 'To Do', to: 'In Progress' },
      }),
    );

    expect(index.fields).toContain('changed status');
    expect(index.fields).toContain('status');
    expect(index.fields).toContain('to do');
    expect(index.fields).toContain('in progress');
  });

  it('puts reference labels under artifacts', () => {
    const index = buildSearchIndex(
      event(CI, 0, {
        refs: [
          { type: 'file', label: 'Caching-Specs.pdf' },
          { type: 'pullRequest', label: 'PR #892' },
        ],
      }),
    );

    expect(index.artifacts).toContain('caching-specs.pdf');
    expect(index.artifacts).toContain('pr #892');
  });
});

describe('searchItems', () => {
  const FEED = [
    event(JORDAN, 0, {
      summary: 'added label',
      field: 'labels',
      change: { to: 'needs-qa' },
    }),
    comment(ALEX, 1, { body: 'looks good to me' }),
    event(CI, 2, { refs: [{ type: 'file', label: 'rate_429.png' }] }),
  ];

  it('matches across all three families from one query', () => {
    expect([...searchItems(FEED, 'needs-qa')]).toEqual(['jd-0']);
    expect([...searchItems(FEED, 'looks good')]).toEqual(['c-am-1']);
    expect([...searchItems(FEED, 'rate_429')]).toEqual(['ci-2']);
  });

  it('is case-insensitive', () => {
    expect([...searchItems(FEED, 'NEEDS-QA')]).toEqual(['jd-0']);
  });

  it('returns every id for a blank query so callers need no special case', () => {
    expect([...searchItems(FEED, '   ')]).toEqual(['jd-0', 'c-am-1', 'ci-2']);
  });

  it('returns nothing when a query matches no item', () => {
    expect([...searchItems(FEED, 'zzzz')]).toEqual([]);
  });

  it('finds an ask by the name of whoever answered it', () => {
    // "Mark as answered" sets answeredBy without leaving a reply, so the name
    // shown in "Answered by Jordan D." is the only place Jordan appears.
    const answered = ask(ALEX, 0, { id: 'q', answeredBy: JORDAN });

    expect([...searchItems([answered], 'jordan')]).toEqual(['q']);
  });

  it('matches every term of a multi-word query, in any order', () => {
    const item = comment(JORDAN, 0, { id: 'c', body: 'the cache is cold' });

    expect([...searchItems([item], 'cache cold')]).toEqual(['c']);
    expect([...searchItems([item], 'cold cache')]).toEqual(['c']);
    expect([...searchItems([item], 'cache warm')]).toEqual([]);
  });

  it('matches each term independently rather than as one substring', () => {
    // Deliberate: terms are matched separately, so a query may span the author
    // and the body. This is how issue trackers behave — not a bleed to "fix".
    const item = comment(JORDAN, 0, { id: 'c', body: 'ship it' });

    expect([...searchItems([item], 'jordan ship')]).toEqual(['c']);
  });
});
