import { forwardRef } from 'react';
import { ConfirmDialog, type ConfirmDialogProps } from '../ConfirmDialog';
import { Icon } from '../Icon';

export interface ReopenPendingDialogProps extends Omit<
  ConfirmDialogProps,
  'icon' | 'iconTone' | 'title' | 'description' | 'field' | 'confirmLabel'
> {
  scenarioTitle: string;
  actualResult: string;
  onActualResultChange: (value: string) => void;
  actualResultPlaceholder?: string;
}

export const ReopenPendingDialog = forwardRef<
  HTMLDivElement,
  ReopenPendingDialogProps
>(
  (
    {
      scenarioTitle,
      actualResult,
      onActualResultChange,
      actualResultPlaceholder,
      ...rest
    },
    ref,
  ) => (
    <ConfirmDialog
      ref={ref}
      icon={<Icon name="schedule" size="xs" />}
      iconTone="neutral"
      title="Re-open as pending"
      description={
        <>
          Moving <strong>{scenarioTitle}</strong> back to pending clears its
          verdict. Record the current actual result before re-opening.
        </>
      }
      field={{
        label: 'Actual Result',
        value: actualResult,
        onChange: onActualResultChange,
        placeholder: actualResultPlaceholder,
        required: true,
      }}
      confirmLabel="Re-open as pending"
      {...rest}
    />
  ),
);

ReopenPendingDialog.displayName = 'ReopenPendingDialog';
