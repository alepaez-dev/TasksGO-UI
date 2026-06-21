export type ScratchpadBlockKind = 'heading' | 'todo' | 'text';

export interface ScratchpadBlock {
  kind: ScratchpadBlockKind;
  checked: boolean;
  // Where editable/badge content begins — after a todo marker, 0 otherwise.
  contentStart: number;
}

const TODO_MARKER = /^(\[)( |x|X)(\])\s+/;
const HEADING_MARKER = /^#\s+/;

// The single place line syntax is interpreted. Swap this (and the matching
// renderer) for a real Markdown parser to migrate to full Markdown later.
export function parseLine(text: string): ScratchpadBlock {
  const todo = TODO_MARKER.exec(text);
  if (todo) {
    return {
      kind: 'todo',
      checked: todo[2].toLowerCase() === 'x',
      contentStart: todo[0].length,
    };
  }
  if (HEADING_MARKER.test(text)) {
    return { kind: 'heading', checked: false, contentStart: 0 };
  }
  return { kind: 'text', checked: false, contentStart: 0 };
}

export function toggleChecked(text: string): string {
  return text.replace(
    TODO_MARKER,
    (match: string, open: string, box: string, close: string) => {
      const next = box.toLowerCase() === 'x' ? ' ' : 'x';
      // Preserve the original trailing whitespace from the matched marker.
      const trailing = match.slice(open.length + box.length + close.length);
      return `${open}${next}${close}${trailing}`;
    },
  );
}
