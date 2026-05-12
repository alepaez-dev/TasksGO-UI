import type { Meta, StoryObj } from '@storybook/react';
import { PropertyRow } from './PropertyRow';
import { Avatar } from '../Avatar';
import { StatusDot } from '../StatusDot';
import { PriorityLabel } from '../PriorityLabel';

const meta: Meta<typeof PropertyRow> = {
  title: 'Components/PropertyRow',
  component: PropertyRow,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PropertyRow>;

export const Default: Story = {
  args: {
    icon: 'person',
    label: 'Assignee',
    children: 'Alex D.',
  },
};

export const WithAvatar: Story = {
  args: {
    icon: 'person',
    label: 'Assignee',
    onClick: () => {},
  },
  render: (args) => (
    <PropertyRow {...args}>
      <Avatar initial="AD" aria-label="Alex D." variant="profile" />
      <span>Alex D.</span>
    </PropertyRow>
  ),
};

export const WithStatusDot: Story = {
  args: {
    icon: 'tag',
    label: 'Project',
  },
  render: (args) => (
    <PropertyRow {...args}>
      <StatusDot variant="active" label="Active" />
      <span>Infrastructure</span>
    </PropertyRow>
  ),
};

export const WithPriority: Story = {
  args: {
    icon: 'signal_cellular_alt',
    label: 'Priority',
    onClick: () => {},
  },
  render: (args) => (
    <PropertyRow {...args}>
      <PriorityLabel priority="high" />
    </PropertyRow>
  ),
};

export const Placeholder: Story = {
  args: {
    icon: 'confirmation_number',
    label: 'Linked Ticket',
    onClick: () => {},
    children: 'Search ticket...',
  },
};

export const WithoutIcon: Story = {
  args: {
    label: 'Sprint',
    children: 'Q1-W4-INFRA',
  },
};
