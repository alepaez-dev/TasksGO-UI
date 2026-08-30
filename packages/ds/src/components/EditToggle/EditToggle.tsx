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
}

export const EditToggle = forwardRef<HTMLButtonElement, EditToggleProps>(
  (
    {
      editing,
      onEditingChange,
      editLabel = 'Edit',
      doneLabel = 'Done',
      className,
      onClick,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      {...rest}
      type="button"
      className={cn(
        styles.toggle,
        editing ? styles.done : styles.edit,
        className,
      )}
      aria-pressed={editing}
      onClick={(event) => {
        onClick?.(event);
        onEditingChange(!editing);
      }}
    >
      <Icon name={editing ? 'check' : 'edit'} size="xs" />
      {editing ? doneLabel : editLabel}
    </button>
  ),
);

EditToggle.displayName = 'EditToggle';
