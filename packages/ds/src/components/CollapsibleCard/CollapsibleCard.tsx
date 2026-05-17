import { forwardRef, type DetailsHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './CollapsibleCard.module.css';

type CollapsibleCardVariant = 'default' | 'subtle';

export interface CollapsibleCardProps extends Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'open'
> {
  header: ReactNode;
  variant?: CollapsibleCardVariant;
  defaultOpen?: boolean;
}

export const CollapsibleCard = forwardRef<
  HTMLDetailsElement,
  CollapsibleCardProps
>(
  (
    { header, variant = 'default', defaultOpen, children, className, ...rest },
    ref,
  ) => {
    return (
      <details
        ref={ref}
        open={defaultOpen}
        className={cn(styles.card, styles[variant], className)}
        {...rest}
      >
        <summary className={styles.summary}>
          <span className={styles.headerSlot}>{header}</span>
          <Icon name="expand_more" size="sm" className={styles.chevron} />
        </summary>
        <div className={styles.body}>{children}</div>
      </details>
    );
  },
);

CollapsibleCard.displayName = 'CollapsibleCard';
