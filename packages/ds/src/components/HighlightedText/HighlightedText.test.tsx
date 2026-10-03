import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HighlightedText } from './HighlightedText';
import { Badge } from '../Badge';

function marks(container: HTMLElement): string[] {
  return [...container.querySelectorAll('mark')].map(
    (m) => m.textContent ?? '',
  );
}

describe('HighlightedText', () => {
  it('marks the matching run and leaves the rest alone', () => {
    const { container } = render(
      <HighlightedText text="Jordan D. added label" query="jordan" />,
    );
    expect(marks(container)).toEqual(['Jordan']);
    expect(container.textContent).toBe('Jordan D. added label');
  });

  it('matches regardless of case', () => {
    const { container } = render(
      <HighlightedText text="JORDAN and jordan" query="Jordan" />,
    );
    expect(marks(container)).toEqual(['JORDAN', 'jordan']);
  });

  it('marks every term of a multi-term query', () => {
    const { container } = render(
      <HighlightedText text="Build passed on QA-01" query="qa build" />,
    );
    expect(marks(container)).toEqual(['Build', 'QA']);
  });

  it('marks a term inside a longer word', () => {
    const { container } = render(
      <HighlightedText text="needs-qa" query="needs" />,
    );
    expect(marks(container)).toEqual(['needs']);
    expect(container.textContent).toBe('needs-qa');
  });

  it('treats a query with regex characters as literal text', () => {
    const { container } = render(
      <HighlightedText text="use C++ or a.b here" query="c++" />,
    );
    expect(marks(container)).toEqual(['C++']);
  });

  it('does not treat a dot as a wildcard', () => {
    const { container } = render(
      <HighlightedText text="a.b and axb" query="a.b" />,
    );
    expect(marks(container)).toEqual(['a.b']);
  });

  it('agrees with the filter on characters that lower-case oddly', () => {
    const { container } = render(<HighlightedText text="İstanbul" query="i" />);
    expect(marks(container)).toEqual(['İ']);
  });

  it('agrees with the filter on the Kelvin sign', () => {
    const { container } = render(<HighlightedText text="K" query="k" />);
    expect(marks(container)).toEqual(['K']);
  });

  it('merges overlapping terms into one mark', () => {
    const { container } = render(
      <HighlightedText text="abcd" query="abc bcd" />,
    );
    expect(marks(container)).toEqual(['abcd']);
  });

  it('renders plain text when the query is empty', () => {
    const { container } = render(
      <HighlightedText text="nothing to mark" query="" />,
    );
    expect(marks(container)).toEqual([]);
    expect(container.textContent).toBe('nothing to mark');
  });

  it('renders plain text when the query is only whitespace', () => {
    const { container } = render(
      <HighlightedText text="nothing to mark" query="   " />,
    );
    expect(marks(container)).toEqual([]);
  });

  it('renders plain text when nothing matches', () => {
    const { container } = render(
      <HighlightedText text="Alex M." query="jordan" />,
    );
    expect(marks(container)).toEqual([]);
  });

  it('never interprets the text as markup', () => {
    const { container } = render(
      <HighlightedText
        text={'<script>alert(1)</script> <b>bold</b>'}
        query="script"
      />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('b')).toBeNull();
    expect(container.textContent).toBe('<script>alert(1)</script> <b>bold</b>');
  });

  it('highlights inside a Badge', () => {
    render(
      <Badge variant="progress">
        <HighlightedText text="needs-qa" query="needs" />
      </Badge>,
    );
    expect(screen.getByText('needs').tagName).toBe('MARK');
  });
});
