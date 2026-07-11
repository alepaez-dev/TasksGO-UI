import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScratchpadLineMarkdown } from './ScratchpadLineMarkdown';

describe('ScratchpadLineMarkdown', () => {
  it('renders inline marks without showing the raw syntax', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="a **bold** b"
        highlightBadges={false}
      />,
    );
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument();
  });

  it('renders a `#` line as a real heading with the marker stripped', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="# Plan"
        highlightBadges={false}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Plan' }),
    ).toBeInTheDocument();
  });

  it('renders `###` as an h3', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="### Notes"
        highlightBadges={false}
      />,
    );
    expect(
      screen.getByRole('heading', { level: 3, name: 'Notes' }),
    ).toBeInTheDocument();
  });

  it('renders a heading without an id (no duplicate ids across rows)', () => {
    const { container } = render(
      <>
        <ScratchpadLineMarkdown
          lineId="l1"
          text="# Notes"
          highlightBadges={false}
        />
        <ScratchpadLineMarkdown
          lineId="l2"
          text="# Notes"
          highlightBadges={false}
        />
      </>,
    );
    expect(container.querySelectorAll('[id]')).toHaveLength(0);
  });

  it('renders a sanitized link', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="see [docs](https://example.com)"
        highlightBadges={false}
      />,
    );
    const link = screen.getByRole('link', { name: 'docs' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders [task]/[qa] chips interleaved with markdown when highlightBadges is on', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="do **it** [task] now [qa]"
        highlightBadges
      />,
    );
    expect(screen.getByText('it').tagName).toBe('STRONG');
    expect(screen.getByText('TASK')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
  });

  it('does not parse chips when highlightBadges is off', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="do [task] now"
        highlightBadges={false}
      />,
    );
    expect(screen.queryByText('TASK')).not.toBeInTheDocument();
    expect(screen.getByText(/\[task\]/)).toBeInTheDocument();
  });

  it('makes a [task] chip interactive when handlers are provided', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text="[task]"
        highlightBadges
        taskBadgeInfo={{
          id: 'TSK-1',
          title: 'T',
          status: 'Open',
          createdAgo: '1h ago',
        }}
        openBadgeId={null}
        onBadgeOpenChange={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Linked task TSK-1' }),
    ).toBeInTheDocument();
  });

  it('gives [task] chips on different soft-break lines distinct open-state ids', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text={'[task] a\n[task] b'}
        highlightBadges
        taskBadgeInfo={{
          id: 'TSK-1',
          title: 'T',
          status: 'Open',
          createdAgo: '1h ago',
        }}
        openBadgeId="l1:L0#0" // the first chip only (id = `${lineId}:L${line}#${n}`)
        onBadgeOpenChange={() => {}}
      />,
    );
    const chips = screen.getAllByRole('button', { name: 'Linked task TSK-1' });
    expect(chips).toHaveLength(2);
    const expanded = chips.filter(
      (c) => c.getAttribute('aria-expanded') === 'true',
    );
    expect(expanded).toHaveLength(1); // only the open chip, not both
  });

  it('renders a multi-line heading row as one heading; later markers stay literal', () => {
    render(
      <ScratchpadLineMarkdown
        lineId="l1"
        text={'# h one\n## h two\n### h three'}
        highlightBadges={false}
      />,
    );
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0].tagName).toBe('H1');
    expect(headings[0]).toHaveTextContent('h one');
    expect(headings[0]).toHaveTextContent('## h two');
    expect(headings[0]).toHaveTextContent('### h three');
  });
});
