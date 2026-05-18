import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './ChecklistRow.module.css';

type ChecklistStatus = 'passed' | 'failed' | 'pending';

export interface ChecklistRowProps extends HTMLAttributes<HTMLDivElement> {
  status: ChecklistStatus;
  label: string;
  meta?: ReactNode;
}

const statusAriaLabel: Record<ChecklistStatus, string> = {
  passed: 'Passed',
  failed: 'Failed',
  pending: 'Pending',
};

export const ChecklistRow = forwardRef<HTMLDivElement, ChecklistRowProps>(
  ({ status, label, meta, onClick, onKeyDown, className, ...rest }, ref) => {
    const clickable = onClick != null;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (!clickable) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
      }
    };

    return (
      <div
        ref={ref}
        {...rest}
        className={cn(styles.row, clickable && styles.clickable, className)}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
      >
        <span
          className={cn(styles.statusBadge, styles[status])}
          aria-hidden="true"
        >
          {status === 'passed' && <Icon name="check" size="xs" />}
          {status === 'failed' && <Icon name="close" size="xs" />}
          {status === 'pending' && <Icon name="more_horiz" size="xs" />}
        </span>
        <span className={styles.srOnly}>{statusAriaLabel[status]}:</span>
        <span className={styles.label}>{label}</span>
        {meta != null && <span className={styles.meta}>{meta}</span>}
        {clickable && (
          <Icon name="open_in_new" size="sm" className={styles.actionIcon} />
        )}
      </div>
    );
  },
);

ChecklistRow.displayName = 'ChecklistRow';
