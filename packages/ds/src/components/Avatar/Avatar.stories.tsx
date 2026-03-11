import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    initial: { control: 'text' },
    'aria-label': { control: 'text' },
  },
  args: {
    initial: 'A',
    'aria-label': 'Project A',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DifferentInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-scale-sm)' }}>
      <Avatar initial="A" aria-label="Project A" />
      <Avatar initial="H" aria-label="Project H" />
      <Avatar initial="P" aria-label="Admin P" />
    </div>
  ),
};
