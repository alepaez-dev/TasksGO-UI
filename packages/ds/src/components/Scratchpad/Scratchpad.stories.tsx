import type { Meta, StoryObj } from '@storybook/react';
import { Scratchpad, type ScratchpadLine } from './Scratchpad';
import { useScratchpad } from '../../hooks/useScratchpad';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';

const meta: Meta<typeof Scratchpad> = {
  title: 'Components/Scratchpad',
  component: Scratchpad,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "A reorderable list of free-form Markdown notes in a monospace aesthetic. Each line's raw text renders as inline Markdown — `#` headings, `**bold**`/`*italic*`/`` `code` ``, and sanitized links — while leading `[ ]`/`[x]` become interactive todo checkboxes. Lines can be dragged to reorder (mouse drag handle or `Alt+ArrowUp`/`Alt+ArrowDown` on the focused handle); clicking a line swaps it to a raw-text editor (auto-growing textarea), and blurring returns it to the rendered view. With `highlightBadges`, inline `[task]`/`[qa]` tokens render as colored chips; `[task]` reveals a task popover on hover/focus when `taskBadgeInfo` is supplied. Every interaction is an optional callback — omit one and that affordance disappears, so a fully read-only scratchpad needs only `aria-label` and `lines`. The component is layout-agnostic and stateless; the consumer owns the line data and the open state.",
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
    (Story, context) =>
      context.parameters.layout === 'fullscreen' ? (
        // App-shell layout: the shell fills the viewport and does NOT scroll;
        // the notes scroll in an inner region. This keeps the page static so
        // the keyboard-docked toolbar (position: fixed) stays put on iOS
        // instead of drifting with a scrolling document.
        <div
          style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Story />
          </div>
        </div>
      ) : (
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
    text: '[ ] Verify **TTL** headers are inherited from origin — see [caching RFC](https://example.com/rfc)',
  },
  {
    id: 't3',
    text: 'Refactor the [task] edge-caching header mutation logic to handle multi-value headers and ensure compatibility with legacy upstream services.',
  },
  { id: 't4', text: '[x] Initial research on *CloudFront* function limits' },
  {
    id: 'x1',
    text: 'Debug: [qa] latency spikes observed in `us-west-2` staging environment',
  },
  {
    id: 'x2',
    text: 'Note: hand the [task] to **@am** after the header mutation review',
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

function MobileScratchpad({ initial }: { initial: readonly ScratchpadLine[] }) {
  const scratchpad = useScratchpad(initial);
  return (
    <Scratchpad
      aria-label="Scratchpad notes"
      title="Scratchpad / Private Notes"
      status="Auto-saving…"
      highlightBadges
      formattingToolbar
      taskCardPresentation="sheet"
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

export const Mobile: Story = {
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: mobileViewportOptions },
    docs: {
      description: {
        story:
          'Touch layout: the "add context" affordance is always visible, the task chip opens a bottom sheet, and the formatting toolbar docks above the keyboard while editing a line.',
      },
    },
  },
  render: () => <MobileScratchpad initial={lines} />,
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

export const Headings: Story = {
  render: () => (
    <ControlledScratchpad
      initial={[
        { id: 'g1', text: '# Heading 1' },
        { id: 'g2', text: '## Heading 2' },
        { id: 'g3', text: '### Heading 3' },
        { id: 'g4', text: '#### Heading 4' },
        { id: 'gb', text: 'Body text for comparison' },
      ]}
    />
  ),
};

export const MultiLineRow: Story = {
  render: () => (
    <ControlledScratchpad
      highlightBadges
      initial={[
        {
          id: 'r1',
          text: 'A soft-break row keeps one heading level:',
        },
        {
          id: 'r2',
          text: '# header 1\n## header 2\n### header 3\n#### header 4',
        },
        {
          id: 'r3',
          text: 'Only the first marker is stripped; later lines stay literal.',
        },
      ]}
    />
  ),
};
