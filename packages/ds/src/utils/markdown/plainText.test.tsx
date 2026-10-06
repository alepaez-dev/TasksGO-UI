import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Markdown } from '../../components/Markdown';
import { plainText } from './plainText';
import { textRuns } from './textRuns';

const BODIES = [
  'edge-**cache** here',
  'QA **needs** a number',
  'use `needs-qa` please',
  '# Title\n\nsome *body* text',
  '- one\n- two',
  '1. first\n2. second',
  '> quoted **text**',
  '[needs doc](http://example.com)',
  'edge-<strong>cache</strong> here',
  '```js\nconst a = 1\n```',
];

function visibleChars(value: string): string {
  return value.replace(/\s+/g, '');
}

function rendered(source: string): string {
  const { container } = render(<Markdown source={source} />);
  return container.textContent ?? '';
}

describe('plainText', () => {
  it('strips emphasis so a term split by formatting is still findable', () => {
    expect(plainText('edge-**cache** here')).toBe('edge-cache here');
  });

  it('keeps code spans and fenced blocks', () => {
    expect(plainText('use `needs-qa` please')).toBe('use needs-qa please');
    expect(plainText('```js\nconst a = 1\n```')).toBe('const a = 1');
  });

  it('keeps raw HTML as written, because the renderer shows it literally', () => {
    expect(plainText('edge-<strong>cache</strong> here')).toBe(
      'edge-<strong>cache</strong> here',
    );
  });

  it('separates blocks and list items so words do not run together', () => {
    expect(plainText('# Title\n\nsome text')).toBe('Title\nsome text');
    expect(plainText('- one\n- two')).toBe('one\ntwo');
  });

  it('indexes link text, not the href', () => {
    expect(plainText('[needs doc](http://example.com)')).toBe('needs doc');
    expect(plainText('[needs doc](http://example.com)')).not.toContain('http');
  });

  it('indexes footnote text, which is rendered in the footer', () => {
    expect(
      plainText('cheaper[^1].\n\n[^1]: we measured 40% fewer SQS calls'),
    ).toContain('SQS');
  });

  it('indexes scope block text, which ScopeBlock shows but highlighting cannot mark', () => {
    const source =
      '```scope\nIncluded:\n- login flow\nExcluded:\n- billing\n```';
    expect(plainText(source)).toContain('login flow');
    expect(textRuns(source)).toEqual([]);
  });

  it('returns an empty string for an empty body', () => {
    expect(plainText('')).toBe('');
  });

  it.each(BODIES)('indexes exactly what Markdown renders for %j', (source) => {
    expect(visibleChars(plainText(source))).toBe(
      visibleChars(rendered(source)),
    );
  });
});
