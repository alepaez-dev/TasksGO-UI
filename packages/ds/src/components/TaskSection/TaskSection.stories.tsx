import type { Meta, StoryObj } from '@storybook/react';
import { TaskSection } from './TaskSection';

const meta = {
  title: 'Components/TaskSection',
  component: TaskSection,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    count: { control: 'number' },
    badgeVariant: {
      control: 'select',
      options: ['default', 'progress', 'todo', 'done'],
    },
    open: { control: 'boolean' },
  },
} satisfies Meta<typeof TaskSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'ACTIVE TASKS',
    count: 2,
    badgeVariant: 'progress',
    open: true,
    children: <p>Section content goes here.</p>,
  },
};

export const Closed: Story = {
  args: {
    title: 'DONE',
    count: 5,
    badgeVariant: 'done',
    children: <p>Completed tasks would appear here.</p>,
  },
};

export const WithoutCount: Story = {
  args: {
    title: 'BACKLOG',
    open: true,
    children: <p>Tasks without a count badge.</p>,
  },
};
