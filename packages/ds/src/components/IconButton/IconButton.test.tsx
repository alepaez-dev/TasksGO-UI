import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders with aria-label as accessible name', () => {
    render(<IconButton icon="menu" aria-label="Open menu" />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
    render(<IconButton ref={ref} icon="menu" aria-label="Menu" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<IconButton icon="menu" aria-label="Menu" onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <IconButton
        icon="menu"
        aria-label="Menu"
        disabled
        onClick={handleClick}
      />,
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies md size class by default', () => {
    render(<IconButton icon="menu" aria-label="Menu" />);
    expect(screen.getByRole('button')).toHaveClass('md');
  });

  it('applies sm size class', () => {
    render(<IconButton icon="menu" aria-label="Menu" size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('sm');
  });

  it('merges custom className', () => {
    render(<IconButton icon="menu" aria-label="Menu" className="custom" />);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('renders the icon as SVG with aria-hidden', () => {
    const { container } = render(<IconButton icon="menu" aria-label="Menu" />);
    const iconSpan = container.querySelector('[aria-hidden="true"]');
    expect(iconSpan).toBeInTheDocument();
    expect(iconSpan?.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render icon name as visible text', () => {
    render(<IconButton icon="menu" aria-label="Menu" />);
    expect(screen.queryByText('menu')).not.toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<IconButton icon="menu" aria-label="Menu" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
