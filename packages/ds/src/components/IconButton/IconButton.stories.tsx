import type { Meta, StoryObj } from '@storybook/react';
import { iconRegistry, type IconName } from '../../icons';
import { IconButton } from './IconButton';

const iconNames = Object.keys(iconRegistry) as IconName[];

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'select', options: iconNames },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    icon: 'menu',
    'aria-label': 'Menu',
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm', icon: 'close', 'aria-label': 'Close' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
