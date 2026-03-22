import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    shortcutHint: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Search',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search or command...',
    shortcutHint: '⌘K',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Filter tasks...',
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Search or command...',
    shortcutHint: '⌘K',
  },
  // Disabled components are exempt from WCAG 2.1 SC 1.4.3 contrast requirements:
  // e.g "User Interface Components that are not available for user interaction"
  // https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
  // disabling storybook a11y color contrast rule for this story to avoid false positive accessibility violation
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
};
