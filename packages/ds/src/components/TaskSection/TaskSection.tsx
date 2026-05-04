import { forwardRef, type DetailsHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';
import styles from './TaskSection.module.css';

type BadgeVariant = 'default' | 'progress' | 'todo' | 'done';

export interface TaskSectionProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  title: string;
  count?: number;
  badgeVariant?: BadgeVariant;
  trailing?: ReactNode;
  compact?: boolean;
}

export const TaskSection = forwardRef<HTMLDetailsElement, TaskSectionProps>(
  (
    {
      title,
      count,
      badgeVariant = 'default',
      trailing,
      compact = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const details = (
      <details
        ref={ref}
        className={cn(styles.taskSection, className)}
        aria-label={title}
        {...rest}
      >
        <summary className={styles.summary}>
          <Icon name="chevron_right" size="sm" className={styles.chevron} />
          <span className={styles.title}>{title}</span>
          {count !== undefined && <Badge variant={badgeVariant}>{count}</Badge>}
        </summary>
        <div className={styles.content}>{children}</div>
      </details>
    );

    if (!trailing) return details;

    return (
      <div className={cn(styles.wrapper, compact && styles.compact)}>
        {details}
        <div className={styles.trailing}>{trailing}</div>
      </div>
    );
  },
);

TaskSection.displayName = 'TaskSection';
