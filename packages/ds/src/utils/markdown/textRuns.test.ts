import { describe, it, expect } from 'vitest';
import { textRuns } from './textRuns';

describe('textRuns', () => {
  it('returns text nodes in document order with no separators', () => {
    expect(textRuns('edge-**cache** here')).toEqual([
      'edge-',
      'cache',
      ' here',
    ]);
  });

  it('keeps the spaces stranded between formatted runs', () => {
    expect(textRuns('**one** **two**')).toEqual(['one', ' ', 'two']);
  });

  it('includes code spans', () => {
    expect(textRuns('use `needs-qa` please')).toEqual([
      'use ',
      'needs-qa',
      ' please',
    ]);
  });

  it('includes fenced blocks', () => {
    expect(textRuns('```js\nconst a = 1\n```')).toEqual(['const a = 1']);
  });

  it('skips scope blocks, which render as a card rather than text', () => {
    expect(textRuns('```scope\nIncluded:\n- login flow\n```')).toEqual([]);
  });

  it('joins back to the text a reader sees within a block', () => {
    expect(textRuns('edge-**cache** here').join('')).toBe('edge-cache here');
  });

  it('produces no runs for an empty body', () => {
    expect(textRuns('').join('')).toBe('');
  });
});
