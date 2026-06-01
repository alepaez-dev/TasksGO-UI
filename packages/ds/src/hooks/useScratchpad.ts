import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScratchpadLine } from '../components/Scratchpad';
import { toggleChecked } from '../components/Scratchpad/parseLine';

const BADGE_CLOSE_DELAY = 150;

export interface UseScratchpadControls {
  readonly lines: readonly ScratchpadLine[];
  readonly onReorder: (next: readonly ScratchpadLine[]) => void;
  readonly onLineTextChange: (id: string, text: string) => void;
  readonly onLineToggle: (id: string) => void;
  readonly onLineDelete: (id: string) => void;
  readonly onAddLine: (afterId: string) => void;
  readonly autoFocusLineId: string | null;
  readonly editingLineId: string | null;
  readonly onLineStartEdit: (id: string) => void;
  readonly onLineStopEdit: (id: string) => void;
  readonly openBadgeId: string | null;
  readonly onBadgeOpenChange: (id: string | null) => void;
}

export function useScratchpad(
  initialLines: readonly ScratchpadLine[],
): UseScratchpadControls {
  const [lines, setLines] = useState<readonly ScratchpadLine[]>(initialLines);
  const [autoFocusLineId, setAutoFocusLineId] = useState<string | null>(null);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [openBadgeId, setOpenBadgeId] = useState<string | null>(null);
  const nextId = useRef(0);
  const badgeCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Delay the close so the pointer can cross the gap from a [task] chip to
  // its popover card without the card unmounting first.
  const onBadgeOpenChange = useCallback((id: string | null) => {
    if (badgeCloseTimer.current) clearTimeout(badgeCloseTimer.current);
    if (id === null) {
      badgeCloseTimer.current = setTimeout(
        () => setOpenBadgeId(null),
        BADGE_CLOSE_DELAY,
      );
    } else {
      setOpenBadgeId(id);
    }
  }, []);

  useEffect(
    () => () => {
      if (badgeCloseTimer.current) clearTimeout(badgeCloseTimer.current);
    },
    [],
  );

  const onLineTextChange = useCallback((id: string, text: string) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, text } : line)),
    );
  }, []);

  const onLineToggle = useCallback((id: string) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, text: toggleChecked(line.text) } : line,
      ),
    );
  }, []);

  const onAddLine = useCallback((afterId: string) => {
    const id = `scratchpad-line-${nextId.current++}`;
    setLines((prev) => {
      const index = prev.findIndex((line) => line.id === afterId);
      const next = [...prev];
      next.splice(index + 1, 0, { id, text: '' });
      return next;
    });
    setAutoFocusLineId(id);
    setEditingLineId(id);
  }, []);

  const onLineDelete = useCallback(
    (id: string) => {
      const index = lines.findIndex((line) => line.id === id);
      const focusId = index > 0 ? lines[index - 1].id : null;
      setAutoFocusLineId(focusId);
      setEditingLineId(focusId);
      setLines((prev) => prev.filter((line) => line.id !== id));
    },
    [lines],
  );

  const onLineStartEdit = useCallback((id: string) => {
    setEditingLineId(id);
    setAutoFocusLineId(id);
  }, []);

  const onLineStopEdit = useCallback((id: string) => {
    setEditingLineId((prev) => (prev === id ? null : prev));
  }, []);

  return {
    lines,
    onReorder: setLines,
    onLineTextChange,
    onLineToggle,
    onLineDelete,
    onAddLine,
    autoFocusLineId,
    editingLineId,
    onLineStartEdit,
    onLineStopEdit,
    openBadgeId,
    onBadgeOpenChange,
  };
}
