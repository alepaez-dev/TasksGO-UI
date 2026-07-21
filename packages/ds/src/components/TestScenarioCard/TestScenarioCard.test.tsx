import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TestScenarioCard } from './TestScenarioCard';

const base = {
  caseId: 'TC-402',
  title: 'Verify Cache Hit on /v1/assets',
  status: 'passed' as const,
  byline: 'Verified by Sarah K. · 2h ago',
  assigneeInitial: 'SK',
  assigneeLabel: 'Sarah K.',
  description: 'A second request within the TTL window is served from cache.',
  expected: 'Response carries `X-Cache: HIT`.',
};

describe('TestScenarioCard', () => {
  it('renders the header (title, case id, byline, status pill)', () => {
    render(<TestScenarioCard {...base} />);
    expect(screen.getByText(base.title)).toBeInTheDocument();
    expect(screen.getByText('TC-402')).toBeInTheDocument();
    expect(
      screen.getByText('Verified by Sarah K. · 2h ago'),
    ).toBeInTheDocument();
    expect(screen.getByText('Passed')).toBeInTheDocument();
  });

  it('does not render the body when collapsed', () => {
    render(<TestScenarioCard {...base} open={false} />);
    expect(screen.queryByText(base.description)).not.toBeInTheDocument();
  });

  it('renders the body when open', () => {
    render(<TestScenarioCard {...base} open />);
    expect(screen.getByText(base.description)).toBeInTheDocument();
  });

  it('calls onOpenChange when the chevron toggle is clicked', async () => {
    const onOpenChange = vi.fn();
    render(
      <TestScenarioCard {...base} open={false} onOpenChange={onOpenChange} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /expand scenario/i }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('exposes the toggle with aria-expanded reflecting open', () => {
    render(<TestScenarioCard {...base} open />);
    expect(
      screen.getByRole('button', { name: /collapse scenario/i }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<TestScenarioCard {...base} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('emits onStatusChange from the status dropdown', async () => {
    const onStatusChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        statusSelectOpen
        onStatusChange={onStatusChange}
      />,
    );
    await userEvent.click(screen.getByRole('option', { name: 'Failed' }));
    expect(onStatusChange).toHaveBeenCalledWith('failed');
  });

  it('emits onStatusChange from the Mark as Failed action', async () => {
    const onStatusChange = vi.fn();
    render(<TestScenarioCard {...base} open onStatusChange={onStatusChange} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Mark as Failed' }),
    );
    expect(onStatusChange).toHaveBeenCalledWith('failed');
  });

  it('emits onStatusChange from the Waive action', async () => {
    const onStatusChange = vi.fn();
    render(<TestScenarioCard {...base} open onStatusChange={onStatusChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Waive' }));
    expect(onStatusChange).toHaveBeenCalledWith('waived');
  });

  it('shows the amber waive-reason and neutral actual for a waived scenario', () => {
    render(
      <TestScenarioCard
        {...base}
        status="waived"
        byline="Waived by Alex T. · 1d ago"
        waiveReason="Out of scope; tracked under `ENG-2871`."
        actual="Not run — scenario waived before execution."
        open
      />,
    );
    expect(screen.getByText('Waive Reason')).toBeInTheDocument();
    expect(screen.getByText(/tracked under/i)).toBeInTheDocument();
    expect(
      screen.getByText('Not run — scenario waived before execution.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Waived')).toBeInTheDocument();
  });

  it('omits the waive-reason section when not waived', () => {
    render(<TestScenarioCard {...base} status="failed" open />);
    expect(screen.queryByText('Waive Reason')).not.toBeInTheDocument();
  });

  it('renders steps and evidence when provided', () => {
    render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        steps={['Deploy to `QA-01`', 'Fire 500 rps']}
        evidence={[
          { label: 'gateway.log', kind: 'file' },
          { label: 'screen_01.jpg', kind: 'image' },
        ]}
        actual="Stale cached body returned with `200 OK`."
      />,
    );
    expect(screen.getByText('Steps to Reproduce')).toBeInTheDocument();
    expect(screen.getByText('Evidence (2)')).toBeInTheDocument();
    expect(screen.getByText('gateway.log')).toBeInTheDocument();
    expect(screen.getByText('Actual Result')).toBeInTheDocument();
  });

  it('previews the first 3 evidence items with a working "+N more" toggle', async () => {
    const onEvidenceExpandedChange = vi.fn();
    const evidence = Array.from({ length: 7 }, (_, i) => ({
      label: `file_${i}.txt`,
      kind: 'file' as const,
    }));
    const { rerender } = render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        evidence={evidence}
        evidenceExpanded={false}
        onEvidenceExpandedChange={onEvidenceExpandedChange}
      />,
    );
    expect(screen.getByText('Evidence (7)')).toBeInTheDocument();
    expect(screen.getByText('file_0.txt')).toBeInTheDocument();
    expect(screen.getByText('file_2.txt')).toBeInTheDocument();
    expect(screen.queryByText('file_3.txt')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /\+4 more/i }));
    expect(onEvidenceExpandedChange).toHaveBeenCalledWith(true);

    rerender(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        evidence={evidence}
        evidenceExpanded
        onEvidenceExpandedChange={onEvidenceExpandedChange}
      />,
    );
    expect(screen.getByText('file_6.txt')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /show less/i }),
    ).toBeInTheDocument();
  });

  it('omits the evidence toggle when at or below the preview count', () => {
    render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        evidence={[
          { label: 'a.log', kind: 'file' },
          { label: 'b.log', kind: 'file' },
          { label: 'c.log', kind: 'file' },
        ]}
      />,
    );
    expect(screen.getByText('Evidence (3)')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /more/i }),
    ).not.toBeInTheDocument();
  });

  it('renders a minimal body (no steps/evidence/actual) for a passed scenario', () => {
    render(<TestScenarioCard {...base} open />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Expected Result')).toBeInTheDocument();
    expect(screen.queryByText('Steps to Reproduce')).not.toBeInTheDocument();
    expect(screen.queryByText(/^Evidence/)).not.toBeInTheDocument();
    expect(screen.queryByText('Actual Result')).not.toBeInTheDocument();
  });
});
