import type {
  ActivityActor,
  ActivityItem,
  ActivityReactor,
} from '../../../index';

export const ACTIVITY_NOW = '2026-01-14T18:00:00.000Z';

const ago = (minutes: number): string =>
  new Date(Date.parse(ACTIVITY_NOW) - minutes * 60_000).toISOString();

const jordan: ActivityActor = {
  id: 'jd',
  name: 'Jordan D.',
  initial: 'JD',
  kind: 'human',
  tint: '#4F6F8F',
};
const alex: ActivityActor = {
  id: 'am',
  name: 'Alex M.',
  initial: 'AM',
  kind: 'human',
  tint: '#856D4A',
};
const mike: ActivityActor = {
  id: 'mr',
  name: 'Mike R.',
  initial: 'MR',
  kind: 'human',
  tint: '#7560C2',
};
const ci: ActivityActor = {
  id: 'ci',
  name: 'CI',
  initial: 'CI',
  kind: 'system',
};

export const ACTIVITY_VIEWER_ACTOR: ActivityActor = jordan;

export const ACTIVITY_VIEWER: ActivityReactor = {
  id: ACTIVITY_VIEWER_ACTOR.id,
  name: ACTIVITY_VIEWER_ACTOR.name,
};

const sam: ActivityReactor = { id: 'sk', name: 'Sam K.' };
const alexReactor: ActivityReactor = { id: alex.id, name: alex.name };

export const ACTIVITY_MENTIONS = ['jordan', 'alex', 'mike'];

export const activityItems: readonly ActivityItem[] = [
  {
    kind: 'comment',
    id: 'c1',
    at: ago(240),
    actor: jordan,
    body: "I've started looking into the edge-caching strategy. The main challenge will be invalidating the cache effectively when the underlying data changes — I'm thinking a combination of time-based expiry and explicit invalidation triggers.\n\nDoes anyone recall if we have existing patterns for SNS topic subscriptions in the gateway service?",
    reactions: [
      {
        emoji: '👍',
        count: 2,
        reactedByViewer: true,
        actors: [ACTIVITY_VIEWER, sam],
      },
    ],
    replies: [],
    attachments: [],
  },
  {
    kind: 'event',
    id: 'e-status',
    at: ago(180),
    actor: jordan,
    icon: 'schedule',
    summary: 'changed status',
    field: 'status',
    change: { from: 'To Do', to: 'In Progress' },
    refs: [],
  },
  {
    kind: 'event',
    id: 'e-desc',
    at: ago(178),
    actor: jordan,
    icon: 'edit',
    summary: 'updated the description',
    field: 'description',
    refs: [],
  },
  {
    kind: 'event',
    id: 'e-label',
    at: ago(176),
    actor: jordan,
    icon: 'tag',
    summary: 'added label edge-cache',
    field: 'labels',
    refs: [],
  },
  {
    kind: 'ask',
    id: 'a1',
    at: ago(120),
    actor: alex,
    body: 'For the invalidation triggers, are we planning to use a fan-out pattern or direct subscription? Fan-out might be more resilient if we add more consumers later. @jordan',
    answeredBy: jordan,
    reactions: [
      { emoji: '🙌', count: 1, reactedByViewer: false, actors: [sam] },
    ],
    replies: [
      {
        id: 'r1',
        at: ago(60),
        actor: jordan,
        body: "Good point — let's go with fan-out. I'll update the specs to reflect an SNS topic that fans out to SQS queues for the cache-invalidation workers.",
      },
    ],
    attachments: [],
  },
  {
    kind: 'event',
    id: 'e-assign',
    at: ago(118),
    actor: alex,
    icon: 'person',
    summary: 'assigned this ticket to Jordan D.',
    field: 'assignee',
    refs: [],
  },
  {
    kind: 'ask',
    id: 'a2',
    at: ago(40),
    actor: mike,
    body: 'What TTL are we defaulting to for `/v1/assets`? QA needs a number to write the burst-threshold scenario against.',
    reactions: [
      {
        emoji: '👀',
        count: 2,
        reactedByViewer: false,
        actors: [sam, alexReactor],
      },
    ],
    replies: [],
    attachments: [],
  },
  {
    kind: 'event',
    id: 'e-build',
    at: ago(34),
    actor: ci,
    icon: 'check_circle',
    summary: 'Build #1847 passed on QA-01',
    refs: [],
  },
  {
    kind: 'event',
    id: 'e-deploy',
    at: ago(32),
    actor: ci,
    icon: 'science',
    summary: 'deployed to QA-01',
    field: 'environment',
    refs: [],
  },
  {
    kind: 'event',
    id: 'e-qa',
    at: ago(30),
    actor: ci,
    icon: 'task_alt',
    summary: 'QA run finished — 12 passed, 1 waived',
    refs: [],
  },
  {
    kind: 'comment',
    id: 'c2',
    at: ago(20),
    actor: jordan,
    body: 'Attaching the k6 load-test run against staging — p95 dropped from 412ms to 96ms with the edge cache on. Raw results in the CSV.',
    reactions: [],
    replies: [],
    attachments: [
      { id: 'f1', name: 'k6-p95-latency.png', kind: 'image' },
      { id: 'f2', name: 'k6-staging-run-0412.csv', kind: 'file' },
    ],
  },
];
