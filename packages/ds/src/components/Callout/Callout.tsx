import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Callout.module.css';

type CalloutVariant = 'positive' | 'critical' | 'warning' | 'neutral';

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  children: ReactNode;
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = 'neutral', className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.callout, styles[variant], className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Callout.displayName = 'Callout';
