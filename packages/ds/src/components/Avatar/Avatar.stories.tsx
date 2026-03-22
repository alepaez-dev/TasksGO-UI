import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    initial: { control: 'text' },
    variant: { control: 'select', options: ['project', 'profile'] },
    'aria-label': { control: 'text' },
  },
  args: {
    initial: 'P',
    'aria-label': 'Project P',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Profile: Story = {
  args: {
    initial: 'AD',
    variant: 'profile',
    'aria-label': 'Alejandra D',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-scale-sm)' }}>
      <Avatar initial="P" aria-label="Project P" />
      <Avatar initial="H" aria-label="Project H" />
      <Avatar initial="AP" variant="profile" aria-label="Alejandra Paez" />
      <Avatar initial="CH" variant="profile" aria-label="Cleo Hernandez" />
    </div>
  ),
};
