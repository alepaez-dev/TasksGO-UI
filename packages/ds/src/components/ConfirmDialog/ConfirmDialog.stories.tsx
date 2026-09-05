import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';
import { Icon } from '../Icon';
import { mobileSheetStory } from '../../../.storybook/decorators';

const LONG_DESCRIPTION = [
  'Moving this scenario back to pending clears its verdict, so the recorded pass or fail is discarded and the audit trail keeps only the transition itself. The previous actual result stays readable on the timeline, but it no longer counts toward the passing total shown on the ticket, and the QA summary recalculates as soon as the change is saved.',
  'Anyone re-running it must capture a fresh actual result against the current build. Results copied from an earlier deployment are not accepted, because gateway behaviour changes between builds and a stale observation can mask a regression that only appears once the new cache headers are live. The build identifier is recorded alongside the result for this reason.',
  'If the scenario was waived, the waive reason is preserved on the timeline but no longer applies, and a reviewer is asked to confirm the re-open before the ticket can leave QA. Waived scenarios that are re-opened and then waived again within the same window keep both reasons, so the history shows why the decision changed rather than only the latest state.',
  'Scenarios re-opened more than twice in one deployment window are flagged for triage, since repeated re-opens usually indicate the expected result itself needs rewriting rather than the implementation being wrong. Triage does not block the ticket, but it does add a note that the reviewer sees when they next open the QA tab.',
  'Evidence attached to the previous run is kept and stays downloadable. It is not carried into the new run, because evidence is scoped to the result that produced it; attaching it again is a deliberate step so that screenshots from an older build are never mistaken for current ones.',
  'None of this applies to scenarios that have never been run. Those are already pending, so re-opening them is a no-op and this dialog will not be offered for them in the first place.',
];

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

export const Sheet: Story = {
  ...mobileSheetStory,
  render: () => (
    <Controlled
      triggerLabel="Re-open as pending"
      presentation="sheet"
      fieldLabel="Actual Result"
      fieldRequired
      fieldPlaceholder="Describe what actually happened"
    />
  ),
};

export const Overflowing: Story = {
  name: 'Overflowing (panel scrolls, stays in viewport)',
  render: () => (
    <Controlled
      triggerLabel="Re-open as pending"
      description={
        <>
          {LONG_DESCRIPTION.map((paragraph, index) => (
            <span key={index}>
              {paragraph}
              <br />
              <br />
            </span>
          ))}
        </>
      }
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
