import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import {
  applyMarkdownAction,
  type MarkdownAction,
} from '../utils/markdown/applyMarkdownAction';

export interface UseScratchpadEditingOptions {
  readonly editingLineId: string | null | undefined;
  readonly onLineTextChange: ((id: string, text: string) => void) | undefined;
  readonly onAddLine:
    | ((afterId: string | null, initialText?: string) => void)
    | undefined;
  // The line a new one is inserted after, or null when there are none yet.
  readonly lastLineId: string | null;
}

export interface UseScratchpadEditingResult {
  // The editing row registers its textarea here so actions target it.
  readonly activeTextareaRef: RefObject<HTMLTextAreaElement | null>;
  readonly applyLineAction: (action: MarkdownAction) => void;
  readonly canApply: boolean;
}

export function useScratchpadEditing({
  editingLineId,
  onLineTextChange,
  onAddLine,
  lastLineId,
}: UseScratchpadEditingOptions): UseScratchpadEditingResult {
  const activeTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingSelection = useRef<[number, number] | null>(null);
  const pendingNewLineSelection = useRef<[number, number] | null>(null);

  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const el = activeTextareaRef.current;
    if (selection && el) {
      el.focus();
      el.setSelectionRange(selection[0], selection[1]);
      pendingSelection.current = null;
    }
  });

  useEffect(() => {
    const selection = pendingNewLineSelection.current;
    const el = activeTextareaRef.current;
    if (selection && el) {
      el.focus();
      el.setSelectionRange(selection[0], selection[1]);
      pendingNewLineSelection.current = null;
    }
  });

  const canEdit = editingLineId != null && onLineTextChange !== undefined;
  const canSeedNewLine = onAddLine !== undefined;
  const canApply = canEdit || canSeedNewLine;

  const applyLineAction = (action: MarkdownAction) => {
    if (editingLineId != null && onLineTextChange !== undefined) {
      const el = activeTextareaRef.current;
      // A line is being edited but its textarea is out of reach — a stale id,
      // say. Do nothing rather than silently append to the end of the list.
      if (!el) return;
      const edit = applyMarkdownAction(action, {
        value: el.value,
        selectionStart: el.selectionStart,
        selectionEnd: el.selectionEnd,
      });
      pendingSelection.current = [edit.selectionStart, edit.selectionEnd];
      onLineTextChange(editingLineId, edit.value);
      return;
    }
    if (onAddLine === undefined) return;
    const seed = applyMarkdownAction(action, {
      value: '',
      selectionStart: 0,
      selectionEnd: 0,
    });
    pendingNewLineSelection.current = [seed.selectionStart, seed.selectionEnd];
    onAddLine(lastLineId, seed.value);
  };

  return { activeTextareaRef, applyLineAction, canApply };
}
