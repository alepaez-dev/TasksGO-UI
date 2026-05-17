import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChecklistRow } from './ChecklistRow';

describe('ChecklistRow', () => {
  it('renders the label', () => {
    render(<ChecklistRow status="passed" label="Cache hit" />);
    expect(screen.getByText('Cache hit')).toBeInTheDocument();
  });

  it('renders meta when provided', () => {
    render(
      <ChecklistRow status="passed" label="Cache hit" meta="Verified by JD" />,
    );
    expect(screen.getByText('Verified by JD')).toBeInTheDocument();
  });

  it('does not render meta when omitted', () => {
    render(<ChecklistRow status="passed" label="Cache hit" />);
    expect(screen.queryByText('Verified by JD')).not.toBeInTheDocument();
  });

  it('announces the passed status to assistive tech', () => {
    render(<ChecklistRow status="passed" label="Cache hit" />);
    expect(screen.getByText('Passed:')).toBeInTheDocument();
  });

  it('announces the failed status to assistive tech', () => {
    render(<ChecklistRow status="failed" label="Invalidation latency" />);
    expect(screen.getByText('Failed:')).toBeInTheDocument();
  });

  it('announces the pending status to assistive tech', () => {
    render(<ChecklistRow status="pending" label="TTL override" />);
    expect(screen.getByText('Pending:')).toBeInTheDocument();
  });

  it('is not clickable by default', () => {
    render(<ChecklistRow status="passed" label="Cache hit" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a focusable button when onClick is provided', () => {
    const onClick = vi.fn();
    render(
      <ChecklistRow status="failed" label="Invalidation" onClick={onClick} />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('fires onClick when the clickable row is clicked', () => {
    const onClick = vi.fn();
    render(
      <ChecklistRow status="failed" label="Invalidation" onClick={onClick} />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when Enter is pressed on the clickable row', () => {
    const onClick = vi.fn();
    render(
      <ChecklistRow status="failed" label="Invalidation" onClick={onClick} />,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when Space is pressed on the clickable row', () => {
    const onClick = vi.fn();
    render(
      <ChecklistRow status="failed" label="Invalidation" onClick={onClick} />,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('still activates on Enter when a consumer onKeyDown is also provided', () => {
    const onClick = vi.fn();
    const consumerKeyDown = vi.fn();
    render(
      <ChecklistRow
        status="failed"
        label="Invalidation"
        onClick={onClick}
        onKeyDown={consumerKeyDown}
      />,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(consumerKeyDown).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not activate when consumer onKeyDown calls preventDefault', () => {
    const onClick = vi.fn();
    const consumerKeyDown = vi.fn((event: React.KeyboardEvent) => {
      event.preventDefault();
    });
    render(
      <ChecklistRow
        status="failed"
        label="Invalidation"
        onClick={onClick}
        onKeyDown={consumerKeyDown}
      />,
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(consumerKeyDown).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('locks role and tabIndex against consumer overrides', () => {
    render(
      <ChecklistRow
        status="passed"
        label="Cache hit"
        onClick={() => {}}
        role="link"
        tabIndex={-1}
      />,
    );
    const row = screen.getByRole('button');
    expect(row).toHaveAttribute('tabindex', '0');
  });

  it('forwards ref to the root element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<ChecklistRow ref={ref} status="passed" label="Cache hit" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <ChecklistRow status="passed" label="Cache hit" className="custom" />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <ChecklistRow status="passed" label="Cache hit" data-testid="row" />,
    );
    expect(screen.getByTestId('row')).toBeInTheDocument();
  });
});
