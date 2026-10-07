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
          'The emoji reactions under an activity comment. Each chip is a toggle button carrying `aria-pressed`, so the viewer’s own reaction is announced and not signalled by colour alone. Pass `onAddReaction` to offer the add-reaction button — its presence is the trigger. With no reactions and no `onAddReaction`, the bar renders nothing rather than an empty row.',
      },
    },
  },
  argTypes: {
    onToggleReaction: { action: 'react' },
    onAddReaction: { action: 'add' },
  },
  args: {
    reactions: [
      { emoji: '👍', count: 2, reactedByViewer: true },
      { emoji: '🎉', count: 1, reactedByViewer: false },
    ],
  },
} satisfies Meta<typeof ReactionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAddButton: Story = {
  args: { onAddReaction: () => {} },
};

export const NoneYet: Story = {
  args: { reactions: [], onAddReaction: () => {} },
  parameters: {
    docs: {
      description: {
        story: 'Only the add button shows until someone reacts.',
      },
    },
  },
};

export const Empty: Story = {
  args: { reactions: [], onAddReaction: undefined },
  parameters: {
    docs: {
      description: {
        story: 'Nothing to show and no way to add — the bar renders nothing.',
      },
    },
  },
};
