import { forwardRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../../icons';
import { cn } from '../../utils/cn';
import styles from './RefLabel.module.css';

type RefLabelVariant = 'attachment' | 'doc' | 'general';

export interface RefLabelProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: RefLabelVariant;
  icon?: IconName;
}

export const RefLabel = forwardRef<HTMLSpanElement, RefLabelProps>(
  ({ variant = 'general', icon, className, children, ...rest }, ref) => {
    const classes = cn(styles.refLabel, styles[variant], className);
    return (
      <span ref={ref} className={classes} {...rest}>
        {icon && <Icon name={icon} size="sm" />}
        {children}
      </span>
    );
  },
);

RefLabel.displayName = 'RefLabel';
