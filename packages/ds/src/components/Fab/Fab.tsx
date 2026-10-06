import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './Fab.module.css';

// An empty `label` renders an unnamed icon-only button; icon-only FABs take `aria-label`.
type FabLabelProps =
  | { label: string; 'aria-label'?: never }
  | { label?: never; 'aria-label': string };

export type FabProps = FabLabelProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
    icon?: IconName;
  };

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  ({ icon = 'add', label, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          styles.fab,
          label ? styles.extended : styles.iconOnly,
          className,
        )}
        {...rest}
      >
        <Icon name={icon} size="md" className={styles.icon} />
        {label ? <span className={styles.label}>{label}</span> : null}
      </button>
    );
  },
);

Fab.displayName = 'Fab';
