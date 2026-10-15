import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { TimelineDivider } from './TimelineDivider';
import { TimelineEvent } from '../TimelineEvent';
import { TimelineGroup } from '../TimelineGroup';
import { Badge } from '../Badge';

interface TimelineDividerStoryArgs {
  type: 'dayDivider' | 'gapDivider';
  at?: string;
  relative?: 'today' | 'yesterday' | null;
  durationMs?: number;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  locale?: string;
}

const YESTERDAY = '2026-01-13T09:12:00.000Z';
const TODAY = '2026-01-14T08:30:00.000Z';
const LAST_WEEK = '2026-01-06T15:45:00.000Z';

const FEED_PADDING = 24;

const meta = {
  title: 'Components/TimelineDivider',
  component: TimelineDivider as unknown as (
    props: TimelineDividerStoryArgs,
  ) => ReactNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Marks a break in the activity feed. Renders an `<li>`, so it drops straight into the feed’s `<ul>` alongside `TimelineEvent` and `TimelineGroup`. Its props mirror the divider nodes `withDividers` emits, so a page can spread one in: `<TimelineDivider {...node} />`. A day divider reads "Jan 13 · Yesterday", falling back to the date alone once a day is older than yesterday. A gap divider reports the time skipped and is worded without direction — dividers are recomputed for the active sort, so "later" would be wrong under newest-first. The hairline uses `border-default`, one step lighter than the `border-strong` spine and markers: the spine has to read as one continuous thread, a rule only terminates a label.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['dayDivider', 'gapDivider'] },
    at: { control: 'text' },
    relative: {
      control: 'select',
      options: ['today', 'yesterday', 'none (older)'],
      mapping: {
        today: 'today',
        yesterday: 'yesterday',
        'none (older)': null,
      },
    },
    durationMs: { control: 'number' },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    locale: {
      control: 'select',
      options: ['en-US', 'en-GB', 'de-DE', 'ja-JP'],
    },
  },
  args: {
    type: 'dayDivider',
    at: YESTERDAY,
    relative: 'yesterday',
  },
  decorators: [
    (Story) => (
      <ul
        style={{
          position: 'relative',
          listStyle: 'none',
          margin: 0,
          background: 'var(--ds-color-surface-secondary)',
          padding: FEED_PADDING,
          width: 620,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-space-timeline-event-row-gap)',
        }}
      >
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<TimelineDividerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Yesterday: Story = {};

export const Today: Story = {
  args: { at: TODAY, relative: 'today' },
};

export const EarlierDate: Story = {
  args: { at: LAST_WEEK, relative: null },
  parameters: {
    docs: {
      description: {
        story:
          'Anything older than yesterday has no relative name, so the date stands alone — no trailing separator with nothing after it.',
      },
    },
  },
};

export const Gap: Story = {
  args: { type: 'gapDivider', durationMs: 4 * 60 * 60 * 1000 },
  parameters: {
    docs: {
      description: {
        story:
          'Emitted when consecutive nodes sit `gapMs` apart within the same day — across a day the day divider already marks the break. The unit is attributive, so it stays singular: "4 hour gap", not "4 hours gap".',
      },
    },
  },
};

export const ShortGap: Story = {
  args: { type: 'gapDivider', durationMs: 45 * 60 * 1000 },
  parameters: {
    docs: {
      description: {
        story:
          '`GAP_DIVIDER_MS` defaults to four hours, but `withDividers` takes a `gapMs` override, so sub-hour gaps reach this component in real feeds.',
      },
    },
  },
};

const RUNS = [
  {
    id: 'a',
    count: 8,
    summary: 'Jordan D. performed 8 updates',
    meta: '· status, description, labels · 1d 8h ago',
  },
  {
    id: 'b',
    count: 2,
    summary: 'Jordan D. performed 2 updates',
    meta: '· labels, sprint · 1d 2h ago',
  },
  {
    id: 'c',
    count: 2,
    summary: 'Jordan D. performed 2 updates',
    meta: '· status, description · 23h ago',
  },
] as const;

function RichFeed() {
  const [openId, setOpenId] = useState<string | null>(null);
  const renderRun = (runData: (typeof RUNS)[number]) => {
    return (
      <TimelineGroup
        count={runData.count}
        summary={
          <>
            <b>Jordan D.</b> performed {runData.count} updates
          </>
        }
        meta={runData.meta}
        open={openId === runData.id}
        onOpenChange={(next) => setOpenId(next ? runData.id : null)}
      >
        <TimelineEvent variant="nested" icon="schedule" timestamp="1d 8h ago">
          changed status <Badge variant="todo">To Do</Badge> →{' '}
          <Badge variant="progress">In Progress</Badge>
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="edit" timestamp="1d 8h ago">
          updated the description
        </TimelineEvent>
      </TimelineGroup>
    );
  };

  return (
    <>
      <li
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `calc(${FEED_PADDING}px + var(--ds-space-timeline-event-gutter) / 2)`,
          transform: 'translateX(-50%)',
          top: FEED_PADDING,
          bottom: FEED_PADDING,
          width: 1,
          background: 'var(--ds-color-border-strong)',
        }}
      />
      <TimelineDivider type="dayDivider" at={YESTERDAY} relative="yesterday" />
      {renderRun(RUNS[0])}
      <TimelineDivider type="gapDivider" durationMs={6 * 60 * 60 * 1000} />
      {renderRun(RUNS[1])}
      {renderRun(RUNS[2])}
      <TimelineEvent icon="person" timestamp="22h ago">
        <b>Alex M.</b> assigned ticket to <b>Jordan D.</b>
      </TimelineEvent>
      <TimelineEvent icon="tag" timestamp="21h ago">
        <b>Jordan D.</b> added label{' '}
        <Badge variant="progress">edge-cache</Badge>
      </TimelineEvent>
      <TimelineDivider type="dayDivider" at={TODAY} relative="today" />
      <TimelineEvent icon="comment_filled" timestamp="4h ago">
        <b>Jordan D.</b> commented
      </TimelineEvent>
    </>
  );
}

export const InAFeed: Story = {
  render: () => <RichFeed />,
  parameters: {
    docs: {
      description: {
        story:
          'A day heading anchors left; a gap sits centred between two rules, because it names a distance rather than a place. The runs are collapsed — click one to open it. The alignment contract is visible here too: every divider label, row icon and group pill shares one 50px column.',
      },
    },
  },
};
