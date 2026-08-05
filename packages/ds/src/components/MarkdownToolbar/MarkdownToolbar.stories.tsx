import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownToolbar } from './MarkdownToolbar';

const meta = {
  title: 'Components/MarkdownToolbar',
  component: MarkdownToolbar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    variant: { control: 'inline-radio', options: ['inline', 'accessory'] },
    onAction: { control: false },
    onDone: { control: false },
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

export const Accessory: Story = {
  args: { variant: 'accessory', onDone: () => {} },
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard-docked variant: portals to the bottom of the viewport with a trailing Done button. It tracks `visualViewport`, so it rides above the on-screen keyboard when one is open and rests at the viewport bottom otherwise (as shown here, with no keyboard).',
      },
    },
  },
};
