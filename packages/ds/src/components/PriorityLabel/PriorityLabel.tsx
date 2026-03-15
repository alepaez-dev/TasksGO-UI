import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './PriorityLabel.module.css';

type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface PriorityLabelProps extends HTMLAttributes<HTMLSpanElement> {
  priority: PriorityLevel;
}

export const PriorityLabel = forwardRef<HTMLSpanElement, PriorityLabelProps>(
  ({ priority, className, ...rest }, ref) => {
    const classes = cn(styles.priorityLabel, styles[priority], className);
    return (
      <span ref={ref} className={classes} {...rest}>
        {priority}
      </span>
    );
  },
);

PriorityLabel.displayName = 'PriorityLabel';
