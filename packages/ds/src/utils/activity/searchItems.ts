import type { ActivityItem } from './types';

export interface ActivitySearchIndex {
  readonly discussion: string;
  readonly fields: string;
  readonly artifacts: string;
}

function join(parts: readonly (string | undefined)[]): string {
  return parts
    .filter((part): part is string => part !== undefined && part !== '')
    .join(' ')
    .toLowerCase();
}

export function buildSearchIndex(item: ActivityItem): ActivitySearchIndex {
  if (item.kind === 'event') {
    return {
      discussion: join([item.actor.name]),
      fields: join([
        item.summary,
        item.field,
        item.change?.from,
        item.change?.to,
      ]),
      artifacts: join(item.refs.map((ref) => ref.label)),
    };
  }

  return {
    discussion: join([
      item.actor.name,
      item.body,
      // An ask can be marked answered without a reply, so this name may be the
      // only place the answerer appears — and the UI shows it as "Answered by".
      item.kind === 'ask' ? item.answeredBy?.name : undefined,
      ...item.replies.flatMap((reply) => [reply.actor.name, reply.body]),
    ]),
    fields: '',
    artifacts: '',
  };
}

export function matchesQuery(
  index: ActivitySearchIndex,
  query: string,
): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = `${index.discussion}\n${index.fields}\n${index.artifacts}`;
  return terms.every((term) => haystack.includes(term));
}

export function searchItems(
  items: readonly ActivityItem[],
  query: string,
): ReadonlySet<string> {
  return new Set(
    items
      .filter((item) => matchesQuery(buildSearchIndex(item), query))
      .map((item) => item.id),
  );
}
