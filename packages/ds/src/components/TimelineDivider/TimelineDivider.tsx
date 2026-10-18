import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import type { ActivityRelativeDay } from '../../utils/activity/types';
import styles from './TimelineDivider.module.css';

// h1 is reserved for page titles; a day heading is a subsection of the feed.
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

type TimelineDividerVariant =
  | {
      type: 'dayDivider';
      /** ISO timestamp of the first node under this heading. */
      at: string;
      relative: ActivityRelativeDay | null;
      /** False when `at` is in a different year than now, which names the year. */
      sameYear?: boolean;
      /** Depth of the day heading in the page's outline. */
      headingLevel?: HeadingLevel;
      durationMs?: never;
    }
  | {
      type: 'gapDivider';
      durationMs: number;
      at?: never;
      relative?: never;
      sameYear?: never;
      headingLevel?: never;
    };

export type TimelineDividerProps = TimelineDividerVariant &
  Omit<HTMLAttributes<HTMLLIElement>, 'children' | 'type'> & {
    /** Overrides the host locale used to format a day heading. */
    locale?: string;
  };

const RELATIVE_LABELS = {
  today: 'Today',
  yesterday: 'Yesterday',
} as const;

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

function formatGap(durationMs: number): string {
  const ms = Math.abs(durationMs);
  const hours = Math.floor(ms / MS_PER_HOUR);
  if (hours >= 1) return `${hours} hour gap`;
  const minutes = Math.max(1, Math.floor(ms / MS_PER_MINUTE));
  return `${minutes} minute gap`;
}

const DAY_FORMAT = { month: 'short', day: 'numeric' } as const;
const DAY_WITH_YEAR_FORMAT = { ...DAY_FORMAT, year: 'numeric' } as const;

function formatDay(
  at: string,
  locale: string | undefined,
  sameYear: boolean,
): string {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return at;
  const format = sameYear ? DAY_FORMAT : DAY_WITH_YEAR_FORMAT;
  try {
    return new Intl.DateTimeFormat(locale, format).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, format).format(date);
  }
}

export const TimelineDivider = forwardRef<HTMLLIElement, TimelineDividerProps>(
  (
    {
      type,
      at,
      relative,
      sameYear = true,
      headingLevel = 3,
      durationMs,
      locale,
      className,
      ...rest
    },
    ref,
  ) => {
    const isGap = type === 'gapDivider';
    const label = isGap
      ? formatGap(durationMs)
      : [
          formatDay(at, locale, sameYear),
          relative ? RELATIVE_LABELS[relative] : null,
        ]
          .filter(Boolean)
          .join(' · ');

    const Heading = `h${headingLevel}` as const;

    return (
      <li
        ref={ref}
        className={cn(
          styles.divider,
          isGap ? styles.gap : styles.dayDivider,
          className,
        )}
        {...rest}
      >
        {isGap ? (
          <span className={cn(styles.label, styles.gapLabel)}>{label}</span>
        ) : (
          <Heading className={cn(styles.label, styles.dayLabel)}>
            {label}
          </Heading>
        )}
      </li>
    );
  },
);

TimelineDivider.displayName = 'TimelineDivider';
