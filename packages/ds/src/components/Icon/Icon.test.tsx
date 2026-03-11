import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders the icon name as text content', () => {
    render(<Icon name="task_alt" />);
    expect(screen.getByText('task_alt')).toBeInTheDocument();
  });

  it('applies md size class by default', () => {
    render(<Icon name="task_alt" />);
    expect(screen.getByText('task_alt')).toHaveClass('md');
  });

  it('applies the sm size class', () => {
    render(<Icon name="task_alt" size="sm" />);
    expect(screen.getByText('task_alt')).toHaveClass('sm');
  });

  it('sets aria-hidden to true', () => {
    render(<Icon name="task_alt" />);
    expect(screen.getByText('task_alt')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<Icon ref={ref} name="task_alt" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<Icon name="task_alt" className="custom" />);
    expect(screen.getByText('task_alt')).toHaveClass('custom');
  });
});
