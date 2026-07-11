import {
  forwardRef,
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useDragReorder } from '../../hooks/useDragReorder';
import { parseLine, type ScratchpadBlockKind } from './parseLine';
import { type ScratchpadTaskRef } from './TokenBadge';
import { ScratchpadLineMarkdown } from './ScratchpadLineMarkdown';
import styles from './Scratchpad.module.css';

export type { ScratchpadTaskRef };

export interface ScratchpadLine {
  id: string;
  // Raw line source. Leading `# ` renders a heading; leading `[ ] `/`[x] `
  // renders a todo; inline `[task]`/`[qa]` render badges. See parseLine.
  text: string;
}

export interface ScratchpadProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'title'
> {
  'aria-label': string;
  lines: readonly ScratchpadLine[];
  title?: ReactNode;
  status?: ReactNode;
  onReorder?: (next: readonly ScratchpadLine[]) => void;
  onLineTextChange?: (id: string, text: string) => void;
  onLineToggle?: (id: string) => void;
  onLineDelete?: (id: string) => void;
  onAddLine?: (afterId: string) => void;
  placeholder?: string;
  autoFocusLineId?: string | null;
  highlightBadges?: boolean;
  editingLineId?: string | null;
  onLineStartEdit?: (id: string) => void;
  onLineStopEdit?: (id: string) => void;
  // One shared task shown for every [task] chip for now; will expand to a
  // per-token resolver once linking a token to a specific task is defined.
  taskBadgeInfo?: ScratchpadTaskRef;
  openBadgeId?: string | null;
  openBadgeManagesFocus?: boolean;
  onBadgeOpenChange?: (id: string | null, manageFocus?: boolean) => void;
}

const editLabel: Record<ScratchpadBlockKind, string> = {
  heading: 'Edit heading',
  todo: 'Edit task',
  text: 'Edit note',
};

interface ScratchpadRowProps {
  line: ScratchpadLine;
  index: number;
  reorderable: boolean;
  onPointerDown: (
    e: ReactPointerEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onLineTextChange?: (id: string, text: string) => void;
  onLineToggle?: (id: string) => void;
  onLineDelete?: (id: string) => void;
  onAddLine?: (afterId: string) => void;
  placeholder?: string;
  shouldFocus: boolean;
  highlightBadges: boolean;
  editing: boolean;
  onStartEdit?: (id: string) => void;
  onStopEdit?: (id: string) => void;
  // Returns true if edit focus moved to an adjacent row (false at the ends).
  onEditNavigate?: (index: number, direction: 'up' | 'down') => boolean;
  taskBadgeInfo?: ScratchpadTaskRef;
  openBadgeId?: string | null;
  openBadgeManagesFocus?: boolean;
  onBadgeOpenChange?: (id: string | null, manageFocus?: boolean) => void;
}

function ScratchpadRow({
  line,
  index,
  reorderable,
  onPointerDown,
  onKeyDown,
  onLineTextChange,
  onLineToggle,
  onLineDelete,
  onAddLine,
  placeholder,
  shouldFocus,
  highlightBadges,
  editing,
  onStartEdit,
  onStopEdit,
  onEditNavigate,
  taskBadgeInfo,
  openBadgeId,
  openBadgeManagesFocus,
  onBadgeOpenChange,
}: ScratchpadRowProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const block = parseLine(line.text);
  const textClasses = cn(
    styles.text,
    block.kind === 'heading' && styles.headingText,
    block.kind === 'todo' && block.checked && styles.textDone,
  );

  useEffect(() => {
    if (!shouldFocus) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }, [shouldFocus]);

  const handleTextKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter commits a new line below (Shift+Enter keeps a soft line break).
    if (e.key === 'Enter' && !e.shiftKey && onAddLine) {
      e.preventDefault();
      onAddLine(line.id);
    } else if (e.key === 'Backspace' && line.text === '' && onLineDelete) {
      e.preventDefault();
      onLineDelete(line.id);
    } else if (e.key === 'ArrowUp' && onEditNavigate) {
      // On the first line of the row (no newline before the caret), move edit
      // focus to the previous row; otherwise let the caret move up within this
      // row's own soft-break lines.
      const el = e.currentTarget;
      const beforeCaret = el.value.slice(0, el.selectionStart);
      if (!beforeCaret.includes('\n') && onEditNavigate(index, 'up')) {
        e.preventDefault();
      }
    } else if (e.key === 'ArrowDown' && onEditNavigate) {
      const el = e.currentTarget;
      const afterCaret = el.value.slice(el.selectionStart);
      if (!afterCaret.includes('\n') && onEditNavigate(index, 'down')) {
        e.preventDefault();
      }
    }
  };

  const editable = onLineTextChange !== undefined;
  // A row shows rendered markdown until it is the line being edited; then it
  // swaps to a raw textarea. No always-open textareas.
  const showEditor = editable && editing;
  // A todo's `[ ]`/`[x]` becomes a toggle; the rest of the line is its content.
  const toggleable = block.kind === 'todo' && onLineToggle !== undefined;
  const content = toggleable ? line.text.slice(block.contentStart) : line.text;

