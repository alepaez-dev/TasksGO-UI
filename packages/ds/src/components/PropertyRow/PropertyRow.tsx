import { forwardRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import type { IconName } from '../../icons';
import styles from './PropertyRow.module.css';

export interface PropertyRowProps extends HTMLAttributes<HTMLDivElement> {
  icon?: IconName;
  label: string;
  onClick?: () => void;
  valueLabel?: string;
}

export const PropertyRow = forwardRef<HTMLDivElement, PropertyRowProps>(
  ({ icon, label, onClick, valueLabel, className, children, ...rest }, ref) => {
    const interactive = onClick !== undefined;
    const Value = interactive ? 'button' : 'div';

    return (
      <div ref={ref} className={cn(styles.row, className)} {...rest}>
        <div className={styles.left}>
          {icon && <Icon name={icon} size="sm" className={styles.icon} />}
          <span className={styles.label}>{label}</span>
        </div>
        <Value
          type={interactive ? 'button' : undefined}
          className={cn(styles.value, interactive && styles.interactive)}
          onClick={onClick}
          aria-label={interactive ? valueLabel : undefined}
        >
          {children}
        </Value>
      </div>
    );
  },
);

PropertyRow.displayName = 'PropertyRow';
