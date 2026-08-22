import { useRef } from 'react';
import { Icon } from '../Icon';
import { Badge } from '../Badge';
import { TicketId } from '../TicketId';
import { Popover } from '../Popover';
import { BottomSheet } from '../BottomSheet';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import { BADGE_TOKENS, type TokenKey } from './tokens';
import styles from './Scratchpad.module.css';

export interface ScratchpadTaskRef {
  id: string;
  title: string;
  status: string;
  createdAgo: string;
  description?: string;
  href?: string;
}

export interface TokenBadgeHandlers {
  taskBadgeInfo?: ScratchpadTaskRef;
  openBadgeId?: string | null;
  openBadgeManagesFocus?: boolean;
  onBadgeOpenChange?: (id: string | null, manageFocus?: boolean) => void;
  onViewTask?: (task: ScratchpadTaskRef) => void;
  taskCardPresentation?: 'popover' | 'sheet';
}

interface TokenBadgeProps extends TokenBadgeHandlers {
  id: string;
  tokenKey: TokenKey;
}

export function TokenBadge({
  id,
  tokenKey,
  taskBadgeInfo,
  openBadgeId,
  openBadgeManagesFocus,
  onBadgeOpenChange,
  onViewTask,
  taskCardPresentation = 'popover',
}: TokenBadgeProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const token = BADGE_TOKENS[tokenKey];
  const open = openBadgeId === id;
  const manageFocus = open && openBadgeManagesFocus === true;
  // Only `task` tokens reveal a popover, and only when info + handler are supplied.
  const interactive =
    tokenKey === 'task' &&
    taskBadgeInfo !== undefined &&
    onBadgeOpenChange !== undefined;

  const viewTask = onViewTask
    ? (task: ScratchpadTaskRef) => {
        ref.current?.focus();
        onBadgeOpenChange?.(null);
        onViewTask(task);
      }
    : undefined;

  if (!interactive) {
    return (
      <span className={cn(styles.tokenBadge, token.className)}>
        {token.label}
      </span>
    );
  }

  if (taskCardPresentation === 'sheet') {
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
          aria-label={`Linked task ${taskBadgeInfo.id}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            onBadgeOpenChange(open ? null : id, true);
          }}
        >
          {token.label}
        </button>
        <BottomSheet
          open={open}
          onClose={() => onBadgeOpenChange(null)}
          aria-label={`Linked task ${taskBadgeInfo.id}`}
        >
          <LinkedTaskCard taskRef={taskBadgeInfo} bare onViewTask={viewTask} />
        </BottomSheet>
      </>
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
        aria-label={`Linked task ${taskBadgeInfo.id}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onBadgeOpenChange(id, true);
        }}
        onMouseEnter={() => {
          if (!manageFocus) onBadgeOpenChange(id);
        }}
        onMouseLeave={() => {
          if (!manageFocus) onBadgeOpenChange(null);
        }}
      >
        {token.label}
      </button>
      <Popover
        open={open}
        onOpenChange={(next) => onBadgeOpenChange(next ? id : null)}
        anchorRef={ref}
        manageFocus={manageFocus}
        placement="bottom-start"
        aria-label={`Linked task ${taskBadgeInfo.id}`}
      >
        <div
          onMouseEnter={() => {
            if (!manageFocus) onBadgeOpenChange(id);
          }}
          onMouseLeave={() => {
            if (!manageFocus) onBadgeOpenChange(null);
          }}
        >
          <LinkedTaskCard taskRef={taskBadgeInfo} onViewTask={viewTask} />
        </div>
      </Popover>
    </>
  );
}

interface ViewTaskActionProps {
  taskRef: ScratchpadTaskRef;
  onViewTask?: (task: ScratchpadTaskRef) => void;
}

function ViewTaskAction({ taskRef, onViewTask }: ViewTaskActionProps) {
  if (taskRef.href) {
    return (
      <a
        className={styles.viewTask}
        href={sanitizeHref(taskRef.href)}
        onClick={
          onViewTask &&
          ((e) => {
            // Modifier clicks are new-tab intents; leave them to the browser.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onViewTask(taskRef);
          })
        }
      >
        View Task
      </a>
    );
  }

  if (!onViewTask) return null;

  return (
    <button
      type="button"
      className={styles.viewTask}
      onClick={() => onViewTask(taskRef)}
    >
      View Task
    </button>
  );
}

interface LinkedTaskCardProps {
  taskRef: ScratchpadTaskRef;
  bare?: boolean;
  onViewTask?: (task: ScratchpadTaskRef) => void;
}

export function LinkedTaskCard({
  taskRef,
  bare = false,
  onViewTask,
}: LinkedTaskCardProps) {
  return (
    <div className={cn(styles.taskCard, bare && styles.taskCardBare)}>
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
        <ViewTaskAction taskRef={taskRef} onViewTask={onViewTask} />
      </div>
    </div>
  );
}
