import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useRovingToolbar } from './useRovingToolbar';
import type { MaybeDisabled } from '../utils/rovingIndex';

const items: readonly MaybeDisabled[] = [{}, {}, {}];

describe('useRovingToolbar', () => {
  it('makes only the active index tabbable (first by default)', () => {
    const { result } = renderHook(() => useRovingToolbar(items));
    expect(result.current.getItemProps(0).tabIndex).toBe(0);
    expect(result.current.getItemProps(1).tabIndex).toBe(-1);
    expect(result.current.getItemProps(2).tabIndex).toBe(-1);
  });

  it('moves the tabbable index when an item is focused', () => {
    const { result } = renderHook(() => useRovingToolbar(items));
    act(() => result.current.getItemProps(2).onFocus());
    expect(result.current.getItemProps(2).tabIndex).toBe(0);
    expect(result.current.getItemProps(0).tabIndex).toBe(-1);
  });

  it('falls back to the first enabled item when the active one is disabled', () => {
    const withFirstDisabled: readonly MaybeDisabled[] = [
      { disabled: true },
      {},
      {},
    ];
    const { result } = renderHook(() => useRovingToolbar(withFirstDisabled));
    expect(result.current.getItemProps(0).tabIndex).toBe(-1);
    expect(result.current.getItemProps(1).tabIndex).toBe(0);
  });

  it('makes nothing tabbable when all items are disabled', () => {
    const allDisabled: readonly MaybeDisabled[] = [
      { disabled: true },
      { disabled: true },
    ];
    const { result } = renderHook(() => useRovingToolbar(allDisabled));
    expect(result.current.getItemProps(0).tabIndex).toBe(-1);
    expect(result.current.getItemProps(1).tabIndex).toBe(-1);
  });
});
