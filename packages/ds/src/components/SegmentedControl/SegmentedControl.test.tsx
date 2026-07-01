import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  SegmentedControl,
  getSegmentId,
  getSegmentPanelId,
  type SegmentedControlOption,
} from './SegmentedControl';

const options: readonly SegmentedControlOption[] = [
  { value: 'write', label: 'Write' },
  { value: 'preview', label: 'Preview' },
];

const three: readonly SegmentedControlOption[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
];

describe('SegmentedControl', () => {
  it('renders a tablist with one tab per option', () => {
    render(
      <SegmentedControl
        options={options}
        value="write"
        onValueChange={() => {}}
        aria-label="Editor mode"
      />,
    );
    expect(
      screen.getByRole('tablist', { name: 'Editor mode' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('marks the active option selected and focusable, inactive ones not', () => {
    render(
      <SegmentedControl
        options={options}
        value="write"
        onValueChange={() => {}}
      />,
    );
    const write = screen.getByRole('tab', { name: 'Write' });
    const preview = screen.getByRole('tab', { name: 'Preview' });
    expect(write).toHaveAttribute('aria-selected', 'true');
    expect(write).toHaveAttribute('tabindex', '0');
    expect(preview).toHaveAttribute('aria-selected', 'false');
    expect(preview).toHaveAttribute('tabindex', '-1');
  });

  it('fires onValueChange with the clicked value', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={options}
        value="write"
        onValueChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(onChange).toHaveBeenCalledWith('preview');
  });

  it('does not fire onValueChange when clicking the active option', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={options}
        value="write"
        onValueChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Write' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves selection and DOM focus with arrows, Home and End', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl options={three} value="b" onValueChange={onChange} />,
    );
    const b = screen.getByRole('tab', { name: 'B' });
    fireEvent.keyDown(b, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('c');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();

    fireEvent.keyDown(b, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('a');

    fireEvent.keyDown(b, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith('a');

    fireEvent.keyDown(b, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('c');
  });

  it('wraps with ArrowLeft from the first option to the last', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl options={three} value="a" onValueChange={onChange} />,
    );
    fireEvent.keyDown(screen.getByRole('tab', { name: 'A' }), {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenLastCalledWith('c');
  });

  it('selects nothing but keeps the first option focusable when value matches no option', () => {
    render(
      <SegmentedControl
        options={options}
        value="nope"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Write' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: 'Write' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('falls back to the first enabled option when value points at a disabled one', () => {
    const withDisabled: readonly SegmentedControlOption[] = [
      { value: 'write', label: 'Write', disabled: true },
      { value: 'preview', label: 'Preview' },
    ];
    render(
      <SegmentedControl
        options={withDisabled}
        value="write"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Write' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('disables an option and skips it with arrow keys', () => {
    const onChange = vi.fn();
    const withDisabled: readonly SegmentedControlOption[] = [
      { value: 'write', label: 'Write' },
      { value: 'preview', label: 'Preview', disabled: true },
    ];
    render(
      <SegmentedControl
        options={withDisabled}
        value="write"
        onValueChange={onChange}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Preview' })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Write' }), {
      key: 'ArrowRight',
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('gives every tab an id but aria-controls only the active tab', () => {
    render(
      <SegmentedControl
        options={options}
        value="write"
        onValueChange={() => {}}
        idPrefix="editor"
      />,
    );
    const write = screen.getByRole('tab', { name: 'Write' });
    const preview = screen.getByRole('tab', { name: 'Preview' });
    expect(write).toHaveAttribute('id', getSegmentId('editor', 'write'));
    expect(preview).toHaveAttribute('id', getSegmentId('editor', 'preview'));
    expect(write).toHaveAttribute(
      'aria-controls',
      getSegmentPanelId('editor', 'write'),
    );
    expect(preview).not.toHaveAttribute('aria-controls');
  });

  it('forwards ref to the tablist element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SegmentedControl
        ref={ref}
        options={options}
        value="write"
        onValueChange={() => {}}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('tablist');
  });

  it('merges a custom className onto the tablist', () => {
    render(
      <SegmentedControl
        options={options}
        value="write"
        onValueChange={() => {}}
        className="custom"
      />,
    );
    expect(screen.getByRole('tablist')).toHaveClass('custom');
  });
});
