import type { ActivityGroup } from './types';

/**
 * How many actions a group's pill should report — the actions belonging to
 * whoever the run is attributed to.
 */
export function countActions(group: ActivityGroup): number {
  return group.actor.kind === 'system'
    ? group.items.length
    : group.items.filter((event) => event.actor.kind === 'human').length;
}
