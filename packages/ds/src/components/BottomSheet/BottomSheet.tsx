import {
  forwardRef,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { OverlayShell } from '../_internal/OverlayShell';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
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
  };

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    { open, onClose, duration = 'slow', children, className, style, ...rest },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useFocusTrap(panelRef, open);

    const { dragY, handlers } = useDragToDismiss({
      onDismiss: onClose,
      enabled: open,
    });

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
      <OverlayShell open={open} onClose={onClose} duration={duration}>
        <div
          ref={setRefs}
          role="dialog"
          aria-modal="true"
          className={cn(styles.panel, open && styles.open, className)}
          style={{ ...style, ...dragStyle }}
          {...rest}
          {...handlers}
        >
          <div className={styles.handle} aria-hidden="true" />
          <div className={styles.content}>{children}</div>
        </div>
      </OverlayShell>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
