import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import {
  desktopViewports,
  mobileViewportOptions,
} from '../../../.storybook/preview';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { viewport: { options: desktopViewports } },
};

export const Secondary: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: { variant: 'secondary' },
};

export const Mobile: Story = {
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
  args: { size: 'md' },
};

export const MobileAllVariants: Story = {
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-button-group-gap)',
        alignItems: 'center',
      }}
    >
      <Button size="md" variant="primary">
        Primary
      </Button>
      <Button size="md" variant="secondary">
        Secondary
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: { disabled: true },
};
