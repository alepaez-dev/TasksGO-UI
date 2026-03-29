import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './DateCell.module.css';

export interface DateCellProps extends HTMLAttributes<HTMLTimeElement> {
  /** Display label — e.g. "Today", "Mar 15", "2 days ago" */
  date: string;
  urgent?: boolean;
  dateTime: string;
}

export const DateCell = forwardRef<HTMLTimeElement, DateCellProps>(
  ({ date, urgent = false, dateTime, className, ...rest }, ref) => {
    const classes = cn(styles.dateCell, urgent && styles.urgent, className);
    return (
      <time ref={ref} dateTime={dateTime} className={classes} {...rest}>
        {date}
      </time>
    );
  },
);

DateCell.displayName = 'DateCell';
