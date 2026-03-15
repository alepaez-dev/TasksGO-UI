import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DateCell } from './DateCell';

describe('DateCell', () => {
  it('renders the date text', () => {
    render(<DateCell date="Oct 28" dateTime="2026-10-28" />);
    expect(screen.getByText('Oct 28')).toBeInTheDocument();
  });

  it('renders as a time element with datetime attribute', () => {
    render(<DateCell date="Oct 28" dateTime="2026-10-28" />);
    const el = screen.getByText('Oct 28');
    expect(el.tagName).toBe('TIME');
    expect(el).toHaveAttribute('datetime', '2026-10-28');
  });

  it('applies urgent class when urgent is true', () => {
    render(<DateCell date="Today" dateTime="2026-03-11" urgent />);
    expect(screen.getByText('Today')).toHaveClass('urgent');
  });

  it('does not apply urgent class by default', () => {
    render(<DateCell date="Oct 28" dateTime="2026-10-28" />);
    expect(screen.getByText('Oct 28')).not.toHaveClass('urgent');
  });

  it('forwards ref to the time element', () => {
    const ref = { current: null } as React.RefObject<HTMLTimeElement | null>;
    render(<DateCell ref={ref} date="Oct 28" dateTime="2026-10-28" />);
    expect(ref.current).toBeInstanceOf(HTMLTimeElement);
  });

  it('merges custom className', () => {
    render(<DateCell date="Oct 28" dateTime="2026-10-28" className="custom" />);
    expect(screen.getByText('Oct 28')).toHaveClass('custom');
  });
});
