import { forwardRef, type HTMLAttributes, type ChangeEvent } from 'react';
import { Checkbox } from '../Checkbox';
import { Badge } from '../Badge';
import { RefLabel } from '../RefLabel';
import { PriorityLabel } from '../PriorityLabel';
import { TicketId } from '../TicketId';
import { DateCell } from '../DateCell';
import { cn } from '../../utils/cn';
import styles from './TaskRow.module.css';

type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
type BadgeVariant = 'default' | 'progress' | 'todo' | 'done';
type RefLabelVariant = 'attachment' | 'doc' | 'general';

export interface TaskRowBadge {
  label: string;
  variant?: BadgeVariant;
}

export interface TaskRowRef {
  label: string;
  variant?: RefLabelVariant;
  icon?: string;
}

export interface TaskRowDate {
  label: string;
  dateTime: string;
  urgent?: boolean;
}

export interface TaskRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  completed?: boolean;
  checked?: boolean;
  onCheckedChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  priority?: PriorityLevel;
  ticketId?: string;
  date?: TaskRowDate;
  badge?: TaskRowBadge;
  refs?: TaskRowRef[];
}

export const TaskRow = forwardRef<HTMLDivElement, TaskRowProps>(
  (
    {
      title,
      completed = false,
      checked,
      onCheckedChange,
      priority,
      ticketId,
      date,
      badge,
      refs,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(
      styles.taskRow,
      completed && styles.completed,
      className,
    );
    const checkboxVariant = completed ? 'completed' : 'default';
    const hasRefs = refs && refs.length > 0;

    return (
      <div ref={ref} className={classes} {...rest}>
        <Checkbox
          variant={checkboxVariant}
          checked={checked}
          onChange={onCheckedChange}
          aria-label={`Toggle ${title}`}
        />
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{title}</span>
            {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
          </div>
          {hasRefs && (
            <div className={styles.refs}>
              {refs.map((r, i) => (
                <RefLabel key={i} variant={r.variant} icon={r.icon}>
                  {r.label}
                </RefLabel>
              ))}
            </div>
          )}
        </div>
        <div className={styles.meta}>
          {priority && (
            <div className={styles.priorityCol}>
              <PriorityLabel priority={priority} />
            </div>
          )}
          {ticketId && (
            <div className={styles.ticketCol}>
              <TicketId>{ticketId}</TicketId>
            </div>
          )}
          {date && (
            <div className={styles.dateCol}>
              <DateCell
                date={date.label}
                dateTime={date.dateTime}
                urgent={date.urgent}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

TaskRow.displayName = 'TaskRow';
