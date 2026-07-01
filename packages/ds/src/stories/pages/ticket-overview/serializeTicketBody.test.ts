import { describe, it, expect } from 'vitest';
import { serializeTicketBody } from './serializeTicketBody';

const content = {
  description: 'A caching layer at the edge.',
  why: ['Lower TTFB', 'Reduce DB load'],
  scope: {
    included: { title: 'Included', items: ['GET /v1/assets/*'] },
    excluded: { title: 'Excluded', items: ['WebSocket streams'] },
  },
};

describe('serializeTicketBody', () => {
  it('serializes description, why and scope into seed markdown', () => {
    expect(serializeTicketBody(content)).toBe(
      [
        '## Description',
        '',
        'A caching layer at the edge.',
        '',
        '## Why',
        '',
        '- Lower TTFB',
        '- Reduce DB load',
        '',
        '## Scope',
        '',
        '```scope',
        'included:',
        '- GET /v1/assets/*',
        'excluded:',
        '- WebSocket streams',
        '```',
      ].join('\n'),
    );
  });

  it('round-trips: the scope fence parses back to the original items', () => {
    const md = serializeTicketBody(content);
    expect(md).toContain('```scope\nincluded:\n- GET /v1/assets/*');
    expect(md).toContain('excluded:\n- WebSocket streams\n```');
  });
});
