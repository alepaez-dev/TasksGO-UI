import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from './Markdown';

const kitchenSink = [
  '# Edge caching RFC',
  '',
  'Intro with **bold**, *italic*, ~~strikethrough~~, `inline code`, and a [link](https://example.com).',
  '',
  '## Description',
  '',
  'We need a caching layer at the edge for read-heavy routes to cut latency and database load.',
  '',
  '### Goals',
  '',
  '- Lower TTFB in AP-South-1',
  '- Reduce database CPU during sync windows',
  '',
  '1. Measure the baseline',
  '2. Roll out behind a flag',
  '',
  '> Staged behind `edge_cache_v1` for 5% of traffic.',
  '',
  '```ts',
  'const ttl = 60;',
  'cache.set(key, value, ttl);',
  '```',
  '',
  '| Environment | Status |',
  '| --- | --- |',
  '| QA1 | Pass |',
  '| Prod | Idle |',
  '',
  '- [x] Cache hit ratio verified',
  '- [ ] Invalidation latency under 200ms',
].join('\n');

const meta = {
  title: 'Components/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  argTypes: {
    source: { control: 'text' },
  },
  args: {
    source: kitchenSink,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Renders a markdown string to styled React elements through a stable in-house seam over `markdown-to-jsx`. Output is React elements (never `dangerouslySetInnerHTML`); raw embedded HTML is disabled and link/image URLs are routed through the design system `sanitizeHref`. All styling comes from design tokens — the library ships no CSS. GFM tables and task lists are supported.',
      },
    },
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Headings: Story = {
  args: {
    source: [
      '# Heading level 1',
      '## Heading level 2',
      '### Heading level 3',
      '#### Heading level 4',
      '##### Heading level 5',
      '###### Heading level 6',
    ].join('\n\n'),
  },
};

export const InlineFormatting: Story = {
  args: {
    source:
      'Paragraph with **bold**, *italic*, ~~strikethrough~~, `inline code`, and an [external link](https://example.com).',
  },
};

export const Lists: Story = {
  args: {
    source: [
      '- Unordered one',
      '- Unordered two',
      '  - Nested item',
      '',
      '1. Ordered one',
      '2. Ordered two',
    ].join('\n'),
  },
};

export const CodeBlock: Story = {
  args: {
    source: [
      '```ts',
      'function add(a: number, b: number) {',
      '  return a + b;',
      '}',
      '```',
    ].join('\n'),
  },
};

export const Table: Story = {
  args: {
    source: [
      '| Method | Path | Cached |',
      '| --- | --- | --- |',
      '| GET | /v1/assets | Yes |',
      '| POST | /v1/assets | No |',
    ].join('\n'),
  },
};

export const TaskList: Story = {
  args: {
    source: [
      '- [x] Verified cache hit ratio',
      '- [ ] Invalidation latency under 200ms',
      '- [ ] Browser TTL persistence',
    ].join('\n'),
  },
};

export const Scope: Story = {
  args: {
    source: [
      '```scope',
      'included:',
      '- GET /v1/assets/*',
      '- GET /v1/metadata/*',
      '- Cache invalidation via SNS',
      'excluded:',
      '- WebSocket streams',
      '- POST/PUT operations',
      '```',
    ].join('\n'),
  },
};

export const MaliciousInput: Story = {
  args: {
    source: [
      'Raw HTML is rendered as inert text, never live DOM:',
      '',
      '<script>alert(1)</script>',
      '',
      '<img src=x onerror="alert(2)">',
      '',
      'And a [dangerous link](javascript:alert(3)) is neutralized to `#`.',
    ].join('\n'),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Security posture: raw HTML never becomes live DOM and dangerous link protocols are stripped via sanitizeHref.',
      },
    },
  },
};
