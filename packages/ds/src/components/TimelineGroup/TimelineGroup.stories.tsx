import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import { TimelineGroup } from './TimelineGroup';
import { TimelineEvent } from '../TimelineEvent';
import { Badge } from '../Badge';

interface TimelineGroupStoryArgs {
  count: number;
  summary: ReactNode;
  meta?: ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  matchLabel?: ReactNode;
  moreLabel?: ReactNode;
  children: ReactNode;
}

const meta = {
  title: 'Components/TimelineGroup',
  component: TimelineGroup as (props: TimelineGroupStoryArgs) => ReactNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A collapsed run of consecutive events by one person, or of automated events with no person behind them. Renders an `<li>` — wrap it in the feed’s `<ul>`. Takes `TimelineEvent` rows as children rather than data, so the page decides which are muted, pinned or highlighted. `count` is the actions belonging to whoever the run is attributed to — use `countActions(group)`. For a person that excludes system extras, so eight updates plus an automated build reads "8 updates" over nine rows; a run with no person behind it counts every row, reading "4 system events". Rows are unmounted while collapsed, not hidden. Long runs are capped by the page, which passes `moreLabel` and `onMoreToggle`.',
      },
    },
  },
  argTypes: {
    count: { control: { type: 'number', min: 1 } },
    summary: { control: 'text' },
    meta: { control: 'text' },
    open: { control: 'boolean' },
    matchLabel: { control: 'text' },
    moreLabel: { control: 'text' },
    // Owned by the page, or by the story's own state on the interactive ones —
    // a control here would render and then do nothing.
    onOpenChange: { control: false },
    children: { control: false },
  },
  args: {
    count: 2,
    summary: 'Jordan D. performed 2 updates',
    meta: '· labels, sprint · 1d 2h ago',
    open: false,
  },
  decorators: [
    (Story) => (
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          background: 'var(--ds-color-surface-secondary)',
          padding: 24,
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
} satisfies Meta<TimelineGroupStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const twoRows: ReactNode = (
  <>
    <TimelineEvent variant="nested" icon="tag" timestamp="1d 2h ago">
      added label <Badge variant="progress">needs-qa</Badge>
    </TimelineEvent>
    <TimelineEvent variant="nested" icon="schedule" timestamp="1d 2h ago">
      set sprint to <Badge variant="progress">Q1-W4-INFRA</Badge>
    </TimelineEvent>
  </>
);

function Interactive({ moreLabel, ...args }: TimelineGroupStoryArgs) {
  const [open, setOpen] = useState(args.open);
  const [showAll, setShowAll] = useState(false);
  const more =
    moreLabel === undefined
      ? {}
      : {
          moreLabel: showAll ? 'Show less' : moreLabel,
          onMoreToggle: () => setShowAll((v) => !v),
          moreExpanded: showAll,
        };

  return (
    <TimelineGroup {...args} {...more} open={open} onOpenChange={setOpen}>
      {args.children}
      {showAll && (
        <TimelineEvent variant="nested" icon="person" timestamp="1d 8h ago">
          added <b>Mike R.</b> as a watcher
        </TimelineEvent>
      )}
    </TimelineGroup>
  );
}

export const Collapsed: Story = {
  render: (args) => <Interactive key={String(args.open)} {...args} />,
  args: { children: twoRows },
  parameters: {
    docs: {
      description: {
        story: 'Interactive — the toggle really opens and closes.',
      },
    },
  },
};

export const Open: Story = {
  args: { open: true, children: twoRows },
};

export const WithSystemExtra: Story = {
  args: {
    open: true,
    count: 2,
    summary: 'Jordan D. performed 2 updates',
    meta: '· status, description · 1d 8h ago',
    children: (
      <>
        <TimelineEvent variant="nested" icon="schedule" timestamp="1d 8h ago">
          changed status <Badge variant="todo">To Do</Badge> →{' '}
          <Badge variant="progress">In Progress</Badge>
        </TimelineEvent>
        <TimelineEvent
          variant="nested"
          muted
          icon="task_alt"
          timestamp="1d 8h ago"
        >
          Build #1847 triggered automatically
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="edit" timestamp="1d 8h ago">
          updated the description
        </TimelineEvent>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The count says 2, not 3. The automated build happened inside Jordan’s run and is shown for context, but it is not one of his updates — matching the mockup, whose pill reads "8 updates" over nine rows.',
      },
    },
  },
};

export const Capped: Story = {
  render: (args) => <Interactive key={String(args.open)} {...args} />,
  args: {
    open: true,
    count: 9,
    summary: 'Jordan D. performed 9 updates',
    meta: '· status, description, labels · 1d 8h ago',
    moreLabel: 'Show 5 more',
    children: twoRows,
  },
};

export const Matching: Story = {
  args: {
    open: true,
    matchLabel: '1 of 2 match',
    children: twoRows,
  },
  parameters: {
    docs: {
      description: {
        story:
          'While a search is active, a group holding a match expands and reports how many of its rows matched.',
      },
    },
  },
};

export const LongSummary: Story = {
  args: {
    open: false,
    summary: 'Bartholomew Featherstonehaugh-Wellesley performed 14 updates',
    meta: '· status, description, labels, sprint, priority · 1d 8h ago',
    children: twoRows,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Both slots truncate rather than wrap: the pill is a stadium and only reads as one on a single line. The meta gives way before the actor and the action do, and the count, chevron and match chip never shrink.',
      },
    },
  },
};

export const SystemOnly: Story = {
  args: {
    open: true,
    count: 4,
    summary: '4 system events',
    meta: '· CI, deploys, QA runs · 20m ago',
    children: (
      <>
        <TimelineEvent variant="nested" icon="task_alt" timestamp="34m ago">
          Build <b>#1847</b> passed on <b>QA-01</b>
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="science" timestamp="28m ago">
          QA scenario <b>TC-412</b> marked Failed
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="file_upload" timestamp="24m ago">
          Deployed <b>edge-gateway-service</b> to <b>QA-02</b>
        </TimelineEvent>
        <TimelineEvent variant="nested" icon="image" timestamp="20m ago">
          Evidence <b>rate_429.png</b> attached to TC-412
        </TimelineEvent>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A run with no person behind it is never attributed to one: it reads "4 system events", not a bot’s name. `ActivityGroup.actor` holds whichever bot happened to be first, so naming it would credit a deploy to CI.',
      },
    },
  },
};
