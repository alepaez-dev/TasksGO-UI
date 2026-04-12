import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('renders as an anchor element', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    const link = screen.getByRole('link', { name: 'Tasks' });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('has accessible name from label', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link', { name: 'Tasks' })).toBeInTheDocument();
  });

  it('renders the icon', () => {
    const { container } = render(
      <NavItem icon="task_alt" label="Tasks" href="/tasks" />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('sets aria-current="page" when active', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" active />);
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('does not set aria-current when inactive', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  it('applies md size class by default', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link')).toHaveClass('md');
  });

  it('applies sm size class', () => {
    render(
      <NavItem icon="settings" label="Settings" href="/settings" size="sm" />,
    );
    expect(screen.getByRole('link')).toHaveClass('sm');
  });

  it('forwards ref to the anchor element', () => {
    const ref = { current: null } as React.RefObject<HTMLAnchorElement | null>;
    render(<NavItem ref={ref} icon="task_alt" label="Tasks" href="/tasks" />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('merges custom className', () => {
    render(
      <NavItem
        icon="task_alt"
        label="Tasks"
        href="/tasks"
        className="custom"
      />,
    );
    expect(screen.getByRole('link')).toHaveClass('custom');
  });

  it('passes href to the anchor', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/tasks');
  });

  it('does not apply vertical class by default', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link')).not.toHaveClass('vertical');
  });

  it('applies vertical orientation class', () => {
    render(
      <NavItem
        icon="task_alt"
        label="Tasks"
        href="/tasks"
        orientation="vertical"
      />,
    );
    expect(screen.getByRole('link')).toHaveClass('vertical');
  });

  it('sets aria-current="page" in vertical active state', () => {
    render(
      <NavItem
        icon="task_alt"
        label="Tasks"
        href="/tasks"
        orientation="vertical"
        active
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('swaps to activeIcon when active', () => {
    const { container } = render(
      <NavItem
        icon="task_alt"
        activeIcon="check_circle"
        label="Tasks"
        href="/tasks"
        active
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('path')?.getAttribute('d')).toMatch(/^m424-296/);
  });

  it('uses icon (not activeIcon) when inactive', () => {
    const { container } = render(
      <NavItem
        icon="task_alt"
        activeIcon="check_circle"
        label="Tasks"
        href="/tasks"
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg?.querySelector('path')?.getAttribute('d')).toMatch(/^M480-80/);
  });

  it('falls back to icon when activeIcon is omitted and active', () => {
    const { container } = render(
      <NavItem icon="task_alt" label="Tasks" href="/tasks" active />,
    );
    const svg = container.querySelector('svg');
    expect(svg?.querySelector('path')?.getAttribute('d')).toMatch(/^M480-80/);
  });
});
