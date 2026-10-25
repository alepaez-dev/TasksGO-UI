import type { Meta, StoryObj } from '@storybook/react';
import { ReactionBar } from './ReactionBar';

const meta = {
  title: 'Components/ReactionBar',
  component: ReactionBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The emoji reactions under an activity comment. Each chip is a toggle button carrying `aria-pressed`, so the viewer’s own reaction is announced and not signalled by colour alone. Pass `onPickerOpenChange` to offer the add-reaction button — its presence is the trigger. The picker itself is a `Popover` the caller opens via `pickerOpen`, so the bar stays stateless. With no reactions and no `onPickerOpenChange`, the bar renders nothing rather than an empty row.',
      },
    },
  },
  argTypes: {
    onToggleReaction: { action: 'react' },
    onPickerOpenChange: { action: 'pickerOpenChange' },
    onPickReaction: { action: 'pick' },
  },
  args: {
    reactions: [
      {
        emoji: '👍',
        count: 2,
        reactedByViewer: true,
        actors: [
          { id: 'ap', name: 'Ale P.' },
          { id: 'sk', name: 'Sam K.' },
        ],
      },
      {
        emoji: '🎉',
        count: 1,
        reactedByViewer: false,
        actors: [{ id: 'am', name: 'Alex M.' }],
      },
    ],
  },
} satisfies Meta<typeof ReactionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAddButton: Story = {
  args: { onPickerOpenChange: () => {} },
};

export const NoneYet: Story = {
  args: { reactions: [], onPickerOpenChange: () => {} },
  parameters: {
    docs: {
      description: {
        story: 'Only the add button shows until someone reacts.',
      },
    },
  },
};

export const Empty: Story = {
  args: { reactions: [], onPickerOpenChange: undefined },
  parameters: {
    docs: {
      description: {
        story: 'Nothing to show and no way to add — the bar renders nothing.',
      },
    },
  },
};
