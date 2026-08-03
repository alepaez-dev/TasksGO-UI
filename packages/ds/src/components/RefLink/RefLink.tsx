import { forwardRef, type HTMLAttributes } from 'react';
import { ExternalLink } from '../ExternalLink';
import { IconButton } from '../IconButton';
import { cn } from '../../utils/cn';
import type { IconName } from '../../icons';
import styles from './RefLink.module.css';

export interface RefLinkProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onCopy'
> {
  value: string;
  href: string;
  icon?: IconName;
  boxed?: boolean;
  copied?: boolean;
  copiedLabel?: string;
  onCopy?: () => void;
  copyAriaLabel?: string;
}

export const RefLink = forwardRef<HTMLDivElement, RefLinkProps>(
  (
    {
      value,
      href,
      icon,
      boxed = false,
      copied = false,
      copiedLabel = 'Copied',
      onCopy,
      copyAriaLabel = 'Copy',
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(styles.refLink, boxed && styles.boxed, className)}
      {...rest}
    >
      {copied && (
        <span className={styles.copiedToast} aria-hidden="true">
          {copiedLabel}
        </span>
      )}
      <span role="status" className={styles.srOnly}>
        {copied ? copiedLabel : ''}
      </span>
      <ExternalLink
        href={href}
        icon={icon}
        size="sm"
        className={cn(styles.link, copied && styles.linkCopied)}
        title={value}
      >
        {value}
      </ExternalLink>
      {onCopy && (
        <IconButton
          icon={copied ? 'check' : 'content_copy'}
          size="sm"
          onClick={onCopy}
          aria-label={copyAriaLabel}
          className={styles.copyButton}
        />
      )}
    </div>
  ),
);

RefLink.displayName = 'RefLink';
