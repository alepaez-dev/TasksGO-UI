import { useLayoutEffect, useRef, type RefObject } from 'react';
import {
  applyMarkdownAction,
  type MarkdownAction,
} from '../utils/markdown/applyMarkdownAction';

export interface UseScratchpadEditingResult {
  // The editing row registers its textarea here so actions target it.
  readonly activeTextareaRef: RefObject<HTMLTextAreaElement | null>;
  readonly applyLineAction: (action: MarkdownAction) => void;
}

// Applies a markdown toolbar action to the line currently being edited and
// restores the caret after the controlled value round-trips through the parent.
// The transient selection buffer + layout effect live here (a hook) rather than
// in the stateless Scratchpad component.
export function useScratchpadEditing(
  editingLineId: string | null | undefined,
  onLineTextChange: ((id: string, text: string) => void) | undefined,
): UseScratchpadEditingResult {
  const activeTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingSelection = useRef<[number, number] | null>(null);

  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const el = activeTextareaRef.current;
    if (selection && el) {
      el.focus();
      el.setSelectionRange(selection[0], selection[1]);
      pendingSelection.current = null;
    }
  });

  const applyLineAction = (action: MarkdownAction) => {
    const el = activeTextareaRef.current;
    if (!el || editingLineId == null || onLineTextChange === undefined) return;
    const edit = applyMarkdownAction(action, {
      value: el.value,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
    });
    pendingSelection.current = [edit.selectionStart, edit.selectionEnd];
    onLineTextChange(editingLineId, edit.value);
  };

  return { activeTextareaRef, applyLineAction };
}
