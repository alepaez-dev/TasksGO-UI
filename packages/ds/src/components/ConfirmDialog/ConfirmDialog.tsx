import { forwardRef, useId, type ReactNode } from 'react';
import { DialogShell } from '../_internal/DialogShell';
import { DialogField } from '../_internal/DialogField';
import { type DialogLifecycleProps } from '../../types/dialog';

// assignability to DialogShell's tone is checked where it is spread through
type ConfirmDialogTone = 'neutral' | 'warning';

export interface ConfirmDialogField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export interface ConfirmDialogProps extends DialogLifecycleProps {
  icon: ReactNode;
  iconTone?: ConfirmDialogTone;
  title: string;
  description: ReactNode;
  field?: ConfirmDialogField;
  confirmLabel: string;
  onConfirm: () => void;
}

export type ConfirmDialogPresetProps = Omit<
  ConfirmDialogProps,
  'icon' | 'iconTone' | 'title' | 'description' | 'field' | 'confirmLabel'
>;

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  ({ field, ...rest }, ref) => {
    const fieldId = useId();
    const confirmDisabled =
      field != null &&
      field.required === true &&
      field.value.trim().length === 0;

    return (
      <DialogShell ref={ref} {...rest} confirmDisabled={confirmDisabled}>
        {field && (
          <DialogField
            id={fieldId}
            label={field.label}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        )}
      </DialogShell>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';
