import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders children text', () => {
    render(<SectionHeader>Project Artifacts</SectionHeader>);
    expect(screen.getByText('Project Artifacts')).toBeInTheDocument();
  });

  it('renders as an h3 element', () => {
    render(<SectionHeader>Label</SectionHeader>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('forwards ref to the heading element', () => {
    const ref = { current: null } as React.RefObject<HTMLHeadingElement | null>;
    render(<SectionHeader ref={ref}>Label</SectionHeader>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('merges custom className', () => {
    render(<SectionHeader className="custom">Label</SectionHeader>);
    expect(screen.getByText('Label')).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(<SectionHeader data-testid="section">Label</SectionHeader>);
    expect(screen.getByTestId('section')).toBeInTheDocument();
  });
});
