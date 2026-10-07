import { describe, it, expect } from 'vitest';
import { mentionRanges } from './mentionRanges';

const TEAM = ['jordan', 'alex-m', 'acme'];
const found = (text: string, handles: readonly string[] = TEAM) =>
  mentionRanges(text, handles).map((r) => text.slice(r.start, r.end));

describe('mentionRanges', () => {
  it('finds a known handle and includes the @', () => {
    expect(found('ping @jordan here')).toEqual(['@jordan']);
  });

  it('finds every known handle in the line', () => {
    expect(found('@jordan and @alex-m ship it')).toEqual([
      '@jordan',
      '@alex-m',
    ]);
  });

  it('ignores a handle nobody on the list goes by', () => {
    expect(found('npm i @tasksgo/ui')).toEqual([]);
  });

  it('marks nothing when no handles are known', () => {
    expect(found('ping @jordan here', [])).toEqual([]);
  });

  it('matches a handle regardless of case', () => {
    expect(found('ping @Jordan here')).toEqual(['@Jordan']);
  });

  it('does not treat an email address as a mention', () => {
    expect(found('mail me at jordan@example.com')).toEqual([]);
  });

  it('does not break a word on a non-ascii letter before the @', () => {
    expect(found('josé@acme.com')).toEqual([]);
  });

  it('ignores a bare @ with no handle', () => {
    expect(found('rates are 5 @ noon, ask @')).toEqual([]);
  });

  it('finds a handle at the very start', () => {
    expect(found('@jordan opened this')).toEqual(['@jordan']);
  });

  it('stops the handle at punctuation', () => {
    expect(found('thanks @jordan!')).toEqual(['@jordan']);
  });
});
