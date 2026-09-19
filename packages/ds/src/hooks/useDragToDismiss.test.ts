import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { TouchEvent } from 'react';
import { useDragToDismiss } from './useDragToDismiss';

const DRAG_DEAD_ZONE = 8;

function touchEvent(clientY: number, target: EventTarget = document.body) {
  return {
    target,
    touches: [{ clientY }],
  } as unknown as TouchEvent<HTMLElement>;
}

function pinchEvent(...clientYs: number[]) {
  return {
    target: document.body,
    touches: clientYs.map((clientY) => ({ clientY })),
  } as unknown as TouchEvent<HTMLElement>;
}

function touchEndEvent(remaining: number[] = []) {
  return {
    target: document.body,
    touches: remaining.map((clientY) => ({ clientY })),
  } as unknown as TouchEvent<HTMLElement>;
}

describe('useDragToDismiss', () => {
  it('calls onDismiss when drag exceeds threshold', () => {
    const onDismiss = vi.fn();
    const { result } = renderHook(() =>
      useDragToDismiss({ onDismiss, enabled: true, threshold: 100 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(touchEvent(0));
      result.current.handlers.onTouchMove(touchEvent(100 + DRAG_DEAD_ZONE + 5));
      result.current.handlers.onTouchEnd(touchEndEvent());
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss when drag is below threshold', () => {
    const onDismiss = vi.fn();
    const { result } = renderHook(() =>
      useDragToDismiss({ onDismiss, enabled: true, threshold: 100 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(touchEvent(0));
      result.current.handlers.onTouchMove(touchEvent(50));
      result.current.handlers.onTouchEnd(touchEndEvent());
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss when drag is cancelled past threshold', () => {
    const onDismiss = vi.fn();
    const { result } = renderHook(() =>
      useDragToDismiss({ onDismiss, enabled: true, threshold: 100 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(touchEvent(0));
      result.current.handlers.onTouchMove(
        touchEvent(100 + DRAG_DEAD_ZONE + 20),
      );
      result.current.handlers.onTouchCancel();
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not call onDismiss on tap after interrupted drag', () => {
    const onDismiss = vi.fn();
    const { result, rerender } = renderHook(
      ({ enabled }) => useDragToDismiss({ onDismiss, enabled, threshold: 100 }),
      { initialProps: { enabled: true } },
    );

    act(() => {
      result.current.handlers.onTouchStart(touchEvent(0));
      result.current.handlers.onTouchMove(
        touchEvent(100 + DRAG_DEAD_ZONE + 20),
      );
    });

    rerender({ enabled: false });

    act(() => {
      result.current.handlers.onTouchEnd(touchEndEvent());
    });

    expect(onDismiss).not.toHaveBeenCalled();

    rerender({ enabled: true });

    act(() => {
      result.current.handlers.onTouchStart(touchEvent(200));
      result.current.handlers.onTouchEnd(touchEndEvent());
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss when a second finger joins mid-drag', () => {
    const onDismiss = vi.fn();
    const { result } = renderHook(() =>
      useDragToDismiss({ onDismiss, enabled: true, threshold: 100 }),
    );

    act(() => {
      result.current.handlers.onTouchStart(touchEvent(0));
      // a second finger lands — a pinch, not a drag
      result.current.handlers.onTouchStart(pinchEvent(0, 40));
      result.current.handlers.onTouchMove(pinchEvent(200, 40));
      // the second finger lifts first, leaving one still down
      result.current.handlers.onTouchEnd(touchEndEvent([200]));
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
