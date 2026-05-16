import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Badge, type BadgeProps } from '../Badge';
import { cn } from '../../utils/cn';
import styles from './TicketTitleBlock.module.css';

export interface TicketTitleBlockBadge {
  label: string;
  variant?: BadgeProps['variant'];
}

export interface TicketTitleBlockProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  badges?: readonly TicketTitleBlockBadge[];
  avatar?: ReactNode;
}

export const TicketTitleBlock = forwardRef<
  HTMLDivElement,
  TicketTitleBlockProps
>(({ title, badges, avatar, className, ...rest }, ref) => {
  const hasMeta = (badges && badges.length > 0) || avatar != null;

  return (
    <div ref={ref} className={cn(styles.block, className)} {...rest}>
      {hasMeta && (
        <div className={styles.meta}>
          {badges && badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((badge, i) => (
                <Badge key={i} variant={badge.variant}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
          {avatar}
        </div>
      )}
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
});

TicketTitleBlock.displayName = 'TicketTitleBlock';
