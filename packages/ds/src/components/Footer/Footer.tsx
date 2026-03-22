import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Footer.module.css';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  left?: ReactNode;
  right?: ReactNode;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ left, right, className, ...rest }, ref) => {
    return (
      <footer ref={ref} className={cn(styles.footer, className)} {...rest}>
        {left && <div className={styles.left}>{left}</div>}
        {right && <div className={styles.right}>{right}</div>}
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
