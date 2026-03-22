import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Avatar.module.css';

type AvatarVariant = 'project' | 'profile';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  initial: string;
  variant?: AvatarVariant;
  'aria-label': string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ initial, variant = 'project', className, ...rest }, ref) => {
    const classes = cn(styles.avatar, styles[variant], className);

    return (
      <span ref={ref} role="img" className={classes} {...rest}>
        {initial}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';
