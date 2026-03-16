import type { Meta, StoryObj } from '@storybook/react';
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
  },
} satisfies Meta<typeof TaskRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Fix authentication timeout on mobile devices',
    priority: 'high',
    ticketId: 'ENG-902',
    badge: { label: 'In Progress', variant: 'progress' },
    date: { label: 'Mar 15', dateTime: '2026-03-15' },
  },
};

export const WithSingleRef: Story = {
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
  args: {
    title: 'Quick fix for typo in README',
  },
};

export const TaskList: Story = {
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
