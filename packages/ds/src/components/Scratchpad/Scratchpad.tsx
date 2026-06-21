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
import { Badge } from '../Badge';
import { TicketId } from '../TicketId';
import { Popover } from '../Popover';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import { useDragReorder } from '../../hooks/useDragReorder';
import { parseLine, type ScratchpadBlockKind } from './parseLine';
import styles from './Scratchpad.module.css';

export interface ScratchpadTaskRef {
  id: string;
  title: string;
  status: string;
  createdAgo: string;
  description?: string;
  href?: string;
}

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

// Inline tokens recognised in line text when `highlightBadges` is on. Add an
// entry (plus its CSS class) to support a new token — matching is generated
// from these keys and is case-insensitive.
const BADGE_TOKENS: Record<string, { label: string; className: string }> = {
  task: { label: 'TASK', className: styles.tokenTask },
  qa: { label: 'QA', className: styles.tokenQa },
};

const TOKEN_PATTERN = new RegExp(
  `\\[(${Object.keys(BADGE_TOKENS).join('|')})\\]`,
  'gi',
);

interface TokenBadgeProps {
  id: string;
  tokenKey: string;
  taskInfo?: ScratchpadTaskRef;
  open: boolean;
  manageFocus: boolean;
  onOpenChange?: (id: string | null, manageFocus?: boolean) => void;
}

function TokenBadge({
  id,
  tokenKey,
  taskInfo,
  open,
  manageFocus,
  onOpenChange,
}: TokenBadgeProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const token = BADGE_TOKENS[tokenKey];
  // Only `task` tokens reveal a popover, and only when info is supplied.
  const interactive =
    tokenKey === 'task' && taskInfo !== undefined && onOpenChange !== undefined;

  if (!interactive) {
    return (
      <span className={cn(styles.tokenBadge, token.className)}>
        {token.label}
      </span>
    );
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.tokenBadge,
          styles.tokenBadgeButton,
          token.className,
        )}
        aria-label={`Linked task ${taskInfo.id}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(id, true);
        }}
        onMouseEnter={() => {
          if (!manageFocus) onOpenChange(id);
        }}
        onMouseLeave={() => {
          if (!manageFocus) onOpenChange(null);
        }}
      >
        {token.label}
      </button>
      <Popover
        open={open}
        onOpenChange={(next) => onOpenChange(next ? id : null)}
        anchorRef={ref}
        manageFocus={manageFocus}
        placement="bottom-start"
        aria-label={`Linked task ${taskInfo.id}`}
      >
        {/* Keep the card open while the pointer bridges the chip→card gap. */}
        <div
          onMouseEnter={() => {
            if (!manageFocus) onOpenChange(id);
          }}
          onMouseLeave={() => {
            if (!manageFocus) onOpenChange(null);
          }}
        >
          <LinkedTaskCard taskRef={taskInfo} />
        </div>
      </Popover>
    </>
  );
}

interface HighlightedTextProps {
  lineId: string;
  text: string;
  highlight: boolean;
  taskBadgeInfo?: ScratchpadTaskRef;
  openBadgeId?: string | null;
  openBadgeManagesFocus?: boolean;
  onBadgeOpenChange?: (id: string | null, manageFocus?: boolean) => void;
}

// Renders the line text with inline [task]/[qa] token chips. Plain text flows
// naturally; click-to-edit is handled by the enclosing line, not per run.
function HighlightedText({
  lineId,
  text,
  highlight,
  taskBadgeInfo,
  openBadgeId,
  openBadgeManagesFocus,
  onBadgeOpenChange,
}: HighlightedTextProps) {
  if (!highlight) return <>{text}</>;

  const nodes: ReactNode[] = [];
  let last = 0;
  let tokenIndex = 0;
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const tokenKey = match[1].toLowerCase();
    // Key by occurrence index, not character offset, so the open id stays
    // valid when text before the token changes length.
    const id = `${lineId}#${tokenIndex++}`;
    nodes.push(
      <TokenBadge
        key={id}
        id={id}
        tokenKey={tokenKey}
        taskInfo={taskBadgeInfo}
        open={openBadgeId === id}
        manageFocus={openBadgeId === id && openBadgeManagesFocus === true}
        onOpenChange={onBadgeOpenChange}
      />,
    );
    last = start + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function LinkedTaskCard({ taskRef }: { taskRef: ScratchpadTaskRef }) {
  return (
    <div className={styles.taskCard}>
      <div className={styles.taskCardHeader}>
        <span className={styles.taskCardTitle}>
          <TicketId>{taskRef.id}</TicketId>
          {taskRef.title}
        </span>
        <Badge>{taskRef.status}</Badge>
      </div>
      {taskRef.description && (
        <p className={styles.taskCardDescription}>{taskRef.description}</p>
      )}
      <div className={styles.taskCardFooter}>
        <span className={styles.taskCardMeta}>
          <Icon name="schedule" size="sm" />
          {taskRef.createdAgo}
        </span>
        {taskRef.href && (
          <a className={styles.viewTask} href={sanitizeHref(taskRef.href)}>
            View Task
          </a>
        )}
      </div>
    </div>
  );
}

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
    }
  };

  const editable = onLineTextChange !== undefined;
  const showEditor = editable && (!highlightBadges || editing);
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
          onBlur={highlightBadges ? () => onStopEdit?.(line.id) : undefined}
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
        <HighlightedText
          lineId={line.id}
          text={content}
          highlight={highlightBadges}
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
