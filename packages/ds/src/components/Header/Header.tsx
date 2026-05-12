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
        {/* In compact mode, center is absolute-positioned outside .content
            so the title stays optically centered against an unknown-width
            right slot while .content shrinks to fit left only. */}
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
        {center && compact && (
          <div
            className={styles.centerAbsolute}
            data-slot="center-absolute"
            title={typeof center === 'string' ? center : undefined}
          >
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
