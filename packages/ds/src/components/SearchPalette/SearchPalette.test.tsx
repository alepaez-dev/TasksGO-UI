import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { SearchPalette, type SearchPaletteGroup } from './SearchPalette';

const groups: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: [
      { id: 'r1', label: 'Update login flow', refId: 'TSK-042', type: 'task' },
      { id: 'r2', label: 'Fix auth token', refId: 'TSK-041', type: 'task' },
    ],
  },
  {
    title: 'Jump to Ticket',
    results: [
      { id: 'r3', label: 'Login timeout', refId: 'TKT-15', type: 'ticket' },
    ],
  },
  {
    title: 'Jump to Doc',
    results: [{ id: 'r4', label: 'Auth guide', refId: 'DOC-7', type: 'doc' }],
  },
];

describe('SearchPalette', () => {
  it('renders with listbox role', () => {
    render(<SearchPalette groups={groups} aria-label="Search results" />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('renders all groups with aria-label', () => {
    render(<SearchPalette groups={groups} aria-label="Search results" />);
    expect(
      screen.getByRole('group', { name: 'Jump to Task' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Jump to Ticket' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Jump to Doc' }),
    ).toBeInTheDocument();
  });

  it('renders group headers', () => {
    render(<SearchPalette groups={groups} aria-label="Search results" />);
    expect(screen.getByText('Jump to Task')).toBeInTheDocument();
    expect(screen.getByText('Jump to Ticket')).toBeInTheDocument();
    expect(screen.getByText('Jump to Doc')).toBeInTheDocument();
  });

  it('renders all result options', () => {
    render(<SearchPalette groups={groups} aria-label="Search results" />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  it('renders result labels and ref IDs', () => {
    render(<SearchPalette groups={groups} aria-label="Search results" />);
    expect(screen.getByText('Update login flow')).toBeInTheDocument();
    expect(screen.getByText('TSK-042')).toBeInTheDocument();
    expect(screen.getByText('Login timeout')).toBeInTheDocument();
    expect(screen.getByText('TKT-15')).toBeInTheDocument();
    expect(screen.getByText('Auth guide')).toBeInTheDocument();
    expect(screen.getByText('DOC-7')).toBeInTheDocument();
  });

  it('marks the active result with aria-selected', () => {
    render(
      <SearchPalette
        groups={groups}
        activeResultId="r3"
        aria-label="Search results"
      />,
    );
    const options = screen.getAllByRole('option');
    const selected = options.find(
      (o) => o.getAttribute('aria-selected') === 'true',
    );
    expect(selected).toBeDefined();
    expect(selected).toHaveAttribute('id', 'search-palette-r3');
  });

  it('sets aria-selected=false on non-active results', () => {
    render(
      <SearchPalette
        groups={groups}
        activeResultId="r1"
        aria-label="Search results"
      />,
    );
    const options = screen.getAllByRole('option');
    const notSelected = options.filter(
      (o) => o.getAttribute('aria-selected') === 'false',
    );
    expect(notSelected).toHaveLength(3);
  });

  it('calls onResultSelect when a result is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <SearchPalette
        groups={groups}
        onResultSelect={handleSelect}
        aria-label="Search results"
      />,
    );
    await user.click(screen.getByText('Login timeout'));
    expect(handleSelect).toHaveBeenCalledWith({
      id: 'r3',
      label: 'Login timeout',
      refId: 'TKT-15',
      type: 'ticket',
    });
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SearchPalette ref={ref} groups={groups} aria-label="Search results" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    render(
      <SearchPalette
        groups={groups}
        className="custom"
        aria-label="Search results"
      />,
    );
    expect(screen.getByRole('listbox')).toHaveClass('custom');
  });

  it('passes through data attributes', () => {
    render(
      <SearchPalette
        groups={groups}
        data-testid="palette"
        aria-label="Search results"
      />,
    );
    expect(screen.getByTestId('palette')).toBeInTheDocument();
  });

  it('renders empty when groups array is empty', () => {
    render(<SearchPalette groups={[]} aria-label="Search results" />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('assigns namespaced result id to DOM element for aria-activedescendant', () => {
    render(
      <SearchPalette id="sp" groups={groups} aria-label="Search results" />,
    );
    expect(document.getElementById('sp-r1')).toBeInTheDocument();
    expect(document.getElementById('sp-r2')).toBeInTheDocument();
    expect(document.getElementById('sp-r3')).toBeInTheDocument();
    expect(document.getElementById('sp-r4')).toBeInTheDocument();
  });

  it('calls onResultSelect on Enter key', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <SearchPalette
        groups={groups}
        onResultSelect={handleSelect}
        aria-label="Search results"
      />,
    );
    const option = screen.getAllByRole('option')[0];
    option.focus();
    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalledWith(groups[0].results[0]);
  });

  it('calls onResultSelect on Space key', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <SearchPalette
        groups={groups}
        onResultSelect={handleSelect}
        aria-label="Search results"
      />,
    );
    const option = screen.getAllByRole('option')[1];
    option.focus();
    await user.keyboard(' ');
    expect(handleSelect).toHaveBeenCalledWith(groups[0].results[1]);
  });
});
