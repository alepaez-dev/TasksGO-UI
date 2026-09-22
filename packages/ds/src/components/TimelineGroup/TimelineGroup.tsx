import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './TimelineGroup.module.css';

type TimelineGroupMoreState =
  | { moreLabel: ReactNode; onMoreToggle: () => void; moreExpanded: boolean }
  | { moreLabel?: never; onMoreToggle?: never; moreExpanded?: never };

export type TimelineGroupProps = TimelineGroupMoreState &
  Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
    /**
     * Drives the badge, and nothing else. Actions belonging to whoever the run
     * is attributed to: a person's own updates excluding system extras, or
     * every row of a system-only run — `countActions(group)` computes it.
     */
    count: number;
    /**
     * Prose for the pill, e.g. "Jordan D. performed 2 updates". Expected to
     * restate `count`: the badge is hidden from assistive tech to avoid
     * announcing the number twice, so this is where the count is spoken.
     */
    summary: ReactNode;
    /** Fields and timestamp, e.g. "· labels, sprint · 1d 2h ago" — rendered smaller, and truncates before the summary does. */
    meta?: ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Search only, e.g. "1 of 2 match". */
    matchLabel?: ReactNode;
    children: ReactNode;
  };

export const TimelineGroup = forwardRef<HTMLLIElement, TimelineGroupProps>(
  (
    {
      count,
      summary,
      meta,
      open,
      onOpenChange,
      matchLabel,
      moreLabel,
      onMoreToggle,
      moreExpanded,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const itemsId = useId();
    const toggleRef = useRef<HTMLButtonElement>(null);
    const wasOpen = useRef(open);

    useEffect(() => {
      const justCollapsed = wasOpen.current && !open;
      wasOpen.current = open;
      if (justCollapsed && document.activeElement === document.body) {
        toggleRef.current?.focus();
      }
    }, [open]);

    return (
      <li ref={ref} className={cn(styles.group, className)} {...rest}>
        <button
          ref={toggleRef}
          type="button"
          className={cn(styles.toggle, open && styles.toggleOpen)}
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-controls={itemsId}
        >
          <span className={styles.count} aria-hidden="true">
            {count}
          </span>
          <span className={styles.summary}>{summary}</span>
          {meta !== undefined && <span className={styles.meta}>{meta}</span>}
          <Icon name="expand_more" size="xs" className={styles.chevron} />
          {matchLabel !== undefined && (
            <span className={styles.match}>{matchLabel}</span>
          )}
        </button>
        {open && (
          <ul id={itemsId} className={styles.items}>
            {children}
            {moreLabel !== undefined && (
              <li className={styles.moreRow}>
                <button
                  type="button"
                  className={styles.more}
                  onClick={onMoreToggle}
                  aria-expanded={moreExpanded}
                >
                  <Icon
                    name="expand_more"
                    size="xs"
                    className={cn(
                      styles.chevron,
                      moreExpanded && styles.moreExpanded,
                    )}
                  />
                  {moreLabel}
                </button>
              </li>
            )}
          </ul>
        )}
      </li>
    );
  },
);

TimelineGroup.displayName = 'TimelineGroup';
