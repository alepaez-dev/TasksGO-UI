import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import styles from './TicketId.module.css';

export interface TicketIdProps extends HTMLAttributes<HTMLSpanElement> {
  ticketId: string;
}

export const TicketId = forwardRef<HTMLSpanElement, TicketIdProps>(
  ({ ticketId, className, ...rest }, ref) => {
    const classes = cn(styles.ticketId, className);
    return (
      <span ref={ref} className={classes} {...rest}>
        {ticketId}
      </span>
    );
  },
);

TicketId.displayName = 'TicketId';
