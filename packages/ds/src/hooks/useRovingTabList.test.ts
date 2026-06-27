import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRovingTabList, type RovingTabListItem } from './useRovingTabList';

const items: readonly RovingTabListItem[] = [
  { value: 'a' },
  { value: 'b' },
  { value: 'c' },
];

describe('useRovingTabList', () => {
  it('selects the matching item and makes only it focusable', () => {
    const { result } = renderHook(() => useRovingTabList(items, 'b', () => {}));
    expect(result.current.selectedIndex).toBe(1);
    expect(result.current.focusableIndex).toBe(1);
    expect(result.current.getTabProps(1)['aria-selected']).toBe(true);
    expect(result.current.getTabProps(1).tabIndex).toBe(0);
    expect(result.current.getTabProps(0).tabIndex).toBe(-1);
    expect(result.current.getTabProps(0)['aria-selected']).toBe(false);
  });

  it('selects nothing but keeps the first item focusable when value matches none', () => {
    const { result } = renderHook(() => useRovingTabList(items, 'x', () => {}));
    expect(result.current.selectedIndex).toBe(-1);
    expect(result.current.focusableIndex).toBe(0);
  });

  it('falls back past a matched-but-disabled item to the first enabled one', () => {
    const withDisabled: readonly RovingTabListItem[] = [
      { value: 'a', disabled: true },
      { value: 'b' },
    ];
    const { result } = renderHook(() =>
      useRovingTabList(withDisabled, 'a', () => {}),
    );
    expect(result.current.selectedIndex).toBe(-1);
    expect(result.current.focusableIndex).toBe(1);
  });

  it('has no focusable item when all are disabled', () => {
    const allDisabled: readonly RovingTabListItem[] = [
      { value: 'a', disabled: true },
      { value: 'b', disabled: true },
    ];
    const { result } = renderHook(() =>
      useRovingTabList(allDisabled, 'a', () => {}),
    );
    expect(result.current.focusableIndex).toBe(-1);
  });

  it('onClick fires onValueChange only when the value differs', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useRovingTabList(items, 'a', onChange));
    result.current.getTabProps(0).onClick();
    expect(onChange).not.toHaveBeenCalled();
    result.current.getTabProps(1).onClick();
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('exposes the disabled flag through getTabProps', () => {
    const withDisabled: readonly RovingTabListItem[] = [
      { value: 'a' },
      { value: 'b', disabled: true },
    ];
    const { result } = renderHook(() =>
      useRovingTabList(withDisabled, 'a', () => {}),
    );
    expect(result.current.getTabProps(1).disabled).toBe(true);
    expect(result.current.getTabProps(0).disabled).toBeUndefined();
  });
});
