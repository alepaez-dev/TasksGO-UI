import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...rest }, ref) => {
    const classes = [styles.button, styles[variant], styles[size], className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
