import type { Meta, StoryObj } from '@storybook/react';
import { StepList } from './StepList';

const meta = {
  title: 'Components/StepList',
  component: StepList,
  tags: ['autodocs'],
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      'Deploy recent build to `QA-01` environment',
      'Fire 500 rps against `/v1/assets/hot` for 30s',
      'Inspect response headers once burst limit is crossed',
    ],
  },
};

export const WithFormatting: Story = {
  args: {
    steps: [
      'Trigger concurrent updates via `/api/v1/sync` endpoint',
      'Monitor **cache TTL** expiration logs in Datadog',
      'Observe WebSocket reconnection attempts after simulated network drop',
    ],
  },
};

export const WithDividers: Story = {
  args: {
    dividers: true,
    steps: [
      'Deploy recent build to `QA-01` environment',
      'Trigger concurrent updates via `/api/v1/sync` endpoint',
      'Monitor cache TTL expiration logs in Datadog',
      'Observe WebSocket reconnection attempts after simulated network drop',
    ],
  },
};
