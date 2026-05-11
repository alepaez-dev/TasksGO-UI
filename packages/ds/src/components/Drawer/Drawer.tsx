import { forwardRef, useRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { OverlayShell } from '../_internal/OverlayShell';
import { cn } from '../../utils/cn';
import { useFocusTrap, FOCUSABLE_SELECTOR } from '../../hooks/useFocusTrap';
import { type TransitionDuration } from '../../tokens/interaction';
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
    forceMount?: boolean;
    onOpened?: () => void;
    onClosed?: () => void;
  };

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      side = 'left',
      closeLabel = 'Close',
      duration = 'normal',
      forceMount,
      onOpened,
      onClosed,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useFocusTrap(panelRef, open, { autoFocus: false });

    function setRefs(node: HTMLDivElement | null) {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    }

    function handleOpened() {
      const focusables =
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusables?.[0]?.focus();
      onOpened?.();
    }

    return (
      <OverlayShell
        open={open}
        onClose={onClose}
        duration={duration}
        forceMount={forceMount}
        onOpened={handleOpened}
        onClosed={onClosed}
      >
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
          {...rest}
        >
          <div className={styles.content}>
            <button
              type="button"
              className={styles.closeButton}
              aria-label={closeLabel}
              onClick={onClose}
            >
              <Icon name="close" size="sm" />
            </button>
            {children}
          </div>
        </div>
      </OverlayShell>
    );
  },
);

Drawer.displayName = 'Drawer';
