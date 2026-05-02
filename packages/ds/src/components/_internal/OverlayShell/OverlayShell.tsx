import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import { useScrollLock } from '../../../hooks/useScrollLock';
import {
  transitionDurations,
  type TransitionDuration,
} from '../../../tokens/interaction';
import styles from './OverlayShell.module.css';

export interface OverlayShellProps {
  open: boolean;
  onClose: () => void;
  duration?: TransitionDuration;
  children: ReactNode;
}

export function OverlayShell({
  open,
  onClose,
  duration = 'normal',
  children,
}: OverlayShellProps) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  const durationStyle = {
    '--ds-overlay-duration': transitionDurations[duration],
  } as React.CSSProperties;

  return createPortal(
    <div
      className={cn(styles.backdrop, open && styles.open)}
      style={durationStyle}
    >
      <button
        type="button"
        className={styles.backdropClose}
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />
      {children}
    </div>,
    document.body,
  );
}
