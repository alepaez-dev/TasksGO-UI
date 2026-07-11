import { type RefObject } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditableMarkdown } from './EditableMarkdown';

const textareaRef = { current: null } as RefObject<HTMLTextAreaElement | null>;

const base = {
  textareaRef,
  onChange: () => {},
  onAction: () => {},
  wordCount: 0,
  onRequestEdit: () => {},
  onCancel: () => {},
  onSave: () => {},
};

describe('EditableMarkdown', () => {
  describe('view mode', () => {
    it('renders the markdown content', () => {
      render(
        <EditableMarkdown {...base} editing={false} value="Hello **body**" />,
      );
      expect(screen.getByText('body')).toBeInTheDocument();
    });

    it('calls onRequestEdit when the body is clicked', () => {
      const onRequestEdit = vi.fn();
      render(
        <EditableMarkdown
          {...base}
          onRequestEdit={onRequestEdit}
          editing={false}
          value="Hello body"
        />,
      );
      fireEvent.click(screen.getByText('Hello body'));
      expect(onRequestEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onRequestEdit when the Edit button is clicked', () => {
      const onRequestEdit = vi.fn();
      render(
        <EditableMarkdown
          {...base}
          onRequestEdit={onRequestEdit}
          editing={false}
          value="Hello body"
          editLabel="Edit description"
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Edit description' }));
      expect(onRequestEdit).toHaveBeenCalledTimes(1);
    });

    it('does not open the editor when a link in the body is clicked', () => {
      const onRequestEdit = vi.fn();
      render(
        <EditableMarkdown
          {...base}
          onRequestEdit={onRequestEdit}
          editing={false}
          value="[docs](https://example.com)"
        />,
      );
      fireEvent.click(screen.getByRole('link', { name: 'docs' }));
      expect(onRequestEdit).not.toHaveBeenCalled();
    });

    it('hides the Edit button when showEditButton is false', () => {
      render(
        <EditableMarkdown
          {...base}
          editing={false}
          value="Hello body"
          showEditButton={false}
          editLabel="Edit description"
        />,
      );
      expect(
        screen.queryByRole('button', { name: 'Edit description' }),
      ).toBeNull();
    });

    it('does not render the editor textarea in view mode', () => {
      render(<EditableMarkdown {...base} editing={false} value="Hello body" />);
      expect(screen.queryByRole('textbox')).toBeNull();
    });
  });

  describe('edit mode', () => {
    it('renders the editor textarea and toolbar', () => {
      render(<EditableMarkdown {...base} editing value="Hello body" />);
      expect(
        screen.getByRole('textbox', { name: 'Markdown' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('renders Cancel and Save buttons and fires them', () => {
      const onCancel = vi.fn();
      const onSave = vi.fn();
      render(
        <EditableMarkdown
          {...base}
          onCancel={onCancel}
          onSave={onSave}
          editing
          value="Hello body"
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onChange when typing', () => {
      const onChange = vi.fn();
      render(
        <EditableMarkdown
          {...base}
          onChange={onChange}
          editing
          value="Hello"
        />,
      );
      fireEvent.change(screen.getByRole('textbox', { name: 'Markdown' }), {
        target: { value: 'Hello world' },
      });
      expect(onChange).toHaveBeenCalledWith('Hello world');
    });

    it('calls onCancel on Escape', () => {
      const onCancel = vi.fn();
      render(
        <EditableMarkdown
          {...base}
          onCancel={onCancel}
          editing
          value="Hello"
        />,
      );
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Markdown' }), {
        key: 'Escape',
      });
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onSave on Meta+Enter and Ctrl+Enter', () => {
      const onSave = vi.fn();
      render(
        <EditableMarkdown {...base} onSave={onSave} editing value="Hello" />,
      );
      const textarea = screen.getByRole('textbox', { name: 'Markdown' });
      fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
      expect(onSave).toHaveBeenCalledTimes(2);
    });
  });

  it('unmounts the rendered body when switching to edit', () => {
    const { rerender } = render(
      <EditableMarkdown {...base} editing={false} value="Hello body" />,
    );
    expect(
      screen.getByText('Hello body', { selector: 'p' }),
    ).toBeInTheDocument();
    rerender(<EditableMarkdown {...base} editing value="Hello body" />);
    expect(screen.queryByText('Hello body', { selector: 'p' })).toBeNull();
    expect(
      screen.getByRole('textbox', { name: 'Markdown' }),
    ).toBeInTheDocument();
  });
});
