import { forwardRef, type DetailsHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';
import styles from './TaskSection.module.css';

type BadgeVariant = 'default' | 'progress' | 'todo' | 'done';

export interface TaskSectionProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  title: string;
  count?: number;
  badgeVariant?: BadgeVariant;
}

export const TaskSection = forwardRef<HTMLDetailsElement, TaskSectionProps>(
  (
    { title, count, badgeVariant = 'default', className, children, ...rest },
    ref,
  ) => {
    return (
      <details
        ref={ref}
        className={cn(styles.taskSection, className)}
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
  },
);

TaskSection.displayName = 'TaskSection';
