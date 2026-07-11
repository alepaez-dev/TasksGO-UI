import { describe, it, expect } from 'vitest';
import { parseLine, toggleChecked } from './parseLine';

describe('parseLine', () => {
  it('parses a heading', () => {
    expect(parseLine('# Title')).toEqual({
      kind: 'heading',
      checked: false,
      contentStart: 0,
    });
  });

  it('parses an unchecked todo', () => {
    expect(parseLine('[ ] Do the thing')).toEqual({
      kind: 'todo',
      checked: false,
      contentStart: 4,
    });
  });

  it('parses a checked todo (case-insensitive)', () => {
    expect(parseLine('[X] Done')).toMatchObject({
      kind: 'todo',
      checked: true,
    });
  });

  it('treats anything else as text', () => {
    expect(parseLine('Debug: latency spike')).toEqual({
      kind: 'text',
      checked: false,
      contentStart: 0,
    });
  });

  it('does not treat a bare # without a space as a heading', () => {
    expect(parseLine('#tag').kind).toBe('text');
  });

  it('parses `##`–`######` as headings (aligned with the renderer)', () => {
    expect(parseLine('## Subheading').kind).toBe('heading');
    expect(parseLine('###### Deep').kind).toBe('heading');
  });

  it('does not treat 7+ hashes as a heading (matches the renderer cap)', () => {
    expect(parseLine('####### x').kind).toBe('text');
  });
});

describe('toggleChecked', () => {
  it('checks an unchecked todo', () => {
    expect(toggleChecked('[ ] Do it')).toBe('[x] Do it');
  });

  it('unchecks a checked todo', () => {
    expect(toggleChecked('[x] Done')).toBe('[ ] Done');
  });

  it('leaves non-todo text unchanged', () => {
    expect(toggleChecked('# Heading')).toBe('# Heading');
  });
});
