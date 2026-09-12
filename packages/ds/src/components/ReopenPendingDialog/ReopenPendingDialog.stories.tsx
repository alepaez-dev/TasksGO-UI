import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ReopenPendingDialog,
  type ReopenPendingDialogProps,
} from './ReopenPendingDialog';
import { mobileSheetStory } from '../../../.storybook/decorators';

const meta: Meta<typeof ReopenPendingDialog> = {
  title: 'Components/ReopenPendingDialog',
  component: ReopenPendingDialog,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ReopenPendingDialog>;

function Controlled(props: Partial<ReopenPendingDialogProps>) {
  const [open, setOpen] = useState(false);
  const [actualResult, setActualResult] = useState('');
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Re-open as pending
      </button>
      <ReopenPendingDialog
        {...props}
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

export const Sheet: Story = {
  ...mobileSheetStory,
  render: () => <Controlled presentation="sheet" />,
};
