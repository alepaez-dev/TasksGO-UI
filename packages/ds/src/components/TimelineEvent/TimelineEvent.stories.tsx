import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Badge } from '../Badge';
import { iconRegistry, type IconName } from '../../icons';

const iconNames = Object.keys(iconRegistry) as IconName[];

interface TimelineEventStoryArgs {
  icon: IconName;
  timestamp: ReactNode;
  variant?: 'standalone' | 'nested';
  muted?: boolean;
  pinned?: boolean;
  onPin?: () => void;
  children: ReactNode;
}

const meta = {
  title: 'Components/TimelineEvent',
  component: TimelineEvent as (props: TimelineEventStoryArgs) => ReactNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single event row in an activity timeline. Renders an `<li>` — wrap rows in a `<ul>`, which owns the spacing between them via `gap`; the row adds no margin of its own. `standalone` (default) draws the spine marker and reserves the left gutter; `nested` omits both and must sit inside a group container that supplies the indent, so it renders flush left on its own. Pass `onPin` to render the pin button — its presence is the trigger. `pinned` draws the highlight ring and is mutually exclusive with `onPin`: a pinned row carries no control, because unpinning happens in the feed’s "Clear pin" banner.',
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    variant: { control: 'inline-radio', options: ['standalone', 'nested'] },
    muted: { control: 'boolean' },
    pinned: { control: 'boolean' },
  },
  args: {
    icon: 'schedule',
    timestamp: '22h ago',
    children: 'changed status',
  },
  decorators: [
    (Story) => (
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          width: 560,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-space-timeline-event-row-gap)',
        }}
      >
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<TimelineEventStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithChangeChips: Story = {
  args: {
    children: (
      <>
        changed status <Badge variant="todo">To Do</Badge> →{' '}
        <Badge variant="progress">In Progress</Badge>
      </>
    ),
  },
};

export const Nested: Story = {
  args: { variant: 'nested', timestamp: '1d 8h ago' },
  parameters: {
    docs: {
      description: {
        story:
          'Shown flush left on purpose: a nested row carries no indent of its own. TimelineGroup supplies it, so this sits 50px left of a standalone row here. See ComposedRun for the assembled shape.',
      },
    },
  },
};

export const Muted: Story = {
  args: {
    variant: 'nested',
    muted: true,
    icon: 'task_alt',
    children: 'Build #1847 triggered automatically',
    timestamp: '1d 8h ago',
  },
  parameters: {
    docs: {
      description: {
        story:
          'De-emphasis via italic and a smaller size — deliberately not colour, since the palette has nothing dimmer than `text-secondary` that clears WCAG AA. Used in the activity feed for automated events that happened inside a person’s run: present for context, but not one of their updates.',
      },
    },
  },
};

export const Pinnable: Story = {
  args: { icon: 'tag', children: 'added label', onPin: () => {} },
};

export const Pinned: Story = {
  args: { icon: 'tag', children: 'added label', pinned: true },
};

export const ComposedRun: Story = {
  render: () => (
    <>
      <TimelineEvent icon="person" timestamp="22h ago">
        <b>Alex M.</b> assigned this ticket to <b>Jordan D.</b>
      </TimelineEvent>
      <li style={{ listStyle: 'none' }}>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-space-timeline-event-row-gap)',
            paddingLeft:
              'calc(var(--ds-space-timeline-event-gutter) + var(--ds-space-timeline-event-content-indent))',
          }}
        >
          <TimelineEvent variant="nested" icon="schedule" timestamp="1d 8h ago">
            changed status
          </TimelineEvent>
          <TimelineEvent variant="nested" icon="tag" timestamp="1d 8h ago">
            added label
          </TimelineEvent>
        </ul>
      </li>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The alignment contract: a nested row carries no indent of its own, so its icon must land in the same column as a standalone row’s. Nothing asserts this — it is only visible here.',
      },
    },
  },
};

export const LongContentWraps: Story = {
  args: {
    icon: 'person',
    children:
      'assigned this ticket to Jordan D. and added Mike R., Alex M. and three others as watchers',
  },
};
