import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useScratchpadEditing } from './useScratchpadEditing';
import type { MarkdownAction } from '../utils/markdown/applyMarkdownAction';

function Harness({
  editingLineId,
  action = 'bold',
  onAddLine,
  onLineTextChange = () => {},
}: {
  editingLineId: string | null;
  action?: MarkdownAction;
  onAddLine?: (afterId: string | null, initialText?: string) => void;
  onLineTextChange?: (id: string, text: string) => void;
}) {
  const { applyLineAction, canApply } = useScratchpadEditing({
    editingLineId,
    onLineTextChange,
    onAddLine,
    lastLineId: 'last',
  });
  return (
    <button
      type="button"
      disabled={!canApply}
      onClick={() => applyLineAction(action)}
    >
      {action}
    </button>
  );
}

describe('useScratchpadEditing', () => {
  it('adds a new line carrying the action output when nothing is being edited', () => {
    const onAddLine = vi.fn();
    render(<Harness editingLineId={null} onAddLine={onAddLine} />);
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    expect(onAddLine).toHaveBeenCalledWith('last', '**bold**');
  });

  it('inserts a token on a new line when nothing is being edited', () => {
    const onAddLine = vi.fn();
    render(
      <Harness editingLineId={null} action="task" onAddLine={onAddLine} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'task' }));
    expect(onAddLine).toHaveBeenCalledWith('last', '[task]');
  });

  it('reports canApply false when nothing is editing and onAddLine is absent', () => {
    render(<Harness editingLineId={null} />);
    expect(screen.getByRole('button', { name: 'bold' })).toBeDisabled();
  });

  it('reports canApply true while a line is being edited', () => {
    render(<Harness editingLineId="a" />);
    expect(screen.getByRole('button', { name: 'bold' })).toBeEnabled();
  });

  it('stays usable for a consumer that only wires onAddLine', () => {
    const onAddLine = vi.fn();
    // Separate from Harness on purpose: this needs onLineTextChange to be
    // genuinely absent, which a defaulted prop cannot express.
    function AppendOnlyHarness() {
      const { applyLineAction, canApply } = useScratchpadEditing({
        editingLineId: null,
        // An append-only scratchpad: lines render but are not editable in place.
        onLineTextChange: undefined,
        onAddLine,
        lastLineId: 'last',
      });
      return (
        <button
          type="button"
          disabled={!canApply}
          onClick={() => applyLineAction('bold')}
        >
          bold
        </button>
      );
    }
    render(<AppendOnlyHarness />);
    const button = screen.getByRole('button', { name: 'bold' });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onAddLine).toHaveBeenCalledWith('last', '**bold**');
  });

  it('does nothing when the edited line has no reachable textarea', () => {
    const onAddLine = vi.fn();
    const onLineTextChange = vi.fn();
    render(
      <Harness
        editingLineId="stale"
        onAddLine={onAddLine}
        onLineTextChange={onLineTextChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'bold' }));
    // Neither path may run: appending here would edit a line the caller never
    // pointed at.
    expect(onLineTextChange).not.toHaveBeenCalled();
    expect(onAddLine).not.toHaveBeenCalled();
  });
});
