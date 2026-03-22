import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { desktopViewports, mobileViewports } from '../../../.storybook/preview';
import { TaskRow } from './TaskRow';

const meta = {
  title: 'Components/TaskRow',
  component: TaskRow,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    completed: { control: 'boolean' },
    checked: { control: 'boolean' },
    priority: {
      control: 'select',
      options: ['critical', 'high', 'medium', 'low'],
    },
    ticketId: { control: 'text' },
    layout: {
      control: 'select',
      options: ['default', 'compact'],
    },
  },
} satisfies Meta<typeof TaskRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    title: 'Fix authentication timeout on mobile devices',
    priority: 'high',
    ticketId: 'ENG-902',
    badge: { label: 'In Progress', variant: 'progress' },
    date: { label: 'Mar 15', dateTime: '2026-03-15' },
  },
};

export const WithSingleRef: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    title: 'Refactor Kubernetes service discovery logic for edge nodes',
    priority: 'high',
    ticketId: 'ENG-902',
    badge: { label: 'In Progress', variant: 'progress' },
    date: { label: 'Oct 28', dateTime: '2026-10-28' },
    checked: true,
    refs: [
      {
        label: 'architecture-spec-v2.md',
        variant: 'doc',
        icon: 'link',
      },
    ],
  },
};

export const WithMultipleRefs: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    title: 'Implement OAuth2 PKCE flow for mobile clients',
    priority: 'critical',
    ticketId: 'ENG-1024',
    badge: { label: 'In Progress', variant: 'progress' },
    date: { label: 'Nov 5', dateTime: '2026-11-05', urgent: true },
    refs: [
      { label: 'rfc-oauth2.pdf', variant: 'attachment', icon: 'attach_file' },
      { label: 'security-review.md', variant: 'doc', icon: 'description' },
      { label: 'JIRA-4521', variant: 'general', icon: 'link' },
    ],
  },
};

export const Completed: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    title: 'Update API rate limiting configuration',
    completed: true,
    checked: true,
    priority: 'medium',
    ticketId: 'INFRA-441',
    badge: { label: 'Done', variant: 'done' },
    date: { label: 'Mar 10', dateTime: '2026-03-10' },
  },
};

export const Minimal: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    title: 'Quick fix for typo in README',
  },
};

export const Compact: Story = {
  name: 'Compact (Mobile)',
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: {
        ...mobileViewports,
        responsive: {
          name: 'Default',
          styles: mobileViewports.mobile.styles,
        },
      },
    },
  },
  args: {
    title: 'Implement OAuth2 provider',
    layout: 'compact',
    priority: 'high',
    ticketId: 'T-104',
    badge: { label: 'In Progress', variant: 'progress' },
    date: { label: 'Today', dateTime: '2026-03-16' },
  },
};

export const CompactCompleted: Story = {
  name: 'Compact Completed (Mobile)',
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: {
        ...mobileViewports,
        responsive: {
          name: 'Default',
          styles: mobileViewports.mobile.styles,
        },
      },
    },
  },
  args: {
    title: 'Security patch 2.4.1',
    layout: 'compact',
    completed: true,
    checked: true,
    priority: 'high',
    ticketId: 'T-098',
    date: { label: 'Completed yesterday', dateTime: '2026-03-15' },
  },
};

export const CompactList: Story = {
  name: 'Compact List (Mobile)',
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: {
        ...mobileViewports,
        responsive: {
          name: 'Default',
          styles: mobileViewports.mobile.styles,
        },
      },
    },
  },
  args: {
    title: 'Implement OAuth2 provider',
  },
  render: () => (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        maxWidth: '480px',
      }}
    >
      <li>
        <TaskRow
          layout="compact"
          title="Implement OAuth2 provider"
          priority="high"
          ticketId="T-104"
          badge={{ label: 'In Progress', variant: 'progress' }}
          date={{ label: 'Today', dateTime: '2026-03-16' }}
        />
      </li>
      <li>
        <TaskRow
          layout="compact"
          title="Refactor state management"
          priority="low"
          ticketId="T-109"
          badge={{ label: 'To Do', variant: 'todo' }}
          date={{ label: 'Monday', dateTime: '2026-03-17' }}
        />
      </li>
      <li>
        <TaskRow
          layout="compact"
          title="Update component library"
          priority="low"
          ticketId="T-112"
          badge={{ label: 'In Progress', variant: 'progress' }}
          date={{ label: 'Next Week', dateTime: '2026-03-23' }}
        />
      </li>
    </ul>
  ),
};

export const TaskList: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    title: 'Fix authentication timeout on mobile devices',
  },
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      <li>
        <TaskRow
          title="Refactor Kubernetes service discovery logic for edge nodes"
          priority="critical"
          ticketId="ENG-902"
          badge={{ label: 'In Progress', variant: 'progress' }}
          date={{ label: 'Oct 28', dateTime: '2026-10-28', urgent: true }}
          checked
          refs={[
            {
              label: 'architecture-spec-v2.md',
              variant: 'doc',
              icon: 'link',
            },
          ]}
        />
      </li>
      <li>
        <TaskRow
          title="Add dark mode support to dashboard"
          priority="medium"
          ticketId="ENG-815"
          badge={{ label: 'To Do', variant: 'todo' }}
          date={{ label: 'Mar 20', dateTime: '2026-03-20' }}
        />
      </li>
      <li>
        <TaskRow
          title="Implement OAuth2 PKCE flow for mobile clients"
          priority="high"
          ticketId="ENG-1024"
          badge={{ label: 'In Progress', variant: 'progress' }}
          date={{ label: 'Nov 5', dateTime: '2026-11-05' }}
          refs={[
            {
              label: 'rfc-oauth2.pdf',
              variant: 'attachment',
              icon: 'attach_file',
            },
            {
              label: 'security-review.md',
              variant: 'doc',
              icon: 'description',
            },
          ]}
        />
      </li>
      <li>
        <TaskRow
          title="Update API rate limiting configuration"
          completed
          checked
          priority="low"
          ticketId="INFRA-441"
          badge={{ label: 'Done', variant: 'done' }}
          date={{ label: 'Mar 10', dateTime: '2026-03-10' }}
        />
      </li>
    </ul>
  ),
};
