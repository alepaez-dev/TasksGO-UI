import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Markdown } from './Markdown';

const TEAM = ['jordan', 'acme', 'foo'];

const mentions = (c: HTMLElement) =>
  [...c.querySelectorAll('.mention')].map((n) => n.textContent ?? '');

const renderWith = (source: string, props = {}) =>
  render(<Markdown source={source} mentions={TEAM} {...props} />).container;

describe('Markdown mentions', () => {
  it('marks nothing until the caller names the handles it knows', () => {
    const { container } = render(<Markdown source="ping @jordan on this" />);
    expect(mentions(container)).toEqual([]);
  });

  it('marks a known handle in the body', () => {
    expect(mentions(renderWith('ping @jordan on this'))).toEqual(['@jordan']);
  });

  it('leaves a handle nobody goes by as plain text', () => {
    expect(mentions(renderWith('npm i @tasksgo/ui'))).toEqual([]);
  });

  it('leaves a handle inside a code span alone', () => {
    const c = renderWith('use `@jordan` literally');
    expect(mentions(c)).toEqual([]);
    expect(c.querySelector('code')).toHaveTextContent('@jordan');
  });

  it('leaves a handle inside a fenced block alone', () => {
    expect(mentions(renderWith('```ts\nconst a = "@jordan";\n```'))).toEqual(
      [],
    );
  });

  it('does not turn an email address into a mention', () => {
    expect(mentions(renderWith('mail jordan@acme.com'))).toEqual([]);
  });

  it('does not split a word on a non-ascii letter before the @', () => {
    expect(mentions(renderWith('josé@acme.com'))).toEqual([]);
  });

  it('still highlights a search term inside a mention', () => {
    const c = renderWith('ping @jordan on this', { query: 'jordan' });
    expect(mentions(c)).toEqual(['@jordan']);
    expect([...c.querySelectorAll('mark')].map((m) => m.textContent)).toEqual([
      'jordan',
    ]);
  });

  it('keeps the mention when the search term spans its boundary', () => {
    expect(
      mentions(renderWith('ping @jordan on this', { query: '@jor' })),
    ).toEqual(['@jordan']);
  });

  it('still marks a known handle that appears inside link text', () => {
    expect(mentions(renderWith('[@jordan](https://x.com)'))).toEqual([
      '@jordan',
    ]);
  });

  it('still marks a known handle after a formatting boundary', () => {
    expect(mentions(renderWith('*hi*@jordan'))).toEqual(['@jordan']);
  });
});
