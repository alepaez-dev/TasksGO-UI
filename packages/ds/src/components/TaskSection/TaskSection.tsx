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
  /** Rendered outside `<details>` via absolute positioning.
   *  The forwarded ref always points to the `<details>` element. */
  trailing?: ReactNode;
}

export const TaskSection = forwardRef<HTMLDetailsElement, TaskSectionProps>(
  (
    {
      title,
      count,
      badgeVariant = 'default',
      trailing,
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
      <div className={styles.wrapper}>
        {details}
        <div className={styles.trailing}>{trailing}</div>
      </div>
    );
  },
);

TaskSection.displayName = 'TaskSection';
