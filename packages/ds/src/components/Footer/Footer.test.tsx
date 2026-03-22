import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders with contentinfo role', () => {
    render(<Footer left="status" />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders left slot', () => {
    render(<Footer left={<span>Focus Mode</span>} />);
    expect(screen.getByText('Focus Mode')).toBeInTheDocument();
  });

  it('renders right slot', () => {
    render(<Footer right={<a href="/archive">Archive</a>} />);
    expect(screen.getByRole('link', { name: 'Archive' })).toBeInTheDocument();
  });

  it('renders both slots', () => {
    render(
      <Footer left={<span>Status</span>} right={<a href="/help">Help</a>} />,
    );
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Help' })).toBeInTheDocument();
  });

  it('omits left wrapper when left is not provided', () => {
    const { container } = render(<Footer right="links" />);
    const footer = container.querySelector('footer');
    expect(footer?.children).toHaveLength(1);
  });

  it('omits right wrapper when right is not provided', () => {
    const { container } = render(<Footer left="status" />);
    const footer = container.querySelector('footer');
    expect(footer?.children).toHaveLength(1);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Footer ref={ref} left="status" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('FOOTER');
  });

  it('merges custom className', () => {
    render(<Footer className="custom" left="status" />);
    expect(screen.getByRole('contentinfo')).toHaveClass('custom');
  });

  it('passes through data attributes', () => {
    render(<Footer data-testid="footer" left="status" />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders empty footer when no slots provided', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.children).toHaveLength(0);
  });
});
