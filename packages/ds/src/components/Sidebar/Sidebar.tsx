import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Sidebar.module.css';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ header, footer, children, className, ...rest }, ref) => {
    return (
      <aside
        ref={ref}
        aria-label="Sidebar navigation"
        className={cn(styles.sidebar, className)}
        {...rest}
      >
        {header && <div className={styles.header}>{header}</div>}
        <nav className={styles.nav}>{children}</nav>
        {footer && <div className={styles.footer}>{footer}</div>}
      </aside>
    );
  },
);

Sidebar.displayName = 'Sidebar';
