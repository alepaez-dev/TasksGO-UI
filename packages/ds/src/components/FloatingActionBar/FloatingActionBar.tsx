import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './FloatingActionBar.module.css';

export interface FloatingActionBarProps extends HTMLAttributes<HTMLDivElement> {
  'aria-label': string;
}

export const FloatingActionBar = forwardRef<
  HTMLDivElement,
  FloatingActionBarProps
>(({ className, children, ...rest }, ref) => {
  return (
    <div className={styles.positioner}>
      <div
        ref={ref}
        role="group"
        className={cn(styles.bar, className)}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
});

FloatingActionBar.displayName = 'FloatingActionBar';
