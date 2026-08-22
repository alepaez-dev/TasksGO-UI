import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReopenPendingDialog } from './ReopenPendingDialog';

const meta: Meta<typeof ReopenPendingDialog> = {
  title: 'Components/ReopenPendingDialog',
  component: ReopenPendingDialog,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ReopenPendingDialog>;

function Controlled() {
  const [open, setOpen] = useState(false);
  const [actualResult, setActualResult] = useState('');
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Re-open as pending
      </button>
      <ReopenPendingDialog
        open={open}
        scenarioTitle="WebSocket Connection Persistence"
        actualResult={actualResult}
        onActualResultChange={setActualResult}
        actualResultPlaceholder="Not run — scenario waived before execution."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};
