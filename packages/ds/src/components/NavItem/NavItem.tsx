import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import styles from './NavItem.module.css';

type NavItemSize = 'sm' | 'md';
type NavItemOrientation = 'horizontal' | 'vertical';

interface NavItemCommonProps {
  label: string;
  active?: boolean;
  size?: NavItemSize;
  orientation?: NavItemOrientation;
  count?: number;
}

type NavItemGlyphProps =
  | { icon: IconName; activeIcon?: IconName; leading?: never }
  | { leading: ReactNode; icon?: never; activeIcon?: never };

type NavItemLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string;
};

type NavItemButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  href?: undefined;
  type?: never;
};

export type NavItemProps = NavItemCommonProps &
  NavItemGlyphProps &
  (NavItemLinkProps | NavItemButtonProps);

export const NavItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  NavItemProps
>(
  (
    {
      icon,
      activeIcon,
      leading,
      label,
      href,
      active = false,
      size = 'md',
      orientation = 'horizontal',
      count,
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
      count === 0 && styles.zero,
      className,
    );

    const content = (
      <>
        {leading !== undefined ? (
          <span className={cn(styles.leading, styles.glyph)} aria-hidden="true">
            {leading}
          </span>
        ) : (
          resolvedIcon && (
            <Icon name={resolvedIcon} size={size} className={styles.glyph} />
          )
        )}
        <span className={orientation === 'vertical' ? styles.label : undefined}>
          {label}
        </span>
        {count !== undefined && (
          <>
            {' '}
            <span className={styles.count}>{count}</span>
          </>
        )}
      </>
    );

    if (href !== undefined) {
      const { target, rel, ...anchorRest } = rest as Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        'href'
      >;
      const relTokens = rel?.split(/\s+/).filter(Boolean) ?? [];
      const safeRel =
        target === '_blank' && !relTokens.includes('noopener')
          ? [...relTokens, 'noopener'].join(' ')
          : rel;

      return (
        <a
          ref={ref as ForwardedRef<HTMLAnchorElement>}
          href={sanitizeHref(href)}
          className={classes}
          aria-current={active ? 'page' : undefined}
          target={target}
          rel={safeRel}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as ForwardedRef<HTMLButtonElement>}
        className={cn(styles.button, classes)}
        aria-current={active ? 'true' : undefined}
        {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>)}
        type="button"
      >
        {content}
      </button>
    );
  },
);

NavItem.displayName = 'NavItem';
