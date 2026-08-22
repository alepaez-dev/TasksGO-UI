import { forwardRef } from 'react';
import { ConfirmDialog, type ConfirmDialogPresetProps } from '../ConfirmDialog';
import styles from './WaiveScenarioDialog.module.css';

const DEFAULT_PLACEHOLDER =
  'e.g. Out of scope for this ticket; tracked separately under ENG-2871.';

export interface WaiveScenarioDialogProps extends ConfirmDialogPresetProps {
  scenarioTitle: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  reasonPlaceholder?: string;
}

export const WaiveScenarioDialog = forwardRef<
  HTMLDivElement,
  WaiveScenarioDialogProps
>(
  (
    {
      scenarioTitle,
      reason,
      onReasonChange,
      reasonPlaceholder = DEFAULT_PLACEHOLDER,
      ...rest
    },
    ref,
  ) => (
    <ConfirmDialog
      ref={ref}
      icon={<span className={styles.minus} />}
      iconTone="warning"
      title="Waive scenario"
      description={
        <>
          Waiving <strong>{scenarioTitle}</strong> skips execution. An
          explanation is required for the audit trail.
        </>
      }
      field={{
        label: 'Reason for waiving',
        value: reason,
        onChange: onReasonChange,
        placeholder: reasonPlaceholder,
        required: true,
      }}
      confirmLabel="Waive scenario"
      {...rest}
    />
  ),
);

WaiveScenarioDialog.displayName = 'WaiveScenarioDialog';
