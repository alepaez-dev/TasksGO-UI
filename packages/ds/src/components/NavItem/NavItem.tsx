import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import styles from './NavItem.module.css';

type NavItemSize = 'sm' | 'md';

export interface NavItemProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  size?: NavItemSize;
}

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  (
    { icon, label, href, active = false, size = 'md', className, ...rest },
    ref,
  ) => {
    const classes = cn(
      styles.navItem,
      styles[size],
      active && styles.active,
      className,
    );

    return (
      <a
        ref={ref}
        href={sanitizeHref(href)}
        className={classes}
        aria-current={active ? 'page' : undefined}
        {...rest}
      >
        <Icon name={icon} size={size} />
        <span>{label}</span>
      </a>
    );
  },
);

NavItem.displayName = 'NavItem';
