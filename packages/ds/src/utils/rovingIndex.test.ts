import { describe, it, expect } from 'vitest';
import {
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findNextEnabledIndex,
  type MaybeDisabled,
} from './rovingIndex';

const items: readonly MaybeDisabled[] = [{}, {}, {}];

describe('rovingIndex', () => {
  it('finds the first and last enabled index', () => {
    expect(findFirstEnabledIndex(items)).toBe(0);
    expect(findLastEnabledIndex(items)).toBe(2);
  });

  it('skips disabled items at the ends', () => {
    const ends: readonly MaybeDisabled[] = [
      { disabled: true },
      {},
      { disabled: true },
    ];
    expect(findFirstEnabledIndex(ends)).toBe(1);
    expect(findLastEnabledIndex(ends)).toBe(1);
  });

  it('returns -1 when nothing is enabled', () => {
    const allDisabled: readonly MaybeDisabled[] = [
      { disabled: true },
      { disabled: true },
    ];
    expect(findFirstEnabledIndex(allDisabled)).toBe(-1);
    expect(findLastEnabledIndex(allDisabled)).toBe(-1);
  });

  it('finds the next/previous enabled index with wrapping', () => {
    expect(findNextEnabledIndex(items, 0, 1)).toBe(1);
    expect(findNextEnabledIndex(items, 2, 1)).toBe(0);
    expect(findNextEnabledIndex(items, 0, -1)).toBe(2);
  });

  it('skips disabled items when stepping', () => {
    const withDisabled: readonly MaybeDisabled[] = [{}, { disabled: true }, {}];
    expect(findNextEnabledIndex(withDisabled, 0, 1)).toBe(2);
    expect(findNextEnabledIndex(withDisabled, 2, -1)).toBe(0);
  });

  it('returns the start index when no other item is enabled', () => {
    const oneEnabled: readonly MaybeDisabled[] = [
      { disabled: true },
      {},
      { disabled: true },
    ];
    expect(findNextEnabledIndex(oneEnabled, 1, 1)).toBe(1);
  });
});
