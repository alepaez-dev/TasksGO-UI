import { createRef } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Scratchpad, type ScratchpadLine } from './Scratchpad';

const lines: readonly ScratchpadLine[] = [
  { id: 'h1', text: '# Implementation Strategy' },
  { id: 't1', text: '[ ] Check race condition' },
  { id: 't2', text: '[x] Initial research' },
  { id: 'x1', text: 'Refactor header logic' },
];

describe('Scratchpad', () => {
  it('renders line content', () => {
    render(<Scratchpad aria-label="Notes" lines={lines} />);
    expect(screen.getByText('# Implementation Strategy')).toBeInTheDocument();
    expect(screen.getByText('[ ] Check race condition')).toBeInTheDocument();
    expect(screen.getByText('Refactor header logic')).toBeInTheDocument();
  });

  it('renders a `#` line as a bold heading', () => {
    render(<Scratchpad aria-label="Notes" lines={lines} />);
    expect(screen.getByText('# Implementation Strategy').className).toMatch(
      /headingText/,
    );
  });

  it('renders the region with the provided aria-label', () => {
    render(<Scratchpad aria-label="Scratchpad notes" lines={lines} />);
    expect(
      screen.getByRole('group', { name: 'Scratchpad notes' }),
    ).toBeInTheDocument();
  });

  it('renders title and status when provided', () => {
    render(
      <Scratchpad
        aria-label="Notes"
        lines={lines}
        title="Scratchpad / Private Notes"
        status="Auto-saving…"
      />,
    );
    expect(screen.getByText('Scratchpad / Private Notes')).toBeInTheDocument();
    expect(screen.getByText('Auto-saving…')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Scratchpad ref={ref} aria-label="Notes" lines={lines} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('reorder', () => {
    it('does not render drag handles when onReorder is omitted', () => {
      render(<Scratchpad aria-label="Notes" lines={lines} />);
      expect(
        screen.queryByRole('button', { name: /^Reorder:/ }),
      ).not.toBeInTheDocument();
    });

    it('renders a drag handle per line when onReorder is provided', () => {
      render(
        <Scratchpad aria-label="Notes" lines={lines} onReorder={() => {}} />,
      );
      expect(screen.getAllByRole('button', { name: /^Reorder:/ })).toHaveLength(
        lines.length,
      );
    });

    it('fires onReorder on Alt+ArrowDown on a drag handle', () => {
      const onReorder = vi.fn();
      render(
        <Scratchpad aria-label="Notes" lines={lines} onReorder={onReorder} />,
      );
      const handles = screen.getAllByRole('button', { name: /^Reorder:/ });
      fireEvent.keyDown(handles[0], { key: 'ArrowDown', altKey: true });
      expect(onReorder).toHaveBeenCalledTimes(1);
      const next = onReorder.mock.calls[0][0] as ScratchpadLine[];
      expect(next.map((l) => l.id)).toEqual(['t1', 'h1', 't2', 'x1']);
    });

    it('does not fire onReorder on ArrowDown without Alt', () => {
      const onReorder = vi.fn();
      render(
        <Scratchpad aria-label="Notes" lines={lines} onReorder={onReorder} />,
      );
      const handles = screen.getAllByRole('button', { name: /^Reorder:/ });
      fireEvent.keyDown(handles[0], { key: 'ArrowDown' });
      expect(onReorder).not.toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    it('exposes todos as checkboxes reflecting checked state when onLineToggle is provided', () => {
      render(
        <Scratchpad aria-label="Notes" lines={lines} onLineToggle={() => {}} />,
      );
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).toHaveAttribute('aria-checked', 'false');
      expect(checkboxes[1]).toHaveAttribute('aria-checked', 'true');
    });

    it('fires onLineToggle with the line id when a checkbox is clicked', () => {
      const onLineToggle = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineToggle={onLineToggle}
        />,
      );
      fireEvent.click(screen.getAllByRole('checkbox')[0]);
      expect(onLineToggle).toHaveBeenCalledWith('t1');
    });

    it('renders static markers (no checkboxes) when onLineToggle is omitted', () => {
      render(<Scratchpad aria-label="Notes" lines={lines} />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('edit', () => {
    it('renders textareas with line text when onLineTextChange is provided', () => {
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineTextChange={() => {}}
        />,
      );
      expect(screen.getAllByRole('textbox')).toHaveLength(lines.length);
    });

    it('fires onLineTextChange with the line id and new text', () => {
      const onLineTextChange = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineTextChange={onLineTextChange}
        />,
      );
      fireEvent.change(screen.getByRole('textbox', { name: 'Edit heading' }), {
        target: { value: 'New heading' },
      });
      expect(onLineTextChange).toHaveBeenCalledWith('h1', 'New heading');
    });

    it('renders static text (no textareas) when onLineTextChange is omitted', () => {
      render(<Scratchpad aria-label="Notes" lines={lines} />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('shows the placeholder on a line textarea', () => {
      render(
        <Scratchpad
          aria-label="Notes"
          lines={[{ id: 'l0', text: '' }]}
          onLineTextChange={() => {}}
          placeholder="Click to add more context…"
        />,
      );
      expect(
        screen.getByPlaceholderText('Click to add more context…'),
      ).toBeInTheDocument();
    });

    it('focuses the line matching autoFocusLineId', () => {
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineTextChange={() => {}}
          autoFocusLineId="t1"
        />,
      );
      expect(document.activeElement).toBe(
        screen.getByDisplayValue('[ ] Check race condition'),
      );
    });
  });

  describe('Enter and Backspace', () => {
    it('fires onAddLine with the current line id on Enter', () => {
      const onAddLine = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineTextChange={() => {}}
          onAddLine={onAddLine}
        />,
      );
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Edit heading' }), {
        key: 'Enter',
      });
      expect(onAddLine).toHaveBeenCalledWith('h1');
    });

    it('does not fire onAddLine on Shift+Enter (soft line break)', () => {
      const onAddLine = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineTextChange={() => {}}
          onAddLine={onAddLine}
        />,
      );
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Edit heading' }), {
        key: 'Enter',
        shiftKey: true,
      });
      expect(onAddLine).not.toHaveBeenCalled();
    });

    it('fires onLineDelete on Backspace when the line is empty', () => {
      const onLineDelete = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={[{ id: 'l0', text: '' }]}
          onLineTextChange={() => {}}
          onLineDelete={onLineDelete}
        />,
      );
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Backspace' });
      expect(onLineDelete).toHaveBeenCalledWith('l0');
    });

    it('does not fire onLineDelete on Backspace when the line has text', () => {
      const onLineDelete = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineTextChange={() => {}}
          onLineDelete={onLineDelete}
        />,
      );
      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Edit heading' }), {
        key: 'Backspace',
      });
      expect(onLineDelete).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('does not render delete buttons when onLineDelete is omitted', () => {
      render(<Scratchpad aria-label="Notes" lines={lines} />);
      expect(
        screen.queryByRole('button', { name: /^Delete line/ }),
      ).not.toBeInTheDocument();
    });

    it('fires onLineDelete with the line id', () => {
      const onLineDelete = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={lines}
          onLineDelete={onLineDelete}
        />,
      );
      const del = screen.getAllByRole('button', { name: /^Delete line/ })[0];
      fireEvent.click(del);
      expect(onLineDelete).toHaveBeenCalledWith('h1');
    });
  });

  describe('highlightBadges', () => {
    const tokenLine: readonly ScratchpadLine[] = [
      { id: 'l1', text: 'Do [task] then [QA] it' },
    ];

    it('renders [task]/[qa] tokens as chips (case-insensitive) when on', () => {
      render(
        <Scratchpad aria-label="Notes" lines={tokenLine} highlightBadges />,
      );
      expect(screen.getByText('TASK')).toBeInTheDocument();
      expect(screen.getByText('QA')).toBeInTheDocument();
    });

    it('does not parse tokens when highlightBadges is off', () => {
      render(<Scratchpad aria-label="Notes" lines={tokenLine} />);
      expect(screen.queryByText('TASK')).not.toBeInTheDocument();
      expect(
        screen.getByText(/Do \[task\] then \[QA\] it/),
      ).toBeInTheDocument();
    });

    it('renders text runs as edit buttons and swaps to a textarea while editing', () => {
      const { rerender } = render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          onLineTextChange={() => {}}
          editingLineId={null}
        />,
      );
      // not editing → text runs are edit buttons, no textarea
      expect(
        screen.getAllByRole('button', { name: 'Edit note' }).length,
      ).toBeGreaterThan(0);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

      // editing this line → textarea appears
      rerender(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          onLineTextChange={() => {}}
          editingLineId="l1"
        />,
      );
      expect(
        screen.getByRole('textbox', { name: 'Edit note' }),
      ).toBeInTheDocument();
    });

    it('fires onLineStartEdit when a rendered text run is clicked', () => {
      const onLineStartEdit = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          onLineTextChange={() => {}}
          editingLineId={null}
          onLineStartEdit={onLineStartEdit}
        />,
      );
      fireEvent.click(screen.getAllByRole('button', { name: 'Edit note' })[0]);
      expect(onLineStartEdit).toHaveBeenCalledWith('l1');
    });

    const taskBadgeInfo = {
      id: 'TSK-9',
      title: 'Write tests',
      status: 'Outdated',
      createdAgo: 'Created 1h ago',
      href: '/t/9',
    };

    it('renders an interactive [task] chip as a keyboard-focusable button', () => {
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          taskBadgeInfo={taskBadgeInfo}
          onBadgeOpenChange={() => {}}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Linked task TSK-9' }),
      ).toBeInTheDocument();
    });

    it('opens the [task] dialog with focus management when the chip is activated', () => {
      const onBadgeOpenChange = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          taskBadgeInfo={taskBadgeInfo}
          onBadgeOpenChange={onBadgeOpenChange}
        />,
      );
      fireEvent.click(
        screen.getByRole('button', { name: 'Linked task TSK-9' }),
      );
      expect(onBadgeOpenChange).toHaveBeenCalledWith('l1#0', true);
    });

    it('fires onBadgeOpenChange when a [task] chip is hovered', () => {
      const onBadgeOpenChange = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          taskBadgeInfo={taskBadgeInfo}
          onBadgeOpenChange={onBadgeOpenChange}
        />,
      );
      fireEvent.mouseEnter(
        screen.getByRole('button', { name: 'Linked task TSK-9' }),
      );
      expect(onBadgeOpenChange).toHaveBeenCalledWith('l1#0');
    });

    it('shows the hardcoded task popover for the open [task] chip', () => {
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          taskBadgeInfo={taskBadgeInfo}
          openBadgeId="l1#0"
          onBadgeOpenChange={() => {}}
        />,
      );
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText('TSK-9')).toBeInTheDocument();
      expect(within(dialog).getByText('Write tests')).toBeInTheDocument();
    });

    it('moves focus into the task dialog so its link is keyboard-reachable', () => {
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          taskBadgeInfo={taskBadgeInfo}
          openBadgeId="l1#0"
          openBadgeManagesFocus
          onBadgeOpenChange={() => {}}
        />,
      );
      expect(screen.getByRole('dialog')).toHaveFocus();
      expect(
        screen.getByRole('link', { name: 'View Task' }),
      ).toBeInTheDocument();
    });

    it('does not make [qa] chips interactive', () => {
      const onBadgeOpenChange = vi.fn();
      render(
        <Scratchpad
          aria-label="Notes"
          lines={tokenLine}
          highlightBadges
          taskBadgeInfo={taskBadgeInfo}
          onBadgeOpenChange={onBadgeOpenChange}
        />,
      );
      fireEvent.mouseEnter(screen.getByText('QA'));
      expect(onBadgeOpenChange).not.toHaveBeenCalled();
    });
  });
});
