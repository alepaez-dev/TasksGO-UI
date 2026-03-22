import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    left: (
      <>
        <span>Focus Mode: Enabled</span>
        <span aria-hidden="true" style={{ opacity: 0.2 }}>
          |
        </span>
        <span>Task Sync: Active</span>
      </>
    ),
    right: (
      <>
        <a href="/archive">Archive</a>
        <a href="/shortcuts">Keyboard Shortcuts</a>
      </>
    ),
  },
};

export const LeftOnly: Story = {
  args: {
    left: (
      <>
        <span>System Stable</span>
        <span aria-hidden="true" style={{ opacity: 0.2 }}>
          |
        </span>
        <span>v4.1.0-alpha</span>
      </>
    ),
  },
};
