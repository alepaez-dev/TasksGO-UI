import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';
import { FOCUSABLE_SELECTOR } from '../../hooks/useFocusTrap';

const base = {
  icon: <span data-testid="glyph" />,
  title: 'Re-open as pending',
  description: 'This clears the verdict.',
  confirmLabel: 'Re-open as pending',
  onCancel: () => {},
  onConfirm: () => {},
};

describe('ConfirmDialog', () => {
  it('is not in the DOM when closed', () => {
    render(<ConfirmDialog {...base} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a labelled, described modal dialog with the icon when open', () => {
    render(<ConfirmDialog {...base} open />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Re-open as pending');
    expect(dialog).toHaveAccessibleDescription('This clears the verdict.');
    expect(screen.getByTestId('glyph')).toBeInTheDocument();
  });

  it('renders no field and an enabled confirm when field is omitted', () => {
    render(<ConfirmDialog {...base} open />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeEnabled();
  });

  it('disables confirm while a required field is empty/blank', () => {
    const { rerender } = render(
      <ConfirmDialog
        {...base}
        open
        field={{
          label: 'Actual Result',
          value: '',
          onChange: () => {},
          required: true,
        }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeDisabled();
    rerender(
      <ConfirmDialog
        {...base}
        open
        field={{
          label: 'Actual Result',
          value: '  ',
          onChange: () => {},
          required: true,
        }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeDisabled();
  });

  it('enables confirm once the required field has content', () => {
    render(
      <ConfirmDialog
        {...base}
        open
        field={{
          label: 'Actual Result',
          value: 'Observed a 500',
          onChange: () => {},
          required: true,
        }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeEnabled();
  });

  it('emits field.onChange as the user types', async () => {
    const onChange = vi.fn();
    render(
      <ConfirmDialog
        {...base}
        open
        field={{ label: 'Actual Result', value: '', onChange }}
      />,
    );
    await userEvent.type(screen.getByLabelText(/Actual Result/), 'x');
    expect(onChange).toHaveBeenCalledWith('x');
  });

  it('calls onConfirm and onCancel from the footer buttons', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        {...base}
        open
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

  it('calls onCancel on Escape', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...base} open onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('ignores a spread confirmDisabled that would defeat the required field', () => {
    const override = { confirmDisabled: false };
    render(
      <ConfirmDialog
        {...base}
        {...override}
        open
        field={{
          label: 'Actual Result',
          value: '',
          onChange: () => {},
          required: true,
        }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Re-open as pending' }),
    ).toBeDisabled();
  });

  it('forwards ref to the dialog panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ConfirmDialog {...base} open ref={ref} />);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });

  it('focuses the field when opened', () => {
    render(
      <ConfirmDialog
        {...base}
        open
        field={{
          label: 'Actual Result',
          value: 'Observed a 500',
          onChange: () => {},
        }}
      />,
    );
    expect(screen.getByLabelText(/Actual Result/)).toHaveFocus();
  });

  it('renders no close button in the default dialog presentation', () => {
    render(<ConfirmDialog {...base} open />);
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  describe('sheet presentation', () => {
    function renderSheetWithField() {
      render(
        <ConfirmDialog
          {...base}
          open
          presentation="sheet"
          field={{
            label: 'Actual Result',
            value: 'Observed a 500',
            onChange: () => {},
          }}
        />,
      );
    }

    function sheetFocusBoundaries(): [HTMLElement, HTMLElement] {
      const focusables = screen
        .getByRole('dialog')
        .querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      return [focusables[0], focusables[focusables.length - 1]];
    }

    it('renders a labelled, described modal dialog', () => {
      render(<ConfirmDialog {...base} open presentation="sheet" />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAccessibleName('Re-open as pending');
      expect(dialog).toHaveAccessibleDescription('This clears the verdict.');
    });

    it('omits the icon', () => {
      render(<ConfirmDialog {...base} open presentation="sheet" />);
      expect(screen.queryByTestId('glyph')).not.toBeInTheDocument();
    });

    it('calls onCancel from the header close button', async () => {
      const onCancel = vi.fn();
      render(
        <ConfirmDialog
          {...base}
          open
          presentation="sheet"
          onCancel={onCancel}
        />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('disables confirm while a required field is empty', () => {
      render(
        <ConfirmDialog
          {...base}
          open
          presentation="sheet"
          field={{
            label: 'Actual Result',
            value: '',
            onChange: () => {},
            required: true,
          }}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Re-open as pending' }),
      ).toBeDisabled();
    });

    it('calls onConfirm and onCancel from the footer buttons', async () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      render(
        <ConfirmDialog
          {...base}
          open
          presentation="sheet"
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

    it('calls onCancel when dragged down past the dismiss threshold', () => {
      const onCancel = vi.fn();
      render(
        <ConfirmDialog
          {...base}
          open
          presentation="sheet"
          onCancel={onCancel}
        />,
      );
      const dialog = screen.getByRole('dialog');
      fireEvent.touchStart(dialog, { touches: [{ clientY: 100 }] });
      fireEvent.touchMove(dialog, { touches: [{ clientY: 250 }] });
      fireEvent.touchEnd(dialog);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('focuses the field when opened, not the close button', () => {
      renderSheetWithField();
      expect(screen.getByLabelText(/Actual Result/)).toHaveFocus();
    });

    it('wraps Tab forward from the last control to the first', () => {
      renderSheetWithField();
      const [first, last] = sheetFocusBoundaries();

      last.focus();
      fireEvent.keyDown(document, { key: 'Tab' });

      expect(document.activeElement).toBe(first);
    });

    it('wraps Shift+Tab backward from the first control to the last', () => {
      renderSheetWithField();
      const [first, last] = sheetFocusBoundaries();

      first.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

      expect(document.activeElement).toBe(last);
    });

    it('forwards ref to the sheet panel', () => {
      const ref = createRef<HTMLDivElement>();
      render(<ConfirmDialog {...base} open presentation="sheet" ref={ref} />);
      expect(ref.current).toHaveAttribute('role', 'dialog');
    });
  });
});
