import {
  forwardRef,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Button } from '../Button';
import { OverlayShell } from '../_internal/OverlayShell';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { type TransitionDuration } from '../../tokens/interaction';
import styles from './ConfirmDialog.module.css';

type ConfirmDialogTone = 'neutral' | 'warning';

export interface ConfirmDialogField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export interface ConfirmDialogProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'title'
> {
  open: boolean;
  icon: ReactNode;
  iconTone?: ConfirmDialogTone;
  title: string;
  description: ReactNode;
  field?: ConfirmDialogField;
  confirmLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  duration?: TransitionDuration;
  forceMount?: boolean;
  onOpened?: () => void;
  onClosed?: () => void;
}

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open,
      icon,
      iconTone = 'neutral',
      title,
      description,
      field,
      confirmLabel,
      cancelLabel = 'Cancel',
      onCancel,
      onConfirm,
      duration = 'normal',
      forceMount,
      onOpened,
      onClosed,
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
    const fieldId = `${id}-field`;
    const confirmDisabled =
      field != null &&
      field.required === true &&
      field.value.trim().length === 0;

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
              id={id}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className={cn(styles.panel, visible && styles.open, className)}
              {...rest}
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

              {field && (
                <div className={styles.field}>
                  <label
                    htmlFor={fieldId}
                    className={cn(
                      styles.label,
                      field.required && styles.required,
                    )}
                  >
                    {field.label}
                  </label>
                  <textarea
                    id={fieldId}
                    className={styles.textarea}
                    value={field.value}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </div>
              )}

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

ConfirmDialog.displayName = 'ConfirmDialog';
