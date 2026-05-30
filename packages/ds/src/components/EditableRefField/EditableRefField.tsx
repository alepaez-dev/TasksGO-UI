import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { cn } from '../../utils/cn';
import type { IconName } from '../../icons';
import styles from './EditableRefField.module.css';

interface EditableRefFieldCommonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onCopy'
> {
  icon: IconName;
  value: string;
  placeholder?: string;
  copied?: boolean;
  copiedLabel?: string;
  onStartEdit: () => void;
  onCopy?: () => void;
  editAriaLabel?: string;
  copyAriaLabel?: string;
  confirmAriaLabel?: string;
  cancelAriaLabel?: string;
}

interface EditableRefFieldEditingExtras {
  draftValue: string;
  onDraftChange: (next: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  inputAriaLabel: string;
}

export type EditableRefFieldProps = EditableRefFieldCommonProps &
  (
    | ({ editing?: false } & {
        [K in keyof EditableRefFieldEditingExtras]?: never;
      })
    | ({ editing: boolean } & EditableRefFieldEditingExtras)
  );

export const EditableRefField = forwardRef<
  HTMLDivElement,
  EditableRefFieldProps
>(
  (
    {
      icon,
      value,
      placeholder = 'Add value',
      editing = false,
      draftValue = '',
      copied = false,
      copiedLabel = 'Copied',
      onStartEdit,
      onDraftChange,
      onConfirm,
      onCancel,
      onCopy,
      editAriaLabel,
      copyAriaLabel = 'Copy',
      inputAriaLabel,
      confirmAriaLabel = 'Confirm',
      cancelAriaLabel = 'Cancel',
      className,
      ...rest
    },
    ref,
  ) => {
    const isEmpty = value === '';
    const confirmDisabled = draftValue.trim() === '';
    const inputRef = useRef<HTMLInputElement>(null);
    const chipRef = useRef<HTMLButtonElement>(null);

    const focusChip = useCallback(() => {
      chipRef.current?.focus();
    }, []);

    useEffect(() => {
      if (!editing) return;
      const input = inputRef.current;
      input?.focus();
      input?.select();
      return focusChip;
    }, [editing, focusChip]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (confirmDisabled) return;
        event.preventDefault();
        onConfirm?.();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel?.();
      }
    };

    return (
      <div ref={ref} className={cn(styles.field, className)} {...rest}>
        {editing ? (
          <>
            <span className={styles.inputWrapper}>
              <Icon name={icon} size="sm" className={styles.inputIcon} />
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                value={draftValue}
                onChange={(event) => onDraftChange?.(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={inputAriaLabel}
              />
            </span>
            <IconButton
              icon="close"
              size="sm"
              onClick={onCancel}
              aria-label={cancelAriaLabel}
            />
            <button
              type="button"
              className={styles.confirmButton}
              onClick={onConfirm}
              disabled={confirmDisabled}
              aria-label={confirmAriaLabel}
            >
              <Icon name="check" size="sm" />
            </button>
          </>
        ) : (
          <>
            {copied && !isEmpty && (
              <span className={styles.copiedToast} aria-hidden="true">
                {copiedLabel}
              </span>
            )}
            <span role="status" className={styles.srOnly}>
              {copied && !isEmpty ? copiedLabel : ''}
            </span>
            <button
              ref={chipRef}
              type="button"
              className={cn(
                styles.chip,
                isEmpty && styles.chipEmpty,
                copied && !isEmpty && styles.chipCopied,
              )}
              onClick={onStartEdit}
              title={isEmpty ? undefined : value}
              aria-label={editAriaLabel}
            >
              <Icon
                name={isEmpty ? 'add' : icon}
                size="sm"
                className={styles.chipIcon}
              />
              <span className={cn(styles.value, isEmpty && styles.placeholder)}>
                {isEmpty ? placeholder : value}
              </span>
            </button>
            {!isEmpty && onCopy && (
              <IconButton
                icon={copied ? 'check' : 'content_copy'}
                size="sm"
                onClick={onCopy}
                aria-label={copyAriaLabel}
              />
            )}
          </>
        )}
      </div>
    );
  },
);

EditableRefField.displayName = 'EditableRefField';
