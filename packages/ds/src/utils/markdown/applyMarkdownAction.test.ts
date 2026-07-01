import { describe, it, expect } from 'vitest';
import { applyMarkdownAction } from './applyMarkdownAction';

const at = (
  value: string,
  selectionStart: number,
  selectionEnd = selectionStart,
) => ({
  value,
  selectionStart,
  selectionEnd,
});

describe('applyMarkdownAction', () => {
  it('wraps a selection in bold markers and selects the inner text', () => {
    const edit = applyMarkdownAction('bold', at('hello world', 0, 5));
    expect(edit.value).toBe('**hello** world');
    expect(edit.value.slice(edit.selectionStart, edit.selectionEnd)).toBe(
      'hello',
    );
  });

  it('inserts an italic placeholder when there is no selection', () => {
    const edit = applyMarkdownAction('italic', at('', 0));
    expect(edit.value).toBe('*italic*');
    expect(edit.value.slice(edit.selectionStart, edit.selectionEnd)).toBe(
      'italic',
    );
  });

  it('wraps a selection in inline code', () => {
    const edit = applyMarkdownAction('code', at('npm run dev', 0, 3));
    expect(edit.value).toBe('`npm` run dev');
  });

  it('prefixes the current line for a heading', () => {
    const edit = applyMarkdownAction('heading', at('Title', 2));
    expect(edit.value).toBe('## Title');
  });

  it('prefixes every selected line for a list', () => {
    const edit = applyMarkdownAction('list', at('one\ntwo', 0, 7));
    expect(edit.value).toBe('- one\n- two');
  });

  it('does not prefix the next line when the selection ends on a line break', () => {
    const edit = applyMarkdownAction('list', at('one\ntwo', 0, 4));
    expect(edit.value).toBe('- one\ntwo');
  });

  it('prefixes a blockquote from the start of the line', () => {
    const edit = applyMarkdownAction('quote', at('a\nquote me', 2, 10));
    expect(edit.value).toBe('a\n> quote me');
  });

  it('inserts a link skeleton and selects the url', () => {
    const edit = applyMarkdownAction('link', at('', 0));
    expect(edit.value).toBe('[text](url)');
    expect(edit.value.slice(edit.selectionStart, edit.selectionEnd)).toBe(
      'url',
    );
  });

  it('uses the selection as the link text', () => {
    const edit = applyMarkdownAction('link', at('docs', 0, 4));
    expect(edit.value).toBe('[docs](url)');
    expect(edit.value.slice(edit.selectionStart, edit.selectionEnd)).toBe(
      'url',
    );
  });

  it('inserts an image skeleton with the bang prefix', () => {
    const edit = applyMarkdownAction('image', at('', 0));
    expect(edit.value).toBe('![alt](url)');
    expect(edit.value.slice(edit.selectionStart, edit.selectionEnd)).toBe(
      'url',
    );
  });
});
