import type { ActivityEvent, ActivityItem, ActivityNode } from './types';
import { toLocalDayNumber } from './localDay';

/** Default only — callers override per feed via `groupItems(items, { gapMs })`. */
export const GROUP_GAP_MS = 30 * 60 * 1000;

export interface GroupItemsOptions {
  readonly gapMs?: number;
}

function changedFields(events: readonly ActivityEvent[]): string[] {
  const fields: string[] = [];
  for (const event of events) {
    if (event.field !== undefined && !fields.includes(event.field)) {
      fields.push(event.field);
    }
  }
  return fields;
}

function toGroup(events: readonly ActivityEvent[]): ActivityNode {
  const owner =
    events.find((event) => event.actor.kind === 'human')?.actor ??
    events[0].actor;
  return {
    type: 'group',
    id: `group-${events[0].id}`,
    actor: owner,
    items: events,
    fields: changedFields(events),
  };
}

export function groupItems(
  items: readonly ActivityItem[],
  { gapMs = GROUP_GAP_MS }: GroupItemsOptions = {},
): ActivityNode[] {
  const nodes: ActivityNode[] = [];
  let run: ActivityEvent[] = [];
  let runActorId: string | null = null;
  let lastHumanAt: number | null = null;
  let lastHumanDay: number | null = null;
  let pending: ActivityEvent[] = [];

  function emit(events: readonly ActivityEvent[]): void {
    if (events.length === 0) return;
    nodes.push(
      events.length === 1 ? { type: 'item', item: events[0] } : toGroup(events),
    );
  }

  function emitOrphanedSystemRuns(events: readonly ActivityEvent[]): void {
    let current: ActivityEvent[] = [];
    for (const event of events) {
      const last = current[current.length - 1];
      if (
        last !== undefined &&
        (Math.abs(Date.parse(event.at) - Date.parse(last.at)) >= gapMs ||
          toLocalDayNumber(event.at) !== toLocalDayNumber(last.at))
      ) {
        emit(current);
        current = [];
      }
      current.push(event);
    }
    emit(current);
  }

  function closeRun(): void {
    emit(run);
    emitOrphanedSystemRuns(pending);
    run = [];
    pending = [];
    runActorId = null;
    lastHumanAt = null;
    lastHumanDay = null;
  }

  for (const item of items) {
    if (item.kind !== 'event') {
      closeRun();
      nodes.push({ type: 'item', item });
      continue;
    }

    if (item.actor.kind === 'system') {
      pending.push(item);
      continue;
    }

    const at = Date.parse(item.at);
    const day = toLocalDayNumber(item.at);
    const continuesRun =
      runActorId === item.actor.id &&
      lastHumanAt !== null &&
      Math.abs(at - lastHumanAt) < gapMs &&
      lastHumanDay === day;

    if (continuesRun) {
      run = [...run, ...pending, item];
      pending = [];
    } else {
      closeRun();
      run = [item];
      runActorId = item.actor.id;
    }
    lastHumanAt = at;
    lastHumanDay = day;
  }

  closeRun();
  return nodes;
}
