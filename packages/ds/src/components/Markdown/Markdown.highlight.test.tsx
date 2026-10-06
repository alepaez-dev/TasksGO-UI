import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Markdown } from './Markdown';

function marks(container: HTMLElement): string[] {
  return [...container.querySelectorAll('mark')].map(
    (m) => m.textContent ?? '',
  );
}

describe('Markdown query highlighting', () => {
  it('marks a term in body text', () => {
    const { container } = render(
      <Markdown source="QA needs a number" query="needs" />,
    );
    expect(marks(container)).toEqual(['needs']);
  });

  it('marks a term inside a code span and keeps the code element', () => {
    const { container } = render(
      <Markdown source="use `needs-qa` please" query="needs" />,
    );
    expect(marks(container)).toEqual(['needs']);
    expect(container.querySelector('code')).toBeInTheDocument();
  });

  it('marks a term inside emphasis without losing the formatting', () => {
    const { container } = render(
      <Markdown source="QA **needs** a number" query="needs" />,
    );
    expect(marks(container)).toEqual(['needs']);
    expect(container.querySelector('strong')).toBeInTheDocument();
  });

  it('marks a term inside link text and keeps the href', () => {
    const { container } = render(
      <Markdown source="[needs doc](http://example.com)" query="needs" />,
    );
    expect(marks(container)).toEqual(['needs']);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'http://example.com',
    );
  });

  it('renders unchanged when there is no query', () => {
    const { container } = render(<Markdown source="QA needs a number" />);
    expect(marks(container)).toEqual([]);
    expect(container.textContent).toBe('QA needs a number');
  });

  it('leaves the text intact when nothing matches', () => {
    const { container } = render(
      <Markdown source="QA needs a number" query="jordan" />,
    );
    expect(marks(container)).toEqual([]);
    expect(container.textContent).toBe('QA needs a number');
  });

  it('marks a term that formatting splits, keeping the formatting', () => {
    const { container } = render(
      <Markdown source="edge-**cache** here" query="edge-cache" />,
    );
    expect(marks(container)).toEqual(['edge-', 'cache']);
    expect(container.querySelector('strong')).toHaveTextContent('cache');
    expect(container.textContent).toBe('edge-cache here');
  });

  it('marks only the covered slice when a match starts mid-node', () => {
    const { container } = render(
      <Markdown source="edge-**cache** here" query="dge-cac" />,
    );
    expect(marks(container)).toEqual(['dge-', 'cac']);
    expect(container.textContent).toBe('edge-cache here');
  });

  it('leaves an unmatched node untouched rather than wrapping it', () => {
    const { container } = render(
      <Markdown source="QA **needs** a number" query="needs" />,
    );
    const paragraph = container.querySelector('p');
    expect(paragraph?.firstChild?.nodeType).toBe(Node.TEXT_NODE);
  });

  it('marks each term of a multi-term query across nodes', () => {
    const { container } = render(
      <Markdown source="**one** **two** **three**" query="one two" />,
    );
    expect(marks(container)).toEqual(['one', 'two']);
  });

  it('marks inside a fenced code block, keeping the block', () => {
    const { container } = render(
      <Markdown source={'```ts\nconst retries = 3;\n```'} query="retri" />,
    );
    expect(marks(container)).toEqual(['retri']);
    expect(container.querySelector('pre code')).toHaveTextContent(
      'const retries = 3;',
    );
  });

  it.each([
    ['```ts\nconst retries = 3;\n```', 'retri'],
    ['```\nplain retries here\n```', 'retri'],
    ['```js title="deploy.ts"\nconst retries = 3;\n```', 'retri'],
    ['```js meta=1 other="two"\nretries\n```', 'retri'],
  ])('wraps a marked block exactly like an unmarked one: %j', (source, q) => {
    const attributesOf = (el: Element | null) =>
      el === null
        ? null
        : Object.fromEntries(
            [...el.attributes].map((a) => [a.name, a.value]).sort(),
          );
    const shape = (el: HTMLElement) => {
      const code = el.querySelector('pre code');
      return {
        parent: code?.parentElement?.tagName,
        attributes: attributesOf(code ?? null),
        text: code?.textContent,
      };
    };
    const plain = render(<Markdown source={source} />).container;
    const marked = render(<Markdown source={source} query={q} />).container;
    expect(shape(marked)).toEqual(shape(plain));
    expect(marks(marked).length).toBeGreaterThan(0);
  });

  it('keeps an inline code element identical when marked', () => {
    const source = 'use `needs-qa` here';
    const attrs = (c: HTMLElement) => {
      const el = c.querySelector('code');
      return el === null
        ? null
        : [...el.attributes].map((a) => `${a.name}=${a.value}`).sort();
    };
    const plain = render(<Markdown source={source} />).container;
    const marked = render(<Markdown source={source} query="needs" />).container;
    expect(attrs(marked)).toEqual(attrs(plain));
    expect(marked.querySelector('code')?.textContent).toBe('needs-qa');
  });

  it('keeps offsets aligned for text after a fenced block', () => {
    const { container } = render(
      <Markdown
        source={'before needs\n\n```ts\nconst retries = 3;\n```\n\nafter needs'}
        query="needs"
      />,
    );
    expect(marks(container)).toEqual(['needs', 'needs']);
    expect(container.querySelector('pre code')).toBeInTheDocument();
  });

  it('does not pre-empt the scope block rule', () => {
    const source =
      '```scope\nIncluded:\n- login flow\nExcluded:\n- billing\n```';
    const plain = render(<Markdown source={source} />).container.innerHTML;
    const queried = render(<Markdown source={source} query="login" />).container
      .innerHTML;
    expect(queried).toBe(plain);
  });

  it.each([
    ['- one\n- two', 'onet'],
    ['foo\n\nbar', 'oob'],
    ['# Head\n\nline', 'headl'],
    ['| a | b |\n| --- | --- |\n| c | d |', 'ab'],
  ])('does not mark across a block boundary in %j', (source, query) => {
    const { container } = render(<Markdown source={source} query={query} />);
    expect(marks(container)).toEqual([]);
  });

  it('still marks across an inline boundary within one block', () => {
    const { container } = render(
      <Markdown source="edge-**cache** here" query="edge-cache" />,
    );
    expect(marks(container)).toEqual(['edge-', 'cache']);
  });

  it('marks footnote text, which the renderer builds outside the parsed tree', () => {
    const source =
      'A fan-out pattern is cheaper[^1].\n\n[^1]: we measured 40% fewer SQS calls';
    const { container } = render(<Markdown source={source} query="SQS" />);
    expect(marks(container)).toEqual(['SQS']);
    expect(container.querySelector('footer')).toHaveTextContent(
      'we measured 40% fewer SQS calls',
    );
  });

  it('does not mark across the boundary into footnote text', () => {
    const source = 'body ends here[^1].\n\n[^1]: starts the note';
    const { container } = render(
      <Markdown source={source} query="herestarts" />,
    );
    expect(marks(container)).toEqual([]);
  });

  it('never renders markup from the source', () => {
    const { container } = render(
      <Markdown source="<script>alert(1)</script> needs" query="needs" />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(marks(container)).toEqual(['needs']);
  });
});
