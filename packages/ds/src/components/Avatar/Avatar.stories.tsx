import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    initial: { control: 'text' },
    variant: { control: 'select', options: ['project', 'profile'] },
    tint: { control: 'color' },
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
      <Avatar initial="CP" variant="profile" aria-label="Cleo Paez" />
    </div>
  ),
};

export const Tinted: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-scale-sm)' }}>
      <Avatar
        initial="AH"
        variant="profile"
        aria-label="Alex H."
        tint="var(--ds-color-avatar-tone-profile-sage)"
      />
      <Avatar
        initial="CH"
        variant="profile"
        aria-label="Cleo H."
        tint="var(--ds-color-avatar-tone-profile-tan)"
      />
      <Avatar
        initial="VP"
        variant="profile"
        aria-label="Vader P."
        tint="var(--ds-color-avatar-tone-profile-steel)"
      />
      <Avatar
        initial="P"
        tint="var(--ds-color-avatar-tone-project-ocean)"
        aria-label="Project P"
      />
    </div>
  ),
};
