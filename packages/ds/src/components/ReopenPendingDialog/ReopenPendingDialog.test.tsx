import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ReopenPendingDialog } from './ReopenPendingDialog';

const base = {
  scenarioTitle: 'WebSocket Connection Persistence',
  actualResult: '',
  onActualResultChange: () => {},
  onCancel: () => {},
  onConfirm: () => {},
};

describe('ReopenPendingDialog', () => {
  it('is not in the DOM when closed', () => {
    render(<ReopenPendingDialog {...base} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the re-open dialog with the scenario title and intent', () => {
    render(<ReopenPendingDialog {...base} open />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Re-open as pending');
    expect(dialog).toHaveAccessibleDescription(
      /WebSocket Connection Persistence/,
    );
    expect(dialog).toHaveAccessibleDescription(/clears its verdict/);
  });

  it('requires an actual result before confirming', () => {
    const { rerender } = render(<ReopenPendingDialog {...base} open />);
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeDisabled();
    rerender(
      <ReopenPendingDialog {...base} open actualResult="Observed a 500" />,
    );
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeEnabled();
  });

  it('emits onActualResultChange as the user types', async () => {
    const onActualResultChange = vi.fn();
    render(
      <ReopenPendingDialog
        {...base}
        open
        onActualResultChange={onActualResultChange}
      />,
    );
    await userEvent.type(screen.getByLabelText('Actual Result'), 'x');
    expect(onActualResultChange).toHaveBeenCalledWith('x');
  });

  it('calls onConfirm and onCancel', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ReopenPendingDialog
        {...base}
        open
        actualResult="Observed a 500"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('explains the placeholder only when a previous value exists', () => {
    const caption = /Previous value shown as placeholder/;
    const { rerender } = render(<ReopenPendingDialog {...base} open />);
    expect(screen.queryByText(caption)).not.toBeInTheDocument();

    rerender(
      <ReopenPendingDialog
        {...base}
        open
        actualResultPlaceholder="Zero 5xx responses during failover."
      />,
    );
    expect(screen.getByText(caption)).toBeInTheDocument();
  });

  it('describes the field by its placeholder caption', () => {
    render(
      <ReopenPendingDialog
        {...base}
        open
        actualResultPlaceholder="Zero 5xx responses during failover."
      />,
    );
    expect(screen.getByLabelText('Actual Result')).toHaveAccessibleDescription(
      /Previous value shown as placeholder/,
    );
  });

  it('calls onCancel on Escape', () => {
    const onCancel = vi.fn();
    render(<ReopenPendingDialog {...base} open onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
