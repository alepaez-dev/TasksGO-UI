import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskSection } from './TaskSection';

describe('TaskSection', () => {
  it('renders the title', () => {
    render(
      <TaskSection title="ACTIVE TASKS">
        <p>Content</p>
      </TaskSection>,
    );
    expect(screen.getByText('ACTIVE TASKS')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <TaskSection title="ACTIVE TASKS">
        <p>Task list</p>
      </TaskSection>,
    );
    expect(screen.getByText('Task list')).toBeInTheDocument();
  });

  it('renders count badge when provided', () => {
    render(
      <TaskSection title="ACTIVE TASKS" count={3}>
        <p>Content</p>
      </TaskSection>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('does not render badge when count is omitted', () => {
    const { container } = render(
      <TaskSection title="ACTIVE TASKS">
        <p>Content</p>
      </TaskSection>,
    );
    expect(container.querySelector('.badge')).not.toBeInTheDocument();
  });

  it('renders as open when open prop is set', () => {
    const { container } = render(
      <TaskSection title="ACTIVE TASKS" open>
        <p>Content</p>
      </TaskSection>,
    );
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('forwards ref to the details element', () => {
    const ref = {
      current: null,
    } as React.RefObject<HTMLDetailsElement | null>;
    render(
      <TaskSection ref={ref} title="ACTIVE TASKS">
        <p>Content</p>
      </TaskSection>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDetailsElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <TaskSection title="ACTIVE TASKS" className="custom">
        <p>Content</p>
      </TaskSection>,
    );
    expect(container.querySelector('details')).toHaveClass('custom');
  });
});
