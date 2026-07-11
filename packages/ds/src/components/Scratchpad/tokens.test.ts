import { describe, it, expect } from 'vitest';
import { splitLineTokens } from './tokens';

describe('splitLineTokens', () => {
  it('splits a line into text runs and token segments', () => {
    const segs = splitLineTokens('l1', 'Do [task] then [QA] it');
    expect(segs).toEqual([
      { type: 'text', key: 'l1:t0', value: 'Do ' },
      { type: 'token', id: 'l1#0', tokenKey: 'task' },
      { type: 'text', key: 'l1:t1', value: ' then ' },
      { type: 'token', id: 'l1#1', tokenKey: 'qa' },
      { type: 'text', key: 'l1:t2', value: ' it' },
    ]);
  });

  it('keys tokens by occurrence index, not character offset', () => {
    const segs = splitLineTokens('l1', '[task][task]');
    expect(
      segs
        .filter((s) => s.type === 'token')
        .map((s) => (s as { id: string }).id),
    ).toEqual(['l1#0', 'l1#1']);
  });

  it('returns a single text run when there are no tokens', () => {
    expect(splitLineTokens('l1', 'plain text')).toEqual([
      { type: 'text', key: 'l1:t0', value: 'plain text' },
    ]);
  });
});
