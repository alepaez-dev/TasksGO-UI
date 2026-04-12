import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import styles from './NavItem.module.css';

type NavItemSize = 'sm' | 'md';
type NavItemOrientation = 'horizontal' | 'vertical';

export interface NavItemProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  icon: IconName;
  activeIcon?: IconName;
  label: string;
  href: string;
  active?: boolean;
  size?: NavItemSize;
  orientation?: NavItemOrientation;
}

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  (
    {
      icon,
      activeIcon,
      label,
      href,
      active = false,
      size = 'md',
      orientation = 'horizontal',
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedIcon = active && activeIcon ? activeIcon : icon;
    const classes = cn(
      styles.navItem,
      styles[size],
      orientation === 'vertical' && styles.vertical,
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
        <Icon name={resolvedIcon} size={size} />
        <span className={orientation === 'vertical' ? styles.label : undefined}>
          {label}
        </span>
      </a>
    );
  },
);

NavItem.displayName = 'NavItem';
