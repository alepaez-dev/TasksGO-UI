import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PropertyRow } from './PropertyRow';

describe('PropertyRow', () => {
  it('renders icon, label, and children', () => {
    render(
      <PropertyRow icon="person" label="Assignee">
        Alex D.
      </PropertyRow>,
    );
    expect(screen.getByText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Alex D.')).toBeInTheDocument();
  });

  it('renders without an icon when icon prop is omitted', () => {
    const { container } = render(
      <PropertyRow label="Assignee">Alex D.</PropertyRow>,
    );
    expect(screen.getByText('Assignee')).toBeInTheDocument();
    expect(screen.getByText('Alex D.')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders a div when not interactive', () => {
    render(
      <PropertyRow icon="tag" label="Project">
        Infrastructure
      </PropertyRow>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a native button when onClick is provided', () => {
    const onClick = vi.fn();
    render(
      <PropertyRow icon="person" label="Assignee" onClick={onClick}>
        Alex D.
      </PropertyRow>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when value is clicked', () => {
    const onClick = vi.fn();
    render(
      <PropertyRow icon="person" label="Assignee" onClick={onClick}>
        Alex D.
      </PropertyRow>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <PropertyRow ref={ref} icon="person" label="Assignee">
        Alex D.
      </PropertyRow>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <PropertyRow icon="person" label="Assignee" className="custom">
        Alex D.
      </PropertyRow>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});
