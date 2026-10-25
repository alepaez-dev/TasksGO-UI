import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusIcon } from './StatusIcon';

describe('StatusIcon', () => {
  it('exposes its label as the image name', () => {
    render(<StatusIcon status="in-review" label="In review" />);
    expect(screen.getByRole('img', { name: 'In review' })).toBeInTheDocument();
  });

  it('hides the drawing from assistive tech', () => {
    const { container } = render(<StatusIcon status="done" label="Done" />);
    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('defaults to the md size', () => {
    render(<StatusIcon status="todo" label="Todo" />);
    expect(screen.getByRole('img')).toHaveClass('md');
  });

  it('applies the sm size', () => {
    render(<StatusIcon status="todo" label="Todo" size="sm" />);
    expect(screen.getByRole('img')).toHaveClass('sm');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <StatusIcon
        ref={ref}
        status="blocked"
        label="Blocked"
        className="custom"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByRole('img')).toHaveClass('custom');
  });

  it.each([
    ['backlog', { slice: null, dashed: true, bar: false, check: false }],
    ['todo', { slice: null, dashed: false, bar: false, check: false }],
    [
      'in-progress',
      {
        slice: 'M9 9V4.5A4.5 4.5 0 0 1 11.65 12.64Z',
        dashed: false,
        bar: false,
        check: false,
      },
    ],
    [
      'in-review',
      {
        slice: 'M9 9V4.5A4.5 4.5 0 1 1 6.35 12.64Z',
        dashed: false,
        bar: false,
        check: false,
      },
    ],
    [
      'ready-for-qa',
      {
        slice: 'M9 9V4.5A4.5 4.5 0 1 1 4.50 9.00Z',
        dashed: false,
        bar: false,
        check: false,
      },
    ],
    [
      'in-qa',
      {
        slice: 'M9 9V4.5A4.5 4.5 0 1 1 6.35 5.36Z',
        dashed: false,
        bar: false,
        check: false,
      },
    ],
    ['blocked', { slice: null, dashed: false, bar: true, check: false }],
    ['done', { slice: null, dashed: false, bar: false, check: true }],
  ] as const)('draws the %s glyph', (status, want) => {
    const { container } = render(<StatusIcon status={status} label={status} />);
    expect(
      container.querySelector('path[d^="M9 9"]')?.getAttribute('d') ?? null,
    ).toBe(want.slice);
    expect(container.querySelector('circle.dashed') !== null).toBe(want.dashed);
    expect(container.querySelector('rect') !== null).toBe(want.bar);
    expect(
      container.querySelector('path[d="M5.6 9.2l2.3 2.3 4.5-4.6"]') !== null,
    ).toBe(want.check);
  });
});