  let body: ReactNode;
  if (showEditor && onLineTextChange) {
    // Editing shows the raw source (markers included).
    body = (
      <span className={cn(styles.textGrid, textClasses)} data-value={line.text}>
        <textarea
          ref={textareaRef}
          className={styles.textArea}
          value={line.text}
          rows={1}
          placeholder={placeholder}
          aria-label={editLabel[block.kind]}
          onChange={(e) => onLineTextChange(line.id, e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={() => onStopEdit?.(line.id)}
        />
      </span>
    );
  } else if (editable && !line.text) {
    body = (
      <button
        type="button"
        className={cn(styles.renderedText, textClasses)}
        aria-label={editLabel[block.kind]}
        onClick={() => onStartEdit?.(line.id)}
      >
        <span className={styles.placeholderText}>{placeholder}</span>
      </button>
    );
  } else {
    const lineInner = (
      <>
        {toggleable && onLineToggle && (
          <button
            type="button"
            role="checkbox"
            aria-checked={block.checked}
            aria-label={content || 'Task'}
            className={styles.checkbox}
            onClick={(e) => {
              e.stopPropagation();
              onLineToggle(line.id);
            }}
          >
            {block.checked ? '[x]' : '[ ]'}{' '}
          </button>
        )}
        <ScratchpadLineMarkdown
          lineId={line.id}
          text={content}
          highlightBadges={highlightBadges}
          taskBadgeInfo={taskBadgeInfo}
          openBadgeId={openBadgeId}
          openBadgeManagesFocus={openBadgeManagesFocus}
          onBadgeOpenChange={onBadgeOpenChange}
        />
      </>
    );
    body = editable ? (
      // An edit overlay (sibling, not ancestor — so it never nests the toggle
      // or task-chip buttons) fills the line. Text passes clicks through to it
      // via pointer-events, so clicking anywhere on the line starts editing,
      // while the toggle/chips stay interactive on top.
      <span
        className={cn(
          styles.renderedText,
          styles.renderedEditable,
          textClasses,
        )}
      >
        <span
          role="button"
          tabIndex={0}
          className={styles.editLayer}
          aria-label={editLabel[block.kind]}
          onClick={() => onStartEdit?.(line.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onStartEdit?.(line.id);
            }
          }}
        />
        <span className={styles.lineContent}>{lineInner}</span>
      </span>
    ) : (
      <span className={textClasses}>{lineInner}</span>
    );
  }

  return (
    <li className={styles.row}>
      {reorderable && (
        <button
          type="button"
          className={styles.dragHandle}
          aria-label={`Reorder: ${line.text}`}
          onPointerDown={(e) => onPointerDown(e, index)}
          onKeyDown={(e) => onKeyDown(e, index)}
        >
          <Icon name="drag_indicator" size="sm" />
        </button>
      )}
      <span className={styles.content}>{body}</span>
      {onLineDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          aria-label={`Delete line: ${line.text}`}
          onClick={() => onLineDelete(line.id)}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </li>
  );
}

export const Scratchpad = forwardRef<HTMLDivElement, ScratchpadProps>(
  (
    {
      'aria-label': ariaLabel,
      lines,
      title,
      status,
      onReorder,
      onLineTextChange,
      onLineToggle,
      onLineDelete,
      onAddLine,
      placeholder = 'Type something…',
      autoFocusLineId,
      highlightBadges = false,
      editingLineId,
      onLineStartEdit,
      onLineStopEdit,
      taskBadgeInfo,
      openBadgeId,
      openBadgeManagesFocus,
      onBadgeOpenChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const listRef = useRef<HTMLUListElement>(null);
    const reorderable = onReorder !== undefined;

    const { onPointerDown, onKeyDown } = useDragReorder({
      items: lines,
      onReorder,
      listRef,
      classes: {
        dragging: styles.dragging,
        dropAbove: styles.dropAbove,
        dropBelow: styles.dropBelow,
        floatingClone: styles.floatingClone,
        floatingCloneLifted: styles.floatingCloneLifted,
      },
    });

    // Moving off the first/last line of the edited row jumps edit focus to the
    // adjacent row. Returns false at the ends so the caret keeps
    // its native behaviour there.
    const onEditNavigate = onLineStartEdit
      ? (index: number, direction: 'up' | 'down'): boolean => {
          const next = lines[direction === 'up' ? index - 1 : index + 1];
          if (!next) return false;
          onLineStartEdit(next.id);
          return true;
        }
      : undefined;

    return (
      <div
        ref={ref}
        role="group"
        className={cn(styles.scratchpad, className)}
        aria-label={ariaLabel}
        {...rest}
      >
        {(title || status) && (
          <div className={styles.header}>
            {title && <span className={styles.title}>{title}</span>}
            {status && <span className={styles.status}>{status}</span>}
          </div>
        )}
        <ul ref={listRef} className={styles.list}>
          {lines.map((line, index) => (
            <ScratchpadRow
              key={line.id}
              line={line}
              index={index}
              reorderable={reorderable}
              onPointerDown={onPointerDown}
              onKeyDown={onKeyDown}
              onLineTextChange={onLineTextChange}
              onLineToggle={onLineToggle}
              onLineDelete={onLineDelete}
              onAddLine={onAddLine}
              placeholder={placeholder}
              shouldFocus={autoFocusLineId === line.id}
              highlightBadges={highlightBadges}
              editing={editingLineId === line.id}
              onStartEdit={onLineStartEdit}
              onStopEdit={onLineStopEdit}
              onEditNavigate={onEditNavigate}
              taskBadgeInfo={taskBadgeInfo}
              openBadgeId={openBadgeId}
              openBadgeManagesFocus={openBadgeManagesFocus}
              onBadgeOpenChange={onBadgeOpenChange}
            />
          ))}
        </ul>
      </div>
    );
  },
);

Scratchpad.displayName = 'Scratchpad';
