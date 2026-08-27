import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AddScenarioDialog } from './AddScenarioDialog';
import type { NewScenarioDraft } from './scenarioDraft';

const meta: Meta<typeof AddScenarioDialog> = {
  title: 'Components/AddScenarioDialog',
  component: AddScenarioDialog,
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: false },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AddScenarioDialog>;

const EMPTY: NewScenarioDraft = {
  name: '',
  status: 'pending',
  description: '',
  expected: '',
  actual: '',
};

const FILLED: NewScenarioDraft = {
  name: 'Verify cache hit on /v1/assets',
  status: 'failed',
  description: 'Edge cache should serve a warm asset on the second request.',
  expected: 'Response carries X-Cache: HIT within 200ms.',
  actual: '',
};

function Controlled({ initial = EMPTY }: { initial?: NewScenarioDraft }) {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState(initial);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Add scenario
      </button>
      <AddScenarioDialog
        open={open}
        value={draft}
        onValueChange={setDraft}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const Passed: Story = {
  render: () => <Controlled initial={{ ...FILLED, status: 'passed' }} />,
};

export const FailedNeedsActualResult: Story = {
  render: () => <Controlled initial={FILLED} />,
};

export const ReadyToSubmit: Story = {
  render: () => (
    <Controlled
      initial={{ ...FILLED, actual: 'Response carried X-Cache: MISS twice.' }}
    />
  ),
};
