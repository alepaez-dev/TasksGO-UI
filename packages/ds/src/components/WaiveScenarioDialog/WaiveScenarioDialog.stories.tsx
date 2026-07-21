import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  WaiveScenarioDialog,
  type WaiveScenarioDialogProps,
} from './WaiveScenarioDialog';

const meta: Meta<typeof WaiveScenarioDialog> = {
  title: 'Components/WaiveScenarioDialog',
  component: WaiveScenarioDialog,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof WaiveScenarioDialog>;

function Controlled({
  initialReason = '',
  ...props
}: Partial<WaiveScenarioDialogProps> & { initialReason?: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(initialReason);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Waive scenario
      </button>
      <WaiveScenarioDialog
        scenarioTitle="WebSocket Connection Persistence"
        {...props}
        open={open}
        reason={reason}
        onReasonChange={setReason}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const Prefilled: Story = {
  render: () => (
    <Controlled initialReason="Dev confirmed out of scope for this ticket; tracked separately under ENG-2871." />
  ),
};
