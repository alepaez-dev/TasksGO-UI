import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PriorityLabel } from './PriorityLabel';

describe('PriorityLabel', () => {
  it('renders the priority text', () => {
    render(<PriorityLabel priority="high" />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('applies the correct variant class for each priority', () => {
    const { rerender } = render(<PriorityLabel priority="critical" />);
    expect(screen.getByText('critical')).toHaveClass('critical');

    rerender(<PriorityLabel priority="high" />);
    expect(screen.getByText('high')).toHaveClass('high');

    rerender(<PriorityLabel priority="medium" />);
    expect(screen.getByText('medium')).toHaveClass('medium');

    rerender(<PriorityLabel priority="low" />);
    expect(screen.getByText('low')).toHaveClass('low');
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<PriorityLabel ref={ref} priority="high" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<PriorityLabel priority="high" className="custom" />);
    expect(screen.getByText('high')).toHaveClass('custom');
  });
});
