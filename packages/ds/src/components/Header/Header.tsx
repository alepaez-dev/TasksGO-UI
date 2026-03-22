import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Header.module.css';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ left, center, right, className, ...rest }, ref) => {
    return (
      <header ref={ref} className={cn(styles.header, className)} {...rest}>
        <div className={styles.content}>
          {left && <div className={styles.left}>{left}</div>}
          {center && <div className={styles.center}>{center}</div>}
        </div>
        {right && <div className={styles.right}>{right}</div>}
      </header>
    );
  },
);

Header.displayName = 'Header';
