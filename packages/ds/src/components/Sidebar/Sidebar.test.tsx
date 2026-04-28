import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders an aside with navigation landmark', () => {
    render(
      <Sidebar aria-label="Sidebar navigation">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    const aside = screen.getByRole('complementary');
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveAttribute('aria-label', 'Sidebar navigation');
  });

  it('renders children inside a nav element', () => {
    render(
      <Sidebar aria-label="Sidebar navigation">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(
      <Sidebar
        aria-label="Sidebar navigation"
        header={<span>Header Content</span>}
      >
        <a href="/link">Link</a>
      </Sidebar>,
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('does not render header wrapper when header is not provided', () => {
    const { container } = render(
      <Sidebar aria-label="Sidebar navigation">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    const headerDiv = container.querySelector('[class*="header"]');
    expect(headerDiv).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Sidebar
        aria-label="Sidebar navigation"
        footer={<span>Footer Content</span>}
      >
        <a href="/link">Link</a>
      </Sidebar>,
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('does not render footer wrapper when footer is not provided', () => {
    const { container } = render(
      <Sidebar aria-label="Sidebar navigation">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    const footerDiv = container.querySelector('[class*="footer"]');
    expect(footerDiv).not.toBeInTheDocument();
  });

  it('forwards ref to aside element', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(
      <Sidebar ref={ref} aria-label="Sidebar navigation">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('ASIDE');
  });

  it('applies custom className', () => {
    render(
      <Sidebar aria-label="Sidebar navigation" className="custom-class">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    const aside = screen.getByRole('complementary');
    expect(aside.className).toContain('custom-class');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <Sidebar aria-label="Sidebar navigation" data-testid="my-sidebar">
        <a href="/link">Link</a>
      </Sidebar>,
    );
    expect(screen.getByTestId('my-sidebar')).toBeInTheDocument();
  });
});
