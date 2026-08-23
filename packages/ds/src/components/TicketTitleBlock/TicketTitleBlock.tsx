import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Badge, type BadgeProps } from '../Badge';
import { EditableTitle } from '../EditableTitle';
import { cn } from '../../utils/cn';
import styles from './TicketTitleBlock.module.css';

export interface TicketTitleBlockBadge {
  label: string;
  variant?: BadgeProps['variant'];
}

interface TicketTitleBlockBaseProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  badges?: readonly TicketTitleBlockBadge[];
  avatar?: ReactNode;
}

type TicketTitleEditProps =
  | {
      onTitleChange: (value: string) => void;
      onTitleEditingChange: (editing: boolean) => void;
      titleEditing?: boolean;
    }
  | {
      onTitleChange?: undefined;
      onTitleEditingChange?: undefined;
      titleEditing?: undefined;
    };

export type TicketTitleBlockProps = TicketTitleBlockBaseProps &
  TicketTitleEditProps;

export const TicketTitleBlock = forwardRef<
  HTMLDivElement,
  TicketTitleBlockProps
>(
  (
    {
      title,
      badges,
      avatar,
      onTitleChange,
      titleEditing = false,
      onTitleEditingChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const hasMeta = (badges && badges.length > 0) || avatar != null;
    const editable = onTitleChange != null && onTitleEditingChange != null;

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
        {editable ? (
          <EditableTitle
            as="h1"
            fullWidth
            editButton="hover"
            clickToEdit
            titleClassName={styles.title}
            aria-label="Ticket title"
            value={title}
            editing={titleEditing}
            onEditingChange={onTitleEditingChange}
            onChange={onTitleChange}
          />
        ) : (
          <h1 className={styles.title}>{title}</h1>
        )}
      </div>
    );
  },
);

TicketTitleBlock.displayName = 'TicketTitleBlock';
