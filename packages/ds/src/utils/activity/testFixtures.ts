import type {
  ActivityActor,
  ActivityAsk,
  ActivityComment,
  ActivityEvent,
} from './types';

export const JORDAN: ActivityActor = {
  id: 'jd',
  name: 'Jordan D.',
  initial: 'J',
  kind: 'human',
};

export const ALEX: ActivityActor = {
  id: 'am',
  name: 'Alex M.',
  initial: 'A',
  kind: 'human',
};

export const CI: ActivityActor = {
  id: 'ci',
  name: 'CI',
  initial: 'C',
  kind: 'system',
};

export const DEPLOY: ActivityActor = {
  id: 'deploy',
  name: 'Deploy Bot',
  initial: 'D',
  kind: 'system',
};

export const FIXTURE_BASE = Date.parse('2026-01-14T12:00:00.000Z');

export function at(minutes: number): string {
  return new Date(FIXTURE_BASE + minutes * 60_000).toISOString();
}

export function event(
  actor: ActivityActor,
  minutes: number,
  overrides: Partial<ActivityEvent> = {},
): ActivityEvent {
  return {
    kind: 'event',
    id: `${actor.id}-${minutes}`,
    at: at(minutes),
    actor,
    icon: 'schedule',
    summary: 'changed status',
    field: 'status',
    refs: [],
    ...overrides,
  };
}

export function comment(
  actor: ActivityActor,
  minutes: number,
  overrides: Partial<ActivityComment> = {},
): ActivityComment {
  return {
    kind: 'comment',
    id: `c-${actor.id}-${minutes}`,
    at: at(minutes),
    actor,
    body: 'hello',
    reactions: [],
    replies: [],
    ...overrides,
  };
}

export function ask(
  actor: ActivityActor,
  minutes: number,
  overrides: Partial<ActivityAsk> = {},
): ActivityAsk {
  return {
    kind: 'ask',
    id: `a-${actor.id}-${minutes}`,
    at: at(minutes),
    actor,
    body: 'what TTL?',
    reactions: [],
    replies: [],
    ...overrides,
  };
}
