import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('has role="img" and aria-label', () => {
    render(<StatusDot label="Active" />);
    expect(screen.getByRole('img', { name: 'Active' })).toBeInTheDocument();
  });

  it('applies active variant class by default', () => {
    render(<StatusDot label="Active" />);
    expect(screen.getByRole('img')).toHaveClass('active');
  });

  it('applies the correct variant class', () => {
    render(<StatusDot variant="critical" label="Critical" />);
    expect(screen.getByRole('img')).toHaveClass('critical');
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<StatusDot ref={ref} label="Active" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<StatusDot label="Active" className="custom" />);
    expect(screen.getByRole('img')).toHaveClass('custom');
  });
});
