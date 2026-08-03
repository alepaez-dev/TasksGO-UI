import { describe, it, expect } from 'vitest';
import { filterPullRequests } from './filterPullRequests';
import type { DevPullRequest } from './shared';

const pr = (over: Partial<DevPullRequest>): DevPullRequest => ({
  id: 'pr-1',
  number: '#101',
  title: 'feat: caching layer',
  href: 'https://example.com/pull/101',
  state: 'open',
  author: 'Jordan D.',
  when: '2h ago',
  checks: 'Checks passed',
  reviewer: { initial: 'AM', color: '#000' },
  ...over,
});

const list = [
  pr({
    id: 'a',
    number: '#892',
    title: 'feat: edge caching',
    author: 'Jordan D.',
  }),
  pr({
    id: 'b',
    number: '#884',
    title: 'refactor: header helpers',
    author: 'Sam K.',
  }),
];

describe('filterPullRequests', () => {
  it('returns every pull request for an empty query', () => {
    expect(filterPullRequests(list, '')).toHaveLength(2);
  });

  it('returns every pull request for a whitespace-only query', () => {
    expect(filterPullRequests(list, '   ')).toHaveLength(2);
  });

  it('matches on title, case-insensitively', () => {
    expect(filterPullRequests(list, 'EDGE')).toEqual([list[0]]);
  });

  it('matches on pull request number', () => {
    expect(filterPullRequests(list, '884')).toEqual([list[1]]);
  });

  it('matches on author', () => {
    expect(filterPullRequests(list, 'sam')).toEqual([list[1]]);
  });

  it('returns nothing when no pull request matches', () => {
    expect(filterPullRequests(list, 'zzz')).toEqual([]);
  });
});
