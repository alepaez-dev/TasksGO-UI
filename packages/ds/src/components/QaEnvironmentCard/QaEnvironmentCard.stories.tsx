import type { Meta, StoryObj } from '@storybook/react';
import {
  QaEnvironmentCard,
  type QaEnvironmentOption,
} from './QaEnvironmentCard';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';

const environments: readonly QaEnvironmentOption[] = [
  {
    value: 'qa1',
    label: 'QA-01',
    reviewStatus: 'In review',
    lastDeployment: '24 mins ago',
    healthVariant: 'high',
    pipelineLabel: 'Unstable',
    pipelineVariant: 'high',
  },
  {
    value: 'qa2',
    label: 'QA-02',
    reviewStatus: 'Reviewed',
    lastDeployment: '2 hours ago',
    healthVariant: 'active',
    pipelineLabel: 'Stable',
    pipelineVariant: 'active',
  },
  {
    value: 'staging',
    label: 'STAGING',
    reviewStatus: 'Pending check',
    lastDeployment: '1 day ago',
    healthVariant: 'active',
    pipelineLabel: 'Healthy',
    pipelineVariant: 'active',
  },
];

const meta = {
  title: 'Components/QaEnvironmentCard',
  component: QaEnvironmentCard,
  tags: ['autodocs'],
  argTypes: {
    activeValue: {
      control: 'select',
      options: environments.map((env) => env.value),
    },
    switcherOpen: { control: 'boolean' },
    environments: { control: false },
    wideSelectorRef: { control: false },
    onValueChange: { control: false },
    onSwitcherOpenChange: { control: false },
    promote: { control: false },
    onManageEnvironments: { control: false },
  },
  args: {
    environments,
    activeValue: 'qa1',
    onValueChange: () => {},
    switcherOpen: false,
    onSwitcherOpenChange: () => {},
    promote: { label: 'Promote to Staging', onClick: () => {} },
    onManageEnvironments: () => {},
  },
} satisfies Meta<typeof QaEnvironmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoPromote: Story = {
  args: { promote: undefined },
};

export const Stacked: Story = {
  decorators: [withDefaultViewport('mobile')],
  parameters: { viewport: { options: mobileViewportOptions } },
};

export const StackedSheetOpen: Story = {
  decorators: [withDefaultViewport('mobile')],
  parameters: { viewport: { options: mobileViewportOptions } },
  args: { switcherOpen: true },
};
