import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BottomTabBar } from './BottomTabBar';
import { NavItem } from '../NavItem';

describe('BottomTabBar', () => {
  it('renders as a nav element with the given aria-label', () => {
    render(
      <BottomTabBar aria-label="Main navigation">
        <NavItem
          icon="task_alt"
          label="Tasks"
          href="/tasks"
          orientation="vertical"
        />
      </BottomTabBar>,
    );
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe('NAV');
  });

  it('renders children', () => {
    render(
      <BottomTabBar aria-label="Main navigation">
        <NavItem
          icon="task_alt"
          label="Tasks"
          href="/tasks"
          orientation="vertical"
        />
        <NavItem
          icon="description"
          label="Docs"
          href="/docs"
          orientation="vertical"
        />
      </BottomTabBar>,
    );
    expect(screen.getByRole('link', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('forwards ref to the nav element', () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(
      <BottomTabBar ref={ref} aria-label="Main navigation">
        <NavItem
          icon="task_alt"
          label="Tasks"
          href="/tasks"
          orientation="vertical"
        />
      </BottomTabBar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('merges custom className', () => {
    render(
      <BottomTabBar aria-label="Main navigation" className="custom">
        <NavItem
          icon="task_alt"
          label="Tasks"
          href="/tasks"
          orientation="vertical"
        />
      </BottomTabBar>,
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom');
  });

  it('spreads additional HTML attributes onto the nav', () => {
    render(
      <BottomTabBar aria-label="Main navigation" id="bottom-nav">
        <NavItem
          icon="task_alt"
          label="Tasks"
          href="/tasks"
          orientation="vertical"
        />
      </BottomTabBar>,
    );
    expect(screen.getByRole('navigation')).toHaveAttribute('id', 'bottom-nav');
  });
});
