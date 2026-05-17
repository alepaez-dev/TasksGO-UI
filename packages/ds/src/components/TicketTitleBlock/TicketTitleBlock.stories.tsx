import type { Meta, StoryObj } from '@storybook/react';
import { TicketTitleBlock } from './TicketTitleBlock';
import { Avatar } from '../Avatar';

const meta: Meta<typeof TicketTitleBlock> = {
  title: 'Components/TicketTitleBlock',
  component: TicketTitleBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Page-level title block for a ticket: an optional row of status badges and an avatar slot above a page heading. The top meta row is omitted entirely when both `badges` and `avatar` are absent.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '720px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TicketTitleBlock>;

const ticketTitle = 'Implement dynamic edge-caching for API gateway responses';

export const Default: Story = {
  args: {
    title: ticketTitle,
    badges: [
      { label: 'In Progress', variant: 'progress' },
      { label: 'High Prio', variant: 'high' },
    ],
    avatar: (
      <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
    ),
  },
};

export const WithoutAvatar: Story = {
  args: {
    title: ticketTitle,
    badges: [
      { label: 'In Progress', variant: 'progress' },
      { label: 'High Prio', variant: 'high' },
    ],
  },
};

export const WithoutBadges: Story = {
  args: {
    title: ticketTitle,
    avatar: (
      <Avatar initial="AP" aria-label="Ale P." variant="profile" size="sm" />
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: ticketTitle,
  },
};
