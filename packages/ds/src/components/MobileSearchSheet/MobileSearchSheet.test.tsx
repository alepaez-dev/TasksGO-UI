import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MobileSearchSheet } from './MobileSearchSheet';
import type { SearchPaletteGroup } from '../SearchPalette';

const groups: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: [
      { id: 'r1', label: 'Fix login bug', refId: 'T-42', type: 'task' },
      { id: 'r2', label: 'Add caching', refId: 'T-43', type: 'task' },
    ],
  },
  {
    title: 'Jump to Doc',
    results: [
      { id: 'r3', label: 'Setup guide', refId: 'setup.md', type: 'doc' },
    ],
  },
];

describe('MobileSearchSheet', () => {
  it('renders a region with aria-label when open', () => {
    render(<MobileSearchSheet open onClose={() => {}} groups={groups} />);
    expect(screen.getByRole('region')).toHaveAttribute(
      'aria-label',
      'Search results',
    );
  });

  it('renders SearchPalette with mobile variant', () => {
    render(<MobileSearchSheet open onClose={() => {}} groups={groups} />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveClass('mobile');
  });

  it('renders all result groups and options', () => {
    render(<MobileSearchSheet open onClose={() => {}} groups={groups} />);
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
    expect(screen.getByText('Setup guide')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<MobileSearchSheet open onClose={handleClose} groups={groups} />);
    const backdrop = document.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    await user.click(backdrop as HTMLElement);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<MobileSearchSheet open onClose={handleClose} groups={groups} />);
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('calls onResultSelect when a result is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <MobileSearchSheet
        open
        onClose={() => {}}
        groups={groups}
        onResultSelect={handleSelect}
      />,
    );
    await user.click(screen.getByText('Fix login bug'));
    expect(handleSelect).toHaveBeenCalledWith(groups[0].results[0]);
  });

  it('renders emptyState when groups are empty and emptyState is provided', () => {
    render(
      <MobileSearchSheet
        open
        onClose={() => {}}
        groups={[]}
        emptyState="No results found"
      />,
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders nothing in scroll area when groups are empty and no emptyState', () => {
    const { container } = render(
      <MobileSearchSheet open onClose={() => {}} groups={[]} />,
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(
      container.querySelector('[class*="emptyState"]'),
    ).not.toBeInTheDocument();
  });

  it('forwards ref to the sheet panel', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <MobileSearchSheet ref={ref} open onClose={() => {}} groups={groups} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('region');
  });

  it('merges custom className', () => {
    render(
      <MobileSearchSheet
        open
        onClose={() => {}}
        groups={groups}
        className="custom"
      />,
    );
    expect(screen.getByRole('region')).toHaveClass('custom');
  });
});
