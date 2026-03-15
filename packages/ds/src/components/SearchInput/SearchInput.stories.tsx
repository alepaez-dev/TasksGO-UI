import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    shortcutHint: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Search tasks',
    placeholder: 'SEARCH TASKS...',
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithShortcutHint: Story = {
  args: {
    shortcutHint: '⌘K',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    shortcutHint: '⌘K',
  },
};
