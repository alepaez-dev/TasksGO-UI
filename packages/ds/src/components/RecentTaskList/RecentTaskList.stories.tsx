import type { Meta, StoryObj } from '@storybook/react';
import { RecentTaskList } from './RecentTaskList';

const items = [
  {
    ticketId: 'TSK-104',
    title: 'Implement unit tests for cache logic',
    timeAgo: '2h ago',
  },
  {
    ticketId: 'TSK-105',
    title: 'Update staging environment config',
    timeAgo: '1d ago',
  },
  {
    ticketId: 'TSK-98',
    title: 'Fix DNS resolution in edge proxy',
    timeAgo: '3d ago',
  },
];

const meta: Meta<typeof RecentTaskList> = {
  title: 'Components/RecentTaskList',
  component: RecentTaskList,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof RecentTaskList>;

export const Default: Story = {
  args: {
    items,
  },
};

export const SingleItem: Story = {
  args: {
    items: [items[0]],
  },
};

export const LongTitles: Story = {
  args: {
    items: [
      {
        ticketId: 'TSK-200',
        title:
          'Refactor the entire authentication middleware to support OAuth2.0 with PKCE flow for mobile clients',
        timeAgo: '5m ago',
      },
      {
        ticketId: 'TSK-201',
        title: 'Quick fix',
        timeAgo: '2w ago',
      },
    ],
  },
};
