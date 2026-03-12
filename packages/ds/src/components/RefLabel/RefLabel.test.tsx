import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RefLabel } from './RefLabel';

describe('RefLabel', () => {
  it('renders children text', () => {
    render(<RefLabel>INCIDENT ARTIFACT</RefLabel>);
    expect(screen.getByText('INCIDENT ARTIFACT')).toBeInTheDocument();
  });

  it('applies general variant class by default', () => {
    render(<RefLabel>Label</RefLabel>);
    expect(screen.getByText('Label')).toHaveClass('general');
  });

  it('applies the correct variant class', () => {
    const { rerender } = render(
      <RefLabel variant="attachment">Label</RefLabel>,
    );
    expect(screen.getByText('Label')).toHaveClass('attachment');

    rerender(<RefLabel variant="doc">Label</RefLabel>);
    expect(screen.getByText('Label')).toHaveClass('doc');
  });

  it('renders an icon when icon prop is provided', () => {
    render(<RefLabel icon="link">Label</RefLabel>);
    expect(screen.getByText('link')).toBeInTheDocument();
  });

  it('does not render an icon when icon is omitted', () => {
    render(<RefLabel>Label</RefLabel>);
    expect(screen.queryByText('link')).not.toBeInTheDocument();
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<RefLabel ref={ref}>Label</RefLabel>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<RefLabel className="custom">Label</RefLabel>);
    expect(screen.getByText('Label')).toHaveClass('custom');
  });
});
