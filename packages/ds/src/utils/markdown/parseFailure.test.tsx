import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('markdown-to-jsx', async (importOriginal) => ({
  ...(await importOriginal<typeof import('markdown-to-jsx')>()),
  parser: () => {
    throw new Error('parse failed');
  },
}));

const { plainText } = await import('./plainText');
const { textRuns } = await import('./textRuns');
const { Markdown } = await import('../../components/Markdown');

const SOURCE = 'QA **needs** a number';

describe('when the parser throws', () => {
  it('indexes the raw source so the body stays searchable', () => {
    expect(plainText(SOURCE)).toBe(SOURCE);
  });

  it('yields the whole source as one run so it still renders', () => {
    expect(textRuns(SOURCE)).toEqual([SOURCE]);
  });

  it('renders the raw source', () => {
    const { container } = render(<Markdown source={SOURCE} />);
    expect(container.textContent).toBe(SOURCE);
  });

  it('marks a query match in the raw source', () => {
    const { container } = render(<Markdown source={SOURCE} query="needs" />);
    const marks = [...container.querySelectorAll('mark')].map(
      (mark) => mark.textContent,
    );
    expect(marks).toEqual(['needs']);
  });
});
