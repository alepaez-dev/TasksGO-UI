import type { TicketMeta } from './shared';

export function serializeTicketBody(
  ticket: Pick<TicketMeta, 'description' | 'why' | 'scope'>,
): string {
  return [
    '## Description',
    '',
    ticket.description,
    '',
    '## Why',
    '',
    ...ticket.why.map((item) => `- ${item}`),
    '',
    '## Scope',
    '',
    '```scope',
    'included:',
    ...ticket.scope.included.items.map((item) => `- ${item}`),
    'excluded:',
    ...ticket.scope.excluded.items.map((item) => `- ${item}`),
    '```',
  ].join('\n');
}
