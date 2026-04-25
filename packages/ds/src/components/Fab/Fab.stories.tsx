import type { Meta, StoryObj } from '@storybook/react';
import { iconRegistry, type IconName } from '../../icons';
import { Fab } from './Fab';

const iconNames = Object.keys(iconRegistry) as IconName[];

const meta = {
  title: 'Components/Fab',
  component: Fab,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'select', options: iconNames },
    disabled: { control: 'boolean' },
  },
  args: {
    icon: 'add',
    'aria-label': 'New task',
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomIcon: Story = {
  args: { icon: 'auto_awesome', 'aria-label': 'Generate with AI' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
