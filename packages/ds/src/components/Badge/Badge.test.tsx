import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>v4.1.0-alpha</Badge>);
    expect(screen.getByText('v4.1.0-alpha')).toBeInTheDocument();
  });

  it('applies default variant class by default', () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText('Label')).toHaveClass('default');
  });

  it('applies the correct variant class', () => {
    render(<Badge variant="progress">In Progress</Badge>);
    expect(screen.getByText('In Progress')).toHaveClass('progress');
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<Badge ref={ref}>Label</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<Badge className="custom">Label</Badge>);
    expect(screen.getByText('Label')).toHaveClass('custom');
  });
});
