import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    max: { control: 'number' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    tone: {
      control: 'select',
      options: ['neutral', 'success', 'warning', 'critical'],
    },
  },
  args: {
    value: 3,
    max: 5,
    'aria-label': '3 of 5 scenarios passing',
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
      }}
    >
      <ProgressBar {...args} tone="neutral" aria-label="Neutral progress" />
      <ProgressBar {...args} tone="success" aria-label="Success progress" />
      <ProgressBar {...args} tone="warning" aria-label="Warning progress" />
      <ProgressBar {...args} tone="critical" aria-label="Critical progress" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
      }}
    >
      <ProgressBar {...args} size="sm" aria-label="Small progress" />
      <ProgressBar {...args} size="md" aria-label="Medium progress" />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    value: 0,
    max: 0,
    'aria-label': 'No scenarios yet',
  },
};
