import { forwardRef, type HTMLAttributes } from 'react';
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
type TaskRowLayout = 'default' | 'compact';

export type TaskRowBadge = Readonly<{
  label: string;
  variant?: BadgeVariant;
}>;

export type TaskRowRef = Readonly<{
  label: string;
  variant?: RefLabelVariant;
  icon?: string;
}>;

export type TaskRowDate = Readonly<{
  label: string;
  dateTime: string;
  urgent?: boolean;
}>;

export interface TaskRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  completed?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  priority?: PriorityLevel;
  ticketId?: string;
  date?: TaskRowDate;
  badge?: TaskRowBadge;
  refs?: TaskRowRef[];
  layout?: TaskRowLayout;
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
      layout = 'default',
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(
      styles.taskRow,
      styles[layout],
      completed && styles.completed,
      className,
    );
    const checkboxVariant = completed ? 'completed' : 'default';
    return (
      <div ref={ref} className={classes} {...rest}>
        <div className={styles.checkbox}>
          <Checkbox
            variant={checkboxVariant}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            aria-label={`Toggle ${title}`}
          />
        </div>
        <div className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          {badge && (
            <div className={styles.badge}>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
          )}
        </div>
        {refs && refs.length > 0 && (
          <div className={styles.refs}>
            {refs.map((r, i) => (
              <RefLabel key={i} variant={r.variant} icon={r.icon}>
                {r.label}
              </RefLabel>
            ))}
          </div>
        )}
        {priority && (
          <div className={styles.priority}>
            <PriorityLabel priority={priority} />
          </div>
        )}
        <div className={styles.info}>
          {ticketId && (
            <div className={styles.ticket}>
              <TicketId>{ticketId}</TicketId>
            </div>
          )}
          {ticketId && date && (
            <span className={styles.separator} aria-hidden="true" />
          )}
          {date && (
            <div className={styles.date}>
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
