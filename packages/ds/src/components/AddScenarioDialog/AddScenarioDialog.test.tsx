import { createRef, useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AddScenarioDialog } from './AddScenarioDialog';
import type { NewScenarioDraft } from './scenarioDraft';

const empty: NewScenarioDraft = {
  name: '',
  status: 'pending',
  description: '',
  expected: '',
  actual: '',
  steps: [],
  evidence: [],
};

const filled: NewScenarioDraft = {
  name: 'Verify cache hit on /v1/assets',
  status: 'passed',
  description: 'Edge cache serves a warm asset on the second request.',
  expected: 'Response carries X-Cache: HIT',
  actual: '',
  steps: [],
  evidence: [],
};

const base = {
  onValueChange: () => {},
  onCancel: () => {},
  onConfirm: () => {},
};

const submit = () => screen.getByRole('button', { name: 'Add scenario' });

describe('AddScenarioDialog', () => {
  it('is not in the DOM when closed', () => {
    render(<AddScenarioDialog {...base} open={false} value={empty} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a labelled modal dialog when open', () => {
    render(<AddScenarioDialog {...base} open value={empty} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Add test scenario');
  });

  it('disables submit while name, description or expected is blank', () => {
    const { rerender } = render(
      <AddScenarioDialog {...base} open value={filled} />,
    );
    expect(submit()).toBeEnabled();

    rerender(
      <AddScenarioDialog {...base} open value={{ ...filled, name: '  ' }} />,
    );
    expect(submit()).toBeDisabled();

    rerender(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...filled, description: '' }}
      />,
    );
    expect(submit()).toBeDisabled();

    rerender(
      <AddScenarioDialog {...base} open value={{ ...filled, expected: '' }} />,
    );
    expect(submit()).toBeDisabled();
  });

  it('requires an actual result only when the status is failed', () => {
    const { rerender } = render(
      <AddScenarioDialog {...base} open value={filled} />,
    );
    expect(screen.getByLabelText('Actual result')).not.toBeRequired();
    expect(submit()).toBeEnabled();

    rerender(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...filled, status: 'failed' }}
      />,
    );
    expect(screen.getByLabelText('Actual result')).toBeRequired();
    expect(submit()).toBeDisabled();

    rerender(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...filled, status: 'failed', actual: 'Got X-Cache: MISS' }}
      />,
    );
    expect(submit()).toBeEnabled();
  });

  it('describes the actual result field with the requirement hint when failed', () => {
    const { rerender } = render(
      <AddScenarioDialog {...base} open value={filled} />,
    );
    expect(
      screen.queryByText(/required for failed scenarios/i),
    ).not.toBeInTheDocument();

    rerender(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...filled, status: 'failed' }}
      />,
    );
    expect(screen.getByLabelText('Actual result')).toHaveAccessibleDescription(
      /required for failed scenarios/i,
    );
  });

  it('emits the whole draft with the edited field merged in', async () => {
    const onValueChange = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(screen.getByLabelText('Scenario name'), 'C');
    expect(onValueChange).toHaveBeenCalledWith({ ...empty, name: 'C' });
  });

  it('emits the chosen status from the initial status radios', async () => {
    const onValueChange = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Pending' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Failed' }));
    expect(onValueChange).toHaveBeenCalledWith({ ...empty, status: 'failed' });
  });

  it('confirms with the current draft', async () => {
    const onConfirm = vi.fn();
    render(
      <AddScenarioDialog {...base} open value={filled} onConfirm={onConfirm} />,
    );
    await userEvent.click(submit());
    expect(onConfirm).toHaveBeenCalledWith(filled);
  });

  it('cancels from the footer button and from Escape', async () => {
    const onCancel = vi.fn();
    render(
      <AddScenarioDialog {...base} open value={empty} onCancel={onCancel} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('focuses the scenario name field when opened', async () => {
    render(<AddScenarioDialog {...base} open value={empty} />);
    await waitFor(() =>
      expect(screen.getByLabelText('Scenario name')).toHaveFocus(),
    );
  });

  it('ignores a spread confirmDisabled that would defeat the required fields', () => {
    const override = { confirmDisabled: false };
    render(<AddScenarioDialog {...base} {...override} open value={empty} />);
    expect(submit()).toBeDisabled();
  });

  it('ignores a spread confirmLabel that would rename its own action', () => {
    const override = { confirmLabel: 'Do it' };
    render(<AddScenarioDialog {...base} {...override} open value={filled} />);
    expect(submit()).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Do it' }),
    ).not.toBeInTheDocument();
  });

  it('groups the optional sections so their controls are labelled by them', () => {
    render(
      <AddScenarioDialog {...base} open value={{ ...empty, steps: [''] }} />,
    );
    const steps = screen.getByRole('group', { name: /Steps to reproduce/ });
    expect(steps).toContainElement(screen.getByLabelText('Step 1'));
    expect(screen.getByRole('group', { name: /Evidence/ })).toContainElement(
      screen.getByRole('button', { name: 'Add evidence' }),
    );
  });

  it('marks steps and evidence as optional', () => {
    render(<AddScenarioDialog {...base} open value={empty} />);
    expect(screen.getByText('Steps to reproduce')).toHaveTextContent(
      /optional/i,
    );
    expect(screen.getByText('Evidence')).toHaveTextContent(/up to 6/i);
  });

  it('appends an empty step to the draft from the add control', async () => {
    const onValueChange = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add step' }));
    expect(onValueChange).toHaveBeenCalledWith({ ...empty, steps: [''] });
  });

  it('emits edited step text on the draft', async () => {
    const onValueChange = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...empty, steps: [''] }}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(screen.getByLabelText('Step 1'), 'D');
    expect(onValueChange).toHaveBeenCalledWith({ ...empty, steps: ['D'] });
  });

  it('adds picked files to the draft evidence', () => {
    const onValueChange = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={onValueChange}
      />,
    );
    // the dialog portals to <body>, so the render container does not hold it
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['x'], 'shot.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0].evidence[0].name).toBe('shot.png');
  });

  it('reports files dropped for exceeding the limit', () => {
    const onValueChange = vi.fn();
    const onEvidenceRejected = vi.fn();
    const four = Array.from(
      { length: 4 },
      (_, i) => new File(['x'], `have-${i}.png`, { type: 'image/png' }),
    );
    render(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...empty, evidence: four }}
        onValueChange={onValueChange}
        onEvidenceRejected={onEvidenceRejected}
      />,
    );
    const picked = Array.from(
      { length: 5 },
      (_, i) => new File(['x'], `new-${i}.png`, { type: 'image/png' }),
    );
    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      {
        target: { files: picked },
      },
    );

    const [rejected] = onEvidenceRejected.mock.calls[0];
    expect(
      rejected.map((r: { file: File; reason: string }) => [
        r.file.name,
        r.reason,
      ]),
    ).toEqual([
      ['new-2.png', 'limit'],
      ['new-3.png', 'limit'],
      ['new-4.png', 'limit'],
    ]);
    expect(onValueChange.mock.calls[0][0].evidence).toHaveLength(6);
  });

  it('rejects files the consumer disallows and keeps the rest', () => {
    const onValueChange = vi.fn();
    const onEvidenceRejected = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={onValueChange}
        isEvidenceAllowed={(file) => !/\.(dmg|exe)$/i.test(file.name)}
        onEvidenceRejected={onEvidenceRejected}
      />,
    );
    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      {
        target: {
          files: [
            new File(['x'], 'shot.png', { type: 'image/png' }),
            new File(['x'], 'installer.dmg'),
          ],
        },
      },
    );

    const [rejected] = onEvidenceRejected.mock.calls[0];
    expect(
      rejected.map((r: { file: File; reason: string }) => [
        r.file.name,
        r.reason,
      ]),
    ).toEqual([['installer.dmg', 'filtered']]);
    expect(
      onValueChange.mock.calls[0][0].evidence.map((f: File) => f.name),
    ).toEqual(['shot.png']);
  });

  it('commits the draft before reporting what was rejected', () => {
    const order: string[] = [];
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={() => order.push('value')}
        isEvidenceAllowed={() => false}
        onEvidenceRejected={() => order.push('rejected')}
      />,
    );
    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      { target: { files: [new File(['x'], 'installer.dmg')] } },
    );
    // a consumer clearing a notice on change must not wipe this pick's message
    expect(order).toEqual(['value', 'rejected']);
  });

  it('reports every dropped file in one call when a pick trips both rules', () => {
    const onEvidenceRejected = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        maxEvidence={2}
        isEvidenceAllowed={(file) => !/\.dmg$/i.test(file.name)}
        onEvidenceRejected={onEvidenceRejected}
      />,
    );
    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      {
        target: {
          files: [
            new File(['x'], 'installer.dmg'),
            new File(['x'], 'a.png', { type: 'image/png' }),
            new File(['x'], 'b.png', { type: 'image/png' }),
            new File(['x'], 'c.png', { type: 'image/png' }),
          ],
        },
      },
    );
    // one call, so neither reason can overwrite the other
    expect(onEvidenceRejected).toHaveBeenCalledTimes(1);
    expect(
      onEvidenceRejected.mock.calls[0][0].map(
        (r: { file: File; reason: string }) => [r.file.name, r.reason],
      ),
    ).toEqual([
      ['installer.dmg', 'filtered'],
      ['c.png', 'limit'],
    ]);
  });

  it('renders the evidence message inside the modal subtree', () => {
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        evidenceMessage={<p role="status">installer.dmg was blocked</p>}
      />,
    );
    // aria-modal hides everything outside the panel, so AT only reaches it here
    const live = screen.getByRole('status');
    expect(screen.getByRole('dialog')).toContainElement(live);
    expect(screen.getByRole('group', { name: /Evidence/ })).toContainElement(
      live,
    );
  });

  it('allows every file type when the consumer sets no rule', () => {
    const onValueChange = vi.fn();
    const onEvidenceRejected = vi.fn();
    render(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        onValueChange={onValueChange}
        onEvidenceRejected={onEvidenceRejected}
      />,
    );
    fireEvent.change(
      document.querySelector('input[type="file"]') as HTMLInputElement,
      {
        target: { files: [new File(['x'], 'installer.dmg')] },
      },
    );
    expect(onEvidenceRejected).not.toHaveBeenCalled();
    expect(onValueChange.mock.calls[0][0].evidence).toHaveLength(1);
  });

  it('keeps focus in the dialog when the last chip goes while Add is disabled', async () => {
    function Harness() {
      const [draft, setDraft] = useState<NewScenarioDraft>({
        ...empty,
        evidence: [new File(['x'], 'a.png', { type: 'image/png' })],
      });
      return (
        <AddScenarioDialog
          open
          value={draft}
          onValueChange={setDraft}
          onCancel={() => {}}
          onConfirm={() => {}}
          addEvidenceDisabled
        />
      );
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.png' }));
    // the Add control stays disabled, so focus must not fall to <body>
    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
      expect(screen.getByRole('dialog')).toContainElement(
        document.activeElement as HTMLElement,
      );
    });
  });

  it('disables the add control at the default limit of six', () => {
    const six = Array.from(
      { length: 6 },
      (_, i) => new File(['x'], `shot-${i}.png`, { type: 'image/png' }),
    );
    render(
      <AddScenarioDialog {...base} open value={{ ...empty, evidence: six }} />,
    );
    expect(
      screen.getByRole('button', { name: /Limit reached/ }),
    ).toBeDisabled();
  });

  it('leaves the evidence picker unrestricted by default and forwards evidenceAccept', () => {
    const { rerender } = render(
      <AddScenarioDialog {...base} open value={empty} />,
    );
    // file input is aria-hidden/tabIndex=-1 by design — no role query reaches it
    const fileInput = () => document.querySelector('input[type="file"]');
    expect(fileInput()).not.toBeNull();
    expect(fileInput()).not.toHaveAttribute('accept');

    rerender(
      <AddScenarioDialog
        {...base}
        open
        value={empty}
        evidenceAccept="image/*"
      />,
    );
    expect(fileInput()).toHaveAttribute('accept', 'image/*');
  });

  it('honours a custom maxEvidence in the hint and the add control', () => {
    const two = [
      new File(['x'], 'a.png', { type: 'image/png' }),
      new File(['x'], 'b.png', { type: 'image/png' }),
    ];
    render(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...empty, evidence: two }}
        maxEvidence={2}
      />,
    );
    expect(screen.getByText('Evidence')).toHaveTextContent(/up to 2/i);
    expect(
      screen.getByRole('button', { name: /Limit reached/ }),
    ).toBeDisabled();
  });

  it('disables the evidence picker on request without claiming a limit', () => {
    render(
      <AddScenarioDialog
        {...base}
        open
        value={{ ...empty, evidence: [new File(['x'], 'a.png')] }}
        addEvidenceDisabled
      />,
    );
    // below the limit, so the label must not claim one
    expect(screen.getByRole('button', { name: 'Add evidence' })).toBeDisabled();
  });

  it('keeps steps and evidence out of the required-field gate', () => {
    render(<AddScenarioDialog {...base} open value={filled} />);
    expect(submit()).toBeEnabled();
  });

  it('forwards ref to the dialog panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AddScenarioDialog {...base} open value={empty} ref={ref} />);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });
});
