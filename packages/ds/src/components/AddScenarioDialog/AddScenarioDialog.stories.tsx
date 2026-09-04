import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AddScenarioDialog } from './AddScenarioDialog';
import styles from './AddScenarioDialog.stories.module.css';
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
  steps: [],
  evidence: [],
};

const FILLED: NewScenarioDraft = {
  name: 'Verify cache hit on /v1/assets',
  status: 'failed',
  description: 'Edge cache should serve a warm asset on the second request.',
  expected: 'Response carries X-Cache: HIT within 200ms.',
  actual: '',
  steps: [],
  evidence: [],
};

// the DS applies no rule of its own; this is the consuming app's policy
const BLOCKED_EVIDENCE = /\.(dmg|exe|msi|bat|sh|pkg)$/i;

function Controlled({
  initial = EMPTY,
  isEvidenceAllowed,
  addEvidenceDisabled,
}: {
  initial?: NewScenarioDraft;
  isEvidenceAllowed?: (file: File) => boolean;
  addEvidenceDisabled?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState(initial);
  const [notice, setNotice] = useState('');
  const close = () => {
    setNotice('');
    setOpen(false);
  };
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Add scenario
      </button>
      <AddScenarioDialog
        open={open}
        value={draft}
        onValueChange={(next) => {
          setNotice('');
          setDraft(next);
        }}
        onCancel={close}
        onConfirm={close}
        isEvidenceAllowed={isEvidenceAllowed}
        addEvidenceDisabled={addEvidenceDisabled}
        onEvidenceRejected={(rejected) => {
          const blocked = rejected
            .filter((r) => r.reason === 'filtered')
            .map((r) => r.file.name);
          const overLimit = rejected.filter((r) => r.reason === 'limit').length;
          setNotice(
            [
              blocked.length
                ? `Not an allowed file type: ${blocked.join(', ')}`
                : '',
              overLimit
                ? `${overLimit} file(s) over the limit were not added.`
                : '',
            ]
              .filter(Boolean)
              .join(' · '),
          );
        }}
        evidenceMessage={
          <p role="status" className={styles.notice}>
            {notice}
          </p>
        }
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

export const ConsumerBlocksExecutables: Story = {
  name: 'Consumer blocks executables',
  render: () => (
    <Controlled
      isEvidenceAllowed={(file) => !BLOCKED_EVIDENCE.test(file.name)}
    />
  ),
};

export const EvidenceAddDisabled: Story = {
  name: 'Evidence add disabled (upload in flight)',
  render: () => (
    <Controlled
      addEvidenceDisabled
      initial={{
        ...EMPTY,
        evidence: [new File(['x'], 'screenshot.png', { type: 'image/png' })],
      }}
    />
  ),
};
