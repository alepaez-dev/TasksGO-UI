import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  transitionDurations,
  type TransitionDuration,
} from '../tokens/interaction';

export interface UseOverlayLifecycleArgs {
  open: boolean;
  duration: TransitionDuration;
  onOpened?: () => void;
  onClosed?: () => void;
}

export interface UseOverlayLifecycleResult {
  shouldRender: boolean;
  isVisible: boolean;
  backdropRef: RefObject<HTMLDivElement | null>;
}

function durationToMs(value: string): number {
  const trimmed = value.trim();
  if (trimmed.endsWith('ms')) return Number(trimmed.slice(0, -2));
  if (trimmed.endsWith('s')) return Number(trimmed.slice(0, -1)) * 1000;
  return Number(trimmed);
}

export function useOverlayLifecycle({
  open,
  duration,
  onOpened,
  onClosed,
}: UseOverlayLifecycleArgs): UseOverlayLifecycleResult {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const onOpenedRef = useRef(onOpened);
  const onClosedRef = useRef(onClosed);

  useEffect(() => {
    onOpenedRef.current = onOpened;
    onClosedRef.current = onClosed;
  });

  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setIsClosing(false);
    } else if (isVisible) {
      setIsVisible(false);
      setIsClosing(true);
    }
  }

  useEffect(() => {
    if (!open || isVisible) return;
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open, isVisible]);

  useEffect(() => {
    if (!isClosing) return;
    const node = backdropRef.current;
    const totalMs = durationToMs(transitionDurations[duration]);

    function finish() {
      setIsClosing(false);
      onClosedRef.current?.();
    }

    function handleEnd(e: TransitionEvent) {
      if (e.target !== node) return;
      if (e.propertyName !== 'opacity') return;
      cleanup();
      finish();
    }

    const fallback = window.setTimeout(() => {
      cleanup();
      finish();
    }, totalMs + 50);

    function cleanup() {
      if (node) node.removeEventListener('transitionend', handleEnd);
      window.clearTimeout(fallback);
    }

    if (node) node.addEventListener('transitionend', handleEnd);

    return cleanup;
  }, [isClosing, duration]);

  useEffect(() => {
    if (isVisible) onOpenedRef.current?.();
  }, [isVisible]);

  return { shouldRender: open || isClosing, isVisible, backdropRef };
}
