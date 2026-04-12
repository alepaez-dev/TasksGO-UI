import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Fab } from './Fab';

// TODO: add Playwright E2E coverage (fixed positioning, z-index stacking) when Tasks Page mobile lands
describe('Fab', () => {
  it('renders with aria-label as accessible name', () => {
    render(<Fab aria-label="New task" />);
    expect(
      screen.getByRole('button', { name: 'New task' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
    render(<Fab ref={ref} aria-label="New task" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Fab aria-label="New task" onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Fab aria-label="New task" disabled onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders the icon as SVG with aria-hidden', () => {
    const { container } = render(<Fab aria-label="New task" />);
    const iconSpan = container.querySelector('[aria-hidden="true"]');
    expect(iconSpan).toBeInTheDocument();
    expect(iconSpan?.querySelector('svg')).toBeInTheDocument();
  });

  it('accepts a custom icon', () => {
    render(<Fab icon="search" aria-label="Search" />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Fab aria-label="New task" className="custom" />);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('does not render icon name as visible text', () => {
    render(<Fab aria-label="New task" />);
    expect(screen.queryByText('add')).not.toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<Fab aria-label="New task" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('allows type to be overridden', () => {
    render(<Fab aria-label="New task" type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('activates on Enter key', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Fab aria-label="New task" onClick={handleClick} />);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
