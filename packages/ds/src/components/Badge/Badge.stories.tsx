import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'progress',
        'todo',
        'done',
        'high',
        'critical',
        'success',
      ],
    },
    children: { control: 'text' },
  },
  args: {
    children: 'v4.1.0-alpha',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Progress: Story = {
  args: { variant: 'progress', children: 'In Progress' },
};

export const Todo: Story = {
  args: { variant: 'todo', children: 'To Do' },
};

export const Done: Story = {
  args: { variant: 'done', children: 'Done' },
};

export const High: Story = {
  args: { variant: 'high', children: 'High Prio' },
};

export const Critical: Story = {
  args: { variant: 'critical', children: '1 Failed' },
};

export const Success: Story = {
  args: { variant: 'success', children: '4/4 Passed' },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-sm)',
        alignItems: 'center',
      }}
    >
      <Badge>v4.1.0-alpha</Badge>
      <Badge variant="progress">In Progress</Badge>
      <Badge variant="todo">To Do</Badge>
      <Badge variant="done">Done</Badge>
      <Badge variant="high">High Prio</Badge>
      <Badge variant="critical">1 Failed</Badge>
      <Badge variant="success">4/4 Passed</Badge>
    </div>
  ),
};
