import { forwardRef, useId, useRef, type ReactNode } from 'react';
import { Button } from '../../Button';
import { BottomSheet } from '../../BottomSheet';
import { IconButton } from '../../IconButton';
import { OverlayShell } from '../OverlayShell';
import { cn } from '../../../utils/cn';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import {
  type DialogLifecycleProps,
  type DialogPresentation,
} from '../../../types/dialog';
import styles from './DialogShell.module.css';

export type DialogShellTone = 'neutral' | 'warning' | 'accent';

export type DialogShellSize = 'md' | 'lg';

export interface DialogShellProps extends DialogLifecycleProps {
  /** Dialog presentation only — sheets render no icon badge. */
  icon: ReactNode;
  /** Dialog presentation only. */
  iconTone?: DialogShellTone;
  title: string;
  description: ReactNode;
  /** Dialog presentation only — sheets are always full-width. */
  size?: DialogShellSize;
  presentation?: DialogPresentation;
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
      presentation = 'dialog',
      confirmLabel,
      cancelLabel = 'Cancel',
      confirmDisabled = false,
      onCancel,
      onConfirm,
      duration,
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
    const isSheet = presentation === 'sheet';
    const panelRef = useRef<HTMLDivElement>(null);
    // in sheet mode BottomSheet owns the trap on this same node
    useFocusTrap(panelRef, open && !isSheet, { autoFocus: false });
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
      const panel = panelRef.current;
      (
        panel?.querySelector<HTMLElement>('textarea, input') ??
        panel?.querySelector<HTMLElement>('button')
      )?.focus();
    }

    const resolvedDuration = duration ?? (isSheet ? 'slow' : 'normal');

    const footer = (
      <div className={cn(styles.footer, isSheet && styles.sheetFooter)}>
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
    );

    if (isSheet) {
      return (
        <BottomSheet
          ref={setRefs}
          {...rest}
          id={id}
          open={open}
          onClose={onCancel}
          duration={resolvedDuration}
          forceMount={forceMount}
          onOpened={handleOpened}
          onClosed={onClosed}
          aria-labelledby={titleId}
          aria-describedby={descId}
          className={className}
        >
          <div className={styles.sheetHeader}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <IconButton
              icon="close"
              size="sm"
              aria-label="Close"
              onClick={onCancel}
            />
          </div>
          <p id={descId} className={styles.sheetDescription}>
            {description}
          </p>
          {children}
          {footer}
        </BottomSheet>
      );
    }

    return (
      <OverlayShell
        open={open}
        onClose={onCancel}
        duration={resolvedDuration}
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

              {footer}
            </div>
          </div>
        )}
      </OverlayShell>
    );
  },
);

DialogShell.displayName = 'DialogShell';
