import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders the initial', () => {
    render(<Avatar initial="P" aria-label="Project P" />);
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('has role="img" and aria-label', () => {
    render(<Avatar initial="P" aria-label="Project P" />);
    const el = screen.getByRole('img', { name: 'Project P' });
    expect(el).toBeInTheDocument();
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<Avatar ref={ref} initial="P" aria-label="Project P" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<Avatar initial="P" aria-label="Project P" className="custom" />);
    expect(screen.getByRole('img')).toHaveClass('custom');
  });
});
