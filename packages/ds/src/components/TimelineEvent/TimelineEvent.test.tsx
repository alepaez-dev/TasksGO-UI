import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TimelineEvent, type TimelineEventProps } from './TimelineEvent';

function renderRow(props: Partial<TimelineEventProps> = {}) {
  return render(
    <ul>
      <TimelineEvent icon="schedule" timestamp="22h ago" {...props}>
        changed status
      </TimelineEvent>
    </ul>,
  );
}

describe('TimelineEvent', () => {
  it('renders its content and timestamp', () => {
    renderRow();
    expect(screen.getByText('changed status')).toBeInTheDocument();
    expect(screen.getByText('22h ago')).toBeInTheDocument();
  });

  it('renders the leading icon', () => {
    const { container } = renderRow({ icon: 'tag' });
    expect(
      container.querySelector('[data-icon-name="tag"]'),
    ).toBeInTheDocument();
  });

  it('is standalone by default, carrying the spine marker', () => {
    const { container } = renderRow();
    expect(container.querySelector('li')).toHaveClass('standalone');
    expect(container.querySelector('.marker')).toBeInTheDocument();
  });

  it('drops the marker when nested inside a group', () => {
    const { container } = renderRow({ variant: 'nested' });
    expect(container.querySelector('li')).toHaveClass('nested');
    expect(container.querySelector('.marker')).not.toBeInTheDocument();
  });

  it('de-emphasises a muted row with italic and a smaller size', () => {
    const { container } = renderRow({ muted: true });
    expect(container.querySelector('li')).toHaveClass('muted');
  });

  it('rings the row when pinned', () => {
    const { container } = renderRow({ pinned: true });
    expect(container.querySelector('li')).toHaveClass('pinned');
  });

  it('offers no pin affordance until the row is pinnable', () => {
    renderRow();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onPin when the pin affordance is used', async () => {
    const onPin = vi.fn();
    renderRow({ onPin });

    await userEvent.click(screen.getByRole('button', { name: /pin/i }));

    expect(onPin).toHaveBeenCalledTimes(1);
  });

  it('names the pin button by the row it pins, not just "Pin"', () => {
    // A feed shows a dozen of these; "Pin, button" twelve times is useless.
    renderRow({ onPin: () => {} });
    expect(
      screen.getByRole('button', { name: /pin changed status/i }),
    ).toBeInTheDocument();
  });

  it('announces the pinned state when there is no pin button to carry it', () => {
    renderRow({ pinned: true });
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  it('rejects a row that is both pinned and pinnable', () => {
    const illegal = (
      <ul>
        {/* @ts-expect-error pinned and onPin are mutually exclusive */}
        <TimelineEvent icon="tag" timestamp="1h" pinned onPin={() => {}}>
          added label
        </TimelineEvent>
      </ul>
    );
    expect(illegal).toBeTruthy();
  });

  it('keeps a pin click off a clickable row', async () => {
    const onRowClick = vi.fn();
    const onPin = vi.fn();
    renderRow({ onClick: onRowClick, onPin });

    await userEvent.click(screen.getByRole('button'));

    expect(onPin).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('keeps a keyboard pin off a row that listens for keys', async () => {
    const onRowKeyDown = vi.fn();
    const onPin = vi.fn();
    renderRow({ onKeyDown: onRowKeyDown, onPin });

    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');

    expect(onPin).toHaveBeenCalledTimes(1);
    expect(onRowKeyDown).not.toHaveBeenCalled();
  });

  it('lets the pinned row take focus, which is how the pin flow lands', () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ul>
        <TimelineEvent ref={ref} icon="tag" timestamp="22h ago" pinned>
          added label
        </TimelineEvent>
      </ul>,
    );

    ref.current?.focus();

    expect(document.activeElement).toBe(ref.current);
  });

  it('keeps unpinned rows out of the focus order', () => {
    const { container } = renderRow();
    expect(container.querySelector('li')).not.toHaveAttribute('tabindex');
  });

  it('owns the timestamp separator and hides it from assistive tech', () => {
    // Pins what the component provides: without this, deleting the span would
    // silently regress every call site and no test would notice.
    renderRow();
    const separators = screen.getAllByText('·');

    expect(separators).toHaveLength(1);
    expect(separators[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref to the list item', () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <ul>
        <TimelineEvent ref={ref} icon="schedule" timestamp="1h ago">
          x
        </TimelineEvent>
      </ul>,
    );
    expect(ref.current).toBeInstanceOf(HTMLLIElement);
  });

  it('merges a custom className', () => {
    const { container } = renderRow({ className: 'custom' });
    expect(container.querySelector('li')).toHaveClass('custom');
  });
});
