import { createRef } from 'react';
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
};

const filled: NewScenarioDraft = {
  name: 'Verify cache hit on /v1/assets',
  status: 'passed',
  description: 'Edge cache serves a warm asset on the second request.',
  expected: 'Response carries X-Cache: HIT',
  actual: '',
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

  it('forwards ref to the dialog panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<AddScenarioDialog {...base} open value={empty} ref={ref} />);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });
});
