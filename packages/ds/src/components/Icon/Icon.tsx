import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { iconRegistry, type IconName } from '../../icons';
import styles from './Icon.module.css';

type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: IconSize;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, size = 'md', className, ...rest }, ref) => {
    const SvgComponent = iconRegistry[name];
    const classes = cn(styles.icon, styles[size], className);

    return (
      <span ref={ref} className={classes} aria-hidden="true" {...rest}>
        <SvgComponent />
      </span>
    );
  },
);

Icon.displayName = 'Icon';
