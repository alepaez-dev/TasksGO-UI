import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  initial: string;
  'aria-label': string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ initial, className, ...rest }, ref) => {
    const classes = cn(styles.avatar, className);

    return (
      <span ref={ref} role="img" className={classes} {...rest}>
        {initial[0]}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';
