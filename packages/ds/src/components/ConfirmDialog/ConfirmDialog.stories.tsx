import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';
import { Icon } from '../Icon';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

function Controlled({
  triggerLabel,
  fieldLabel,
  fieldPlaceholder,
  fieldRequired,
  ...props
}: Partial<ConfirmDialogProps> & {
  triggerLabel: string;
  fieldLabel?: string;
  fieldPlaceholder?: string;
  fieldRequired?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>
      <ConfirmDialog
        icon={<Icon name="schedule" size="xs" />}
        iconTone="neutral"
        title="Re-open as pending"
        description="Moving this scenario back to pending clears its verdict."
        confirmLabel="Re-open as pending"
        {...props}
        open={open}
        field={
          fieldLabel != null
            ? {
                label: fieldLabel,
                value,
                onChange: setValue,
                placeholder: fieldPlaceholder,
                required: fieldRequired,
              }
            : undefined
        }
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <Controlled triggerLabel="Re-open as pending" />,
};

export const WithRequiredField: Story = {
  render: () => (
    <Controlled
      triggerLabel="Re-open as pending"
      fieldLabel="Actual Result"
      fieldRequired
      fieldPlaceholder="Describe what actually happened"
    />
  ),
};

export const WarningTone: Story = {
  render: () => (
    <Controlled
      triggerLabel="Delete"
      icon={<Icon name="warning" size="xs" />}
      iconTone="warning"
      title="Delete scenario"
      description="This permanently removes the scenario. This cannot be undone."
      confirmLabel="Delete"
    />
  ),
};
