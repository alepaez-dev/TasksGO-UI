import { createRef, useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TestScenarioCard, type TestScenarioSection } from './TestScenarioCard';

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

  it('keeps its own data-status when a spread tries to override it', () => {
    const ref = createRef<HTMLDivElement>();
    const override = { 'data-status': 'passed' };
    render(
      <TestScenarioCard {...base} {...override} status="failed" ref={ref} />,
    );
    expect(ref.current).toHaveAttribute('data-status', 'failed');
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

  it('closes the status dropdown when the card header is clicked', async () => {
    const onStatusSelectOpenChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        statusSelectOpen
        onStatusSelectOpenChange={onStatusSelectOpenChange}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /collapse scenario/i }),
    );
    expect(onStatusSelectOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes the status dropdown when an in-body action is clicked', async () => {
    const onStatusSelectOpenChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        statusSelectOpen
        onStatusSelectOpenChange={onStatusSelectOpenChange}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Mark as Passed' }),
    );
    expect(onStatusSelectOpenChange).toHaveBeenCalledWith(false);
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

  it('shows the waive-reason section and actual result for a waived scenario', () => {
    render(
      <TestScenarioCard
        {...base}
        status="waived"
        byline="Waived by Ale P. · 1d ago"
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

  it('leaves the evidence picker unrestricted by default and forwards evidenceAccept', () => {
    const { container, rerender } = render(
      <TestScenarioCard {...base} open onAddEvidence={() => {}} />,
    );
    // file input is aria-hidden/tabIndex=-1 by design — no role query reaches it
    const input = container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
    expect(input).not.toHaveAttribute('accept');

    rerender(
      <TestScenarioCard
        {...base}
        open
        onAddEvidence={() => {}}
        evidenceAccept="image/*"
      />,
    );
    expect(container.querySelector('input[type="file"]')).toHaveAttribute(
      'accept',
      'image/*',
    );
  });

  it('renders a minimal body (no steps/evidence/actual) for a passed scenario', () => {
    render(<TestScenarioCard {...base} open />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Expected Result')).toBeInTheDocument();
    expect(screen.queryByText('Steps to Reproduce')).not.toBeInTheDocument();
    expect(screen.queryByText(/^Evidence/)).not.toBeInTheDocument();
    expect(screen.queryByText('Actual Result')).not.toBeInTheDocument();
  });

  it('shows the "Add evidence" button (and an empty evidence section) only when onAddEvidence is provided', () => {
    const { rerender } = render(<TestScenarioCard {...base} open />);
    expect(
      screen.queryByRole('button', { name: 'Add evidence' }),
    ).not.toBeInTheDocument();

    rerender(<TestScenarioCard {...base} open onAddEvidence={() => {}} />);
    // renders the evidence section for adding even with no evidence yet
    expect(screen.getByText('Evidence (0)')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add evidence' }),
    ).toBeInTheDocument();
  });

  it('emits the selected files from the Add evidence picker', () => {
    const onAddEvidence = vi.fn();
    const { container } = render(
      <TestScenarioCard {...base} open onAddEvidence={onAddEvidence} />,
    );
    // file input is aria-hidden/tabIndex=-1 by design — no role query reaches it
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['x'], 'shot.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onAddEvidence).toHaveBeenCalledTimes(1);
    expect(onAddEvidence.mock.calls[0][0][0].name).toBe('shot.png');
  });

  it('shows the count and labels Add "Limit reached" at the evidence limit', () => {
    render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        onAddEvidence={() => {}}
        maxEvidence={2}
        addEvidenceDisabled
        evidence={[
          { label: 'a.png', kind: 'image' },
          { label: 'b.log', kind: 'file' },
        ]}
      />,
    );
    expect(screen.getByText('2/2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Limit reached' }),
    ).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Add evidence' }),
    ).not.toBeInTheDocument();
  });

  it('leaves the Add control to the consumer — maxEvidence alone does not disable it', () => {
    const { rerender } = render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        onAddEvidence={() => {}}
        maxEvidence={1}
        evidence={[{ label: 'a.png', kind: 'image' }]}
      />,
    );
    // still enabled, and the label must not claim a limit the card is not enforcing
    expect(screen.getByRole('button', { name: 'Add evidence' })).toBeEnabled();
    expect(screen.getByText('1/1')).toBeInTheDocument();

    // and it disables without any maxEvidence — e.g. an upload in flight
    rerender(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        onAddEvidence={() => {}}
        addEvidenceDisabled
        evidence={[{ label: 'a.png', kind: 'image' }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Add evidence' })).toBeDisabled();
  });

  it('keeps focus in the card when the last chip goes while Add is disabled', async () => {
    function Harness() {
      const [evidence, setEvidence] = useState([
        { label: 'a.png', kind: 'image' as const },
      ]);
      return (
        <TestScenarioCard
          {...base}
          status="failed"
          open
          evidence={evidence}
          onAddEvidence={() => {}}
          addEvidenceDisabled
          onRemoveEvidence={(index) =>
            setEvidence((prev) => prev.filter((_, i) => i !== index))
          }
        />
      );
    }
    const { container } = render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
      expect(container.querySelector('[id$="-body"]')).toHaveFocus();
    });
  });

  it('keeps Add enabled and shows progress below the limit', () => {
    render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        onAddEvidence={() => {}}
        maxEvidence={3}
        evidence={[{ label: 'a.png', kind: 'image' }]}
      />,
    );
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add evidence' })).toBeEnabled();
  });

  it('treats maxEvidence 0 as a reached limit (no slots)', () => {
    render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        onAddEvidence={() => {}}
        maxEvidence={0}
        addEvidenceDisabled
        evidence={[{ label: 'a.png', kind: 'image' }]}
      />,
    );
    expect(screen.getByText('1/0')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Limit reached' }),
    ).toBeDisabled();
  });

  it('renders a remove button per chip and fires onRemoveEvidence with the index', async () => {
    const onRemoveEvidence = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        status="failed"
        open
        onRemoveEvidence={onRemoveEvidence}
        evidence={[
          { label: 'a.png', kind: 'image' },
          { label: 'b.log', kind: 'file' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove b.log' }));
    expect(onRemoveEvidence).toHaveBeenCalledWith(1);
  });

  it('keeps focus in the evidence list after removing the last chip', async () => {
    function Harness() {
      const [evidence, setEvidence] = useState([
        { label: 'a.png', kind: 'image' as const },
        { label: 'b.log', kind: 'file' as const },
      ]);
      return (
        <TestScenarioCard
          {...base}
          status="failed"
          open
          evidence={evidence}
          onRemoveEvidence={(index) =>
            setEvidence((prev) => prev.filter((_, i) => i !== index))
          }
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove b.log' }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Remove a.png' }),
      ).toHaveFocus(),
    );
  });

  it('keeps focus in the card when the last chip goes and there is no Add control', async () => {
    function Harness() {
      const [evidence, setEvidence] = useState([
        { label: 'a.png', kind: 'image' as const },
      ]);
      return (
        <TestScenarioCard
          {...base}
          status="failed"
          open
          evidence={evidence}
          onRemoveEvidence={(index) =>
            setEvidence((prev) => prev.filter((_, i) => i !== index))
          }
        />
      );
    }
    const { container } = render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    // the whole evidence section unmounts here — focus must not fall to <body>
    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
      expect(container.querySelector('[id$="-body"]')).toHaveFocus();
    });
  });

  it('shows a section Edit toggle only when its change handler is provided', () => {
    const { rerender } = render(<TestScenarioCard {...base} open />);
    expect(
      screen.queryByRole('button', { name: 'Edit Description' }),
    ).not.toBeInTheDocument();
    rerender(
      <TestScenarioCard {...base} open onDescriptionChange={() => {}} />,
    );
    expect(
      screen.getByRole('button', { name: 'Edit Description' }),
    ).toBeInTheDocument();
  });

  it('renders the description textarea when in editingSections and emits changes', async () => {
    const onDescriptionChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        onDescriptionChange={onDescriptionChange}
        editingSections={['description']}
      />,
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(base.description);
    await userEvent.type(textarea, '!');
    expect(onDescriptionChange).toHaveBeenCalled();
  });

  it('toggles a section into editingSections via its Edit toggle', async () => {
    const onEditingSectionsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        onDescriptionChange={() => {}}
        editingSections={[]}
        onEditingSectionsChange={onEditingSectionsChange}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Edit Description' }),
    );
    expect(onEditingSectionsChange).toHaveBeenCalledWith(['description']);
  });

  it('names every section Edit toggle after its own section', () => {
    render(
      <TestScenarioCard
        {...base}
        status="waived"
        open
        waiveReason="Blocked by an upstream outage."
        actual="Not run."
        steps={['Call the endpoint twice within the TTL window.']}
        onWaiveReasonChange={() => {}}
        onDescriptionChange={() => {}}
        onStepsChange={() => {}}
        onExpectedChange={() => {}}
        onActualChange={() => {}}
      />,
    );
    const names = screen
      .getAllByRole('button', { name: /^Edit / })
      .map((button) => button.getAttribute('aria-label'));
    expect(names).toEqual([
      'Edit Waive Reason',
      'Edit Description',
      'Edit Steps to Reproduce',
      'Edit Expected Result',
      'Edit Actual Result',
    ]);
  });

  it('adds a step via the Add step button', async () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add step' }));
    expect(onStepsChange).toHaveBeenCalledWith(['first', 'second', '']);
  });

  it('removes a step via its remove button', async () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove step 1' }),
    );
    expect(onStepsChange).toHaveBeenCalledWith(['second']);
  });

  it('edits a step via onStepsChange', async () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Step 2' }), 'X');
    expect(onStepsChange).toHaveBeenCalledWith(['first', 'secondX']);
  });

  it('adds an empty step after the current one on Enter', () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Step 1' }), {
      key: 'Enter',
    });
    expect(onStepsChange).toHaveBeenCalledWith(['first', '', 'second']);
  });

  it('inserts a newline at the cursor on Ctrl/Cmd+Enter instead of adding a step', () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    const textarea = screen.getByRole('textbox', {
      name: 'Step 1',
    }) as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(2, 2);
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    expect(onStepsChange).toHaveBeenCalledWith(['fi\nrst', 'second']);
  });

  it('inserts a newline on Shift+Enter instead of adding a step', () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    const textarea = screen.getByRole('textbox', {
      name: 'Step 1',
    }) as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(5, 5);
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onStepsChange).toHaveBeenCalledWith(['first\n', 'second']);
  });

  it('does not add a step when Enter confirms an IME composition', () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Step 1' }), {
      key: 'Enter',
      isComposing: true,
    });
    expect(onStepsChange).not.toHaveBeenCalled();
  });

  it('deletes an empty step on Backspace', () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', '']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Step 2' }), {
      key: 'Backspace',
    });
    expect(onStepsChange).toHaveBeenCalledWith(['first']);
  });

  it('does not delete a non-empty step on Backspace', () => {
    const onStepsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['first', 'second']}
        onStepsChange={onStepsChange}
        editingSections={['steps']}
      />,
    );
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Step 2' }), {
      key: 'Backspace',
    });
    expect(onStepsChange).not.toHaveBeenCalled();
  });

  it('shows "Add step" for empty steps and enters edit mode on click', async () => {
    const onStepsChange = vi.fn();
    const onEditingSectionsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        onStepsChange={onStepsChange}
        onEditingSectionsChange={onEditingSectionsChange}
      />,
    );
    // no EDIT toggle when empty — just the Add step entry point
    expect(
      screen.queryByRole('button', { name: 'Edit Steps to Reproduce' }),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add step' }));
    expect(onStepsChange).toHaveBeenCalledWith(['']);
    expect(onEditingSectionsChange).toHaveBeenCalledWith(['steps']);
  });

  it('shows "Add actual result" for an empty actual and enters edit mode on click', async () => {
    const onEditingSectionsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        actual=""
        onActualChange={() => {}}
        onEditingSectionsChange={onEditingSectionsChange}
      />,
    );
    expect(screen.getByText('Actual Result')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Add actual result' }),
    );
    expect(onEditingSectionsChange).toHaveBeenCalledWith(['actual']);
  });

  it('shows "Add reason" for a waived scenario with no reason and enters edit mode on click', async () => {
    const onEditingSectionsChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        status="waived"
        waiveReason=""
        onWaiveReasonChange={() => {}}
        onEditingSectionsChange={onEditingSectionsChange}
      />,
    );
    expect(screen.getByText('Waive Reason')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add reason' }));
    expect(onEditingSectionsChange).toHaveBeenCalledWith(['waiveReason']);
  });

  it('moves focus into the editor when an add affordance is used', async () => {
    function Harness() {
      const [editingSections, setEditingSections] = useState<
        readonly TestScenarioSection[]
      >([]);
      const [actual, setActual] = useState('');
      return (
        <TestScenarioCard
          {...base}
          open
          actual={actual}
          onActualChange={setActual}
          editingSections={editingSections}
          onEditingSectionsChange={setEditingSections}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Add actual result' }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: 'Actual Result' }),
      ).toHaveFocus(),
    );
  });

  it('returns focus to the add affordance when Done leaves a section empty', async () => {
    function Harness() {
      const [editingSections, setEditingSections] = useState<
        readonly TestScenarioSection[]
      >(['actual']);
      const [actual, setActual] = useState('');
      return (
        <TestScenarioCard
          {...base}
          open
          actual={actual}
          onActualChange={setActual}
          editingSections={editingSections}
          onEditingSectionsChange={setEditingSections}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Done editing Actual Result' }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Add actual result' }),
      ).toHaveFocus(),
    );
  });

  it('returns focus to "Add step" when Done leaves the steps empty', async () => {
    function Harness() {
      const [editingSections, setEditingSections] = useState<
        readonly TestScenarioSection[]
      >(['steps']);
      const [steps, setSteps] = useState<readonly string[]>([]);
      return (
        <TestScenarioCard
          {...base}
          open
          steps={steps}
          onStepsChange={setSteps}
          editingSections={editingSections}
          onEditingSectionsChange={setEditingSections}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Done editing Steps to Reproduce' }),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Add step' })).toHaveFocus(),
    );
  });

  it('moves focus into the step editor when "Add step" is used', async () => {
    function Harness() {
      const [editingSections, setEditingSections] = useState<
        readonly TestScenarioSection[]
      >([]);
      const [steps, setSteps] = useState<readonly string[]>([]);
      return (
        <TestScenarioCard
          {...base}
          open
          steps={steps}
          onStepsChange={setSteps}
          editingSections={editingSections}
          onEditingSectionsChange={setEditingSections}
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Add step' }));
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Step 1' })).toHaveFocus(),
    );
  });

  it('gives each section editor an accessible name matching its heading', () => {
    render(
      <TestScenarioCard
        {...base}
        open
        status="waived"
        waiveReason="Out of scope"
        actual="Observed X"
        onWaiveReasonChange={() => {}}
        onDescriptionChange={() => {}}
        onExpectedChange={() => {}}
        onActualChange={() => {}}
        editingSections={['waiveReason', 'description', 'expected', 'actual']}
      />,
    );
    expect(
      screen.getByRole('textbox', { name: 'Waive Reason' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Description' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Expected Result' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Actual Result' }),
    ).toBeInTheDocument();
  });

  it('previews the first 3 steps with a "Show N more" toggle', async () => {
    const onStepsExpandedChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['s1', 's2', 's3', 's4', 's5']}
        stepsExpanded={false}
        onStepsExpandedChange={onStepsExpandedChange}
      />,
    );
    expect(screen.getByText('s1')).toBeInTheDocument();
    expect(screen.getByText('s3')).toBeInTheDocument();
    expect(screen.queryByText('s4')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Show 2 more' }));
    expect(onStepsExpandedChange).toHaveBeenCalledWith(true);
  });

  it('shows all steps and "Show less" when stepsExpanded', () => {
    render(
      <TestScenarioCard
        {...base}
        open
        steps={['s1', 's2', 's3', 's4', 's5']}
        stepsExpanded
        onStepsExpandedChange={() => {}}
      />,
    );
    expect(screen.getByText('s5')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show less' }),
    ).toBeInTheDocument();
  });

  it('renders the title editor when the title section is editing', async () => {
    const onTitleChange = vi.fn();
    render(
      <TestScenarioCard
        {...base}
        open
        onTitleChange={onTitleChange}
        editingSections={['title']}
      />,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Scenario title' }),
      'X',
    );
    expect(onTitleChange).toHaveBeenCalledWith(`${base.title}X`);
  });

  it('toggles the title section via its Edit toggle', async () => {
    const onEditingSectionsChange = vi.fn();
    render(
      // open defaults false -> body hidden, so the title's Edit is the only one
      <TestScenarioCard
        {...base}
        onTitleChange={() => {}}
        editingSections={[]}
        onEditingSectionsChange={onEditingSectionsChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEditingSectionsChange).toHaveBeenCalledWith(['title']);
  });
});
