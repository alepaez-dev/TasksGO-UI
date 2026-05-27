import { createRef, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditableRefField } from './EditableRefField';

describe('EditableRefField', () => {
  describe('resting', () => {
    it('renders the value', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          onStartEdit={() => {}}
        />,
      );
      expect(screen.getByText('feat/x')).toBeInTheDocument();
    });

    it('calls onStartEdit when the chip is clicked', () => {
      const onStartEdit = vi.fn();
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          onStartEdit={onStartEdit}
          editAriaLabel="Edit branch"
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Edit branch' }));
      expect(onStartEdit).toHaveBeenCalledTimes(1);
    });

    it('renders a copy button when onCopy is provided and fires it', () => {
      const onCopy = vi.fn();
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          onStartEdit={() => {}}
          onCopy={onCopy}
          copyAriaLabel="Copy branch"
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Copy branch' }));
      expect(onCopy).toHaveBeenCalledTimes(1);
    });

    it('omits the copy button when onCopy is not provided', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          onStartEdit={() => {}}
          editAriaLabel="Edit branch"
        />,
      );
      expect(
        screen.queryByRole('button', { name: /copy/i }),
      ).not.toBeInTheDocument();
    });

    it('exposes the full value via title for truncation tooltips', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/very-long-branch-name"
          onStartEdit={() => {}}
          editAriaLabel="Edit branch"
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Edit branch' }),
      ).toHaveAttribute('title', 'feat/very-long-branch-name');
    });

    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <EditableRefField
          ref={ref}
          icon="fork_right"
          value="feat/x"
          onStartEdit={() => {}}
        />,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('merges custom className on the root', () => {
      const { container } = render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          onStartEdit={() => {}}
          className="custom"
        />,
      );
      expect(container.firstChild).toHaveClass('custom');
    });
  });

  describe('empty', () => {
    it('renders the placeholder when value is empty', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value=""
          placeholder="Add branch"
          onStartEdit={() => {}}
        />,
      );
      expect(screen.getByText('Add branch')).toBeInTheDocument();
    });

    it('falls back to the default placeholder when none is provided', () => {
      render(
        <EditableRefField icon="fork_right" value="" onStartEdit={() => {}} />,
      );
      expect(screen.getByText('Add value')).toBeInTheDocument();
    });

    it('calls onStartEdit when the empty chip is clicked', () => {
      const onStartEdit = vi.fn();
      render(
        <EditableRefField
          icon="fork_right"
          value=""
          placeholder="Add branch"
          onStartEdit={onStartEdit}
          editAriaLabel="Add branch"
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Add branch' }));
      expect(onStartEdit).toHaveBeenCalledTimes(1);
    });

    it('hides the copy button in the empty state', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value=""
          placeholder="Add branch"
          onStartEdit={() => {}}
          onCopy={() => {}}
          copyAriaLabel="Copy branch"
        />,
      );
      expect(
        screen.queryByRole('button', { name: 'Copy branch' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('editing', () => {
    const renderEditing = (
      overrides: Partial<Parameters<typeof EditableRefField>[0]> = {},
    ) => {
      const onDraftChange = vi.fn();
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      const utils = render(
        <EditableRefField
          icon="fork_right"
          value="feat/old"
          editing
          draftValue="feat/new"
          onStartEdit={() => {}}
          onDraftChange={onDraftChange}
          onConfirm={onConfirm}
          onCancel={onCancel}
          inputAriaLabel="Branch name"
          confirmAriaLabel="Confirm"
          cancelAriaLabel="Cancel"
          {...overrides}
        />,
      );
      return { ...utils, onDraftChange, onConfirm, onCancel };
    };

    it('renders the input with the draft value and a labelled input', () => {
      renderEditing();
      const input = screen.getByRole('textbox', { name: 'Branch name' });
      expect(input).toHaveValue('feat/new');
    });

    it('focuses the input when editing turns on', () => {
      renderEditing();
      const input = screen.getByRole('textbox', { name: 'Branch name' });
      expect(input).toHaveFocus();
    });

    it('hides the resting chip and copy button while editing', () => {
      renderEditing({ onCopy: () => {} });
      expect(screen.queryByText('feat/old')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Copy' }),
      ).not.toBeInTheDocument();
    });

    it('calls onDraftChange when the user types', () => {
      const { onDraftChange } = renderEditing();
      const input = screen.getByRole('textbox', { name: 'Branch name' });
      fireEvent.change(input, { target: { value: 'feat/typed' } });
      expect(onDraftChange).toHaveBeenCalledWith('feat/typed');
    });

    it('fires onConfirm when the confirm button is clicked', () => {
      const { onConfirm } = renderEditing();
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('fires onCancel when the cancel button is clicked', () => {
      const { onCancel } = renderEditing();
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('disables confirm when the draft is empty', () => {
      renderEditing({ draftValue: '' });
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    });

    it('disables confirm when the draft is whitespace-only', () => {
      renderEditing({ draftValue: '   ' });
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    });

    it('fires onConfirm on Enter when the draft is non-empty', () => {
      const { onConfirm } = renderEditing();
      const input = screen.getByRole('textbox', { name: 'Branch name' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('does not fire onConfirm on Enter when the draft is empty', () => {
      const { onConfirm } = renderEditing({ draftValue: '' });
      const input = screen.getByRole('textbox', { name: 'Branch name' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('fires onCancel on Escape', () => {
      const { onCancel } = renderEditing();
      const input = screen.getByRole('textbox', { name: 'Branch name' });
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('returns focus to the chip when editing turns off', () => {
      function Harness() {
        const [editing, setEditing] = useState(true);
        return (
          <EditableRefField
            icon="fork_right"
            value="feat/x"
            editing={editing}
            draftValue="feat/x"
            onStartEdit={() => setEditing(true)}
            onDraftChange={() => {}}
            onCancel={() => setEditing(false)}
            onConfirm={() => setEditing(false)}
            editAriaLabel="Edit branch"
            inputAriaLabel="Branch name"
            cancelAriaLabel="Cancel"
          />
        );
      }
      render(<Harness />);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.getByRole('button', { name: 'Edit branch' })).toHaveFocus();
    });
  });

  describe('copied', () => {
    it('renders the copied toast', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          copied
          copiedLabel="Copied"
          onStartEdit={() => {}}
          onCopy={() => {}}
        />,
      );
      expect(screen.getByRole('status')).toHaveTextContent('Copied');
    });

    it('swaps the copy icon for a check icon when copied', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          copied
          onStartEdit={() => {}}
          onCopy={() => {}}
          copyAriaLabel="Copy branch"
        />,
      );
      const copyButton = screen.getByRole('button', { name: 'Copy branch' });
      expect(
        copyButton.querySelector('[data-icon-name="check"]'),
      ).toBeInTheDocument();
      expect(
        copyButton.querySelector('[data-icon-name="content_copy"]'),
      ).not.toBeInTheDocument();
    });

    it('does not render the toast when value is empty', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value=""
          copied
          copiedLabel="Copied"
          onStartEdit={() => {}}
        />,
      );
      expect(screen.getByRole('status').textContent).toBe('');
    });

    it('does not render the toast while editing', () => {
      render(
        <EditableRefField
          icon="fork_right"
          value="feat/x"
          editing
          draftValue="feat/x"
          copied
          copiedLabel="Copied"
          onStartEdit={() => {}}
          onDraftChange={() => {}}
          onConfirm={() => {}}
          onCancel={() => {}}
          inputAriaLabel="Branch name"
        />,
      );
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
