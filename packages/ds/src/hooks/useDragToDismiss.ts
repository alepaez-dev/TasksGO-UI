import { useCallback, useRef, useState, type TouchEvent } from 'react';

// Minimum downward delta before treating the gesture as a sheet drag.
// Prevents accidental translation when the user intends to overscroll.
const DRAG_DEAD_ZONE = 8;

export interface UseDragToDismissOptions {
  onDismiss: () => void;
  enabled: boolean;
  threshold?: number;
}

export interface UseDragToDismissHandlers {
  onTouchStart: (e: TouchEvent<HTMLElement>) => void;
  onTouchMove: (e: TouchEvent<HTMLElement>) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
}

export interface UseDragToDismissReturn {
  dragY: number;
  handlers: UseDragToDismissHandlers;
}

// TODO: React synthetic touchmove events are passive, so e.preventDefault()
// is a no-op. On iOS Safari the page can rubber-band behind the sheet during
// drag. Fixing this requires attaching a non-passive native listener via
// useEffect — tracked as a future enhancement.

function isInsideScrolledContent(target: EventTarget | null): boolean {
  let el = target as HTMLElement | null;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollTop > 0) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

export function useDragToDismiss({
  onDismiss,
  enabled,
  threshold = 100,
}: UseDragToDismissOptions): UseDragToDismissReturn {
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);
  const lastDragY = useRef(0);

  if (!enabled) {
    if (dragY !== 0) setDragY(0);
    lastDragY.current = 0;
    startY.current = null;
  }

  const onTouchStart = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      if (!enabled) return;
      if (isInsideScrolledContent(e.target)) return;
      startY.current = e.touches[0].clientY;
    },
    [enabled],
  );

  const onTouchMove = useCallback(
    (e: TouchEvent<HTMLElement>) => {
      if (!enabled || startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta < DRAG_DEAD_ZONE) return;
      const clamped = delta - DRAG_DEAD_ZONE;
      lastDragY.current = clamped;
      setDragY(clamped);
    },
    [enabled],
  );

  const endDrag = useCallback(() => {
    if (!enabled || startY.current === null) return;
    startY.current = null;
    const finalY = lastDragY.current;
    lastDragY.current = 0;
    setDragY(0);
    if (finalY >= threshold) {
      onDismiss();
    }
  }, [enabled, threshold, onDismiss]);

  const cancelDrag = useCallback(() => {
    startY.current = null;
    lastDragY.current = 0;
    setDragY(0);
  }, []);

  return {
    dragY: enabled ? dragY : 0,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd: endDrag,
      onTouchCancel: cancelDrag,
    },
  };
}
