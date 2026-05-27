import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FloatingActionBar } from './FloatingActionBar';

describe('FloatingActionBar', () => {
  it('renders children inside a labelled group', () => {
    render(
      <FloatingActionBar aria-label="Scratchpad actions">
        <button type="button">Create task</button>
        <button type="button">Linked tasks (2)</button>
      </FloatingActionBar>,
    );
    const group = screen.getByRole('group', {
      name: 'Scratchpad actions',
    });
    expect(group).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create task' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Linked tasks (2)' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the group element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FloatingActionBar ref={ref} aria-label="Actions">
        <button type="button">A</button>
      </FloatingActionBar>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'group');
  });

  it('merges custom className onto the group', () => {
    render(
      <FloatingActionBar className="custom" aria-label="Actions">
        <button type="button">A</button>
      </FloatingActionBar>,
    );
    expect(screen.getByRole('group')).toHaveClass('custom');
  });

  it('spreads additional HTML attributes onto the group', () => {
    render(
      <FloatingActionBar data-testid="bar" aria-label="Actions">
        <button type="button">A</button>
      </FloatingActionBar>,
    );
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });
});
