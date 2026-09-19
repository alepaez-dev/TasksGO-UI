import { useEffect, useRef, type RefObject } from 'react';

const SWIPE_DEAD_ZONE = 8;

const DIRECTION_LOCK_RATIO = 1.5;

// Both screen edges belong to the OS: iOS uses the left for back and the right
// for forward, and Android's gesture nav is edge-sensitive on both sides.
// Starting inboard of them avoids fighting the system gesture.
const EDGE_GUARD = 24;

export interface UseSwipeOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled: boolean;
  /** Horizontal travel, in px, required to commit. */
  threshold?: number;
  /**
   * Element to listen on. Falls back to the document, which lets a gesture
   * anywhere on the page commit — scope this whenever the caller has an
   * element that bounds the gesture.
   */
  target?: RefObject<HTMLElement | null>;
}

function isInsideHorizontalScroller(target: EventTarget | null): boolean {
  let el = target as HTMLElement | null;
  while (el) {
    const { overflowX } = getComputedStyle(el);
    if (
      (overflowX === 'auto' || overflowX === 'scroll') &&
      el.scrollWidth > el.clientWidth
    ) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

/**
 * Bind `target` to the element that bounds the gesture — for an overlay that is
 * OverlayShell's backdrop, the common parent of the close button and the panel.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  enabled,
  threshold = 56,
  target,
}: UseSwipeOptions): void {
  // consumers pass inline arrows; holding them in a ref keeps the listeners
  // from detaching and re-attaching on every render
  const handlers = useRef({ onSwipeLeft, onSwipeRight });
  useEffect(() => {
    handlers.current = { onSwipeLeft, onSwipeRight };
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (!enabled) return;
    const surface: HTMLElement | Document = target?.current ?? document;

    let startX: number | null = null;
    let startY = 0;
    let travelledX = 0;
    let locked: 'none' | 'horizontal' | 'vertical' = 'none';

    function reset() {
      startX = null;
      travelledX = 0;
      locked = 'none';
    }

    function onStart(e: TouchEvent) {
      if (e.touches.length > 1) return reset();
      const touch = e.touches[0];
      if (!touch) return;
      if (
        touch.clientX < EDGE_GUARD ||
        touch.clientX > window.innerWidth - EDGE_GUARD
      ) {
        return;
      }
      if (isInsideHorizontalScroller(e.target)) return;
      startX = touch.clientX;
      startY = touch.clientY;
      travelledX = 0;
      locked = 'none';
    }

    function onMove(e: TouchEvent) {
      if (startX === null) return;
      if (e.touches.length > 1) return reset();
      const touch = e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (locked === 'none') {
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX < SWIPE_DEAD_ZONE && absY < SWIPE_DEAD_ZONE) return;
        locked = absX > absY * DIRECTION_LOCK_RATIO ? 'horizontal' : 'vertical';
      }
      if (locked !== 'horizontal') return;
      travelledX = dx;
    }

    function onEnd(e: TouchEvent) {
      // still fingers down — this is a pinch releasing, not a swipe finishing
      if (e.touches.length > 0) return reset();
      if (locked === 'horizontal') {
        if (travelledX <= -threshold) handlers.current.onSwipeLeft();
        else if (travelledX >= threshold) handlers.current.onSwipeRight();
      }
      reset();
    }

    function onCancel() {
      reset();
    }

    const start = onStart as EventListener;
    const move = onMove as EventListener;
    const end = onEnd as EventListener;
    surface.addEventListener('touchstart', start, { passive: true });
    surface.addEventListener('touchmove', move, { passive: true });
    surface.addEventListener('touchend', end);
    surface.addEventListener('touchcancel', onCancel);
    return () => {
      surface.removeEventListener('touchstart', start);
      surface.removeEventListener('touchmove', move);
      surface.removeEventListener('touchend', end);
      surface.removeEventListener('touchcancel', onCancel);
    };
  }, [enabled, threshold, target]);
}
