import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MarkdownRenderer from 'markdown-to-jsx';
import { Fragment } from 'react';
import { Markdown } from './Markdown';

const BODIES = [
  'edge-**cache** here',
  '# Title\n\nsome *body* text',
  'use `needs-qa` please',
  '- one\n- two',
  '1. first\n2. second',
  '> quoted **text**',
  '[needs doc](http://example.com)',
  '| a | b |\n| --- | --- |\n| c | d |',
  '```js\nconst a = 1\n```',
  '**one** **two** **three**',
  'mixed **bold** and `code` and [link](http://x) together',
];

describe('Markdown render path', () => {
  it.each(BODIES)(
    'renders the same markup as the library component for %j',
    (source) => {
      // linkRenderRule deliberately adds rel="noopener noreferrer"; the library
      // does not, so normalise that one deviation away.
      const stripRel = (html: string | undefined) =>
        (html ?? '').replace(/ rel="noopener noreferrer"/g, '');
      const ours = stripRel(
        render(<Markdown source={source} />).container.querySelector('div')
          ?.innerHTML,
      );
      const theirs = render(
        <MarkdownRenderer
          options={{
            forceBlock: true,
            disableParsingRawHTML: true,
            wrapper: Fragment,
          }}
        >
          {source}
        </MarkdownRenderer>,
      ).container.innerHTML;
      expect(ours).toBe(stripRel(theirs));
    },
  );

  it('highlights the same regardless of how many times it renders', () => {
    const source = 'QA **needs** a number\n\nand needs again';
    const first = render(<Markdown source={source} query="needs" />);
    const marksOf = (c: HTMLElement) =>
      [...c.querySelectorAll('mark')].map((m) => m.textContent);
    const before = marksOf(first.container);

    first.rerender(<Markdown source={source} query="needs" />);
    first.rerender(<Markdown source={source} query="needs" />);

    expect(marksOf(first.container)).toEqual(before);
    expect(before).toEqual(['needs', 'needs']);
  });
});
