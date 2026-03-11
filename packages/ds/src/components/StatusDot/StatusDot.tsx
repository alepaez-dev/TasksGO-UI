import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './StatusDot.module.css';

type StatusDotVariant =
  | 'active'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusDotVariant;
  label: string;
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ variant = 'active', label, className, ...rest }, ref) => {
    const classes = cn(styles.dot, styles[variant], className);

    return (
      <span
        ref={ref}
        role="img"
        aria-label={label}
        className={classes}
        {...rest}
      />
    );
  },
);

StatusDot.displayName = 'StatusDot';
