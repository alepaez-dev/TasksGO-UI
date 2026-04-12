import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './Fab.module.css';

export interface FabProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon?: IconName;
  'aria-label': string;
}

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  ({ icon = 'add', className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.fab, className)}
        {...rest}
      >
        <Icon name={icon} size="md" />
      </button>
    );
  },
);

Fab.displayName = 'Fab';
