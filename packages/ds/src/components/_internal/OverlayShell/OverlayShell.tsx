import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useOverlayLifecycle } from '../../../hooks/useOverlayLifecycle';
import {
  transitionDurations,
  type TransitionDuration,
} from '../../../tokens/interaction';
import styles from './OverlayShell.module.css';

export interface OverlayShellRenderState {
  visible: boolean;
}

export type OverlayShellChildren =
  | ReactNode
  | ((state: OverlayShellRenderState) => ReactNode);

export interface OverlayShellProps {
  open: boolean;
  onClose: () => void;
  duration?: TransitionDuration;
  forceMount?: boolean;
  onOpened?: () => void;
  onClosed?: () => void;
  children: OverlayShellChildren;
}

export function OverlayShell({
  open,
  onClose,
  duration = 'normal',
  forceMount = false,
  onOpened,
  onClosed,
  children,
}: OverlayShellProps) {
  const { shouldRender, isVisible, backdropRef } = useOverlayLifecycle({
    open,
    duration,
    onOpened,
    onClosed,
  });

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // Only the topmost overlay responds, so Escape never closes a lower
      // overlay through one stacked above it. Every backdrop portals to
      // <body> at the same z-index, so the last open one in document order
      // is the one painted on top.
      const openBackdrops = document.querySelectorAll(
        '[data-ds-overlay="open"]',
      );
      if (backdropRef.current !== openBackdrops[openBackdrops.length - 1]) {
        return;
      }
      e.preventDefault();
      onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, backdropRef]);

  if (typeof document === 'undefined') return null;
  if (!shouldRender && !forceMount) return null;

  const durationStyle = {
    '--ds-overlay-duration': transitionDurations[duration],
  } as React.CSSProperties;

  const renderedChildren =
    typeof children === 'function'
      ? children({ visible: isVisible })
      : children;

  return createPortal(
    <div
      ref={backdropRef}
      data-ds-overlay={open ? 'open' : undefined}
      className={cn(styles.backdrop, isVisible && styles.open)}
      style={durationStyle}
    >
      <button
        type="button"
        className={styles.backdropClose}
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />
      {renderedChildren}
    </div>,
    document.body,
  );
}
