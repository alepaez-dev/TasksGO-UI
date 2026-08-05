export type MarkdownAction =
  | 'heading'
  | 'bold'
  | 'italic'
  | 'list'
  | 'quote'
  | 'code'
  | 'link'
  | 'image'
  | 'checkbox';

export interface TextSelection {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export interface TextEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

const WRAP: Record<
  'bold' | 'italic' | 'code',
  { marker: string; placeholder: string }
> = {
  bold: { marker: '**', placeholder: 'bold' },
  italic: { marker: '*', placeholder: 'italic' },
  code: { marker: '`', placeholder: 'code' },
};

const LINE_PREFIX: Record<'heading' | 'list' | 'quote' | 'checkbox', string> = {
  heading: '## ',
  list: '- ',
  quote: '> ',
  checkbox: '[ ] ',
};

function wrap(
  action: 'bold' | 'italic' | 'code',
  sel: TextSelection,
): TextEdit {
  const { marker, placeholder } = WRAP[action];
  const { value, selectionStart, selectionEnd } = sel;
  const inner = value.slice(selectionStart, selectionEnd) || placeholder;
  const start = selectionStart + marker.length;
  return {
    value:
      value.slice(0, selectionStart) +
      marker +
      inner +
      marker +
      value.slice(selectionEnd),
    selectionStart: start,
    selectionEnd: start + inner.length,
  };
}

function linePrefix(
  action: 'heading' | 'list' | 'quote' | 'checkbox',
  sel: TextSelection,
): TextEdit {
  const prefix = LINE_PREFIX[action];
  const { value, selectionStart, selectionEnd } = sel;
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  // A selection ending on a line break shouldn't prefix the next, unselected line.
  const blockEnd =
    selectionEnd > lineStart && value[selectionEnd - 1] === '\n'
      ? selectionEnd - 1
      : selectionEnd;
  const lines = value.slice(lineStart, blockEnd).split('\n');
  const prefixed = lines.map((line) => prefix + line).join('\n');
  return {
    value: value.slice(0, lineStart) + prefixed + value.slice(blockEnd),
    selectionStart: selectionStart + prefix.length,
    selectionEnd: selectionEnd + prefix.length * lines.length,
  };
}

function insertLink(action: 'link' | 'image', sel: TextSelection): TextEdit {
  const { value, selectionStart, selectionEnd } = sel;
  const bang = action === 'image' ? '!' : '';
  const text =
    value.slice(selectionStart, selectionEnd) ||
    (action === 'image' ? 'alt' : 'text');
  const url = 'url';
  const beforeUrl = `${bang}[${text}](`;
  const snippet = `${beforeUrl}${url})`;
  const urlStart = selectionStart + beforeUrl.length;
  return {
    value: value.slice(0, selectionStart) + snippet + value.slice(selectionEnd),
    selectionStart: urlStart,
    selectionEnd: urlStart + url.length,
  };
}

export function applyMarkdownAction(
  action: MarkdownAction,
  sel: TextSelection,
): TextEdit {
  switch (action) {
    case 'bold':
    case 'italic':
    case 'code':
      return wrap(action, sel);
    case 'heading':
    case 'list':
    case 'quote':
    case 'checkbox':
      return linePrefix(action, sel);
    case 'link':
    case 'image':
      return insertLink(action, sel);
  }
}
