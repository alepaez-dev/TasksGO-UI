import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'progress' | 'todo' | 'done';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, children, ...rest }, ref) => {
    const classes = cn(styles.badge, styles[variant], className);

    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
