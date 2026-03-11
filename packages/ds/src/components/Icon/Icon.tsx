import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Icon.module.css';

type IconSize = 'sm' | 'md';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: IconSize;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, size = 'md', className, ...rest }, ref) => {
    const classes = cn(styles.icon, styles[size], className);

    return (
      <span ref={ref} className={classes} aria-hidden="true" {...rest}>
        {name}
      </span>
    );
  },
);

Icon.displayName = 'Icon';
