import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import styles from './EditToggle.module.css';

export interface EditToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'type'
> {
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  editLabel?: string;
  doneLabel?: string;
  iconOnly?: boolean;
}

export const EditToggle = forwardRef<HTMLButtonElement, EditToggleProps>(
  (
    {
      editing,
      onEditingChange,
      editLabel = 'Edit',
      doneLabel = 'Done',
      iconOnly = false,
      className,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const label = editing ? doneLabel : editLabel;
    return (
      <button
        ref={ref}
        aria-label={iconOnly ? label : undefined}
        {...rest}
        type="button"
        className={cn(
          styles.toggle,
          editing ? styles.done : styles.edit,
          iconOnly && styles.iconOnly,
          className,
        )}
        aria-pressed={editing}
        onClick={(event) => {
          onClick?.(event);
          onEditingChange(!editing);
        }}
      >
        <Icon name={editing ? 'check' : 'edit'} size="xs" />
        {!iconOnly && label}
      </button>
    );
  },
);

EditToggle.displayName = 'EditToggle';
