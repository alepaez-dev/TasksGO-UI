import { createRef, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimelineDivider } from './TimelineDivider';

const AT = '2026-01-13T12:00:00.000Z';

function expectedDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

function renderInList(ui: ReactNode) {
  return render(<ul>{ui}</ul>);
}

describe('TimelineDivider', () => {
  it('pairs the date with the relative day when there is one', () => {
    renderInList(
      <TimelineDivider
        type="dayDivider"
        at={AT}
        relative="yesterday"
        locale="en-US"
      />,
    );
    expect(
      screen.getByText(`${expectedDate(AT)} · Yesterday`),
    ).toBeInTheDocument();
  });

  it('says Today for the current day', () => {
    renderInList(
      <TimelineDivider
        type="dayDivider"
        at={AT}
        relative="today"
        locale="en-US"
      />,
    );
    expect(screen.getByText(/· Today$/)).toBeInTheDocument();
  });

  it('shows the date alone once a day is older than yesterday', () => {
    const { container } = renderInList(
      <TimelineDivider
        type="dayDivider"
        at={AT}
        relative={null}
        locale="en-US"
      />,
    );
    expect(screen.getByText(expectedDate(AT))).toBeInTheDocument();
    expect(container.textContent).not.toContain('·');
  });

  it('labels a gap in whole hours', () => {
    renderInList(
      <TimelineDivider type="gapDivider" durationMs={4 * 60 * 60 * 1000} />,
    );
    expect(screen.getByText('4 hour gap')).toBeInTheDocument();
  });

  it('keeps the unit singular at exactly one hour', () => {
    renderInList(
      <TimelineDivider type="gapDivider" durationMs={60 * 60 * 1000} />,
    );
    expect(screen.getByText('1 hour gap')).toBeInTheDocument();
  });

  it('falls back to minutes when the feed lowers gapMs below an hour', () => {
    renderInList(
      <TimelineDivider type="gapDivider" durationMs={45 * 60 * 1000} />,
    );
    expect(screen.getByText('45 minute gap')).toBeInTheDocument();
  });

  it('reads a negative duration as the same magnitude', () => {
    renderInList(
      <TimelineDivider type="gapDivider" durationMs={-6 * 60 * 60 * 1000} />,
    );
    expect(screen.getByText('6 hour gap')).toBeInTheDocument();
  });

  it('never renders a zero-minute gap', () => {
    renderInList(<TimelineDivider type="gapDivider" durationMs={5000} />);
    expect(screen.getByText('1 minute gap')).toBeInTheDocument();
  });

  it('rounds down rather than reporting a gap larger than it is', () => {
    renderInList(
      <TimelineDivider
        type="gapDivider"
        durationMs={5 * 60 * 60 * 1000 + 59 * 60 * 1000}
      />,
    );
    expect(screen.getByText('5 hour gap')).toBeInTheDocument();
  });

  it('names the year once the day is not in the current one', () => {
    renderInList(
      <TimelineDivider
        type="dayDivider"
        relative={null}
        at="2025-01-13T12:00:00.000Z"
        sameYear={false}
        locale="en-US"
      />,
    );
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('leaves the year off for the current one', () => {
    const { container } = renderInList(
      <TimelineDivider
        type="dayDivider"
        relative={null}
        at={AT}
        locale="en-US"
      />,
    );
    expect(container.textContent).not.toMatch(/\d{4}/);
  });

  it('shows a malformed timestamp instead of throwing', () => {
    expect(() =>
      renderInList(
        <TimelineDivider
          type="dayDivider"
          relative={null}
          at="2026-13-45T99:00:00Z"
        />,
      ),
    ).not.toThrow();
    expect(screen.getByText('2026-13-45T99:00:00Z')).toBeInTheDocument();
  });

  it('formats the day in the locale it is given', () => {
    const inGerman = new Intl.DateTimeFormat('de-DE', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(AT));

    renderInList(
      <TimelineDivider
        type="dayDivider"
        relative={null}
        at={AT}
        locale="de-DE"
      />,
    );

    expect(screen.getByText(inGerman)).toBeInTheDocument();
    expect(inGerman).not.toBe(expectedDate(AT));
  });

  it('falls back to the host locale when given an unusable one', () => {
    const hostDate = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(new Date(AT));

    for (const locale of ['', 'e']) {
      const { container } = renderInList(
        <TimelineDivider
          type="dayDivider"
          relative={null}
          at={AT}
          locale={locale}
        />,
      );
      expect(container.querySelector('li')).toHaveTextContent(hostDate);
    }
  });

  it('centres a gap but anchors a day heading left', () => {
    const { container: gap } = renderInList(
      <TimelineDivider type="gapDivider" durationMs={60 * 60 * 1000} />,
    );
    expect(gap.querySelector('li')).toHaveClass('gap');

    const { container: day } = renderInList(
      <TimelineDivider
        type="dayDivider"
        relative={null}
        at={AT}
        locale="en-US"
      />,
    );
    expect(day.querySelector('li')).not.toHaveClass('gap');
  });

  it('exposes a day heading as a jump target', () => {
    renderInList(
      <TimelineDivider
        type="dayDivider"
        relative={null}
        at={AT}
        locale="en-US"
      />,
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      expectedDate(AT),
    );
  });

  it('lets the page place the heading in its own outline', () => {
    renderInList(
      <TimelineDivider
        type="dayDivider"
        relative={null}
        at={AT}
        headingLevel={4}
        locale="en-US"
      />,
    );
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('does not make a gap a heading', () => {
    renderInList(
      <TimelineDivider type="gapDivider" durationMs={60 * 60 * 1000} />,
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('rejects illegal prop combinations at compile time', () => {
    renderInList(
      <>
        {/* @ts-expect-error durationMs belongs to the gap variant */}
        <TimelineDivider
          type="dayDivider"
          relative={null}
          at={AT}
          durationMs={1000}
        />
        {/* @ts-expect-error at belongs to the day variant */}
        <TimelineDivider type="gapDivider" durationMs={1000} at={AT} />
        {/* @ts-expect-error headingLevel belongs to the day variant */}
        <TimelineDivider type="gapDivider" durationMs={1000} headingLevel={3} />
      </>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders a list item so it drops into the feed list', () => {
    const { container } = renderInList(
      <TimelineDivider type="gapDivider" durationMs={60 * 60 * 1000} />,
    );
    expect(container.querySelector('li')).toBeInTheDocument();
  });

  it('leaves the label readable by assistive tech', () => {
    renderInList(
      <TimelineDivider type="gapDivider" durationMs={60 * 60 * 1000} />,
    );
    expect(screen.getByText('1 hour gap')).not.toHaveAttribute('aria-hidden');
  });

  it('forwards ref to the list item', () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ul>
        <TimelineDivider ref={ref} type="gapDivider" durationMs={1000} />
      </ul>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });

  it('merges a custom className', () => {
    const { container } = renderInList(
      <TimelineDivider
        type="gapDivider"
        durationMs={1000}
        className="custom"
      />,
    );
    expect(container.querySelector('li')).toHaveClass('custom');
  });
});
