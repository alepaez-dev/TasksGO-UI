import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EditableTitle } from './EditableTitle';

const base = {
  value: 'Rate Limit Edge Case',
  editing: false,
  onEditingChange: () => {},
  onChange: () => {},
};

describe('EditableTitle', () => {
  it('renders the read element per `as` with the value', () => {
    render(<EditableTitle {...base} as="h1" />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Rate Limit Edge Case' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('enters edit mode from the Edit toggle', async () => {
    const onEditingChange = vi.fn();
    render(
      <EditableTitle
        {...base}
        editButton="always"
        onEditingChange={onEditingChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEditingChange).toHaveBeenCalledWith(true);
  });

  it('renders no toggle when editButton is "none"', () => {
    render(<EditableTitle {...base} editButton="none" />);
    expect(
      screen.queryByRole('button', { name: 'Edit' }),
    ).not.toBeInTheDocument();
  });

  it('enters edit mode by clicking the title when clickToEdit is set', async () => {
    const onEditingChange = vi.fn();
    render(
      <EditableTitle
        {...base}
        as="h1"
        clickToEdit
        onEditingChange={onEditingChange}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Rate Limit Edge Case' }),
    );
    expect(onEditingChange).toHaveBeenCalledWith(true);
  });

  it('focuses the textarea when entering edit mode', () => {
    const { rerender } = render(<EditableTitle {...base} />);
    rerender(<EditableTitle {...base} editing />);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('keeps an accessible name on the read button when the title is empty', () => {
    render(
      <EditableTitle
        {...base}
        value=""
        as="h1"
        clickToEdit
        aria-label="Ticket title"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Ticket title' }),
    ).toBeInTheDocument();
  });

  it('shows the placeholder as the read button label when the value is empty', () => {
    render(
      <EditableTitle
        {...base}
        value=""
        as="h1"
        clickToEdit
        placeholder="Untitled"
        aria-label="Ticket title"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Untitled' }),
    ).toBeInTheDocument();
  });

  it('keeps a heading mounted while editing (as heading)', () => {
    render(<EditableTitle {...base} value="Edge caching" as="h1" editing />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Edge caching' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows a labelled textbox in edit mode and emits live changes', async () => {
    const onChange = vi.fn();
    render(
      <EditableTitle
        {...base}
        value="Hi"
        editing
        onChange={onChange}
        aria-label="Ticket title"
      />,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Ticket title' }),
      '!',
    );
    expect(onChange).toHaveBeenCalledWith('Hi!');
  });

  it('commits on Enter (exits, no newline inserted)', () => {
    const onEditingChange = vi.fn();
    const onChange = vi.fn();
    render(
      <EditableTitle
        {...base}
        value="Hi"
        editing
        onEditingChange={onEditingChange}
        onChange={onChange}
      />,
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onEditingChange).toHaveBeenCalledWith(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not exit or revert on Escape (live-edit model, matches EditableSection)', () => {
    const onEditingChange = vi.fn();
    render(
      <EditableTitle {...base} editing onEditingChange={onEditingChange} />,
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
    expect(onEditingChange).not.toHaveBeenCalled();
  });

  it('ignores Enter during IME composition', () => {
    const onEditingChange = vi.fn();
    render(
      <EditableTitle {...base} editing onEditingChange={onEditingChange} />,
    );
    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: 'Enter',
      isComposing: true,
    });
    expect(onEditingChange).not.toHaveBeenCalled();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EditableTitle {...base} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
