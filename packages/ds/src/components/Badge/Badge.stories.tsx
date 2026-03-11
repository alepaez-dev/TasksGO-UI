import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'progress', 'todo', 'done'],
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
    </div>
  ),
};
