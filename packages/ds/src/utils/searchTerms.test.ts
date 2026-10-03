import { describe, it, expect } from 'vitest';
import { parseSearchTerms } from './searchTerms';

describe('parseSearchTerms', () => {
  it('lower-cases every term', () => {
    expect(parseSearchTerms('Jordan QA')).toEqual(['jordan', 'qa']);
  });

  it('splits on runs of whitespace', () => {
    expect(parseSearchTerms('edge   cache\tqa')).toEqual([
      'edge',
      'cache',
      'qa',
    ]);
  });

  it('drops the empties that leading and trailing space produce', () => {
    expect(parseSearchTerms('  needs  ')).toEqual(['needs']);
  });

  it('returns nothing for an empty query', () => {
    expect(parseSearchTerms('')).toEqual([]);
  });

  it('returns nothing for a whitespace-only query', () => {
    expect(parseSearchTerms('   ')).toEqual([]);
  });
});
