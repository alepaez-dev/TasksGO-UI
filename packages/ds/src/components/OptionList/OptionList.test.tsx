import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OptionList } from './OptionList';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('OptionList', () => {
  it('renders all options inside a listbox', () => {
    render(
      <OptionList
        options={options}
        value="a"
        onSelect={vi.fn()}
        aria-label="Options"
      />,
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(3);
    expect(opts[0]).toHaveTextContent('Alpha');
  });

  it('marks the selected option with aria-selected', () => {
    render(
      <OptionList
        options={options}
        value="b"
        onSelect={vi.fn()}
        aria-label="Options"
      />,
    );
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent(
      'Beta',
    );
  });

  it('labels the listbox with aria-label', () => {
    render(
      <OptionList options={options} onSelect={vi.fn()} aria-label="Members" />,
    );
    expect(
      screen.getByRole('listbox', { name: 'Members' }),
    ).toBeInTheDocument();
  });

  it('applies listboxId to the listbox', () => {
    render(
      <OptionList
        options={options}
        onSelect={vi.fn()}
        listboxId="picker-list"
        aria-label="Options"
      />,
    );
    expect(screen.getByRole('listbox')).toHaveAttribute('id', 'picker-list');
  });

  it('calls onSelect on option click', async () => {
    const onSelect = vi.fn();
    render(
      <OptionList
        options={options}
        value="a"
        onSelect={onSelect}
        aria-label="Options"
      />,
    );
    await userEvent.click(screen.getByText('Beta'));
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('calls onSelect on Enter', async () => {
    const onSelect = vi.fn();
    render(
      <OptionList
        options={options}
        value="a"
        onSelect={onSelect}
        aria-label="Options"
      />,
    );
    screen.getAllByRole('option')[1].focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('calls onSelect on Space', async () => {
    const onSelect = vi.fn();
    render(
      <OptionList
        options={options}
        value="a"
        onSelect={onSelect}
        aria-label="Options"
      />,
    );
    screen.getAllByRole('option')[2].focus();
    await userEvent.keyboard('{ }');
    expect(onSelect).toHaveBeenCalledWith('c');
  });

  it('moves focus to next option on ArrowDown', async () => {
    render(
      <OptionList options={options} onSelect={vi.fn()} aria-label="Options" />,
    );
    const opts = screen.getAllByRole('option');
    opts[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(opts[1]).toHaveFocus();
  });

  it('moves focus to previous option on ArrowUp', async () => {
    render(
      <OptionList options={options} onSelect={vi.fn()} aria-label="Options" />,
    );
    const opts = screen.getAllByRole('option');
    opts[1].focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(opts[0]).toHaveFocus();
  });

  it('renders header content above the options', () => {
    render(
      <OptionList
        options={options}
        onSelect={vi.fn()}
        header={<input placeholder="Search..." />}
        aria-label="Options"
      />,
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders empty state when there are no options', () => {
    render(
      <OptionList
        options={[]}
        onSelect={vi.fn()}
        emptyState="No results"
        aria-label="Options"
      />,
    );
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('does not render empty state when options exist', () => {
    render(
      <OptionList
        options={options}
        onSelect={vi.fn()}
        emptyState="No results"
        aria-label="Options"
      />,
    );
    expect(screen.queryByText('No results')).not.toBeInTheDocument();
  });

  it('renders and triggers the action button', async () => {
    const onClick = vi.fn();
    render(
      <OptionList
        options={options}
        onSelect={vi.fn()}
        action={{ label: 'Create new', icon: 'add', onClick }}
        aria-label="Options"
      />,
    );
    await userEvent.click(screen.getByText('Create new'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses a custom option indicator when provided', () => {
    render(
      <OptionList
        options={options}
        value="a"
        onSelect={vi.fn()}
        renderOptionIndicator={(opt) => (
          <span data-testid={`ind-${opt.value}`} />
        )}
        aria-label="Options"
      />,
    );
    expect(screen.getByTestId('ind-a')).toBeInTheDocument();
    expect(screen.getByTestId('ind-c')).toBeInTheDocument();
  });

  it('renders icon indicator with iconColor as a CSS custom property', () => {
    const iconOptions = [
      { value: 'high', label: 'High', icon: 'flag' as const, iconColor: 'red' },
    ];
    const { container } = render(
      <OptionList
        options={iconOptions}
        value="high"
        onSelect={vi.fn()}
        aria-label="Options"
      />,
    );
    const colored = Array.from(
      container.querySelectorAll('[aria-hidden="true"]'),
    ).find(
      (el) =>
        (el as HTMLElement).style.getPropertyValue('--selector-icon-color') ===
        'red',
    );
    expect(colored).toBeTruthy();
  });

  it('renders prefix indicator instead of a dot', () => {
    const prefixOptions = [
      { value: 'T-42', label: 'Edge caching', prefix: 'T-42' },
    ];
    const { container } = render(
      <OptionList
        options={prefixOptions}
        value="T-42"
        onSelect={vi.fn()}
        aria-label="Options"
      />,
    );
    expect(screen.getByText('T-42')).toBeInTheDocument();
    expect(container.querySelectorAll('[class*="dot"]')).toHaveLength(0);
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <OptionList
        ref={ref}
        options={options}
        onSelect={vi.fn()}
        aria-label="Options"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
