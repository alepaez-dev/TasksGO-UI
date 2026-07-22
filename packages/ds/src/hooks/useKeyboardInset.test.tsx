import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { useKeyboardInset } from './useKeyboardInset';

type Listener = () => void;

function installViewport(height: number, offsetTop = 0) {
  const listeners = new Set<Listener>();
  const vv = {
    height,
    offsetTop,
    addEventListener: (_: string, cb: Listener) => listeners.add(cb),
    removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
    set(next: { height?: number; offsetTop?: number }) {
      if (next.height !== undefined) vv.height = next.height;
      if (next.offsetTop !== undefined) vv.offsetTop = next.offsetTop;
      listeners.forEach((cb) => cb());
    },
  };
  Object.defineProperty(window, 'visualViewport', {
    value: vv,
    configurable: true,
    writable: true,
  });
  window.innerHeight = 800;
  return vv;
}

afterEach(() => {
  Object.defineProperty(window, 'visualViewport', {
    value: undefined,
    configurable: true,
    writable: true,
  });
});

describe('useKeyboardInset', () => {
  it('reports the full viewport bottom when no keyboard is open', () => {
    installViewport(800);
    const { result } = renderHook(() => useKeyboardInset());
    expect(result.current.viewportBottom).toBe(800);
  });

  it('tracks the shrunken visual viewport when the keyboard opens', () => {
    const vv = installViewport(800);
    const { result } = renderHook(() => useKeyboardInset());
    act(() => vv.set({ height: 500 }));
    // bottom edge of the visible area = top of the keyboard
    expect(result.current.viewportBottom).toBe(500);
  });

  it('accounts for a scrolled/offset visual viewport', () => {
    const vv = installViewport(800);
    const { result } = renderHook(() => useKeyboardInset());
    act(() => vv.set({ height: 500, offsetTop: 40 }));
    expect(result.current.viewportBottom).toBe(540);
  });

  it('falls back to innerHeight when visualViewport is unavailable', () => {
    Object.defineProperty(window, 'visualViewport', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    window.innerHeight = 900;
    const { result } = renderHook(() => useKeyboardInset());
    expect(result.current.viewportBottom).toBe(900);
  });
});
