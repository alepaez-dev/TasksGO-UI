import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MarkdownToolbar } from './MarkdownToolbar';

const labels = [
  'Heading',
  'Bold',
  'Italic',
  'Bulleted list',
  'Quote',
  'Code',
  'Link',
  'Image',
];

describe('MarkdownToolbar', () => {
  it('renders a labelled toolbar with one button per action', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    expect(
      screen.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeInTheDocument();
    labels.forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    });
  });

  it('fires onAction with the matching action id when a button is clicked', () => {
    const onAction = vi.fn();
    render(<MarkdownToolbar onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onAction).toHaveBeenCalledWith('bold');
    fireEvent.click(screen.getByRole('button', { name: 'Bulleted list' }));
    expect(onAction).toHaveBeenCalledWith('list');
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    expect(onAction).toHaveBeenCalledWith('link');
    fireEvent.click(screen.getByRole('button', { name: 'Image' }));
    expect(onAction).toHaveBeenCalledWith('image');
  });

  it('is a single tab stop (roving tabindex)', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    buttons
      .slice(1)
      .forEach((button) => expect(button).toHaveAttribute('tabindex', '-1'));
  });

  it('moves focus and the tab stop with arrow keys', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(buttons[1]).toHaveFocus();
    expect(buttons[1]).toHaveAttribute('tabindex', '0');
    expect(buttons[0]).toHaveAttribute('tabindex', '-1');
  });

  it('jumps to the last and first buttons with End and Home', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const last = buttons.length - 1;
    fireEvent.keyDown(buttons[0], { key: 'End' });
    expect(buttons[last]).toHaveFocus();
    fireEvent.keyDown(buttons[last], { key: 'Home' });
    expect(buttons[0]).toHaveFocus();
  });

  it('disables every button when disabled', () => {
    const onAction = vi.fn();
    render(<MarkdownToolbar onAction={onAction} disabled />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(labels.length);
    buttons.forEach((button) => expect(button).toBeDisabled());
  });

  it('accepts a custom aria-label', () => {
    render(
      <MarkdownToolbar onAction={() => {}} aria-label="Markdown formatting" />,
    );
    expect(
      screen.getByRole('toolbar', { name: 'Markdown formatting' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the toolbar element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MarkdownToolbar ref={ref} onAction={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('toolbar');
  });

  it('merges a custom className', () => {
    render(<MarkdownToolbar onAction={() => {}} className="custom" />);
    expect(screen.getByRole('toolbar')).toHaveClass('custom');
  });
});
