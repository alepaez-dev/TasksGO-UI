import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipe } from './useSwipe';

const THRESHOLD = 56;
const DEAD_ZONE = 8;
const EDGE_GUARD = 24;

// jsdom has TouchEvent but no Touch constructor, so the touch list is attached
// by hand. The hook only reads clientX / clientY / length, and e.target.
//
// Dispatched on document.body, not document: the hook walks up from e.target
// calling getComputedStyle, which throws on the document node — so dispatching
// there would make every gesture abort and the negative cases pass vacuously.
function touchEvent(
  type: string,
  points: readonly { x: number; y: number }[],
): Event {
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, 'touches', {
    value: points.map(({ x, y }) => ({ clientX: x, clientY: y })),
  });
  return event;
}

function at(x: number, y = 300) {
  return { x, y };
}

function render(overrides: Partial<Parameters<typeof useSwipe>[0]> = {}) {
  const onSwipeLeft = vi.fn();
  const onSwipeRight = vi.fn();
  renderHook(() =>
    useSwipe({ onSwipeLeft, onSwipeRight, enabled: true, ...overrides }),
  );
  return { onSwipeLeft, onSwipeRight };
}

/** Drags through `points`, so intermediate moves are seen as on a real device. */
function drag(...points: readonly { x: number; y: number }[]) {
  act(() => {
    document.body.dispatchEvent(touchEvent('touchstart', [points[0]]));
    for (const point of points.slice(1)) {
      document.body.dispatchEvent(touchEvent('touchmove', [point]));
    }
    document.body.dispatchEvent(touchEvent('touchend', []));
  });
}

beforeEach(() => {
  // the edge guard reads innerWidth; jsdom defaults to 1024
  window.innerWidth = 1024;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useSwipe', () => {
  it('commits left past the threshold', () => {
    const { onSwipeLeft, onSwipeRight } = render();
    drag(at(500), at(400), at(500 - THRESHOLD - 1));
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('commits right past the threshold', () => {
    const { onSwipeLeft, onSwipeRight } = render();
    drag(at(500), at(540), at(500 + THRESHOLD + 1));
    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores travel that never reaches the threshold', () => {
    const { onSwipeLeft, onSwipeRight } = render();
    drag(at(500), at(480), at(500 - THRESHOLD + 1));
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('ignores a drag that returns to where it started', () => {
    const { onSwipeLeft, onSwipeRight } = render();
    drag(at(500), at(300), at(500));
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('does not move below the dead zone', () => {
    const { onSwipeLeft, onSwipeRight } = render({ threshold: 4 });
    drag(at(500), at(500 - DEAD_ZONE + 1));
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('locks to vertical when the drag is mostly downward', () => {
    const { onSwipeLeft, onSwipeRight } = render();
    // vertical dominates at the moment the lock is decided, so later
    // horizontal travel past the threshold must not navigate
    drag({ x: 500, y: 100 }, { x: 510, y: 200 }, { x: 300, y: 260 });
    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('locks to horizontal when x beats y by the ratio', () => {
    const { onSwipeLeft } = render();
    // 40px across vs 20px down clears 1.5x, so the gesture is a swipe
    drag({ x: 500, y: 100 }, { x: 460, y: 120 }, { x: 400, y: 130 });
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('ignores a gesture starting at the left screen edge', () => {
    const { onSwipeLeft } = render();
    drag(at(EDGE_GUARD - 1), at(200), at(400));
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('ignores a gesture starting at the right screen edge', () => {
    const { onSwipeRight } = render();
    const edge = window.innerWidth - EDGE_GUARD + 1;
    drag(at(edge), at(edge - 100), at(edge - 200));
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('abandons the gesture when a second finger lands', () => {
    const { onSwipeLeft } = render();
    act(() => {
      document.body.dispatchEvent(touchEvent('touchstart', [at(500)]));
      document.body.dispatchEvent(touchEvent('touchstart', [at(500), at(520)]));
      document.body.dispatchEvent(touchEvent('touchmove', [at(300), at(520)]));
      document.body.dispatchEvent(touchEvent('touchend', [at(300)]));
    });
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('does not commit while a finger is still down', () => {
    const { onSwipeLeft } = render();
    act(() => {
      document.body.dispatchEvent(touchEvent('touchstart', [at(500)]));
      document.body.dispatchEvent(touchEvent('touchmove', [at(300)]));
      // touchend reporting a remaining touch is a pinch releasing
      document.body.dispatchEvent(touchEvent('touchend', [at(520)]));
    });
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', () => {
    const { onSwipeLeft } = render({ enabled: false });
    drag(at(500), at(400), at(300));
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('detaches its listeners on unmount', () => {
    const onSwipeLeft = vi.fn();
    const { unmount } = renderHook(() =>
      useSwipe({ onSwipeLeft, onSwipeRight: vi.fn(), enabled: true }),
    );
    unmount();
    drag(at(500), at(400), at(300));
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });
});
