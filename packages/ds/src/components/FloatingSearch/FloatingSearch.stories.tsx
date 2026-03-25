import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import {
  desktopViewports,
  mobileViewportOptions,
} from '../../../.storybook/preview';
import { FloatingSearch } from './FloatingSearch';

const meta: Meta<typeof FloatingSearch> = {
  title: 'Components/FloatingSearch',
  component: FloatingSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof FloatingSearch>;

export const Default: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    placeholder: 'Search tasks...',
    shortcutHint: '⌘K',
  },
};

export const WithoutShortcut: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    placeholder: 'Search tasks...',
  },
};

export const MobileViewport: Story = {
  args: {
    placeholder: 'Search tasks...',
    shortcutHint: '⌘K',
  },
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
};
