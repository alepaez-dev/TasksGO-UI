import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import styles from './ExternalLink.module.css';

type ExternalLinkSize = 'sm' | 'md';

const ICON_SIZE = { sm: 'xs', md: 'sm' } as const;

export interface ExternalLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'target' | 'rel'
> {
  href: string;
  icon?: IconName;
  showExternalIcon?: boolean;
  size?: ExternalLinkSize;
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  (
    {
      href,
      icon,
      showExternalIcon = true,
      size = 'md',
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <a
      ref={ref}
      className={cn(styles.externalLink, styles[size], className)}
      {...rest}
      href={sanitizeHref(href)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon && (
        <Icon name={icon} size={ICON_SIZE[size]} className={styles.icon} />
      )}
      <span className={styles.label}>{children}</span>
      {showExternalIcon && (
        <Icon
          name="open_in_new"
          size={ICON_SIZE[size]}
          className={styles.icon}
        />
      )}
      <span className={styles.srOnly}> (opens in a new tab)</span>
    </a>
  ),
);

ExternalLink.displayName = 'ExternalLink';
