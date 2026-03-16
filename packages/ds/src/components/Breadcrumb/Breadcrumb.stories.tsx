import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    segments: [
      { label: 'Projects', href: '/projects' },
      { label: 'Engineering Core' },
    ],
  },
};

export const ThreeSegments: Story = {
  args: {
    segments: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Engineering Core' },
    ],
  },
};

export const SingleSegment: Story = {
  args: {
    segments: [{ label: 'Dashboard' }],
  },
};
