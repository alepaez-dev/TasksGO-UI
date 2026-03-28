import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './IconButton.module.css';

type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon: IconName;
  'aria-label': string;
  size?: IconButtonSize;
}

const iconSizeMap = {
  sm: 'sm',
  md: 'md',
} as const;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', className, ...rest }, ref) => {
    const classes = cn(styles.iconButton, styles[size], className);

    return (
      <button ref={ref} type="button" className={classes} {...rest}>
        <Icon name={icon} size={iconSizeMap[size]} />
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
