import type { Meta, StoryObj } from '@storybook/react';
import { PipelineStageIndicator } from './PipelineStageIndicator';

const meta: Meta<typeof PipelineStageIndicator> = {
  title: 'Components/PipelineStageIndicator',
  component: PipelineStageIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A read-only summary of pipeline stages with the active stage visually highlighted. The active value is decided by the consumer and announced via `aria-current="step"`. When more than three stages are provided, only the first, middle (closest to half of the length), and last are shown — pair with a popover or full list to expose the rest. When the active value would otherwise be hidden, it overrides the computed middle so it stays visible.',
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

type Story = StoryObj<typeof PipelineStageIndicator>;

export const TwoStages: Story = {
  args: {
    items: [
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Prod' },
    ],
    value: 'staging',
    'aria-label': 'Environment',
  },
};

export const ThreeStages: Story = {
  args: {
    items: [
      { value: 'qa1', label: 'QA1' },
      { value: 'qa2', label: 'QA2' },
      { value: 'prod', label: 'Prod' },
    ],
    value: 'qa2',
    'aria-label': 'Environment',
  },
};

export const FourStagesAbbreviated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With 4 stages, only first + middle (index 2, `Math.floor(4/2)`) + last are shown.',
      },
    },
  },
  args: {
    items: [
      { value: 'qa1', label: 'QA1' },
      { value: 'qa2', label: 'QA2' },
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Prod' },
    ],
    value: 'staging',
    'aria-label': 'Environment',
  },
};

export const FiveStagesAbbreviated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With 5 stages, only first + middle (index 2, `Math.floor(5/2)`) + last are shown.',
      },
    },
  },
  args: {
    items: [
      { value: 'qa1', label: 'QA1' },
      { value: 'qa2', label: 'QA2' },
      { value: 'qa3', label: 'QA3' },
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Prod' },
    ],
    value: 'qa3',
    'aria-label': 'Environment',
  },
};

export const WithDisabledStage: Story = {
  args: {
    items: [
      { value: 'qa1', label: 'QA1' },
      { value: 'qa2', label: 'QA2', disabled: true },
      { value: 'prod', label: 'Prod' },
    ],
    value: 'qa1',
    'aria-label': 'Environment',
  },
};
