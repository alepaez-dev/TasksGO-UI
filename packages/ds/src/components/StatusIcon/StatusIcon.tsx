import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { GLYPH_CENTER, GLYPH_SIZE, piePath } from './piePath';
import styles from './StatusIcon.module.css';

export type TicketStatus =
  | 'backlog'
  | 'todo'
  | 'in-progress'
  | 'in-review'
  | 'ready-for-qa'
  | 'in-qa'
  | 'blocked'
  | 'done';

type StatusIconSize = 'sm' | 'md';

export interface StatusIconProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  status: TicketStatus;
  label: string;
  size?: StatusIconSize;
}

const STATUS_CLASS: Record<TicketStatus, string> = {
  backlog: styles.backlog,
  todo: styles.todo,
  'in-progress': styles.inProgress,
  'in-review': styles.inReview,
  'ready-for-qa': styles.readyForQa,
  'in-qa': styles.inQa,
  blocked: styles.blocked,
  done: styles.done,
};

const SLICE_FRACTION: Partial<Record<TicketStatus, number>> = {
  'in-progress': 0.4,
  'in-review': 0.6,
  'ready-for-qa': 0.75,
  'in-qa': 0.9,
};

function StatusGlyph({ status }: { status: TicketStatus }) {
  if (status === 'done') {
    return (
      <>
        <circle
          cx={GLYPH_CENTER}
          cy={GLYPH_CENTER}
          r="8"
          className={styles.fill}
        />
        <path d="M5.6 9.2l2.3 2.3 4.5-4.6" className={styles.check} />
      </>
    );
  }

  const fraction = SLICE_FRACTION[status];

  return (
    <>
      <circle
        cx={GLYPH_CENTER}
        cy={GLYPH_CENTER}
        r="7"
        className={cn(styles.ring, status === 'backlog' && styles.dashed)}
      />
      {fraction !== undefined && (
        <path d={piePath(fraction)} className={styles.fill} />
      )}
      {status === 'blocked' && (
        <rect
          x="5"
          y="8.1"
          width="8"
          height="1.8"
          rx="0.9"
          className={styles.fill}
        />
      )}
    </>
  );
}

export const StatusIcon = forwardRef<HTMLSpanElement, StatusIconProps>(
  ({ status, label, size = 'md', className, ...rest }, ref) => {
    const classes = cn(
      styles.statusIcon,
      styles[size],
      STATUS_CLASS[status],
      className,
    );

    return (
      <span
        ref={ref}
        role="img"
        aria-label={label}
        className={classes}
        {...rest}
      >
        <svg
          viewBox={`0 0 ${GLYPH_SIZE} ${GLYPH_SIZE}`}
          aria-hidden="true"
          focusable="false"
          className={styles.svg}
        >
          <StatusGlyph status={status} />
        </svg>
      </span>
    );
  },
);

StatusIcon.displayName = 'StatusIcon';
