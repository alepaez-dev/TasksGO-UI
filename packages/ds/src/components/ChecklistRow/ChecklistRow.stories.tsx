import type { Meta, StoryObj } from '@storybook/react';
import { ChecklistRow } from './ChecklistRow';

const meta: Meta<typeof ChecklistRow> = {
  title: 'Components/ChecklistRow',
  component: ChecklistRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single line in a verification or scenario checklist: a status indicator, a label, and an optional meta slot for trailing text such as a verifier name or a failure tag.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['passed', 'failed', 'pending'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '480px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ChecklistRow>;

export const Passed: Story = {
  args: {
    status: 'passed',
    label: 'Cache hit ratio check on US-East-1 staging',
    meta: 'Verified by JD',
  },
};

export const Failed: Story = {
  args: {
    status: 'failed',
    label: 'Invalidation latency under 200ms',
    meta: 'FAILED',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
    label: 'Browser-side TTL override persistence',
    meta: 'Not verified',
  },
};

export const WithoutMeta: Story = {
  args: {
    status: 'passed',
    label: 'WAF integration compatibility',
  },
};

export const Clickable: Story = {
  args: {
    status: 'failed',
    label: 'Invalidation latency under 200ms',
    meta: 'FAILED',
    onClick: () => {
      window.open(
        'https://example.com/failures/invalidation-latency',
        '_blank',
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `onClick` is provided, the row becomes a keyboard-operable button (`role="button"`, Tab-focusable, Enter/Space activates). The trailing `open_in_new` icon appears on hover or focus to indicate that activating the row opens its details in a new tab.',
      },
    },
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div>
      <ChecklistRow
        status="passed"
        label="Cache hit ratio check on US-East-1 staging"
        meta="Verified by JD"
        onClick={() => {}}
      />
      <ChecklistRow
        status="failed"
        label="Invalidation latency under 200ms"
        meta="FAILED"
        onClick={() => {}}
      />
      <ChecklistRow
        status="pending"
        label="Browser-side TTL override persistence"
        meta="Not verified"
        onClick={() => {}}
      />
      <ChecklistRow
        status="passed"
        label="WAF integration compatibility"
        meta="Verified by JD"
        onClick={() => {}}
      />
    </div>
  ),
};
