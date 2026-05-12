import {
  forwardRef,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { OverlayShell } from '../_internal/OverlayShell';
import { cn } from '../../utils/cn';
import { useFocusTrap, FOCUSABLE_SELECTOR } from '../../hooks/useFocusTrap';
import { useDragToDismiss } from '../../hooks/useDragToDismiss';
import { type TransitionDuration } from '../../tokens/interaction';
import styles from './BottomSheet.module.css';

type BottomSheetLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type BottomSheetProps = BottomSheetLabelProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby'> & {
    open: boolean;
    onClose: () => void;
    duration?: TransitionDuration;
    fullHeight?: boolean;
    forceMount?: boolean;
    onOpened?: () => void;
    onClosed?: () => void;
  };

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      duration = 'slow',
      fullHeight = false,
      forceMount,
      onOpened,
      onClosed,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useFocusTrap(panelRef, open, { autoFocus: false });

    const { dragY, handlers } = useDragToDismiss({
      onDismiss: onClose,
      enabled: open,
    });

    function handleOpened() {
      if (onOpened) {
        onOpened();
        return;
      }
      panelRef.current
        ?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)[0]
        ?.focus();
    }

    function setRefs(node: HTMLDivElement | null) {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    }

    const dragStyle: CSSProperties | undefined =
      dragY > 0
        ? { transform: `translateY(${dragY}px)`, transition: 'none' }
        : undefined;

    return (
      <OverlayShell
        open={open}
        onClose={onClose}
        duration={duration}
        forceMount={forceMount}
        onOpened={handleOpened}
        onClosed={onClosed}
      >
        {({ visible }) => (
          <div
            ref={setRefs}
            role="dialog"
            aria-modal="true"
            className={cn(
              styles.panel,
              visible && styles.open,
              fullHeight && styles.fullHeight,
              className,
            )}
            style={{ ...style, ...dragStyle }}
            {...rest}
            {...handlers}
          >
            <div className={styles.handle} aria-hidden="true" />
            <div className={styles.content}>{children}</div>
          </div>
        )}
      </OverlayShell>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
