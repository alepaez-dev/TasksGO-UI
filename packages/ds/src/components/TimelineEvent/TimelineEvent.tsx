import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './TimelineEvent.module.css';

type TimelineEventVariant = 'standalone' | 'nested';

type TimelineEventPinState =
  | { pinned: true; onPin?: never }
  | {
      pinned?: false;
      onPin?: () => void;
    };

export type TimelineEventProps = TimelineEventPinState &
  Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
    icon: IconName;
    timestamp: ReactNode;
    variant?: TimelineEventVariant;
    muted?: boolean;
    children: ReactNode;
  };

const variantClass: Record<TimelineEventVariant, string> = {
  standalone: styles.standalone,
  nested: styles.nested,
};

export const TimelineEvent = forwardRef<HTMLLIElement, TimelineEventProps>(
  (
    {
      icon,
      timestamp,
      variant = 'standalone',
      muted = false,
      pinned = false,
      onPin,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const contentId = useId();
    const pinLabelId = useId();

    return (
      <li
        ref={ref}
        tabIndex={pinned ? -1 : undefined}
        className={cn(
          styles.row,
          variantClass[variant],
          muted && styles.muted,
          pinned && styles.pinned,
          className,
        )}
        {...rest}
      >
        {variant === 'standalone' && (
          <span className={styles.marker} aria-hidden="true" />
        )}
        {pinned && <span className={styles.srOnly}>Pinned</span>}
        <Icon name={icon} size="xs" className={styles.icon} />
        <span className={styles.body}>
          <span id={contentId} className={styles.content}>
            {children}
          </span>
          <span className={styles.timestamp}>
            <span className={styles.separator} aria-hidden="true">
              ·
            </span>
            {timestamp}
          </span>
          {onPin && (
            <button
              type="button"
              className={styles.pin}
              onClick={(event) => {
                event.stopPropagation();
                onPin();
              }}
              onKeyDown={(event) => event.stopPropagation()}
              aria-labelledby={`${pinLabelId} ${contentId}`}
            >
              <Icon name="push_pin_filled" size="xs" />
              <span id={pinLabelId}>Pin</span>
            </button>
          )}
        </span>
      </li>
    );
  },
);

TimelineEvent.displayName = 'TimelineEvent';
