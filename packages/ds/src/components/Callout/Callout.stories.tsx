import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout';

const meta = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['positive', 'critical', 'warning', 'neutral'],
      description:
        'Semantic color of the box. positive = expected/pass (green), critical = actual failure (red), warning = waived (amber), neutral = not-run / informational (gray).',
    },
    children: { control: 'text' },
  },
  args: {
    children: 'Response carries X-Cache: HIT and TTFB drops below 40ms.',
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Positive: Story = {
  args: {
    variant: 'positive',
    children: 'Gateway returns 429 Too Many Requests with Retry-After: 2.',
  },
};

export const Critical: Story = {
  args: {
    variant: 'critical',
    children:
      'Stale cached body returned with 200 OK after TTL expiry; no Retry-After header present.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children:
      'Dev confirmed out of scope for this ticket; tracked separately under ENG-2871.',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Not run — scenario waived before execution.',
  },
};

export const AllTones: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
      }}
    >
      <Callout variant="positive">
        Expected: response carries X-Cache: HIT.
      </Callout>
      <Callout variant="critical">
        Actual: stale body returned with 200 OK.
      </Callout>
      <Callout variant="warning">
        Waived: tracked separately under ENG-2871.
      </Callout>
      <Callout variant="neutral">
        Not run — scenario waived before execution.
      </Callout>
    </div>
  ),
};
