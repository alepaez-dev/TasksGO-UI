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

  it('renders per-option meta on a non-selected option', () => {
    render(
      <OptionList
        options={[
          { value: 'qa-01', label: 'QA-01' },
          { value: 'qa-02', label: 'QA-02', meta: 'Stable' },
        ]}
        value="qa-01"
        onSelect={vi.fn()}
        aria-label="Environments"
      />,
    );
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  it('suppresses meta on the selected option (check takes its place)', () => {
    render(
      <OptionList
        options={[
          { value: 'qa-01', label: 'QA-01', meta: 'Healthy' },
          { value: 'qa-02', label: 'QA-02', meta: 'Stable' },
        ]}
        value="qa-01"
        onSelect={vi.fn()}
        aria-label="Environments"
      />,
    );
    expect(screen.queryByText('Healthy')).not.toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  it('renders a per-option description under the label', () => {
    render(
      <OptionList
        options={[
          {
            value: 'passed',
            label: 'Passed',
            description: 'Scenario verified as working',
          },
          { value: 'failed', label: 'Failed' },
        ]}
        value="failed"
        onSelect={vi.fn()}
        aria-label="Statuses"
      />,
    );
    expect(
      screen.getByText('Scenario verified as working'),
    ).toBeInTheDocument();
  });

  it('keeps the option name as the label and exposes the description separately', () => {
    render(
      <OptionList
        options={[
          {
            value: 'waived',
            label: 'Waived',
            description: 'Skip — requires an explanation',
          },
        ]}
        onSelect={vi.fn()}
        aria-label="Statuses"
      />,
    );
    const option = screen.getByRole('option');
    expect(option).toHaveAccessibleName('Waived');
    expect(option).toHaveAccessibleDescription(
      'Skip — requires an explanation',
    );
  });

  it('gives each option its own description, not a shared one', () => {
    render(
      <OptionList
        options={[
          { value: 'passed', label: 'Passed', description: 'Verified' },
          { value: 'failed', label: 'Failed', description: 'Defect observed' },
        ]}
        onSelect={vi.fn()}
        aria-label="Statuses"
      />,
    );
    const [passed, failed] = screen.getAllByRole('option');
    expect(passed).toHaveAccessibleDescription('Verified');
    expect(failed).toHaveAccessibleDescription('Defect observed');
  });

  it('leaves an option without a description undescribed', () => {
    render(
      <OptionList options={options} onSelect={vi.fn()} aria-label="Options" />,
    );
    expect(screen.getAllByRole('option')[0]).toHaveAccessibleDescription('');
  });

  it('treats an empty description as no description', () => {
    render(
      <OptionList
        options={[
          { value: 'a', label: 'Alpha', description: '' },
          { value: 'b', label: 'Beta' },
        ]}
        onSelect={vi.fn()}
        aria-label="Options"
      />,
    );
    const [empty, plain] = screen.getAllByRole('option');
    expect(empty).not.toHaveAttribute('aria-describedby');
    expect(empty.className).toBe(plain.className);
  });

  it('keeps the prefix in the option name', () => {
    render(
      <OptionList
        options={[{ value: 'T-42', label: 'Edge caching', prefix: 'T-42' }]}
        onSelect={vi.fn()}
        aria-label="Tickets"
      />,
    );
    expect(screen.getByRole('option')).toHaveAccessibleName(
      'T-42 Edge caching',
    );
  });

  it('names every option by its label, even with a text-bearing indicator', () => {
    render(
      <OptionList
        options={[
          { value: 'passed', label: 'Passed', description: 'Verified' },
          { value: 'failed', label: 'Failed' },
          { value: 'qa-02', label: 'QA-02', meta: 'Stable' },
        ]}
        onSelect={vi.fn()}
        renderOptionIndicator={(option) => (
          <span role="img" aria-label={option.label} />
        )}
        aria-label="Statuses"
      />,
    );
    const names = screen
      .getAllByRole('option')
      .map((option) => option.getAttribute('aria-label'));
    expect(names).toEqual(['Passed', 'Failed', 'QA-02']);
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
