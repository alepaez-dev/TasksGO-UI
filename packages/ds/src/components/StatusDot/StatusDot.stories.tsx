import type { Meta, StoryObj } from '@storybook/react';
import { StatusDot } from './StatusDot';

const meta = {
  title: 'Components/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['active', 'critical', 'high', 'medium', 'low', 'info'],
    },
    label: { control: 'text' },
  },
  args: {
    label: 'Active',
  },
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-sm)',
        alignItems: 'center',
      }}
    >
      <StatusDot variant="active" label="Active" />
      <StatusDot variant="critical" label="Critical" />
      <StatusDot variant="high" label="High" />
      <StatusDot variant="medium" label="Medium" />
      <StatusDot variant="low" label="Low" />
      <StatusDot variant="info" label="Info" />
    </div>
  ),
};
