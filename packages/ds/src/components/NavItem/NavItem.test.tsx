import { createRef, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatusIcon } from '../StatusIcon';
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
    const ref = createRef<HTMLAnchorElement>();
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

  it('renders a button when href is omitted', () => {
    render(<NavItem icon="task_alt" label="Backlog" />);
    const button = screen.getByRole('button', { name: 'Backlog' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('does not submit a surrounding form', async () => {
    const onSubmit = vi.fn((e: FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <NavItem icon="task_alt" label="Backlog" />
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Backlog' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('stays a non-submitting button even when a type is passed', async () => {
    const onSubmit = vi.fn((e: FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <NavItem
          icon="task_alt"
          label="Backlog"
          {...({ type: 'submit' } as object)}
        />
      </form>,
    );
    const button = screen.getByRole('button', { name: 'Backlog' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('marks the active button with aria-current="true"', () => {
    render(<NavItem icon="task_alt" label="Backlog" active />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true');
  });

  it('calls onClick and forwards ref in button mode', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <NavItem ref={ref} icon="task_alt" label="Backlog" onClick={onClick} />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders the count after the label', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" count={5} />);
    expect(screen.getByRole('link', { name: 'Tasks 5' })).toBeInTheDocument();
  });

  it('renders a zero count', () => {
    render(<NavItem icon="task_alt" label="In review" count={0} />);
    expect(
      screen.getByRole('button', { name: 'In review 0' }),
    ).toBeInTheDocument();
  });

  it('renders no count when it is omitted', () => {
    render(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link')).toHaveTextContent(/^Tasks$/);
  });

  it('renders a leading node instead of an icon', () => {
    const { container } = render(
      <NavItem leading={<span data-testid="lead" />} label="Backlog" />,
    );
    expect(screen.getByTestId('lead')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('keeps a labelled leading image out of the accessible name', () => {
    render(
      <NavItem
        leading={<StatusIcon status="backlog" label="Backlog" size="sm" />}
        label="Backlog"
        count={5}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Backlog 5' }),
    ).toBeInTheDocument();
  });

  it('adds noopener once, and only to links that open in a new tab', () => {
    const { rerender } = render(
      <NavItem
        icon="help"
        label="Support"
        href="https://help.example"
        target="_blank"
        rel="external"
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute(
      'rel',
      'external noopener',
    );
    rerender(
      <NavItem
        icon="help"
        label="Support"
        href="https://help.example"
        target="_blank"
        rel="noopener"
      />,
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener');
    rerender(<NavItem icon="task_alt" label="Tasks" href="/tasks" />);
    expect(screen.getByRole('link')).not.toHaveAttribute('rel');
  });
});
