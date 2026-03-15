import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders a search input', () => {
    render(<SearchInput aria-label="Search tasks" />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<SearchInput ref={ref} aria-label="Search tasks" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes placeholder to the input', () => {
    render(
      <SearchInput aria-label="Search tasks" placeholder="SEARCH TASKS..." />,
    );
    expect(screen.getByPlaceholderText('SEARCH TASKS...')).toBeInTheDocument();
  });

  it('renders shortcut hint inside a kbd element when provided', () => {
    const { container } = render(
      <SearchInput aria-label="Search tasks" shortcutHint="⌘K" />,
    );
    const kbd = container.querySelector('kbd');
    expect(kbd).toBeInTheDocument();
    expect(kbd).toHaveTextContent('⌘K');
  });

  it('does not render kbd element when shortcutHint is omitted', () => {
    const { container } = render(<SearchInput aria-label="Search tasks" />);
    expect(container.querySelector('kbd')).not.toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    render(<SearchInput aria-label="Search tasks" onChange={handleChange} />);
    await userEvent.type(screen.getByRole('searchbox'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('merges custom className on wrapper', () => {
    const { container } = render(
      <SearchInput aria-label="Search tasks" className="custom" />,
    );
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
