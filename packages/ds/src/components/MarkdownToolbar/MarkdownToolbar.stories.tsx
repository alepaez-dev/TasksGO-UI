import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownToolbar } from './MarkdownToolbar';
import { SCRATCHPAD_TOOLBAR_GROUPS } from '../Scratchpad/Scratchpad';

const meta = {
  title: 'Components/MarkdownToolbar',
  component: MarkdownToolbar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    onAction: { control: false },
  },
  args: {
    onAction: () => {},
    size: 'sm',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A stateless formatting toolbar for the markdown editor. Renders a `role="toolbar"` row of icon buttons (heading, bold, italic, list, quote, code, link, image, checklist item) and emits `onAction(action)` — it never mutates text itself; the owning editor hook applies the transform to the textarea selection.',
      },
    },
  },
} satisfies Meta<typeof MarkdownToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Medium: Story = {
  args: { size: 'md' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Grouped: Story = {
  args: {
    groups: SCRATCHPAD_TOOLBAR_GROUPS,
    hint: 'Markdown supported',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The grouping the Scratchpad uses: text formatting, then block and insert actions, then the token pills, with a divider between each group and a trailing hint. On narrow screens the pill labels and the hint collapse to leave the icons, and the dividers drop once the row can no longer keep everything on one line.',
      },
    },
  },
};
