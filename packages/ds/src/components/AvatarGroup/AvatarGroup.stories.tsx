import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from '../Avatar';

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A stacking container for multiple `Avatar` elements. Each subsequent child overlaps the previous one slightly. The `profile` variant works best inside a group because its border creates visual separation between overlapping avatars.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AvatarGroup>;

export const Two: Story = {
  render: () => (
    <AvatarGroup aria-label="Assignees">
      <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
      <Avatar initial="JD" aria-label="Jordan D." variant="profile" size="sm" />
    </AvatarGroup>
  ),
};

export const Three: Story = {
  render: () => (
    <AvatarGroup aria-label="Assignees">
      <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
      <Avatar initial="JD" aria-label="Jordan D." variant="profile" size="sm" />
      <Avatar initial="AM" aria-label="Alex M." variant="profile" size="sm" />
    </AvatarGroup>
  ),
};

export const MediumSize: Story = {
  render: () => (
    <AvatarGroup aria-label="Team members">
      <Avatar
        initial="AH"
        aria-label="Alex H."
        variant="profile"
        style={{ backgroundColor: '#7D9B84' }}
      />
      <Avatar
        initial="CH"
        aria-label="Cleo H."
        variant="profile"
        style={{ backgroundColor: '#C38E70' }}
      />
      <Avatar
        initial="VP"
        aria-label="Vader P."
        variant="profile"
        style={{ backgroundColor: '#6C89A8' }}
      />
    </AvatarGroup>
  ),
};
