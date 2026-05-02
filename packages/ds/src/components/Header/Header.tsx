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
        {/* center lives inside .content in normal mode (in-flow),
            but outside it in compact mode so .content can shrink.
            Compact + right: absolute-center the title against an
            unknown-width right slot. Compact + no right: full-width
            for search takeover. */}
        <div className={styles.content} data-slot="content">
          {left && (
            <div className={styles.left} data-slot="left">
              {left}
            </div>
          )}
          {center && !compact && (
            <div className={styles.center} data-slot="center">
              {center}
            </div>
          )}
        </div>
        {center && compact && right && (
          <div
            className={styles.centerAbsolute}
            data-slot="center-absolute"
            title={typeof center === 'string' ? center : undefined}
          >
            {center}
          </div>
        )}
        {center && compact && !right && (
          <div className={styles.centerFull} data-slot="center-full">
            {center}
          </div>
        )}
        {right && (
          <div className={styles.right} data-slot="right">
            {right}
          </div>
        )}
      </header>
    );
  },
);

Header.displayName = 'Header';
