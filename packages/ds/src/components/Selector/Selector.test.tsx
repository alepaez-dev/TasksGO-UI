import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Selector } from './Selector';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Selector', () => {
  it('renders trigger with selected label', () => {
    render(<Selector options={options} value="a" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('renders placeholder when no value', () => {
    render(<Selector options={options} placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders prefix in trigger', () => {
    render(
      <Selector options={options} value="a" triggerPrefix={<span>P</span>} />,
    );
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('does not render dropdown when closed', () => {
    render(<Selector options={options} value="a" />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders dropdown with options when open', () => {
    render(<Selector options={options} value="a" open />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(3);
    expect(opts[0]).toHaveTextContent('Alpha');
    expect(opts[1]).toHaveTextContent('Beta');
    expect(opts[2]).toHaveTextContent('Gamma');
  });

  it('marks selected option with aria-selected', () => {
    render(<Selector options={options} value="b" open />);
    const selected = screen.getByRole('option', { selected: true });
    expect(selected).toHaveTextContent('Beta');
  });

  it('calls onOpenChange when trigger is clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Selector options={options} value="a" onOpenChange={onOpenChange} />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('calls onValueChange and closes on option click', async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Selector
        options={options}
        value="a"
        open
        onValueChange={onValueChange}
        onOpenChange={onOpenChange}
      />,
    );
    await userEvent.click(screen.getByText('Beta'));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders action button when provided', () => {
    const onClick = vi.fn();
    render(
      <Selector
        options={options}
        value="a"
        open
        action={{ label: 'Add project', icon: 'add', onClick }}
      />,
    );
    expect(screen.getByText('Add project')).toBeInTheDocument();
  });

  it('calls action onClick when action is clicked', async () => {
    const onClick = vi.fn();
    render(
      <Selector
        options={options}
        value="a"
        open
        action={{ label: 'Add item', icon: 'add', onClick }}
      />,
    );
    await userEvent.click(screen.getByText('Add item'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('sets aria-expanded on trigger', () => {
    const { rerender } = render(<Selector options={options} value="a" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    rerender(<Selector options={options} value="a" open />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('forwards ref to container div', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<Selector ref={ref} options={options} value="a" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Selector options={options} value="a" className="custom" />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  describe('keyboard navigation', () => {
    it('opens dropdown on ArrowDown when closed', async () => {
      const onOpenChange = vi.fn();
      render(
        <Selector options={options} value="a" onOpenChange={onOpenChange} />,
      );
      screen.getByRole('button').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('opens dropdown on Enter when closed', async () => {
      const onOpenChange = vi.fn();
      render(
        <Selector options={options} value="a" onOpenChange={onOpenChange} />,
      );
      screen.getByRole('button').focus();
      await userEvent.keyboard('{Enter}');
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('opens dropdown on Space when closed', async () => {
      const onOpenChange = vi.fn();
      render(
        <Selector options={options} value="a" onOpenChange={onOpenChange} />,
      );
      screen.getByRole('button').focus();
      await userEvent.keyboard('{ }');
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('closes dropdown on Escape from trigger', async () => {
      const onOpenChange = vi.fn();
      render(
        <Selector
          options={options}
          value="a"
          open
          onOpenChange={onOpenChange}
        />,
      );
      screen.getByRole('button').focus();
      await userEvent.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('selects option and closes on Enter, returning focus to trigger', async () => {
      const onValueChange = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Selector
          options={options}
          value="a"
          open
          onValueChange={onValueChange}
          onOpenChange={onOpenChange}
        />,
      );
      const opts = screen.getAllByRole('option');
      opts[1].focus();
      await userEvent.keyboard('{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('b');
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('selects option and closes on Space, returning focus to trigger', async () => {
      const onValueChange = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Selector
          options={options}
          value="a"
          open
          onValueChange={onValueChange}
          onOpenChange={onOpenChange}
        />,
      );
      const opts = screen.getAllByRole('option');
      opts[1].focus();
      await userEvent.keyboard('{ }');
      expect(onValueChange).toHaveBeenCalledWith('b');
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('closes dropdown on Escape from option, returning focus to trigger', async () => {
      const onOpenChange = vi.fn();
      render(
        <Selector
          options={options}
          value="a"
          open
          onOpenChange={onOpenChange}
        />,
      );
      const opts = screen.getAllByRole('option');
      opts[0].focus();
      await userEvent.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('moves focus to next option on ArrowDown', async () => {
      render(<Selector options={options} value="a" open />);
      const opts = screen.getAllByRole('option');
      opts[0].focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(opts[1]).toHaveFocus();
    });

    it('moves focus to previous option on ArrowUp', async () => {
      render(<Selector options={options} value="a" open />);
      const opts = screen.getAllByRole('option');
      opts[1].focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(opts[0]).toHaveFocus();
    });
  });
});
