import type { Meta, StoryObj } from '@storybook/react';
import { PriorityLabel } from './PriorityLabel';

const meta = {
  title: 'Components/PriorityLabel',
  component: PriorityLabel,
  tags: ['autodocs'],
  argTypes: {
    priority: {
      control: 'select',
      options: ['critical', 'high', 'medium', 'low'],
    },
    appearance: {
      control: 'select',
      options: ['text', 'icon-text', 'icon'],
    },
  },
  args: {
    priority: 'high',
  },
} satisfies Meta<typeof PriorityLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Critical: Story = {
  args: { priority: 'critical' },
};

export const High: Story = {
  args: { priority: 'high' },
};

export const Medium: Story = {
  args: { priority: 'medium' },
};

export const Low: Story = {
  args: { priority: 'low' },
};

export const AllPriorities: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-md)',
        alignItems: 'center',
      }}
    >
      <PriorityLabel priority="critical" />
      <PriorityLabel priority="high" />
      <PriorityLabel priority="medium" />
      <PriorityLabel priority="low" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-md)',
        alignItems: 'center',
      }}
    >
      <PriorityLabel priority="critical" appearance="icon-text" />
      <PriorityLabel priority="high" appearance="icon-text" />
      <PriorityLabel priority="medium" appearance="icon-text" />
      <PriorityLabel priority="low" appearance="icon-text" />
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-scale-md)',
        alignItems: 'center',
      }}
    >
      <PriorityLabel priority="critical" appearance="icon" />
      <PriorityLabel priority="high" appearance="icon" />
      <PriorityLabel priority="medium" appearance="icon" />
      <PriorityLabel priority="low" appearance="icon" />
    </div>
  ),
};
