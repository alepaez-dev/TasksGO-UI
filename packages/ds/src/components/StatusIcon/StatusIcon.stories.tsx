import type { Meta, StoryObj } from '@storybook/react';
import { StatusIcon, type TicketStatus } from './StatusIcon';

const statuses: readonly { status: TicketStatus; label: string }[] = [
  { status: 'backlog', label: 'Backlog' },
  { status: 'todo', label: 'Todo' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'in-review', label: 'In review' },
  { status: 'ready-for-qa', label: 'Ready for QA' },
  { status: 'in-qa', label: 'In QA' },
  { status: 'blocked', label: 'Blocked' },
  { status: 'done', label: 'Done' },
];

const meta = {
  title: 'Components/StatusIcon',
  component: StatusIcon,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: statuses.map((entry) => entry.status),
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    label: { control: 'text' },
  },
  args: {
    status: 'in-progress',
    label: 'In progress',
  },
} satisfies Meta<typeof StatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
        fontFamily: 'var(--ds-font-family-sans)',
        fontSize: 'var(--ds-text-card-body-font-size)',
        color: 'var(--ds-color-text-primary)',
      }}
    >
      {statuses.map(({ status, label }) => (
        <span
          key={status}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--ds-space-scale-sm)',
          }}
        >
          <StatusIcon status={status} label={label} />
          {label}
        </span>
      ))}
    </div>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
};
