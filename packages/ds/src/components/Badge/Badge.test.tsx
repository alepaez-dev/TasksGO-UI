import { createRef } from 'react';
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

  it('applies the reference variant class', () => {
    render(<Badge variant="reference">v4.1.0-alpha</Badge>);
    expect(screen.getByText('v4.1.0-alpha')).toHaveClass('reference');
  });

  it('forwards ref to the span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Label</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<Badge className="custom">Label</Badge>);
    expect(screen.getByText('Label')).toHaveClass('custom');
  });

  it('applies the count variant class and renders a plain count', () => {
    render(<Badge variant="count">37</Badge>);
    expect(screen.getByText('37')).toHaveClass('count');
  });

  it('renders a fraction count verbatim', () => {
    render(<Badge variant="count">2/13</Badge>);
    expect(screen.getByText('2/13')).toBeInTheDocument();
  });

  it('labels an ambiguous fraction via role="img" + aria-label', () => {
    render(
      <Badge variant="count" role="img" aria-label="2 of 13 checks passing">
        2/13
      </Badge>,
    );
    expect(
      screen.getByRole('img', { name: '2 of 13 checks passing' }),
    ).toBeInTheDocument();
  });
});
