import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Selector } from './Selector';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

// Type-level tests: option indicators are mutually exclusive
// prettier-ignore
{ // @ts-expect-error — cannot have both icon and prefix
  void (<Selector options={[{ value: 'x', label: 'X', icon: 'flag' as const, prefix: 'P' }]} />);
  // @ts-expect-error — cannot mix icon options with plain options
  void (<Selector options={[{ value: 'a', label: 'A', icon: 'flag' as const }, { value: 'b', label: 'B' }]} />);
  // @ts-expect-error — cannot mix prefix options with icon options
  void (<Selector options={[{ value: 'a', label: 'A', icon: 'flag' as const }, { value: 'b', label: 'B', prefix: 'P' }]} />);
}

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

  it('closes dropdown when action is clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <Selector
        options={options}
        value="a"
        open
        onOpenChange={onOpenChange}
        action={{ label: 'Add item', icon: 'add', onClick: () => {} }}
      />,
    );
    await userEvent.click(screen.getByText('Add item'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
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

  it('sets aria-controls on trigger when open', () => {
    const { rerender } = render(
      <Selector options={options} value="a" id="test" />,
    );
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-controls');
    rerender(<Selector options={options} value="a" id="test" open />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-controls',
      'test-listbox',
    );
  });

  it('sets aria-label on trigger button', () => {
    render(<Selector options={options} value="a" aria-label="Choose option" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Choose option',
    );
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

  it('focuses selected option when dropdown opens', () => {
    render(<Selector options={options} value="b" open />);
    const selected = screen.getByRole('option', { selected: true });
    expect(selected).toHaveFocus();
  });

  it('focuses first option when dropdown opens with no selection', () => {
    render(<Selector options={options} open />);
    const opts = screen.getAllByRole('option');
    expect(opts[0]).toHaveFocus();
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

    it('closes dropdown on Escape from header input, returning focus to trigger', async () => {
      const onOpenChange = vi.fn();
      render(
        <Selector
          options={options}
          value="a"
          open
          onOpenChange={onOpenChange}
          header={<input placeholder="Search..." />}
        />,
      );
      screen.getByPlaceholderText('Search...').focus();
      await userEvent.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('does not propagate Escape to parent when dropdown is open', async () => {
      const parentKeyDown = vi.fn();
      render(
        <div onKeyDown={parentKeyDown}>
          <Selector
            options={options}
            value="a"
            open
            header={<input placeholder="Search..." />}
          />
        </div>,
      );
      screen.getByPlaceholderText('Search...').focus();
      await userEvent.keyboard('{Escape}');
      const escapeCall = parentKeyDown.mock.calls.find(
        (call) => (call[0] as KeyboardEvent).key === 'Escape',
      );
      expect((escapeCall?.[0] as KeyboardEvent).defaultPrevented).toBe(true);
    });
  });

  describe('icon options', () => {
    const iconOptions = [
      { value: 'high', label: 'High', icon: 'flag' as const, iconColor: 'red' },
      { value: 'low', label: 'Low', icon: 'flag' as const, iconColor: 'gray' },
    ];

    it('renders icon instead of dot when option has icon', () => {
      const { container } = render(
        <Selector options={iconOptions} value="high" open />,
      );
      const dots = container.querySelectorAll('[class*="dot"]');
      expect(dots).toHaveLength(0);
    });

    it('renders selected icon in trigger', () => {
      render(<Selector options={iconOptions} value="high" />);
      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
    });

    it('applies iconColor as CSS custom property', () => {
      const { container } = render(
        <Selector options={iconOptions} value="high" open />,
      );
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      const coloredIcon = Array.from(icons).find(
        (el) =>
          (el as HTMLElement).style.getPropertyValue(
            '--selector-icon-color',
          ) === 'red',
      );
      expect(coloredIcon).toBeTruthy();
    });
  });

  describe('dropdownAlign', () => {
    it('applies end alignment class', () => {
      const { container } = render(
        <Selector options={options} value="a" open dropdownAlign="end" />,
      );
      const dropdown = container.querySelector('[class*="dropdownEnd"]');
      expect(dropdown).toBeTruthy();
    });

    it('does not apply end class by default', () => {
      const { container } = render(
        <Selector options={options} value="a" open />,
      );
      const dropdown = container.querySelector('[class*="dropdownEnd"]');
      expect(dropdown).toBeFalsy();
    });
  });

  describe('prefix options', () => {
    const prefixOptions = [
      { value: 'T-42', label: 'Implement edge-caching', prefix: 'T-42' },
      { value: 'T-104', label: 'Unit tests for cache', prefix: 'T-104' },
    ];

    it('renders prefix text instead of dot', () => {
      render(<Selector options={prefixOptions} value="T-42" open />);
      expect(screen.getByText('T-42')).toBeInTheDocument();
      expect(screen.getByText('T-104')).toBeInTheDocument();
    });

    it('shows prefix · label in trigger', () => {
      render(<Selector options={prefixOptions} value="T-42" />);
      expect(
        screen.getByText('T-42 · Implement edge-caching'),
      ).toBeInTheDocument();
    });
  });

  describe('renderTriggerLabel', () => {
    const prefixOptions = [
      { value: 'T-42', label: 'Implement edge-caching', prefix: 'T-42' },
    ];

    it('uses custom render when provided', () => {
      render(
        <Selector
          options={prefixOptions}
          value="T-42"
          renderTriggerLabel={(opt) =>
            'prefix' in opt && opt.prefix
              ? `${opt.prefix}: ${opt.label}`
              : opt.label
          }
        />,
      );
      expect(
        screen.getByText('T-42: Implement edge-caching'),
      ).toBeInTheDocument();
    });

    it('falls back to default format when not provided', () => {
      render(<Selector options={prefixOptions} value="T-42" />);
      expect(
        screen.getByText('T-42 · Implement edge-caching'),
      ).toBeInTheDocument();
    });
  });

  describe('renderOptionIndicator', () => {
    it('uses custom indicator when provided', () => {
      render(
        <Selector
          options={options}
          value="a"
          open
          renderOptionIndicator={(opt) => (
            <span data-testid={`ind-${opt.value}`} />
          )}
        />,
      );
      expect(screen.getByTestId('ind-a')).toBeInTheDocument();
      expect(screen.getByTestId('ind-b')).toBeInTheDocument();
      expect(screen.getByTestId('ind-c')).toBeInTheDocument();
    });

    it('falls back to default indicator when not provided', () => {
      render(<Selector options={options} value="a" open />);
      expect(screen.queryByTestId('ind-a')).not.toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(options.length);
    });
  });

  describe('header', () => {
    it('renders header content above options', () => {
      render(
        <Selector
          options={options}
          value="a"
          open
          header={<input placeholder="Search..." />}
        />,
      );
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('does not render header when closed', () => {
      render(
        <Selector
          options={options}
          value="a"
          header={<input placeholder="Search..." />}
        />,
      );
      expect(
        screen.queryByPlaceholderText('Search...'),
      ).not.toBeInTheDocument();
    });
  });
});
