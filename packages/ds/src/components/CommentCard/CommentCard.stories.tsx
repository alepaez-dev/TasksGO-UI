import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { CommentCard } from './CommentCard';
import type {
  ActivityActor,
  ActivityReaction,
  ActivityReply,
} from '../../utils/activity';
import { ALEX, JORDAN, MIKE, reply } from '../../utils/activity/testFixtures';

const reactions: readonly ActivityReaction[] = [
  { emoji: '👍', count: 2, reactedByViewer: true },
];

const replies: readonly ActivityReply[] = [
  reply(JORDAN, 60, {
    at: '1h ago',
    body: "Good point — let's go with fan-out. I'll update the specs to reflect an SNS topic that fans out to SQS queues for the cache-invalidation workers.",
  }),
];

interface CommentCardStoryArgs {
  kind: 'comment' | 'ask';
  actor: ActivityActor;
  body: string;
  timestamp: ReactNode;
  query?: string;
  mentions?: readonly string[];
  replies?: readonly ActivityReply[];
  reactions?: readonly ActivityReaction[];
  answeredBy?: ActivityActor;
  pinned?: boolean;
  onReply?: () => void;
  onMarkAnswered?: () => void;
  onToggleReaction?: (emoji: string) => void;
  onAddReaction?: () => void;
  onMore?: () => void;
  onPin?: () => void;
}

const meta = {
  title: 'Components/CommentCard',
  component: CommentCard as (props: CommentCardStoryArgs) => ReactNode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comment or ask in the activity feed. Renders an `<li>` — wrap cards in a `<ul>`, which owns the spacing between them. The body is markdown, so `query` marks matching terms and handles listed in `mentions` render as mentions. `kind="ask"` tints the bubble and switches the labels; passing `answeredBy` marks it answered and replaces the resolve button. Pass `onPin` to offer the pin button; `pinned` draws the ring instead and is mutually exclusive with it.',
      },
    },
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['comment', 'ask'] },
    mentions: { control: 'object' },
    query: { control: 'text' },
    pinned: { control: 'boolean' },
  },
  args: {
    kind: 'comment',
    actor: JORDAN,
    timestamp: '4h ago',
    body: "I've started looking into the edge-caching strategy. The main challenge will be invalidating the cache effectively when the underlying data changes — I'm thinking a combination of time-based expiry and explicit invalidation triggers.\n\nDoes anyone recall if we have existing patterns for SNS topic subscriptions in the gateway service?",
  },
} satisfies Meta<CommentCardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const inFeed = (story: () => ReactNode) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxWidth: 720 }}>
    {story()}
  </ul>
);

export const Default: Story = {
  decorators: [inFeed],
  args: {
    reactions,
    onReply: () => {},
    onAddReaction: () => {},
    onMore: () => {},
  },
};

export const AnsweredAsk: Story = {
  decorators: [inFeed],
  args: {
    kind: 'ask',
    actor: ALEX,
    timestamp: '2h ago',
    body: 'For the invalidation triggers, are we planning to use a fan-out pattern or direct subscription? Fan-out might be more resilient if we add more consumers later. @jordan',
    answeredBy: JORDAN,
    mentions: ['jordan'],
    replies,
    onReply: () => {},
    onMore: () => {},
  },
};

export const OpenAsk: Story = {
  decorators: [inFeed],
  args: {
    kind: 'ask',
    actor: MIKE,
    timestamp: '40m ago',
    body: 'What TTL are we defaulting to for `/v1/assets`? QA needs a number to write the burst-threshold scenario against.',
    onReply: () => {},
    onMarkAnswered: () => {},
  },
};

export const WithSearchMatch: Story = {
  decorators: [inFeed],
  args: { query: 'cache', reactions, onReply: () => {}, onPin: () => {} },
};

export const Pinned: Story = {
  decorators: [inFeed],
  args: { pinned: true, reactions, onReply: () => {} },
};
