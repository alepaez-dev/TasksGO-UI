import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

function fireMouseDown(target: EventTarget) {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

describe('useClickOutside', () => {
  it('calls handler when clicking outside the ref element', () => {
    const handler = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ref = { current: el };

    renderHook(() => useClickOutside(ref, handler));
    fireMouseDown(document.body);

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(el);
  });

  it('does not call handler when clicking inside the ref element', () => {
    const handler = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ref = { current: el };

    renderHook(() => useClickOutside(ref, handler));
    fireMouseDown(el);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it('does not call handler when active is false', () => {
    const handler = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ref = { current: el };

    renderHook(() => useClickOutside(ref, handler, false));
    fireMouseDown(document.body);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it('cleans up listener on unmount', () => {
    const handler = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ref = { current: el };

    const { unmount } = renderHook(() => useClickOutside(ref, handler));
    unmount();
    fireMouseDown(document.body);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });
});
