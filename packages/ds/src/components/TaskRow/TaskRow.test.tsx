import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TaskRow } from './TaskRow';

describe('TaskRow', () => {
  it('renders the title', () => {
    render(<TaskRow title="Fix login bug" />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders a checkbox with accessible label derived from title', () => {
    render(<TaskRow title="Fix login bug" />);
    expect(
      screen.getByRole('checkbox', { name: 'Toggle Fix login bug' }),
    ).toBeInTheDocument();
  });

  it('renders badge when provided', () => {
    render(
      <TaskRow
        title="Fix login bug"
        badge={{ label: 'In Progress', variant: 'progress' }}
      />,
    );
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders priority label when provided', () => {
    render(<TaskRow title="Fix login bug" priority="critical" />);
    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('renders ticket id when provided', () => {
    render(<TaskRow title="Fix login bug" ticketId="ENG-902" />);
    expect(screen.getByText('ENG-902')).toBeInTheDocument();
  });

  it('renders date when provided', () => {
    render(
      <TaskRow
        title="Fix login bug"
        date={{ label: 'Mar 15', dateTime: '2026-03-15' }}
      />,
    );
    expect(screen.getByText('Mar 15')).toBeInTheDocument();
  });

  it('renders a single ref label below the title', () => {
    render(
      <TaskRow
        title="Fix login bug"
        refs={[
          { label: 'spec.pdf', variant: 'attachment', icon: 'attach_file' },
        ]}
      />,
    );
    expect(screen.getByText('spec.pdf')).toBeInTheDocument();
  });

  it('renders multiple ref labels', () => {
    render(
      <TaskRow
        title="Fix login bug"
        refs={[
          { label: 'spec.pdf', variant: 'attachment', icon: 'attach_file' },
          { label: 'RFC-12', variant: 'doc', icon: 'description' },
        ]}
      />,
    );
    expect(screen.getByText('spec.pdf')).toBeInTheDocument();
    expect(screen.getByText('RFC-12')).toBeInTheDocument();
  });

  it('does not render refs container when refs is empty', () => {
    const { container } = render(<TaskRow title="Fix login bug" refs={[]} />);
    expect(container.querySelector('.refs')).not.toBeInTheDocument();
  });

  it('calls onCheckedChange when checkbox is clicked', async () => {
    const handleChange = vi.fn();
    render(<TaskRow title="Fix login bug" onCheckedChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies completed styles when completed', () => {
    const { container } = render(
      <TaskRow
        title="Old task"
        completed
        checked
        onCheckedChange={() => {
          /* noop */
        }}
      />,
    );
    expect(container.firstElementChild).toHaveClass('completed');
  });

  it('uses completed variant on checkbox when completed', () => {
    render(
      <TaskRow
        title="Old task"
        completed
        checked
        onCheckedChange={() => {
          /* noop */
        }}
      />,
    );
    expect(screen.getByRole('checkbox')).toHaveClass('completed');
  });

  it('forwards ref to the div element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<TaskRow ref={ref} title="Fix login bug" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <TaskRow title="Fix login bug" className="custom" />,
    );
    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('applies compact layout class', () => {
    const { container } = render(
      <TaskRow title="Fix login bug" layout="compact" />,
    );
    expect(container.firstElementChild).toHaveClass('compact');
  });

  it('renders separator between ticket and date in compact', () => {
    const { container } = render(
      <TaskRow
        title="Fix login bug"
        layout="compact"
        ticketId="T-104"
        date={{ label: 'Today', dateTime: '2026-03-16' }}
      />,
    );
    const separator = container.querySelector('[aria-hidden="true"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveTextContent('·');
  });

  it('does not render separator when only ticket is provided', () => {
    const { container } = render(
      <TaskRow title="Fix login bug" layout="compact" ticketId="T-104" />,
    );
    const separator = container.querySelector('[aria-hidden="true"]');
    expect(separator).not.toBeInTheDocument();
  });
});
