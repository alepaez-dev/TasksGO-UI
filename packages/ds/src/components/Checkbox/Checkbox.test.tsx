import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders as a checkbox with accessible name', () => {
    render(<Checkbox aria-label="Toggle task" />);
    expect(
      screen.getByRole('checkbox', { name: 'Toggle task' }),
    ).toBeInTheDocument();
  });

  it('applies default variant class by default', () => {
    render(<Checkbox aria-label="Toggle task" />);
    expect(screen.getByRole('checkbox')).toHaveClass('default');
  });

  it('applies completed variant class', () => {
    render(<Checkbox aria-label="Toggle task" variant="completed" />);
    expect(screen.getByRole('checkbox')).toHaveClass('completed');
  });

  it('checked state is controlled by prop', () => {
    render(<Checkbox aria-label="Toggle task" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    render(<Checkbox aria-label="Toggle task" onChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn();
    render(
      <Checkbox aria-label="Toggle task" disabled onChange={handleChange} />,
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<Checkbox ref={ref} aria-label="Toggle task" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges custom className', () => {
    render(<Checkbox aria-label="Toggle task" className="custom" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom');
  });
});
