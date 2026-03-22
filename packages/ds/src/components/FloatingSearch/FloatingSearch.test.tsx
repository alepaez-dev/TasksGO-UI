import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingSearch } from './FloatingSearch';

describe('FloatingSearch', () => {
  it('renders a searchbox', () => {
    render(<FloatingSearch placeholder="Search..." />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('forwards ref to input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<FloatingSearch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders shortcut hint when provided', () => {
    render(<FloatingSearch shortcutHint="⌘K" />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('does not render shortcut hint when not provided', () => {
    const { container } = render(<FloatingSearch />);
    const kbd = container.querySelector('kbd');
    expect(kbd).not.toBeInTheDocument();
  });

  it('fires onChange', () => {
    const handleChange = vi.fn();
    render(<FloatingSearch onChange={handleChange} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'test' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('merges custom className on bar', () => {
    const { container } = render(<FloatingSearch className="custom" />);
    const bar = container.querySelector('[class*="bar"]');
    expect(bar?.className).toContain('custom');
  });

  it('spreads HTML attributes to input', () => {
    render(<FloatingSearch data-testid="float-input" aria-label="Search" />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('data-testid', 'float-input');
    expect(input).toHaveAttribute('aria-label', 'Search');
  });
});
