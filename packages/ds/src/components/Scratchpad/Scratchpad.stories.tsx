import type { Meta, StoryObj } from '@storybook/react';
import { Scratchpad, type ScratchpadLine } from './Scratchpad';
import { useScratchpad } from '../../hooks/useScratchpad';

const meta: Meta<typeof Scratchpad> = {
  title: 'Components/Scratchpad',
  component: Scratchpad,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A reorderable list of free-form notes lines. Each line is one of three kinds — `heading` (`#`), `todo` (`[ ]`/`[x]`), or `text` — rendered in a monospace, plain-text aesthetic. Lines can be dragged to reorder (mouse drag handle or `Alt+ArrowUp`/`Alt+ArrowDown` on the focused handle), edited in place (auto-growing textarea), toggled, deleted, and linked to a task via an inline `TASK` chip that reveals a hover/focus popover. With `highlightBadges`, inline `[task]`/`[qa]` tokens in a line render as colored chips when the line is not being edited (click a line to edit its raw text); `[task]` chips reveal the same task popover on hover when `taskBadgeInfo` is supplied. Every interaction is an optional callback — omit one and that affordance disappears, so a fully read-only scratchpad needs only `aria-label` and `lines`. The component is layout-agnostic and stateless; the consumer owns the line data and the open state.',
      },
    },
  },
  argTypes: {
    highlightBadges: {
      control: 'boolean',
      description:
        'Render inline `[task]`/`[qa]` tokens as colored badges (rendered when blurred, raw text when editing).',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '640px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Scratchpad>;

const lines: readonly ScratchpadLine[] = [
  { id: 'h1', text: '# Implementation Strategy' },
  {
    id: 't1',
    text: '[ ] Check race condition in cache logic when SNS invalidation fires during a write',
  },
  {
    id: 't2',
    text: '[ ] Verify TTL headers are properly inherited from origin if specified. This is a longer line to test multi-line vertical alignment of the drag handle at the top of the row.',
  },
  {
    id: 't3',
    text: 'Refactor the [task] edge-caching header mutation logic to handle multi-value headers and ensure compatibility with legacy upstream services.',
  },
  { id: 't4', text: '[x] Initial research on CloudFront function limits' },
  {
    id: 'x1',
    text: 'Debug: [qa] latency spikes observed in us-west-2 staging environment',
  },
  {
    id: 'x2',
    text: 'Note: hand the [task] to @am after the header mutation review',
  },
];

const taskBadgeInfo = {
  id: 'TSK-104',
  title: 'Implement unit tests for cache',
  status: 'Outdated',
  description: 'Ensuring all edge cases for cache invalidation are covered.',
  createdAgo: 'Created 2h ago',
  href: '#',
};

function ControlledScratchpad({
  initial,
  highlightBadges,
}: {
  initial: readonly ScratchpadLine[];
  highlightBadges?: boolean;
}) {
  const scratchpad = useScratchpad(initial);
  return (
    <Scratchpad
      aria-label="Scratchpad notes"
      title="Scratchpad / Private Notes"
      status="Auto-saving…"
      placeholder="Click to add more context…"
      highlightBadges={highlightBadges}
      taskBadgeInfo={taskBadgeInfo}
      {...scratchpad}
    />
  );
}

export const Default: Story = {
  args: { highlightBadges: true },
  render: (args) => (
    <ControlledScratchpad
      initial={lines}
      highlightBadges={args.highlightBadges}
    />
  ),
};

export const ReadOnly: Story = {
  args: {
    'aria-label': 'Scratchpad notes',
    title: 'Scratchpad / Private Notes',
    lines,
    highlightBadges: true,
    taskBadgeInfo,
  },
};

export const Empty: Story = {
  render: () => <ControlledScratchpad initial={[{ id: 'first', text: '' }]} />,
};
