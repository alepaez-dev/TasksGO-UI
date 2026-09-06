import {
  forwardRef,
  useEffect,
  useRef,
  type DetailsHTMLAttributes,
  type ReactNode,
} from 'react';
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CollapsibleCard = forwardRef<
  HTMLDetailsElement,
  CollapsibleCardProps
>(
  (
    {
      header,
      variant = 'default',
      defaultOpen,
      open,
      onOpenChange,
      onToggle,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const detailsRef = useRef<HTMLDetailsElement>(null);

    function setRefs(node: HTMLDetailsElement | null) {
      detailsRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    }

    useEffect(() => {
      const el = detailsRef.current;
      if (!el || open == null) return;
      if (el.open !== open) el.open = open;
    }, [open]);

    return (
      <details
        ref={setRefs}
        open={open ?? defaultOpen}
        className={cn(styles.card, styles[variant], className)}
        onToggle={(event) => {
          onOpenChange?.(event.currentTarget.open);
          onToggle?.(event);
        }}
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
