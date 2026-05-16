import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import styles from './Card.module.css';

type CardVariant = 'default' | 'subtle';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ header, variant = 'default', children, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.card, styles[variant], className)}
        {...rest}
      >
        {header && <div className={styles.header}>{header}</div>}
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
