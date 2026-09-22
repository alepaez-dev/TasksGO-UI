import { createRef, useState, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TimelineGroup, type TimelineGroupProps } from './TimelineGroup';
import { TimelineEvent } from '../TimelineEvent';

type RenderGroupProps = Partial<
  Omit<TimelineGroupProps, 'moreLabel' | 'onMoreToggle' | 'moreExpanded'>
> & {
  moreLabel?: ReactNode;
  onMoreToggle?: () => void;
  moreExpanded?: boolean;
};

function renderGroup(props: RenderGroupProps = {}) {
  const { children, ...rest } = props;
  const groupProps = {
    count: 2,
    summary: 'Jordan D. performed 2 updates',
    open: false,
    onOpenChange: () => {},
    ...rest,
  } as TimelineGroupProps;

  return render(
    <ul>
      <TimelineGroup {...groupProps}>
        {children ?? (
          <TimelineEvent variant="nested" icon="schedule" timestamp="1d 8h ago">
            changed status
          </TimelineEvent>
        )}
      </TimelineGroup>
    </ul>,
  );
}

describe('TimelineGroup', () => {
  it('shows the summary and the count badge', () => {
    renderGroup();
    expect(
      screen.getByText('Jordan D. performed 2 updates'),
    ).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('announces the count once, from the summary rather than the badge', () => {
    renderGroup({ meta: '· labels, sprint · 1d 2h ago' });
    expect(screen.getByRole('button')).toHaveAccessibleName(
      'Jordan D. performed 2 updates · labels, sprint · 1d 2h ago',
    );
  });

  it('keeps the rows out of the DOM while collapsed', () => {
    // Not hidden with CSS: a collapsed run must not pollute the a11y tree.
    renderGroup({ open: false });
    expect(screen.queryByText('changed status')).not.toBeInTheDocument();
  });

  it('renders the rows when open', () => {
    renderGroup({ open: true });
    expect(screen.getByText('changed status')).toBeInTheDocument();
  });

  it('reports its expanded state on the toggle', () => {
    renderGroup({ open: true });
    expect(
      screen.getByRole('button', { name: /performed 2 updates/i }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('asks to open when the collapsed toggle is used', async () => {
    const onOpenChange = vi.fn();
    renderGroup({ open: false, onOpenChange });

    await userEvent.click(screen.getByRole('button'));

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('asks to close when the open toggle is used', async () => {
    const onOpenChange = vi.fn();
    renderGroup({ open: true, onOpenChange });

    await userEvent.click(
      screen.getByRole('button', { name: /performed 2 updates/i }),
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders meta in its own slot, not inside the summary', () => {
    const { container } = renderGroup({ meta: '· labels, sprint · 1d 2h ago' });

    expect(container.querySelector('.meta')).toHaveTextContent(
      '· labels, sprint · 1d 2h ago',
    );
    expect(container.querySelector('.summary')).not.toHaveTextContent(
      'labels, sprint',
    );
  });

  it('shows a match count while a search is active', () => {
    renderGroup({ matchLabel: '1 of 2 match' });
    expect(screen.getByText('1 of 2 match')).toBeInTheDocument();
  });

  it('omits the match chip when not searching', () => {
    renderGroup();
    expect(screen.queryByText(/match/i)).not.toBeInTheDocument();
  });

  it('offers the capped rows behind a more button', async () => {
    const onMoreToggle = vi.fn();
    renderGroup({ open: true, moreLabel: 'Show 5 more', onMoreToggle });

    await userEvent.click(screen.getByRole('button', { name: 'Show 5 more' }));

    expect(onMoreToggle).toHaveBeenCalledTimes(1);
  });

  it('reports the cap as collapsed while the extra rows are hidden', () => {
    renderGroup({
      open: true,
      moreLabel: 'Show 5 more',
      onMoreToggle: () => {},
      moreExpanded: false,
    });

    expect(screen.getByRole('button', { name: 'Show 5 more' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('reports the cap as expanded once the extra rows are showing', () => {
    const { container } = renderGroup({
      open: true,
      moreLabel: 'Show less',
      onMoreToggle: () => {},
      moreExpanded: true,
    });

    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(container.querySelector('.moreExpanded')).toBeInTheDocument();
  });

  it('has no more button when the run is not capped', () => {
    renderGroup({ open: true });
    expect(
      screen.queryByRole('button', { name: /show .* more/i }),
    ).not.toBeInTheDocument();
  });

  it('hides the more button while collapsed', () => {
    renderGroup({
      open: false,
      moreLabel: 'Show 5 more',
      onMoreToggle: () => {},
    });
    expect(
      screen.queryByRole('button', { name: 'Show 5 more' }),
    ).not.toBeInTheDocument();
  });

  it('catches focus on the toggle when a collapse unmounts it', () => {
    const group = (open: boolean) => (
      <ul>
        <TimelineGroup
          count={2}
          summary="Jordan D. performed 2 updates"
          open={open}
          onOpenChange={() => {}}
          moreLabel="Show 5 more"
          onMoreToggle={() => {}}
          moreExpanded={false}
        >
          <TimelineEvent variant="nested" icon="tag" timestamp="1h">
            added label
          </TimelineEvent>
        </TimelineGroup>
      </ul>
    );

    const { rerender } = render(group(true));
    screen.getByRole('button', { name: 'Show 5 more' }).focus();
    rerender(group(false));

    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /performed 2 updates/i }),
    );
  });

  it('does not grab focus from whatever the collapse was triggered from', async () => {
    // The guard must not fire when something else already holds focus —
    // otherwise clicking a page control would yank focus into the feed.
    function PageDriven() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen(false)}>Clear search</button>
          <ul>
            <TimelineGroup
              count={2}
              summary="Jordan D. performed 2 updates"
              open={open}
              onOpenChange={setOpen}
            >
              <TimelineEvent variant="nested" icon="tag" timestamp="1h">
                added label
              </TimelineEvent>
            </TimelineGroup>
          </ul>
        </>
      );
    }

    render(<PageDriven />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Clear search' }),
    );
  });

  it('does not grab focus when it starts collapsed', () => {
    // Mounting closed is not a collapse; focus must stay where the page put it.
    renderGroup({ open: false });
    expect(document.activeElement).toBe(document.body);
  });

  it('rejects a cap label with no handler behind it', () => {
    const illegal = (
      <ul>
        {/* @ts-expect-error the cap props come as a set */}
        <TimelineGroup
          count={9}
          summary="x"
          open
          onOpenChange={() => {}}
          moreLabel="Show 5 more"
        >
          <TimelineEvent variant="nested" icon="tag" timestamp="1h">
            y
          </TimelineEvent>
        </TimelineGroup>
      </ul>
    );
    expect(illegal).toBeTruthy();
  });

  it('forwards ref to the list item', () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ul>
        <TimelineGroup
          ref={ref}
          count={2}
          summary="x"
          open={false}
          onOpenChange={() => {}}
        >
          <TimelineEvent variant="nested" icon="tag" timestamp="1h">
            y
          </TimelineEvent>
        </TimelineGroup>
      </ul>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });
});
