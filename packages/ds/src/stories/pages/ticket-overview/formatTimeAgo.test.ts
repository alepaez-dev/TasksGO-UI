import { describe, it, expect } from 'vitest';
import { formatTimeAgo } from './formatTimeAgo';

const now = '2026-01-14T12:00:00.000Z';
const ago = (ms: number) => new Date(Date.parse(now) - ms).toISOString();

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe('formatTimeAgo', () => {
  it('says just now for anything under a minute', () => {
    expect(formatTimeAgo(ago(30_000), now)).toBe('just now');
  });

  it('counts whole minutes', () => {
    expect(formatTimeAgo(ago(40 * MIN), now)).toBe('40m ago');
  });

  it('counts whole hours', () => {
    expect(formatTimeAgo(ago(4 * HOUR), now)).toBe('4h ago');
  });

  it('counts whole days', () => {
    expect(formatTimeAgo(ago(3 * DAY), now)).toBe('3d ago');
  });

  it('rounds down rather than up, so nothing reads older than it is', () => {
    expect(formatTimeAgo(ago(119 * MIN), now)).toBe('1h ago');
  });

  it('never renders a raw ISO string for a future timestamp', () => {
    expect(formatTimeAgo('2026-01-14T13:00:00.000Z', now)).toBe('just now');
  });

  it('falls back to the raw value when it cannot be parsed', () => {
    expect(formatTimeAgo('not a date', now)).toBe('not a date');
  });
});
