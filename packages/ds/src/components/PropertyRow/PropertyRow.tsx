import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import type { IconName } from '../../icons';
import styles from './PropertyRow.module.css';

export interface PropertyRowProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onClick'
> {
  icon?: IconName;
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  valueLabel?: string;
}

export const PropertyRow = forwardRef<HTMLDivElement, PropertyRowProps>(
  ({ icon, label, onClick, valueLabel, className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn(styles.row, className)} {...rest}>
        <div className={styles.left}>
          {icon && <Icon name={icon} size="sm" className={styles.icon} />}
          <span className={styles.label}>{label}</span>
        </div>
        {onClick ? (
          <button
            type="button"
            className={cn(styles.value, styles.interactive)}
            onClick={onClick}
            aria-label={valueLabel}
          >
            {children}
          </button>
        ) : (
          <div className={styles.value}>{children}</div>
        )}
      </div>
    );
  },
);

PropertyRow.displayName = 'PropertyRow';
