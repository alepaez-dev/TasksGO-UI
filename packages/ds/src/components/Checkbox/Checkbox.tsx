import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './Checkbox.module.css';

type CheckboxVariant = 'default' | 'completed';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  variant?: CheckboxVariant;
  'aria-label': string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ variant = 'default', className, ...rest }, ref) => {
    const classes = cn(styles.checkbox, styles[variant], className);
    return <input ref={ref} type="checkbox" className={classes} {...rest} />;
  },
);

Checkbox.displayName = 'Checkbox';
