import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelectorState, useSelectorGroup } from './useSelector';

function fireMouseDown(target: EventTarget) {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

describe('useSelectorState', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useSelectorState());
    expect(result.current.open).toBe(false);
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useSelectorState());
    expect(result.current.ref).toHaveProperty('current');
  });

  it('opens when onOpenChange is called with true', () => {
    const { result } = renderHook(() => useSelectorState());
    act(() => result.current.onOpenChange(true));
    expect(result.current.open).toBe(true);
  });

  it('closes when onOpenChange is called with false', () => {
    const { result } = renderHook(() => useSelectorState());
    act(() => result.current.onOpenChange(true));
    act(() => result.current.onOpenChange(false));
    expect(result.current.open).toBe(false);
  });

  it('closes on click outside when open', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const { result } = renderHook(() => useSelectorState());

    // Attach the ref
    (
      result.current.ref as React.MutableRefObject<HTMLDivElement | null>
    ).current = el;
    act(() => result.current.onOpenChange(true));

    act(() => fireMouseDown(document.body));
    expect(result.current.open).toBe(false);

    document.body.removeChild(el);
  });

  it('does not close on click inside when open', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const { result } = renderHook(() => useSelectorState());

    (
      result.current.ref as React.MutableRefObject<HTMLDivElement | null>
    ).current = el;
    act(() => result.current.onOpenChange(true));

    act(() => fireMouseDown(el));
    expect(result.current.open).toBe(true);

    document.body.removeChild(el);
  });
});

describe('useSelectorGroup', () => {
  it('returns an entry for each key', () => {
    const { result } = renderHook(() => useSelectorGroup('a', 'b', 'c'));
    expect(result.current).toHaveProperty('a');
    expect(result.current).toHaveProperty('b');
    expect(result.current).toHaveProperty('c');
  });

  it('all start closed', () => {
    const { result } = renderHook(() => useSelectorGroup('a', 'b'));
    expect(result.current.a.open).toBe(false);
    expect(result.current.b.open).toBe(false);
  });

  it('opening one closes the other', () => {
    const { result } = renderHook(() => useSelectorGroup('a', 'b'));
    act(() => result.current.a.onOpenChange(true));
    expect(result.current.a.open).toBe(true);
    expect(result.current.b.open).toBe(false);

    act(() => result.current.b.onOpenChange(true));
    expect(result.current.a.open).toBe(false);
    expect(result.current.b.open).toBe(true);
  });

  it('closing the open one leaves all closed', () => {
    const { result } = renderHook(() => useSelectorGroup('a', 'b'));
    act(() => result.current.a.onOpenChange(true));
    act(() => result.current.a.onOpenChange(false));
    expect(result.current.a.open).toBe(false);
    expect(result.current.b.open).toBe(false);
  });

  it('closes on click outside', () => {
    const elA = document.createElement('div');
    document.body.appendChild(elA);
    const { result } = renderHook(() => useSelectorGroup('a', 'b'));

    act(() => result.current.a.ref(elA));
    act(() => result.current.a.onOpenChange(true));

    act(() => fireMouseDown(document.body));
    expect(result.current.a.open).toBe(false);

    document.body.removeChild(elA);
  });

  it('does not close on click inside the open selector', () => {
    const elA = document.createElement('div');
    document.body.appendChild(elA);
    const { result } = renderHook(() => useSelectorGroup('a', 'b'));

    act(() => result.current.a.ref(elA));
    act(() => result.current.a.onOpenChange(true));

    act(() => fireMouseDown(elA));
    expect(result.current.a.open).toBe(true);

    document.body.removeChild(elA);
  });
});
