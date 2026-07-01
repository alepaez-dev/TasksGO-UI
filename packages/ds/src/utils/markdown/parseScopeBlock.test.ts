import { describe, it, expect } from 'vitest';
import { parseScopeBlock } from './parseScopeBlock';

describe('parseScopeBlock', () => {
  it('parses included and excluded sections with dash markers', () => {
    const result = parseScopeBlock(
      [
        'included:',
        '- GET /v1/assets/*',
        '- GET /v1/metadata/*',
        'excluded:',
        '- WebSocket streams',
      ].join('\n'),
    );
    expect(result.included).toEqual(['GET /v1/assets/*', 'GET /v1/metadata/*']);
    expect(result.excluded).toEqual(['WebSocket streams']);
  });

  it('accepts *, + and missing list markers', () => {
    const result = parseScopeBlock(
      ['included:', '* one', '+ two', 'three'].join('\n'),
    );
    expect(result.included).toEqual(['one', 'two', 'three']);
  });

  it('is case-insensitive for headers and tolerates no colon', () => {
    const result = parseScopeBlock(
      ['INCLUDED', '- a', 'Excluded :', '- b'].join('\n'),
    );
    expect(result.included).toEqual(['a']);
    expect(result.excluded).toEqual(['b']);
  });

  it('ignores blank lines and content before any header', () => {
    const result = parseScopeBlock(
      ['orphan line', '', 'included:', '', '- a', ''].join('\n'),
    );
    expect(result.included).toEqual(['a']);
    expect(result.excluded).toEqual([]);
  });

  it('returns empty sections for input without headers', () => {
    expect(parseScopeBlock('just some text')).toEqual({
      included: [],
      excluded: [],
    });
  });

  it('handles an included-only block', () => {
    const result = parseScopeBlock(['included:', '- only this'].join('\n'));
    expect(result.included).toEqual(['only this']);
    expect(result.excluded).toEqual([]);
  });
});
