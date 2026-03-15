import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './TicketId.module.css';

export type TicketIdProps = HTMLAttributes<HTMLSpanElement>;

export const TicketId = forwardRef<HTMLSpanElement, TicketIdProps>(
  ({ className, children, ...rest }, ref) => {
    const classes = cn(styles.ticketId, className);
    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  },
);

TicketId.displayName = 'TicketId';
