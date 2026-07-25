import {
  forwardRef,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './ActivityRow.module.css';

type ActivityTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const toneClass: Record<ActivityTone, string> = {
  neutral: styles.toneNeutral,
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
};

type ActivityRowLeading =
  | { icon: IconName; tone?: ActivityTone; leading?: never }
  | { leading: ReactNode; icon?: never; tone?: never };

export type ActivityRowProps = ActivityRowLeading &
  Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
    meta?: readonly ReactNode[];
    trailing?: ReactNode;
    children: ReactNode;
  };

export const ActivityRow = forwardRef<HTMLLIElement, ActivityRowProps>(
  (
    { icon, tone, leading, meta, trailing, className, children, ...rest },
    ref,
  ) => {
    const hasMeta = meta !== undefined && meta.length > 0;
    const leadingNode =
      leading !== undefined ? (
        leading
      ) : icon !== undefined ? (
        <Icon name={icon} size="sm" />
      ) : null;

    return (
      <li ref={ref} className={cn(styles.row, className)} {...rest}>
        <span className={cn(styles.icon, toneClass[tone ?? 'neutral'])}>
          {leadingNode}
        </span>
        <span
          className={cn(
            styles.primary,
            typeof children === 'string' && styles.primaryTruncate,
          )}
        >
          {children}
        </span>
        {hasMeta && (
          <span className={styles.meta}>
            {meta.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className={styles.separator} aria-hidden="true">
                    ·
                  </span>
                )}
                {item}
              </Fragment>
            ))}
          </span>
        )}
        {trailing && (
          <span
            className={cn(styles.trailing, !hasMeta && styles.trailingSingle)}
          >
            {trailing}
          </span>
        )}
      </li>
    );
  },
);

ActivityRow.displayName = 'ActivityRow';
