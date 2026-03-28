import { forwardRef, useEffect, useRef, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';
import {
  transitionDurations,
  type TransitionDuration,
} from '../../tokens/interaction';
import styles from './Drawer.module.css';

type DrawerSide = 'left' | 'right';

type DrawerLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type DrawerProps = DrawerLabelProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby'> & {
    open: boolean;
    onClose: () => void;
    side?: DrawerSide;
    closeLabel?: string;
    duration?: TransitionDuration;
  };

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      side = 'left',
      closeLabel = 'Close',
      duration = 'normal',
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useFocusTrap(panelRef, open);
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

    function setRefs(node: HTMLDivElement | null) {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    }

    if (typeof document === 'undefined') return null;

    const durationStyle = {
      '--drawer-duration': transitionDurations[duration],
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
        <div
          ref={setRefs}
          role="dialog"
          aria-modal="true"
          className={cn(
            styles.panel,
            styles[side],
            open && styles.open,
            className,
          )}
          style={{ ...durationStyle, ...style }}
          {...rest}
        >
          <button
            type="button"
            className={styles.closeButton}
            aria-label={closeLabel}
            onClick={onClose}
          >
            <Icon name="close" size="sm" />
          </button>
          <div className={styles.content}>{children}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

Drawer.displayName = 'Drawer';
