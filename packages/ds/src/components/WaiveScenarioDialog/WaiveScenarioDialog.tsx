import { forwardRef, useRef, type HTMLAttributes } from 'react';
import { Button } from '../Button';
import { OverlayShell } from '../_internal/OverlayShell';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { type TransitionDuration } from '../../tokens/interaction';
import styles from './WaiveScenarioDialog.module.css';

const DEFAULT_PLACEHOLDER =
  'e.g. Out of scope for this ticket; tracked separately under ENG-2871.';

export interface WaiveScenarioDialogProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  open: boolean;
  scenarioTitle: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  reasonPlaceholder?: string;
  duration?: TransitionDuration;
  forceMount?: boolean;
  onOpened?: () => void;
  onClosed?: () => void;
}

export const WaiveScenarioDialog = forwardRef<
  HTMLDivElement,
  WaiveScenarioDialogProps
>(
  (
    {
      open,
      scenarioTitle,
      reason,
      onReasonChange,
      onCancel,
      onConfirm,
      reasonPlaceholder = DEFAULT_PLACEHOLDER,
      duration = 'normal',
      forceMount,
      onOpened,
      onClosed,
      id = 'waive-scenario-dialog',
      className,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useFocusTrap(panelRef, open, { autoFocus: false });

    const titleId = `${id}-title`;
    const descId = `${id}-desc`;
    const reasonId = `${id}-reason`;
    const canConfirm = reason.trim().length > 0;

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
      textareaRef.current?.focus();
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
                  <span className={styles.indicator} aria-hidden="true" />
                  <h2 id={titleId} className={styles.title}>
                    Waive scenario
                  </h2>
                </div>
                <p id={descId} className={styles.description}>
                  Waiving <strong>{scenarioTitle}</strong> skips execution. An
                  explanation is required for the audit trail.
                </p>
              </div>

              <div className={styles.field}>
                <label htmlFor={reasonId} className={styles.label}>
                  Reason for waiving
                </label>
                <textarea
                  ref={textareaRef}
                  id={reasonId}
                  className={styles.textarea}
                  value={reason}
                  placeholder={reasonPlaceholder}
                  onChange={(event) => onReasonChange(event.target.value)}
                />
              </div>

              <div className={styles.footer}>
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!canConfirm}
                  onClick={onConfirm}
                >
                  Waive scenario
                </Button>
              </div>
            </div>
          </div>
        )}
      </OverlayShell>
    );
  },
);

WaiveScenarioDialog.displayName = 'WaiveScenarioDialog';
