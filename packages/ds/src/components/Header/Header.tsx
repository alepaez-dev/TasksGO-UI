import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Header.module.css';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  compact?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ left, center, right, compact = false, className, ...rest }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(styles.header, compact && styles.compact, className)}
        {...rest}
      >
        <div className={styles.content}>
          {left && <div className={styles.left}>{left}</div>}
          {center && !compact && <div className={styles.center}>{center}</div>}
        </div>
        {/* TODO: replace title with tap-to-reveal Tooltip component for mobile */}
        {center && compact && (
          <div
            className={styles.centerAbsolute}
            title={typeof center === 'string' ? center : undefined}
          >
            {center}
          </div>
        )}
        {right && <div className={styles.right}>{right}</div>}
      </header>
    );
  },
);

Header.displayName = 'Header';
