import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './RecentTaskList.module.css';

export interface RecentTaskItem {
  ticketId: string;
  title: string;
  timeAgo: string;
}

export interface RecentTaskListProps extends HTMLAttributes<HTMLUListElement> {
  items: readonly RecentTaskItem[];
}

export const RecentTaskList = forwardRef<HTMLUListElement, RecentTaskListProps>(
  ({ items, className, ...rest }, ref) => (
    <ul ref={ref} className={cn(styles.list, className)} {...rest}>
      {items.map((item) => (
        <li key={item.ticketId} className={styles.row}>
          <div className={styles.content}>
            <span className={styles.ticketId}>{item.ticketId}</span>
            <span className={styles.title}>{item.title}</span>
          </div>
          <span className={styles.time}>{item.timeAgo}</span>
        </li>
      ))}
    </ul>
  ),
);

RecentTaskList.displayName = 'RecentTaskList';
