import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { WaiveScenarioDialog } from './WaiveScenarioDialog';

const base = {
  scenarioTitle: 'WebSocket Connection Persistence',
  reason: '',
  onReasonChange: () => {},
  onCancel: () => {},
  onConfirm: () => {},
};

describe('WaiveScenarioDialog', () => {
  it('is not in the DOM when closed', () => {
    render(<WaiveScenarioDialog {...base} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a labelled, described modal dialog when open', () => {
    render(<WaiveScenarioDialog {...base} open />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Waive scenario');
    expect(dialog).toHaveAccessibleDescription(
      /WebSocket Connection Persistence/,
    );
    expect(dialog).toHaveAccessibleDescription(/audit trail/);
  });

  it('disables confirm while the reason is empty or whitespace', () => {
    const { rerender } = render(
      <WaiveScenarioDialog {...base} open reason="" />,
    );
    expect(
      screen.getByRole('button', { name: 'Waive scenario' }),
    ).toBeDisabled();
    rerender(<WaiveScenarioDialog {...base} open reason="   " />);
    expect(
      screen.getByRole('button', { name: 'Waive scenario' }),
    ).toBeDisabled();
  });

  it('enables confirm once a non-empty reason is entered', () => {
    render(<WaiveScenarioDialog {...base} open reason="Out of scope" />);
    expect(
      screen.getByRole('button', { name: 'Waive scenario' }),
    ).toBeEnabled();
  });

  it('emits onReasonChange as the user types', async () => {
    const onReasonChange = vi.fn();
    render(
      <WaiveScenarioDialog {...base} open onReasonChange={onReasonChange} />,
    );
    await userEvent.type(screen.getByLabelText('Reason for waiving'), 'x');
    expect(onReasonChange).toHaveBeenCalledWith('x');
  });

  it('calls onConfirm when the enabled confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    render(
      <WaiveScenarioDialog
        {...base}
        open
        reason="Out of scope"
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Waive scenario' }),
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel from the Cancel button', async () => {
    const onCancel = vi.fn();
    render(<WaiveScenarioDialog {...base} open onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel on Escape and on backdrop click', () => {
    const onCancel = vi.fn();
    render(<WaiveScenarioDialog {...base} open onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    const backdropButton = screen.getByRole('dialog').parentElement
      ?.previousElementSibling as HTMLElement;
    fireEvent.click(backdropButton);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('forwards ref to the dialog panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WaiveScenarioDialog {...base} open ref={ref} />);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });
});
