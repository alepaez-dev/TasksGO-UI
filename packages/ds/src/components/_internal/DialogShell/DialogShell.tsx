import { forwardRef, useId, useRef, type ReactNode } from 'react';
import { Button } from '../../Button';
import { OverlayShell } from '../OverlayShell';
import { cn } from '../../../utils/cn';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { type DialogLifecycleProps } from '../../../types/dialog';
import styles from './DialogShell.module.css';

export type DialogShellTone = 'neutral' | 'warning' | 'accent';

export type DialogShellSize = 'md' | 'lg';

export interface DialogShellProps extends DialogLifecycleProps {
  icon: ReactNode;
  iconTone?: DialogShellTone;
  title: string;
  description: ReactNode;
  size?: DialogShellSize;
  confirmLabel: string;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}

export const DialogShell = forwardRef<HTMLDivElement, DialogShellProps>(
  (
    {
      open,
      icon,
      iconTone = 'neutral',
      title,
      description,
      size = 'md',
      confirmLabel,
      cancelLabel = 'Cancel',
      confirmDisabled = false,
      onCancel,
      onConfirm,
      duration = 'normal',
      forceMount = false,
      onOpened,
      onClosed,
      children,
      id: idProp,
      className,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    useFocusTrap(panelRef, open, { autoFocus: false });
    const generatedId = useId();
    const id = idProp ?? generatedId;

    const titleId = `${id}-title`;
    const descId = `${id}-desc`;

    function setRefs(node: HTMLDivElement | null) {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    }

    function handleOpened() {
      if (onOpened) {
        onOpened();
        return;
      }
      panelRef.current
        ?.querySelector<HTMLElement>('textarea, input, button')
        ?.focus();
    }

    return (
      <OverlayShell
        open={open}
        onClose={onCancel}
        duration={duration}
        forceMount={forceMount}
        onOpened={handleOpened}
        onClosed={onClosed}
      >
        {({ visible }) => (
          <div className={styles.positioner}>
            <div
              ref={setRefs}
              {...rest}
              id={id}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className={cn(
                styles.panel,
                styles[size],
                visible && styles.open,
                className,
              )}
            >
              <div className={styles.header}>
                <div className={styles.titleRow}>
                  <span
                    className={cn(styles.icon, styles[iconTone])}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  <h2 id={titleId} className={styles.title}>
                    {title}
                  </h2>
                </div>
                <p id={descId} className={styles.description}>
                  {description}
                </p>
              </div>

              {children}

              <div className={styles.footer}>
                <Button variant="secondary" onClick={onCancel}>
                  {cancelLabel}
                </Button>
                <Button
                  variant="primary"
                  disabled={confirmDisabled}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </div>
        )}
      </OverlayShell>
    );
  },
);

DialogShell.displayName = 'DialogShell';
